{
  barWidth: 120
  lineHeight: 6
  barHeight: lineHeight * 40 - 1
  curveOffset: lineHeight * 2
  noteSize: 7.5
  theme: 6
  getX: (x) => barWidth * (x - 2) + curveOffset,
  getY: (y) => lineHeight * (20 - y) - 1,
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
  renderCurve: (color, bounds, isCurve) => {
    for i in [1, 2]
      for p1 in getRange(bounds[i][1], bounds[i][2]) {
        if i = 2 then
          renderLinePiece(2, p1, lineHeight, color, no)
        if isCurve[i] then
          for p2 in getRange(bounds[i + 1][1], bounds[i + 1][2])
            renderCurvePiece(i, p1, p2, lineHeight, color)
        else {
          [
            shape: 'rect'
            fill: '#fafaed'
            ~
            [getX(i + 1) - curveOffset, getY(bounds[i][2] + 0.5)]
            [curveOffset, (bounds[i][2] - bounds[i][1] + 1) * lineHeight]
          ]
          [
            shape: 'rect'
            fill: '#fafaed'
            ~
            [getX(i + 1), getY(bounds[i + 1][2] + 0.5)]
            [curveOffset, (bounds[i + 1][2] - bounds[i + 1][1] + 1) * lineHeight]
          ]
        }
      }
  }
  renderCover: (bar, points, isCurve, top) => [
    shape: 'path'
    fill: '#fafaed'
    ~
    ['M'
      getX(bar) - 1
      if top then 0 else barHeight
    ]
    ['l'
      barWidth + 2
      0
    ]
    if isCurve[2] then {
      ['L'
        getX(bar + 1) + 1
        getY((points[2] + points[3]) / 2)
      ]
      ['L'
        getX(bar + 1) - curveOffset
        getY(points[2])
      ]
    } else {
      ['L'
        getX(bar + 1) + 1
        getY(points[2])
      ]
    }
    if (isCurve[1]) then {
      ['L'
        getX(bar) + curveOffset
        getY(points[2])
      ]
      ['L'
        getX(bar) - 1
        getY((points[1] + points[2]) / 2)
      ]
    } else {
      ['L'
        getX(bar) - 1
        getY(points[2])
      ]
    }
  ]
  getColor: (key, note, base, alt) => ((
    if alt then
      [0, 7, 2, 9, 4, 11, 6, no, 1, 8, 3, 9, 5, no]
    else
      [1, 8, 3, 9, 5, no, 0, 7, 2, 9, 4, 11, 6, no]
  )[((note - base) * 2) % 14] + key + theme) % 12
  renderBar: (infos) => [
    fill: '#fafaed'
    style: [margin: '0px -{curveOffset}px']
    font: 'Atkinson Hyperlegible'
    size: 14
    ~
    [
      style: [
        position: 'relative'
        top: '{infos[2].range[2] * -2 * lineHeight - 4}px'
        left: '{curveOffset * 2}px'
      ]
      ~
      infos[2].name
    ]
    [
      svg: yes
      fill: '#fafaed'
      size: [barWidth + curveOffset * 2, barHeight]
      ~
      for info, i in infos [
        shape: 'rect'
        fill: colorsfull[((info.key + (info.chord[1] + info.chord[2]) / 2 + theme) * 2 - 1) % 24]
        opacity: 0.5
        ~
        [getX(i), 0]
        [barWidth, barHeight]
      ]
      for info, i in infos
        for y in info.lines
          [
            shape: 'path'
            stroke: [width: 1, color: 'white', cap: 'round']
            opacity: 0.5
            ~
            ['M', getX(i), getY(y)]
            ['l', barWidth, 0]
          ]
      for j in [1, 2]
        for level in [-24, -12, 0, 12, 24]
          renderCurve(
            '#fafaed'
            [for info in infos [for gap in info.gaps[j] (gap + level)]]
            [
              (infos[1].gaps[1][1] - infos[2].gaps[1][1]) % 2 = 2,
              (infos[2].gaps[1][1] - infos[3].gaps[1][1]) % 2 = 2
            ]
          )
      for i in [1, 2] [
        shape: 'path'
        stroke: [width: if (infos[i].gaps[1][1] - infos[i + 1].gaps[1][1]) % 2 = 2 then 2 else lineHeight, color: '#fafaed']
        ~
        ['M', getX(i + 1), 0]
        ['l', 0, barHeight]
      ]
      for i in [1, 2, 3] {
        renderCover(
          i,
          [
            for j in [-1, 0, 1]
              (
                if infos[i].range[1] % 2 = 2 then
                  infos[i + j].gaps[1][2] | 0
                else
                  infos[i + j].gaps[2][2] | 0
              ) + floor(infos[i].range[1] / 2) * 12
          ],
          [
            (infos[i - 1].gaps[1][1] - infos[i].gaps[1][1]) % 2 = 2 | no
            (infos[i].gaps[1][1] - infos[i + 1].gaps[1][1]) % 2 = 2 | no
          ],
          no
        )
        renderCover(
          i,
          [
            for j in [-1, 0, 1]
              (
                if infos[i].range[2] % 2 = 2 then
                  infos[i + j].gaps[1][1] | 0
                else
                  infos[i + j].gaps[2][1] | 0
              ) + floor(infos[i].range[2] / 2) * 12
          ],
          [
            (infos[i - 1].gaps[1][1] - infos[i].gaps[1][1]) % 2 = 2 | no
            (infos[i].gaps[1][1] - infos[i + 1].gaps[1][1]) % 2 = 2 | no
          ],
          yes
        )
      }
      for j in [1, 2] {
        if (infos[1].roots[j] - infos[2].roots[j]) % 2 = 2 then
          renderCurvePiece(1, infos[1].roots[j], infos[2].roots[j], 1.5, 'rgb(150, 150, 150)')
        else [
          shape: 'path'
          stroke: [width: 1.5, color: 'rgb(150, 150, 150)']
          fill: 'none'
          ~
          ['M', getX(2) - curveOffset, getY(infos[1].roots[j])]
          ['l', curveOffset, 0]
          ['L', getX(2), getY(infos[2].roots[j])]
          ['l', curveOffset, 0]
        ]
        renderLinePiece(2, infos[2].roots[j], 1.5, 'rgb(150, 150, 150)', no)
        if (infos[2].roots[j] - infos[3].roots[j]) % 2 = 2 then
          renderCurvePiece(2, infos[2].roots[j], infos[3].roots[j], 1.5, 'rgb(150, 150, 150)')
        else [
          shape: 'path'
          stroke: [width: 1.5, color: 'rgb(150, 150, 150)']
          fill: 'none'
          ~
          ['M', getX(3) - curveOffset, getY(infos[2].roots[j])]
          ['l', curveOffset, 0]
          ['L', getX(3), getY(infos[3].roots[j])]
          ['l', curveOffset, 0]
        ]
      }
      for info, i in infos
        for ext in info.ext
          renderLinePiece(i, ext, 2, 'white', yes)
      for info, i in infos {
        renderLinePiece(
          i,
          info.base,
          5,
          colorsdark[(info.base * 7 + theme) % 12],
          yes
        )
        renderLinePiece(
          i,
          info.base,
          2,
          colors[(info.base * 7 + theme) % 12],
          yes
        )
      }
    ]
  ]

  ~
  [
    pad: 50
    flow: 'row'
    fill: '#fafaed'
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