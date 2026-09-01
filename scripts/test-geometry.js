const assert = require('node:assert/strict');

global.window = {};
require('../levels.generated.js');
const { createProjector } = require('../geometry.js');

const projector = createProjector();
const rooms = window.RotateWorldLevels.rooms;

function boundarySamples(room) {
  const samples = [];
  const width = room.map[0].length;
  const height = room.map.length;

  for (let x = 0; x < width; x += 1) {
    samples.push({ t: (x + 0.5) / width / 4, symbol: room.map[0][x] });
  }
  for (let y = 0; y < height; y += 1) {
    samples.push({ t: 0.25 + (y + 0.5) / height / 4, symbol: room.map[y][width - 1] });
  }
  for (let offset = 0; offset < width; offset += 1) {
    const x = width - 1 - offset;
    samples.push({ t: 0.5 + (offset + 0.5) / width / 4, symbol: room.map[height - 1][x] });
  }
  for (let offset = 0; offset < height; offset += 1) {
    const y = height - 1 - offset;
    samples.push({ t: 0.75 + (offset + 0.5) / height / 4, symbol: room.map[y][0] });
  }

  return samples;
}

let objectCount = 0;
let partCount = 0;

Object.values(rooms).forEach(room => {
  assert.ok(!Object.hasOwn(room, 'visualShapes'), `${room.id} contains duplicate visual geometry`);
  const boundaryArcs = room.objects.filter(object => object.shape === 'boundaryArc');

  boundarySamples(room).forEach(({ t, symbol }) => {
    const legendEntry = room.legend[symbol];
    const expectedMaterial = legendEntry?.type === 'wall' ? legendEntry.material : null;
    const arc = boundaryArcs.find(candidate =>
      (t >= candidate.perimeterStart && t < candidate.perimeterEnd) ||
      (t + 1 >= candidate.perimeterStart && t + 1 < candidate.perimeterEnd)
    );
    assert.equal(arc?.materialName ?? null, expectedMaterial, `${room.id} boundary differs at ${t}`);
  });

  room.objects.forEach(object => {
    const geometry = projector.objectGeometry(object);
    objectCount += 1;
    partCount += geometry.convexParts.length;

    assert.ok(geometry.outline.length >= 3, `${object.id} has no outline`);
    assert.ok(geometry.convexParts.length >= 1, `${object.id} has no collider parts`);

    [...geometry.outline, ...geometry.convexParts.flat()].forEach(point => {
      assert.ok(Number.isFinite(point.x) && Number.isFinite(point.y), `${object.id} has invalid coordinates`);
    });

    const outlineArea = Math.abs(projector.polygonArea(geometry.outline));
    assert.ok(projector.polygonArea(geometry.outline) > 0, `${object.id} outline winding is invalid`);
    geometry.convexParts.forEach(part => {
      assert.ok(projector.polygonArea(part) > 0, `${object.id} collider winding is invalid`);
    });
    const partsArea = geometry.convexParts.reduce(
      (sum, part) => sum + Math.abs(projector.polygonArea(part)),
      0
    );
    const tolerance = Math.max(0.01, outlineArea * 0.000001);
    assert.ok(
      Math.abs(outlineArea - partsArea) <= tolerance,
      `${object.id} visual/collider area differs: ${outlineArea} vs ${partsArea}`
    );
  });
});

console.log(`Geometry OK: ${objectCount} objects, ${partCount} convex collider parts.`);
