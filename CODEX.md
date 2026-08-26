# Rotate World — Project Context

## Game idea

Rotate World is a mobile-first physics puzzle game built around one core rule: **the player does not directly control the ball**. Instead, the player rotates the entire world and gravity moves the ball.

For the current web MVP, the world is rotated with a **two-finger twist gesture**. A future native/mobile version should also explore controlling the world using the phone's physical orientation/rotation sensors.

The game is evolving from a simple sequence of levels into a larger puzzle made of **interconnected rooms**.

Each room is a square 600×600 world containing platforms, ramps, obstacles and one or more tubes. Tubes connect rooms together. The intended structure is therefore a graph/labyrinth rather than a simple linear list of levels:

```text
Room A ──tube──> Room B
  │                │
  └──tube──> C     └──tube──> D
                 ...
```

When the ball falls into a tube, the game changes to the room connected to that tube. The destination room must initially be rotated so that its corresponding tube points **downward on screen**, allowing the ball to emerge/fall naturally under gravity. Rooms may eventually connect back to previous rooms, creating a navigable puzzle labyrinth.

The important design principle is that movement should feel physical and continuous: the player solves the puzzle by understanding gravity, momentum, slopes and how rooms connect.

## Technology / intended architecture

The current MVP is a static web application intended for GitHub Pages.

The chosen stack is:

- **SVG** — visual representation of each room/world. SVG was deliberately chosen because the levels should look polished, vectorial and visually rich.
- **PixiJS** — dynamic rendering layer, initially for the ball and later potentially particles, trails, transitions and other effects.
- **Matter.js** — physics engine. It owns the actual ball position, velocity, gravity and collisions.
- **HTML/CSS/JavaScript** — MVP shell and controls.

The intended coordinate system is extremely important:

```text
Matter.js world: 600 × 600
SVG viewBox:      600 × 600
Pixi stage:       600 × 600
```

These three coordinate spaces MUST correspond exactly.

The SVG and Pixi canvas should be two perfectly superimposed layers inside a single square `worldStack`. The `worldStack` itself is what rotates visually. Do not independently calculate a second visual rotation for the ball.

Conceptually:

```text
game viewport
└── worldStack (square, rotation applied here)
    ├── SVG 600×600      ← room graphics
    └── Pixi 600×600     ← ball / effects

Matter.js 600×600        ← physics only
```

Matter stays in the room's local coordinate system. When the player rotates the world by angle θ, the visual `worldStack` rotates and Matter's gravity vector is changed so that screen-down remains physical down from the player's perspective.

The current implementation uses approximately:

```js
gravity.x = Math.sin(worldAngle);
gravity.y = Math.cos(worldAngle);
```

The ball's Pixi position should be copied directly from Matter without additional scaling/rotation math:

```js
ballGraphic.position.set(ball.position.x, ball.position.y);
```

## Mobile viewport / world size

Rooms themselves are square: **600×600**.

The complete square world must remain visible at every rotation angle. A square rotated 45° requires √2 times its side length, so the actual world occupies approximately `1 / sqrt(2) = 70.710678%` of the outer square game viewport. This leaves enough space for all four corners to remain visible while rotating 360°.

The UI is mobile-first.

## Controls

Current MVP control:

- Put two fingers on the game area.
- Twist the fingers to rotate the complete world.
- The ball responds to the corresponding gravity vector.

This control has already worked correctly in earlier versions of the MVP. Do not replace it unnecessarily while debugging rendering/physics.

Future mobile control:

- Device orientation / gyroscope / accelerometer may rotate or tilt the world.
- A calibration position will probably be needed.

## Physics

Matter.js owns the ball and static platform colliders.

The SVG contains visual platform rectangles marked with attributes such as:

```html
<rect data-room-collider="A" ... />
```

JavaScript parses these SVG elements and creates corresponding static Matter bodies. Rotated SVG platforms must produce Matter bodies with the same angle.

Invisible Matter bodies around the four edges of the 600×600 room keep the ball inside the room.

The visual SVG is not the source of physical movement: Matter is authoritative. Rendering must follow Matter.

## Rooms and tubes

