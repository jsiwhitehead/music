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
  const base = [...new Set<any>(notes)];
  Array.from({ length: 12 }).forEach((_, i) => {
    if (
      !base.includes(mod12Dist(i)) &&
      base.includes(mod12Dist(i - 2)) &&
      base.includes(mod12Dist(i + 2)) &&
      !base.includes(mod12Dist(i - 7)) &&
      !base.includes(mod12Dist(i + 7))
    ) {
      base.push(mod12Dist(i));
    }
  });
  // Array.from({ length: 12 }).forEach((_, i) => {
  //   if (
  //     !base.includes(mod12Dist(i)) &&
  //     base.includes(mod12Dist(i - 1)) &&
  //     base.includes(mod12Dist(i + 1)) &&
  //     !base.includes(mod12Dist(i + 6))
  //   ) {
  //     base.push(mod12Dist(i));
  //   }
  // });

  const ranges1 = Array.from({ length: 6 }).map((_, i) =>
    Array.from({ length: 6 })
      .map(
        (_, j) =>
          (j === 0 || !base.includes(mod12Dist((i + j) * 2 - 7))) &&
          base.includes(mod12Dist((i + j) * 2))
      )
      .findIndex((x) => !x)
  );
  const max1 = Math.max(...ranges1);

  const ranges2 = Array.from({ length: 6 }).map((_, i) =>
    Array.from({ length: 6 })
      .map(
        (_, j) =>
          (j === 0 || !base.includes(mod12Dist((i + j) * 2 - 6))) &&
          base.includes(mod12Dist((i + j) * 2 + 1))
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
    root2: base.includes(1) ? 1 : base.includes(6) ? 6 : 8,
    ext: base.filter((x) => !covered[mod12(x)]),
  };
};

s.addAttribute("ast", {
  piece: (_1, a, _2) => a.ast,

  chord: (a, b, _1, c, _2, _3, _4, d) => {
    const notes = b.ast.reduce((res, x) => [...res, ...x], [0]);
    if (!notes.includes(6) && !notes.includes(-4)) notes.push(1);
    if (!notes.includes(-3) && !notes.includes(-1)) notes.push(4);
    const base = c.ast[0] !== undefined ? mod12Dist(c.ast[0] - a.ast) : 0;
    notes.push(base);
    return {
      name: a.sourceString + b.sourceString + c.sourceString,
      key: a.ast,
      ...getChord([
        ...notes,
        ...d.ast.filter((x) => x !== null).map((x) => mod12Dist(x * 7 - a.ast)),
      ]),
      base: base,
      melody: d.ast,
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

export default (piece) => {
  const m = g.match(piece);
  if (m.failed()) {
    console.error(m.message);
    throw new Error("Parser error");
  }

  const chords = s(m).ast;

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
