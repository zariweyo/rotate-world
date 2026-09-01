#!/usr/bin/env ruby

require 'json'
require 'yaml'

ROOT = File.expand_path('..', __dir__)
LEVELS_DIR = File.join(ROOT, 'levels')
SOURCE = File.join(LEVELS_DIR, 'levels.yaml')
MATERIALS_SOURCE = File.join(LEVELS_DIR, 'material.yaml')
OUTPUT = File.join(ROOT, 'levels.generated.js')

data = YAML.load_file(SOURCE)
rooms = data.fetch('rooms')
global_materials = File.exist?(MATERIALS_SOURCE) ? YAML.load_file(MATERIALS_SOURCE).fetch('materials') : {}

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
    'fallbackNext' => flow_config['next'],
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

def portal_symbols(legend)
  legend.each_with_object({}) do |(symbol, config), symbols|
    next unless config['type'] == 'portal'

    symbols[symbol] = config
  end
end

def material_shape(material)
  material['shape'] || 'rect'
end

def merge_wall_rects(rows, wall_symbols, materials, exclude_boundary: false)
  height = rows.length
  width = rows.first.length
  visited = Array.new(height) { Array.new(width, false) }
  rects = []

  wall_at = lambda do |x, y|
    return nil if exclude_boundary && (x.zero? || y.zero? || x == width - 1 || y == height - 1)

    wall_symbols[rows[y][x]]
  end

  rows.each_with_index do |row, y|
    row.chars.each_with_index do |char, x|
      material = wall_at.call(x, y)
      next unless material
      next if visited[y][x]

      shape = material_shape(materials.fetch(material))
      rect_width = 1
      if shape == 'rect'
        rect_width += 1 while x + rect_width < width &&
                             wall_at.call(x + rect_width, y) == material &&
                             !visited[y][x + rect_width]
      end

      rect_height = 1
      if shape == 'rect'
        loop do
          next_y = y + rect_height
          break if next_y >= height

          can_extend = (0...rect_width).all? do |dx|
            wall_at.call(x + dx, next_y) == material && !visited[next_y][x + dx]
          end
          break unless can_extend

          rect_height += 1
        end
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

def build_boundary_walls(rows, wall_symbols, materials, room_id, size, tile_width, tile_height)
  height = rows.length
  width = rows.first.length
  perimeter = size * 4.0
  edges = []

  width.times do |x|
    edges << [x * tile_width, (x + 1) * tile_width, wall_symbols[rows[0][x]]]
  end
  height.times do |y|
    edges << [size + y * tile_height, size + (y + 1) * tile_height, wall_symbols[rows[y][width - 1]]]
  end
  width.times do |offset|
    x = width - 1 - offset
    edges << [size * 2 + offset * tile_width, size * 2 + (offset + 1) * tile_width, wall_symbols[rows[height - 1][x]]]
  end
  height.times do |offset|
    y = height - 1 - offset
    edges << [size * 3 + offset * tile_height, size * 3 + (offset + 1) * tile_height, wall_symbols[rows[y][0]]]
  end

  runs = []
  edges.each do |start_distance, end_distance, material_name|
    next if material_name.nil?

    current = runs.last
    if current && current.fetch('material') == material_name &&
       (current.fetch('endDistance') - start_distance).abs < 0.001
      current['endDistance'] = end_distance
    else
      runs << {
        'material' => material_name,
        'startDistance' => start_distance,
        'endDistance' => end_distance
      }
    end
  end

  if runs.length > 1 && runs.first.fetch('startDistance').zero? &&
     (runs.last.fetch('endDistance') - perimeter).abs < 0.001 &&
     runs.first.fetch('material') == runs.last.fetch('material')
    runs.last['endDistance'] = runs.first.fetch('endDistance') + perimeter
    runs.shift
  end

  runs.each_with_index.map do |run, index|
    material_name = run.fetch('material')
    material = materials.fetch(material_name)
    {
      'type' => 'wall',
      'id' => "#{room_id}-#{material_name}-boundary-#{index + 1}",
      'shape' => 'boundaryArc',
      'perimeterStart' => run.fetch('startDistance') / perimeter,
      'perimeterEnd' => run.fetch('endDistance') / perimeter,
      'visual' => material['visual'],
      'color' => material['color'],
      'materialName' => material_name,
      'thickness' => material.fetch('thickness'),
      'friction' => material['friction'],
      'frictionStatic' => material['frictionStatic'] || material['friction'],
      'restitution' => material_setting(material['restitution']),
      'behavior' => material['behavior']
    }
  end
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

