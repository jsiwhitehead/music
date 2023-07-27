{
  barWidth: 100
  lineHeight: 8
  barHeight: lineHeight * 20 - 1
  curveOffset: lineHeight * 1.5
  noteSize: 7.5
  theme: 0
  getX: (x) => barWidth * (x - 2) + curveOffset,
  getY: (y) => lineHeight * (15.5 - y) - 1,
  renderCurvePiece: (x, y1, y2, width, color) => [
    shape: 'path'
    stroke: [width: width, color: color]
    fill: 'none'
    ~
    ['M', getX(x + 1) - curveOffset, getY(y1)]
    ['c'
      curveOffset, 0, ','
      curveOffset, lineHeight * (y1 - y2), ','
      curveOffset * 2, lineHeight * (y1 - y2)
    ]
  ]
  renderLinePiece: (x, y, width, color, round) => [
    shape: 'path'
    stroke: [width: width, color: color, cap: if round then 'round']
    fill: 'none'
    ~
    ['M', getX(x) + curveOffset, getY(y)]
    ['l', barWidth - curveOffset * 2, 0]
  ]
  renderCurve: (color, pointsList) => {
    for i in [1, 2]
      for p1 in pointsList[i] {
        if i = 2 then
          renderLinePiece(2, p1, lineHeight, color, no)
        for p2 in pointsList[i + 1] 
          renderCurvePiece(i, p1, p2, lineHeight, color)   
      }
  }
  renderCover: (bar, points, top) => [
    shape: 'path'
    fill: 'white'
    ~
    ['M'
      getX(bar)
      if top then 0 else barHeight
    ]
    ['l'
      barWidth
      0
    ]
    ['L'
      getX(bar + 1)
      getY((points[2] + points[3]) / 2)
    ]
    ['L'
      getX(bar + 1) - curveOffset
      getY(points[2])
    ]
    ['L'
      getX(bar) + curveOffset
      getY(points[2])
    ]
    ['L'
      getX(bar)
      getY((points[1] + points[2]) / 2)
    ]
  ]
  renderBar: (infos) => [
    fill: 'white'
    style: [margin: '0px -{curveOffset}px']
    ~
    [
      svg: yes
      size: [barWidth + curveOffset * 2, barHeight]
      gaps: [
        for info in infos [
          -0.5 + floor(info.key / 2)
          2.5 + floor((info.key + 1) / 2)
        ]
      ]
      roots: [
        for info, i in infos sort([
          gaps[i][1] + (
            if info.key % 2 = 2 then
              [3, 0, 4, 1, 5, 2, 6, 3.5, 0.5, 4.5, 1.5, 5.5]
            else
              [0, 4, 1, 5, 2, 6, 3, 0.5, 4.5, 1.5, 5.5, 2.5]
          )[info.root + 1] + 0.5
          gaps[i][1] + (
            if info.key % 2 = 2 then
              [3, 0, 4, 1, 5, 2, 6, 3, 0, 4, 1, 5, 2, 6]
            else
              [0, 4, 1, 5, 2, 6, 3, 0, 4, 1, 5, 2, 6, 3]
          )[info.root + 2] + 0.5
        ])
      ]
      bases: [
        for info, i in infos
          gaps[i][1] + (
            if infos[i].key % 2 = 2 then
              [3, 0, 4, 1, 5, 2, 6, 3.5, 0.5, 4.5, 1.5, 5.5]
            else
              [0, 4, 1, 5, 2, 6, 3, 0.5, 4.5, 1.5, 5.5, 2.5]
          )[(infos[i].base | infos[i].root) + 1] + 0.5
      ]
      ~
      for info, i in infos [
        shape: 'rect'
        fill: colors[(info.key + 3 + theme) % 12]
        opacity: 0.5
        ~
        [getX(i), 0]
        [barWidth, barHeight]
      ]
      for j in [1, 2]
        for x in [0, 7]
          renderCurve(
            'rgb(235, 235, 235)'
            [
              for points, i in gaps [
                if (
                  (infos[i].key + j) % 2 = 1 & infos[i].chord[2] < 4
                ) then
                  points[j] - 2 + x
                if (
                  (infos[i].key + j) % 2 = 1 & infos[i].chord[2] < 6 |
                  (infos[i].key + j) % 2 = 2 & infos[i].chord[2] < 5
                ) then
                  points[j] - 1 + x
                points[j] + x
                if (
                  (infos[i].key + j) % 2 = 1 & infos[i].chord[1] > 1 |
                  (infos[i].key + j) % 2 = 2 & infos[i].chord[1] > 0
                ) then
                  points[j] + 1 + x
                if (
                  (infos[i].key + j) % 2 = 2 & infos[i].chord[1] > 2
                ) then
                  points[j] + 2 + x
              ]
            ]
          )
      for j in [1, 2]
        for x in [0, 7]
          renderCurve(
            'white'
            [for points in gaps [points[j] + x]]
          )
      for i in [1, 2, 3] [
        shape: 'path'
        stroke: [width: 1, color: 'white']
        ~
        ['M', getX(i), 0]
        ['l', 0, barHeight]
      ]
      for j in [1, 2] {
        renderCurvePiece(1, roots[1][j], roots[2][j], 1, 'rgb(165, 165, 165)')
        renderLinePiece(2, roots[2][j], 1, 'rgb(165, 165, 165)', no)
        renderCurvePiece(2, roots[2][j], roots[3][j], 1, 'rgb(165, 165, 165)')
      }
      for base, i in bases {
        renderLinePiece(
          i,
          base,
          3.5,
          colorsdark[(infos[i].key + (infos[i].base | infos[i].root) + theme) % 12],
          yes
        )
        renderLinePiece(
          i,
          base,
          1.5,
          colors[(infos[i].key + (infos[i].base | infos[i].root) + theme) % 12],
          yes
        )
      }
      renderCover(1, check([gaps[1][1], gaps[1][1], gaps[2][1]]), no)
      renderCover(1, check([gaps[1][2] + 7, gaps[1][2] + 7, gaps[2][2] + 7]), yes)
      renderCover(2, check([for points in gaps (points[1])]), no)
      renderCover(2, check([for points in gaps (points[2] + 7)]), yes)
      renderCover(3, check([gaps[2][1], gaps[3][1], gaps[3][1]]), no)
      renderCover(3, check([gaps[2][2] + 7, gaps[3][2] + 7, gaps[3][2] + 7]), yes)
    ]
  ]

  piece: [
    [
      key: 0
      chord: [1, 5]
      root: 1
      base: 2
    ]
    [
      key: 0
      chord: [1, 5]
      root: 1
      base: 2
    ]
    [
      key: 1
      chord: [0, 6]
      root: 3
    ]
    [
      key: 1
      chord: [0, 6]
      root: 3
    ]
    [
      key: 1
      chord: [1, 5]
      root: 4
    ]
    [
      key: 1
      chord: [1, 5]
      root: 4
    ]
    [
      key: 2
      chord: [0, 6]
      root: 2
      base: 0
    ]
    [
      key: 2
      chord: [0, 6]
      root: 2
      base: 0
    ]
    [
      key: 2
      chord: [1, 5]
      root: 1
      base: 2
    ]
    [
      key: 2
      chord: [1, 5]
      root: 1
      base: 2
    ]
    [
      key: 2
      chord: [0, 6]
      root: 9
    ]
    [
      key: 2
      chord: [0, 6]
      root: 9
    ]
    [
      key: 2
      chord: [1, 5]
      root: 1
      base: 2
    ]
    [
      key: 2
      chord: [1, 5]
      root: 1
      base: 2
    ]
    [
      key: 3
      chord: [0, 6]
      root: 6
    ]
    [
      key: 3
      chord: [0, 6]
      root: 6
    ]
    [
      key: 2
      chord: [0, 4]
      root: 0
    ]
    [
      key: 2
      chord: [0, 4]
      root: 0
    ]
    [
      key: 2
      chord: [1, 5]
      root: 1
      base: 5
    ]
    [
      key: 2
      chord: [1, 5]
      root: 1
      base: 5
    ]
    [
      key: 2
      chord: [0, 4]
      root: 3
    ]
    [
      key: 2
      chord: [0, 4]
      root: 3
    ]
    [
      key: 0
      chord: [0, 5]
      root: 3
    ]
    [
      key: 0
      chord: [0, 5]
      root: 3
    ]
  ]
  ~
  [
    pad: 50
    flow: 'row'
    style: ['flex-wrap': 'wrap']
    ~
    for p, i in piece
      renderBar([
        if i = 1 then p else piece[i - 1]
        p
        if i = len(piece) then p else piece[i + 1]
      ])
  ]
}