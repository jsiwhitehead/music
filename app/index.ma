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
            origin[1] - barWidth + barWidth / 4 * (i - 0.5) - noteSize / 2,
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
            origin[1] - barWidth + barWidth / 4 * (i - 0.5) - noteSize / 2,
            origin[2] + (12 - note[1]) * lineHeight - (lineHeight - 1.5) / 2 +
              row * rowHeight
          ]
          [noteSize, lineHeight - 1.5]
        ]
  ~
  [
    svg: yes
    ~
    bars(0, [
      [3, -1, 7]
      [3, -1, 7]
      [3, -1, 7]
      [3, -1, 7]
      [4, 0, 8]
      [3, -1, 7]
      [3, -1, 7]
      [5, 0, 8]
      [6, 1, 9]
      [5, 0, 8]
    ])
    curve(0, 'rgb(235, 235, 235)', [
      [-2, -1]
      [-2, -1]
      [-2, -1]
      [-1, 0]
      [-1, 0]
      [-2, -1]
      [-2, -1]
      [0, 1]
      [0, 1]
      [-1, 0]
    ])
    curve(0, 'rgb(235, 235, 235)', [
      [2, 3]
      [2, 3]
      [2]
      [2, 3]
      [2]
      [1, 2]
      [1, 2]
      [3, 4]
      [3]
      [2, 3]
    ])
    curve(0, 'rgb(235, 235, 235)', [
      [6, 7]
      [6, 7]
      [5, 6]
      [6, 7]
      [7, 8]
      [5, 6]
      [5, 6]
      [6, 7]
      [8, 9]
      [6, 7]
    ])
    curve(0, 'white', [
      [-2, -1]
      [-2, -1]
      [-2, -1]
      [-2, -1]
      [-1, 0]
      [-2, -1]
      [-2, -1]
      [-1, 0]
      [0, 1]
      [-1, 0]
    ])
    curve(0, 'white', [
      [2]
      [2]
      [2]
      [2]
      [2]
      [2]
      [2]
      [3]
      [3]
      [3]
    ])
    curve(0, 'white', [
      [6, 7]
      [6, 7]
      [6, 7]
      [6, 7]
      [7, 8]
      [6, 7]
      [6, 7]
      [7, 8]
      [8, 9]
      [7, 8]
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
        1
        lineHeight * 16
      ]
    ]
    roots(0, [
      [0, 4, [], 1, no]
      [0, 4, [], 1, no]
      [0, 3, [], 0, no]
      [2, 6, [], 5, no]
      [2, 5, [], 4, no]
      [1, 5, [], 3, no]
      [1, 5, [], 3, 0]
      [3, 6, [], 6, no]
      [3, 6, [], 6, no]
      [2, 6, [], 5, no]
    ])
    [
      shape: 'rect'
      fill: 'white'
      ~
      [
        origin[1] - barWidth - curveOffset / 2,
        origin[2] + 0 * rowHeight
      ]
      [barWidth, lineHeight * 16]
    ]
    [
      shape: 'rect'
      fill: 'white'
      ~
      [
        origin[1] + barWidth * 8 + curveOffset / 2,
        origin[2] + 0 * rowHeight
      ]
      [barWidth, lineHeight * 16]
    ]
    notes(0, [
      no, no, no
      [4, 2, no]
      [4, 2, no]
      no, no, no, no
      [0, 1, no]
      [2, 3, no]
      [4, 2, no]
      [5, 4, no]
      [6, 6, no]
      [5, 4, no]
      no, no, no
      [5, 4, no]
      no
      [5, 4, no]
      no, no, no, no
      [1, 3, no]
      [3, 2, no]
      [5, 4, no]
      [6, 6, no]
      no, no, no, no, no
      [6, 6, no]
    ])

    bars(1, [
      [6, 1, 9]
      [5, 0, 8]
      [6, 0, 7]
      [4, -1, 10]
      [11, -1, 11]
      [3, -1, 10]
      [3, -1, 10]
      [12, -2, 10]
      [3, -1, 10]
    ])
    curve(1, 'rgb(235, 235, 235)', [
      [0, 1]
      [-1, 0]
      [-1, 0]
      [-2, -1]
      [-1.5, -0.5]
      [-2, -1]
      [-2, -1]
      [-4, -3]
      [-2, -1]
    ])
    curve(1, 'rgb(235, 235, 235)', [
      [3]
      [2, 3]
      [4]
      [2, 3]
      [3.5]
      [1, 2]
      [1, 2]
      [1]
      [2]
    ])
    curve(1, 'rgb(235, 235, 235)', [
      [8, 9]
      [6, 7]
      [7]
      [5, 6]
      [6.5]
      [5, 6]
      [5, 6]
      [4]
      [6]
    ])
    curve(1, 'rgb(235, 235, 235)', [
      [10, 11]
      [10, 11]
      [10, 11]
      [9, 10]
      [10.5, 11.5]
      [8, 9]
      [8, 9]
      [8]
      [9, 10]
    ])
    curve(1, 'white', [
      [0, 1]
      [-1, 0]
      [-1, 0]
      [-2, -1]
      [-1.5, -0.5]
      [-2, -1]
      [-2, -1]
      [-4, -3]
      [-2, -1]
    ])
    curve(1, 'white', [
      [3]
      [3]
      [4]
      [3]
      [3.5]
      [2]
      [2]
      [1]
      [2]
    ])
    curve(1, 'white', [
      [8, 9]
      [7, 8]
      [7]
      [6]
      [6.5]
      [6]
      [6]
      [4]
      [6]
    ])
    curve(1, 'white', [
      [11, 12]
      [11, 12]
      [11, 12]
      [10, 11]
      [10.5, 11.5]
      [9, 10]
      [9, 10]
      [8, 9]
      [9, 10]
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
        1
        lineHeight * 16
      ]
    ]
    roots(1, [
      [3, 6, [], 6, no]
      [2, 6, [], 5, no]
      [2, 6, [3.5], 5, no]
      [2, 5, [], 4, no]
      [1.5, 5.5, [], 10, no]
      [1, 5, [], 3, no]
      [1, 5, [], 3, no]
      [1, 5, [], 3, no]
      [1, 4, [4.5], 2, no]
    ])
    roots(1, [
      [6, 10, [], 6, no]
      [6, 9, [], 5, no]
      [6, 9, [], 5, no]
      [5, 9, [], 4, no]
      [5.5, 8.5, [], 10, no]
      [5, 8, [], 3, no]
      [5, 8, [], 3, no]
      [5, 8, [], 3, no]
      [4, 8, [], 2, no]
    ])
    [
      shape: 'rect'
      fill: 'white'
      ~
      [
        origin[1] - barWidth - curveOffset / 2,
        origin[2] + 1 * rowHeight
      ]
      [barWidth, lineHeight * 16]
    ]
    [
      shape: 'rect'
      fill: 'white'
      ~
      [
        origin[1] + barWidth * 8 + curveOffset / 2,
        origin[2] + 1 * rowHeight
      ]
      [barWidth, lineHeight * 16]
    ]
    [
      shape: 'rect'
      fill: 'white'
      ~
      [
        origin[1] - curveOffset / 2,
        origin[2] + 1 * rowHeight
      ]
      [barWidth * 2 + curveOffset / 2 + 1, lineHeight * 4]
    ]
    [
      shape: 'rect'
      fill: 'white'
      ~
      [
        origin[1] + 2 * barWidth,
        origin[2] + 1 * rowHeight + 8 * lineHeight + 3
      ]
      [barWidth * 2 + 1, lineHeight * 4]
    ]
    [
      shape: 'rect'
      fill: 'white'
      ~
      [
        origin[1] + 4 * barWidth,
        origin[2] + 1 * rowHeight + 9 * lineHeight + 6
      ]
      [barWidth * 2 + 1, lineHeight * 4]
    ]
    [
      shape: 'rect'
      fill: 'white'
      ~
      [
        origin[1] + 6 * barWidth,
        origin[2] + 1 * rowHeight + 10 * lineHeight + 3
      ]
      [barWidth * 1 + 1, lineHeight * 4]
    ]
    [
      shape: 'rect'
      fill: 'white'
      ~
      [
        origin[1] + 7 * barWidth,
        origin[2] + 1 * rowHeight + 9 * lineHeight + 6
      ]
      [barWidth * 1 + 1, lineHeight * 4]
    ]
    notes(1, [
      no, no, no, no
      [6, 6, no]
      no, no, no, no
      [2, 5, no]
      [3.5, 2, yes]
      [6, 6, no]
      [7, 1, no]
      [8, 3, no]
      [7, 1, no]
      no, no, no
      [6.5, 1, no]
      no
      [7, 1, no]
      no, no, no, no
      [3, 0, no]
      [5, 4, no]
      [7, 1, no]
      [8, 3, no]
      no, no, no, no, no
      [7, 1, no]
      [8, 3, no]
    ])
  ]
}