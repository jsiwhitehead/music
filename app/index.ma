{
  base: [50, 50]
  chunk: 80
  size: 9
  rsize: 4
  nsize: 6
  rowmove: 150
  line: (row, start, pos, col, opa) => [
    shape: 'rect'
    fill: if opa < 0.5 then 'black' else colors[col % 12]
    opacity: if opa < 0.5 then 0.15 else 0.7
    ~
    [base[1] + start * chunk, base[2] + 150 + row * rowmove - pos * size]
    [chunk, size - 1]
  ]
  root: (row, start, pos) => [
    shape: 'rect'
    fill: 'black'
    ~
    [
      base[1] + start * chunk,
      base[2] + 150 + row * rowmove - 0.5 - pos * size - (rsize / 2)
    ]
    [chunk * 0.15, rsize]
  ]
  note: (row, start, pos, col, acc) => 
    if !acc then {
      [
        shape: 'ellipse'
        fill: 'black'
        ~
        [
          base[1] + (start + 0.125) * chunk - (nsize / 2) - 2,
          base[2] + 150 + row * rowmove - 0.5 - pos * size - (nsize / 2) - 2
        ]
        [nsize + 4, nsize + 4]
      ]
      [
        shape: 'ellipse'
        fill: colors[col % 12]
        ~
        [
          base[1] + (start + 0.125) * chunk - (nsize / 2),
          base[2] + 150 + row * rowmove - 0.5 - pos * size - (nsize / 2)
        ]
        [nsize, nsize]
      ]
    } else {
      [
        shape: 'rect'
        fill: 'black'
        ~
        [
          base[1] + (start + 0.125) * chunk - ((nsize * 1.4) / 2) - 1.5,
          base[2] + 150 + row * rowmove - 0.5 - pos * size - ((size - 1) / 2)
        ]
        [nsize * 1.4 + 3, size - 1]
      ]
      [
        shape: 'rect'
        fill: colors[col % 12]
        ~
        [
          base[1] + (start + 0.125) * chunk - ((nsize * 1.4) / 2),
          base[2] + 150 + row * rowmove - 0.5 - pos * size - ((size - 5) / 2)
        ]
        [nsize * 1.4, size - 5]
      ]
    }
  ~
  [
    svg: yes
    ~
    line(0, 0, 1, 3, 1)
    line(0, 0, 2, 3, 1)
    line(0, 0, 3.5, 3, 0.2)
    line(0, 0, 4.5, 3, 1)
    line(0, 0, 5.5, 3, 1)
    root(0, 0, 0)
    note(0, -0.25, 3.5, 2, no)
    note(0, 0, 3.5, 2, no)

    line(0, 1, 1, 3, 1)
    line(0, 1, 2, 3, 1)
    line(0, 1, 3.5, 3, 1)
    line(0, 1, 4.5, 3, 1)
    line(0, 1, 5.5, 3, 0.2)
    root(0, 1, 2.5)
    note(0, 1.25, 0, 1, no)
    note(0, 1.5, 2, 5, no)
    note(0, 1.75, 3.5, 2, no)

    line(0, 2, 1, 3, 0.2)
    line(0, 2, 2, 3, 1)
    line(0, 2, 3.5, 3, 0.2)
    line(0, 2, 4.5, 3, 1)
    line(0, 2, 5.5, 3, 1)
    root(0, 2, 2)
    note(0, 2, 4.5, 4, no)
    note(0, 2.25, 5.5, 6, no)
    note(0, 2.5, 4.5, 4, no)

    line(0, 3, 2, 5, 1)
    line(0, 3, 3, 5, 1)
    line(0, 3, 4.5, 5, 1)
    line(0, 3, 5.5, 5, 1)
    line(0, 3, 6.5, 5, 1)
    root(0, 3, 4.5)
    note(0, 3.5, 4.5, 4, no)

    line(0, 4, 1, 3, 1)
    line(0, 4, 2, 3, 0.2)
    line(0, 4, 3.5, 3, 1)
    line(0, 4, 4.5, 3, 1)
    line(0, 4, 5.5, 3, 0.2)
    root(0, 4, 1)
    note(0, 4, 4.5, 4, no)

    line(0, 5, 1, 3, 1)
    line(0, 5, 2, 3, 0.2)
    line(0, 5, 3.5, 3, 1)
    line(0, 5, 4.5, 3, 1)
    line(0, 5, 5.5, 3, 0.2)
    root(0, 5, 0)
    note(0, 5.25, 1, 3, no)
    note(0, 5.5, 2.5, 0, no)
    note(0, 5.75, 4.5, 4, no)

    line(0, 6, 2, 5, 0.2)
    line(0, 6, 3, 5, 1)
    line(0, 6, 4.5, 5, 0.2)
    line(0, 6, 5.5, 5, 1)
    line(0, 6, 6.5, 5, 0.2)
    root(0, 6, 5.5)
    note(0, 6, 5.5, 6, no)

    line(0, 7, 3, 7, 1)
    line(0, 7, 4, 7, 1)
    line(0, 7, 5.5, 7, 1)
    line(0, 7, 6.5, 7, 1)
    line(0, 7, 7.5, 7, 1)
    root(0, 7, 5.5)
    note(0, 7.5, 5.5, 6, no)

    line(0, 8, 2, 5, 1)
    line(0, 8, 3, 5, 0.2)
    line(0, 8, 4.5, 5, 1)
    line(0, 8, 5.5, 5, 1)
    line(0, 8, 6.5, 5, 0.2)
    root(0, 8, 2)
    note(0, 8, 5.5, 6, no)

    line(0, 9, 2, 6, 1)
    line(0, 9, 5.5, 6, 1)
    line(0, 9, 6.5, 6, 1)
    [
      shape: 'rect'
      fill: colors[6 % 12]
      opacity: 0.7
      ~
      [base[1] + 9 * chunk, base[2] + 150 + 0 * rowmove - 3.5 * size]
      [chunk, size * 1.5 - 1]
    ]
    [
      shape: 'rect'
      fill: colors[6 % 12]
      opacity: 0.7
      ~
      [base[1] + 9 * chunk, base[2] + 150 + 0 * rowmove - 4 * size]
      [chunk, size * 0.5 - 1]
    ]
    root(0, 9, 2)
    note(0, 9.25, 2, 5, no)
    note(0, 9.5, 3.5, 2, yes)
    note(0, 9.75, 5.5, 6, no)

    line(0, 10, 2, 4, 1)
    line(0, 10, 3, 4, 0.2)
    line(0, 10, 4.5, 4, 1)
    line(0, 10, 5.5, 4, 0.2)
    line(0, 10, 7, 4, 1)
    root(0, 10, 4.5)
    note(0, 10, 6, 1, no)
    note(0, 10.25, 7, 3, no)
    note(0, 10.5, 6, 1, no)

    line(0, 11, 2.5, 11, 1)
    line(0, 11, 3.5, 11, 1)
    line(0, 11, 5, 11, 1)
    line(0, 11, 6, 11, 1)
    line(0, 11, 7.5, 11, 1)
    root(0, 11, 1.5)
    note(0, 11.5, 6, 1, no)

    line(0, 12, 2.5, 1, 0.2)
    line(0, 12, 3.5, 1, 1)
    line(0, 12, 4.5, 1, 1)
    line(0, 12, 6, 1, 0.2)
    line(0, 12, 7, 1, 1)
    root(0, 12, 7)
    note(0, 12, 6, 1, no)

    line(1, 0, 2.5, 1, 0.2)
    line(1, 0, 3.5, 1, 1)
    line(1, 0, 4.5, 1, 1)
    line(1, 0, 6, 1, 0.2)
    line(1, 0, 7, 1, 1)
    root(1, 0, 7)
    note(1, 0.25, 2.5, 0, no)
    note(1, 0.5, 4.5, 4, no)
    note(1, 0.75, 6, 1, no)

    line(1, 1, 2.5, 0, 1)
    line(1, 1, 3.5, 0, 1)
    line(1, 1, 5, 0, 1)
    line(1, 1, 6, 0, 1)
    line(1, 1, 7, 0, 1)
    root(1, 1, 7)
    note(1, 1, 7, 3, no)

    line(1, 2, 3.5, 3, 1)
    line(1, 2, 7, 3, 1)
    line(1, 2, 8, 3, 1)
    [
      shape: 'rect'
      fill: colors[3 % 12]
      opacity: 0.7
      ~
      [base[1] + 2 * chunk, base[2] + 150 + 1 * rowmove - 4 * size]
      [chunk, size * 0.5 - 1]
    ]
    [
      shape: 'rect'
      fill: colors[3 % 12]
      opacity: 0.7
      ~
      [base[1] + 2 * chunk, base[2] + 150 + 1 * rowmove - 5.5 * size]
      [chunk, size * 1.5 - 1]
    ]
    root(1, 2, 3.5)
    note(1, 2.5, 6, 1, no)
    note(1, 2.75, 7, 3, no)

    line(1, 3, 3.5, 3, 0.2)
    line(1, 3, 4.5, 3, 1)
    line(1, 3, 5.5, 3, 1)
    line(1, 3, 7, 3, 1)
    line(1, 3, 8, 3, 1)
    root(1, 3, 6)
    note(1, 3, 8, 5, no)
    note(1, 3.75, 8, 5, no)

    line(1, 4, 3.5, 3, 0.2)
    line(1, 4, 4.5, 3, 1)
    line(1, 4, 5.5, 3, 1)
    line(1, 4, 7, 3, 1)
    line(1, 4, 8, 3, 1)
    root(1, 4, 6)
    note(1, 4, 8, 5, no)
    note(1, 4.5, 7, 3, no)
    note(1, 4.75, 6, 1, no)

    line(1, 5, 3.5, 2, 1)
    line(1, 5, 4.5, 2, 1)
    line(1, 5, 6, 2, 1)
    line(1, 5, 7, 2, 1)
    line(1, 5, 8, 2, 0.2)
    root(1, 5, 3.5)
    note(1, 5, 8, 5, no)
    note(1, 5.5, 8, 5, no)

    line(1, 6, 6, 2, 1)
    line(1, 6, 7, 2, 1)
    line(1, 6, 8, 2, 1)
    [
      shape: 'rect'
      fill: colors[2 % 12]
      opacity: 0.7
      ~
      [base[1] + 6 * chunk, base[2] + 150 + 1 * rowmove - 4 * size]
      [chunk, size * 1.5 - 1]
    ]
    [
      shape: 'rect'
      fill: colors[2 % 12]
      opacity: 0.7
      ~
      [base[1] + 6 * chunk, base[2] + 150 + 1 * rowmove - 4.5 * size]
      [chunk, size * 0.5 - 1]
    ]
    root(1, 6, 6)
    note(1, 6.5, 7, 3, no)
    note(1, 6.75, 6, 1, no)

    line(1, 7, 3.5, 3, 1)
    line(1, 7, 4.5, 3, 1)
    line(1, 7, 5.5, 3, 0.2)
    line(1, 7, 7, 3, 1)
    line(1, 7, 8, 3, 1)
    root(1, 7, 2.5)
    note(1, 7, 7, 3, no)
    note(1, 7.5, 7, 3, no)
    note(1, 7.75, 7, 3, no)

    line(1, 8, 3.5, 3, 1)
    line(1, 8, 4.5, 3, 1)
    line(1, 8, 5.5, 3, 0.2)
    line(1, 8, 7, 3, 1)
    line(1, 8, 8, 3, 1)
    root(1, 8, 2.5)
    note(1, 8, 7, 3, no)
    note(1, 8.125, 8, 5, no)
    note(1, 8.25, 7, 3, no)
    note(1, 8.5, 5.5, 6, no)
    note(1, 8.75, 6, 1, no)

    line(1, 9, 3.5, 3, 1)
    line(1, 9, 4.5, 3, 1)
    line(1, 9, 5.5, 3, 1)
    line(1, 9, 7, 3, 1)
    line(1, 9, 8, 3, 1)
    root(1, 9, 5.5)
    note(1, 9, 7, 3, no)

    line(1, 10, 2, 5, 1)
    line(1, 10, 3, 5, 1)
    line(1, 10, 4, 5, 1)
    line(1, 10, 5.5, 5, 1)
    line(1, 10, 7, 5, 1)
    root(1, 10, 2)
    note(1, 10.5, 6, 1, no)
    note(1, 10.75, 5.5, 6, no)

    line(1, 11, 2, 4, 1)
    line(1, 11, 3, 4, 0.2)
    line(1, 11, 4.5, 4, 1)
    line(1, 11, 5.5, 4, 0.2)
    line(1, 11, 7, 4, 1)
    root(1, 11, 4.5)
    note(1, 11, 6, 1, no)
    note(1, 11.75, 6, 1, no)

    line(1, 12, 2, 5, 1)
    line(1, 12, 5.5, 5, 1)
    line(1, 12, 7, 5, 1)
    [
      shape: 'rect'
      fill: colors[5 % 12]
      opacity: 0.7
      ~
      [base[1] + 12 * chunk, base[2] + 150 + 1 * rowmove - 3.5 * size]
      [chunk, size * 1.5 - 1]
    ]
    [
      shape: 'rect'
      fill: colors[5 % 12]
      opacity: 0.7
      ~
      [base[1] + 12 * chunk, base[2] + 150 + 1 * rowmove - 4 * size]
      [chunk, size * 0.5 - 1]
    ]
    root(1, 12, 2)
    note(1, 12, 6, 1, no)
    note(1, 12.25, 5.5, 6, no)
    note(1, 12.5, 4.5, 4, no)
    note(1, 12.75, 5.5, 6, no)

    line(2, 0, 2, 4, 1)
    line(2, 0, 3, 4, 0.2)
    line(2, 0, 4.5, 4, 1)
    line(2, 0, 5.5, 4, 0.2)
    line(2, 0, 7, 4, 1)
    root(2, 0, 4.5)
    note(2, 0, 6, 1, no)
    note(2, 0.5, 6, 1, no)

    line(2, 1, 2, 4, 1)
    line(2, 1, 3, 4, 1)
    line(2, 1, 4.5, 4, 1)
    line(2, 1, 5.5, 4, 1)
    line(2, 1, 7, 4, 1)
    root(2, 1, 1)
    note(2, 1.5, 5.5, 6, no)
    note(2, 1.75, 4.5, 4, no)

    line(2, 2, 2, 3, 0.2)
    line(2, 2, 3.5, 3, 1)
    line(2, 2, 4.5, 3, 1)
    line(2, 2, 5.5, 3, 0.2)
    line(2, 2, 7, 3, 1)
    root(2, 2, 1)
    note(2, 2, 5.5, 6, no)
    note(2, 2.75, 5.5, 6, no)

    line(2, 3, 4.5, 5, 1)
    line(2, 3, 5.5, 5, 1)
    line(2, 3, 6.5, 5, 1)
    [
      shape: 'rect'
      fill: colors[5 % 12]
      opacity: 0.7
      ~
      [base[1] + 3 * chunk, base[2] + 150 + 2 * rowmove - 2.5 * size]
      [chunk, size * 1.5 - 1]
    ]
    [
      shape: 'rect'
      fill: colors[5 % 12]
      opacity: 0.7
      ~
      [base[1] + 3 * chunk, base[2] + 150 + 2 * rowmove - 3 * size]
      [chunk, size * 0.5 - 1]
    ]
    root(2, 3, 4.5)
    note(2, 3, 5.5, 6, no)
    note(2, 3.25, 3.5, 2, no)
    note(2, 3.5, 4.5, 4, no)
    note(2, 3.75, 3.5, 2, no)

    line(2, 4, 2, 3, 0.2)
    line(2, 4, 3.5, 3, 1)
    line(2, 4, 4.5, 3, 1)
    line(2, 4, 5.5, 3, 0.2)
    line(2, 4, 7, 3, 1)
    root(2, 4, 1)
    note(2, 4, 5.5, 6, no)

    line(2, 5, 2, 3, 1)
    line(2, 5, 3.5, 3, 1)
    line(2, 5, 4.5, 3, 1)
    line(2, 5, 5.5, 3, 1)
    line(2, 5, 7, 3, 1)
    root(2, 5, 3.5)
    note(2, 5.5, 4.5, 4, no)

    for x in [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12]
      for y in [0, 1, 2]
        [
          shape: 'rect'
          fill: 'white'
          ~
          [base[1] + x * chunk - 0.5, base[2] + 150 + y * rowmove - size * 9]
          [1, size * 10]
        ]
  ]
}