(function exposeGeometry(root, factory) {
  const geometry = factory();

  if (typeof module === 'object' && module.exports) module.exports = geometry;
  if (root) root.RotateWorldGeometry = geometry;
})(typeof window !== 'undefined' ? window : globalThis, () => {
  const EPSILON = 0.0001;

  function clamp(value, min, max) {
    return Math.min(Math.max(value, min), max);
  }

  function createProjector({
    worldWidth = 600,
    worldHeight = 600,
    contentRadius = 300,
    verticalScale = 0.9,
    sampleLength = 18
  } = {}) {
    const centerX = worldWidth / 2;
    const centerY = worldHeight / 2;

    function projectPoint(point) {
      const sourceY = clamp(point.y, 0, worldHeight);
      const y = centerY + (sourceY - centerY) * verticalScale;
      const distanceFromCenter = y - centerY;
      const halfChord = Math.sqrt(Math.max(0, contentRadius ** 2 - distanceFromCenter ** 2));
      const normalizedX = (point.x - centerX) / centerX;

      return {
        x: centerX + normalizedX * halfChord,
        y
      };
    }

    function projectRadius(radius, sourceY) {
      const center = projectPoint({ x: centerX, y: sourceY });
      const horizontal = projectPoint({ x: centerX + radius, y: sourceY });
      const horizontalScale = Math.abs(horizontal.x - center.x) / radius;
      return radius * (horizontalScale + verticalScale) / 2;
    }

    function horizontalScale(sourceY) {
      const center = projectPoint({ x: centerX, y: sourceY });
      const edge = projectPoint({ x: centerX + 1, y: sourceY });
      return Math.abs(edge.x - center.x);
    }

    function sampleEdge(start, end, includeStart = true) {
      const distance = Math.hypot(end.x - start.x, end.y - start.y);
      const steps = Math.max(1, Math.ceil(distance / sampleLength));
      const points = [];

      for (let index = includeStart ? 0 : 1; index <= steps; index += 1) {
        const t = index / steps;
        points.push({
          x: start.x + (end.x - start.x) * t,
          y: start.y + (end.y - start.y) * t
        });
      }

      return points;
    }

    function wedgeSourcePoints(object) {
      const { x, y, width, height } = object;
      const rise = clamp((Number(object.slope) || 1) * width, 1, height);
      const highY = y + height - rise;

      if (object.direction === 'left') {
        return [{ x, y: highY }, { x, y: y + height }, { x: x + width, y: y + height }];
      }
      if (object.direction === 'up') {
        return [{ x, y: y + height }, { x: x + width, y: y + height }, { x: x + width / 2, y: highY }];
      }
      if (object.direction === 'down') {
        return [{ x, y: highY }, { x: x + width, y: highY }, { x: x + width / 2, y: y + height }];
      }
      return [{ x, y: y + height }, { x: x + width, y: y + height }, { x: x + width, y: highY }];
    }

    function rectangleSourcePoints(object) {
      const { x, y, width, height } = object;
      return [
        { x, y },
        { x: x + width, y },
        { x: x + width, y: y + height },
        { x, y: y + height }
      ];
    }

    function projectedOutline(sourcePoints) {
      const outline = [];

      sourcePoints.forEach((point, index) => {
        const next = sourcePoints[(index + 1) % sourcePoints.length];
        outline.push(...sampleEdge(point, next, index === 0).map(projectPoint));
      });

      const first = outline[0];
      const last = outline[outline.length - 1];
      if (first && last && Math.hypot(first.x - last.x, first.y - last.y) < EPSILON) {
        outline.pop();
      }

      return outline;
    }

    function rectangleParts(object) {
      const steps = Math.max(1, Math.ceil(object.height / sampleLength));
      const parts = [];

      for (let index = 0; index < steps; index += 1) {
        const top = object.y + object.height * index / steps;
        const bottom = object.y + object.height * (index + 1) / steps;
        parts.push([
          projectPoint({ x: object.x, y: top }),
          projectPoint({ x: object.x + object.width, y: top }),
          projectPoint({ x: object.x + object.width, y: bottom }),
          projectPoint({ x: object.x, y: bottom })
        ]);
      }

      return parts;
    }

    function polygonArea(points) {
      return points.reduce((area, point, index) => {
        const next = points[(index + 1) % points.length];
        return area + point.x * next.y - next.x * point.y;
      }, 0) / 2;
    }

    function polygonCentroid(points) {
      let crossSum = 0;
      let xSum = 0;
      let ySum = 0;

      points.forEach((point, index) => {
        const next = points[(index + 1) % points.length];
        const cross = point.x * next.y - next.x * point.y;
        crossSum += cross;
        xSum += (point.x + next.x) * cross;
        ySum += (point.y + next.y) * cross;
      });

      if (Math.abs(crossSum) < EPSILON) {
        return points.reduce((center, point) => ({
          x: center.x + point.x / points.length,
          y: center.y + point.y / points.length
        }), { x: 0, y: 0 });
      }

      return {
        x: xSum / (3 * crossSum),
        y: ySum / (3 * crossSum)
      };
    }

    function triangleFan(outline) {
      const center = outline.reduce((sum, point) => ({
        x: sum.x + point.x / outline.length,
        y: sum.y + point.y / outline.length
      }), { x: 0, y: 0 });

      return outline.map((point, index) => [
        center,
        point,
        outline[(index + 1) % outline.length]
      ]).filter(points => Math.abs(polygonArea(points)) > EPSILON);
    }

    function boundaryArcGeometry(object) {
      const startAngle = -Math.PI * 3 / 4 + object.perimeterStart * Math.PI * 2;
      const endAngle = -Math.PI * 3 / 4 + object.perimeterEnd * Math.PI * 2;
      const outerRadius = contentRadius;
      const innerRadius = contentRadius - object.thickness;
      const steps = Math.max(1, Math.ceil((endAngle - startAngle) * outerRadius / sampleLength));
      const outer = [];
      const inner = [];

      for (let index = 0; index <= steps; index += 1) {
        const angle = startAngle + (endAngle - startAngle) * index / steps;
        outer.push({
          x: centerX + Math.cos(angle) * outerRadius,
          y: centerY + Math.sin(angle) * outerRadius
        });
        inner.push({
          x: centerX + Math.cos(angle) * innerRadius,
          y: centerY + Math.sin(angle) * innerRadius
        });
      }

      const outline = [...outer, ...inner.slice().reverse()];
      const convexParts = Array.from({ length: steps }, (_, index) => [
        outer[index],
        outer[index + 1],
        inner[index + 1],
        inner[index]
      ]);

      return { outline, convexParts };
    }

    function objectGeometry(object) {
      if (object.shape === 'boundaryArc') {
        const geometry = boundaryArcGeometry(object);
        return { id: object.id, object, ...geometry };
      }

      const isWedge = object.shape === 'wedge' || object.type === 'wedge';
      const sourcePoints = isWedge ? wedgeSourcePoints(object) : rectangleSourcePoints(object);
      const outline = projectedOutline(sourcePoints);
      if (polygonArea(outline) < 0) outline.reverse();

      return {
        id: object.id,
        object,
        outline,
        convexParts: isWedge ? triangleFan(outline) : rectangleParts(object)
      };
    }

    return {
      projectPoint,
      projectRadius,
      horizontalScale,
      objectGeometry,
      polygonArea,
      polygonCentroid
    };
  }

  return { createProjector };
});
