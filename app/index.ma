{
  origin: [40, 40]
  barWidth: 100
  lineHeight: 8
  curveOffset: lineHeight * 1.5
  noteSize: 7
  bars: (info) =>
    for bar, i in info [
      shape: 'rect'
      fill: colors[bar[1]]
      opacity: 0.5
      ~
      [
        origin[1] + barWidth * (i - 1),
        origin[2] + (12 - bar[3]) * lineHeight
      ]
      [barWidth, lineHeight * (bar[3] - bar[2])]
    ]
  curve: (color, pointsList) =>
    for points, i in pointsList
      for p in points {
        [
          shape: 'path'
          stroke: [width: lineHeight, color: color]
          fill: 'none'
          ~
          ['M'
            origin[1] + (i - 1) * barWidth +
              curveOffset * (if i = 1 then 0 else 1)
            origin[2] + (12 - p - 0.5) * lineHeight
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
            origin[1] + i * barWidth - curveOffset
            origin[2] + (12 - p - 0.5) * lineHeight
          ]
          ['c'
            curveOffset, 0, ','
            curveOffset, lineHeight * (p - p2), ','
            curveOffset * 2, lineHeight * (p - p2)
          ]
        ]
      }
  roots: (points) => {
    for i in [1, 2] [
      shape: 'path'
      stroke: [width: 1, color: 'rgb(179, 179, 179)']
      fill: 'none'
      ~
      ['M'
        origin[1]
        origin[2] + (12 - points[1][i]) * lineHeight
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
      [
        shape: 'path'
        stroke: [width: 4, color: colorsdark[p[3] % 12], cap: 'round']
        fill: 'none'
        ~
        ['M'
          origin[1] + (i - 1) * barWidth + curveOffset
          origin[2] +
            (12 - (if points[i][2] - points[i][1] = 3 then points[i][2] else points[i][1])) * lineHeight
        ]
        ['l'
          barWidth - curveOffset * 2, 0
        ]
      ]
      [
        shape: 'path'
        stroke: [width: 2, color: colors[p[3] % 12], cap: 'round']
        fill: 'none'
        ~
        ['M'
          origin[1] + (i - 1) * barWidth + curveOffset
          origin[2] +
            (12 - (if points[i][2] - points[i][1] = 3 then points[i][2] else points[i][1])) * lineHeight
        ]
        ['l'
          barWidth - curveOffset * 2, 0
        ]
      ]
    }
  }
  notes: (info) =>
    for note, i in info
      if note then [
        shape: 'ellipse'
        fill: colors[note[2] % 12]
        stroke: [width: 1.5, color: 'black']
        ~
        [
          origin[1] + barWidth / 4 * (i - 0.5) - noteSize / 2,
          origin[2] + (12 - note[1]) * lineHeight - noteSize / 2
        ]
        [noteSize, noteSize]
      ]
  ~
  [
    svg: yes
    ~
    bars([
      [3, -1, 7]
      [3, -1, 7]
      [3, -1, 7]
      [5, 0, 8]
      [3, -1, 7]
      [3, -1, 7]
      [5, 0, 8]
      [7, 1, 9]
    ])
    curve('rgb(235, 235, 235)', [
      [-2, -1]
      [-2, -1]
      [-1, 0]
      [-1, 0]
      [-2, -1]
      [-2, -1]
      [0, 1]
      [0, 1]
    ])
    curve('rgb(235, 235, 235)', [
      [2, 3]
      [2]
      [2, 3]
      [3]
      [1, 2]
      [1, 2]
      [3, 4]
      [4]
    ])
    curve('rgb(235, 235, 235)', [
      [6, 7]
      [5, 6]
      [6, 7]
      [7, 8]
      [5, 6]
      [5, 6]
      [6, 7]
      [8, 9]
    ])
    curve('white', [
      [-2, -1]
      [-2, -1]
      [-2, -1]
      [-1, 0]
      [-2, -1]
      [-2, -1]
      [-1, 0]
      [0, 1]
    ])
    curve('white', [
      [2]
      [2]
      [2]
      [3]
      [2]
      [2]
      [3]
      [4]
    ])
    curve('white', [
      [6, 7]
      [6, 7]
      [6, 7]
      [7, 8]
      [6, 7]
      [6, 7]
      [7, 8]
      [8, 9]
    ])
    roots([
      [0, 4, 1]
      [0, 3, 0]
      [2, 6, 5]
      [2, 5, 4]
      [1, 5, 3]
      [1, 5, 3]
      [3, 6, 6]
      [3, 6, 6]
    ])
    notes([
      [4, 2]
      no, no, no, no
      [0, 1]
      [2, 3]
      [4, 2]
      [5, 4]
      [6, 6]
      [5, 4]
      no, no, no
      [5, 4]
      no
      [5, 4]
      no, no, no, no
      [1, 3]
      [3, 2]
      [5, 4]
      [6, 6]
      no, no, no, no, no
      [6, 6]
    ])
  ]
}