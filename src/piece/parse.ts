import * as ohm from "ohm-js";

const mod = (x, n) => ((x % n) + n) % n;
const mod12 = (x) => mod(x, 12);
const mod12Dist = (x) => mod12(x + 5) - 5;

const sum = (x) => x.reduce((a, b) => a + b, 0);

const isDef = (x) => (x === undefined ? undefined : true);

const grammar = String.raw`Chord {

  piece
    = newline* digit newline+ listOf<bar, newline> newline*

  bar
  	= chord? " "* listOf<fullnote, " "+>

  chord
  	= note ext* ("/" note)? " "* ":"

  ext
  	= ("6" | "6/9") -- sixnine
    | ("7" | "13") -- dominant
    | ("maj" | "M") ("7")? -- major
    | ("m" | "-") ("6" | "7" | "9" | "11")? -- minor
    | "b" ("5" | "9") -- flat
    | "#" ("9" | "11") -- sharp
    | "+" -- augmented
    | "dim7" -- diminished
    | "sus4" -- suspended

  fullnote
    = note (("'" | ",")+)? -- note
    | "." -- gap

  note
  	= "A".."G" ("b"+ | "#"+)?

  newline
    = " "* "\n" " "*

}`;

const g = ohm.grammar(grammar);
const s = g.createSemantics();

s.addAttribute("ast", {
  piece: (_1, a, _2, b, _3) => ({
    time: parseInt(a.sourceString, 10),
    bars: b.ast,
  }),

  bar: (a, _1, b) => {
    const notes = new Set(a.ast[0]?.notes ?? []);
    const melody = b.ast;
    for (const n of melody.filter((x) => x !== false)) {
      notes.add(mod12(n[0] * 7));
    }
    return {
      ...(a.ast[0] || {}),
      notes,
      melody,
    };
  },

  chord: (a, b, _1, c, _2, _3) => {
    const notes = new Set(b.ast.reduce((res, x) => [...res, ...x], [0]));
    if (!notes.has(6) && !notes.has(-4)) notes.add(1);
    if (!notes.has(-3) && !notes.has(-1)) notes.add(4);
    const base = c.ast[0] !== undefined ? mod12Dist(c.ast[0] - a.ast) : 0;
    notes.add(base);
    const key = a.ast;
    const keyNotes = [...notes].map((n) => mod12(n + key));
    return {
      notes: keyNotes,
      name: a.sourceString + b.sourceString + c.sourceString,
      root: [
        key,
        keyNotes.includes(mod12(key + 1))
          ? mod12(key + 1)
          : keyNotes.includes(mod12(key + 6))
          ? mod12(key + 6)
          : mod12(key + 8),
      ],
      base: mod12(base + key),
    };
  },

  ext_sixnine: (a) =>
    ({
      "6": [3],
      "6/9": [2, 3],
    }[a.sourceString]),
  ext_dominant: (a) =>
    ({
      "7": [-2],
      "13": [-2, 3],
    }[a.sourceString]),
  ext_minor: (_1, a) =>
    ({
      "": [-3],
      "6": [-3, 3],
      "7": [-3, -2],
      "9": [-3, -2, 2],
      "11": [-3, -2, -1],
    }[a.sourceString]),
  ext_major: (_1, a) =>
    ({
      "": [4],
      "7": [5],
    }[a.sourceString]),
  ext_flat: (_1, a) =>
    ({
      "5": [6],
      "9": [-5],
    }[a.sourceString]),
  ext_sharp: (_1, a) =>
    ({
      "9": [-3, 4],
      "11": [1, 6],
    }[a.sourceString]),
  ext_augmented: (_1) => [-4, 4],
  ext_diminished: (_1) => [-3, 3, 6],
  ext_suspended: (_1) => [-1],

  fullnote_note: (a, b) => [
    mod12(a.ast * 7),
    (b.sourceString[0] === "'" ? 12 : -12) * b.sourceString.length,
  ],
  fullnote_gap: (_1) => false,

  note: (a, b) =>
    mod12(
      ["F", "C", "G", "D", "A", "E", "B"].indexOf(a.sourceString) +
        (b.sourceString[0] === "b" ? 5 : -5) * b.sourceString.length -
        4
    ),

  listOf: (a) => a.ast,
  nonemptyListOf: (a, _1, b) => [a.ast, ...b.ast],
  emptyListOf: () => [],

  _iter: (...children) => children.map((c) => c.ast),
  _terminal: () => null,
});

const getChord = (notes) => {
  const ranges1 = Array.from({ length: 6 }).map((_, i) =>
    Array.from({ length: 6 })
      .map(
        (_, j) =>
          (j === 0 || !notes.includes(mod12((i + j) * 2 - 7))) &&
          notes.includes(mod12((i + j) * 2))
      )
      .findIndex((x) => !x)
  );
  const max1 = Math.max(...ranges1);

  const ranges2 = Array.from({ length: 6 }).map((_, i) =>
    Array.from({ length: 6 })
      .map(
        (_, j) =>
          (j === 0 || !notes.includes(mod12((i + j) * 2 - 6))) &&
          notes.includes(mod12((i + j) * 2 + 1))
      )
      .findIndex((x) => !x)
  );
  const max2 = Math.max(...ranges2);

  if (max1 === -1 && max2 === 0) {
    return { chord: "aug", rot: 0, ext: [] };
  }
  if (max2 === -1 && max1 === 0) {
    return { chord: "aug", rot: 1, ext: [] };
  }

  const defined1 = ranges1.filter((x) => x === max1).length === 1;
  const defined2 = ranges2.filter((x) => x === max2).length === 1;
  if (!defined1 && !defined2) {
    return { chord: "dim", ext: [...notes] };
  }

  const index1 = defined1 ? ranges1.indexOf(max1) : false;
  const index2 = defined2 ? ranges2.indexOf(max2) : false;

  const covered: any = [];
  if (index1 !== false) {
    Array.from({ length: ranges1[index1] }).forEach((_, i) => {
      covered[mod12((index1 + i) * 2)] = true;
    });
  }
  if (index2 !== false) {
    Array.from({ length: ranges2[index2] }).forEach((_, i) => {
      covered[mod12((index2 + i) * 2 + 1)] = true;
    });
  }

  const chord = [
    index1 === false ? false : [index1 * 2, (ranges1[index1] - 1) * 2],
    index2 === false ? false : [index2 * 2 + 1, (ranges2[index2] - 1) * 2],
  ];
  const mids = [
    chord[0] && chord[0][0] + chord[0][1] / 2,
    chord[1] && chord[1][0] + chord[1][1] / 2,
  ];

  return {
    chord,
    chordMid:
      mids[0] && mids[1]
        ? mod12(mids[0] + mod12Dist(mids[1] - mids[0]) / 2)
        : mids[0] || mids[1],
    ext: notes.filter((x) => !covered[x]),
  };
};

