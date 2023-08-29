(text, analyse) => {
  data: calc(text)

  barWidth: data.time * 30
  lineHeight: 5
  barHeight: lineHeight * (data.range[2] - data.range[1] + 2) - 1
  curveOffset: lineHeight * 2
  noteSize: lineHeight * 2
  overlap: lineHeight * 3

  getY: (y) => lineHeight * (data.range[2] + 1 - y) - 1

  renderCurve: (colour, opacity, stroke, x, dir, ys1, ys2) => {
    mids: [(ys1[1] + ys2[1]) / 2, (ys1[2] + ys2[2]) / 2]
    ~
    [
      shape: 'path'
      fill: colour
      opacity: opacity
      stroke: stroke
      ~
      ['M'
        x
        mids[2]
      ]
      ['c'
        dir * curveOffset * 0.25, (ys2[2] - mids[2]) / 2, ','
        dir * curveOffset * 0.5, ys2[2] - mids[2], ','
        dir * curveOffset, ys2[2] - mids[2]
      ]
      ['L'
        x + dir * curveOffset
        ys2[1]
      ]
      ['c'
        dir * (-curveOffset * 0.5), 0, ','
        dir * (-curveOffset * 0.75), (mids[1] - ys2[1]) / 2, ','
        dir * (-curveOffset), mids[1] - ys2[1]
      ]
    ]
  }

  renderSingleCurve: (stroke, opacity, x, dir, y1, y2, end) => {
    mid: (y1 + y2) / 2
    ~
    [
      shape: 'path'
      stroke: stroke
      opacity: opacity
      fill: 'none'
      ~
      ['M'
        x
        mid
      ]
      ['c'
        dir * curveOffset * 0.25, (y2 - mid) / 2, ','
        dir * curveOffset * 0.5, y2 - mid, ','
        dir * curveOffset, y2 - mid
      ]
      ['l'
        dir * end
        0
      ]
    ]
  }

  renderBlocks: (range, blocks, blocks1, blocks2, curves, color, opacity) =>
    for i in getRange(range[1], range[2]) {
      index: (i + 1) % 2
      offset: 12 * floor(i / 2)
      ~
      if blocks[index] then {
        [
          shape: 'rect'
          fill: color
          opacity: opacity
          ~
          [
            x + (if curves[index][1] then curveOffset else 0)
            getY(blocks[index][2] + offset)
          ]
          [
            barWidth
              - (if curves[index][1] then curveOffset else 0)
              - (if curves[index][2] then curveOffset else 0)
            lineHeight * (blocks[index][2] - blocks[index][1])
          ]
        ]
        if curves[index][1] & blocks1 then
          renderCurve(
            color
            opacity
            no
            x
            1
            [for y in blocks1[index] getY(y + offset)]
            [for y in blocks[index] getY(y + offset)]
          )
        if curves[index][2] & blocks2 then
          renderCurve(
            color
            opacity
            no
            x + barWidth
            (-1)
            [for y in blocks2[index] getY(y + offset)]
            [for y in blocks[index] getY(y + offset)]
          )
      }
    }

  renderBase: (x, info, guides1, guides2, blocks1, blocks2) => {

    if !info.guides.type then
      renderBlocks(
        info.range,
        info.guides,
        guides1,
        guides2,
        info.guidesCurves,
        'rgb(235, 235, 235)',
        1
      )

    if !info.blocks.type then
      for colour in [
        'white'
        colorsfull[(info.mid * 2 - 1) % 24]
      ]
        renderBlocks(
          info.range,
          info.blocks,
          blocks1,
          blocks2,
          info.blocksCurves,
          colour
          if colour != 'white' then 0.5
        )

    if no then
      if info.chord = 'aug' then {
        [
          shape: 'rect'
          fill: 'white'
          ~
          [
            x
            getY(info.bounds[2])
          ]
          [
            barWidth
            lineHeight * (info.bounds[2] - info.bounds[1])
          ]
        ]
        for y in getRange(1, (info.bounds[2] - info.bounds[1]) / 2)
          [
            shape: 'rect'
            fill: colorsfull[(((info.bounds[1] + y * 2) * 7) * 2 - 3) % 24]
            opacity: 0.5
            ~
            [
              x
              getY(info.bounds[1] + y * 2)
            ]
            [
              barWidth
              lineHeight * 2
            ]
          ]
      }

    for y in info.cover [
      shape: 'path'
      stroke: [width: lineHeight * 2, color: 'white', cap: 'round']
      fill: 'none'
      ~
      ['M', x + lineHeight * 1.8, getY(y)]
      ['L', x + barWidth - lineHeight * 1.8, getY(y)]
    ]

    for y in info.ext
      for colour in [
        'white'
        colorsfull[(info.mid * 2 - 1) % 24]
      ]
        if info.chord = 'dim' then [
          shape: 'rect'
          fill: colour
          opacity: if colour != 'white' then 0.5
          ~
          [
            x
            getY(y + 0.25)
          ]
          [
            barWidth
            lineHeight / 2
          ]
        ] else [
          shape: 'path'
          stroke: [width: lineHeight / 2, color: colour, cap: 'round']
          opacity: if colour != 'white' then 0.5
          fill: 'none'
          ~
          ['M', x + lineHeight * 1.5, getY(y)]
          ['L', x + barWidth - lineHeight * 1.5, getY(y)]
        ]

    for i in [1, 2] [
      shape: 'path'
      stroke: [width: 2, color: 'white']
      ~
      ['M', x + (i - 1) * barWidth, 0]
      ['l', 0, barHeight]
    ]

  }

  renderNotes: (x, info, root1, root2) => {

    for i in getRange(info.rootRange[1], info.rootRange[2]) {
      index: (i + 1) % 2
      offset: 12 * floor(i / 2)
      ~
      [
        shape: 'path'
        stroke: [width: if index % 2 = info.rootOffset then 3 else 1.5, color: 'rgb(140, 140, 140)', cap: 'round']
        fill: 'none'
        ~
        ['M'
          x + (lineHeight * 1.5 + 1)
          getY(info.root[index] + offset)
        ]
        ['l'
          barWidth - (lineHeight * 1.5 + 1) * 2
          0
        ]
      ]
      if root1 & abs(root1[index] - info.root[index]) <= 2 then
        if ((root1[index] - info.root[index]) % 2 = 2) | yes then
          renderCurve(
            no
            1
            [width: 1.5, color: 'rgb(140, 140, 140)', cap: 'round']
            x
            1
            [for y in [1, 2] getY(root1[index] + offset)]
            [for y in [1, 2] getY(info.root[index] + offset)]
          )
        else [
          shape: 'path'
          stroke: [width: 1.5, color: 'rgb(140, 140, 140)', cap: 'round']
          fill: 'none'
          ~
          ['M'
            x
            getY((root1[index] + info.root[index]) / 2 + offset)
          ]
          ['L'
            x
            getY(info.root[index] + offset)
          ]
          ['l'
            curveOffset
            0
          ]
        ]
      if root2 & abs(root2[index] - info.root[index]) <= 2 then
        if ((root2[index] - info.root[index]) % 2 = 2) | yes then
          renderCurve(
            no
            1
            [width: 1.5, color: 'rgb(140, 140, 140)', cap: 'round']
            x + barWidth
            (-1)
            [for y in [1, 2] getY(root2[index] + offset)]
            [for y in [1, 2] getY(info.root[index] + offset)]
          )
        else [
          shape: 'path'
          stroke: [width: 1.5, color: 'rgb(140, 140, 140)', cap: 'round']
          fill: 'none'
          ~
          ['M'
            x + barWidth
            getY((root2[index] + info.root[index]) / 2 + offset)
          ]
          ['L'
            x + barWidth
            getY(info.root[index] + offset)
          ]
          ['l'
            (-curveOffset)
            0
          ]
        ]
    }

    for move in info.moves {
      renderSingleCurve(
        if move.role = 0 & no then
          [width: 3, color: 'rgb(140, 140, 140)', cap: 'round']
        else if move.role = 1 & no then
          [width: 1.5, color: 'rgb(140, 140, 140)', cap: 'round']
        else
          [width: 1.5, dash: '3', color: 'rgb(140, 140, 140)', cap: 'round']
        1
        x
        1
        getY(move.note - move.move)
        getY(move.note)
        curveOffset
      )
    }
    for move in info.nextMoves
      renderSingleCurve(
        if move.role2 = 0 & no then
          [width: 3, color: 'rgb(140, 140, 140)', cap: 'round']
        else if move.role2 = 1 & no then
          [width: 1.5, color: 'rgb(140, 140, 140)', cap: 'round']
        else
          [width: 1.5, dash: '3', color: 'rgb(140, 140, 140)', cap: 'round']
        1
        x + barWidth
        (-1)
        getY(move.note)
        getY(move.note - move.move)
        curveOffset
      )

    for base in info.base {
      [
        shape: 'path'
        stroke: [
          width: 4.5
          color: colorsdark[(base * 7) % 12]
          cap: 'round'
        ]
        ~
        ['M', x + lineHeight * 1.5 + 1, getY(base + level)]
        ['l', barWidth - (lineHeight * 1.5 + 1) * 2, 0]
      ]
      [
        shape: 'path'
        stroke: [
          width: 1.5
          color: colors[(base * 7) % 12]
          cap: 'round'
        ]
        ~
        ['M', x + lineHeight * 1.5 + 1, getY(base + level)]
        ['l', barWidth - (lineHeight * 1.5 + 1) * 2, 0]
      ]
    }

  }

  renderMelody: (x, info) => {
    for set, j in info.melody
      for note in set {
        [
          shape: 'ellipse'
          fill: 'black'
          ~
          [
            x - noteSize / 2 + (j - 0.5) * barWidth / data.time
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
            x - (noteSize - 4) / 2 + (j - 0.5) * barWidth / data.time
            getY(note) - (noteSize - 4) / 2
          ]
          [
            noteSize - 4
            noteSize - 4
          ]
        ]
      }
      
  }

  ~
  [
    pad: 50
    font: 'Atkinson Hyperlegible'
    size: 14
    fill: 'white'
    flow: 40
    ~
    [
      fill: 'lightblue'
      round: 10
      pad: 5
      width: 150
      bold: yes
      size: 17
      align: 'center'
      when click push no -> analyse
      ~
      '« Back'
    ]
    [
      flow: 'row'
      style: ['flex-wrap': 'wrap']
      ~
      for info, i in data.bars [
        pad: [bottom: 50]
        style: [margin: '0 -{overlap}px']
        ~
        if no then [
          pad: [bottom: 10]
          style: [
            position: 'relative'
            left: '{curveOffset * 2}px'
          ]
          ~
          info.name
        ]
        [
          style: [position: 'relative']
          ~
          [
            svg: yes
            size: [barWidth + overlap * 2, barHeight]
            ~
            {
              bars: [
                if i = 1 then data.bars[i] else data.bars[i - 1]
                data.bars[i]
                if i = len(data.bars) then data.bars[i] else data.bars[i + 1]
              ]
              ~
              for bar, i in bars
                renderBase(
                  overlap + (i - 2) * barWidth
                  bar,
                  bars[i - 1].guides
                  bars[i + 1].guides
                  bars[i - 1].blocks
                  bars[i + 1].blocks
                )
              for bar, i in bars
                if bar.root then renderNotes(
                  overlap + (i - 2) * barWidth
                  bar,
                  bars[i - 1].root
                  bars[i + 1].root
                )
            }
          ]
          [
            style: [
              position: 'absolute',
              top: 0,
              left: '{overlap}px'
              zIndex: 10
            ]
            ~
            [
              svg: yes
              size: [barWidth, barHeight]
              ~
              renderMelody(0, data.bars[i])
            ]
          ]
        ]
      ]
    ]
  ]
}