{
  origin: [40, 40]
  barWidth: 100
  lineHeight: 8
  curveOffset: lineHeight * 1.5
  noteSize: 7.5
  rowHeight: 140
  bars: (row, info) =>
    for bar, i in info [
      shape: 'rect'
      fill: colors[bar[1]]
      opacity: 0.5
      ~
      [
        origin[1] + barWidth * (i - 2),
        origin[2] + (12 - bar[3]) * lineHeight + row * rowHeight
      ]
      [barWidth, lineHeight * (bar[3] - bar[2])]
    ]
  curve: (row, color, pointsList) =>
    for points, i in pointsList
      for p in points {
        [
          shape: 'path'
          stroke: [width: lineHeight, color: color]
          fill: 'none'
          ~
          ['M'
            origin[1] + (i - 2) * barWidth +
              curveOffset * (if i = 1 then 0 else 1)
            origin[2] + (12 - p - 0.5) * lineHeight + row * rowHeight
          ]
          ['l'
            barWidth -
              curveOffset * (if i = 1 | i = len(pointsList) then 1 else 2),
            0
          ]
        ]
        for p2 in pointsList[i + 1] [
          shape: 'path'
          stroke: [width: lineHeight, color: color]
          fill: 'none'
          ~
          ['M'
            origin[1] + (i - 1) * barWidth - curveOffset
            origin[2] + (12 - p - 0.5) * lineHeight + row * rowHeight
          ]
          ['c'
            curveOffset, 0, ','
            curveOffset, lineHeight * (p - p2), ','
            curveOffset * 2, lineHeight * (p - p2)
          ]
        ]
      }
  roots: (row, points) => {
    for i in [1, 2] [
      shape: 'path'
      stroke: [width: 1, color: 'rgb(165, 165, 165)']
      fill: 'none'
      ~
      ['M'
        origin[1] - barWidth
        origin[2] + (12 - points[1][i]) * lineHeight + row * rowHeight
      ]
      ['l'
        curveOffset, 0
      ]
      for p, j in points {
        ['l'
          barWidth - curveOffset * 2
          0
        ]
        if j < len(points) then ['c'
          curveOffset, 0, ','
          curveOffset, lineHeight * (p[i] - points[j + 1][i]), ','
          curveOffset * 2, lineHeight * (p[i] - points[j + 1][i])
        ]
      }
      ['l'
        curveOffset, 0
      ]
    ]
    for p, i in points {
      pos:
        if p[5] then p[5]
        else if p[2] - p[1] = 3 then p[2]
        else p[1]
      ~
      [
        shape: 'path'
        stroke: [width: 3.5, color: colorsdark[p[4] % 12], cap: 'round']
        fill: 'none'
        ~
        ['M'
          origin[1] + (i - 2) * barWidth + curveOffset
          origin[2] + (12 - pos) * lineHeight + row * rowHeight
        ]
        ['l'
          barWidth - curveOffset * 2, 0
        ]
      ]
      [
        shape: 'path'
        stroke: [width: 1.5, color: colors[p[4] % 12], cap: 'round']
        fill: 'none'
        ~
        ['M'
          origin[1] + (i - 2) * barWidth + curveOffset
          origin[2] + (12 - pos) * lineHeight + row * rowHeight
        ]
        ['l'
          barWidth - curveOffset * 2, 0
        ]
      ]
      for x in p[3] [
        shape: 'path'
        stroke: [width: 1, color: 'white', cap: 'round']
        ~
        ['M'
          origin[1] + (i - 2) * barWidth + curveOffset
          origin[2] + (12 - x) * lineHeight + row * rowHeight
        ]
        ['l'
          barWidth - curveOffset * 2, 0
        ]
      ]
    }
  }
  notes: (row, info) =>
    for note, i in info
      if note then
        if !note[3] then [
          shape: 'ellipse'
          fill: colors[note[2] % 12]
          stroke: [width: 1.5, color: 'black']
          ~
          [
            origin[1] + (floor((i - 1) / 6) - 1) * barWidth + curveOffset
              + (barWidth - curveOffset * 2) / 5 * (i % 6 - 1)
              - noteSize / 2,
            origin[2] + (12 - note[1]) * lineHeight - noteSize / 2 +
              row * rowHeight
          ]
          [noteSize, noteSize]
        ] else [
          shape: 'rect'
          fill: colors[note[2] % 12]
          stroke: [width: 1.5, color: 'black']
          ~
          [
            origin[1] + (floor((i - 1) / 6) - 1) * barWidth + curveOffset
              + (barWidth - curveOffset * 2) / 5 * (i % 6 - 1)
              - noteSize / 2,
            origin[2] + (12 - note[1]) * lineHeight - (lineHeight - 3.5) / 2 +
              row * rowHeight
          ]
          [noteSize * 1.1, lineHeight - 3.5]
        ]
  ~
  [
    svg: yes
    ~
    bars(0, [
      [6, -6, 9]
      [6, -6, 9]
      [3, -3, 8]
      [3, -4, 8]
      [1, -5, 8]
      [1, -5, 7]
      [6, -6, 7]
      [6, -6, 7]
      [3, -6, 8]
      [8, -7, 8]
    ])
    curve(0, 'rgb(235, 235, 235)', [
      [-6]
      [-6, -5]
      [-7]
    ])
    curve(0, 'rgb(235, 235, 235)', [
      [-2]
      [-2]
      [-4]
      [-4, -3]
      [-6, -5]
      [-5, -4]
      [-6.5, -5.5]
      [-5.5, -4.5]
      [-7.5, -6.5]
      [-8, -7]
    ])
    curve(0, 'rgb(235, 235, 235)', [
      [1]
      [1, 2]
      [0]
      [0]
      [-1]
      [-1]
      [-1.5]
      [-1.5]
      [-3.5]
      [-4, -3]
    ])
    curve(0, 'rgb(235, 235, 235)', [
      [5]
      [5]
      [3]
      [3, 4]
      [2]
      [2, 3]
      [1.5]
      [1.5, 2.5]
      [0.5]
      [0]
    ])
    curve(0, 'rgb(235, 235, 235)', [
      [8, 9]
      [8, 9]
      [7, 8]
      [7, 8]
      [6, 7]
      [6, 7]
      [5.5, 6.5]
      [5.5]
      [3.5]
      [3, 4]
    ])
    curve(0, 'rgb(235, 235, 235)', [
      [9.5]
      [9.5]
      [9.5]
      [9.5]
      [9.5]
      [9.5]
      [9.5]
      [8.5]
      [7.5]
      [7]
    ])
    curve(0, 'white', [
      [-6]
      [-6]
      [-7]
    ])
    curve(0, 'white', [
      [-2]
      [-2]
      [-4]
      [-5, -4]
      [-6, -5]
      [-6, -5]
      [-6.5, -5.5]
      [-6.5, -5.5]
      [-7.5, -6.5]
      [-8, -7]
    ])
    curve(0, 'white', [
      [1]
      [1]
      [0]
      [0]
      [-1]
      [-1]
      [-1.5]
      [-1.5]
      [-3.5]
      [-4]
    ])
    curve(0, 'white', [
      [5]
      [5]
      [3]
      [3]
      [2]
      [2]
      [1.5]
      [1.5]
      [0.5]
      [0]
    ])
    curve(0, 'white', [
      [8, 9]
      [8, 9]
      [7, 8]
      [7, 8]
      [6, 7]
      [6, 7]
      [5.5, 6.5]
      [5.5]
      [3.5]
      [3]
    ])
    curve(0, 'white', [
      [9.5]
      [9.5]
      [9.5]
      [9.5]
      [9.5]
      [9.5]
      [9.5]
      [8.5]
      [7.5]
      [7]
    ])
    for x in [0, 1, 2, 3, 4, 5, 6, 7, 8] [
      shape: 'path'
      stroke: [width: 1, color: 'white']
      ~
      ['M'
        origin[1] + x * barWidth,
        origin[2] + 0 * rowHeight
      ]
      ['l'
        0
        lineHeight * 20
      ]
    ]
    roots(0, [
      [-4, 0, [], 4, no]
      [-4, -1, [], 4, no]
      [-5, -2, [], 2, no]
    ])
    roots(0, [
      [0, 3, [], 4, no]
      [-1, 3, [], 4, no]
      [-2, 2, [], 2, no]
      [-2, 1, [], 1, no]
      [-3, 1, [], 0, no]
      [-3, 0, [], -1, no]
      [-3.5, 0.5, [], 5, no]
      [-3.5, -0.5, [], 4, no]
      [-4.5, -1.5, [-5], 2, no]
      [-6, -2, [], 6, no]
    ])
    roots(0, [
      [6, 10, [], 4, no]
      [6, 10, [], 4, no]
      [5, 9, [], 2, no]
      [5, 8, [], 1, no]
      [4, 8, [], 0, no]
      [4, 7, [], -1, no]
      [3.5, 7.5, [], 5, no]
      [3.5, 6.5, [], 4, no]
      [2.5, 5.5, [2], 2, no]
      [1, 5, [], 6, no]
    ])
    [
      shape: 'rect'
      fill: 'white'
      ~
      [
        origin[1] - barWidth - curveOffset / 2 - 0.5,
        origin[2] + 0 * rowHeight
      ]
      [barWidth, lineHeight * 20]
    ]
    [
      shape: 'rect'
      fill: 'white'
      ~
      [
        origin[1] + barWidth * 8 + curveOffset / 2 - 0.5,
        origin[2] + 0 * rowHeight
      ]
      [barWidth, lineHeight * 20]
    ]
    notes(0, [
      no, no, no, no, no, no
      [3, 5]
      no, no, no
      [1, 8]
      no
      [-1, 4]
      no
      [5, 2]
      no, no, no
      [3, 5]
      no, no, no
      [-2, 2]
      no
      [-1.5, 9, yes]
      no
      [4.5, 7, yes]
      no, no, no
      [4, 0]
      no, no, no
      [-3, 0]
      no
      [-2.5, 7]
      no
      [3.5, 5]
      no, no, no
      [1.5, 8]
      no, no, no, no, no
      [2, 8, yes]
      no, no, no, no, no
    ])
    [
      shape: 'rect'
      fill: 'white'
      ~
      [
        origin[1] - curveOffset + 0 * barWidth - 0.5,
        origin[2] + 0 * rowHeight + 1 * lineHeight - 1
      ]
      [barWidth * 1 + curveOffset + 1, lineHeight * 6]
    ]
    [
      shape: 'rect'
      fill: 'white'
      ~
      [
        origin[1] + 1 * barWidth - 0.5,
        origin[2] + 0 * rowHeight + 15 * lineHeight + 3
      ]
      [barWidth * 1 + 1, lineHeight * 3]
    ]
    [
      shape: 'rect'
      fill: 'white'
      ~
      [
        origin[1] + 1 * barWidth - 0.5,
        origin[2] + 0 * rowHeight + 1 * lineHeight + 3
      ]
      [barWidth * 2 + 1, lineHeight * 3]
    ]
    [
      shape: 'rect'
      fill: 'white'
      ~
      [
        origin[1] + 3 * barWidth - 0.5,
        origin[2] + 0 * rowHeight + 1 * lineHeight + 3
      ]
      [barWidth * 2 + 1, lineHeight * 4]
    ]
    [
      shape: 'rect'
      fill: 'white'
      ~
      [
        origin[1] + 5 * barWidth - 0.5,
        origin[2] + 0 * rowHeight + 1 * lineHeight + 1.5
      ]
      [barWidth * 2 + 1, lineHeight * 5]
    ]
    [
      shape: 'rect'
      fill: 'white'
      ~
      [
        origin[1] + 7 * barWidth - 0.5,
        origin[2] + 0 * rowHeight + 15 * lineHeight - 3
      ]
      [barWidth * 0.5 + curveOffset + 1, lineHeight * 4]
    ]
    [
      shape: 'rect'
      fill: 'white'
      ~
      [
        origin[1] + 7.5 * barWidth - 0.5,
        origin[2] + 0 * rowHeight + 15 * lineHeight + 1
      ]
      [barWidth * 0.5 + curveOffset + 1, lineHeight * 4]
    ]

    bars(1, [
      [3, -3, 8]
      [8, -3, 8]
      [7, -4, 8]
      [8, -4, 8]
      [10, -4, 8]
      [8, -4, 8]
      [1, -4, 8]
      [1, -4, 8]
      [6, -4, 8]
      [6, -4, 8]
    ])
    curve(1, 'rgb(235, 235, 235)', [
      [-3.5]
      [-4, -3]
      [-5, -4]
      [-4, -3]
      [-4, -3]
      [-5, -4]
      [-5.5, -4.5]
      [-4.5, -3.5]
      [-6, -5]
      [-5, -4]
    ])
    curve(1, 'rgb(235, 235, 235)', [
      [0.5]
      [0]
      [-2, -1]
      [0, 1]
      [1]
      [-1, 0]
      [-0.5]
      [-0.5]
      [-1]
      [-1]
    ])
    curve(1, 'rgb(235, 235, 235)', [
      [3.5]
      [3, 4]
      [2, 3]
      [3, 4]
      [4]
      [3]
      [2.5]
      [2.5, 3.5]
      [2]
      [2, 3]
    ])
    curve(1, 'rgb(235, 235, 235)', [
      [7.5, 8.5]
      [7, 8]
      [5, 6]
      [7, 8]
      [8, 9]
      [6, 7]
      [6.5, 7.5]
      [6.5, 7.5]
      [6, 7]
      [6, 7]
    ])
    curve(1, 'white', [
      [-3.5]
      [-4]
      [-5, -4]
      [-5, -4]
      [-4, -3]
      [-5, -4]
      [-5.5, -4.5]
      [-5.5, -4.5]
      [-6, -5]
      [-6, -5]
    ])
    curve(1, 'white', [
      [0.5]
      [0]
      [-1]
      [0]
      [1]
      [0]
      [-0.5]
      [-0.5]
      [-1]
      [-1]
    ])
    curve(1, 'white', [
      [3.5]
      [3]
      [3]
      [3]
      [4]
      [3]
      [2.5]
      [2.5]
      [2]
      [2]
    ])
    curve(1, 'white', [
      [7.5, 8.5]
      [7, 8]
      [6, 7]
      [7, 8]
      [8, 9]
      [7, 8]
      [6.5, 7.5]
      [6.5, 7.5]
      [6, 7]
      [6, 7]
    ])
    for x in [0, 1, 2, 3, 4, 5, 6, 7, 8] [
      shape: 'path'
      stroke: [width: 1, color: 'white']
      ~
      ['M'
        origin[1] + x * barWidth,
        origin[2] + 1 * rowHeight
      ]
      ['l'
        0
        lineHeight * 20
      ]
    ]
    roots(1, [
      [-1.5, 2.5, [2], 2, no]
      [-2, 1, [], 6, no]
      [-2, 2, [], 7, no]
      [0, 3, [], 10, no]
      [-1, 3, [-0.5], 9, no]
      [-1, 2, [], 8, no]
      [-2.5, 1.5, [], 0, no]
      [-2.5, 0.5, [], -1, no]
      [-3, 1, [], 5, no]
      [-3, 0, [], 4, no]
    ])
    roots(1, [
      [2.5, 5.5, [2], 2, no]
      [1, 5, [], 6, no]
      [2, 5, [], 7, no]
      [3, 7, [], 10, no]
      [3, 6, [6.5], 9, no]
      [2, 6, [], 8, no]
      [1.5, 4.5, [], 0, no]
      [0.5, 4.5, [], -1, no]
      [1, 4, [], 5, no]
      [0, 4, [], 4, no]
    ])
    [
      shape: 'rect'
      fill: 'white'
      ~
      [
        origin[1] - barWidth - curveOffset / 2 - 0.5,
        origin[2] + 1 * rowHeight
      ]
      [barWidth, lineHeight * 20]
    ]
    [
      shape: 'rect'
      fill: 'white'
      ~
      [
        origin[1] + barWidth * 8 + curveOffset / 2 - 0.5,
        origin[2] + 1 * rowHeight
      ]
      [barWidth, lineHeight * 20]
    ]
    notes(1, [
      no, no, no, no, no, no
      [5, 7]
      no, no, no
      [1, 6]
      no
      [0, 4]
      no
      [7, 4]
      no, no, no
      [6, 9]
      no, no, no
      [-1, 9]
      no
      [-0.5, 4, yes]
      no
      [4, 12]
      no, no, no
      [5, 7]
      no, no, no
      [-2, 7]
      no
      [-1.5, 2]
      no
      [5.5, 2]
      no, no
      [4.5, 0]
      [2.5, 5]
      no, no, no, no, no
      no, no
      [0, 4]
      [1, 6]
      [2, 8]
      [3, 3]
    ])
  ]
}