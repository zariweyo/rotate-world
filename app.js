(() => {
  const WORLD_W = 600;
  const WORLD_H = 600;

  const gameEl = document.getElementById('game');
  const gearTrain = document.getElementById('gearTrain');
  const worldGear = document.getElementById('worldGear');
  const controlGear = document.getElementById('controlGear');
  const worldGearShape = document.getElementById('worldGearShape');
  const controlGearShape = document.getElementById('controlGearShape');
  const pixiHost = document.getElementById('pixiLayer');
  const resetBtn = document.getElementById('resetBtn');
  const refreshBtn = document.getElementById('refreshBtn');
  const statusEl = document.getElementById('status');
  const buildCommitEl = document.getElementById('buildCommit');
  const roomAEl = document.getElementById('roomA');
  const { Engine, Bodies, Body, Composite, Events } = Matter;

  const engine = Engine.create();
  engine.positionIterations = 10;
  engine.velocityIterations = 10;
  engine.constraintIterations = 4;
  engine.gravity.x = 0;
  engine.gravity.y = 1;
  engine.gravity.scale = 0.0018;
  const world = engine.world;

  let worldAngle = 0;
  let gestureStartAngle = null;
  let gestureStartWorldAngle = 0;
  let activePointerId = null;

  const degToRad = d => d * Math.PI / 180;
  const settings = window.RotateWorldSettings || {};
  const buildInfo = window.RotateWorldBuild || {};
  const levels = window.RotateWorldLevels || {};
  const rooms = levels.rooms || {};
  const KEY_ROTATION_STEP = degToRad(settings.keyboardRotationStepDegrees ?? 5);
  const SCREEN_ORIENTATION_LOCK = settings.screenOrientationLock || 'portrait';
  const PORTAL_COOLDOWN_MS = 700;
  const RESPAWN_BLINK_MS = 3000;
  const WORLD_RADIUS = 300;
  // Interior content and JSON-defined boundary walls share the same circular edge.
  const CONTENT_RADIUS = WORLD_RADIUS;
  const CONTENT_VERTICAL_SCALE = 0.9;
  const WARP_SAMPLE_LENGTH = 18;
  const PHYSICS_SUBSTEPS = 4;
  const MAX_BALL_SPEED = 8;
  const GEAR_TEETH = 28;
  const GEAR_MESH_OFFSET = Math.PI / GEAR_TEETH;
  const GEAR_TRAIN_RATIO = 1.951;
  const geometryProjector = RotateWorldGeometry.createProjector({
    worldWidth: WORLD_W,
    worldHeight: WORLD_H,
    contentRadius: CONTENT_RADIUS,
    verticalScale: CONTENT_VERTICAL_SCALE,
    sampleLength: WARP_SAMPLE_LENGTH
  });
  const {
    projectPoint: warpPoint,
    horizontalScale: warpHorizontalScale
  } = geometryProjector;
  let currentRoomId = 'A';
  let currentRoom = rooms[currentRoomId];
  let ballRadius = (currentRoom?.ball?.diameter ?? 32) / 2;
  let roomGeometry = [];
  let platforms = [];
  let ball;
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

  function angleFromControlPoint(clientX, clientY) {
    const rect = controlGear.getBoundingClientRect();
    return Math.atan2(
      clientY - (rect.top + rect.height / 2),
      clientX - (rect.left + rect.width / 2)
    );
  }

  function layoutGearTrain() {
    const gameRect = gameEl.getBoundingClientRect();
    const viewportWidth = document.documentElement.clientWidth;
    const horizontalPadding = 24;
    const gearSize = Math.max(0, Math.min(
      viewportWidth - horizontalPadding,
      gameRect.height / GEAR_TRAIN_RATIO
    ));

    gearTrain.style.left = `${viewportWidth / 2 - gameRect.left}px`;
    gearTrain.style.width = `${gearSize}px`;
  }

  function createGearPath(teeth = GEAR_TEETH, outerRadius = 294, rootRadius = 270) {
    const points = [];
    const steps = teeth * 4;
    const halfStep = Math.PI / steps;

    for (let index = 0; index < steps; index += 1) {
      const phase = index % 4;
      const radius = phase === 1 || phase === 2 ? outerRadius : rootRadius;
      const angle = -Math.PI / 2 + halfStep + index * Math.PI * 2 / steps;
      points.push(`${300 + Math.cos(angle) * radius},${300 + Math.sin(angle) * radius}`);
    }

    return `M ${points.join(' L ')} Z`;
  }

  function setWorldAngle(angle) {
    worldAngle = normalizeAngle(angle);
    worldGear.style.transform = `rotate(${worldAngle}rad)`;
    controlGear.style.transform = `rotate(${GEAR_MESH_OFFSET - worldAngle}rad)`;
    controlGear.setAttribute('aria-valuenow', String(Math.round(worldAngle * 180 / Math.PI)));
    engine.gravity.x = Math.sin(worldAngle);
    engine.gravity.y = Math.cos(worldAngle);
  }

  function pointInsideWorld(point, inset = 0) {
    return Math.hypot(point.x - WORLD_W / 2, point.y - WORLD_H / 2) <= WORLD_RADIUS - inset;
  }

  function fitPointInsideWorld(point, inset = 0) {
    if (pointInsideWorld(point, inset)) return { x: point.x, y: point.y };

    const dx = point.x - WORLD_W / 2;
    const dy = point.y - WORLD_H / 2;
    const length = Math.hypot(dx, dy) || 1;
    const radius = WORLD_RADIUS - inset;
    return {
      x: WORLD_W / 2 + dx / length * radius,
      y: WORLD_H / 2 + dy / length * radius
    };
  }

  function pointsAttribute(points) {
    return points.map(point => `${point.x},${point.y}`).join(' ');
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

  function clearGeneratedRoom() {
    roomAEl.querySelectorAll('.maze-floor, .maze-walls, .portal').forEach(element => {
      element.remove();
    });
  }

  function renderGeneratedRoom(room, geometries) {
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

        const floorPoint = warpPoint({
            x: (colIndex + 0.5) * room.tileWidth,
            y: (rowIndex + 0.5) * room.tileHeight
          });
        floorGroup.appendChild(createSvgElement('circle', {
          cx: floorPoint.x,
          cy: floorPoint.y,
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

    geometries.forEach(({ object, outline }) => {
      const fill = materialFill(object.color, object.visual);
      const className = object.behavior?.type === 'timed_break'
        ? 'platform timed-break-platform'
        : 'platform';

      wallsGroup.appendChild(createSvgElement('polygon', {
        id: platformElementId(object.id),
        class: className,
        points: pointsAttribute(outline),
        fill
      }));
    });

    roomAEl.appendChild(floorGroup);
    roomAEl.appendChild(wallsGroup);

    room.portals.forEach(portal => {
      const portalPosition = warpPoint(portal);
      const portalGroup = createSvgElement('g', {
        id: portal.id || 'portalA',
        class: 'portal',
        transform: `translate(${portalPosition.x} ${portalPosition.y}) scale(${warpHorizontalScale(portal.y)} ${CONTENT_VERTICAL_SCALE})`,
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

  function createStaticPlatform(geometry) {
    const { object, convexParts } = geometry;
    const { id, shape = 'rect', materialName, behavior, friction, frictionStatic, restitution } = object;
    const materialRestitution = resolveConfigValue(restitution, 0);
    const materialFriction = resolveConfigValue(friction, 0.45);
    const bodyOptions = {
      friction: materialFriction,
      frictionStatic: resolveConfigValue(frictionStatic, materialFriction),
      restitution: materialRestitution,
      slop: 0
    };
    const parts = convexParts.map(vertices => {
      const center = geometryProjector.polygonCentroid(vertices);
      const part = Bodies.rectangle(center.x, center.y, 1, 1, bodyOptions);
      Body.setVertices(part, vertices);
      return part;
    });
    const body = parts.length === 1
      ? parts[0]
      : Body.create({ ...bodyOptions, parts });
    const platformData = {
      shape,
      materialName,
      behavior,
      breakState: null,
      elementId: id ? platformElementId(id) : null,
      platformBody: body
    };

    Body.setStatic(body, true);
    body.parts.forEach(part => {
      part.plugin = platformData;
    });
    return body;
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

  function triggerTimedBreak(materialBody) {
    materialBody = materialBody?.plugin?.platformBody || materialBody;
    const behavior = materialBody.plugin?.behavior;
    if (behavior?.type !== 'timed_break') return;
    if (materialBody.plugin.breakState?.broken) return;
    if (!platforms.includes(materialBody)) return;

    if (!materialBody.plugin.breakState) {
      materialBody.plugin.breakState = { touchedAt: performance.now(), broken: false };
    }
  }

  Events.on(engine, 'collisionStart', event => {
    event.pairs.forEach(pair => {
      if (pair.bodyA === ball) {
        triggerTimedBreak(pair.bodyB);
      }
      if (pair.bodyB === ball) {
        triggerTimedBreak(pair.bodyA);
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

  function constrainBallSpeed() {
    if (!ball) return;

    const speed = Math.hypot(ball.velocity.x, ball.velocity.y);
    if (!Number.isFinite(speed) || speed <= MAX_BALL_SPEED) return;

    const scale = MAX_BALL_SPEED / speed;
    Body.setVelocity(ball, {
      x: ball.velocity.x * scale,
      y: ball.velocity.y * scale
    });
  }

  function respawnBall({ resetAngle = false, blink = true } = {}) {
    Body.setPosition(ball, fitPointInsideWorld(warpPoint(currentRoom.start), ballRadius + 22));
    Body.setVelocity(ball, { x: 0, y: 0 });
    Body.setAngularVelocity(ball, 0);
    Body.setAngle(ball, 0);
    if (resetAngle) setWorldAngle(0);
    blinkUntil = blink ? performance.now() + RESPAWN_BLINK_MS : 0;
  }

  function resetCurrentRoom({ resetAngle = false, blink = true } = {}) {
    if (ball) Composite.remove(world, ball);
    platforms.forEach(body => Composite.remove(world, body));

    roomGeometry = currentRoom.objects
      .map(object => geometryProjector.objectGeometry(object));
    const roomPlatforms = roomGeometry.map(createStaticPlatform);
    platforms = roomPlatforms;
    const start = fitPointInsideWorld(warpPoint(currentRoom.start), ballRadius + 22);
    ball = createBall(start.x, start.y, ballRadius);
    previousBallPosition = { x: ball.position.x, y: ball.position.y };

    renderGeneratedRoom(currentRoom, roomGeometry);
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

    const outsideWorld = !pointInsideWorld(ball.position, ballRadius);

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
      const portalPosition = warpPoint(candidate);
      return distanceToSegment(
        portalPosition,
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

  controlGear.addEventListener('pointerdown', event => {
    requestPortraitOrientationLock();
    event.preventDefault();
    activePointerId = event.pointerId;
    gestureStartAngle = angleFromControlPoint(event.clientX, event.clientY);
    gestureStartWorldAngle = worldAngle;
    controlGear.setPointerCapture(event.pointerId);
    controlGear.classList.add('is-dragging');
  });

  controlGear.addEventListener('pointermove', event => {
    if (event.pointerId !== activePointerId || gestureStartAngle === null) return;
    event.preventDefault();
    const currentAngle = angleFromControlPoint(event.clientX, event.clientY);
    const controlDelta = normalizeAngle(currentAngle - gestureStartAngle);
    setWorldAngle(gestureStartWorldAngle - controlDelta);
  });

  function endControlGesture(event) {
    if (event.pointerId !== activePointerId) return;
    activePointerId = null;
    gestureStartAngle = null;
    gestureStartWorldAngle = worldAngle;
    controlGear.classList.remove('is-dragging');
  }

  controlGear.addEventListener('pointerup', endControlGesture);
  controlGear.addEventListener('pointercancel', endControlGesture);

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
    for (let step = 0; step < PHYSICS_SUBSTEPS; step += 1) {
      constrainBallSpeed();
      Engine.update(engine, delta / PHYSICS_SUBSTEPS);
    }
    updateTimedBreakables(now);
    if (!checkPortalTransitions(now)) checkFallOut();
    updateBallGraphics();
    requestAnimationFrame(frame);
  }

  renderBuildInfo();
  registerServiceWorker();
  layoutGearTrain();
  window.addEventListener('resize', layoutGearTrain);
  window.addEventListener('orientationchange', layoutGearTrain);
  const gearPath = createGearPath();
  worldGearShape.setAttribute('d', gearPath);
  controlGearShape.setAttribute('d', gearPath);

  loadRoom('A');
  requestAnimationFrame(frame);

  initPixi().then(() => {
    renderBallGraphics();
    updateBallGraphics();
  }).catch(error => {
    console.error(error);
    statusEl.textContent = 'Pixi could not be initialized.';
  });
})();
