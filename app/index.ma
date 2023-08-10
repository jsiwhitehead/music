{
  barWidth: 120
  lineHeight: 7
  barHeight: lineHeight * 40 - 1
  curveOffset: lineHeight * 2
  noteSize: lineHeight * 1.6
  overlap: lineHeight * 3

  getY: (y) => lineHeight * (24 - y) - 1

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

  renderBase: (x, info, blocks1, blocks2) => {

    if info.blocks then
      for colour in [
        'white'
        colorsfull[((info.key + info.chordMid) * 2 - 1) % 24]
      ]
        for i in getRange(info.range[1], info.range[2]) {
          index: (i + 1) % 2
          offset: 12 * floor(i / 2)
          ~
          [
            shape: 'rect'
            fill: colour
            opacity: if colour != 'white' then 0.5
            ~
            [
              x + (if info.curves[1] then curveOffset else 0)
              getY(info.blocks[index][2] + offset)
            ]
            [
              barWidth
                - (if info.curves[1] then curveOffset else 0)
                - (if info.curves[2] then curveOffset else 0)
              lineHeight * (info.blocks[index][2] - info.blocks[index][1])
            ]
          ]
          if info.curves[1] & blocks1 then
            renderCurve(
              colour
              if colour != 'white' then 0.5
              no
              x
              1
              [for y in blocks1[index] getY(y + offset)]
              [for y in info.blocks[index] getY(y + offset)]
            )
          if info.curves[2] & blocks2 then
            renderCurve(
              colour
              if colour != 'white' then 0.5
              no
              x + barWidth
              (-1)
              [for y in blocks2[index] getY(y + offset)]
              [for y in info.blocks[index] getY(y + offset)]
            )
        }
    else if info.chord = 'aug' then {
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

    for y in info.lines [
      shape: 'path'
      stroke: [width: 1, color: 'white', cap: 'round']
      opacity: 0.5
      ~
      ['M', x, getY(y)]
      ['l', barWidth, 0]
    ]

    for y in info.ext
      for colour in [
        'white'
        colorsfull[((y * 7) * 2 - 1) % 24]
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
          ['M', x + curveOffset - 1, getY(y)]
          ['L', x + barWidth - curveOffset + 1, getY(y)]
        ]

    for i in [1, 2] [
      shape: 'path'
      stroke: [width: 2, color: '#fafaed']
      ~
      ['M', x + (i - 1) * barWidth, 0]
      ['l', 0, barHeight]
    ]

  }

  renderNotes: (x, info, roots1, roots2) => {

    for i in getRange(info.rootsRange[1], info.rootsRange[2]) {
      index: (i + 1) % 2
      offset: 12 * floor(i / 2)
      ~
      [
        shape: 'rect'
        fill: 'rgb(150, 150, 150)'
        ~
        [
          x + curveOffset
          getY(info.roots[index] + offset) - 0.75
        ]
        [
          barWidth - curveOffset * 2
          1.5
        ]
      ]
      if roots1 then
        if ((roots1[1] - info.roots[1]) % 2 = 2) then
          renderCurve(
            no
            1
            [width: 1.5, color: 'rgb(150, 150, 150)', cap: 'round']
            x
            1
            [for y in [1, 2] getY(roots1[index] + offset)]
            [for y in [1, 2] getY(info.roots[index] + offset)]
          )
        else [
          shape: 'path'
          stroke: [width: 1.5, color: 'rgb(150, 150, 150)', cap: 'round']
          fill: 'none'
          ~
          ['M'
            x
            getY((roots1[index] + info.roots[index]) / 2 + offset)
          ]
          ['L'
            x
            getY(info.roots[index] + offset)
          ]
          ['l'
            curveOffset
            0
          ]
        ]
      if roots2 then
        if ((roots2[1] - info.roots[1]) % 2 = 2) then
          renderCurve(
            no
            1
            [width: 1.5, color: 'rgb(150, 150, 150)', cap: 'round']
            x + barWidth
            (-1)
            [for y in [1, 2] getY(roots2[index] + offset)]
            [for y in [1, 2] getY(info.roots[index] + offset)]
          )
        else [
          shape: 'path'
          stroke: [width: 1.5, color: 'rgb(150, 150, 150)', cap: 'round']
          fill: 'none'
          ~
          ['M'
            x + barWidth
            getY((roots2[index] + info.roots[index]) / 2 + offset)
          ]
          ['L'
            x + barWidth
            getY(info.roots[index] + offset)
          ]
          ['l'
            (-curveOffset)
            0
          ]
        ]
    }

    for base in info.base {
      [
        shape: 'path'
        stroke: [
          width: 5
          color: colorsdark[(base * 7) % 12]
          cap: 'round'
        ]
        ~
        ['M', x + curveOffset, getY(base + level)]
        ['l', barWidth - curveOffset * 2, 0]
      ]
      [
        shape: 'path'
        stroke: [
          width: 2
          color: colors[(base * 7) % 12]
          cap: 'round'
        ]
        ~
        ['M', x + curveOffset, getY(base + level)]
        ['l', barWidth - curveOffset * 2, 0]
      ]
    }

    for note, j in info.melody
      if note then {
        [
          shape: 'ellipse'
          fill: 'black'
          ~
          [
            x - noteSize / 2 + (j - 0.5) * barWidth / info.time
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
            x - (noteSize - 4) / 2 + (j - 0.5) * barWidth / info.time
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
    flow: 'row'
    fill: '#fafaed'
    style: ['flex-wrap': 'wrap']
    ~
    for info, i in data [
      fill: '#fafaed'
      style: [margin: '0px -{overlap}px']
      font: 'Atkinson Hyperlegible'
      size: 14
      ~
      [
        style: [
          position: 'relative'
          left: '{curveOffset * 2}px'
        ]
        ~
        info.name
      ]
      [
        svg: yes
        fill: '#fafaed'
        size: [barWidth + overlap * 2, barHeight]
        ~
        {
          bars: [
            if i = 1 then data[i] else data[i - 1]
            data[i]
            if i = len(data) then data[i] else data[i + 1]
          ]
          ~
          for bar, i in bars
            renderBase(
              overlap + (i - 2) * barWidth
              bar,
              bars[i - 1].blocks
              bars[i + 1].blocks
            )
          for bar, i in bars
            renderNotes(
              overlap + (i - 2) * barWidth
              bar,
              bars[i - 1].roots
              bars[i + 1].roots
            )
        }
      ]
    ]
  ]
}