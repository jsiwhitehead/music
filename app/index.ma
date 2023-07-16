{
  base: [50, 50]
  chunk: 80
  size: 8
  rsize: 1.5
  nsize: 6
  line: (start, pos, col, opa) => [
    shape: 'rect'
    fill: if opa < 0.5 then 'black' else colors[col % 12]
    opacity: opa
    ~
    [base[1] + start * chunk, base[2] + 150 - pos * size]
    [chunk, size - 1]
  ]
  root: (start, pos, col) => [
    shape: 'rect'
    fill: 'black'
    opacity: 1
    ~
    [
      base[1] + start * chunk,
      base[2] + 150 - 0.5 - pos * size - (rsize / 2)
    ]
    [chunk, rsize]
  ]
  note: (start, pos, col) => 
    if pos % 1 = 1 then {
      [
        shape: 'ellipse'
        fill: 'black'
        ~
        [
          base[1] + (start + 0.125) * chunk - (nsize / 2) - 1.5,
          base[2] + 150 - 0.5 - pos * size - (nsize / 2) - 1.5
        ]
        [nsize + 3, nsize + 3]
      ]
      [
        shape: 'ellipse'
        fill: 'white'
        ~
        [
          base[1] + (start + 0.125) * chunk - (nsize / 2),
          base[2] + 150 - 0.5 - pos * size - (nsize / 2)
        ]
        [nsize, nsize]
      ]
      [
        shape: 'ellipse'
        fill: colors[col % 12]
        opacity: 1
        ~
        [
          base[1] + (start + 0.125) * chunk - (nsize / 2),
          base[2] + 150 - 0.5 - pos * size - (nsize / 2)
        ]
        [nsize, nsize]
      ]
    } else {
      [
        shape: 'rect'
        fill: 'black'
        ~
        [
          base[1] + (start + 0.125) * chunk - ((nsize * 1.2) / 2) - 1.5,
          base[2] + 150 - 0.5 - pos * size - ((size - 1) / 2)
        ]
        [nsize * 1.2 + 3, size - 1]
      ]
      [
        shape: 'rect'
        fill: 'white'
        ~
        [
          base[1] + (start + 0.125) * chunk - ((nsize * 1.2) / 2),
          base[2] + 150 - 0.5 - pos * size - ((size - 4) / 2)
        ]
        [nsize * 1.2, size - 4]
      ]
      [
        shape: 'rect'
        fill: colors[col % 12]
        opacity: 1
        ~
        [
          base[1] + (start + 0.125) * chunk - ((nsize * 1.2) / 2),
          base[2] + 150 - 0.5 - pos * size - ((size - 4) / 2)
        ]
        [nsize * 1.2, size - 4]
      ]
    }
  ~
  [
    svg: yes
    ~
    line(0, 1, 2, 1)
    line(0, 2, 4, 1)
    line(0, 4, 1, 0.1)
    line(0, 5, 3, 1)
    line(0, 6, 5, 1)
    root(0, 0, 1)
    note(-0.25, 4, 2)
    note(0, 4, 2)

    line(1, 1, 2, 1)
    line(1, 2, 4, 1)
    line(1, 4, 1, 1)
    line(1, 5, 3, 1)
    line(1, 6, 5, 0.1)
    root(1, 3, 0)
    note(1.25, 0, 1)
    note(1.5, 2, 5)
    note(1.75, 4, 2)

    line(2, 1, 2, 0.1)
    line(2, 2, 4, 1)
    line(2, 4, 1, 0.1)
    line(2, 5, 3, 1)
    line(2, 6, 5, 1)
    root(2, 2, 5)
    note(2, 5, 4)
    note(2.25, 6, 6)
    note(2.5, 5, 4)

    line(3, 2, 4, 1)
    line(3, 3, 6, 1)
    line(3, 5, 3, 1)
    line(3, 6, 5, 1)
    line(3, 7, 7, 1)
    root(3, 5, 4)
    note(3.5, 5, 4)

    line(4, 1, 2, 1)
    line(4, 2, 4, 0.1)
    line(4, 4, 1, 1)
    line(4, 5, 3, 1)
    line(4, 6, 5, 0.1)
    root(4, 1, 3)
    note(4, 5, 4)

    line(5, 1, 2, 1)
    line(5, 2, 4, 0.1)
    line(5, 4, 1, 1)
    line(5, 5, 3, 1)
    line(5, 6, 5, 0.1)
    root(5, 0, 1)
    note(5.25, 1, 3)
    note(5.5, 3, 0)
    note(5.75, 5, 4)

    line(6, 2, 4, 0.1)
    line(6, 3, 6, 1)
    line(6, 5, 3, 0.1)
    line(6, 6, 5, 1)
    line(6, 7, 7, 0.1)
    root(6, 6, 6)
    note(6, 6, 6)

    line(7, 3, 6, 1)
    line(7, 4, 8, 1)
    line(7, 6, 5, 1)
    line(7, 7, 7, 1)
    line(7, 8, 9, 1)
    root(7, 6, 6)
    note(7.5, 6, 6)

    line(8, 2, 4, 1)
    line(8, 3, 6, 0.1)
    line(8, 5, 3, 1)
    line(8, 6, 5, 1)
    line(8, 7, 7, 0.1)
    root(8, 2, 5)
    note(8, 6, 6)

    line(9, 2, 4, 1)
    line(9, 3, 6, 1)
    line(9, 4, 8, 1)
    line(9, 6, 5, 1)
    line(9, 7, 7, 1)
    [
      shape: 'rect'
      fill: colors[2]
      opacity: 1
      ~
      [base[1] + 9 * chunk, base[2] + 150 - 4 * size]
      [chunk, (size - 1) / 2]
    ]
    root(9, 2, 5)
    note(9.25, 2, 5)
    note(9.5, 3.5, 2)
    note(9.75, 6, 6)

    line(10, 1, 2, 1)
    line(10, 2, 4, 1)
    line(10, 3, 6, 0.1)
    line(10, 5, 3, 1)
    line(10, 6, 5, 0.1)
    line(10, 8, 2, 1)
    root(10, 5, 4)
    note(10, 7, 1)
    note(10.25, 8, 3)
    note(10.5, 7, 1)

    for x in [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12] [
      shape: 'rect'
      fill: 'white'
      ~
      [base[1] + x * chunk - 0.5, base[2] + 150 - size * 9]
      [1, size * 10]
    ]
  ]
}