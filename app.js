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
  const { Engine, Bodies, Body, Composite } = Matter;

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
  const BALL_RESTITUTION = settings.ballRestitution ?? 0.18;
  const WALL_RESTITUTION = settings.wallRestitution ?? 0.05;
  const PORTAL_COOLDOWN_MS = 700;
  let currentRoomId = 'A';
  let currentRoom = rooms[currentRoomId];
  let ballRadius = (currentRoom?.ball?.diameter ?? 32) / 2;
  let platforms = [];
  let ball;
  let lastPortalTransitionAt = 0;
  let orientationLockRequested = false;

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

    room.objects.forEach(object => {
      const fill = object.visual ? `url(#${object.visual})` : 'url(#platformGradient)';
      wallsGroup.appendChild(createSvgElement('rect', {
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

  function createStaticRect({ x, y, width, height, angle = 0, friction, restitution }) {
    return Bodies.rectangle(x + width / 2, y + height / 2, width, height, {
      isStatic: true,
      angle,
      friction: resolveConfigValue(friction, 0.45),
      restitution: resolveConfigValue(restitution, WALL_RESTITUTION),
      slop: 0
    });
  }

  const walls = [
    Bodies.rectangle(300, 12, 660, 48, { isStatic: true, slop: 0 }),
    Bodies.rectangle(300, 588, 660, 48, { isStatic: true, slop: 0 }),
    Bodies.rectangle(12, 300, 48, 660, { isStatic: true, slop: 0 }),
    Bodies.rectangle(588, 300, 48, 660, { isStatic: true, slop: 0 })
  ];

  function createBall(x, y, radius) {
    return Bodies.circle(x, y, radius, {
      restitution: BALL_RESTITUTION,
      friction: 0.025,
      frictionStatic: 0.35,
      frictionAir: 0.002,
      density: 0.0024,
      slop: 0.01
    });
  }

  Composite.add(world, walls);

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
  }

  function resetBall() {
    Body.setPosition(ball, currentRoom.start);
    Body.setVelocity(ball, { x: 0, y: 0 });
    Body.setAngularVelocity(ball, 0);
    Body.setAngle(ball, 0);
    setWorldAngle(0);
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
    platforms = currentRoom.objects.map(createStaticRect);
    ball = createBall(currentRoom.start.x, currentRoom.start.y, ballRadius);

    renderGeneratedRoom(currentRoom);
    if (ballGraphic) renderBallGraphics();
    Composite.add(world, [...platforms, ball]);
    setLevelLabel();
    setWorldAngle(options.angle ?? 0);
    lastPortalTransitionAt = performance.now();
    statusEl.textContent = `${currentRoom.name}: reach the portal.`;

    return true;
  }

  function checkPortalTransitions(now) {
    if (!currentRoom?.portals || now - lastPortalTransitionAt < PORTAL_COOLDOWN_MS) return;

    const portal = currentRoom.portals.find(candidate => {
      if (!candidate.targetRoom) return false;
      const dx = ball.position.x - candidate.x;
      const dy = ball.position.y - candidate.y;
      return Math.hypot(dx, dy) <= (candidate.radius ?? 24) + ballRadius * 0.35;
    });

    if (!portal) return;

    if (!loadRoom(portal.targetRoom, { angle: worldAngle })) {
      statusEl.textContent = `Portal target ${portal.targetRoom} is not available yet.`;
      lastPortalTransitionAt = now;
    }
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
    Engine.update(engine, delta / 2);
    Engine.update(engine, delta / 2);
    checkPortalTransitions(now);
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