const checkOne = (notes, n) => {
  if (notes.has(mod12(n))) return 1;
  if (
    (notes.has(mod12(n - 2)) && !notes.has(mod12(n - 7))) ||
    (notes.has(mod12(n + 2)) && !notes.has(mod12(n + 7)))
  ) {
    return 0;
  }
  if (
    [...notes].every((x) => mod(x, 2) !== mod(n, 2)) &&
    (notes.has(mod12(n - 7)) ? 1 : 0) + (notes.has(mod12(n + 7)) ? 1 : 0) < 2
  ) {
    return 0;
  }
  return -1;
};
const checkMulti = (notesList, n) => {
  for (const [i, notes] of notesList.entries()) {
    const c = checkOne(notes, n);
    if (c === 1) notesList.slice(0, i).forEach((x) => x.add(n));
    if (c !== 0) return c;
  }
  notesList.forEach((x) => x.add(n));
  return 0;
};

export default (piece) => {
  const m = g.match(piece.trim());
  if (m.failed()) {
    console.error(m.message);
    throw new Error("Parser error");
  }

  const { time, bars } = s(m).ast;

  bars.forEach((chord, i) => {
    const prev = bars
      .map((c) => new Set(c.notes))
      .slice(0, i)
      .reverse();
    let done = false;
    while (!done) {
      const size = [chord.notes, ...prev].reduce((res, x) => res + x.size, 0);
      Array.from({ length: 12 }).forEach((_, j) => {
        if (
          chord.notes.has(mod12(j)) ||
          (chord.notes.has(mod12(j - 2)) &&
            chord.notes.has(mod12(j + 2)) &&
            !chord.notes.has(mod12(j - 7)) &&
            !chord.notes.has(mod12(j + 7)))
        ) {
          if (checkOne(chord.notes, j) >= 0) {
            if (checkMulti(prev, j) >= 0) {
              chord.notes.add(mod12(j));
            }
          }
        }
      });
      done =
        size === [chord.notes, ...prev].reduce((res, x) => res + x.size, 0);
    }
  });

  bars.forEach((chord, i) => {
    const prev = bars
      .map((c) => new Set(c.notes))
      .slice(0, i)
      .reverse();
    let done = false;
    while (!done) {
      const size = [chord.notes, ...prev].reduce((res, x) => res + x.size, 0);
      Array.from({ length: 12 }).forEach((_, j) => {
        if (
          chord.notes.has(mod12(j)) ||
          (chord.notes.has(mod12(j - 1)) && chord.notes.has(mod12(j + 1)))
        ) {
          if (checkOne(chord.notes, j) >= 0) {
            if (checkMulti(prev, j) >= 0) {
              chord.notes.add(mod12(j));
            }
          }
        }
      });
      done =
        size === [chord.notes, ...prev].reduce((res, x) => res + x.size, 0);
    }
  });

  let prevMelody;
  const chords = bars.map(({ notes, ...chord }) => ({
    ...chord,
    ...getChord([...notes]),
    melody: chord.melody.map((n) => {
      if (n === false) return false;
      let res = n[0];
      while (prevMelody - res <= 6) res -= 12;
      while (prevMelody - res > 6) res += 12;
      res += n[1];
      prevMelody = res;
      return res;
    }),
  }));

  const keyAngles = chords
    .filter((c) => Array.isArray(c.chord))
    .map((c) => c.chordMid * (Math.PI / 6));
  const averageKey =
    Math.round(
      Math.atan2(
        Math.round(sum(keyAngles.map((a) => Math.sin(a))) * 100),
        Math.round(sum(keyAngles.map((a) => Math.cos(a))) * 100)
      ) /
        (Math.PI / 6)
    ) - 3;
  const offset = mod12Dist(averageKey * 7);
  return {
    time,
    chords: chords.map((chord) => ({
      ...chord,
      root: isDef(chord.root) && chord.root.map((n) => mod12(n - averageKey)),
      base: isDef(chord.base) && mod12(chord.base - averageKey),
      melody: chord.melody.map((n) => (n === false ? n : n - offset)),
      chord: Array.isArray(chord.chord)
        ? [
            chord.chord[0] && [
              mod12(chord.chord[0][0] - averageKey),
              chord.chord[0][1],
            ],
            chord.chord[1] && [
              mod12(chord.chord[1][0] - averageKey),
              chord.chord[1][1],
            ],
          ]
        : chord.chord,
      chordMid: isDef(chord.chordMid) && mod12(chord.chordMid - averageKey),
      ext: chord.ext.map((n) => mod12(n - averageKey)),
    })),
  };
};
