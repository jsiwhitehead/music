import webfont from "webfontloader";

import maraca, { effect } from "./maraca";
import render from "./render";
import getPiece from "./piece";

import "./style.css";

webfont.load({
  google: {
    families: [
      "Atkinson Hyperlegible",
      "Atkinson Hyperlegible:italic",
      "Atkinson Hyperlegible:bold",
      "Atkinson Hyperlegible:bolditalic",
      "Roboto Mono",
    ],
  },
});

const mod = (x, n) => ((x % n) + n) % n;

const set = (obj, path, value) =>
  path.reduce(
    (res, k, i) => (res[k] = i === path.length - 1 ? value : res[k] || {}),
    obj
  );
// @ts-ignore
const app = import.meta.glob("../app/**", { eager: true, as: "raw" });
const source = Object.keys(app).reduce((res, k) => {
  const p = k
    .slice(3, -3)
    .split(/[\\\\\\/]/)
    .slice(1);
  set(res, p, app[k]);
  return res;
}, {});

const songs = {
  GodOnlyKnows: `
    4
    D/A:
    D/A: . D C# D
    Bm6: C# B . F#
    Bm6: . B
    F#m: . . . G#
    F#m7: A G# A C#
    B/A: . F# . A,
    B/A: B C#
    E/B:
    E/B: . E D# E
    Cdim7: F# . A, B
    Cdim7: . C
    E/B: . . . E
    E/B: . E D# E
    Bbm7b5: . G# . C#,
    Bbm7b5: D# E
    A:
    A: C# B C# B
    E/G#: . . E B
    E/G#: A . G# E
    F#m7: . . F#
    F#m7:
    Esus4: E . . E
    Em: F# G
  `,
  CircleOfLife: `
    4
    Bb: F F F F
    Bb: . F G F
    Cm7/Bb: . Eb . .
    Cm7/Bb: . . . C
    F/A: Eb Eb . Eb
    F/A: Eb G F D
    Bb: . . . .
    Bb: . . . F
    Gm: Bb . Bb Bb
    Gm: . . G A
    Cm7: Bb C C C
    Cm7: . . G Bb
    Ab: C . C D
    Ab: Eb D . Bb
    Fsus4: C . . .
    F: . . . D,
    Bb: F . F F
    Bb: . F G F
    Cm7/Bb: . Eb . .
    Cm7/Bb: . . C D
    F/A: Eb . Eb Eb
    F/A: Eb G . F
    Bb: D . . .
    Bb: . . F F
    Gm: Bb Bb Bb Bb
    Gm: . . G A
    Cm7: Bb C C C
    Cm7: . C C C
    Ab: C . C D
    Ab: Eb D Bb D
    Fsus4: C . F, F
    F: F' . D C
    Bb: D . . .
    Eb/Bb: . . . .
    Bb: . . D D
    Bb: Eb . F F
    Ab/Bb: Eb . . .
    Ab/Bb: . . . .
    Ab/Bb: . . Eb Eb
    Ab/Bb: F . . D
    Eb: C Bb . .
    Ab/Eb: . . . .
    Eb: . . . F
    Eb: Eb' . D C
    Fsus4: C . . .
    Fsus4: . . . .
    F: . . F F
    F: F . F .
    Bb/D: D . . .
    Bb/D: . C Bb .
    G7: . . D D
    G7: Eb F . F
    Cm: . Eb Eb .
    Cm: . . . .
    Cm7b5/Gb: . . . .
    Cm7b5/Gb: . G . G
    Bb: F . . D
    Bb: . C Bb .
    F7: . . . F
    F7: Eb' . D C
    Eb/Bb: . . Bb G
    Eb/Bb: Bb
    Bb: Bb
    Bb:
    Bb: F . F F
    Bb: . F G F
    Cm7/Bb: . Eb . .
    Cm7/Bb: . . C D
    F/A: Eb . Eb Eb
    F/A: Eb G . F
    Bb: D . . .
    Bb: . . F F
    Gm: Bb Bb Bb Bb
    Gm: . . G A
    Cm7: Bb C C C
    Cm7: . C C C
    Ab: C . C D
    Ab: Eb D Bb D
    Fsus4: C . F, F
    F: F' . D C
    Bb: D . . .
    Eb/Bb: . . . .
    Bb: . . D D
    Bb: Eb . F F
    Ab/Bb: Eb . . .
    Ab/Bb: . . . .
    Ab/Bb: . . Eb Eb
    Ab/Bb: F . . D
    Eb: C Bb . .
    Ab/Eb: . . . .
    Eb: . . . Bb
    Eb: Eb . F G
    Fsus4: F . . .
    Fsus4: . . . .
    F: . . F F
    Ab/Eb: F . Ab .
    Db: F
    Db:
    Bb7: . . F F
    Bb7: Gb Ab . .
    Ebm: Ab Gb . Gb
    Ebm:
    Ebm7b5/Gb:
    Ebm7b5/Gb: . Bb . Bb
    Db/Ab: Ab . . F
    Db/Ab: Eb Db . Bb
    Absus4: Ab . . Ab
    Ab7: Gb' . F Eb
    Gb/Db: Db
    Gb/Db: . . . Bb
    Db: Db
    Db:
  `,
  MyFoolishHeart: `
    4
    Bbmaj7: F
    Ebmaj7: . Bb, D F
    D-7: G A G
    G7: . . G
    C-7: G
    C-7/Bb: . C, Eb G
    A7sus4: A
    A7: . . A
    D-7: A
    D7#9: . D, F A
    G-7: Bb C Bb
    Db7: . . Bb
    C-7: Bb
    C-7: . Eb, G Bb
    C-7b5: C
    F7b9: . . Bb C
    Bbmaj7: D . . D
    Bbmaj7: D . C Bb
    F-9: D . D
    Bb+7: . . C Bb
    Ebmaj7: C . C C
    Ebmaj7: D C A Bb
    A-7b5: C
    D7: . . Bb A
    G-7: Bb . . Bb
    D7#9: Bb A G A
    G-7: Bb . Bb
    C7: . . A G
    C-7: A . . A
    G+7: A F G F
    C-7: A
    F7: . . G
  `,
  VeryEarly: `
    6
    Amaj7: E . . . C#
    G7: A . G'
    Cmaj7: E . . . G,
    F7: G# . F#'
    Bbmaj7: F . . . F,
    E7: F# . E'
    Amaj7: C#
    G7#11:
    Bbmaj7: F . . . Bb,
    F#-7: A . A'
    D#-7: G# . . . G#,
    G#7b9: A . F'
    C#-9: F# . . . F#,
    F7: G . G' . . F
    Bbmaj7: D
    E7: . . A B C# D
  `,
  BluesForAlice: `
    F6 F6 E-7 A7b9 D-7 G7 C-7 F7
    Bb7 Bb7 Bb-7 Eb7 A-7 D7 Ab-7 Db7
    G-7 G-7 C7 C7 A-7 D-7 G-7 C7
  `,
  WillsPiece: `
    Gbmaj7 Gbmaj7 Bbmaj7/Eb Bbmaj7/Eb
    Ebm Ebm Ab13#11 Ab13#11
    Cm11 Dm D7 Gm7 Gbmaj7b5
    Bb/F Emaj7b5 Ebm9 Ab13
    Dbmaj7 Dbmaj7 Fmaj7/Bb Fmaj7/Bb
    Bbm Bbm Eb13 Eb13
    Gm11 Am A7 Dm7 Ab7sus4
    Bb7sus4 Bm7 Amaj7/Db Abm7 Db13
  `,
  Cello: `
    8,4
    G D' B' A B D, B' D,
    G, D' B' A B D, B' D,
    G, E' C' B C E, C' E,
    G, E' C' B C E, C' E,
    G, F' C' B C F, C' F,
    G, F' C' B C F, C' F,
    G, G' B A B G B G
    G, G' B A B G B F#
    G, E' B' A B G F# G
    E G F# G B, D C# B
    C# G' A G A G A G
    C# G' A G A G A G
    F# A D C# D A G A
    F# A G A D, F# E D
    E, B' G' F# G B, G' B,
    E, B' G' F# G B, G' B,
    E, C#' D E D C# B A
    G' F# E D' C# B A G
    F# E D D' A D F#, A
    D, E F# A G F# E D
    G#' D F E F D G#' D
    B' D, F E F D G#' D
    C E A B C A E D
    C E A B C A F# E
    D# F# D# F# A F# A F#
    D# F# D# F# A F# A F#
    G F# E G F# G A F#
    G F# E D C B A G
    F# C' D C D C D C
    F# C' D C D C D C
    G B F' E F B F' B
    G B F' E F B F' B
    G C E D E C E C
    G C E D E C E C
    G F#' C' B C F# C' F#
    G, F#' C' B C F# C' F#
    G, D' B' A B G F# E
    D C B A G F# E D
    C# A' E' F# G E F# G
    C#, A' E' F# G E F# G
    C,, A' D E F# D E F#
    C, A' D E F# D E F#
    C, A' D F# A C# D .
    . A, B C D E F# G
    A F# D E F# G A B
    C A F# G A B C D
    Eb D C# D D C B C
    C A F# E D A B C
    D, A' D F# A B C A
    B G D C B G A B
    D, G B D G A B G
    C#' Bb A Bb Bb A G# A
    A G F# G G E C# B
    A C# E G A C# D C#
    D A F# E F# A D, F#
    A, D C# B A G F# E
    D . C' B A G F# E
    D C' B A G F# E D
    C B' A G F# E D C
    B A' G F# E D C B
    A G' F# E F# A D, F#
    E A F# A G A E A
    F# A D, A' G A E A
    F# A D, A' G A E A
    F# A D, A' E A F# A
    G A A A B A D, A'
    A A B A C A D, A'
    B A C A D A B A
    C A B A C A A A
    B A A A B A G A
    A A G A A A F# A
    G A F# A G A E A
    F# A D, E F D F# D
    G D G#' D A' D, Bb' D,
    B' D, C' D, C#' D, D' D,
    Eb' D, E' D, F' D, F#' D,
    G' B, D, B' G' B, G' B,
    G' B, D, B' G' B, G' B,
    G' A, D, A' G' A, G' A,
    G' A, D, A' G' A, G' A,
    F#' C D, C' F#' C F#' C
    F#' C D, C' F#' C F#' C
    G, B' G'
  `,
  GiantSteps: `
    4,4*
    Bmaj7: F#
    D7: D
    Gmaj7: B
    Bb7: G . . Bb
    Ebmaj7:
    Ebmaj7:
    Am7: B . . A
    D7:
    Gmaj7: D
    Bb7: Bb
    Ebmaj7: G
    F#7: D# . . F#
    Bmaj7:
    Bmaj7:
    Fm7: G
    Bb7: F . . Bb
    Ebmaj7:
    Ebmaj7:
    Am7: B
    D7: A . . D
    Gmaj7:
    Gmaj7:
    C#m7: D#
    F#7: D# . . F#
    Bmaj7:
    Bmaj7:
    Fm7: G
    Bb7: G . . Bb
    Ebmaj7:
    Ebmaj7:
    C#m7: F# . . F#
    F#7:
  `,
  InMyLife: `
    4
    A: C# . A' .
    A: C#, D E G#
    E7:
    E7:
    A: C#, . A' .
    A: C#, D E G#
    E7:
    E7: . . E F#
    A: B . A .
    A: B . C# .
    F#m: E C#
    A7: . . B C#
    D: B . C# B
    Dm: A . . F
    A: E C#' . C#
    A: . . E, F#
    A: B . A .
    A: B . C# .
    F#m: E C#
    A7: . . B C#
    D: B . C# B
    Dm: A . . F
    A: E . C#' C#
    A: . . A B
    F#m: C# B B A
    F#m: A F# F# A
    D: C# B
    D: . . . C#
    G: D C# B A
    G: . . . F
    A: E C#' C# C#
    A: . . A B
    F#m: C# B B A
    F#m: A F# F# A
    B7: C# B
    B7: . . . F#
    Dm: C' B A B
    Dm: A . . F
    A: E . C#' C#
    A:
  `,
  Chopin: `
  6
  C . Db . B
  F,, . (C'' F Ab C) . (Ab C F F')
  (F E'') . (Db' E G Bb) . (Bb Db E Db')
  F, . (C'' F Ab C) . (Ab C F F')
  (F E'') . (Db' E G Bb) . (Bb Db E Db')
  F . (C' F Ab C) Db' (Ab, C F C') Db'
  (Eb,, Eb'') . (C' Ab' Eb') . (Eb, Eb'')
  (Eb, Eb''') . (Db'' Eb G Db') C' (G, Db' Eb Bb') C'
  (Ab,, Ab'') . (Ab' C Eb) . (Eb Ab C)
  (Ab C F) . (Ab C Eb) . (Eb Ab C)
  (Ab,,) . (Eb''' Ab C Eb) . (C Eb Ab Ab')
  (Ab G'') . (E' G Bb Db) . (Db E G E')
  (Ab,) . (Eb'' Ab C Eb) . (C Eb Ab Ab')
  (Ab G'') . (E' G Bb Db) . (Bb Db G' E')
  Ab, . (Eb'' Ab C Eb) F' (C, Eb Ab Eb') F'
  (Eb,,, Gb''') . (Eb'' Gb Bb Gb') . (Bb Eb Gb Gb')
  (F, Gb''') . (Eb'' A' F') C' (A, Eb' F Eb') Db'
  (Bb,, Bb'') . (Bb' Db F) . (F Bb Db)
  Gb, . (Bb' Db Gb Db') Eb' (Gb,, Bb Db Db') Eb''
  (Db,,, F''') . (Ab'' Db F F') . (F Ab Db F')
  (Eb, F''') . (Bb'' C Gb' Eb') Bb' (Gb, Bb Eb Db') C''
  (F,,, A'') . (C'' F A C) . (A C F F')
  (F E'') . (Db' E G Bb) . (Bb Db E Db')
  (F,) . (C'' F A C) . (A C F F')
  (F E'') . (Db' E G Bb) . (Bb Db E Db')
  F, . (C'' Eb Gb C') Db' (Gb,, Bb Eb C') Db''
  (F,, Eb'') . (Eb' Gb Bb Eb) . (C Eb Gb Eb')
  (F,, Eb''') . (Eb'' A' F') C' (A, Eb' F Eb') Db'
  (Bb,, Bb'') . (Bb' Db F) . (F Bb Db)
  (C G'') . (Bb' C E) . (G Bb C)
  `,
};

