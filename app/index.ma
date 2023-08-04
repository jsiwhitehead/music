{
  barWidth: 100
  lineHeight: 8
  barHeight: lineHeight * 20 - 1
  curveOffset: lineHeight * 1.5
  noteSize: 7.5
  theme: 6
  getX: (x) => barWidth * (x - 2) + curveOffset,
  getY: (y) => lineHeight * (15 - y) - 1,
  oneOf: (x, y) => if x then !y else y,
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
      getX(bar) - 0.5
      if top then 0 else barHeight
    ]
    ['l'
      barWidth + 1
      0
    ]
    ['L'
      getX(bar + 1) + 0.5
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
      getX(bar) - 0.5
      getY((points[1] + points[2]) / 2)
    ]
  ]
  getPosInKey: (fifth, alt) => (
    if alt then
      [0, 4, 1, 5, 2, 6, 3, 0.5, 4.5, 1.5, 5.5, 2.5]
    else
      [3, 0, 4, 1, 5, 2, 6, 3.5, 0.5, 4.5, 1.5, 5.5]
  )[fifth + 1] + 0.5
  renderBar: (infos) => [
    fill: 'white'
    style: [margin: '0px -{curveOffset}px']
    ~
    [
      svg: yes
      size: [barWidth + curveOffset * 2, barHeight]
      gaps: [
        for info in infos [
          info.baseline + 0.5
          info.baseline + (if info.alt then 4.5 else 3.5)
        ]
      ]
      roots: [
        for info, i in infos sort([
          gaps[i][1] + getPosInKey(info.root, info.alt)
          if includes(info.ext, 10) then
            gaps[i][1] + getPosInKey(10, info.alt)
          else
            gaps[i][1] + getPosInKey((info.root + 2) % 7 - 1, info.alt)
        ])
      ]
      bases: [
        for info, i in infos
          gaps[i][1] + getPosInKey(infos[i].base, info.alt)
      ]
      exts: [
        for info, i in infos [
          for ext in info.ext
            gaps[i][1] + getPosInKey(ext, info.alt)
        ]
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
                  oneOf(infos[i].alt, j = 1) & infos[i].chord[2] < 4
                ) then
                  points[j] - 2 + x
                if (
                  oneOf(infos[i].alt, j = 1) & infos[i].chord[2] < 6 |
                  !oneOf(infos[i].alt, j = 1) & infos[i].chord[2] < 5
                ) then
                  points[j] - 1 + x
                points[j] + x
                if (
                  oneOf(infos[i].alt, j = 1) & infos[i].chord[1] > 1 |
                  !oneOf(infos[i].alt, j = 1) & infos[i].chord[1] > 0
                ) then
                  points[j] + 1 + x
                if (
                  !oneOf(infos[i].alt, j = 1) & infos[i].chord[1] > 2
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
          colorsdark[(infos[i].key + infos[i].base + theme) % 12],
          yes
        )
        renderLinePiece(
          i,
          base,
          1.5,
          colors[(infos[i].key + infos[i].base + theme) % 12],
          yes
        )
      }
      for extList, i in exts
        for ext in extList
          renderLinePiece(i, ext, 2, 'white', yes)
      for i in [1, 2, 3] {
        renderCover(
          i,
          [
            for j in [-1, 0, 1]
              (
                if infos[i].range[1] % 2 = 2 then
                  gaps[i + j][1] | 0
                else
                  gaps[i + j][2] | 0
              ) + floor(infos[i].range[1] / 2) * 7
          ],
          no
        )
        renderCover(
          i,
          [
            for j in [-1, 0, 1]
              (
                if infos[i].range[2] % 2 = 2 then
                  gaps[i + j][1] | 0
                else
                  gaps[i + j][2] | 0
              ) + floor(infos[i].range[2] / 2) * 7
          ],
          yes
        )
      }
    ]
  ]

  ~
  [
    pad: 50
    flow: 'row'
    style: ['flex-wrap': 'wrap']
    ~
    for p, i in data
      renderBar([
        if i = 1 then p else data[i - 1]
        p
        if i = len(data) then p else data[i + 1]
      ])
  ]
}