def wedge_geometry(rect, rows, wall_symbols, materials, tile_width, tile_height)
  x = rect.fetch('tileX') * tile_width
  y = rect.fetch('tileY') * tile_height
  width = rect.fetch('tileWidth') * tile_width
  height = rect.fetch('tileHeight') * tile_height
  below_y = rect.fetch('tileY') + rect.fetch('tileHeight')

  if below_y < rows.length
    below_material_name = wall_symbols[rows[below_y][rect.fetch('tileX')]]
    if below_material_name
      below_material = materials.fetch(below_material_name)
      below_thickness = below_material.fetch('thickness')
      surface_y = below_y * tile_height + (tile_height - below_thickness) / 2.0
      height = [surface_y - y, height].max
    end
  end

  {
    'x' => x,
    'y' => y,
    'width' => width,
    'height' => height
  }
end

def object_geometry(rect, tile_width, tile_height, material, rows = nil, wall_symbols = nil, materials = nil)
  if material_shape(material) == 'wedge'
    return wedge_geometry(rect, rows, wall_symbols, materials, tile_width, tile_height)
  end

  wall_geometry(rect, tile_width, tile_height, material)
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
  legend = room.fetch('legend')
  materials = global_materials.merge(room['materials'] || {})
  walls = wall_symbols(legend)
  portals = portal_symbols(legend)

  raise "Room has exactly one S start tile requirement failed" unless start_tiles.length == 1

  wall_rects = merge_wall_rects(rows, walls, materials, exclude_boundary: true)
  boundary_walls = build_boundary_walls(
    rows,
    walls,
    materials,
    room_id,
    size,
    tile_width,
    tile_height
  )
  compiled_rooms[room_id] = {
    'id' => room_id,
    'name' => room['name'],
    'path' => room['path'],
    'next' => room['fallbackNext'],
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
    'portals' => rows.each_with_index.flat_map do |row, y|
      portal_entries = []

      row.chars.each_with_index do |char, x|
        portal_config = portals[char]
        next unless portal_config

        target_room = portal_config['targetRoom'] ||
                      portal_config['next'] ||
                      room['fallbackNext']

        portal_entries << {
          'id' => portal_config['id'] || "#{room_id}-portal-#{char}-#{x}-#{y}",
          'animation' => portal_config['animation'],
          'targetRoom' => target_room,
          'radius' => portal_config['radius'] || [tile_width, tile_height].min * 0.8,
          'symbol' => char,
          'tileX' => x,
          'tileY' => y,
          'x' => (x + 0.5) * tile_width,
          'y' => (y + 0.5) * tile_height
        }
      end

      portal_entries
    end,
    'objects' => boundary_walls + wall_rects.each_with_index.map do |rect, index|
      material = materials.fetch(rect.fetch('material'))
      rect.merge(
        object_geometry(rect, tile_width, tile_height, material, rows, walls, materials)
      ).merge(
        'id' => "#{room_id}-#{rect.fetch('material')}-wall-#{index + 1}",
        'shape' => material_shape(material),
        'direction' => material['direction'] || 'right',
        'slope' => material['slope'],
        'visual' => material['visual'],
        'color' => material['color'],
        'materialName' => rect.fetch('material'),
        'thickness' => material['thickness'],
        'friction' => material['friction'],
        'frictionStatic' => material['frictionStatic'] || material['friction'],
        'restitution' => material_setting(material['restitution']),
        'behavior' => material['behavior']
      )
    end
  }
end

compiled = {
  'generatedAt' => Time.now.strftime('%Y-%m-%d %H:%M:%S %Z'),
  'source' => 'levels/levels.yaml',
  'materialsSource' => File.exist?(MATERIALS_SOURCE) ? 'levels/material.yaml' : nil,
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
