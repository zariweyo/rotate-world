(() => {
  const WORLD_W = 390;
  const WORLD_H = 720;
  const BALL_RADIUS = 13;

  const gameEl = document.getElementById('game');
  const levelSvg = document.getElementById('levelSvg');
  const pixiHost = document.getElementById('pixiLayer');
  const resetBtn = document.getElementById('resetBtn');
  const statusEl = document.getElementById('status');

  const { Engine, Bodies, Body, Composite, Events, Vector } = Matter;

  const engine = Engine.create({
    gravity: { x: 0, y: 1, scale: 0.0014 }
  });

  const world = engine.world;
  let worldAngle = 0;
  let startGestureAngle = null;
  let startWorldAngle = 0;
  let reachedGoal = false;
  const pointers = new Map();

  function degToRad(deg) {
    return deg * Math.PI / 180;
  }

  function normalizeAngle(rad) {
    while (rad > Math.PI) rad -= Math.PI * 2;
    while (rad < -Math.PI) rad += Math.PI * 2;
    return rad;
  }

  function angleBetweenPointers() {
    const pts = [...pointers.values()];
    if (pts.length < 2) return null;
    return Math.atan2(pts[1].y - pts[0].y, pts[1].x - pts[0].x);
  }

  function setWorldAngle(angle) {
    worldAngle = normalizeAngle(angle);
    levelSvg.style.transform = `rotate(${worldAngle}rad)`;

    // Gravity rotates with the apparent world orientation.
    // At 0 rad it points down. Rotating the world clockwise means
    // gravity in world coordinates points counter-clockwise.
    engine.gravity.x = -Math.sin(worldAngle);
    engine.gravity.y = Math.cos(worldAngle);
  }

  function createPlatformFromSvgRect(rectEl) {
    const x = Number(rectEl.getAttribute('x'));
    const y = Number(rectEl.getAttribute('y'));
    const width = Number(rectEl.getAttribute('width'));
    const height = Number(rectEl.getAttribute('height'));

    const transform = rectEl.getAttribute('transform') || '';
    const rotateMatch = transform.match(/rotate\(([-\d.]+)/);
    const rotationDeg = rotateMatch ? Number(rotateMatch[1]) : 0;

    return Bodies.rectangle(
      x + width / 2,
      y + height / 2,
      width,
      height,
      {
        isStatic: true,
        angle: degToRad(rotationDeg),
        friction: 0.5,
        restitution: 0.08,
        chamfer: { radius: Math.min(height / 2, 8) }
      }
    );
  }

  const platforms = [...document.querySelectorAll('[data-collider="rect"]')]
    .map(createPlatformFromSvgRect);

  const walls = [
    Bodies.rectangle(WORLD_W / 2, -18, WORLD_W + 80, 36, { isStatic: true, restitution: 0.35 }),
    Bodies.rectangle(WORLD_W / 2, WORLD_H + 18, WORLD_W + 80, 36, { isStatic: true, restitution: 0.35 }),
    Bodies.rectangle(-18, WORLD_H / 2, 36, WORLD_H + 80, { isStatic: true, restitution: 0.35 }),
    Bodies.rectangle(WORLD_W + 18, WORLD_H / 2, 36, WORLD_H + 80, { isStatic: true, restitution: 0.35 })
  ];

  const ball = Bodies.circle(91, 582, BALL_RADIUS, {
    restitution: 0.28,
    friction: 0.02,
    frictionAir: 0.003,
    density: 0.0024
  });

  Composite.add(world, [...platforms, ...walls, ball]);

  const pixiApp = new PIXI.Application();
  let ballGraphic;
  let glowGraphic;

  async function initPixi() {
    await pixiApp.init({
      resizeTo: gameEl,
      backgroundAlpha: 0,
      antialias: true,
      autoDensity: true,
      resolution: Math.min(window.devicePixelRatio || 1, 2)
    });

    pixiHost.appendChild(pixiApp.canvas);

    glowGraphic = new PIXI.Graphics()
      .circle(0, 0, BALL_RADIUS * 1.9)
      .fill({ color: 0x8fe7dd, alpha: 0.11 });

    ballGraphic = new PIXI.Graphics()
      .circle(0, 0, BALL_RADIUS)
      .fill(0xf7fbff)
      .stroke({ width: 3, color: 0x9fd3c7, alpha: 1 });

    const shine = new PIXI.Graphics()
      .circle(-4.5, -5, 3.7)
      .fill({ color: 0xffffff, alpha: 0.9 });

    ballGraphic.addChild(shine);
    pixiApp.stage.addChild(glowGraphic, ballGraphic);
  }

  function worldToScreen(point) {
    const cx = WORLD_W / 2;
    const cy = WORLD_H / 2;
    const dx = point.x - cx;
    const dy = point.y - cy;
    const cos = Math.cos(worldAngle);
    const sin = Math.sin(worldAngle);

    return {
      x: cx + dx * cos - dy * sin,
      y: cy + dx * sin + dy * cos
    };
  }

  function updateBallGraphics() {
    if (!ballGraphic || !glowGraphic) return;

    const screenPoint = worldToScreen(ball.position);
    const scaleX = gameEl.clientWidth / WORLD_W;
    const scaleY = gameEl.clientHeight / WORLD_H;

    ballGraphic.position.set(screenPoint.x * scaleX, screenPoint.y * scaleY);
    glowGraphic.position.set(screenPoint.x * scaleX, screenPoint.y * scaleY);
    ballGraphic.scale.set(scaleX, scaleY);
    glowGraphic.scale.set(scaleX, scaleY);
  }

  function updateGoalState() {
    if (reachedGoal) return;
    const goal = { x: 118, y: 64 };
    const distance = Vector.magnitude(Vector.sub(ball.position, goal));
    if (distance < 30) {
      reachedGoal = true;
      statusEl.textContent = 'Goal reached ✦';
      Body.setVelocity(ball, { x: 0, y: 0 });
    }
  }

  function resetGame() {
    reachedGoal = false;
    Body.setPosition(ball, { x: 91, y: 582 });
    Body.setVelocity(ball, { x: 0, y: 0 });
    Body.setAngularVelocity(ball, 0);
    setWorldAngle(0);
    statusEl.textContent = 'Touch the world with two fingers and twist.';
  }

  gameEl.addEventListener('pointerdown', (event) => {
    gameEl.setPointerCapture?.(event.pointerId);
    pointers.set(event.pointerId, { x: event.clientX, y: event.clientY });

    if (pointers.size === 2) {
      startGestureAngle = angleBetweenPointers();
      startWorldAngle = worldAngle;
      statusEl.textContent = 'Rotate the world and let gravity do the work.';
    }
  });

  gameEl.addEventListener('pointermove', (event) => {
    if (!pointers.has(event.pointerId)) return;
    pointers.set(event.pointerId, { x: event.clientX, y: event.clientY });

    if (pointers.size === 2 && startGestureAngle !== null) {
      const current = angleBetweenPointers();
      if (current !== null) {
        setWorldAngle(startWorldAngle + normalizeAngle(current - startGestureAngle));
      }
    }
  });

  function releasePointer(event) {
    pointers.delete(event.pointerId);
    if (pointers.size < 2) {
      startGestureAngle = null;
      startWorldAngle = worldAngle;
    }
  }

  gameEl.addEventListener('pointerup', releasePointer);
  gameEl.addEventListener('pointercancel', releasePointer);
  gameEl.addEventListener('lostpointercapture', releasePointer);
  resetBtn.addEventListener('click', resetGame);

  let lastTime = performance.now();
  function frame(now) {
    const dt = Math.min(now - lastTime, 32);
    lastTime = now;
    Engine.update(engine, dt);
    updateBallGraphics();
    updateGoalState();
    requestAnimationFrame(frame);
  }

  initPixi().then(() => {
    updateBallGraphics();
    requestAnimationFrame(frame);
  }).catch((error) => {
    console.error(error);
    statusEl.textContent = 'Could not initialize the render layer.';
  });
})();
