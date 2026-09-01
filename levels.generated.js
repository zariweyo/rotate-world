window.RotateWorldLevels = {
  "generatedAt": "2026-09-01 08:32:03 CEST",
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
        "#S.....w........P..#",
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
          "id": "A-portal-P-16-2",
          "animation": "blackHole",
          "targetRoom": "B",
          "radius": 20.0,
          "symbol": "P",
          "tileX": 16,
          "tileY": 2,
          "x": 495.0,
          "y": 62.5
        },
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
      "objects": [
        {
          "type": "wall",
          "id": "A-stone-boundary-1",
          "shape": "boundaryArc",
          "perimeterStart": 0.0,
          "perimeterEnd": 1.0,
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
          "id": "A-wedge-right-wall-1",
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
          "id": "A-fleeting_stone-wall-3",
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
          "id": "A-stone-wall-4",
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
          "id": "A-stone-wall-6",
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
          "id": "A-fleeting_stone-wall-7",
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
          "tileY": 11,
          "tileWidth": 11,
          "tileHeight": 1,
          "x": 30.0,
          "y": 280.0,
          "width": 330.0,
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
          "id": "A-stone-wall-10",
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
          "tileY": 15,
          "tileWidth": 11,
          "tileHeight": 1,
          "x": 30.0,
          "y": 380.0,
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
          "tileY": 15,
          "tileWidth": 5,
          "tileHeight": 1,
          "x": 420.0,
          "y": 380.0,
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
          "tileY": 17,
          "tileWidth": 16,
          "tileHeight": 1,
          "x": 30.0,
          "y": 430.0,
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
          "tileY": 19,
          "tileWidth": 11,
          "tileHeight": 1,
          "x": 30.0,
          "y": 480.0,
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
          "tileY": 19,
          "tileWidth": 5,
          "tileHeight": 1,
          "x": 420.0,
          "y": 480.0,
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
          "tileX": 8,
          "tileY": 20,
          "tileWidth": 1,
          "tileHeight": 2,
          "x": 247.5,
          "y": 500.0,
          "width": 15,
          "height": 50.0,
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
          "tileY": 21,
          "tileWidth": 4,
          "tileHeight": 1,
          "x": 30.0,
          "y": 530.0,
          "width": 120.0,
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
          "tileX": 7,
          "tileY": 21,
          "tileWidth": 1,
          "tileHeight": 1,
          "x": 210.0,
          "y": 530.0,
          "width": 30.0,
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
          "tileX": 9,
          "tileY": 21,
          "tileWidth": 8,
          "tileHeight": 1,
          "x": 270.0,
          "y": 530.0,
          "width": 240.0,
          "height": 15,
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
      "rows": 14,
      "tileWidth": 30.0,
      "tileHeight": 42.857142857142854,
      "map": [
        "#S##################",
        "#.................P.",
        "#########ttt########",
        "....................",
        "...################.",
        "....................",
        ".################...",
        "....................",
        "...################.",
        "....................",
        ".################...",
        "....P...............",
        ".##################.",
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
        "y": 21.428571428571427
      },
      "portals": [
        {
          "id": "B-portal-P-18-1",
          "animation": "blackHole",
          "targetRoom": "A",
          "radius": 24.0,
          "symbol": "P",
          "tileX": 18,
          "tileY": 1,
          "x": 555.0,
          "y": 64.28571428571428
        },
        {
          "id": "B-portal-P-4-11",
          "animation": "blackHole",
          "targetRoom": "A",
          "radius": 24.0,
          "symbol": "P",
          "tileX": 4,
          "tileY": 11,
          "x": 135.0,
          "y": 492.85714285714283
        }
      ],
      "objects": [
        {
          "type": "wall",
          "id": "B-stone-boundary-1",
          "shape": "boundaryArc",
          "perimeterStart": 0.025,
          "perimeterEnd": 0.26785714285714285,
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
          "id": "B-stone-boundary-2",
          "shape": "boundaryArc",
          "perimeterStart": 0.2857142857142857,
          "perimeterEnd": 0.30357142857142855,
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
          "id": "B-stone-boundary-3",
          "shape": "boundaryArc",
          "perimeterStart": 0.48214285714285715,
          "perimeterEnd": 0.7678571428571429,
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
          "id": "B-stone-boundary-4",
          "shape": "boundaryArc",
          "perimeterStart": 0.9464285714285715,
          "perimeterEnd": 1.0125,
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
          "y": 99.64285714285714,
          "width": 240.0,
          "height": 15,
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
          "symbol": "t",
          "material": "fleeting_stone",
          "tileX": 9,
          "tileY": 2,
          "tileWidth": 3,
          "tileHeight": 1,
          "x": 270.0,
          "y": 101.14285714285714,
          "width": 90.0,
          "height": 12,
          "id": "B-fleeting_stone-wall-2",
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
          "tileWidth": 7,
          "tileHeight": 1,
          "x": 360.0,
          "y": 99.64285714285714,
          "width": 210.0,
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
          "symbol": "#",
          "material": "stone",
          "tileX": 3,
          "tileY": 4,
          "tileWidth": 16,
          "tileHeight": 1,
          "x": 90.0,
          "y": 185.35714285714283,
          "width": 480.0,
          "height": 15,
          "id": "B-stone-wall-4",
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
          "tileY": 6,
          "tileWidth": 16,
          "tileHeight": 1,
          "x": 30.0,
          "y": 271.07142857142856,
          "width": 480.0,
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
          "tileY": 8,
          "tileWidth": 16,
          "tileHeight": 1,
          "x": 90.0,
          "y": 356.7857142857143,
          "width": 480.0,
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
          "tileX": 1,
          "tileY": 10,
          "tileWidth": 16,
          "tileHeight": 1,
          "x": 30.0,
          "y": 442.5,
          "width": 480.0,
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
          "tileX": 1,
          "tileY": 12,
          "tileWidth": 18,
          "tileHeight": 1,
          "x": 30.0,
          "y": 528.2142857142857,
          "width": 540.0,
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
        }
      ]
    }
  }
};