Two conceptual rooms have already been prototyped: Room A and Room B.

The first implementation attempted this transition:

```text
ROOM A
ball falls into tube A
        ↓
ROOM B
room starts rotated -90°
ball appears at tube B
        ↓
gravity lets ball leave the tube naturally
```

This room/tube functionality is temporarily secondary while the rendering/physics coordinate bug described below is fixed.

**Do not continue building the room graph until the basic single-room ball alignment and collisions are verified.**

## GitHub Pages

Deployment is through `.github/workflows/pages.yml`.

Deployment is intentionally **manual only** using `workflow_dispatch`. Do NOT add an automatic `push` trigger unless explicitly requested.

The workflow injects the deployed short Git commit SHA into the page. The UI displays the commit so it is possible to verify exactly which version is currently running on GitHub Pages.

This is important during mobile testing because commits do not automatically deploy.

## What has been tried

Several approaches were tested while diagnosing the ball/world mismatch:

1. SVG world + Pixi ball as separate layers with separate transforms.
2. Removing Pixi and drawing the ball directly inside SVG.
3. Rotating an internal SVG `<g id="worldLayer">` containing rooms and the SVG ball.
4. Changing between Pointer Events and Touch Events for the two-finger gesture.
5. Restoring Pixi because the original Pixi implementation had been visually and interactively better.
6. Current approach: SVG + Pixi inside one shared `worldStack`, intended to share exactly the same dimensions and visual transform.

Removing Pixi was not a useful direction. **Keep Pixi.** The desired architecture is SVG for the room, Pixi for the ball/effects, Matter for physics.

## Current known problem — highest priority

At the time of writing, commit `43471fb` is the latest implementation before this documentation commit.

The world rotation works again, but the major unresolved bug is:

> **The Pixi ball does not visually appear to be inside/aligned with the SVG 600×600 room and it does not correctly interact with the visible SVG obstacles.**

The current hypothesis is a mismatch between the rendered dimensions/coordinate system of the SVG, Pixi canvas and/or their CSS container, rather than a problem with the basic game concept.

The immediate debugging goal is deliberately narrow:

1. Use only Room A.
2. Disable/ignore tube transitions.
3. Confirm SVG is exactly a 600×600 logical coordinate space.
4. Confirm Pixi is exactly a 600×600 logical coordinate space.
5. Confirm both occupy exactly the same CSS rectangle inside `worldStack`.
6. Place the Matter ball at a known coordinate, e.g. `(118, 475)`.
7. Verify the Pixi ball appears at exactly `(118, 475)` relative to the SVG.
8. Verify a simple horizontal SVG platform and its Matter collider coincide.
9. Verify the ball falls and rests on that platform.
10. Only after this works, restore multiple platforms, rotation, and finally tube/room transitions.

Do not try to solve several layers of functionality simultaneously. First establish the invariant:

> **One Matter unit = one SVG viewBox unit = one Pixi logical unit.**

## Important implementation warning

A Pixi canvas configured with `width: 600`, `height: 600`, `autoDensity`, and a device pixel ratio greater than 1 may have a backing buffer larger than 600×600. That is fine, but its **logical stage coordinates and CSS size must still map exactly to the SVG's rendered rectangle**.

Likewise, SVG `viewBox="0 0 600 600"` does not by itself guarantee that the rendered SVG rectangle and Pixi canvas are identical. CSS sizing, `preserveAspectRatio`, parent dimensions, transforms and device pixel ratio must all be checked.

When debugging, use visible reference markers if useful (for example crosses/circles at `(0,0)`, `(300,300)`, `(118,475)` and `(600,600)`) in both SVG and Pixi to prove alignment before debugging Matter collisions.

## Development priority

Current order of work:

```text
1. SVG/Pixi coordinate alignment
2. Matter ball visually aligned with Pixi ball
3. Matter colliders aligned with SVG platforms
4. Two-finger rotation + transformed gravity
5. Tube detection
6. Room-to-room transitions
7. Multiple interconnected rooms / labyrinth
8. More puzzle mechanics and visual polish
```

The MVP should remain small until steps 1–4 are unquestionably stable.
