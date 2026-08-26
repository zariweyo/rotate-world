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

  const engine = Engine.create({ gravity: { x: 0, y: 1, scale: 0.0014 } });
  const world = engine.world;
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

  function angleFromTouches(touches) {
    if (touches.length < 2) return null;
    return Math.atan2(touches[1].clientY - touches[0].clientY, touches[1].clientX - touches[0].clientX);
  }

  function setWorldAngle(angle) {
    worldAngle = normalizeAngle(angle);
    worldLayer.setAttribute('transform', `rotate(${worldAngle * 180 / Math.PI} 300 300)`);
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
      friction: 0.5,
      restitution: 0.08,
      chamfer: { radius: Math.min(height / 2, 8) }
    });
  }

  const walls = [
    Bodies.rectangle(WORLD_W / 2, -18, WORLD_W + 80, 36, { isStatic: true, restitution: 0.3 }),
    Bodies.rectangle(WORLD_W / 2, WORLD_H + 18, WORLD_W + 80, 36, { isStatic: true, restitution: 0.3 }),
    Bodies.rectangle(-18, WORLD_H / 2, 36, WORLD_H + 80, { isStatic: true, restitution: 0.3 }),
    Bodies.rectangle(WORLD_W + 18, WORLD_H / 2, 36, WORLD_H + 80, { isStatic: true, restitution: 0.3 })
  ];

  const ball = Bodies.circle(ROOMS.A.start.x, ROOMS.A.start.y, BALL_RADIUS, {
    restitution: 0.22,
    friction: 0.03,
    frictionStatic: 0.4,
    frictionAir: 0.003,
    density: 0.0024
  });
  Composite.add(world, [...walls, ball]);

  function rebuildRoomPhysics(roomId) {
    roomBodies.forEach(body => Composite.remove(world, body));
    roomBodies = [...document.querySelectorAll(`[data-room-collider="${roomId}"]`)].map(createPlatform);
    Composite.add(world, roomBodies);
  }

  function showRoom(roomId) {
    document.querySelectorAll('[data-room]').forEach(el => {
      el.style.display = el.getAttribute('data-room') === roomId ? '' : 'none';
    });
  }

  function placeBall(position) {
    Body.setPosition(ball, { x: position.x, y: position.y });
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

  function updateBallSvg() {
    ballSvg.setAttribute('transform', `translate(${ball.position.x} ${ball.position.y}) rotate(${ball.angle * 180 / Math.PI})`);
  }

  function resetGame() { enterRoom(currentRoom); }

  gameEl.addEventListener('touchstart', e => {
    if (e.touches.length === 2) {
      e.preventDefault();
      startGestureAngle = angleFromTouches(e.touches);
      startWorldAngle = worldAngle;
      statusEl.textContent = 'Rotate the room and use gravity.';
    }
  }, { passive: false });

  gameEl.addEventListener('touchmove', e => {
    if (e.touches.length === 2 && startGestureAngle !== null) {
      e.preventDefault();
      const current = angleFromTouches(e.touches);
      if (current !== null) setWorldAngle(startWorldAngle + normalizeAngle(current - startGestureAngle));
    }
  }, { passive: false });

  gameEl.addEventListener('touchend', e => {
    if (e.touches.length < 2) {
      startGestureAngle = null;
      startWorldAngle = worldAngle;
    }
  });

  gameEl.addEventListener('touchcancel', () => {
    startGestureAngle = null;
    startWorldAngle = worldAngle;
  });

  resetBtn.addEventListener('click', resetGame);

  let lastTime = performance.now();
  function frame(now) {
    const dt = Math.min(now - lastTime, 32);
    lastTime = now;
    Engine.update(engine, dt);
    updateBallSvg();
    updateTubeState();
    requestAnimationFrame(frame);
  }

  enterRoom('A');
  updateBallSvg();
  requestAnimationFrame(frame);
})();
