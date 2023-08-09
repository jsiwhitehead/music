import * as ohm from "ohm-js";

const mod = (x, n) => ((x % n) + n) % n;
const mod12 = (x) => mod(x, 12);
const mod12Dist = (x) => mod12(x + 5) - 5;

const sum = (x) => x.reduce((a, b) => a + b, 0);

const grammar = String.raw`Chord {

  piece
    = newline* listOf<chord, newline> newline*

  chord
  	= note ext* ("/" note)? " "* ":" " "* listOf<fullnote, " "+>

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
    = note (("+" | "-")+)? -- note
    | "-" -- gap

  note
  	= "A".."G" ("b"+ | "#"+)?

  newline
    = " "* "\n" " "*

}`;

const g = ohm.grammar(grammar);
const s = g.createSemantics();

s.addAttribute("ast", {
  piece: (_1, a, _2) => a.ast,

  chord: (a, b, _1, c, _2, _3, _4, d) => {
    const notes = new Set(b.ast.reduce((res, x) => [...res, ...x], [0]));
    if (!notes.has(6) && !notes.has(-4)) notes.add(1);
    if (!notes.has(-3) && !notes.has(-1)) notes.add(4);
    const base = c.ast[0] !== undefined ? mod12Dist(c.ast[0] - a.ast) : 0;
    notes.add(base);
    const melody = d.ast;
    for (const n of melody.filter((x) => x !== null)) {
      notes.add(mod12Dist(n * 7 - a.ast));
    }
    Array.from({ length: 12 }).forEach((_, i) => {
      if (
        !notes.has(mod12Dist(i)) &&
        notes.has(mod12Dist(i - 2)) &&
        notes.has(mod12Dist(i + 2)) &&
        !notes.has(mod12Dist(i - 7)) &&
        !notes.has(mod12Dist(i + 7))
      ) {
        notes.add(mod12Dist(i));
      }
    });
    return {
      name: a.sourceString + b.sourceString + c.sourceString,
      key: a.ast,
      notes,
      base,
      melody,
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

  fullnote_note: (a, b) =>
    mod12(a.ast * 7) +
    (b.sourceString[0] === "+" ? 12 : -12) * b.sourceString.length,
  fullnote_gap: (_1) => null,

  note: (a, b) =>
    mod12(
      ["F", "C", "G", "D", "A", "E", "B"].indexOf(a.sourceString) +
        (b.sourceString[0] === "b" ? 5 : -5) * b.sourceString.length
    ),

  listOf: (a) => a.ast,
  nonemptyListOf: (a, _1, b) => [a.ast, ...b.ast],
  emptyListOf: () => [],

  _iter: (...children) => children.map((c) => c.ast),
  _terminal: () => null,
});

const getIndex = (defined1, ranges1In, max1In, ranges2In, max2In) => {
  const [ranges1, max1, ranges2, max2] = defined1
    ? [ranges1In, max1In, ranges2In, max2In]
    : [ranges2In, max2In, ranges1In, max1In];
  const index1 = ranges1.indexOf(max1);
  const dists = ranges2.map((r, i) => {
    if (r !== max2) return null;
    return Math.abs(
      mod12Dist(
        i * 2 +
          (defined1 ? 1 : 0) +
          r -
          1 -
          (index1 * 2 + (defined1 ? 0 : 1) + ranges1[index1] - 1)
      )
    );
  });
  const index2 = dists.indexOf(Math.min(...dists.filter((x) => x !== null)));
  return defined1 ? [index1, index2] : [index2, index1];
};

const getChord = (notes) => {
  const ranges1 = Array.from({ length: 6 }).map((_, i) =>
    Array.from({ length: 6 })
      .map(
        (_, j) =>
          (j === 0 || !notes.includes(mod12Dist((i + j) * 2 - 7))) &&
          notes.includes(mod12Dist((i + j) * 2))
      )
      .findIndex((x) => !x)
  );
  const max1 = Math.max(...ranges1);

  const ranges2 = Array.from({ length: 6 }).map((_, i) =>
    Array.from({ length: 6 })
      .map(
        (_, j) =>
          (j === 0 || !notes.includes(mod12Dist((i + j) * 2 - 6))) &&
          notes.includes(mod12Dist((i + j) * 2 + 1))
      )
      .findIndex((x) => !x)
  );
  const max2 = Math.max(...ranges2);

  if (max1 === -1 && max2 === 0) {
    return { chord: "alt", ext: [] };
  }

  const defined1 = max1 > 1 && ranges1.filter((x) => x === max1).length === 1;
  const defined2 = max2 > 1 && ranges2.filter((x) => x === max2).length === 1;
  if (!defined1 && !defined2) {
    return { chord: "dim", ext: [] };
  }

  const [index1, index2] = getIndex(defined1, ranges1, max1, ranges2, max2);

  const covered: any = [];
  Array.from({ length: ranges1[index1] }).forEach((_, i) => {
    covered[mod12((index1 + i) * 2)] = true;
  });
  Array.from({ length: ranges2[index2] }).forEach((_, i) => {
    covered[mod12((index2 + i) * 2 + 1)] = true;
  });

  const chord = [
    [index1 * 2, (ranges1[index1] - 1) * 2],
    [index2 * 2 + 1, (ranges2[index2] - 1) * 2],
  ];
  const mids = [chord[0][0] + chord[0][1] / 2, chord[1][0] + chord[1][1] / 2];

  return {
    chord,
    chordMid: mod12(mids[0] + mod12Dist(mids[1] - mids[0]) / 2),
    root2: notes.includes(1) ? 1 : notes.includes(6) ? 6 : 8,
    ext: notes.filter((x) => !covered[mod12(x)]),
  };
};

const checkOne = (notes, n) => {
  if (notes.has(mod12Dist(n))) return 1;
  if (
    (notes.has(mod12Dist(n - 2)) && !notes.has(mod12Dist(n - 7))) ||
    (notes.has(mod12Dist(n + 2)) && !notes.has(mod12Dist(n + 7)))
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
  const m = g.match(piece);
  if (m.failed()) {
    console.error(m.message);
    throw new Error("Parser error");
  }

  const withNotes = s(m).ast;

  withNotes.forEach((chord, i) => {
    const prev = withNotes
      .map((c) => new Set([...c.notes].map((n) => mod12Dist(n + c.key))))
      .slice(0, i)
      .reverse();
    let done = false;
    while (!done) {
      const size = [chord.notes, ...prev].reduce((res, x) => res + x.size, 0);
      Array.from({ length: 12 }).forEach((_, j) => {
        if (
          chord.notes.has(mod12Dist(j)) ||
          (chord.notes.has(mod12Dist(j - 1)) &&
            chord.notes.has(mod12Dist(j + 1)))
        ) {
          if (checkOne(chord.notes, j) >= 0) {
            if (checkMulti(prev, j + chord.key) >= 0) {
              chord.notes.add(mod12Dist(j));
            }
          }
        }
      });
      done =
        size === [chord.notes, ...prev].reduce((res, x) => res + x.size, 0);
    }
  });

  const chords = withNotes.map(({ notes, ...chord }) => ({
    ...chord,
    ...getChord([...notes]),
  }));

  const keyAngles = chords
    .filter((c) => Array.isArray(c.chord))
    .map((c) => (c.key + c.chordMid) * (Math.PI / 6));
  const averageKey =
    Math.round(
      Math.atan2(
        Math.round(sum(keyAngles.map((a) => Math.sin(a))) * 100),
        Math.round(sum(keyAngles.map((a) => Math.cos(a))) * 100)
      ) /
        (Math.PI / 6)
    ) - 3;
  const offset = mod12Dist(averageKey * 7);
  return chords.map((chord) => ({
    ...chord,
    key: mod12(chord.key - averageKey),
    melody: chord.melody.map((x) => (x === null ? x : x - offset)),
  }));
};
