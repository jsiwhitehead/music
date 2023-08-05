{
  barWidth: 100
  lineHeight: 8
  barHeight: lineHeight * 20 - 1
  curveOffset: lineHeight * 1.5
  noteSize: 7.5
  theme: 6
  getX: (x) => barWidth * (x - 2) + curveOffset,
  getY: (y) => lineHeight * (10 - y) - 1,
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
  getColor: (key, note, base, alt) => ((
    if alt then
      [0, 7, 2, 9, 4, 11, 6, no, 1, 8, 3, 9, 5, no]
    else
      [1, 8, 3, 9, 5, no, 0, 7, 2, 9, 4, 11, 6, no]
  )[((note - base) * 2) % 14] + key + theme) % 12
  renderBar: (infos) => [
    fill: 'white'
    style: [margin: '0px -{curveOffset}px']
    font: 'Atkinson Hyperlegible'
    size: 12
    ~
    [
      style: [
        position: 'relative'
        top: '{infos[2].range[1] * -2 * lineHeight - 4}px'
        left: '{curveOffset * 2}px'
      ]
      ~
      infos[2].name
    ]
    [
      svg: yes
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
        for y in [1, 2, 3, 4, 5, 6, 7]
          for j in [-14, -7, 0, 7, 14]
            [
              shape: 'path'
              stroke: [width: 1, color: 'white']
              opacity: 0.5
              ~
              ['M', getX(i), getY(info.white[1] + 0.5 + y + j)]
              ['l', barWidth, 0]
            ]
      for j in [1, 2]
        for x in [-14, -7, 0, 7, 14]
          renderCurve(
            'white'
            [for info in infos [for grey in info.grey[j] (grey + x)]]
          )
      for j in [1, 2]
        for x in [-14, -7, 0, 7, 14]
          renderCurve(
            'white'
            [for info in infos [info.white[j] + x]]
          )
      for i in [1, 2, 3] [
        shape: 'path'
        stroke: [width: 1.5, color: 'white']
        ~
        ['M', getX(i), 0]
        ['l', 0, barHeight]
      ]
      for i in [1, 2, 3] {
        renderCover(
          i,
          [
            for j in [-1, 0, 1]
              (
                if infos[i].range[1] % 2 = 2 then
                  infos[i + j].white[1] | 0
                else
                  infos[i + j].white[2] | 0
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
                  infos[i + j].white[1] | 0
                else
                  infos[i + j].white[2] | 0
              ) + floor(infos[i].range[2] / 2) * 7
          ],
          yes
        )
      }
      for j in [1, 2] {
        renderCurvePiece(1, infos[1].roots[j], infos[2].roots[j], 1.2, 'rgb(145, 145, 145)')
        renderLinePiece(2, infos[2].roots[j], 1.2, 'rgb(145, 145, 145)', no)
        renderCurvePiece(2, infos[2].roots[j], infos[3].roots[j], 1.2, 'rgb(145, 145, 145)')
      }
      for info, i in infos
        for ext in info.ext
          renderLinePiece(i, ext, 1.5, 'white', yes)
      for info, i in infos {
        renderLinePiece(
          i,
          info.base,
          3.5,
          colorsdark[getColor(info.key, info.base, info.white[1], info.alt)],
          yes
        )
        renderLinePiece(
          i,
          info.base,
          1.5,
          colors[getColor(info.key, info.base, info.white[1], info.alt)],
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