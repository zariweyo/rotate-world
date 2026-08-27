#!/usr/bin/env ruby

require 'json'
require 'yaml'

ROOT = File.expand_path('..', __dir__)
LEVELS_DIR = File.join(ROOT, 'levels')
SOURCE = File.join(LEVELS_DIR, 'levels.yaml')
OUTPUT = File.join(ROOT, 'levels.generated.js')

data = YAML.load_file(SOURCE)
rooms = data.fetch('rooms')

def load_room_config(room_id, flow_config)
  path = flow_config.fetch('path')
  source = File.join(LEVELS_DIR, path)

  unless File.exist?(source)
    warn "Skipping room #{room_id}: #{path} does not exist yet"
    return nil
  end

  level_data = YAML.load_file(source)
  config = level_data.fetch('config')
  config.merge(
    'id' => room_id,
    'path' => path,
    'next' => flow_config['next'],
    'version' => level_data['version']
  )
end

def validate_map!(room_id, rows)
  raise "Room #{room_id} has no map" if rows.nil? || rows.empty?

  widths = rows.map(&:length).uniq
  raise "Room #{room_id} has inconsistent row widths: #{widths.inspect}" unless widths.length == 1
end

def find_tiles(rows, symbol)
  tiles = []

  rows.each_with_index do |row, y|
    row.chars.each_with_index do |char, x|
      tiles << { 'x' => x, 'y' => y } if char == symbol
    end
  end

  tiles
end

def wall_symbols(legend)
  legend.each_with_object({}) do |(symbol, config), symbols|
    next unless config['type'] == 'wall'

    symbols[symbol] = config['material']
  end
end

def merge_wall_rects(rows, wall_symbols)
  height = rows.length
  width = rows.first.length
  visited = Array.new(height) { Array.new(width, false) }
  rects = []

  rows.each_with_index do |row, y|
    row.chars.each_with_index do |char, x|
      material = wall_symbols[char]
      next unless material
      next if visited[y][x]

      rect_width = 1
      rect_width += 1 while x + rect_width < width &&
                           rows[y][x + rect_width] == char &&
                           !visited[y][x + rect_width]

      rect_height = 1
      loop do
        next_y = y + rect_height
        break if next_y >= height

        can_extend = (0...rect_width).all? do |dx|
          rows[next_y][x + dx] == char && !visited[next_y][x + dx]
        end
        break unless can_extend

        rect_height += 1
      end

      (y...(y + rect_height)).each do |visit_y|
        (x...(x + rect_width)).each do |visit_x|
          visited[visit_y][visit_x] = true
        end
      end

      rects << {
        'type' => 'wall',
        'symbol' => char,
        'material' => material,
        'tileX' => x,
        'tileY' => y,
        'tileWidth' => rect_width,
        'tileHeight' => rect_height
      }
    end
  end

  rects
end

def material_setting(value)
  return value unless value.is_a?(String)
  return value unless value.start_with?('settings.')

  { 'setting' => value.delete_prefix('settings.') }
end

def wall_geometry(rect, tile_width, tile_height, material)
  thickness = material.fetch('thickness')
  x = rect.fetch('tileX') * tile_width
  y = rect.fetch('tileY') * tile_height
  width = rect.fetch('tileWidth') * tile_width
  height = rect.fetch('tileHeight') * tile_height

  if rect.fetch('tileHeight') == 1
    y += (tile_height - thickness) / 2.0
    height = thickness
  elsif rect.fetch('tileWidth') == 1
    x += (tile_width - thickness) / 2.0
    width = thickness
  else
    x += (tile_width - thickness) / 2.0
    y += (tile_height - thickness) / 2.0
    width -= tile_width - thickness
    height -= tile_height - thickness
  end

  {
    'x' => x,
    'y' => y,
    'width' => width,
    'height' => height
  }
end

compiled_rooms = {}
skipped_rooms = []

rooms.each do |room_id, flow_config|
  room = load_room_config(room_id, flow_config)
  unless room
    skipped_rooms << room_id
    next
  end

  rows = room.fetch('map')
  validate_map!(room_id, rows)

  size = room.fetch('size')
  cols = rows.first.length
  rows_count = rows.length
  tile_width = size.to_f / cols
  tile_height = size.to_f / rows_count
  start_tiles = find_tiles(rows, 'S')
  portal_tiles = find_tiles(rows, 'P')
  legend = room.fetch('legend')
  materials = room['materials'] || {}
  walls = wall_symbols(legend)

  raise "Room has exactly one S start tile requirement failed" unless start_tiles.length == 1

  compiled_rooms[room_id] = {
    'id' => room_id,
    'name' => room['name'],
    'path' => room['path'],
    'next' => room['next'],
    'version' => room['version'],
    'size' => size,
    'ball' => room['ball'] || { 'diameter' => 32 },
    'cols' => cols,
    'rows' => rows_count,
    'tileWidth' => tile_width,
    'tileHeight' => tile_height,
    'map' => rows,
    'legend' => legend,
    'materials' => materials,
    'start' => {
      'tileX' => start_tiles.first.fetch('x'),
      'tileY' => start_tiles.first.fetch('y'),
      'x' => (start_tiles.first.fetch('x') + 0.5) * tile_width,
      'y' => (start_tiles.first.fetch('y') + 0.5) * tile_height
    },
    'portals' => portal_tiles.map do |tile|
      portal_config = room.dig('legend', 'P') || {}
      {
        'id' => portal_config['id'],
        'animation' => portal_config['animation'],
        'targetRoom' => portal_config['targetRoom'] || room['next'],
        'radius' => portal_config['radius'] || [tile_width, tile_height].min * 0.8,
        'tileX' => tile.fetch('x'),
        'tileY' => tile.fetch('y'),
        'x' => (tile.fetch('x') + 0.5) * tile_width,
        'y' => (tile.fetch('y') + 0.5) * tile_height
      }
    end,
    'objects' => merge_wall_rects(rows, walls).map do |rect|
      material = materials.fetch(rect.fetch('material'))
      rect.merge(
        wall_geometry(rect, tile_width, tile_height, material)
      ).merge(
        'visual' => material['visual'],
        'thickness' => material['thickness'],
        'friction' => material['friction'],
        'restitution' => material_setting(material['restitution'])
      )
    end
  }
end

compiled = {
  'generatedAt' => Time.now.strftime('%Y-%m-%d %H:%M:%S %Z'),
  'source' => 'levels/levels.yaml',
  'version' => data['version'],
  'flow' => rooms,
  'skippedRooms' => skipped_rooms,
  'rooms' => compiled_rooms
}

File.write(
  OUTPUT,
  "window.RotateWorldLevels = #{JSON.pretty_generate(compiled)};\n"
)

puts "Built #{File.basename(OUTPUT)} from levels/levels.yaml"
