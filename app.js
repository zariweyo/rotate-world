(() => {
  const WORLD_W = 600;
  const WORLD_H = 600;
  const BALL_RADIUS = 16;

  const ROOMS = {
    A: { label: 'ROOM A', start: { x: 118, y: 475 }, angle: 0, exit: { x: 455, y: 132, radius: 31, target: 'B' } },
    B: { label: 'ROOM B', start: { x: 495, y: 115 }, angle: -Math.PI / 2, exit: null }
  };

  const gameEl = document.getElementById('game');
  const levelSvg = document.getElementById('levelSvg');
  const pixiHost = document.getElementById('pixiLayer');
  const resetBtn = document.getElementById('resetBtn');
  const statusEl = document.getElementById('status');
  const levelLabel = document.getElementById('levelLabel');
  const { Engine, Bodies, Body, Composite, Vector } = Matter;

  const engine = Engine.create();
  engine.gravity.x = 0;
  engine.gravity.y = 1;
  engine.gravity.scale = 0.0018;
  const world = engine.world;

  let currentRoom = 'A';
  let worldAngle = 0;
  let gestureStartAngle = null;
  let gestureStartWorldAngle = 0;
  let transitioning = false;
  let roomBodies = [];

  const degToRad = d => d * Math.PI / 180;

  function normalizeAngle(rad) {
    while (rad > Math.PI) rad -= Math.PI * 2;
    while (rad < -Math.PI) rad += Math.PI * 2;
    return rad;
  }

  function angleFromTouches(touches) {
    if (touches.length < 2) return null;
    return Math.atan2(
      touches[1].clientY - touches[0].clientY,
      touches[1].clientX - touches[0].clientX
    );
  }

  function applyVisualTransform() {
    const transform = `translate(-50%, -50%) rotate(${worldAngle}rad)`;
    levelSvg.style.transform = transform;
    pixiHost.style.transform = transform;
  }

  function setWorldAngle(angle) {
    worldAngle = normalizeAngle(angle);
    applyVisualTransform();

    // Matter stays in local room coordinates. Gravity is transformed
    // so screen-down remains visually correct while the room rotates.
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
      restitution: 0.05,
      chamfer: { radius: Math.min(height / 2, 8) }
    });
  }

  const walls = [
    Bodies.rectangle(300, -15, 660, 30, { isStatic: true }),
    Bodies.rectangle(300, 615, 660, 30, { isStatic: true }),
    Bodies.rectangle(-15, 300, 30, 660, { isStatic: true }),
    Bodies.rectangle(615, 300, 30, 660, { isStatic: true })
  ];

  const ball = Bodies.circle(ROOMS.A.start.x, ROOMS.A.start.y, BALL_RADIUS, {
    restitution: 0.18,
    friction: 0.025,
    frictionStatic: 0.35,
    frictionAir: 0.002,
    density: 0.0024
  });

  Composite.add(world, [...walls, ball]);

  function rebuildRoomPhysics(roomId) {
    if (roomBodies.length) {
      Composite.remove(world, roomBodies, true);
    }
    roomBodies = [...document.querySelectorAll(`[data-room-collider="${roomId}"]`)].map(createPlatform);
    Composite.add(world, roomBodies);
  }

  function showRoom(roomId) {
    document.querySelectorAll('[data-room]').forEach(el => {
      el.style.display = el.dataset.room === roomId ? '' : 'none';
    });
  }

  function placeBall(position) {
    Body.setPosition(ball, { x: position.x, y: position.y });
    Body.setVelocity(ball, { x: 0, y: 0 });
    Body.setAngularVelocity(ball, 0);
    Body.setAngle(ball, 0);
  }

  function enterRoom(roomId) {
    currentRoom = roomId;
    const room = ROOMS[roomId];
    showRoom(roomId);
    rebuildRoomPhysics(roomId);
    levelLabel.textContent = room.label;
    placeBall(room.start);
    setWorldAngle(room.angle);
    transitioning = false;
    statusEl.textContent = roomId === 'A' ? 'Find the tube.' : 'The tube has dropped you into Room B.';
  }

  function updateTubeState() {
    if (transitioning) return;
    const exit = ROOMS[currentRoom].exit;
    if (!exit) return;

    if (Vector.magnitude(Vector.sub(ball.position, exit)) < exit.radius) {
      transitioning = true;
      statusEl.textContent = 'Through the tube…';
      Body.setVelocity(ball, { x: 0, y: 0 });
      setTimeout(() => enterRoom(exit.target), 260);
    }
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
      autoDensity: true,
      resolution: Math.min(window.devicePixelRatio || 1, 2)
    });

    pixiHost.appendChild(pixiApp.canvas);

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

  gameEl.addEventListener('touchstart', event => {
    if (event.touches.length === 2) {
      event.preventDefault();
      gestureStartAngle = angleFromTouches(event.touches);
      gestureStartWorldAngle = worldAngle;
      statusEl.textContent = 'Rotate the room and use gravity.';
    }
  }, { passive: false });

  gameEl.addEventListener('touchmove', event => {
    if (event.touches.length === 2 && gestureStartAngle !== null) {
      event.preventDefault();
      const current = angleFromTouches(event.touches);
      if (current !== null) {
        setWorldAngle(gestureStartWorldAngle + normalizeAngle(current - gestureStartAngle));
      }
    }
  }, { passive: false });

  gameEl.addEventListener('touchend', event => {
    if (event.touches.length < 2) {
      gestureStartAngle = null;
      gestureStartWorldAngle = worldAngle;
    }
  });

  gameEl.addEventListener('touchcancel', () => {
    gestureStartAngle = null;
    gestureStartWorldAngle = worldAngle;
  });

  resetBtn.addEventListener('click', () => enterRoom(currentRoom));

  let previous = performance.now();
  function frame(now) {
    const delta = Math.min(Math.max(now - previous, 8), 24);
    previous = now;
    Engine.update(engine, delta);
    updateBallGraphics();
    updateTubeState();
    requestAnimationFrame(frame);
  }

  initPixi().then(() => {
    enterRoom('A');
    updateBallGraphics();
    requestAnimationFrame(frame);
  }).catch(error => {
    console.error(error);
    statusEl.textContent = 'Pixi could not be initialized.';
  });
})();
