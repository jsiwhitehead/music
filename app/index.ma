{
  barWidth: 120
  lineHeight: 7
  barHeight: lineHeight * 40 - 1
  curveOffset: lineHeight * 2
  noteSize: lineHeight * 1.6
  getX: (x) => barWidth * (x - 2) + curveOffset,
  getY: (y) => lineHeight * (24 - y) - 1,
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
  renderLinePiece: (x, y, width, color, round, full) => [
    shape: 'path'
    stroke: [width: width, color: color, cap: if round then 'round']
    fill: 'none'
    ~
    ['M', getX(x) + (if full[1] then 0 else curveOffset), getY(y)]
    ['L', getX(x + 1) - (if full[2] then 0 else curveOffset), getY(y)]
  ]
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
      for info, i in infos {
        [
          shape: 'rect'
          fill: 'white'
          ~
          [getX(i), 0]
          [barWidth, barHeight]
        ]
        [
          shape: 'rect'
          fill:
            if info.chord = 'alt' | info.chord = 'dim' then
              'rgb(180, 180, 180)'
            else
              colorsfull[((info.key + info.chordMid) * 2 - 1) % 24]
          opacity: 0.5
          ~
          [getX(i), 0]
          [barWidth, barHeight]
        ]
      }
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
          for info, i in infos
            if info.gaps then {
              for y in getRange(info.gaps[j][1], info.gaps[j][2]) 
                renderLinePiece(
                  i,
                  y + level,
                  lineHeight / 2,
                  '#fafaed',
                  no,
                  [!info.curves[1], !info.curves[2]]
                )
              if info.curves[1] then
                for p1 in getRange(infos[i - 1].gaps[j][1], infos[i - 1].gaps[j][2]) {
                  for p2 in getRange(infos[i].gaps[j][1], infos[i].gaps[j][2])
                    renderCurvePiece(i - 1, p1 + level, p2 + level, lineHeight / 2, '#fafaed')
                }
              if info.curves[2] then
                for p1 in getRange(infos[i].gaps[j][1], infos[i].gaps[j][2]) {
                  for p2 in getRange(infos[i + 1].gaps[j][1], infos[i + 1].gaps[j][2])
                    renderCurvePiece(i, p1 + level, p2 + level, lineHeight / 2, '#fafaed')
                }
            } else if info.chord = 'dim' then {
              for y in [1.5, 4.5, 7.5, 10.5]
                renderLinePiece(
                  i,
                  (info.key * 7) % 12 + y + level,
                  lineHeight * 2,
                  '#fafaed',
                  no,
                  [yes, yes]
                )
            }
      for info, i in infos
        for ext in info.ext [
          shape: 'path'
          stroke: [
            width: lineHeight / 2
            color: colorsfull[((info.key + info.chordMid) * 2 - 1) % 24]
            cap: 'round'
          ]
          opacity: 0.5
          fill: 'none'
          ~
          ['M', getX(i) + curveOffset - 1, getY(ext)]
          ['L', getX(i + 1) - curveOffset + 1, getY(ext)]
        ]
      for i in [1, 2] [
        shape: 'path'
        stroke: [
          width: if infos[2].curves[i] then 2 else lineHeight,
          color: '#fafaed'
        ]
        ~
        ['M', getX(i + 1), 0]
        ['l', 0, barHeight]
      ]
      for j in [1, 2]
        for level in [-24, -12, 0, 12, 24] {
          if (infos[1].roots[j] - infos[2].roots[j]) % 2 = 2 then
            renderCurvePiece(1, infos[1].roots[j] + level, infos[2].roots[j] + level, 1.5, 'rgb(150, 150, 150)')
          else [
            shape: 'path'
            stroke: [width: 1.5, color: 'rgb(150, 150, 150)']
            fill: 'none'
            ~
            ['M', getX(2) - curveOffset, getY(infos[1].roots[j] + level)]
            ['l', curveOffset, 0]
            ['L', getX(2), getY(infos[2].roots[j] + level)]
            ['l', curveOffset, 0]
          ]
          renderLinePiece(2, infos[2].roots[j] + level, 1.5, 'rgb(150, 150, 150)', no, [no, no])
          if (infos[2].roots[j] - infos[3].roots[j]) % 2 = 2 then
            renderCurvePiece(2, infos[2].roots[j] + level, infos[3].roots[j] + level, 1.5, 'rgb(150, 150, 150)')
          else [
            shape: 'path'
            stroke: [width: 1.5, color: 'rgb(150, 150, 150)']
            fill: 'none'
            ~
            ['M', getX(3) - curveOffset, getY(infos[2].roots[j] + level)]
            ['l', curveOffset, 0]
            ['L', getX(3), getY(infos[3].roots[j] + level)]
            ['l', curveOffset, 0]
          ]
        }
      for info, i in infos
        for level in [-24, -12, 0, 12, 24]  {
          renderLinePiece(
            i,
            info.base + level,
            5,
            colorsdark[(info.base * 7) % 12],
            yes
            [no, no]
          )
          renderLinePiece(
            i,
            info.base + level,
            2,
            colors[(info.base * 7) % 12],
            yes
            [no, no]
          )
        }
      for i in [1, 2, 3] {
        renderCover(
          i,
          if infos[i].gaps then
            [
              for j in [-1, 0, 1]
                (
                  if infos[i].range[1] % 2 = 2 then
                    infos[i + j].gaps[1][2] - 0.5 | 0
                  else
                    infos[i + j].gaps[2][2] - 0.5 | 0
                ) + floor(infos[i].range[1] / 2) * 12
            ]
          else
            [infos[i].bounds[1], infos[i].bounds[1], infos[i].bounds[1]],
          infos[i].curves
          no
        )
        renderCover(
          i,
          if infos[i].gaps then
            [
              for j in [-1, 0, 1]
                (
                  if infos[i].range[2] % 2 = 2 then
                    infos[i + j].gaps[1][1] + 0.5 | 0
                  else
                    infos[i + j].gaps[2][1] + 0.5 | 0
                ) + floor(infos[i].range[2] / 2) * 12
            ]
          else
            [infos[i].bounds[2], infos[i].bounds[2], infos[i].bounds[2]],
          infos[i].curves
          yes
        )
      }
      for info, i in infos
        for note, j in info.melody
          if note then {
            [
              shape: 'ellipse'
              fill: 'black'
              ~
              [
                getX(i) - noteSize / 2 + (j - 0.5) * barWidth / info.time
                getY(note) - noteSize / 2
              ]
              [
                noteSize
                noteSize
              ]
            ]
            [
              shape: 'ellipse'
              fill: colors[(note * 7) % 12]
              ~
              [
                getX(i) - (noteSize - 4) / 2 + (j - 0.5) * barWidth / info.time
                getY(note) - (noteSize - 4) / 2
              ]
              [
                noteSize - 4
                noteSize - 4
              ]
            ]
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