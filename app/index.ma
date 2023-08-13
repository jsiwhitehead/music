{
  analyse is any: no
  text is any: '6
G7: .  .  .  .  G  G
C:  A  .  G  .  C
G7: B  .  .  .  G  G
G7: A  .  G  .  D\'
C:  C  .  .  .  G  G
C:  G\' .  E  .  C
F:  B  .  A  .  F\' F
G7: E  .  C  .  D  .
C:  C'
  ~
  if analyse then visual(text, analyse)
  else [
    pad: 50
    font: 'Atkinson Hyperlegible'
    size: 14
    line: 1.5
    flow: 30
    fill: '#fafaed'
    height: 1
    ~
    [
      flow: ['row', 50]
      ~
      [
        bold: yes
        size: 24
        ~
        ['Music Analyser']
      ]
      [
        fill: 'rgb(75, 217, 75)'
        round: 10
        pad: 5
        width: 150
        bold: yes
        size: 17
        align: 'center'
        when click push yes -> analyse
        ~
        'Analyse »'
      ]
    ]
    [
      big: yes
      input: text
      pad: 10
      width: '100%'
      height: 1
      font: 'Roboto Mono'
      style: [
        resize: 'none'
      ]
    ]
  ]
}