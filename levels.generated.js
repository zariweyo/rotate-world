window.RotateWorldLevels = {
  "generatedAt": "2026-08-27 13:27:21 CEST",
  "source": "levels/levels.yaml",
  "materialsSource": "levels/material.yaml",
  "version": 1,
  "flow": {
    "A": {
      "path": "levelA.yaml"
    },
    "B": {
      "path": "levelB.yaml"
    }
  },
  "skippedRooms": [

  ],
  "rooms": {
    "A": {
      "id": "A",
      "name": "Serpentine Maze",
      "path": "levelA.yaml",
      "next": null,
      "version": 1,
      "size": 600,
      "ball": {
        "diameter": 20
      },
      "cols": 20,
      "rows": 24,
      "tileWidth": 30.0,
      "tileHeight": 25.0,
      "map": [
        "####################",
        "#..................#",
        "#S.....w...........#",
        "#########ttt########",
        "#..................#",
        "#..................#",
        "#..................#",
        "#..#################",
        "#..................#",
        "#####ttt############",
        "#..................#",
        "############..######",
        "#..................#",
        "#################..#",
        "#..................#",
        "############..######",
        "#........P.........#",
        "#################..#",
        "#..................#",
        "############..######",
        "#.......#..........#",
        "#####..##########..#",
        "#..................#",
        "####################"
      ],
      "legend": {
        "#": {
          "type": "wall",
          "material": "stone"
        },
        "t": {
          "type": "wall",
          "material": "fleeting_stone"
        },
        "w": {
          "type": "wall",
          "material": "wedge-right"
        },
        ".": {
          "type": "empty"
        },
        "S": {
          "type": "start"
        },
        "P": {
          "type": "portal",
          "animation": "blackHole",
          "next": "B"
        }
      },
      "materials": {
        "stone": {
          "visual": "platformGradient",
          "color": [
            130,
            203,
            191
          ],
          "thickness": 15,
          "restitution": 0.5,
          "friction": 0.05
        },
        "fleeting_stone": {
          "visual": "platformGradient",
          "color": [
            255,
            255,
            255
          ],
          "thickness": 12,
          "restitution": 0.5,
          "friction": 0.05,
          "behavior": {
            "type": "timed_break",
            "break_after_ms": 1200,
            "blink_after_ms": 300
          }
        },
        "wedge-right": {
          "shape": "wedge",
          "direction": "right",
          "slope": 0.45,
          "visual": "platformWarm",
          "color": [
            244,
            194,
            122
          ],
          "thickness": 5,
          "restitution": 0.25,
          "friction": 0.02
        },
        "wedge-left": {
          "shape": "wedge",
          "direction": "left",
          "slope": 0.45,
          "visual": "platformWarm",
          "color": [
            244,
            194,
            122
          ],
          "thickness": 5,
          "restitution": 0.25,
          "friction": 0.02
        }
      },
      "start": {
        "tileX": 1,
        "tileY": 2,
        "x": 45.0,
        "y": 62.5
      },
      "portals": [
        {
          "id": "A-portal-P-9-16",
          "animation": "blackHole",
          "targetRoom": "B",
          "radius": 20.0,
          "symbol": "P",
          "tileX": 9,
          "tileY": 16,
          "x": 285.0,
          "y": 412.5
        }
      ],
      "visualShapes": [
        {
          "x": 0.0,
          "y": 5.0,
          "width": 600.0,
          "height": 15,
          "type": "wallBlock",
          "id": "A-stone-wall-1",
          "material": "stone",
          "visual": "platformGradient",
          "color": [
            130,
            203,
            191
          ],
          "thickness": 15,
          "radius": 0
        },
        {
          "x": 7.5,
          "y": 25.0,
          "width": 15,
          "height": 575.0,
          "type": "wallBlock",
          "id": "A-stone-wall-2",
          "material": "stone",
          "visual": "platformGradient",
          "color": [
            130,
            203,
            191
          ],
          "thickness": 15,
          "radius": 0
        },
        {
          "x": 577.5,
          "y": 25.0,
          "width": 15,
          "height": 575.0,
          "type": "wallBlock",
          "id": "A-stone-wall-3",
          "material": "stone",
          "visual": "platformGradient",
          "color": [
            130,
            203,
            191
          ],
          "thickness": 15,
          "radius": 0
        },
        {
          "x": 210.0,
          "y": 50.0,
          "width": 30.0,
          "height": 30.0,
          "type": "wedge",
          "id": "A-wedge-right-wall-4",
          "material": "wedge-right",
          "visual": "platformWarm",
          "color": [
            244,
            194,
            122
          ],
          "thickness": 5,
          "direction": "right",
          "slope": 0.45
        },
        {
          "x": 30.0,
          "y": 80.0,
          "width": 240.0,
          "height": 15,
          "type": "wallBlock",
          "id": "A-stone-wall-5",
          "material": "stone",
          "visual": "platformGradient",
          "color": [
            130,
            203,
            191
          ],
          "thickness": 15,
          "radius": 0
        },
        {
          "x": 360.0,
          "y": 80.0,
          "width": 210.0,
          "height": 15,
          "type": "wallBlock",
          "id": "A-stone-wall-7",
          "material": "stone",
          "visual": "platformGradient",
          "color": [
            130,
            203,
            191
          ],
          "thickness": 15,
          "radius": 0
        },
        {
          "x": 90.0,
          "y": 180.0,
          "width": 480.0,
          "height": 15,
          "type": "wallBlock",
          "id": "A-stone-wall-8",
          "material": "stone",
          "visual": "platformGradient",
          "color": [
            130,
            203,
            191
          ],
          "thickness": 15,
          "radius": 0
        },
        {
          "x": 30.0,
          "y": 230.0,
          "width": 120.0,
          "height": 15,
          "type": "wallBlock",
          "id": "A-stone-wall-9",
          "material": "stone",
          "visual": "platformGradient",
          "color": [
            130,
            203,
            191
          ],
          "thickness": 15,
          "radius": 0
        },
        {
          "x": 240.0,
          "y": 230.0,
          "width": 330.0,
          "height": 15,
          "type": "wallBlock",
          "id": "A-stone-wall-11",
          "material": "stone",
          "visual": "platformGradient",
          "color": [
            130,
            203,
            191
          ],
          "thickness": 15,
          "radius": 0
        },
        {
          "x": 30.0,
          "y": 280.0,
          "width": 330.0,
          "height": 15,
          "type": "wallBlock",
          "id": "A-stone-wall-12",
          "material": "stone",
          "visual": "platformGradient",
          "color": [
            130,
            203,
            191
          ],
          "thickness": 15,
          "radius": 0
        },
        {
          "x": 420.0,
          "y": 280.0,
          "width": 150.0,
          "height": 15,
          "type": "wallBlock",
          "id": "A-stone-wall-13",
          "material": "stone",
          "visual": "platformGradient",
          "color": [
            130,
            203,
            191
          ],
          "thickness": 15,
          "radius": 0
        },
        {
          "x": 30.0,
          "y": 330.0,
          "width": 480.0,
          "height": 15,
          "type": "wallBlock",
          "id": "A-stone-wall-14",
          "material": "stone",
          "visual": "platformGradient",
          "color": [
            130,
            203,
            191
          ],
          "thickness": 15,
          "radius": 0
        },
        {
          "x": 30.0,
          "y": 380.0,
          "width": 330.0,
          "height": 15,
          "type": "wallBlock",
          "id": "A-stone-wall-15",
          "material": "stone",
          "visual": "platformGradient",
          "color": [
            130,
            203,
            191
          ],
          "thickness": 15,
          "radius": 0
        },
        {
          "x": 420.0,
          "y": 380.0,
          "width": 150.0,
          "height": 15,
          "type": "wallBlock",
          "id": "A-stone-wall-16",
          "material": "stone",
          "visual": "platformGradient",
          "color": [
            130,
            203,
            191
          ],
          "thickness": 15,
          "radius": 0
        },
        {
          "x": 30.0,
          "y": 430.0,
          "width": 480.0,
          "height": 15,
          "type": "wallBlock",
          "id": "A-stone-wall-17",
          "material": "stone",
          "visual": "platformGradient",
          "color": [
            130,
            203,
            191
          ],
          "thickness": 15,
          "radius": 0
        },
        {
          "x": 30.0,
          "y": 480.0,
          "width": 330.0,
          "height": 15,
          "type": "wallBlock",
          "id": "A-stone-wall-18",
          "material": "stone",
          "visual": "platformGradient",
          "color": [
            130,
            203,
            191
          ],
          "thickness": 15,
          "radius": 0
        },
        {
          "x": 420.0,
          "y": 480.0,
          "width": 150.0,
          "height": 15,
          "type": "wallBlock",
          "id": "A-stone-wall-19",
          "material": "stone",
          "visual": "platformGradient",
          "color": [
            130,
            203,
            191
          ],
          "thickness": 15,
          "radius": 0
        },
        {
          "x": 247.5,
          "y": 500.0,
          "width": 15,
          "height": 50.0,
          "type": "wallBlock",
          "id": "A-stone-wall-20",
          "material": "stone",
          "visual": "platformGradient",
          "color": [
            130,
            203,
            191
          ],
          "thickness": 15,
          "radius": 0
        },
        {
          "x": 30.0,
          "y": 530.0,
          "width": 120.0,
          "height": 15,
          "type": "wallBlock",
          "id": "A-stone-wall-21",
          "material": "stone",
          "visual": "platformGradient",
          "color": [
            130,
            203,
            191
          ],
          "thickness": 15,
          "radius": 0
        },
        {
          "x": 210.0,
          "y": 530.0,
          "width": 30.0,
          "height": 15,
          "type": "wallBlock",
          "id": "A-stone-wall-22",
          "material": "stone",
          "visual": "platformGradient",
          "color": [
            130,
            203,
            191
          ],
          "thickness": 15,
          "radius": 0
        },
        {
          "x": 270.0,
          "y": 530.0,
          "width": 240.0,
          "height": 15,
          "type": "wallBlock",
          "id": "A-stone-wall-23",
          "material": "stone",
          "visual": "platformGradient",
          "color": [
            130,
            203,
            191
          ],
          "thickness": 15,
          "radius": 0
        },
        {
          "x": 30.0,
          "y": 580.0,
          "width": 540.0,
          "height": 15,
          "type": "wallBlock",
          "id": "A-stone-wall-24",
          "material": "stone",
          "visual": "platformGradient",
          "color": [
            130,
            203,
            191
          ],
          "thickness": 15,
          "radius": 0
        },
        {
          "type": "wallBridge",
          "path": "M15.0 12.5L45.0 12.5M15.0 12.5L15.0 37.5M45.0 12.5L75.0 12.5M75.0 12.5L105.0 12.5M105.0 12.5L135.0 12.5M135.0 12.5L165.0 12.5M165.0 12.5L195.0 12.5M195.0 12.5L225.0 12.5M225.0 12.5L255.0 12.5M255.0 12.5L285.0 12.5M285.0 12.5L315.0 12.5M315.0 12.5L345.0 12.5M345.0 12.5L375.0 12.5M375.0 12.5L405.0 12.5M405.0 12.5L435.0 12.5M435.0 12.5L465.0 12.5M465.0 12.5L495.0 12.5M495.0 12.5L525.0 12.5M525.0 12.5L555.0 12.5M555.0 12.5L585.0 12.5M585.0 12.5L585.0 37.5M15.0 37.5L15.0 62.5M585.0 37.5L585.0 62.5M15.0 62.5L15.0 87.5M585.0 62.5L585.0 87.5M15.0 87.5L45.0 87.5M15.0 87.5L15.0 112.5M45.0 87.5L75.0 87.5M75.0 87.5L105.0 87.5M105.0 87.5L135.0 87.5M135.0 87.5L165.0 87.5M165.0 87.5L195.0 87.5M195.0 87.5L225.0 87.5M225.0 87.5L255.0 87.5M375.0 87.5L405.0 87.5M405.0 87.5L435.0 87.5M435.0 87.5L465.0 87.5M465.0 87.5L495.0 87.5M495.0 87.5L525.0 87.5M525.0 87.5L555.0 87.5M555.0 87.5L585.0 87.5M585.0 87.5L585.0 112.5M15.0 112.5L15.0 137.5M585.0 112.5L585.0 137.5M15.0 137.5L15.0 162.5M585.0 137.5L585.0 162.5M15.0 162.5L15.0 187.5M585.0 162.5L585.0 187.5M15.0 187.5L15.0 212.5M105.0 187.5L135.0 187.5M135.0 187.5L165.0 187.5M165.0 187.5L195.0 187.5M195.0 187.5L225.0 187.5M225.0 187.5L255.0 187.5M255.0 187.5L285.0 187.5M285.0 187.5L315.0 187.5M315.0 187.5L345.0 187.5M345.0 187.5L375.0 187.5M375.0 187.5L405.0 187.5M405.0 187.5L435.0 187.5M435.0 187.5L465.0 187.5M465.0 187.5L495.0 187.5M495.0 187.5L525.0 187.5M525.0 187.5L555.0 187.5M555.0 187.5L585.0 187.5M585.0 187.5L585.0 212.5M15.0 212.5L15.0 237.5M585.0 212.5L585.0 237.5M15.0 237.5L45.0 237.5M15.0 237.5L15.0 262.5M45.0 237.5L75.0 237.5M75.0 237.5L105.0 237.5M105.0 237.5L135.0 237.5M255.0 237.5L285.0 237.5M285.0 237.5L315.0 237.5M315.0 237.5L345.0 237.5M345.0 237.5L375.0 237.5M375.0 237.5L405.0 237.5M405.0 237.5L435.0 237.5M435.0 237.5L465.0 237.5M465.0 237.5L495.0 237.5M495.0 237.5L525.0 237.5M525.0 237.5L555.0 237.5M555.0 237.5L585.0 237.5M585.0 237.5L585.0 262.5M15.0 262.5L15.0 287.5M585.0 262.5L585.0 287.5M15.0 287.5L45.0 287.5M15.0 287.5L15.0 312.5M45.0 287.5L75.0 287.5M75.0 287.5L105.0 287.5M105.0 287.5L135.0 287.5M135.0 287.5L165.0 287.5M165.0 287.5L195.0 287.5M195.0 287.5L225.0 287.5M225.0 287.5L255.0 287.5M255.0 287.5L285.0 287.5M285.0 287.5L315.0 287.5M315.0 287.5L345.0 287.5M435.0 287.5L465.0 287.5M465.0 287.5L495.0 287.5M495.0 287.5L525.0 287.5M525.0 287.5L555.0 287.5M555.0 287.5L585.0 287.5M585.0 287.5L585.0 312.5M15.0 312.5L15.0 337.5M585.0 312.5L585.0 337.5M15.0 337.5L45.0 337.5M15.0 337.5L15.0 362.5M45.0 337.5L75.0 337.5M75.0 337.5L105.0 337.5M105.0 337.5L135.0 337.5M135.0 337.5L165.0 337.5M165.0 337.5L195.0 337.5M195.0 337.5L225.0 337.5M225.0 337.5L255.0 337.5M255.0 337.5L285.0 337.5M285.0 337.5L315.0 337.5M315.0 337.5L345.0 337.5M345.0 337.5L375.0 337.5M375.0 337.5L405.0 337.5M405.0 337.5L435.0 337.5M435.0 337.5L465.0 337.5M465.0 337.5L495.0 337.5M585.0 337.5L585.0 362.5M15.0 362.5L15.0 387.5M585.0 362.5L585.0 387.5M15.0 387.5L45.0 387.5M15.0 387.5L15.0 412.5M45.0 387.5L75.0 387.5M75.0 387.5L105.0 387.5M105.0 387.5L135.0 387.5M135.0 387.5L165.0 387.5M165.0 387.5L195.0 387.5M195.0 387.5L225.0 387.5M225.0 387.5L255.0 387.5M255.0 387.5L285.0 387.5M285.0 387.5L315.0 387.5M315.0 387.5L345.0 387.5M435.0 387.5L465.0 387.5M465.0 387.5L495.0 387.5M495.0 387.5L525.0 387.5M525.0 387.5L555.0 387.5M555.0 387.5L585.0 387.5M585.0 387.5L585.0 412.5M15.0 412.5L15.0 437.5M585.0 412.5L585.0 437.5M15.0 437.5L45.0 437.5M15.0 437.5L15.0 462.5M45.0 437.5L75.0 437.5M75.0 437.5L105.0 437.5M105.0 437.5L135.0 437.5M135.0 437.5L165.0 437.5M165.0 437.5L195.0 437.5M195.0 437.5L225.0 437.5M225.0 437.5L255.0 437.5M255.0 437.5L285.0 437.5M285.0 437.5L315.0 437.5M315.0 437.5L345.0 437.5M345.0 437.5L375.0 437.5M375.0 437.5L405.0 437.5M405.0 437.5L435.0 437.5M435.0 437.5L465.0 437.5M465.0 437.5L495.0 437.5M585.0 437.5L585.0 462.5M15.0 462.5L15.0 487.5M585.0 462.5L585.0 487.5M15.0 487.5L45.0 487.5M15.0 487.5L15.0 512.5M45.0 487.5L75.0 487.5M75.0 487.5L105.0 487.5M105.0 487.5L135.0 487.5M135.0 487.5L165.0 487.5M165.0 487.5L195.0 487.5M195.0 487.5L225.0 487.5M225.0 487.5L255.0 487.5M255.0 487.5L285.0 487.5M255.0 487.5L255.0 512.5M285.0 487.5L315.0 487.5M315.0 487.5L345.0 487.5M435.0 487.5L465.0 487.5M465.0 487.5L495.0 487.5M495.0 487.5L525.0 487.5M525.0 487.5L555.0 487.5M555.0 487.5L585.0 487.5M585.0 487.5L585.0 512.5M15.0 512.5L15.0 537.5M255.0 512.5L255.0 537.5M585.0 512.5L585.0 537.5M15.0 537.5L45.0 537.5M15.0 537.5L15.0 562.5M45.0 537.5L75.0 537.5M75.0 537.5L105.0 537.5M105.0 537.5L135.0 537.5M225.0 537.5L255.0 537.5M255.0 537.5L285.0 537.5M285.0 537.5L315.0 537.5M315.0 537.5L345.0 537.5M345.0 537.5L375.0 537.5M375.0 537.5L405.0 537.5M405.0 537.5L435.0 537.5M435.0 537.5L465.0 537.5M465.0 537.5L495.0 537.5M585.0 537.5L585.0 562.5M15.0 562.5L15.0 587.5M585.0 562.5L585.0 587.5M15.0 587.5L45.0 587.5M45.0 587.5L75.0 587.5M75.0 587.5L105.0 587.5M105.0 587.5L135.0 587.5M135.0 587.5L165.0 587.5M165.0 587.5L195.0 587.5M195.0 587.5L225.0 587.5M225.0 587.5L255.0 587.5M255.0 587.5L285.0 587.5M285.0 587.5L315.0 587.5M315.0 587.5L345.0 587.5M345.0 587.5L375.0 587.5M375.0 587.5L405.0 587.5M405.0 587.5L435.0 587.5M435.0 587.5L465.0 587.5M465.0 587.5L495.0 587.5M495.0 587.5L525.0 587.5M525.0 587.5L555.0 587.5M555.0 587.5L585.0 587.5",
          "strokeWidth": 15,
          "material": "stone",
          "visual": "platformGradient",
          "color": [
            130,
            203,
            191
          ]
        },
        {
          "type": "wallCap",
          "cx": 270.0,
          "cy": 87.5,
          "radius": 7.5,
          "material": "stone",
          "visual": "platformGradient",
          "color": [
            130,
            203,
            191
          ]
        },
        {
          "type": "wallCap",
          "cx": 360.0,
          "cy": 87.5,
          "radius": 7.5,
          "material": "stone",
          "visual": "platformGradient",
          "color": [
            130,
            203,
            191
          ]
        },
        {
          "type": "wallCap",
          "cx": 90.0,
          "cy": 187.5,
          "radius": 7.5,
          "material": "stone",
          "visual": "platformGradient",
          "color": [
            130,
            203,
            191
          ]
        },
        {
          "type": "wallCap",
          "cx": 150.0,
          "cy": 237.5,
          "radius": 7.5,
          "material": "stone",
          "visual": "platformGradient",
          "color": [
            130,
            203,
            191
          ]
        },
        {
          "type": "wallCap",
          "cx": 240.0,
          "cy": 237.5,
          "radius": 7.5,
          "material": "stone",
          "visual": "platformGradient",
          "color": [
            130,
            203,
            191
          ]
        },
        {
          "type": "wallCap",
          "cx": 360.0,
          "cy": 287.5,
          "radius": 7.5,
          "material": "stone",
          "visual": "platformGradient",
          "color": [
            130,
            203,
            191
          ]
        },
        {
          "type": "wallCap",
          "cx": 420.0,
          "cy": 287.5,
          "radius": 7.5,
          "material": "stone",
          "visual": "platformGradient",
          "color": [
            130,
            203,
            191
          ]
        },
        {
          "type": "wallCap",
          "cx": 510.0,
          "cy": 337.5,
          "radius": 7.5,
          "material": "stone",
          "visual": "platformGradient",
          "color": [
            130,
            203,
            191
          ]
        },
        {
          "type": "wallCap",
          "cx": 360.0,
          "cy": 387.5,
          "radius": 7.5,
          "material": "stone",
          "visual": "platformGradient",
          "color": [
            130,
            203,
            191
          ]
        },
        {
          "type": "wallCap",
          "cx": 420.0,
          "cy": 387.5,
          "radius": 7.5,
          "material": "stone",
          "visual": "platformGradient",
          "color": [
            130,
            203,
            191
          ]
        },
        {
          "type": "wallCap",
          "cx": 510.0,
          "cy": 437.5,
          "radius": 7.5,
          "material": "stone",
          "visual": "platformGradient",
          "color": [
            130,
            203,
            191
          ]
        },
        {
          "type": "wallCap",
          "cx": 360.0,
          "cy": 487.5,
          "radius": 7.5,
          "material": "stone",
          "visual": "platformGradient",
          "color": [
            130,
            203,
            191
          ]
        },
        {
          "type": "wallCap",
          "cx": 420.0,
          "cy": 487.5,
          "radius": 7.5,
          "material": "stone",
          "visual": "platformGradient",
          "color": [
            130,
            203,
            191
          ]
        },
        {
          "type": "wallCap",
          "cx": 150.0,
          "cy": 537.5,
          "radius": 7.5,
          "material": "stone",
          "visual": "platformGradient",
          "color": [
            130,
            203,
            191
          ]
        },
        {
          "type": "wallCap",
          "cx": 210.0,
          "cy": 537.5,
          "radius": 7.5,
          "material": "stone",
          "visual": "platformGradient",
          "color": [
            130,
            203,
            191
          ]
        },
        {
          "type": "wallCap",
          "cx": 510.0,
          "cy": 537.5,
          "radius": 7.5,
          "material": "stone",
          "visual": "platformGradient",
          "color": [
            130,
            203,
            191
          ]
        }
      ],
      "objects": [
        {
          "type": "wall",
          "symbol": "#",
          "material": "stone",
          "tileX": 0,
          "tileY": 0,
          "tileWidth": 20,
          "tileHeight": 1,
          "x": 0.0,
          "y": 5.0,
          "width": 600.0,
          "height": 15,
          "id": "A-stone-wall-1",
          "shape": "rect",
          "direction": "right",
          "slope": null,
          "visual": "platformGradient",
          "color": [
            130,
            203,
            191
          ],
          "materialName": "stone",
          "thickness": 15,
          "friction": 0.05,
          "frictionStatic": 0.05,
          "restitution": 0.5,
          "behavior": null
        },
        {
          "type": "wall",
          "symbol": "#",
          "material": "stone",
          "tileX": 0,
          "tileY": 1,
          "tileWidth": 1,
          "tileHeight": 23,
          "x": 7.5,
          "y": 25.0,
          "width": 15,
          "height": 575.0,
          "id": "A-stone-wall-2",
          "shape": "rect",
          "direction": "right",
          "slope": null,
          "visual": "platformGradient",
          "color": [
            130,
            203,
            191
          ],
          "materialName": "stone",
          "thickness": 15,
          "friction": 0.05,
          "frictionStatic": 0.05,
          "restitution": 0.5,
          "behavior": null
        },
        {
          "type": "wall",
          "symbol": "#",
          "material": "stone",
          "tileX": 19,
          "tileY": 1,
          "tileWidth": 1,
          "tileHeight": 23,
          "x": 577.5,
          "y": 25.0,
          "width": 15,
          "height": 575.0,
          "id": "A-stone-wall-3",
          "shape": "rect",
          "direction": "right",
          "slope": null,
          "visual": "platformGradient",
          "color": [
            130,
            203,
            191
          ],
          "materialName": "stone",
          "thickness": 15,
          "friction": 0.05,
          "frictionStatic": 0.05,
          "restitution": 0.5,
          "behavior": null
        },
        {
          "type": "wall",
          "symbol": "w",
          "material": "wedge-right",
          "tileX": 7,
          "tileY": 2,
          "tileWidth": 1,
          "tileHeight": 1,
          "x": 210.0,
          "y": 50.0,
          "width": 30.0,
          "height": 30.0,
          "id": "A-wedge-right-wall-4",
          "shape": "wedge",
          "direction": "right",
          "slope": 0.45,
          "visual": "platformWarm",
          "color": [
            244,
            194,
            122
          ],
          "materialName": "wedge-right",
          "thickness": 5,
          "friction": 0.02,
          "frictionStatic": 0.02,
          "restitution": 0.25,
          "behavior": null
        },
        {
          "type": "wall",
          "symbol": "#",
          "material": "stone",
          "tileX": 1,
          "tileY": 3,
          "tileWidth": 8,
          "tileHeight": 1,
          "x": 30.0,
          "y": 80.0,
          "width": 240.0,
          "height": 15,
          "id": "A-stone-wall-5",
          "shape": "rect",
          "direction": "right",
          "slope": null,
          "visual": "platformGradient",
          "color": [
            130,
            203,
            191
          ],
          "materialName": "stone",
          "thickness": 15,
          "friction": 0.05,
          "frictionStatic": 0.05,
          "restitution": 0.5,
          "behavior": null
        },
        {
          "type": "wall",
          "symbol": "t",
          "material": "fleeting_stone",
          "tileX": 9,
          "tileY": 3,
          "tileWidth": 3,
          "tileHeight": 1,
          "x": 270.0,
          "y": 81.5,
          "width": 90.0,
          "height": 12,
          "id": "A-fleeting_stone-wall-6",
          "shape": "rect",
          "direction": "right",
          "slope": null,
          "visual": "platformGradient",
          "color": [
            255,
            255,
            255
          ],
          "materialName": "fleeting_stone",
          "thickness": 12,
          "friction": 0.05,
          "frictionStatic": 0.05,
          "restitution": 0.5,
          "behavior": {
            "type": "timed_break",
            "break_after_ms": 1200,
            "blink_after_ms": 300
          }
        },
        {
          "type": "wall",
          "symbol": "#",
          "material": "stone",
          "tileX": 12,
          "tileY": 3,
          "tileWidth": 7,
          "tileHeight": 1,
          "x": 360.0,
          "y": 80.0,
          "width": 210.0,
          "height": 15,
          "id": "A-stone-wall-7",
          "shape": "rect",
          "direction": "right",
          "slope": null,
          "visual": "platformGradient",
          "color": [
            130,
            203,
            191
          ],
          "materialName": "stone",
          "thickness": 15,
          "friction": 0.05,
          "frictionStatic": 0.05,
          "restitution": 0.5,
          "behavior": null
        },
        {
          "type": "wall",
          "symbol": "#",
          "material": "stone",
          "tileX": 3,
          "tileY": 7,
          "tileWidth": 16,
          "tileHeight": 1,
          "x": 90.0,
          "y": 180.0,
          "width": 480.0,
          "height": 15,
          "id": "A-stone-wall-8",
          "shape": "rect",
          "direction": "right",
          "slope": null,
          "visual": "platformGradient",
          "color": [
            130,
            203,
            191
          ],
          "materialName": "stone",
          "thickness": 15,
          "friction": 0.05,
          "frictionStatic": 0.05,
          "restitution": 0.5,
          "behavior": null
        },
        {
          "type": "wall",
          "symbol": "#",
          "material": "stone",
          "tileX": 1,
          "tileY": 9,
          "tileWidth": 4,
          "tileHeight": 1,
          "x": 30.0,
          "y": 230.0,
          "width": 120.0,
          "height": 15,
          "id": "A-stone-wall-9",
          "shape": "rect",
          "direction": "right",
          "slope": null,
          "visual": "platformGradient",
          "color": [
            130,
            203,
            191
          ],
          "materialName": "stone",
          "thickness": 15,
          "friction": 0.05,
          "frictionStatic": 0.05,
          "restitution": 0.5,
          "behavior": null
        },
        {
          "type": "wall",
          "symbol": "t",
          "material": "fleeting_stone",
          "tileX": 5,
          "tileY": 9,
          "tileWidth": 3,
          "tileHeight": 1,
          "x": 150.0,
          "y": 231.5,
          "width": 90.0,
          "height": 12,
          "id": "A-fleeting_stone-wall-10",
          "shape": "rect",
          "direction": "right",
          "slope": null,
          "visual": "platformGradient",
          "color": [
            255,
            255,
            255
          ],
          "materialName": "fleeting_stone",
          "thickness": 12,
          "friction": 0.05,
          "frictionStatic": 0.05,
          "restitution": 0.5,
          "behavior": {
            "type": "timed_break",
            "break_after_ms": 1200,
            "blink_after_ms": 300
          }
        },
        {
          "type": "wall",
          "symbol": "#",
          "material": "stone",
          "tileX": 8,
          "tileY": 9,
          "tileWidth": 11,
          "tileHeight": 1,
          "x": 240.0,
          "y": 230.0,
          "width": 330.0,
          "height": 15,
          "id": "A-stone-wall-11",
          "shape": "rect",
          "direction": "right",
          "slope": null,
          "visual": "platformGradient",
          "color": [
            130,
            203,
            191
          ],
          "materialName": "stone",
          "thickness": 15,
          "friction": 0.05,
          "frictionStatic": 0.05,
          "restitution": 0.5,
          "behavior": null
        },
        {
          "type": "wall",
          "symbol": "#",
          "material": "stone",
          "tileX": 1,
          "tileY": 11,
          "tileWidth": 11,
          "tileHeight": 1,
          "x": 30.0,
          "y": 280.0,
          "width": 330.0,
          "height": 15,
          "id": "A-stone-wall-12",
          "shape": "rect",
          "direction": "right",
          "slope": null,
          "visual": "platformGradient",
          "color": [
            130,
            203,
            191
          ],
          "materialName": "stone",
          "thickness": 15,
          "friction": 0.05,
          "frictionStatic": 0.05,
          "restitution": 0.5,
          "behavior": null
        },
        {
          "type": "wall",
          "symbol": "#",
          "material": "stone",
          "tileX": 14,
          "tileY": 11,
          "tileWidth": 5,
          "tileHeight": 1,
          "x": 420.0,
          "y": 280.0,
          "width": 150.0,
          "height": 15,
          "id": "A-stone-wall-13",
          "shape": "rect",
          "direction": "right",
          "slope": null,
          "visual": "platformGradient",
          "color": [
            130,
            203,
            191
          ],
          "materialName": "stone",
          "thickness": 15,
          "friction": 0.05,
          "frictionStatic": 0.05,
          "restitution": 0.5,
          "behavior": null
        },
        {
          "type": "wall",
          "symbol": "#",
          "material": "stone",
          "tileX": 1,
          "tileY": 13,
          "tileWidth": 16,
          "tileHeight": 1,
          "x": 30.0,
          "y": 330.0,
          "width": 480.0,
          "height": 15,
          "id": "A-stone-wall-14",
          "shape": "rect",
          "direction": "right",
          "slope": null,
          "visual": "platformGradient",
          "color": [
            130,
            203,
            191
          ],
          "materialName": "stone",
          "thickness": 15,
          "friction": 0.05,
          "frictionStatic": 0.05,
          "restitution": 0.5,
          "behavior": null
        },
        {
          "type": "wall",
          "symbol": "#",
          "material": "stone",
          "tileX": 1,
          "tileY": 15,
          "tileWidth": 11,
          "tileHeight": 1,
          "x": 30.0,
          "y": 380.0,
          "width": 330.0,
          "height": 15,
          "id": "A-stone-wall-15",
          "shape": "rect",
          "direction": "right",
          "slope": null,
          "visual": "platformGradient",
          "color": [
            130,
            203,
            191
          ],
          "materialName": "stone",
          "thickness": 15,
          "friction": 0.05,
          "frictionStatic": 0.05,
          "restitution": 0.5,
          "behavior": null
        },
        {
          "type": "wall",
          "symbol": "#",
          "material": "stone",
          "tileX": 14,
          "tileY": 15,
          "tileWidth": 5,
          "tileHeight": 1,
          "x": 420.0,
          "y": 380.0,
          "width": 150.0,
          "height": 15,
          "id": "A-stone-wall-16",
          "shape": "rect",
          "direction": "right",
          "slope": null,
          "visual": "platformGradient",
          "color": [
            130,
            203,
            191
          ],
          "materialName": "stone",
          "thickness": 15,
          "friction": 0.05,
          "frictionStatic": 0.05,
          "restitution": 0.5,
          "behavior": null
        },
        {
          "type": "wall",
          "symbol": "#",
          "material": "stone",
          "tileX": 1,
          "tileY": 17,
          "tileWidth": 16,
          "tileHeight": 1,
          "x": 30.0,
          "y": 430.0,
          "width": 480.0,
          "height": 15,
          "id": "A-stone-wall-17",
          "shape": "rect",
          "direction": "right",
          "slope": null,
          "visual": "platformGradient",
          "color": [
            130,
            203,
            191
          ],
          "materialName": "stone",
          "thickness": 15,
          "friction": 0.05,
          "frictionStatic": 0.05,
          "restitution": 0.5,
          "behavior": null
        },
        {
          "type": "wall",
          "symbol": "#",
          "material": "stone",
          "tileX": 1,
          "tileY": 19,
          "tileWidth": 11,
          "tileHeight": 1,
          "x": 30.0,
          "y": 480.0,
          "width": 330.0,
          "height": 15,
          "id": "A-stone-wall-18",
          "shape": "rect",
          "direction": "right",
          "slope": null,
          "visual": "platformGradient",
          "color": [
            130,
            203,
            191
          ],
          "materialName": "stone",
          "thickness": 15,
          "friction": 0.05,
          "frictionStatic": 0.05,
          "restitution": 0.5,
          "behavior": null
        },
        {
          "type": "wall",
          "symbol": "#",
          "material": "stone",
          "tileX": 14,
          "tileY": 19,
          "tileWidth": 5,
          "tileHeight": 1,
          "x": 420.0,
          "y": 480.0,
          "width": 150.0,
          "height": 15,
          "id": "A-stone-wall-19",
          "shape": "rect",
          "direction": "right",
          "slope": null,
          "visual": "platformGradient",
          "color": [
            130,
            203,
            191
          ],
          "materialName": "stone",
          "thickness": 15,
          "friction": 0.05,
          "frictionStatic": 0.05,
          "restitution": 0.5,
          "behavior": null
        },
        {
          "type": "wall",
          "symbol": "#",
          "material": "stone",
          "tileX": 8,
          "tileY": 20,
          "tileWidth": 1,
          "tileHeight": 2,
          "x": 247.5,
          "y": 500.0,
          "width": 15,
          "height": 50.0,
          "id": "A-stone-wall-20",
          "shape": "rect",
          "direction": "right",
          "slope": null,
          "visual": "platformGradient",
          "color": [
            130,
            203,
            191
          ],
          "materialName": "stone",
          "thickness": 15,
          "friction": 0.05,
          "frictionStatic": 0.05,
          "restitution": 0.5,
          "behavior": null
        },
        {
          "type": "wall",
          "symbol": "#",
          "material": "stone",
          "tileX": 1,
          "tileY": 21,
          "tileWidth": 4,
          "tileHeight": 1,
          "x": 30.0,
          "y": 530.0,
          "width": 120.0,
          "height": 15,
          "id": "A-stone-wall-21",
          "shape": "rect",
          "direction": "right",
          "slope": null,
          "visual": "platformGradient",
          "color": [
            130,
            203,
            191
          ],
          "materialName": "stone",
          "thickness": 15,
          "friction": 0.05,
          "frictionStatic": 0.05,
          "restitution": 0.5,
          "behavior": null
        },
        {
          "type": "wall",
          "symbol": "#",
          "material": "stone",
          "tileX": 7,
          "tileY": 21,
          "tileWidth": 1,
          "tileHeight": 1,
          "x": 210.0,
          "y": 530.0,
          "width": 30.0,
          "height": 15,
          "id": "A-stone-wall-22",
          "shape": "rect",
          "direction": "right",
          "slope": null,
          "visual": "platformGradient",
          "color": [
            130,
            203,
            191
          ],
          "materialName": "stone",
          "thickness": 15,
          "friction": 0.05,
          "frictionStatic": 0.05,
          "restitution": 0.5,
          "behavior": null
        },
        {
          "type": "wall",
          "symbol": "#",
          "material": "stone",
          "tileX": 9,
          "tileY": 21,
          "tileWidth": 8,
          "tileHeight": 1,
          "x": 270.0,
          "y": 530.0,
          "width": 240.0,
          "height": 15,
          "id": "A-stone-wall-23",
          "shape": "rect",
          "direction": "right",
          "slope": null,
          "visual": "platformGradient",
          "color": [
            130,
            203,
            191
          ],
          "materialName": "stone",
          "thickness": 15,
          "friction": 0.05,
          "frictionStatic": 0.05,
          "restitution": 0.5,
          "behavior": null
        },
        {
          "type": "wall",
          "symbol": "#",
          "material": "stone",
          "tileX": 1,
          "tileY": 23,
          "tileWidth": 18,
          "tileHeight": 1,
          "x": 30.0,
          "y": 580.0,
          "width": 540.0,
          "height": 15,
          "id": "A-stone-wall-24",
          "shape": "rect",
          "direction": "right",
          "slope": null,
          "visual": "platformGradient",
          "color": [
            130,
            203,
            191
          ],
          "materialName": "stone",
          "thickness": 15,
          "friction": 0.05,
          "frictionStatic": 0.05,
          "restitution": 0.5,
          "behavior": null
        }
      ]
    },
    "B": {
      "id": "B",
      "name": "Arrival Chamber",
      "path": "levelB.yaml",
      "next": null,
      "version": 1,
      "size": 600,
      "ball": {
        "diameter": 20
      },
      "cols": 20,
      "rows": 13,
      "tileWidth": 30.0,
      "tileHeight": 46.15384615384615,
      "map": [
        "#S##################",
        "#................P..",
        "#########ttt########",
        "....................",
        "...#################",
        "....................",
        "#################...",
        "....................",
        "...#################",
        "....................",
        "#################...",
        "P...................",
        "####################"
      ],
      "legend": {
        "#": {
          "type": "wall",
          "material": "stone"
        },
        "t": {
          "type": "wall",
          "material": "fleeting_stone"
        },
        "w": {
          "type": "wall",
          "material": "wedge-left"
        },
        ".": {
          "type": "empty"
        },
        "S": {
          "type": "start"
        },
        "P": {
          "type": "portal",
          "animation": "blackHole",
          "next": "A"
        }
      },
      "materials": {
        "stone": {
          "visual": "platformGradient",
          "color": [
            130,
            203,
            191
          ],
          "thickness": 15,
          "restitution": 0.5,
          "friction": 0.05
        },
        "fleeting_stone": {
          "visual": "platformGradient",
          "color": [
            255,
            255,
            255
          ],
          "thickness": 12,
          "restitution": 0.5,
          "friction": 0.05,
          "behavior": {
            "type": "timed_break",
            "break_after_ms": 1200,
            "blink_after_ms": 300
          }
        },
        "wedge-right": {
          "shape": "wedge",
          "direction": "right",
          "slope": 0.45,
          "visual": "platformWarm",
          "color": [
            244,
            194,
            122
          ],
          "thickness": 5,
          "restitution": 0.25,
          "friction": 0.02
        },
        "wedge-left": {
          "shape": "wedge",
          "direction": "left",
          "slope": 0.45,
          "visual": "platformWarm",
          "color": [
            244,
            194,
            122
          ],
          "thickness": 5,
          "restitution": 0.25,
          "friction": 0.02
        }
      },
      "start": {
        "tileX": 1,
        "tileY": 0,
        "x": 45.0,
        "y": 23.076923076923077
      },
      "portals": [
        {
          "id": "B-portal-P-17-1",
          "animation": "blackHole",
          "targetRoom": "A",
          "radius": 24.0,
          "symbol": "P",
          "tileX": 17,
          "tileY": 1,
          "x": 525.0,
          "y": 69.23076923076923
        },
        {
          "id": "B-portal-P-0-11",
          "animation": "blackHole",
          "targetRoom": "A",
          "radius": 24.0,
          "symbol": "P",
          "tileX": 0,
          "tileY": 11,
          "x": 15.0,
          "y": 530.7692307692307
        }
      ],
      "visualShapes": [
        {
          "x": 7.5,
          "y": 0.0,
          "width": 15,
          "height": 138.46153846153845,
          "type": "wallBlock",
          "id": "B-stone-wall-1",
          "material": "stone",
          "visual": "platformGradient",
          "color": [
            130,
            203,
            191
          ],
          "thickness": 15,
          "radius": 0
        },
        {
          "x": 60.0,
          "y": 15.576923076923077,
          "width": 540.0,
          "height": 15,
          "type": "wallBlock",
          "id": "B-stone-wall-2",
          "material": "stone",
          "visual": "platformGradient",
          "color": [
            130,
            203,
            191
          ],
          "thickness": 15,
          "radius": 0
        },
        {
          "x": 30.0,
          "y": 107.88461538461539,
          "width": 240.0,
          "height": 15,
          "type": "wallBlock",
          "id": "B-stone-wall-3",
          "material": "stone",
          "visual": "platformGradient",
          "color": [
            130,
            203,
            191
          ],
          "thickness": 15,
          "radius": 0
        },
        {
          "x": 360.0,
          "y": 107.88461538461539,
          "width": 240.0,
          "height": 15,
          "type": "wallBlock",
          "id": "B-stone-wall-5",
          "material": "stone",
          "visual": "platformGradient",
          "color": [
            130,
            203,
            191
          ],
          "thickness": 15,
          "radius": 0
        },
        {
          "x": 90.0,
          "y": 200.19230769230768,
          "width": 510.0,
          "height": 15,
          "type": "wallBlock",
          "id": "B-stone-wall-6",
          "material": "stone",
          "visual": "platformGradient",
          "color": [
            130,
            203,
            191
          ],
          "thickness": 15,
          "radius": 0
        },
        {
          "x": 0.0,
          "y": 292.5,
          "width": 510.0,
          "height": 15,
          "type": "wallBlock",
          "id": "B-stone-wall-7",
          "material": "stone",
          "visual": "platformGradient",
          "color": [
            130,
            203,
            191
          ],
          "thickness": 15,
          "radius": 0
        },
        {
          "x": 90.0,
          "y": 384.8076923076923,
          "width": 510.0,
          "height": 15,
          "type": "wallBlock",
          "id": "B-stone-wall-8",
          "material": "stone",
          "visual": "platformGradient",
          "color": [
            130,
            203,
            191
          ],
          "thickness": 15,
          "radius": 0
        },
        {
          "x": 0.0,
          "y": 477.11538461538464,
          "width": 510.0,
          "height": 15,
          "type": "wallBlock",
          "id": "B-stone-wall-9",
          "material": "stone",
          "visual": "platformGradient",
          "color": [
            130,
            203,
            191
          ],
          "thickness": 15,
          "radius": 0
        },
        {
          "x": 0.0,
          "y": 569.4230769230769,
          "width": 600.0,
          "height": 15,
          "type": "wallBlock",
          "id": "B-stone-wall-10",
          "material": "stone",
          "visual": "platformGradient",
          "color": [
            130,
            203,
            191
          ],
          "thickness": 15,
          "radius": 0
        },
        {
          "type": "wallBridge",
          "path": "M15.0 23.077L15.0 69.231M75.0 23.077L105.0 23.077M105.0 23.077L135.0 23.077M135.0 23.077L165.0 23.077M165.0 23.077L195.0 23.077M195.0 23.077L225.0 23.077M225.0 23.077L255.0 23.077M255.0 23.077L285.0 23.077M285.0 23.077L315.0 23.077M315.0 23.077L345.0 23.077M345.0 23.077L375.0 23.077M375.0 23.077L405.0 23.077M405.0 23.077L435.0 23.077M435.0 23.077L465.0 23.077M465.0 23.077L495.0 23.077M495.0 23.077L525.0 23.077M525.0 23.077L555.0 23.077M555.0 23.077L585.0 23.077M15.0 69.231L15.0 115.385M15.0 115.385L45.0 115.385M45.0 115.385L75.0 115.385M75.0 115.385L105.0 115.385M105.0 115.385L135.0 115.385M135.0 115.385L165.0 115.385M165.0 115.385L195.0 115.385M195.0 115.385L225.0 115.385M225.0 115.385L255.0 115.385M375.0 115.385L405.0 115.385M405.0 115.385L435.0 115.385M435.0 115.385L465.0 115.385M465.0 115.385L495.0 115.385M495.0 115.385L525.0 115.385M525.0 115.385L555.0 115.385M555.0 115.385L585.0 115.385M105.0 207.692L135.0 207.692M135.0 207.692L165.0 207.692M165.0 207.692L195.0 207.692M195.0 207.692L225.0 207.692M225.0 207.692L255.0 207.692M255.0 207.692L285.0 207.692M285.0 207.692L315.0 207.692M315.0 207.692L345.0 207.692M345.0 207.692L375.0 207.692M375.0 207.692L405.0 207.692M405.0 207.692L435.0 207.692M435.0 207.692L465.0 207.692M465.0 207.692L495.0 207.692M495.0 207.692L525.0 207.692M525.0 207.692L555.0 207.692M555.0 207.692L585.0 207.692M15.0 300.0L45.0 300.0M45.0 300.0L75.0 300.0M75.0 300.0L105.0 300.0M105.0 300.0L135.0 300.0M135.0 300.0L165.0 300.0M165.0 300.0L195.0 300.0M195.0 300.0L225.0 300.0M225.0 300.0L255.0 300.0M255.0 300.0L285.0 300.0M285.0 300.0L315.0 300.0M315.0 300.0L345.0 300.0M345.0 300.0L375.0 300.0M375.0 300.0L405.0 300.0M405.0 300.0L435.0 300.0M435.0 300.0L465.0 300.0M465.0 300.0L495.0 300.0M105.0 392.308L135.0 392.308M135.0 392.308L165.0 392.308M165.0 392.308L195.0 392.308M195.0 392.308L225.0 392.308M225.0 392.308L255.0 392.308M255.0 392.308L285.0 392.308M285.0 392.308L315.0 392.308M315.0 392.308L345.0 392.308M345.0 392.308L375.0 392.308M375.0 392.308L405.0 392.308M405.0 392.308L435.0 392.308M435.0 392.308L465.0 392.308M465.0 392.308L495.0 392.308M495.0 392.308L525.0 392.308M525.0 392.308L555.0 392.308M555.0 392.308L585.0 392.308M15.0 484.615L45.0 484.615M45.0 484.615L75.0 484.615M75.0 484.615L105.0 484.615M105.0 484.615L135.0 484.615M135.0 484.615L165.0 484.615M165.0 484.615L195.0 484.615M195.0 484.615L225.0 484.615M225.0 484.615L255.0 484.615M255.0 484.615L285.0 484.615M285.0 484.615L315.0 484.615M315.0 484.615L345.0 484.615M345.0 484.615L375.0 484.615M375.0 484.615L405.0 484.615M405.0 484.615L435.0 484.615M435.0 484.615L465.0 484.615M465.0 484.615L495.0 484.615M15.0 576.923L45.0 576.923M45.0 576.923L75.0 576.923M75.0 576.923L105.0 576.923M105.0 576.923L135.0 576.923M135.0 576.923L165.0 576.923M165.0 576.923L195.0 576.923M195.0 576.923L225.0 576.923M225.0 576.923L255.0 576.923M255.0 576.923L285.0 576.923M285.0 576.923L315.0 576.923M315.0 576.923L345.0 576.923M345.0 576.923L375.0 576.923M375.0 576.923L405.0 576.923M405.0 576.923L435.0 576.923M435.0 576.923L465.0 576.923M465.0 576.923L495.0 576.923M495.0 576.923L525.0 576.923M525.0 576.923L555.0 576.923M555.0 576.923L585.0 576.923",
          "strokeWidth": 15,
          "material": "stone",
          "visual": "platformGradient",
          "color": [
            130,
            203,
            191
          ]
        },
        {
          "type": "wallCap",
          "cx": 15.0,
          "cy": 0.0,
          "radius": 7.5,
          "material": "stone",
          "visual": "platformGradient",
          "color": [
            130,
            203,
            191
          ]
        },
        {
          "type": "wallCap",
          "cx": 60.0,
          "cy": 23.076923076923077,
          "radius": 7.5,
          "material": "stone",
          "visual": "platformGradient",
          "color": [
            130,
            203,
            191
          ]
        },
        {
          "type": "wallCap",
          "cx": 600.0,
          "cy": 23.076923076923077,
          "radius": 7.5,
          "material": "stone",
          "visual": "platformGradient",
          "color": [
            130,
            203,
            191
          ]
        },
        {
          "type": "wallCap",
          "cx": 270.0,
          "cy": 115.38461538461539,
          "radius": 7.5,
          "material": "stone",
          "visual": "platformGradient",
          "color": [
            130,
            203,
            191
          ]
        },
        {
          "type": "wallCap",
          "cx": 360.0,
          "cy": 115.38461538461539,
          "radius": 7.5,
          "material": "stone",
          "visual": "platformGradient",
          "color": [
            130,
            203,
            191
          ]
        },
        {
          "type": "wallCap",
          "cx": 600.0,
          "cy": 115.38461538461539,
          "radius": 7.5,
          "material": "stone",
          "visual": "platformGradient",
          "color": [
            130,
            203,
            191
          ]
        },
        {
          "type": "wallCap",
          "cx": 90.0,
          "cy": 207.69230769230768,
          "radius": 7.5,
          "material": "stone",
          "visual": "platformGradient",
          "color": [
            130,
            203,
            191
          ]
        },
        {
          "type": "wallCap",
          "cx": 600.0,
          "cy": 207.69230769230768,
          "radius": 7.5,
          "material": "stone",
          "visual": "platformGradient",
          "color": [
            130,
            203,
            191
          ]
        },
        {
          "type": "wallCap",
          "cx": 0.0,
          "cy": 300.0,
          "radius": 7.5,
          "material": "stone",
          "visual": "platformGradient",
          "color": [
            130,
            203,
            191
          ]
        },
        {
          "type": "wallCap",
          "cx": 510.0,
          "cy": 300.0,
          "radius": 7.5,
          "material": "stone",
          "visual": "platformGradient",
          "color": [
            130,
            203,
            191
          ]
        },
        {
          "type": "wallCap",
          "cx": 90.0,
          "cy": 392.3076923076923,
          "radius": 7.5,
          "material": "stone",
          "visual": "platformGradient",
          "color": [
            130,
            203,
            191
          ]
        },
        {
          "type": "wallCap",
          "cx": 600.0,
          "cy": 392.3076923076923,
          "radius": 7.5,
          "material": "stone",
          "visual": "platformGradient",
          "color": [
            130,
            203,
            191
          ]
        },
        {
          "type": "wallCap",
          "cx": 0.0,
          "cy": 484.6153846153846,
          "radius": 7.5,
          "material": "stone",
          "visual": "platformGradient",
          "color": [
            130,
            203,
            191
          ]
        },
        {
          "type": "wallCap",
          "cx": 510.0,
          "cy": 484.6153846153846,
          "radius": 7.5,
          "material": "stone",
          "visual": "platformGradient",
          "color": [
            130,
            203,
            191
          ]
        },
        {
          "type": "wallCap",
          "cx": 0.0,
          "cy": 576.9230769230769,
          "radius": 7.5,
          "material": "stone",
          "visual": "platformGradient",
          "color": [
            130,
            203,
            191
          ]
        },
        {
          "type": "wallCap",
          "cx": 600.0,
          "cy": 576.9230769230769,
          "radius": 7.5,
          "material": "stone",
          "visual": "platformGradient",
          "color": [
            130,
            203,
            191
          ]
        }
      ],
      "objects": [
        {
          "type": "wall",
          "symbol": "#",
          "material": "stone",
          "tileX": 0,
          "tileY": 0,
          "tileWidth": 1,
          "tileHeight": 3,
          "x": 7.5,
          "y": 0.0,
          "width": 15,
          "height": 138.46153846153845,
          "id": "B-stone-wall-1",
          "shape": "rect",
          "direction": "right",
          "slope": null,
          "visual": "platformGradient",
          "color": [
            130,
            203,
            191
          ],
          "materialName": "stone",
          "thickness": 15,
          "friction": 0.05,
          "frictionStatic": 0.05,
          "restitution": 0.5,
          "behavior": null
        },
        {
          "type": "wall",
          "symbol": "#",
          "material": "stone",
          "tileX": 2,
          "tileY": 0,
          "tileWidth": 18,
          "tileHeight": 1,
          "x": 60.0,
          "y": 15.576923076923077,
          "width": 540.0,
          "height": 15,
          "id": "B-stone-wall-2",
          "shape": "rect",
          "direction": "right",
          "slope": null,
          "visual": "platformGradient",
          "color": [
            130,
            203,
            191
          ],
          "materialName": "stone",
          "thickness": 15,
          "friction": 0.05,
          "frictionStatic": 0.05,
          "restitution": 0.5,
          "behavior": null
        },
        {
          "type": "wall",
          "symbol": "#",
          "material": "stone",
          "tileX": 1,
          "tileY": 2,
          "tileWidth": 8,
          "tileHeight": 1,
          "x": 30.0,
          "y": 107.88461538461539,
          "width": 240.0,
          "height": 15,
          "id": "B-stone-wall-3",
          "shape": "rect",
          "direction": "right",
          "slope": null,
          "visual": "platformGradient",
          "color": [
            130,
            203,
            191
          ],
          "materialName": "stone",
          "thickness": 15,
          "friction": 0.05,
          "frictionStatic": 0.05,
          "restitution": 0.5,
          "behavior": null
        },
        {
          "type": "wall",
          "symbol": "t",
          "material": "fleeting_stone",
          "tileX": 9,
          "tileY": 2,
          "tileWidth": 3,
          "tileHeight": 1,
          "x": 270.0,
          "y": 109.38461538461539,
          "width": 90.0,
          "height": 12,
          "id": "B-fleeting_stone-wall-4",
          "shape": "rect",
          "direction": "right",
          "slope": null,
          "visual": "platformGradient",
          "color": [
            255,
            255,
            255
          ],
          "materialName": "fleeting_stone",
          "thickness": 12,
          "friction": 0.05,
          "frictionStatic": 0.05,
          "restitution": 0.5,
          "behavior": {
            "type": "timed_break",
            "break_after_ms": 1200,
            "blink_after_ms": 300
          }
        },
        {
          "type": "wall",
          "symbol": "#",
          "material": "stone",
          "tileX": 12,
          "tileY": 2,
          "tileWidth": 8,
          "tileHeight": 1,
          "x": 360.0,
          "y": 107.88461538461539,
          "width": 240.0,
          "height": 15,
          "id": "B-stone-wall-5",
          "shape": "rect",
          "direction": "right",
          "slope": null,
          "visual": "platformGradient",
          "color": [
            130,
            203,
            191
          ],
          "materialName": "stone",
          "thickness": 15,
          "friction": 0.05,
          "frictionStatic": 0.05,
          "restitution": 0.5,
          "behavior": null
        },
        {
          "type": "wall",
          "symbol": "#",
          "material": "stone",
          "tileX": 3,
          "tileY": 4,
          "tileWidth": 17,
          "tileHeight": 1,
          "x": 90.0,
          "y": 200.19230769230768,
          "width": 510.0,
          "height": 15,
          "id": "B-stone-wall-6",
          "shape": "rect",
          "direction": "right",
          "slope": null,
          "visual": "platformGradient",
          "color": [
            130,
            203,
            191
          ],
          "materialName": "stone",
          "thickness": 15,
          "friction": 0.05,
          "frictionStatic": 0.05,
          "restitution": 0.5,
          "behavior": null
        },
        {
          "type": "wall",
          "symbol": "#",
          "material": "stone",
          "tileX": 0,
          "tileY": 6,
          "tileWidth": 17,
          "tileHeight": 1,
          "x": 0.0,
          "y": 292.5,
          "width": 510.0,
          "height": 15,
          "id": "B-stone-wall-7",
          "shape": "rect",
          "direction": "right",
          "slope": null,
          "visual": "platformGradient",
          "color": [
            130,
            203,
            191
          ],
          "materialName": "stone",
          "thickness": 15,
          "friction": 0.05,
          "frictionStatic": 0.05,
          "restitution": 0.5,
          "behavior": null
        },
        {
          "type": "wall",
          "symbol": "#",
          "material": "stone",
          "tileX": 3,
          "tileY": 8,
          "tileWidth": 17,
          "tileHeight": 1,
          "x": 90.0,
          "y": 384.8076923076923,
          "width": 510.0,
          "height": 15,
          "id": "B-stone-wall-8",
          "shape": "rect",
          "direction": "right",
          "slope": null,
          "visual": "platformGradient",
          "color": [
            130,
            203,
            191
          ],
          "materialName": "stone",
          "thickness": 15,
          "friction": 0.05,
          "frictionStatic": 0.05,
          "restitution": 0.5,
          "behavior": null
        },
        {
          "type": "wall",
          "symbol": "#",
          "material": "stone",
          "tileX": 0,
          "tileY": 10,
          "tileWidth": 17,
          "tileHeight": 1,
          "x": 0.0,
          "y": 477.11538461538464,
          "width": 510.0,
          "height": 15,
          "id": "B-stone-wall-9",
          "shape": "rect",
          "direction": "right",
          "slope": null,
          "visual": "platformGradient",
          "color": [
            130,
            203,
            191
          ],
          "materialName": "stone",
          "thickness": 15,
          "friction": 0.05,
          "frictionStatic": 0.05,
          "restitution": 0.5,
          "behavior": null
        },
        {
          "type": "wall",
          "symbol": "#",
          "material": "stone",
          "tileX": 0,
          "tileY": 12,
          "tileWidth": 20,
          "tileHeight": 1,
          "x": 0.0,
          "y": 569.4230769230769,
          "width": 600.0,
          "height": 15,
          "id": "B-stone-wall-10",
          "shape": "rect",
          "direction": "right",
          "slope": null,
          "visual": "platformGradient",
          "color": [
            130,
            203,
            191
          ],
          "materialName": "stone",
          "thickness": 15,
          "friction": 0.05,
          "frictionStatic": 0.05,
          "restitution": 0.5,
          "behavior": null
        }
      ]
    }
  }
};
