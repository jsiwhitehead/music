{
  origin: [40, 80]
  barWidth: 90
  lineHeight: 8
  noteSize: 9
  rootSize: 6
  theme: 0
  map: (data) => [
    svg: yes
    ~
    for bar, i in data {
      x: origin[1] + ((i % 12) - 1) * barWidth
      y: origin[2] + (floor((i - 1) / 12) * lineHeight * 20) + 12 * lineHeight
      ~
      for line in getKey(bar.key, bar.offset) [
        shape: 'rect'
        fill: colors[((if bar.key % 1 = 1.5 then bar.key + 6.5 else bar.key) + theme) % 12]
        opacity: 0.4
        ~
        [x, y - (line + 1) * lineHeight]
        [barWidth, lineHeight]
      ]
      for grey in bar.grey {
        [
          shape: 'rect'
          fill: 'white'
          ~
          [x, y - (grey + 1) * lineHeight]
          [barWidth, lineHeight]
        ]
        [
          shape: 'rect'
          fill: 'rgb(230, 230, 230)'
          ~
          [x, y - (grey + 1) * lineHeight]
          [barWidth, lineHeight]
        ]
      }
      for change in bar.change [
        shape: 'path'
        fill: 'white'
        ~
        ['M', x + barWidth, y - (change[2] + 1) * lineHeight]
        if change[2] < change[1] then ['m', 0, lineHeight]
        ['l', 0, lineHeight * (change[2] - change[1])]
        ['l', -lineHeight, 0]
      ]
      for change in data[i - 1].change [
        shape: 'path'
        fill: 'white'
        ~
        ['M', x, y - (change[2]) * lineHeight]
        if change[2] < change[1] then ['m', 0, -lineHeight]
        ['l', 0, lineHeight * (change[2] - change[1])]
        ['l', lineHeight, -lineHeight * (change[2] - change[1])]
      ]
    }
    for bar, i in data {
      x: origin[1] + ((i % 12) - 1) * barWidth
      y: origin[2] + (floor((i - 1) / 12) * lineHeight * 20) + 12 * lineHeight
      ~
      {
        [
          shape: 'rect'
          fill: 'rgb(127, 127, 127)'
          ~
          [x + lineHeight, y - bar.chord[1] * lineHeight - 1.5]
          [barWidth - lineHeight * 2, 3]
        ]
        [
          shape: 'rect'
          fill: 'rgb(179, 179, 179)'
          ~
          [x + lineHeight, y - bar.chord[2] * lineHeight - 1]
          [barWidth - lineHeight * 2, 2]
        ]
      }
      for change in bar.rootChange [
        shape: 'path'
        fill: 'black'
        stroke: [width: 1.5, color: 'rgb(179, 179, 179)']
        ~
        ['M', x + barWidth - lineHeight, y - change[1] * lineHeight]
        ['l', lineHeight * 2, (change[1] - change[2]) * lineHeight]
      ]
      if bar.root then [
        shape: 'rect'
        fill: 'rgb(127, 127, 127)'
        ~
        [x + lineHeight, y - bar.root * lineHeight - (rootSize / 2)]
        [rootSize, rootSize]
      ]
      for ext in bar.ext []
      for note, j in bar
        if note then
          if (note + bar.key) % 1 = 1 then [
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
      chord: [0, 4]
      grey: [3]
      rootChange: [[0, 0], [4, 3]]
      ~
      4
    ]
    [
      key: 3
      offset: 0
      chord: [3, 0]
      grey: [5]
      rootChange: [[0, 2], [3, 6]]
      ~
      no, 0, 2, 4
    ]
    [
      key: 3
      offset: 0
      chord: [2, 6]
      grey: [0, 3]
      change: [[-1, 0], [2, 3], [6, 7]]
      rootChange: [[2, 2], [6, 5]]
      ~
      5, 6, 5
    ]
    [
      key: 5
      offset: -1
      chord: [5, 2]
      change: [[0, -1], [3, 2], [7, 6]]
      rootChange: [[2, 1], [5, 5]]
      ~
      no, no, 5
    ]
    [
      key: 3
      offset: 0
      chord: [1, 5]
      grey: [1, 5]
      rootChange: [[1, 1], [5, 5]]
      ~
      5
    ]
    [
      key: 3
      offset: 0
      chord: [1, 5]
      grey: [1, 5]
      root: 0
      change: [[-1, 0], [2, 3], [6, 7]]
      rootChange: [[1, 3], [5, 6]]
      ~
      no, 1, 3, 5
    ]
    [
      key: 5
      offset: -1
      chord: [6, 3]
      grey: [1, 4, 6]
      change: [[0, 1], [3, 4], [7, 8]]
      rootChange: [[3, 3], [6, 6]]
      ~
      6
    ]
    [
      key: 7
      offset: -1
      chord: [6, 3]
      change: [[1, 0], [4, 3], [8, 7]]
      rootChange: [[3, 2], [6, 6]]
      ~
      no, no, 6
    ]
    [
      key: 5
      offset: -1
      chord: [2, 6]
      grey: [2, 6]
      change: [[3, 4]]
      rootChange: [[2, 2], [6, 6]]
      ~
      6
    ]
    [
      key: 6
      offset: -1
      chord: [2, 6]
      change: [[4, 3], [7, 6]]
      rootChange: [[2, 1], [6, 5], [10, 9]]
      ext: [3.5]
      ~
      no, 2, 3.5, 6
    ]
    [
      key: 4
      offset: -1
      chord: [5, 9]
      grey: [5, 9]
      change: [[3, 3.5], [6, 6.5], [10, 10.5]]
      rootChange: [[5, 5.5], [9, 8.5]]
      ~
      7, 8, 7
    ]
    [
      key: 4.5
      offset: -1
      chord: [8.5, 5.5]
      change: [[3.5, 1], [6.5, 5], [10.5, 8]]
      rootChange: [[5.5, 5], [8.5, 8]]
      ~
      no, no, 6.5
    ]
    [
      key: 1
      offset: -1
      chord: [8, 5]
      grey: [2, 6]
      rootChange: [[5, 5], [8, 8]]
      ~
      7
    ]
    [
      key: 1
      offset: -1
      chord: [8, 5]
      grey: [2, 6]
      change: [[5, 4]]
      rootChange: [[5, 5], [8, 8]]
      ~
      no, 3, 5, 7
    ]
    [
      key: 0
      offset: -1
      chord: [8, 5]
      change: [[1, 2], [4, 6], [8, 9]]
      rootChange: [[5, 4], [8, 8]]
      ~
      8
    ]
    [
      key: 3
      offset: -1
      chord: [4, 8]
      rootChange: [[4, 4], [8, 7]]
      ~
      no, no, 7, 8
    ]
    [
      key: 3
      offset: -1
      chord: [7, 4]
      grey: [3]
      rootChange: [[4, 4], [7, 7]]
      ~
      9, no, no, 9
    ]
    [
      key: 3
      offset: -1
      chord: [7, 4]
      grey: [3]
      ~
      9, no, 8, 7
    ]
  ])
}