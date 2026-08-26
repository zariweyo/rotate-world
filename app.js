(() => {
  const WORLD_W = 600;
  const WORLD_H = 600;
  const BALL_RADIUS = 16;

  const ROOMS = {
    A: { label: 'ROOM A', start: { x: 118, y: 475 }, angle: 0, exit: { x: 455, y: 132, radius: 31, target: 'B' } },
    B: { label: 'ROOM B', start: { x: 495, y: 115 }, angle: -Math.PI / 2, exit: null }
  };

  const gameEl = document.getElementById('game');
  const worldLayer = document.getElementById('worldLayer');
  const ballSvg = document.getElementById('ballSvg');
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

  const activePointers = new Map();
  const degToRad = d => d * Math.PI / 180;

  function normalizeAngle(rad) {
    while (rad > Math.PI) rad -= Math.PI * 2;
    while (rad < -Math.PI) rad += Math.PI * 2;
    return rad;
  }

  function pointerPairAngle() {
    const points = [...activePointers.values()];
    if (points.length < 2) return null;
    return Math.atan2(points[1].y - points[0].y, points[1].x - points[0].x);
  }

  function setWorldAngle(angle) {
    worldAngle = normalizeAngle(angle);
    worldLayer.setAttribute('transform', `rotate(${worldAngle * 180 / Math.PI} 300 300)`);

    // Screen gravity always points down. Convert it into the room's local coordinates.
    engine.gravity.x = Math.sin(worldAngle);
    engine.gravity.y = Math.cos(worldAngle);
  }

  function createPlatform(rect) {
    const x = Number(rect.getAttribute('x'));
    const y = Number(rect.getAttribute('y'));
    const width = Number(rect.getAttribute('width'));
    const height = Number(rect.getAttribute('height'));
    const transform = rect.getAttribute('transform') || '';
    const match = transform.match(/rotate\(([-\d.]+)\s+([-\d.]+)\s+([-\d.]+)\)/);
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
    if (roomBodies.length) Composite.remove(world, roomBodies);
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

  function updateBallSvg() {
    const degrees = ball.angle * 180 / Math.PI;
    ballSvg.setAttribute('transform', `translate(${ball.position.x} ${ball.position.y}) rotate(${degrees})`);
  }

  function beginGestureIfReady() {
    if (activePointers.size === 2) {
      gestureStartAngle = pointerPairAngle();
      gestureStartWorldAngle = worldAngle;
      statusEl.textContent = 'Rotate the room and use gravity.';
    }
  }

  gameEl.addEventListener('pointerdown', event => {
    activePointers.set(event.pointerId, { x: event.clientX, y: event.clientY });
    beginGestureIfReady();
  });

  gameEl.addEventListener('pointermove', event => {
    if (!activePointers.has(event.pointerId)) return;
    activePointers.set(event.pointerId, { x: event.clientX, y: event.clientY });
    if (activePointers.size === 2 && gestureStartAngle !== null) {
      const current = pointerPairAngle();
      if (current !== null) {
        event.preventDefault();
        setWorldAngle(gestureStartWorldAngle + normalizeAngle(current - gestureStartAngle));
      }
    }
  }, { passive: false });

  function releasePointer(event) {
    activePointers.delete(event.pointerId);
    if (activePointers.size < 2) {
      gestureStartAngle = null;
      gestureStartWorldAngle = worldAngle;
    }
  }

  gameEl.addEventListener('pointerup', releasePointer);
  gameEl.addEventListener('pointercancel', releasePointer);
  gameEl.addEventListener('pointerleave', releasePointer);

  resetBtn.addEventListener('click', () => enterRoom(currentRoom));

  let previous = performance.now();
  function frame(now) {
    const delta = Math.min(Math.max(now - previous, 8), 24);
    previous = now;
    Engine.update(engine, delta);
    updateBallSvg();
    updateTubeState();
    requestAnimationFrame(frame);
  }

  enterRoom('A');
  updateBallSvg();
  requestAnimationFrame(frame);
})();
