(() => {
  const WORLD_W = 600;
  const WORLD_H = 600;

  const gameEl = document.getElementById('game');
  const worldStack = document.getElementById('worldStack');
  const pixiHost = document.getElementById('pixiLayer');
  const resetBtn = document.getElementById('resetBtn');
  const refreshBtn = document.getElementById('refreshBtn');
  const statusEl = document.getElementById('status');
  const buildCommitEl = document.getElementById('buildCommit');
  const roomAEl = document.getElementById('roomA');
  const { Engine, Bodies, Body, Composite, Events } = Matter;

  const engine = Engine.create();
  engine.positionIterations = 10;
  engine.velocityIterations = 8;
  engine.constraintIterations = 4;
  engine.gravity.x = 0;
  engine.gravity.y = 1;
  engine.gravity.scale = 0.0018;
  const world = engine.world;

  let worldAngle = 0;
  let gestureStartAngle = null;
  let gestureStartWorldAngle = 0;

  const degToRad = d => d * Math.PI / 180;
  const settings = window.RotateWorldSettings || {};
  const buildInfo = window.RotateWorldBuild || {};
  const levels = window.RotateWorldLevels || {};
  const rooms = levels.rooms || {};
  const KEY_ROTATION_STEP = degToRad(settings.keyboardRotationStepDegrees ?? 5);
  const SCREEN_ORIENTATION_LOCK = settings.screenOrientationLock || 'portrait';
  const PORTAL_COOLDOWN_MS = 700;
  const RESPAWN_BLINK_MS = 3000;
  let currentRoomId = 'A';
  let currentRoom = rooms[currentRoomId];
  let ballRadius = (currentRoom?.ball?.diameter ?? 32) / 2;
  let platforms = [];
  let ball;
  let previousBallVelocity = { x: 0, y: 0 };
  let previousBallPosition = null;
  let lastPortalTransitionAt = 0;
  let blinkUntil = 0;
  let orientationLockRequested = false;

  function platformElementId(id) {
    return `platform-${id}`;
  }

  function registerServiceWorker() {
    if (!('serviceWorker' in navigator)) return;

    navigator.serviceWorker.register('./sw.js').catch(error => {
      console.warn('Service worker registration failed:', error);
    });
  }

  function requestPortraitOrientationLock() {
    if (orientationLockRequested) return;
    orientationLockRequested = true;

    if (!screen.orientation?.lock) return;

    screen.orientation.lock(SCREEN_ORIENTATION_LOCK).catch(() => {
      orientationLockRequested = false;
    });
  }

  function renderBuildInfo() {
    if (!buildCommitEl) return;

    const commit = buildInfo.commit && buildInfo.commit !== '__BUILD_COMMIT__'
      ? ` · ${buildInfo.commit}`
      : '';
    buildCommitEl.textContent = `${buildInfo.updatedAt || 'local'}${commit}`;
  }

  function getDisplayMode() {
    if (window.matchMedia('(display-mode: fullscreen)').matches) return 'fullscreen';
    if (window.matchMedia('(display-mode: standalone)').matches) return 'standalone';
    if (window.navigator.standalone) return 'standalone';
    return 'browser';
  }

  async function refreshApp() {
    statusEl.textContent = 'Refreshing app...';

    if ('serviceWorker' in navigator) {
      const registrations = await navigator.serviceWorker.getRegistrations();
      await Promise.all(registrations.map(registration => registration.update()));
    }

    if ('caches' in window) {
      const keys = await caches.keys();
      await Promise.all(keys.map(key => caches.delete(key)));
    }

    const url = new URL(window.location.href);
    url.searchParams.set('refresh', Date.now().toString());
    window.location.replace(url.toString());
  }

  function normalizeAngle(rad) {
    while (rad > Math.PI) rad -= Math.PI * 2;
    while (rad < -Math.PI) rad += Math.PI * 2;
    return rad;
  }

  function angleFromPoint(clientX, clientY) {
    const rect = gameEl.getBoundingClientRect();
    return Math.atan2(
      clientY - (rect.top + rect.height / 2),
      clientX - (rect.left + rect.width / 2)
    );
  }

  function angleFromTouches(touches) {
    if (touches.length === 1) {
      return angleFromPoint(touches[0].clientX, touches[0].clientY);
    }

    if (touches.length < 2) return null;
    return Math.atan2(
      touches[1].clientY - touches[0].clientY,
      touches[1].clientX - touches[0].clientX
    );
  }

  function setWorldAngle(angle) {
    worldAngle = normalizeAngle(angle);
    worldStack.style.transform = `translate(-50%, -50%) rotate(${worldAngle}rad)`;
    engine.gravity.x = Math.sin(worldAngle);
    engine.gravity.y = Math.cos(worldAngle);
  }

  function createSvgElement(name, attributes = {}) {
    const element = document.createElementNS('http://www.w3.org/2000/svg', name);
    Object.entries(attributes).forEach(([key, value]) => {
      element.setAttribute(key, String(value));
    });
    return element;
  }

  function resolveConfigValue(value, fallback) {
    if (value && typeof value === 'object' && value.setting) {
      return settings[value.setting] ?? fallback;
    }

    return value ?? fallback;
  }

  function materialPaint(visual) {
    return visual ? `url(#${visual})` : 'url(#platformGradient)';
  }

  function materialFallbackColor(visual) {
    if (visual === 'platformWarm') return '#f0ad65';
    return '#82cbbf';
  }

  function materialColor(color, visual) {
    if (Array.isArray(color) && color.length === 3) {
      const rgb = color.map(value => clamp(Number(value) || 0, 0, 255));
      return `rgb(${rgb.join(', ')})`;
    }

    return materialFallbackColor(visual);
  }

  function materialFill(color, visual) {
    if (Array.isArray(color) && color.length === 3) {
      return materialColor(color, visual);
    }

    return materialPaint(visual);
  }

  function wedgePoints(object) {
    const x = object.x;
    const y = object.y;
    const w = object.width;
    const h = object.height;
    const rise = clamp((Number(object.slope) || 1) * w, 1, h);
    const highY = y + h - rise;

    if (object.direction === 'left') return [[x, highY], [x, y + h], [x + w, y + h]];
    if (object.direction === 'up') return [[x, y + h], [x + w, y + h], [x + w / 2, highY]];
    if (object.direction === 'down') return [[x, highY], [x + w, highY], [x + w / 2, y + h]];
    return [[x, y + h], [x + w, y + h], [x + w, highY]];
  }

  function wedgePointsAttribute(object) {
    return wedgePoints(object)
      .map(([x, y]) => `${x},${y}`)
      .join(' ');
  }

  function relativeVertices(points, centerX, centerY) {
    return points.map(([x, y]) => ({ x: x - centerX, y: y - centerY }));
  }

  function clearGeneratedRoom() {
    roomAEl.querySelectorAll('.maze-floor, .maze-walls, .portal').forEach(element => {
      element.remove();
    });
  }

  function renderGeneratedRoom(room) {
    if (!room) return;

    clearGeneratedRoom();

    const floorGroup = createSvgElement('g', {
      class: 'maze-floor',
      opacity: 0.14,
      fill: 'none',
      stroke: '#d7f7f1',
      'stroke-width': 2
    });

    room.map.forEach((row, rowIndex) => {
      row.split('').forEach((char, colIndex) => {
        if (char !== '.') return;

        floorGroup.appendChild(createSvgElement('circle', {
          cx: (colIndex + 0.5) * room.tileWidth,
          cy: (rowIndex + 0.5) * room.tileHeight,
          r: Math.min(room.tileWidth, room.tileHeight) * 0.08,
          fill: '#d7f7f1',
          opacity: 0.45
        }));
      });
    });

    const wallsGroup = createSvgElement('g', {
      class: 'maze-walls',
      filter: 'url(#softShadow)'
    });

    if (room.visualShapes?.length) {
      room.visualShapes.forEach(shape => {
        const fill = materialFill(shape.color, shape.visual);
        const solidColor = materialColor(shape.color, shape.visual);

        if (shape.type === 'wallBridge' || shape.type === 'wallStroke') {
          wallsGroup.appendChild(createSvgElement('path', {
            d: shape.path,
            fill: 'none',
            stroke: solidColor,
            'stroke-width': shape.strokeWidth ?? shape.thickness ?? 12,
            'stroke-linecap': shape.type === 'wallStroke' ? 'round' : 'butt',
            'stroke-linejoin': 'miter'
          }));
          wallsGroup.appendChild(createSvgElement('path', {
            d: shape.path,
            fill: 'none',
            stroke: fill,
            'stroke-width': shape.strokeWidth ?? shape.thickness ?? 12,
            'stroke-linecap': shape.type === 'wallStroke' ? 'round' : 'butt',
            'stroke-linejoin': 'miter'
          }));
          return;
        }

        if (shape.type === 'wallCap') {
          wallsGroup.appendChild(createSvgElement('circle', {
            cx: shape.cx,
            cy: shape.cy,
            r: shape.radius,
            fill
          }));
          return;
        }

        if (shape.type === 'wedge') {
          wallsGroup.appendChild(createSvgElement('polygon', {
            id: platformElementId(shape.id),
            points: wedgePointsAttribute(shape),
            fill
          }));
          return;
        }

        wallsGroup.appendChild(createSvgElement('rect', {
          id: platformElementId(shape.id),
          x: shape.x,
          y: shape.y,
          width: shape.width,
          height: shape.height,
          rx: shape.radius ?? Math.min(shape.thickness ?? 14, shape.width, shape.height) / 2,
          fill
        }));
      });
    }

    room.objects
      .filter(object => object.behavior || !room.visualShapes?.length)
      .forEach(object => {
        const fill = materialFill(object.color, object.visual);
        const className = object.behavior?.type === 'timed_break'
          ? 'platform timed-break-platform'
          : 'platform';

        if (object.shape === 'wedge') {
          wallsGroup.appendChild(createSvgElement('polygon', {
            id: platformElementId(object.id),
            class: className,
            points: wedgePointsAttribute(object),
            fill
          }));
          return;
        }

        wallsGroup.appendChild(createSvgElement('rect', {
          id: platformElementId(object.id),
          class: className,
          x: object.x,
          y: object.y,
          width: object.width,
          height: object.height,
          rx: Math.min(object.thickness ?? 14, object.width, object.height) / 2,
          fill
        }));
      });

    roomAEl.appendChild(floorGroup);
    roomAEl.appendChild(wallsGroup);

    room.portals.forEach(portal => {
      const portalGroup = createSvgElement('g', {
        id: portal.id || 'portalA',
        class: 'portal',
        transform: `translate(${portal.x} ${portal.y})`,
        filter: 'url(#portalGlow)'
      });

      const radius = portal.radius ?? 24;
      portalGroup.appendChild(createSvgElement('circle', { class: 'portal-halo', r: radius * 1.55, fill: '#70d6c8', opacity: 0.18 }));
      portalGroup.appendChild(createSvgElement('circle', { class: 'portal-core', r: radius * 1.1, fill: 'url(#portalCore)' }));
      portalGroup.appendChild(createSvgElement('circle', { class: 'portal-ring', r: radius * 1.35, fill: 'none', stroke: 'url(#portalRing)', 'stroke-width': 6 }));
      portalGroup.appendChild(createSvgElement('circle', { class: 'portal-ring portal-ring-fast', r: radius * 0.85, fill: 'none', stroke: '#d9fff8', 'stroke-width': 3, 'stroke-dasharray': '13 10 4 12' }));
      portalGroup.appendChild(createSvgElement('path', { class: 'portal-arc', d: `M ${-radius * 1.25} 0 A ${radius * 1.25} ${radius * 1.25} 0 0 1 0 ${-radius * 1.25} A ${radius * 1.25} ${radius * 1.25} 0 0 1 ${radius * 1.25} 0`, fill: 'none', stroke: '#f9d66b', 'stroke-width': 4, 'stroke-linecap': 'round' }));
      portalGroup.appendChild(createSvgElement('path', { class: 'portal-arc portal-arc-reverse', d: `M ${radius} ${radius * 0.75} A ${radius * 1.2} ${radius * 1.2} 0 0 1 ${-radius * 1.15} ${radius * 0.42}`, fill: 'none', stroke: '#9b7cff', 'stroke-width': 4, 'stroke-linecap': 'round' }));

      roomAEl.appendChild(portalGroup);
    });
  }

  function createStaticRect({ id, shape = 'rect', direction = 'right', slope, materialName, behavior, x, y, width, height, angle = 0, friction, frictionStatic, restitution }) {
    const materialRestitution = resolveConfigValue(restitution, 0);
    const materialFriction = resolveConfigValue(friction, 0.45);
    const options = {
      isStatic: true,
      angle,
      friction: materialFriction,
      frictionStatic: resolveConfigValue(frictionStatic, materialFriction),
      restitution: materialRestitution,
      slop: 0,
      plugin: {
        materialFriction,
        materialRestitution,
        shape,
        materialName,
        behavior,
        breakState: null,
        elementId: id ? platformElementId(id) : null,
        rect: { x, y, width, height }
      }
    };

    if (shape === 'wedge') {
      const centerX = x + width / 2;
      const centerY = y + height / 2;
      const vertices = relativeVertices(
        wedgePoints({ x, y, width, height, direction, slope }),
        centerX,
        centerY
      );
      return Body.create({
        ...options,
        position: { x: centerX, y: centerY },
        vertices
      });
    }

    return Bodies.rectangle(x + width / 2, y + height / 2, width, height, options);
  }

  function clamp(value, min, max) {
    return Math.min(Math.max(value, min), max);
  }

  function distanceToSegment(point, start, end) {
    const segmentX = end.x - start.x;
    const segmentY = end.y - start.y;
    const lengthSquared = segmentX * segmentX + segmentY * segmentY;
    if (lengthSquared <= 0.0001) return Math.hypot(point.x - end.x, point.y - end.y);

    const rawT = ((point.x - start.x) * segmentX + (point.y - start.y) * segmentY) / lengthSquared;
    const t = clamp(rawT, 0, 1);
    const closestX = start.x + segmentX * t;
    const closestY = start.y + segmentY * t;
    return Math.hypot(point.x - closestX, point.y - closestY);
  }

  function materialNormalAtBall(rect) {
    const closestX = clamp(ball.position.x, rect.x, rect.x + rect.width);
    const closestY = clamp(ball.position.y, rect.y, rect.y + rect.height);
    let nx = ball.position.x - closestX;
    let ny = ball.position.y - closestY;
    const length = Math.hypot(nx, ny);

    if (length > 0.0001) {
      return { x: nx / length, y: ny / length };
    }

    nx = ball.position.x - (rect.x + rect.width / 2);
    ny = ball.position.y - (rect.y + rect.height / 2);

    if (Math.abs(nx) > Math.abs(ny)) {
      return { x: Math.sign(nx) || 1, y: 0 };
    }

    return { x: 0, y: Math.sign(ny) || 1 };
  }

  function applyMaterialBounce(materialBody) {
    const restitution = materialBody.plugin?.materialRestitution ?? 0;
    if (materialBody.plugin?.shape !== 'rect') return;

    const rect = materialBody.plugin?.rect;
    if (!rect || restitution <= 0) return;

    const normal = materialNormalAtBall(rect);
    const incoming = previousBallVelocity;
    const normalSpeed = incoming.x * normal.x + incoming.y * normal.y;
    if (normalSpeed >= 0) return;

    Body.setVelocity(ball, {
      x: incoming.x - (1 + restitution) * normalSpeed * normal.x,
      y: incoming.y - (1 + restitution) * normalSpeed * normal.y
    });
  }

  function triggerTimedBreak(materialBody) {
    const behavior = materialBody.plugin?.behavior;
    if (behavior?.type !== 'timed_break') return;
    if (materialBody.plugin.breakState?.broken) return;
    if (!platforms.includes(materialBody)) return;

    if (!materialBody.plugin.breakState) {
      materialBody.plugin.breakState = { touchedAt: performance.now(), broken: false };
    }
  }

  function applyMaterialFriction(materialBody) {
    const friction = materialBody.plugin?.materialFriction;
    if (materialBody.plugin?.shape !== 'rect') return;

    const rect = materialBody.plugin?.rect;
    if (!rect || friction === undefined) return;

    const normal = materialNormalAtBall(rect);
    const tangent = { x: -normal.y, y: normal.x };
    const tangentSpeed = ball.velocity.x * tangent.x + ball.velocity.y * tangent.y;
    const damping = clamp(friction, 0, 1) * 0.18;

    Body.setVelocity(ball, {
      x: ball.velocity.x - tangentSpeed * damping * tangent.x,
      y: ball.velocity.y - tangentSpeed * damping * tangent.y
    });

    Body.setAngularVelocity(ball, ball.angularVelocity * (1 - damping * 0.55));
  }

  Events.on(engine, 'collisionStart', event => {
    event.pairs.forEach(pair => {
      if (pair.bodyA === ball) {
        triggerTimedBreak(pair.bodyB);
        applyMaterialBounce(pair.bodyB);
      }
      if (pair.bodyB === ball) {
        triggerTimedBreak(pair.bodyA);
        applyMaterialBounce(pair.bodyA);
      }
    });
  });

  Events.on(engine, 'collisionActive', event => {
    event.pairs.forEach(pair => {
      if (pair.bodyA === ball) {
        triggerTimedBreak(pair.bodyB);
        applyMaterialFriction(pair.bodyB);
      }
      if (pair.bodyB === ball) {
        triggerTimedBreak(pair.bodyA);
        applyMaterialFriction(pair.bodyA);
      }
    });
  });

  function createBall(x, y, radius) {
    return Bodies.circle(x, y, radius, {
      restitution: 0,
      friction: 0,
      frictionStatic: 0,
      frictionAir: 0.002,
      density: 0.0024,
      slop: 0.01
    });
  }

  const pixiApp = new PIXI.Application();
  let ballGraphic;
  let glowGraphic;

  async function initPixi() {
    await pixiApp.init({
      width: WORLD_W,
      height: WORLD_H,
      backgroundAlpha: 0,
      antialias: true,
      autoDensity: false,
      resolution: 1
    });

    pixiHost.appendChild(pixiApp.canvas);
    pixiApp.canvas.width = WORLD_W;
    pixiApp.canvas.height = WORLD_H;
  }

  function renderBallGraphics() {
    if (!pixiApp.stage) return;

    pixiApp.stage.removeChildren();

    glowGraphic = new PIXI.Graphics()
      .circle(0, 0, ballRadius * 1.9)
      .fill({ color: 0x8fe7dd, alpha: 0.14 });

    ballGraphic = new PIXI.Graphics()
      .circle(0, 0, ballRadius)
      .fill(0xf7fbff)
      .stroke({ width: 3, color: 0x9fd3c7, alpha: 1 });

    const shine = new PIXI.Graphics()
      .circle(-5, -6, 4)
      .fill({ color: 0xffffff, alpha: 0.92 });

    ballGraphic.addChild(shine);
    pixiApp.stage.addChild(glowGraphic, ballGraphic);
  }

  function updateBallGraphics() {
    if (!ballGraphic || !ball) return;
    ballGraphic.position.set(ball.position.x, ball.position.y);
    glowGraphic.position.set(ball.position.x, ball.position.y);
    ballGraphic.rotation = ball.angle;

    const now = performance.now();
    const isBlinking = now < blinkUntil;
    const alpha = isBlinking && Math.floor(now / 150) % 2 === 0 ? 0.22 : 1;
    ballGraphic.alpha = alpha;
    glowGraphic.alpha = isBlinking ? alpha * 0.7 : 1;
  }

  function respawnBall({ resetAngle = false, blink = true } = {}) {
    Body.setPosition(ball, currentRoom.start);
    Body.setVelocity(ball, { x: 0, y: 0 });
    Body.setAngularVelocity(ball, 0);
    Body.setAngle(ball, 0);
    if (resetAngle) setWorldAngle(0);
    blinkUntil = blink ? performance.now() + RESPAWN_BLINK_MS : 0;
  }

  function resetCurrentRoom({ resetAngle = false, blink = true } = {}) {
    if (ball) Composite.remove(world, ball);
    platforms.forEach(body => Composite.remove(world, body));

    platforms = currentRoom.objects.map(createStaticRect);
    ball = createBall(currentRoom.start.x, currentRoom.start.y, ballRadius);
    previousBallVelocity = { x: 0, y: 0 };
    previousBallPosition = { x: ball.position.x, y: ball.position.y };

    renderGeneratedRoom(currentRoom);
    if (ballGraphic) renderBallGraphics();
    Composite.add(world, [...platforms, ball]);
    if (resetAngle) setWorldAngle(0);
    blinkUntil = blink ? performance.now() + RESPAWN_BLINK_MS : 0;
    lastPortalTransitionAt = performance.now();
  }

  function resetBall() {
    resetCurrentRoom({ resetAngle: true, blink: false });
    statusEl.textContent = `${currentRoom.name}: reach the portal. Mode: ${getDisplayMode()}.`;
  }

  function setLevelLabel() {
    const levelLabel = document.getElementById('levelLabel');
    if (levelLabel) levelLabel.textContent = `ROOM ${currentRoomId}`;
  }

  function loadRoom(roomId, options = {}) {
    const nextRoom = rooms[roomId];
    if (!nextRoom) return false;

    if (ball) Composite.remove(world, ball);
    platforms.forEach(body => Composite.remove(world, body));

    currentRoomId = roomId;
    currentRoom = nextRoom;
    ballRadius = (currentRoom.ball?.diameter ?? 32) / 2;

    resetCurrentRoom({ resetAngle: false, blink: false });
    setLevelLabel();
    setWorldAngle(0);
    statusEl.textContent = `${currentRoom.name}: reach the portal.`;

    return true;
  }

  function updateTimedBreakables(now) {
    platforms.slice().forEach(platform => {
      const behavior = platform.plugin?.behavior;
      const breakState = platform.plugin?.breakState;
      if (behavior?.type !== 'timed_break' || !breakState || breakState.broken) return;

      const elapsed = now - breakState.touchedAt;
      const breakAfter = resolveConfigValue(behavior.break_after_ms, 1200);
      const blinkAfter = resolveConfigValue(behavior.blink_after_ms, 300);
      const element = platform.plugin.elementId
        ? document.getElementById(platform.plugin.elementId)
        : null;

      if (elapsed >= breakAfter) {
        breakState.broken = true;
        if (element) {
          element.classList.add('is-broken');
          element.style.opacity = '0';
        }
        Composite.remove(world, platform);
        platforms = platforms.filter(body => body !== platform);
        return;
      }

      if (element && elapsed >= blinkAfter) {
        const blinkStep = Math.floor((elapsed - blinkAfter) / 90);
        element.classList.add('is-breaking');
        element.style.opacity = blinkStep % 2 === 0 ? '0.28' : '1';
      }
    });
  }

  function checkFallOut() {
    if (!ball) return;

    const outsideWorld = ball.position.x < -ballRadius ||
      ball.position.x > WORLD_W + ballRadius ||
      ball.position.y < -ballRadius ||
      ball.position.y > WORLD_H + ballRadius;

    if (!outsideWorld) return;

    resetCurrentRoom({ resetAngle: false, blink: true });
    statusEl.textContent = `${currentRoom.name}: lost ball. Back to start.`;
  }

  function checkPortalTransitions(now) {
    if (!currentRoom?.portals || now - lastPortalTransitionAt < PORTAL_COOLDOWN_MS) return false;
    if (!ball) return false;

    const currentBallPosition = { x: ball.position.x, y: ball.position.y };
    const startPosition = previousBallPosition || currentBallPosition;

    const portal = currentRoom.portals.find(candidate => {
      if (!candidate.targetRoom) return false;
      const portalRadius = (candidate.radius ?? 24) + ballRadius;
      return distanceToSegment(
        { x: candidate.x, y: candidate.y },
        startPosition,
        currentBallPosition
      ) <= portalRadius;
    });

    if (!portal) return false;

    if (!loadRoom(portal.targetRoom)) {
      statusEl.textContent = `Portal target ${portal.targetRoom} is not available yet.`;
      lastPortalTransitionAt = now;
    }

    return true;
  }

  gameEl.addEventListener('touchstart', event => {
    requestPortraitOrientationLock();

    if (event.touches.length === 1 || event.touches.length === 2) {
      event.preventDefault();
      gestureStartAngle = angleFromTouches(event.touches);
      gestureStartWorldAngle = worldAngle;
    }
  }, { passive: false });

  gameEl.addEventListener('touchmove', event => {
    if ((event.touches.length === 1 || event.touches.length === 2) && gestureStartAngle !== null) {
      event.preventDefault();
      const current = angleFromTouches(event.touches);
      if (current !== null) {
        setWorldAngle(gestureStartWorldAngle + normalizeAngle(current - gestureStartAngle));
      }
    }
  }, { passive: false });

  gameEl.addEventListener('touchend', event => {
    if (event.touches.length === 0) {
      gestureStartAngle = null;
      gestureStartWorldAngle = worldAngle;
    }
  });

  gameEl.addEventListener('touchcancel', () => {
    gestureStartAngle = null;
    gestureStartWorldAngle = worldAngle;
  });

  resetBtn.addEventListener('click', () => {
    requestPortraitOrientationLock();
    resetBall();
  });

  refreshBtn.addEventListener('click', () => {
    refreshApp().catch(error => {
      console.error(error);
      window.location.reload();
    });
  });

  window.addEventListener('keydown', event => {
    if (event.defaultPrevented) return;

    if (event.key === 'ArrowLeft') {
      event.preventDefault();
      requestPortraitOrientationLock();
      setWorldAngle(worldAngle - KEY_ROTATION_STEP);
    }

    if (event.key === 'ArrowRight') {
      event.preventDefault();
      requestPortraitOrientationLock();
      setWorldAngle(worldAngle + KEY_ROTATION_STEP);
    }
  });

  let previous = performance.now();
  function frame(now) {
    const delta = Math.min(Math.max(now - previous, 8), 24);
    previous = now;
    if (ball) previousBallPosition = { x: ball.position.x, y: ball.position.y };
    if (ball) previousBallVelocity = { x: ball.velocity.x, y: ball.velocity.y };
    Engine.update(engine, delta / 2);
    if (ball) previousBallVelocity = { x: ball.velocity.x, y: ball.velocity.y };
    Engine.update(engine, delta / 2);
    updateTimedBreakables(now);
    if (!checkPortalTransitions(now)) checkFallOut();
    updateBallGraphics();
    requestAnimationFrame(frame);
  }

  renderBuildInfo();
  registerServiceWorker();

  initPixi().then(() => {
    loadRoom('A');
    renderBallGraphics();
    updateBallGraphics();
    requestAnimationFrame(frame);
  }).catch(error => {
    console.error(error);
    statusEl.textContent = 'Pixi could not be initialized.';
  });
})();
