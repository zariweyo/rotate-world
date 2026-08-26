(() => {
  const WORLD_W = 600;
  const WORLD_H = 600;
  const BALL_RADIUS = 16;
  const START = { x: 66, y: 532 };

  const gameEl = document.getElementById('game');
  const worldStack = document.getElementById('worldStack');
  const pixiHost = document.getElementById('pixiLayer');
  const resetBtn = document.getElementById('resetBtn');
  const refreshBtn = document.getElementById('refreshBtn');
  const statusEl = document.getElementById('status');
  const buildCommitEl = document.getElementById('buildCommit');
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
  const KEY_ROTATION_STEP = degToRad(settings.keyboardRotationStepDegrees ?? 5);
  const SCREEN_ORIENTATION_LOCK = settings.screenOrientationLock || 'portrait';
  const BALL_RESTITUTION = settings.ballRestitution ?? 0.18;
  const WALL_RESTITUTION = settings.wallRestitution ?? 0.05;
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

  function createPlatform(rect) {
    const x = Number(rect.getAttribute('x'));
    const y = Number(rect.getAttribute('y'));
    const width = Number(rect.getAttribute('width'));
    const height = Number(rect.getAttribute('height'));
    const transform = rect.getAttribute('transform') || '';
    const match = transform.match(/rotate\(([-\d.]+)/);
    const angle = match ? degToRad(Number(match[1])) : 0;

    return Bodies.rectangle(x + width / 2, y + height / 2, width, height, {
      isStatic: true,
      angle,
      friction: 0.45,
      restitution: WALL_RESTITUTION,
      slop: 0
    });
  }

  const platforms = [...document.querySelectorAll('[data-room-collider="A"]')].map(createPlatform);
  const walls = [
    Bodies.rectangle(300, 12, 660, 48, { isStatic: true, slop: 0 }),
    Bodies.rectangle(300, 588, 660, 48, { isStatic: true, slop: 0 }),
    Bodies.rectangle(12, 300, 48, 660, { isStatic: true, slop: 0 }),
    Bodies.rectangle(588, 300, 48, 660, { isStatic: true, slop: 0 })
  ];

  const ball = Bodies.circle(START.x, START.y, BALL_RADIUS, {
    restitution: BALL_RESTITUTION,
    friction: 0.025,
    frictionStatic: 0.35,
    frictionAir: 0.002,
    density: 0.0024,
    slop: 0.01
  });

  Composite.add(world, [...walls, ...platforms, ball]);

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

    glowGraphic = new PIXI.Graphics()
      .circle(0, 0, BALL_RADIUS * 1.9)
      .fill({ color: 0x8fe7dd, alpha: 0.14 });

    ballGraphic = new PIXI.Graphics()
      .circle(0, 0, BALL_RADIUS)
      .fill(0xf7fbff)
      .stroke({ width: 3, color: 0x9fd3c7, alpha: 1 });

    const shine = new PIXI.Graphics()
      .circle(-5, -6, 4)
      .fill({ color: 0xffffff, alpha: 0.92 });

    ballGraphic.addChild(shine);
    pixiApp.stage.addChild(glowGraphic, ballGraphic);
  }

  function updateBallGraphics() {
    if (!ballGraphic) return;
    ballGraphic.position.set(ball.position.x, ball.position.y);
    glowGraphic.position.set(ball.position.x, ball.position.y);
    ballGraphic.rotation = ball.angle;
  }

  function resetBall() {
    Body.setPosition(ball, START);
    Body.setVelocity(ball, { x: 0, y: 0 });
    Body.setAngularVelocity(ball, 0);
    Body.setAngle(ball, 0);
    setWorldAngle(0);
    statusEl.textContent = `Maze run: fall through the gaps and reach the portal. Mode: ${getDisplayMode()}.`;
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
    updateBallGraphics();
    requestAnimationFrame(frame);
  }

  renderBuildInfo();
  registerServiceWorker();

  initPixi().then(() => {
    resetBall();
    updateBallGraphics();
    requestAnimationFrame(frame);
  }).catch(error => {
    console.error(error);
    statusEl.textContent = 'Pixi could not be initialized.';
  });
})();
