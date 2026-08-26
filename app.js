(() => {
  const WORLD_W = 600;
  const WORLD_H = 600;
  const BALL_RADIUS = 16;

  const ROOMS = {
    A: {
      label: 'ROOM A',
      start: { x: 118, y: 475 },
      angle: 0,
      exit: { x: 455, y: 132, radius: 31, target: 'B' }
    },
    B: {
      label: 'ROOM B',
      /* Tube B points left in room coordinates. Rotating the room -90° makes that direction screen-down. */
      start: { x: 495, y: 115 },
      angle: -Math.PI / 2,
      exit: null
    }
  };

  const gameEl = document.getElementById('game');
  const levelSvg = document.getElementById('levelSvg');
  const pixiHost = document.getElementById('pixiLayer');
  const resetBtn = document.getElementById('resetBtn');
  const statusEl = document.getElementById('status');
  const levelLabel = document.getElementById('levelLabel');
  const { Engine, Bodies, Body, Composite, Vector } = Matter;

  const engine = Engine.create({ gravity: { x: 0, y: 1, scale: 0.0014 } });
  const world = engine.world;
  const pointers = new Map();

  let currentRoom = 'A';
  let worldAngle = 0;
  let startGestureAngle = null;
  let startWorldAngle = 0;
  let transitioning = false;
  let roomBodies = [];

  const degToRad = d => d * Math.PI / 180;
  function normalizeAngle(rad) {
    while (rad > Math.PI) rad -= Math.PI * 2;
    while (rad < -Math.PI) rad += Math.PI * 2;
    return rad;
  }

  function angleBetweenPointers() {
    const p = [...pointers.values()];
    return p.length < 2 ? null : Math.atan2(p[1].y - p[0].y, p[1].x - p[0].x);
  }

  function setWorldAngle(angle) {
    worldAngle = normalizeAngle(angle);
    levelSvg.style.transform = `translate(-50%, -50%) rotate(${worldAngle}rad)`;
    engine.gravity.x = Math.sin(worldAngle);
    engine.gravity.y = Math.cos(worldAngle);
  }

  function createPlatform(rect) {
    const x = +rect.getAttribute('x');
    const y = +rect.getAttribute('y');
    const width = +rect.getAttribute('width');
    const height = +rect.getAttribute('height');
    const match = (rect.getAttribute('transform') || '').match(/rotate\(([-\d.]+)/);
    return Bodies.rectangle(x + width / 2, y + height / 2, width, height, {
      isStatic: true,
      angle: degToRad(match ? +match[1] : 0),
      friction: .5,
      restitution: .08,
      chamfer: { radius: Math.min(height / 2, 8) }
    });
  }

  const walls = [
    Bodies.rectangle(WORLD_W / 2, -18, WORLD_W + 80, 36, { isStatic: true, restitution: .3 }),
    Bodies.rectangle(WORLD_W / 2, WORLD_H + 18, WORLD_W + 80, 36, { isStatic: true, restitution: .3 }),
    Bodies.rectangle(-18, WORLD_H / 2, 36, WORLD_H + 80, { isStatic: true, restitution: .3 }),
    Bodies.rectangle(WORLD_W + 18, WORLD_H / 2, 36, WORLD_H + 80, { isStatic: true, restitution: .3 })
  ];

  const ball = Bodies.circle(ROOMS.A.start.x, ROOMS.A.start.y, BALL_RADIUS, {
    restitution: .28,
    friction: .02,
    frictionAir: .003,
    density: .0024
  });
  Composite.add(world, [...walls, ball]);

  function rebuildRoomPhysics(roomId) {
    if (roomBodies.length) Composite.remove(world, roomBodies);
    roomBodies = [...document.querySelectorAll(`[data-room-collider="${roomId}"]`)].map(createPlatform);
    Composite.add(world, roomBodies);
  }

  function showRoom(roomId) {
    document.querySelectorAll('[data-room]').forEach(el => {
      el.style.display = el.getAttribute('data-room') === roomId ? '' : 'none';
    });
  }

  function placeBall(position) {
    Body.setPosition(ball, position);
    Body.setVelocity(ball, { x: 0, y: 0 });
    Body.setAngularVelocity(ball, 0);
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
    const distance = Vector.magnitude(Vector.sub(ball.position, exit));
    if (distance < exit.radius) {
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
      resizeTo: pixiHost,
      backgroundAlpha: 0,
      antialias: true,
      autoDensity: true,
      resolution: Math.min(devicePixelRatio || 1, 2)
    });
    pixiHost.appendChild(pixiApp.canvas);
    glowGraphic = new PIXI.Graphics().circle(0, 0, BALL_RADIUS * 1.9).fill({ color: 0x8fe7dd, alpha: .11 });
    ballGraphic = new PIXI.Graphics().circle(0, 0, BALL_RADIUS).fill(0xf7fbff).stroke({ width: 3, color: 0x9fd3c7, alpha: 1 });
    ballGraphic.addChild(new PIXI.Graphics().circle(-5, -6, 4).fill({ color: 0xffffff, alpha: .9 }));
    pixiApp.stage.addChild(glowGraphic, ballGraphic);
  }

  function worldToScreen(point) {
    const cx = 300, cy = 300;
    const dx = point.x - cx, dy = point.y - cy;
    const c = Math.cos(worldAngle), s = Math.sin(worldAngle);
    return { x: cx + dx * c - dy * s, y: cy + dx * s + dy * c };
  }

  function updateBallGraphics() {
    if (!ballGraphic) return;
    const p = worldToScreen(ball.position);
    const sx = pixiHost.clientWidth / WORLD_W;
    const sy = pixiHost.clientHeight / WORLD_H;
    ballGraphic.position.set(p.x * sx, p.y * sy);
    glowGraphic.position.set(p.x * sx, p.y * sy);
    ballGraphic.scale.set(sx, sy);
    glowGraphic.scale.set(sx, sy);
  }

  function resetGame() {
    enterRoom(currentRoom);
  }

  gameEl.addEventListener('pointerdown', e => {
    gameEl.setPointerCapture?.(e.pointerId);
    pointers.set(e.pointerId, { x: e.clientX, y: e.clientY });
    if (pointers.size === 2) {
      startGestureAngle = angleBetweenPointers();
      startWorldAngle = worldAngle;
      statusEl.textContent = 'Rotate the room and use gravity.';
    }
  });

  gameEl.addEventListener('pointermove', e => {
    if (!pointers.has(e.pointerId)) return;
    pointers.set(e.pointerId, { x: e.clientX, y: e.clientY });
    if (pointers.size === 2 && startGestureAngle !== null) {
      const current = angleBetweenPointers();
      if (current !== null) setWorldAngle(startWorldAngle + normalizeAngle(current - startGestureAngle));
    }
  });

  function release(e) {
    pointers.delete(e.pointerId);
    if (pointers.size < 2) {
      startGestureAngle = null;
      startWorldAngle = worldAngle;
    }
  }

  gameEl.addEventListener('pointerup', release);
  gameEl.addEventListener('pointercancel', release);
  gameEl.addEventListener('lostpointercapture', release);
  resetBtn.addEventListener('click', resetGame);

  let lastTime = performance.now();
  function frame(now) {
    const dt = Math.min(now - lastTime, 32);
    lastTime = now;
    Engine.update(engine, dt);
    updateBallGraphics();
    updateTubeState();
    requestAnimationFrame(frame);
  }

  initPixi().then(() => {
    enterRoom('A');
    updateBallGraphics();
    requestAnimationFrame(frame);
  }).catch(err => {
    console.error(err);
    statusEl.textContent = 'Could not initialize the render layer.';
  });
})();