const compiled = maraca(
  {
    calc: (x) => getPiece(x),
    isBlock: (x) => x.__type === "block",
    len: (block) =>
      block === null
        ? null
        : Array.isArray(block)
        ? block.length
        : block.items.length,
    floor: (num) => Math.floor(num),
    includes: (block, value) =>
      Array.isArray(block)
        ? block.includes(value)
        : block.items.includes(value),
    getRange: (start, end) => ({
      __type: "block",
      values: {},
      items: Array.from({ length: end - start + 1 }).map((_, i) => start + i),
    }),
    getKey: (key, offset) => {
      const k = mod(key, 1) === 0.5 ? key - 0.5 : key;
      let gaps = [mod((k + 1) * 4, 7), mod((k + 2) * 4, 7)].sort(
        (a, b) => a - b
      );
      gaps = [gaps[1] - 7, gaps[0]];
      if (offset > 0) {
        for (let i = 0; i < offset; i++) {
          gaps = [gaps[1] - 7, gaps[0]];
        }
      } else if (offset < 0) {
        for (let i = 0; i < -offset; i++) {
          gaps = [gaps[1], gaps[0] + 7];
        }
      }
      const base = [1, 2, 3, 4, 5, 6]
        .map((x) => x + gaps[0])
        .filter((x) => !gaps.includes(x));
      const res = mod(key, 1) === 0.5 ? base.map((x) => x + 0.5) : base;
      return {
        __type: "block",
        values: {},
        items: [
          ...res,
          // ...res.map((x) => x + 7),
          // ...res.filter((x) => x < gaps[1]).map((x) => x + 14),
        ],
      };
    },
    getColor: (key, note) => {
      const k = mod(key, 1) === 0.5 ? key - 0.5 : key;
      const gaps = [mod((k + 1) * 4, 7), mod((k + 2) * 4, 7)]
        .sort((a, b) => a - b)
        .map((x) => (mod(key, 1) === 0.5 ? x + 0.5 : x));
      const start = (gaps[1] - gaps[0] === 3 ? gaps[0] : gaps[1]) + 1;
      const k2 = mod(key, 1) === 0.5 ? key + 6.5 : key;
      if (mod(key + note, 1) === 0) {
        return k2 + [-2, 0, 2, -3, -1, 1, 3][mod(note - start, 7)];
      }
      return k2 + [-2, 0, 2, -3, -1, 1, 3][mod(note - start - 0.5, 7)] + 7;
    },
    sort: (x) => ({ ...x, items: [...x.items].sort((a, b) => a - b) }),
    check: (x) => {
      console.log(x);
      return x;
    },
  },
  source
);
const renderer = render(document.getElementById("app"));

effect((effect) => {
  renderer(effect, compiled);
});
