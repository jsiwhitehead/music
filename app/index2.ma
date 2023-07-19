{
  origin: [40, 60]
  barWidth: 110
  lineHeight: 7
  chordWidth: 8
  noteSize: 10
  theme: 1
  map: (data) => [
    svg: yes
    ~
    for bar, i in data {
      x: origin[1] + ((i % 10) - 1) * barWidth
      y: origin[2] + (floor((i - 1) / 10) * lineHeight * 25) + 12 * lineHeight
      ~
      for line in bar.key
        if isBlock(line) then {
          [
            shape: 'rect'
            fill: colors[(bar.color * 7 + theme + 1) % 12]
            opacity: 0.5
            ~
            [x, y - (line[1] + 2 + line[2]) * lineHeight + 0.5]
            [barWidth, lineHeight * (2 + line[2]) - 1]
          ]
          [
            shape: 'rect'
            fill: colors[(bar.color * 7 + theme + 1) % 12]
            opacity: 0.5
            ~
            [x, y - (line[1] + 4) * lineHeight + 0.5]
            [barWidth, lineHeight * (2 - line[2]) - 1]
          ]
        } else [
          shape: 'rect'
          fill: colors[(bar.color * 7 + theme + 1) % 12]
          opacity: 0.5
          ~
          [x, y - (line + 2) * lineHeight + 0.5]
          [barWidth, lineHeight * 2 - 1]
        ]
      for chord in bar.chord
        if len(chord) = 2 then [
          shape: 'rect'
          ~
          [x, y - chord[2] * lineHeight + 0.5]
          [chordWidth, lineHeight * (chord[2] - chord[1]) - 1]
        ] else [
          shape: 'rect'
          ~
          [x, y - chord[1] * lineHeight - (chordWidth / 2)]
          [chordWidth, chordWidth]
        ]
      [
        shape: 'rect'
        ~
        [
          x,
          y - bar.root * lineHeight - 2.5
        ]
        [chordWidth + 5, 5]
      ]
      for note, j in bar
        if note then
          if isBlock(note) then [
            shape: 'rect'
            fill: colors[(note[1] * 7 + theme) % 12]
            stroke: [width: 2, color: 'black']
            ~
            [
              x + ((j - 1) / 5 + 0.2) * barWidth,
              y - note[1] * lineHeight - (lineHeight - 1.5)
            ]
            [noteSize, (lineHeight * 2) - 3]
          ] else [
            shape: 'ellipse'
            fill: colors[(note * 7 + theme) % 12]
            stroke: [width: 2, color: 'black']
            ~
            [
              x + ((j - 1) / 5 + 0.2) * barWidth,
              y - note * lineHeight - (noteSize / 2)
            ]
            [noteSize, noteSize]
          ]
    }
  ]
  ~
  map([
    [
      key: [0, 2, 5, 7, 9]
      color: 7
      chord: [
        [0, 4]
        [7, 11]
      ]
      root: 0
      ~
      7
    ]
    [
      key: [0, 2, 5, 7, 9]
      color: 7
      chord: [
        [0, 4]
        [5, 9]
      ]
      root: 5
      ~
      no, 0, 4, 7
    ]
    [
      key: [0, 2, 5, 7, 9]
      color: 7
      chord: [
        [2, 4]
        [7, 11]
      ]
      root: 4
      ~
      9, 11, 9
    ]
    [
      key: [2, 5, 7, 9, 11]
      color: 9
      chord: [
        [7, 13]
        [4]
      ]
      root: 9
      ~
      no, no, 9
    ]
    [
      key: [0, 2, 5, 7, 9]
      color: 7
      chord: [
        [0, 2]
        [5, 9]
      ]
      root: 2
      ~
      9
    ]
    [
      key: [0, 2, 5, 7, 9]
      color: 7
      chord: [
        [0, 2]
        [5, 9]
      ]
      root: 0
      ~
      no, 2, 5, 9
    ]
    [
      key: [2, 4, 7, 9, 11]
      color: 9
      chord: [
        [4, 6]
        [9, 11]
      ]
      root: 11
      ~
      11
    ]
    [
      key: [4, 7, 9, 11, 13]
      color: 11
      chord: [
        [6]
        [9, 15]
      ]
      root: 11
      ~
      no, no, 11
    ]
    [
      key: [2, 4, 7, 9, 11]
      color: 9
      chord: [
        [2, 4]
        [7, 11]
      ]
      root: 4
      ~
      11
    ]
    [
      key: [2, [4, 1], 9, 11]
      color: 4
      chord: [
        [2, 8]
        [11]
      ]
      root: 4
      ~
      no, 4, 7, 11
    ]
    [
      key: [5, 7, 9, 12, 14]
      color: 7
      chord: [
        [7, 9]
        [12, 16]
      ]
      root: 9
      ~
      12, 14, 12
    ]
    [
      key: [1, 3, 5, 8, 10]
      color: 3
      chord: [
        [1, 7]
        [10]
      ]
      root: 3
      ~
      no, no, 12
    ]
    [
      key: [5, 7, 9, 12, 14]
      color: 7
      chord: [
        [12, 14]
        [5, 9]
      ]
      root: 14
      ~
      no, 5, 9, 12
    ]
  ])
}