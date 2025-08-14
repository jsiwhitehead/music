type Event =
  | { type: "note"; pitch: number[]; duration: number }
  | { type: "rest"; duration: number };

const bars: Event[][][] = [
  [
    [{ type: "note", pitch: [-2], duration: 1 }],
    [{ type: "rest", duration: 1 }],
  ],
  [
    [{ type: "note", pitch: [7], duration: 3 }],
    [
      { type: "note", pitch: [-33], duration: 1 },
      { type: "note", pitch: [-17, -9], duration: 1 },
      { type: "note", pitch: [-14, -9, -5], duration: 1 },
    ],
  ],
  [
    [
      { type: "note", pitch: [7], duration: 1 },
      { type: "note", pitch: [5], duration: 1 },
      { type: "note", pitch: [7], duration: 1 },
    ],
    [
      { type: "note", pitch: [-21], duration: 1 },
      { type: "note", pitch: [-16, -10], duration: 1 },
      { type: "note", pitch: [-13, -10, -4], duration: 1 },
    ],
  ],
  [
    [{ type: "note", pitch: [5], duration: 3 }],
    [
      { type: "note", pitch: [-33], duration: 1 },
      { type: "note", pitch: [-17, -9], duration: 1 },
      { type: "note", pitch: [-14, -9, -5], duration: 1 },
    ],
  ],
  [
    [
      { type: "note", pitch: [3], duration: 2 },
      { type: "note", pitch: [-2], duration: 1 },
    ],
    [
      { type: "note", pitch: [-34], duration: 1 },
      { type: "note", pitch: [-17, -9], duration: 1 },
      { type: "note", pitch: [-14, -9, -5], duration: 1 },
    ],
  ],
  [
    [
      { type: "note", pitch: [7], duration: 2 },
      { type: "note", pitch: [0], duration: 1 },
    ],
    [
      { type: "note", pitch: [-36], duration: 1 },
      { type: "note", pitch: [-17, -8], duration: 1 },
      { type: "note", pitch: [-14, -8, -5], duration: 1 },
    ],
  ],
  [
    [
      { type: "note", pitch: [12], duration: 2 },
      { type: "note", pitch: [7], duration: 1 },
    ],
    [
      { type: "note", pitch: [-24], duration: 1 },
      { type: "note", pitch: [-17, -8], duration: 1 },
      { type: "note", pitch: [-12, -8, -2], duration: 1 },
    ],
  ],
  [
    [{ type: "note", pitch: [10], duration: 3 }],
    [
      { type: "note", pitch: [-31], duration: 1 },
      { type: "note", pitch: [-19, -11], duration: 1 },
      { type: "note", pitch: [-14, -11, -8], duration: 1 },
    ],
  ],
  [
    [
      { type: "note", pitch: [8], duration: 2 },
      { type: "note", pitch: [7], duration: 1 },
    ],
    [
      { type: "note", pitch: [-31], duration: 1 },
      { type: "note", pitch: [-19, -12], duration: 1 },
      { type: "note", pitch: [-16, -12, -7], duration: 1 },
    ],
  ],
  [
    [{ type: "note", pitch: [5], duration: 3 }],
    [
      { type: "note", pitch: [-26], duration: 1 },
      { type: "note", pitch: [-19, -10], duration: 1 },
      { type: "note", pitch: [-14, -10, -4], duration: 1 },
    ],
  ],
  [
    [
      { type: "note", pitch: [7], duration: 2 },
      { type: "note", pitch: [2], duration: 1 },
    ],
    [
      { type: "note", pitch: [-25], duration: 1 },
      { type: "note", pitch: [-17, -7], duration: 1 },
      { type: "note", pitch: [-10, -7, -5], duration: 1 },
    ],
  ],
  [
    [{ type: "note", pitch: [3], duration: 3 }],
    [
      { type: "note", pitch: [-24], duration: 1 },
      { type: "note", pitch: [-17, -9], duration: 1 },
      { type: "note", pitch: [-12, -9, -5], duration: 1 },
    ],
  ],
  [
    [{ type: "note", pitch: [0], duration: 3 }],
    [
      { type: "note", pitch: [-27], duration: 1 },
      { type: "note", pitch: [-18, -9], duration: 1 },
      { type: "note", pitch: [-12, -9, -6], duration: 1 },
    ],
  ],
  [
    [
      { type: "note", pitch: [-2], duration: 1 },
      { type: "note", pitch: [14], duration: 1 },
      { type: "note", pitch: [12], duration: 1 },
    ],
    [
      { type: "note", pitch: [-26], duration: 1 },
      { type: "note", pitch: [-19, -9], duration: 1 },
      { type: "note", pitch: [-14, -9, -4], duration: 1 },
    ],
  ],
  [
    [
      { type: "note", pitch: [10], duration: 0.5 },
      { type: "note", pitch: [8], duration: 0.5 },
      { type: "note", pitch: [7], duration: 0.5 },
      { type: "note", pitch: [8], duration: 0.5 },
      { type: "note", pitch: [0], duration: 0.5 },
      { type: "note", pitch: [2], duration: 0.5 },
    ],
    [
      { type: "note", pitch: [-38], duration: 1 },
      { type: "note", pitch: [-19, -10], duration: 1 },
      { type: "note", pitch: [-14, -4], duration: 1 },
    ],
  ],
  [
    [{ type: "note", pitch: [3], duration: 3 }],
    [
      { type: "note", pitch: [-33], duration: 1 },
      { type: "note", pitch: [-17, -9], duration: 1 },
      { type: "note", pitch: [-14, -9, -5], duration: 1 },
    ],
  ],

  [
    [
      { type: "rest", duration: 2 },
      { type: "note", pitch: [-2], duration: 1 },
    ],
    [
      { type: "note", pitch: [-21], duration: 1 },
      { type: "note", pitch: [-17, -9], duration: 1 },
      { type: "note", pitch: [-14, -9, -5], duration: 1 },
    ],
  ],
  [
    [{ type: "note", pitch: [7], duration: 3 }],
    [
      { type: "note", pitch: [-21], duration: 1 },
      { type: "note", pitch: [-17, -9], duration: 1 },
      { type: "note", pitch: [-14, -9, -5], duration: 1 },
    ],
  ],
  [
    [
      { type: "note", pitch: [5], duration: 0.5 },
      { type: "note", pitch: [7], duration: 0.5 },
      { type: "note", pitch: [5], duration: 0.5 },
      { type: "note", pitch: [4], duration: 0.5 },
      { type: "note", pitch: [5], duration: 0.5 },
      { type: "note", pitch: [7], duration: 0.5 },
    ],
    [
      { type: "note", pitch: [-21], duration: 1 },
      { type: "note", pitch: [-16, -10], duration: 1 },
      { type: "note", pitch: [-13, -10, -4], duration: 1 },
    ],
  ],
  [
    [
      { type: "note", pitch: [5], duration: 1 },
      { type: "note", pitch: [3], duration: 2 },
    ],
    [
      { type: "note", pitch: [-21], duration: 1 },
      { type: "note", pitch: [-17, -9], duration: 1 },
      { type: "note", pitch: [-14, -9, -5], duration: 1 },
    ],
  ],
  [
    [
      { type: "note", pitch: [3], duration: 0.5 },
      { type: "note", pitch: [5], duration: 0.5 },
      { type: "note", pitch: [3], duration: 0.5 },
      { type: "note", pitch: [2], duration: 0.5 },
      { type: "note", pitch: [3], duration: 0.5 },
      { type: "note", pitch: [5], duration: 0.5 },
    ],
    [
      { type: "note", pitch: [-22], duration: 1 },
      { type: "note", pitch: [-17, -9], duration: 1 },
      { type: "note", pitch: [-14, -9, -5], duration: 1 },
    ],
  ],
  [
    [
      { type: "note", pitch: [7], duration: 0.5 },
      { type: "note", pitch: [-1], duration: 0.5 },
      { type: "note", pitch: [0], duration: 0.5 },
      { type: "note", pitch: [1], duration: 0.5 },
      { type: "note", pitch: [0], duration: 0.5 },
      { type: "note", pitch: [5], duration: 0.5 },
    ],
    [
      { type: "note", pitch: [-24], duration: 1 },
      { type: "note", pitch: [-17, -8], duration: 1 },
      { type: "note", pitch: [-14, -8, -5], duration: 1 },
    ],
  ],
  [
    [
      { type: "note", pitch: [4], duration: 0.5 },
      { type: "note", pitch: [8], duration: 0.5 },
      { type: "note", pitch: [7], duration: 0.5 },
      { type: "note", pitch: [13], duration: 0.5 },
      { type: "note", pitch: [12], duration: 0.5 },
      { type: "note", pitch: [7], duration: 0.5 },
    ],
    [
      { type: "note", pitch: [-24], duration: 1 },
      { type: "note", pitch: [-17, -8], duration: 1 },
      { type: "note", pitch: [-12, -8, -2], duration: 1 },
    ],
  ],
  [
    [{ type: "note", pitch: [10], duration: 3 }],
    [
      { type: "note", pitch: [-31], duration: 1 },
      { type: "note", pitch: [-19, -11], duration: 1 },
      { type: "note", pitch: [-14, -11, -8], duration: 1 },
    ],
  ],
  [
    [
      { type: "note", pitch: [8], duration: 2 },
      { type: "note", pitch: [7], duration: 1 },
    ],
    [
      { type: "note", pitch: [-31], duration: 1 },
      { type: "note", pitch: [-19, -12], duration: 1 },
      { type: "note", pitch: [-16, -12, -7], duration: 1 },
    ],
  ],
  [
    [{ type: "note", pitch: [5], duration: 3 }],
    [
      { type: "note", pitch: [-26], duration: 1 },
      { type: "note", pitch: [-19, -10], duration: 1 },
      { type: "note", pitch: [-14, -10, -4], duration: 1 },
    ],
  ],
  [
    [
      { type: "note", pitch: [7], duration: 1 },
      { type: "note", pitch: [7], duration: 1 },
      { type: "note", pitch: [2], duration: 1 },
    ],
    [
      { type: "note", pitch: [-25], duration: 1 },
      { type: "note", pitch: [-17, -7], duration: 1 },
      { type: "note", pitch: [-10, -7, -5], duration: 1 },
    ],
  ],
  [
    [{ type: "note", pitch: [3], duration: 3 }],
    [
      { type: "note", pitch: [-24], duration: 1 },
      { type: "note", pitch: [-17, -9], duration: 1 },
      { type: "note", pitch: [-12, -9, -5], duration: 1 },
    ],
  ],
  [
    [{ type: "note", pitch: [0], duration: 3 }],
    [
      { type: "note", pitch: [-27], duration: 1 },
      { type: "note", pitch: [-18, -9], duration: 1 },
      { type: "note", pitch: [-12, -9, -6], duration: 1 },
    ],
  ],
  [
    [
      { type: "note", pitch: [-2], duration: 1 },
      { type: "note", pitch: [14], duration: 1 },
      { type: "note", pitch: [12], duration: 1 },
    ],
    [
      { type: "note", pitch: [-26], duration: 1 },
      { type: "note", pitch: [-19, -9], duration: 1 },
      { type: "note", pitch: [-14, -9, -4], duration: 1 },
    ],
  ],
  [
    [
      { type: "note", pitch: [10], duration: 0.5 },
      { type: "note", pitch: [8], duration: 0.5 },
      { type: "note", pitch: [7], duration: 0.5 },
      { type: "note", pitch: [8], duration: 0.5 },
      { type: "note", pitch: [0], duration: 0.5 },
      { type: "note", pitch: [2], duration: 0.5 },
    ],
    [
      { type: "note", pitch: [-38], duration: 1 },
      { type: "note", pitch: [-19, -10], duration: 1 },
      { type: "note", pitch: [-14, -4], duration: 1 },
    ],
  ],
  [
    [{ type: "note", pitch: [3], duration: 3 }],
    [
      { type: "note", pitch: [-33], duration: 1 },
      { type: "note", pitch: [-17, -9], duration: 1 },
      { type: "note", pitch: [-14, -9, -5], duration: 1 },
    ],
  ],

  [
    [
      { type: "note", pitch: [3], duration: 1 },
      { type: "note", pitch: [2], duration: 1 },
      { type: "note", pitch: [3], duration: 1 },
    ],
    [
      { type: "note", pitch: [-21], duration: 1 },
      { type: "note", pitch: [-17, -9], duration: 1 },
      { type: "note", pitch: [-14, -9, -5], duration: 1 },
    ],
  ],
  [
    [{ type: "note", pitch: [5], duration: 3 }],
    [
      { type: "note", pitch: [-26], duration: 1 },
      { type: "note", pitch: [-19, -10], duration: 1 },
      { type: "note", pitch: [-14, -10, -7], duration: 1 },
    ],
  ],
  [
    [
      { type: "note", pitch: [7], duration: 2 },
      { type: "note", pitch: [5], duration: 1 },
    ],
    [
      { type: "note", pitch: [-26], duration: 1 },
      { type: "note", pitch: [-19, -10], duration: 1 },
      { type: "note", pitch: [-14, -10, -7], duration: 1 },
    ],
  ],
  [
    [{ type: "note", pitch: [5], duration: 3 }],
    [
      { type: "note", pitch: [-27], duration: 1 },
      { type: "note", pitch: [-19, -12], duration: 1 },
      { type: "note", pitch: [-12, -7], duration: 1 },
    ],
  ],
  [
    [{ type: "note", pitch: [0], duration: 3 }],
    [
      { type: "note", pitch: [-27], duration: 1 },
      { type: "note", pitch: [-19, -12], duration: 1 },
      { type: "note", pitch: [-12, -7], duration: 1 },
    ],
  ],
  [
    [
      { type: "note", pitch: [3], duration: 1 },
      { type: "note", pitch: [3], duration: 1 },
      { type: "note", pitch: [3], duration: 1 },
    ],
    [
      { type: "note", pitch: [-28], duration: 1 },
      { type: "note", pitch: [-21, -12], duration: 1 },
      { type: "note", pitch: [-16, -12, -9], duration: 1 },
    ],
  ],
  [
    [
      { type: "note", pitch: [3], duration: 1 },
      { type: "note", pitch: [2], duration: 0.5 },
      { type: "note", pitch: [3], duration: 0.5 },
      { type: "note", pitch: [5], duration: 0.5 },
      { type: "note", pitch: [3], duration: 0.5 },
    ],
    [
      { type: "note", pitch: [-40], duration: 1 },
      { type: "note", pitch: [-21, -13], duration: 1 },
      { type: "note", pitch: [-16, -13, -9], duration: 1 },
    ],
  ],
  [
    [{ type: "note", pitch: [3], duration: 3 }],
    [
      { type: "note", pitch: [-33], duration: 1 },
      { type: "note", pitch: [-17, -9], duration: 1 },
      { type: "note", pitch: [-14, -9, -5], duration: 1 },
    ],
  ],
  [
    [{ type: "note", pitch: [-2], duration: 3 }],
    [
      { type: "note", pitch: [-21], duration: 1 },
      { type: "note", pitch: [-17, -9], duration: 1 },
      { type: "note", pitch: [-14, -9, -5], duration: 1 },
    ],
  ],
  [
    [{ type: "note", pitch: [10], duration: 3 }],
    [
      { type: "note", pitch: [-32], duration: 1 },
      { type: "note", pitch: [-20, -11], duration: 1 },
      { type: "note", pitch: [-14, -11, -5], duration: 1 },
    ],
  ],
  [
    [
      { type: "note", pitch: [9], duration: 2 },
      { type: "note", pitch: [7], duration: 1 },
    ],
    [
      { type: "note", pitch: [-32], duration: 1 },
      { type: "note", pitch: [-20, -12], duration: 1 },
      { type: "note", pitch: [-14, -12, -5], duration: 1 },
    ],
  ],
  [
    [{ type: "note", pitch: [-3, 5], duration: 3 }],
    [
      { type: "note", pitch: [-31], duration: 1 },
      { type: "note", pitch: [-19, -9], duration: 1 },
      { type: "note", pitch: [-12, -9, -3], duration: 1 },
    ],
  ],
  [
    [{ type: "note", pitch: [-2, 2], duration: 3 }],
    [
      { type: "note", pitch: [-29], duration: 1 },
      { type: "note", pitch: [-17, -10], duration: 1 },
      { type: "note", pitch: [-14, -10, -2], duration: 1 },
    ],
  ],
  [
    [{ type: "note", pitch: [-5, 3], duration: 3 }],
    [
      { type: "note", pitch: [-36], duration: 1 },
      { type: "note", pitch: [-17, -9], duration: 1 },
      { type: "note", pitch: [-12, -9, -5], duration: 1 },
    ],
  ],
  [
    [
      { type: "note", pitch: [-3, 2], duration: 1 },
      { type: "note", pitch: [-3, 0], duration: 1 },
      { type: "note", pitch: [-3, 2], duration: 1 },
    ],
    [
      { type: "note", pitch: [-31], duration: 1 },
      { type: "note", pitch: [-19, -9], duration: 1 },
      { type: "note", pitch: [-12, -9, -7], duration: 1 },
    ],
  ],
  [
    [
      { type: "note", pitch: [-7, -2], duration: 1 },
      { type: "note", pitch: [-6, -1], duration: 1 },
      { type: "note", pitch: [-8, -1], duration: 1 },
    ],
    [
      { type: "note", pitch: [-14, -10], duration: 1 },
      { type: "note", pitch: [-15, -9], duration: 1 },
      { type: "note", pitch: [-16], duration: 1 },
    ],
  ],
  [
    [
      { type: "note", pitch: [-8, -2, 0], duration: 1 },
      { type: "note", pitch: [-7, -3, 0], duration: 1 },
      { type: "note", pitch: [-4, 2], duration: 1 },
    ],
    [
      { type: "note", pitch: [-17], duration: 1 },
      { type: "note", pitch: [-19, -12, -9], duration: 1 },
      { type: "note", pitch: [-14, -7], duration: 1 },
    ],
  ],
];

export default bars;
