window.RotateWorldLevels = {
  "generatedAt": "2026-08-27 03:33:37 CEST",
  "source": "levels/levels.yaml",
  "version": 1,
  "flow": {
    "A": {
      "path": "levelA.yaml",
      "next": "B"
    },
    "B": {
      "path": "levelB.yaml",
      "next": "C"
    }
  },
  "skippedRooms": [

  ],
  "rooms": {
    "A": {
      "id": "A",
      "name": "Serpentine Maze",
      "path": "levelA.yaml",
      "next": "B",
      "version": 1,
      "size": 600,
      "ball": {
        "diameter": 20
      },
      "cols": 20,
      "rows": 21,
      "tileWidth": 30.0,
      "tileHeight": 28.571428571428573,
      "map": [
        "####################",
        "#S.................#",
        "#################..#",
        "#..................#",
        "#..#################",
        "#..................#",
        "#################..#",
        "#..................#",
        "############..######",
        "#..................#",
        "#################..#",
        "#..................#",
        "############..######",
        "#..................#",
        "#################..#",
        "#..................#",
        "############..######",
        "#P......#..........#",
        "#####..##########..#",
        "#..................#",
        "####################"
      ],
      "legend": {
        "#": {
          "type": "wall",
          "material": "stone"
        },
        ".": {
          "type": "empty"
        },
        "S": {
          "type": "start"
        },
        "P": {
          "type": "portal",
          "animation": "blackHole"
        }
      },
      "materials": {
        "stone": {
          "visual": "platformGradient",
          "thickness": 12,
          "restitution": "settings.wallRestitution",
          "friction": 0.45
        }
      },
      "start": {
        "tileX": 1,
        "tileY": 1,
        "x": 45.0,
        "y": 42.85714285714286
      },
      "portals": [
        {
          "id": null,
          "animation": "blackHole",
          "targetRoom": "B",
          "radius": 22.85714285714286,
          "tileX": 1,
          "tileY": 17,
          "x": 45.0,
          "y": 500.0
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
          "y": 8.285714285714286,
          "width": 600.0,
          "height": 12,
          "visual": "platformGradient",
          "thickness": 12,
          "friction": 0.45,
          "restitution": {
            "setting": "wallRestitution"
          }
        },
        {
          "type": "wall",
          "symbol": "#",
          "material": "stone",
          "tileX": 0,
          "tileY": 1,
          "tileWidth": 1,
          "tileHeight": 20,
          "x": 9.0,
          "y": 28.571428571428573,
          "width": 12,
          "height": 571.4285714285714,
          "visual": "platformGradient",
          "thickness": 12,
          "friction": 0.45,
          "restitution": {
            "setting": "wallRestitution"
          }
        },
        {
          "type": "wall",
          "symbol": "#",
          "material": "stone",
          "tileX": 19,
          "tileY": 1,
          "tileWidth": 1,
          "tileHeight": 20,
          "x": 579.0,
          "y": 28.571428571428573,
          "width": 12,
          "height": 571.4285714285714,
          "visual": "platformGradient",
          "thickness": 12,
          "friction": 0.45,
          "restitution": {
            "setting": "wallRestitution"
          }
        },
        {
          "type": "wall",
          "symbol": "#",
          "material": "stone",
          "tileX": 1,
          "tileY": 2,
          "tileWidth": 16,
          "tileHeight": 1,
          "x": 30.0,
          "y": 65.42857142857143,
          "width": 480.0,
          "height": 12,
          "visual": "platformGradient",
          "thickness": 12,
          "friction": 0.45,
          "restitution": {
            "setting": "wallRestitution"
          }
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
          "y": 122.57142857142858,
          "width": 480.0,
          "height": 12,
          "visual": "platformGradient",
          "thickness": 12,
          "friction": 0.45,
          "restitution": {
            "setting": "wallRestitution"
          }
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
          "y": 179.71428571428572,
          "width": 480.0,
          "height": 12,
          "visual": "platformGradient",
          "thickness": 12,
          "friction": 0.45,
          "restitution": {
            "setting": "wallRestitution"
          }
        },
        {
          "type": "wall",
          "symbol": "#",
          "material": "stone",
          "tileX": 1,
          "tileY": 8,
          "tileWidth": 11,
          "tileHeight": 1,
          "x": 30.0,
          "y": 236.85714285714286,
          "width": 330.0,
          "height": 12,
          "visual": "platformGradient",
          "thickness": 12,
          "friction": 0.45,
          "restitution": {
            "setting": "wallRestitution"
          }
        },
        {
          "type": "wall",
          "symbol": "#",
          "material": "stone",
          "tileX": 14,
          "tileY": 8,
          "tileWidth": 5,
          "tileHeight": 1,
          "x": 420.0,
          "y": 236.85714285714286,
          "width": 150.0,
          "height": 12,
          "visual": "platformGradient",
          "thickness": 12,
          "friction": 0.45,
          "restitution": {
            "setting": "wallRestitution"
          }
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
          "y": 294.0,
          "width": 480.0,
          "height": 12,
          "visual": "platformGradient",
          "thickness": 12,
          "friction": 0.45,
          "restitution": {
            "setting": "wallRestitution"
          }
        },
        {
          "type": "wall",
          "symbol": "#",
          "material": "stone",
          "tileX": 1,
          "tileY": 12,
          "tileWidth": 11,
          "tileHeight": 1,
          "x": 30.0,
          "y": 351.14285714285717,
          "width": 330.0,
          "height": 12,
          "visual": "platformGradient",
          "thickness": 12,
          "friction": 0.45,
          "restitution": {
            "setting": "wallRestitution"
          }
        },
        {
          "type": "wall",
          "symbol": "#",
          "material": "stone",
          "tileX": 14,
          "tileY": 12,
          "tileWidth": 5,
          "tileHeight": 1,
          "x": 420.0,
          "y": 351.14285714285717,
          "width": 150.0,
          "height": 12,
          "visual": "platformGradient",
          "thickness": 12,
          "friction": 0.45,
          "restitution": {
            "setting": "wallRestitution"
          }
        },
        {
          "type": "wall",
          "symbol": "#",
          "material": "stone",
          "tileX": 1,
          "tileY": 14,
          "tileWidth": 16,
          "tileHeight": 1,
          "x": 30.0,
          "y": 408.2857142857143,
          "width": 480.0,
          "height": 12,
          "visual": "platformGradient",
          "thickness": 12,
          "friction": 0.45,
          "restitution": {
            "setting": "wallRestitution"
          }
        },
        {
          "type": "wall",
          "symbol": "#",
          "material": "stone",
          "tileX": 1,
          "tileY": 16,
          "tileWidth": 11,
          "tileHeight": 1,
          "x": 30.0,
          "y": 465.42857142857144,
          "width": 330.0,
          "height": 12,
          "visual": "platformGradient",
          "thickness": 12,
          "friction": 0.45,
          "restitution": {
            "setting": "wallRestitution"
          }
        },
        {
          "type": "wall",
          "symbol": "#",
          "material": "stone",
          "tileX": 14,
          "tileY": 16,
          "tileWidth": 5,
          "tileHeight": 1,
          "x": 420.0,
          "y": 465.42857142857144,
          "width": 150.0,
          "height": 12,
          "visual": "platformGradient",
          "thickness": 12,
          "friction": 0.45,
          "restitution": {
            "setting": "wallRestitution"
          }
        },
        {
          "type": "wall",
          "symbol": "#",
          "material": "stone",
          "tileX": 8,
          "tileY": 17,
          "tileWidth": 1,
          "tileHeight": 2,
          "x": 249.0,
          "y": 485.7142857142857,
          "width": 12,
          "height": 57.142857142857146,
          "visual": "platformGradient",
          "thickness": 12,
          "friction": 0.45,
          "restitution": {
            "setting": "wallRestitution"
          }
        },
        {
          "type": "wall",
          "symbol": "#",
          "material": "stone",
          "tileX": 1,
          "tileY": 18,
          "tileWidth": 4,
          "tileHeight": 1,
          "x": 30.0,
          "y": 522.5714285714287,
          "width": 120.0,
          "height": 12,
          "visual": "platformGradient",
          "thickness": 12,
          "friction": 0.45,
          "restitution": {
            "setting": "wallRestitution"
          }
        },
        {
          "type": "wall",
          "symbol": "#",
          "material": "stone",
          "tileX": 7,
          "tileY": 18,
          "tileWidth": 1,
          "tileHeight": 1,
          "x": 210.0,
          "y": 522.5714285714287,
          "width": 30.0,
          "height": 12,
          "visual": "platformGradient",
          "thickness": 12,
          "friction": 0.45,
          "restitution": {
            "setting": "wallRestitution"
          }
        },
        {
          "type": "wall",
          "symbol": "#",
          "material": "stone",
          "tileX": 9,
          "tileY": 18,
          "tileWidth": 8,
          "tileHeight": 1,
          "x": 270.0,
          "y": 522.5714285714287,
          "width": 240.0,
          "height": 12,
          "visual": "platformGradient",
          "thickness": 12,
          "friction": 0.45,
          "restitution": {
            "setting": "wallRestitution"
          }
        },
        {
          "type": "wall",
          "symbol": "#",
          "material": "stone",
          "tileX": 1,
          "tileY": 20,
          "tileWidth": 18,
          "tileHeight": 1,
          "x": 30.0,
          "y": 579.7142857142858,
          "width": 540.0,
          "height": 12,
          "visual": "platformGradient",
          "thickness": 12,
          "friction": 0.45,
          "restitution": {
            "setting": "wallRestitution"
          }
        }
      ]
    },
    "B": {
      "id": "B",
      "name": "Arrival Chamber",
      "path": "levelB.yaml",
      "next": "C",
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
        "####################",
        "#S.................#",
        "#..##############..#",
        "#..................#",
        "#..##############..#",
        "#..................#",
        "#..##############..#",
        "#..................#",
        "#..##############..#",
        "#..................#",
        "#..##############..#",
        "#.................P#",
        "####################"
      ],
      "legend": {
        "#": {
          "type": "wall",
          "material": "stone"
        },
        ".": {
          "type": "empty"
        },
        "S": {
          "type": "start"
        },
        "P": {
          "type": "portal",
          "animation": "blackHole"
        }
      },
      "materials": {
        "stone": {
          "visual": "platformWarm",
          "thickness": 12,
          "restitution": "settings.wallRestitution",
          "friction": 0.45
        }
      },
      "start": {
        "tileX": 1,
        "tileY": 1,
        "x": 45.0,
        "y": 69.23076923076923
      },
      "portals": [
        {
          "id": null,
          "animation": "blackHole",
          "targetRoom": "C",
          "radius": 24.0,
          "tileX": 18,
          "tileY": 11,
          "x": 555.0,
          "y": 530.7692307692307
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
          "y": 17.076923076923077,
          "width": 600.0,
          "height": 12,
          "visual": "platformWarm",
          "thickness": 12,
          "friction": 0.45,
          "restitution": {
            "setting": "wallRestitution"
          }
        },
        {
          "type": "wall",
          "symbol": "#",
          "material": "stone",
          "tileX": 0,
          "tileY": 1,
          "tileWidth": 1,
          "tileHeight": 12,
          "x": 9.0,
          "y": 46.15384615384615,
          "width": 12,
          "height": 553.8461538461538,
          "visual": "platformWarm",
          "thickness": 12,
          "friction": 0.45,
          "restitution": {
            "setting": "wallRestitution"
          }
        },
        {
          "type": "wall",
          "symbol": "#",
          "material": "stone",
          "tileX": 19,
          "tileY": 1,
          "tileWidth": 1,
          "tileHeight": 12,
          "x": 579.0,
          "y": 46.15384615384615,
          "width": 12,
          "height": 553.8461538461538,
          "visual": "platformWarm",
          "thickness": 12,
          "friction": 0.45,
          "restitution": {
            "setting": "wallRestitution"
          }
        },
        {
          "type": "wall",
          "symbol": "#",
          "material": "stone",
          "tileX": 3,
          "tileY": 2,
          "tileWidth": 14,
          "tileHeight": 1,
          "x": 90.0,
          "y": 109.38461538461539,
          "width": 420.0,
          "height": 12,
          "visual": "platformWarm",
          "thickness": 12,
          "friction": 0.45,
          "restitution": {
            "setting": "wallRestitution"
          }
        },
        {
          "type": "wall",
          "symbol": "#",
          "material": "stone",
          "tileX": 3,
          "tileY": 4,
          "tileWidth": 14,
          "tileHeight": 1,
          "x": 90.0,
          "y": 201.69230769230768,
          "width": 420.0,
          "height": 12,
          "visual": "platformWarm",
          "thickness": 12,
          "friction": 0.45,
          "restitution": {
            "setting": "wallRestitution"
          }
        },
        {
          "type": "wall",
          "symbol": "#",
          "material": "stone",
          "tileX": 3,
          "tileY": 6,
          "tileWidth": 14,
          "tileHeight": 1,
          "x": 90.0,
          "y": 294.0,
          "width": 420.0,
          "height": 12,
          "visual": "platformWarm",
          "thickness": 12,
          "friction": 0.45,
          "restitution": {
            "setting": "wallRestitution"
          }
        },
        {
          "type": "wall",
          "symbol": "#",
          "material": "stone",
          "tileX": 3,
          "tileY": 8,
          "tileWidth": 14,
          "tileHeight": 1,
          "x": 90.0,
          "y": 386.3076923076923,
          "width": 420.0,
          "height": 12,
          "visual": "platformWarm",
          "thickness": 12,
          "friction": 0.45,
          "restitution": {
            "setting": "wallRestitution"
          }
        },
        {
          "type": "wall",
          "symbol": "#",
          "material": "stone",
          "tileX": 3,
          "tileY": 10,
          "tileWidth": 14,
          "tileHeight": 1,
          "x": 90.0,
          "y": 478.61538461538464,
          "width": 420.0,
          "height": 12,
          "visual": "platformWarm",
          "thickness": 12,
          "friction": 0.45,
          "restitution": {
            "setting": "wallRestitution"
          }
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
          "y": 570.9230769230769,
          "width": 540.0,
          "height": 12,
          "visual": "platformWarm",
          "thickness": 12,
          "friction": 0.45,
          "restitution": {
            "setting": "wallRestitution"
          }
        }
      ]
    }
  }
};
