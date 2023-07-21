{
  origin: [40, 40]
  barWidth: 90
  lineHeight: 6
  noteSize: 9
  theme: 0
  map: (data) => [
    svg: yes
    ~
    for bar, i in data {
      x: origin[1] + ((i % 12) - 1) * barWidth
      y: origin[2] + (floor((i - 1) / 12) * lineHeight * 25) + 12 * lineHeight
      ~
      for line in getKey(bar.key, bar.offset) {
        [
          shape: 'rect'
          fill: colors[(bar.key + theme) % 12]
          opacity: 0.4
          ~
          [x, y - (line + 1) * lineHeight]
          [barWidth - 1, lineHeight]
        ]
      }
      for note, j in bar
        if note then
          if note % 1 = 1 then [
          shape: 'ellipse'
          fill: colors[(getColor(bar.key, note) + theme) % 12]
          stroke: [width: 1.5, color: 'black']
          ~
          [
            x + ((j - 0.5) / 4) * barWidth - (noteSize / 2),
            y - note * lineHeight - (noteSize / 2)
          ]
          [noteSize, noteSize]
        ] else [
          shape: 'rect'
          fill: colors[(getColor(bar.key, note) + theme) % 12]
          stroke: [width: 1.5, color: 'black']
          ~
          [
            x + ((j - 0.5) / 4) * barWidth - (noteSize * 1.1 / 2),
            y - note * lineHeight - ((lineHeight - 1.5) / 2)
          ]
          [noteSize * 1.1, lineHeight - 1.5]
        ]
    }
  ]
  ~
  map([
    [
      key: 3
      offset: 0
      ~
      0, 4, 9, 8
    ]
    [
      key: 3
      offset: 0
      ~
      9, 4, 9, 4
    ]
    [
      key: 3
      offset: 0
      ~
      0, 4, 9, 8
    ]
    [
      key: 3
      offset: 0
      ~
      9, 4, 9, 4
    ]
    [
      key: 3
      offset: 0
      ~
      0, 5, 10, 9
    ]
    [
      key: 3
      offset: 0
      ~
      10, 5, 10, 5
    ]
    [
      key: 3
      offset: 0
      ~
      0, 5, 10, 9
    ]
    [
      key: 3
      offset: 0
      ~
      10, 5, 10, 5
    ]
    [
      key: 3
      offset: 0
      ~
      0, 6, 10, 9
    ]
    [
      key: 3
      offset: 0
      ~
      10, 6, 10, 6
    ]
    [
      key: 3
      offset: 0
      ~
      0, 6, 10, 9
    ]
    [
      key: 3
      offset: 0
      ~
      10, 6, 10, 6
    ]
    [
      key: 3
      offset: 0
      ~
      0, 7, 9, 8
    ]
    [
      key: 3
      offset: 0
      ~
      9, 7, 9, 7
    ]
    [
      key: 3
      offset: 0
      ~
      0, 7, 9, 8
    ]
    [
      key: 3
      offset: 0
      ~
      9, 7, 9, 6
    ]
    [
      key: 3
      offset: 0
      ~
      0, 7, 9, 8
    ]
    [
      key: 3
      offset: 0
      ~
      9, 7, 6, 7
    ]
    [
      key: 3
      offset: 0
      ~
      5, 7, 6, 7
    ]
    [
      key: 4
      offset: 0
      ~
      2, 4, 3, 2
    ]
    [
      key: 4
      offset: 0
      ~
      3, 7, 8, 7
    ]
    [
      key: 4
      offset: 0
      ~
      8, 7, 8, 7
    ]
    [
      key: 4
      offset: 0
      ~
      3, 7, 8, 7
    ]
    [
      key: 4
      offset: 0
      ~
      8, 7, 8, 7
    ]
    [
      key: 4
      offset: 0
      ~
      6, 8, 11, 10
    ]
    [
      key: 4
      offset: 0
      ~
      11, 8, 7, 8
    ]
    [
      key: 4
      offset: 0
      ~
      6, 8, 7, 8
    ]
    [
      key: 4
      offset: 0
      ~
      4, 6, 5, 4
    ]
    [
      key: 4
      offset: 0
      ~
      -2, 2, 7, 6
    ]
    [
      key: 4
      offset: 0
      ~
      7, 2, 7, 2
    ]
    [
      key: 4
      offset: 0
      ~
      -2, 2, 7, 6
    ]
    [
      key: 4
      offset: 0
      ~
      7, 2, 7, 2
    ]
    [
      key: 4
      offset: 0
      ~
      -2, 3, 4, 5
    ]
    [
      key: 4
      offset: 0
      ~
      4, 3, 2, 1
    ]
    [
      key: 4
      offset: 0
      ~
      7, 6, 5, 11
    ]
    [
      key: 4
      offset: 0
      ~
      10, 9, 8, 7
    ]
    [
      key: 4
      offset: 0
      ~
      6, 5, 4, 11
    ]
    [
      key: 4
      offset: 0
      ~
      8, 11, 6, 8
    ]
    [
      key: 4
      offset: 0
      ~
      4, 5, 6, 8
    ]
    [
      key: 4
      offset: 0
      ~
      7, 6, 5, 4
    ]
    [
      key: 2
      offset: 0
      ~
      7.5, 4, 6, 5
    ]
    [
      key: 2
      offset: 0
      ~
      6, 4, 7.5, 4
    ]
    [
      key: 2
      offset: 0
      ~
      9, 4, 6, 5
    ]
    [
      key: 2
      offset: 0
      ~
      6, 4, 7.5, 4
    ]
    [
      key: 2
      offset: 0
      ~
      3, 5, 8, 9
    ]
    [
      key: 2
      offset: 0
      ~
      10, 8, 5, 4
    ]
    [
      key: 2
      offset: 0
      ~
      3, 5, 8, 9
    ]
    [
      key: 3
      offset: 0
      ~
      10, 8, 6, 5
    ]
    [
      key: 3
      offset: 0
      ~
      4.5, 6, 4.5, 6
    ]
    [
      key: 3
      offset: 0
      ~
      8, 6, 8, 6
    ]
    [
      key: 3
      offset: 0
      ~
      4.5, 6, 4.5, 6
    ]
    [
      key: 3
      offset: 0
      ~
      8, 6, 8, 6
    ]
    [
      key: 3
      offset: 0
      ~
      7, 6, 5, 7
    ]
    [
      key: 3
      offset: 0
      ~
      6, 7, 8, 6
    ]
    [
      key: 3
      offset: 0
      ~
      7, 6, 5, 4
    ]
    [
      key: 3
      offset: 0
      ~
      3, 2, 1, 0
    ]
    [
      key: 3
      offset: 0
      ~
      -1, 3, 4, 3
    ]
    [
      key: 3
      offset: 0
      ~
      4, 3, 4, 3
    ]
    [
      key: 3
      offset: 0
      ~
      -1, 3, 4, 3
    ]
    [
      key: 3
      offset: 0
      ~
      4, 3, 4, 3
    ]
    [
      key: 2
      offset: 0
      ~
      0, 2, 6, 5
    ]
    [
      key: 2
      offset: 0
      ~
      6, 2, 6, 2
    ]
    [
      key: 2
      offset: 0
      ~
      0, 2, 6, 5
    ]
    [
      key: 2
      offset: 0
      ~
      6, 2, 6, 2
    ]
    [
      key: 2
      offset: 0
      ~
      0, 3, 5, 4
    ]
    [
      key: 2
      offset: 0
      ~
      5, 3, 5, 3
    ]
    [
      key: 2
      offset: 0
      ~
      0, 3, 5, 4
    ]
    [
      key: 2
      offset: 0
      ~
      5, 3, 5, 3
    ]
    [
      key: 3
      offset: 0
      ~
      0, 6, 10, 9
    ]
    [
      key: 3
      offset: 0
      ~
      10, 6, 10, 6
    ]
    [
      key: 3
      offset: 0
      ~
      0, 6, 10, 9
    ]
    [
      key: 3
      offset: 0
      ~
      10, 6, 10, 6
    ]
    [
      key: 3
      offset: 0
      ~
      0, 4, 9, 8
    ]
    [
      key: 3
      offset: 0
      ~
      9, 7, 6, 5
    ]
    [
      key: 3
      offset: 0
      ~
      4, 3, 2, 1
    ]
    [
      key: 3
      offset: 0
      ~
      0, -1, -2, -3
    ]
    [
      key: 4
      offset: 1
      ~
      -4, 1, 5, 6
    ]
    [
      key: 4
      offset: 1
      ~
      7, 5, 6, 7
    ]
    [
      key: 4
      offset: 1
      ~
      -4, 1, 5, 6
    ]
    [
      key: 4
      offset: 1
      ~
      7, 5, 6, 7
    ]
    [
      key: 3
      offset: 1
      ~
      -4, 1, 4, 5
    ]
    [
      key: 3
      offset: 1
      ~
      6, 4, 5, 6
    ]
    [
      key: 3
      offset: 1
      ~
      -4, 1, 4, 6
    ]
    [
      key: 4
      offset: 0
      ~
      8, 10, 11
    ]
    [
      key: 3
      offset: 0
      ~
      no, 1, 2, 3
    ]
    [
      key: 3
      offset: 0
      ~
      4, 5, 6, 7
    ]
    [
      key: 3
      offset: 0
      ~
      8, 6, 4, 5
    ]
    [
      key: 3
      offset: 0
      ~
      6, 7, 8, 9
    ]
    [
      key: 3
      offset: 0
      ~
      10, 8, 6, 7
    ]
    [
      key: 3
      offset: 0
      ~
      8, 9, 10, 11
    ]
    [
      key: 4
      offset: 0
      ~
      11.5, 11, 10, 11
    ]
    [
      key: 3
      offset: 0
      ~
      11, 10, 9, 10
    ]
    [
      key: 3
      offset: 0
      ~
      10, 8, 6, 5
    ]
    [
      key: 3
      offset: 0
      ~
      4, 1, 2, 3
    ]
    [
      key: 3
      offset: 0
      ~
      -3, 1, 4, 6
    ]
    [
      key: 3
      offset: 0
      ~
      8, 9, 10, 8
    ]
    [
      key: 3
      offset: 0
      ~
      9, 7, 4, 3
    ]
    [
      key: 3
      offset: 0
      ~
      2, 0, 1, 2
    ]
    [
      key: 3
      offset: 0
      ~
      -3, 0, 2, 4
    ]
    [
      key: 3
      offset: 0
      ~
      7, 8, 9, 7
    ]
    [
      key: 4
      offset: 0
      ~
      10, 8.5, 8, 8.5
    ]
    [
      key: 5
      offset: -1
      ~
      8.5, 8, 7, 8
    ]
    [
      key: 4
      offset: 0
      ~
      8, 7, 6, 7
    ]
    [
      key: 4
      offset: 0
      ~
      7, 5, 3, 2
    ]
    [
      key: 4
      offset: 0
      ~
      1, 3, 5, 7
    ]
    [
      key: 4
      offset: 0
      ~
      8, 10, 11, 10
    ]
    [
      key: 4
      offset: 0
      ~
      11, 8, 6, 5
    ]
    [
      key: 4
      offset: 0
      ~
      6, 8, 4, 6
    ]
    [
      key: 4
      offset: 1
      ~
      1, 4, 3, 2
    ]
    [
      key: 4
      offset: 1
      ~
      1, 0, -1, -2
    ]
    [
      key: 3
      offset: 0
      ~
      -3, no, 10, 9
    ]
    [
      key: 3
      offset: 0
      ~
      8, 7, 6, 5
    ]
    [
      key: 3
      offset: 0
      ~
      4, 10, 9, 8
    ]
    [
      key: 3
      offset: 0
      ~
      7, 6, 5, 4
    ]
    [
      key: 3
      offset: 0
      ~
      3, 9, 8, 7
    ]
    [
      key: 3
      offset: 0
      ~
      6, 5, 4, 3
    ]
    [
      key: 3
      offset: 0
      ~
      2, 8, 7, 6
    ]
    [
      key: 3
      offset: 0
      ~
      5, 4, 3, 2
    ]
    [
      key: 3
      offset: 0
      ~
      1, 7, 6, 5
    ]
    [
      key: 3
      offset: 0
      ~
      6, 8, 4, 8
    ]
  ])
}