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
      [3, -1, 11]
      [3, -1, 11]
      [3, -1, 11]
      [4, -1, 11]
      [4, -1, 11]
      [4, 0, 11]
      [4, 0, 11]
      [5, 0, 11]
      [5, 0, 11]
      [5, 0, 11]
    ])
    curve(0, 'rgb(235, 235, 235)', [
      [-1, 0]
      [-1, 0]
      [-1, 0]
      [-1, 0]
      [-1, 0]
      [0, 1]
      [0, 1]
      [0, 1]
      [0, 1]
      [0, 1]
    ])
    curve(0, 'rgb(235, 235, 235)', [
      [3]
      [3, 4]
      [3, 4]
      [4]
      [4]
      [3, 4]
      [3, 4]
      [4]
      [4]
      [4, 5]
    ])
    curve(0, 'rgb(235, 235, 235)', [
      [6, 7]
      [6, 7]
      [6, 7]
      [7]
      [7]
      [7, 8]
      [7, 8]
      [8]
      [8]
      [7, 8]
    ])
    curve(0, 'rgb(235, 235, 235)', [
      [10, 11]
      [10, 11]
      [10, 11]
      [11, 12]
      [11, 12]
      [10, 11]
      [10, 11]
      [11, 12]
      [11, 12]
      [11, 12]
    ])
    curve(0, 'white', [
      [-1, 0]
      [-1, 0]
      [-1, 0]
      [-1, 0]
      [-1, 0]
      [-1, 0]
      [-1, 0]
      [0, 1]
      [0, 1]
      [0, 1]
    ])
    curve(0, 'white', [
      [3]
      [3]
      [3]
      [4]
      [4]
      [4]
      [4]
      [4]
      [4]
      [4]
    ])
    curve(0, 'white', [
      [7]
      [7]
      [7]
      [7]
      [7]
      [7]
      [7]
      [8]
      [8]
      [8]
    ])
    curve(0, 'white', [
      [10, 11]
      [10, 11]
      [10, 11]
      [11, 12]
      [11, 12]
      [11, 12]
      [11, 12]
      [11, 12]
      [11, 12]
      [11, 12]
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
        lineHeight * 16
      ]
    ]
    roots(0, [
      [2, 6, [], 3, no]
      [1, 5, [], 2, 5]
      [1, 5, [], 2, 5]
      [3, 6, [], 4, no]
      [3, 6, [], 4, no]
      [3, 7, [], 5, no]
      [3, 7, [], 5, no]
      [3, 6, [], 2, 5]
      [3, 6, [], 2, 5]
      [2, 6, [], 4, 6]
    ])
    roots(0, [
      [6, 9, [], 3, no]
      [5, 8, [], 2, 5]
      [5, 8, [], 2, 5]
      [6, 10, [], 4, no]
      [6, 10, [], 4, no]
      [7, 10, [], 5, no]
      [7, 10, [], 5, no]
      [6, 10, [], 2, 5]
      [6, 10, [], 2, 5]
      [6, 9, [], 4, 6]
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
      no, no, no, no
      no, no, no, no
      no
      [8, 1, no]
      [7, 6, no]
      [8, 1, no]
      [7, 6, no]
      [6, 4, no]
      no
      [3, 5, no]
      no
      [6, 4, no]
      no, no
      no, no, no
      [4, 7, no]
      [5, 2, no]
      [4, 7, no]
      [5, 2, no]
      [7, 6, no]
      no
      [10, 5, no]
      no
      [5, 2, no]
      [6, 4, no]
      [7, 6, no]
    ])

    bars(1, [
      [5, 0, 11]
      [5, 0, 11]
      [5, 0, 11]
      [5, 0, 11]
      [5, 0, 11]
      [5, 0, 11]
      [5, 0, 12]
      [6, 0, 12]
      [6, 0, 12]
      [5, 0, 12]
    ])
    curve(1, 'rgb(235, 235, 235)', [
      [0, 1]
      [0, 1]
      [0, 1]
      [0, 1]
      [0, 1]
      [0, 1]
      [0, 1]
      [0, 1]
      [0, 1]
      [0, 1]
    ])
    curve(1, 'rgb(235, 235, 235)', [
      [4]
      [4, 5]
      [4, 5]
      [4]
      [4]
      [4, 5]
      [4, 5]
      [5]
      [5]
      [3, 4]
    ])
    curve(1, 'rgb(235, 235, 235)', [
      [8]
      [7, 8]
      [7, 8]
      [8]
      [8]
      [7, 8]
      [7, 8]
      [8]
      [8]
      [7, 8]
    ])
    curve(1, 'rgb(235, 235, 235)', [
      [11, 12]
      [11, 12]
      [11, 12]
      [11, 12]
      [11, 12]
      [11, 12]
      [11, 12]
      [12, 13]
      [12, 13]
      [10, 11]
    ])
    curve(1, 'white', [
      [0, 1]
      [0, 1]
      [0, 1]
      [0, 1]
      [0, 1]
      [0, 1]
      [0, 1]
      [0, 1]
      [0, 1]
      [0, 1]
    ])
    curve(1, 'white', [
      [4]
      [4]
      [4]
      [4]
      [4]
      [4]
      [4]
      [5]
      [5]
      [4]
    ])
    curve(1, 'white', [
      [8]
      [8]
      [8]
      [8]
      [8]
      [8]
      [8]
      [8]
      [8]
      [8]
    ])
    curve(1, 'white', [
      [11, 12]
      [11, 12]
      [11, 12]
      [11, 12]
      [11, 12]
      [11, 12]
      [11, 12]
      [12, 13]
      [12, 13]
      [11, 12]
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
        lineHeight * 16
      ]
    ]
    roots(1, [
      [3, 6, [], 2, 5]
      [2, 6, [], 4, 6]
      [2, 6, [], 4, 6]
      [3, 6.5, [], 11, 6.5]
      [3, 6.5, [], 11, 6.5]
      [2, 6, [], 4, 6]
      [2, 6, [], 4, 6]
      [2, 5, [], 9, no]
      [2, 5, [], 9, no]
      [2, 5, [], 2, no]
    ])
    roots(1, [
      [6, 10, [], 2, 5]
      [6, 9, [], 4, 6]
      [6, 9, [], 4, 6]
      [6.5, 10, [], 11, 6.5]
      [6.5, 10, [], 11, 6.5]
      [6, 9, [], 4, 6]
      [6, 9, [], 4, 6]
      [5, 9, [], 9, no]
      [5, 9, [], 9, no]
      [5, 9, [], 2, no]
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
    notes(1, [
      no, no, no, no
      no, no, no, no
      no
      [9, 3, no]
      [8, 8, no]
      [9, 3, no]
      [10, 5, no]
      no
      [5, 2, no]
      [6, 4, no]
      no
      [6.5, 11, no]
      no, no
      no, no, no
      [9, 3, no]
      no
      [9, 3, no]
      [8, 8, no]
      [9, 3, no]
      no
      [11, 7, no]
      no
      [7, 6, no]
      [8, 8, no]
      [9, 3, no]
    ])

    bars(2, [
      [6, 0, 12]
      [5, 0, 12]
      [5, 0, 12]
      [5, 0, 12]
      [5, 0, 12]
      [5, 0, 12]
      [5, 0, 12]
      [3, 0, 12]
      [3, 0, 12]
      [3, 0, 12]
    ])
    curve(2, 'rgb(235, 235, 235)', [
      [0, 1]
      [0, 1]
      [0, 1]
      [0, 1]
      [0, 1]
      [0, 1]
      [0, 1]
      [-1, 0]
      [-1, 0]
      [-1, 0]
    ])
    curve(2, 'rgb(235, 235, 235)', [
      [5]
      [3, 4]
      [3, 4]
      [4, 5]
      [4, 5]
      [3, 4]
      [3, 4]
      [3]
      [3]
      [3, 4]
    ])
    curve(2, 'rgb(235, 235, 235)', [
      [8]
      [7, 8]
      [7, 8]
      [7, 8]
      [7, 8]
      [7, 8]
      [7, 8]
      [6, 7]
      [6, 7]
      [6, 7]
    ])
    curve(2, 'rgb(235, 235, 235)', [
      [12, 13]
      [10, 11]
      [10, 11]
      [11, 12]
      [11, 12]
      [10, 11]
      [10, 11]
      [10, 11]
      [10, 11]
      [10, 11]
    ])
    curve(2, 'white', [
      [0, 1]
      [0, 1]
      [0, 1]
      [0, 1]
      [0, 1]
      [0, 1]
      [0, 1]
      [-1, 0]
      [-1, 0]
      [-1, 0]
    ])
    curve(2, 'white', [
      [5]
      [4]
      [4]
      [4]
      [4]
      [4]
      [4]
      [3]
      [3]
      [3]
    ])
    curve(2, 'white', [
      [8]
      [8]
      [8]
      [8]
      [8]
      [8]
      [8]
      [7]
      [7]
      [7]
    ])
    curve(2, 'white', [
      [12, 13]
      [11, 12]
      [11, 12]
      [11, 12]
      [11, 12]
      [11, 12]
      [11, 12]
      [10, 11]
      [10, 11]
      [10, 11]
    ])
    for x in [0, 1, 2, 3, 4, 5, 6, 7, 8] [
      shape: 'path'
      stroke: [width: 1, color: 'white']
      ~
      ['M'
        origin[1] + x * barWidth,
        origin[2] + 2 * rowHeight
      ]
      ['l'
        0
        lineHeight * 16
      ]
    ]
    roots(2, [
      [2, 5, [], 9, no]
      [2, 5, [], 2, no]
      [2, 5, [], 2, no]
      [2, 6, [], 7, 4]
      [2, 6, [], 7, 4]
      [3, 7, [], 5, no]
      [3, 7, [], 5, no]
      [2, 6, [], 3, no]
      [2, 6, [], 3, no]
      [1, 5, [], 2, 5]
    ])
    roots(2, [
      [5, 9, [], 9, no]
      [5, 9, [], 2, no]
      [5, 9, [], 2, no]
      [6, 9, [], 7, 11]
      [6, 9, [], 7, 11]
      [7, 10, [], 5, no]
      [7, 10, [], 5, no]
      [6, 9, [], 3, no]
      [6, 9, [], 3, no]
      [5, 8, [], 2, 5]
    ])
    [
      shape: 'rect'
      fill: 'white'
      ~
      [
        origin[1] - barWidth - curveOffset / 2,
        origin[2] + 2 * rowHeight
      ]
      [barWidth, lineHeight * 16]
    ]
    [
      shape: 'rect'
      fill: 'white'
      ~
      [
        origin[1] + barWidth * 8 + curveOffset / 2,
        origin[2] + 2 * rowHeight
      ]
      [barWidth, lineHeight * 16]
    ]
    notes(2, [
      no, no, no, no
      no, no, no, no
      [7, 6, no]
      [6, 4, no]
      [7, 6, no]
      [6, 4, no]
      no, no
      [9, 3, no]
      [6, 4, no]
      [5, 2, no]
      no
      [4, 7, no]
      [2, 3, no]
      no, no
      [3, 5, no]
      no
      no, no, no, no
      [2, 3, no]
      no, no
      [2, 3, no]
      [3, 5, no]
      [4, 0, no]
    ])
  ]
}