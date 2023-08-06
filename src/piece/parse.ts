import * as ohm from "ohm-js";

const mod = (x, n) => ((x % n) + n) % n;
const modDist = (a, b) => mod(b - a + 5, 12) - 5;

const sum = (x) => x.reduce((a, b) => a + b, 0);

const grammar = String.raw`Chord {

  piece
    = space* listOf<chord, space+> space*

  chord
  	= note ext* ("/" note)?

  ext
  	= "6" -- six
    | "7" -- seven
    | "13" -- thirteen
    | "maj" ("7")? -- major
    | ("m" | "-") ("6" | "7" | "9" | "11")? -- minor
    | "b" ("5" | "9") -- flat
    | "#" ("9" | "11") -- sharp
    | "+" -- augmented
    | "dim7" -- diminished
    | "sus4" -- suspended

  note
  	= "A".."G" ("b"+ | "#"+)?

}`;

const g = ohm.grammar(grammar);
const s = g.createSemantics();

const getChord = (notes) => {
  const sorted = [...new Set<any>(notes)].sort((a, b) => a - b);
  if (JSON.stringify(sorted) === JSON.stringify([-3, 0, 3, 6])) {
    // diminished 7
    return { chord: null, ext: [] };
  }
  if (JSON.stringify(sorted) === JSON.stringify([-3, -2, 0, 6])) {
    // half diminished
    return { chord: [-6, 0], ext: [] };
  }
  const [first, last] = [sorted[0], sorted[sorted.length - 1]];
  if (last - first <= 6) return { chord: [first, last], ext: [] };
  if (sorted.includes(-2) && sorted.includes(4)) {
    // 7 chord
    return { chord: [-2, 4], ext: sorted.filter((x) => x < -2 || x > 4) };
  }
  throw new Error();
};

s.addAttribute("ast", {
  piece: (_1, a, _2) => a.ast,

  chord: (a, b, _1, c) => {
    const notes = b.ast.reduce((res, x) => [...res, ...x], [0]);
    if (!notes.includes(6) && !notes.includes(-4)) notes.push(1);
    if (!notes.includes(-3) && !notes.includes(-1)) notes.push(4);
    const base = c.ast[0] !== undefined ? modDist(a.ast, c.ast[0]) : 0;
    notes.push(base);
    return {
      name: a.sourceString + b.sourceString + c.sourceString,
      key: a.ast,
      ...getChord(notes),
      base: base,
    };
  },

  ext_six: (_1) => [3],
  ext_seven: (_1) => [-2],
  ext_thirteen: (_1) => [-2, 3],
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
      "7": [4, 5],
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

  note: (a, b) =>
    mod(
      ["F", "C", "G", "D", "A", "E", "B"].indexOf(a.sourceString) +
        (b.sourceString[0] === "b" ? 5 : -5) * b.sourceString.length,
      12
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

  let mid;
  const withDiminished = chords.map((chord) => {
    if (chord.chord) {
      mid = chord.key + (chord.chord[0] + chord.chord[1]) / 2;
      return chord;
    }
    const options = [0, 3, 6, 9].map((x) => mod(chord.key + x + 3, 12));
    const diffs = options.map((x) => Math.abs(modDist(x, mid ?? x)));
    const index = diffs.indexOf(Math.min(...diffs));
    return {
      name: chord.name,
      key: chord.key,
      chord: [
        [0, 6],
        [3, 9],
        [-6, 0],
        [-3, 3],
      ][index],
      base: 0,
      ext: [],
    };
  });

  const keyAngles = withDiminished.map(
    (c) => (c.key + (c.chord[0] + c.chord[1]) / 2) * (Math.PI / 6)
  );
  const averageKey =
    Math.round(
      Math.atan2(
        Math.round(sum(keyAngles.map((a) => Math.sin(a))) * 100),
        Math.round(sum(keyAngles.map((a) => Math.cos(a))) * 100)
      ) /
        (Math.PI / 6)
    ) + 3;
  return withDiminished.map((chord) => ({
    ...chord,
    key: mod(chord.key - averageKey, 12),
  }));
};
