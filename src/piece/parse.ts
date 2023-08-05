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
    | "maj" ("7")? -- major
    | ("m" | "-") ("6" | "7" | "9")? -- minor
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
      root: 0,
      base: base,
    };
  },

  ext_six: (_1) => [3],
  ext_seven: (_1) => [-2],
  ext_minor: (_1, a) =>
    ({
      "": [-3],
      "6": [-3, 3],
      "7": [-3, -2],
      "9": [-3, -2, 2],
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

const getStartKey = (chords) => {
  const initial = [] as any[];
  let i = 0;
  while (i < chords.length) {
    if (chords[i].chord) {
      for (let j = chords[i].chord[0]; j < chords[i].chord[1]; j++) {
        initial[mod(chords[i].key + j, 12)] = true;
      }
      const full = Array.from({ length: 12 })
        .map((_, x) => x)
        .filter((x) =>
          Array.from({ length: 6 }).every((_, y) => initial[mod(x + y, 12)])
        );
      if (full.length > 0) return full[0];
    }
    i++;
  }
  return mod(chords[0].key + chords[0].chord[0], 12);
};

export default (piece) => {
  const m = g.match(piece);
  if (m.failed()) {
    console.error(m.message);
    throw new Error("Parser error");
  }

  const chords = s(m).ast;
  let currentKey = getStartKey(chords);
  const adjustKeys = chords.map((chord) => {
    if (!chord.chord) {
      const options = [-3, 0, 3, 6].map((x) => mod(chord.key + x, 12));
      const diffs = options.map((x) => Math.abs(modDist(x, currentKey)));
      const index = diffs.indexOf(Math.min(...diffs));
      currentKey = options[index];
      const diff = chord.key - currentKey;
      return {
        name: chord.name,
        key: currentKey,
        chord: [0, 6],
        root: mod(chord.root + diff, 12),
        base: mod(chord.base + diff, 12),
        ext: chord.ext.map((x) => mod(x + diff, 12)),
      };
    }
    const min = mod(chord.key + chord.chord[0], 12);
    const max = mod(chord.key + chord.chord[1], 12);
    if (modDist(currentKey, min) < 0) currentKey = mod(min, 12);
    if (modDist(currentKey + 6, max) > 0) currentKey = mod(max - 6, 12);
    const diff = chord.key - currentKey;
    return {
      name: chord.name,
      key: currentKey,
      chord: [mod(chord.chord[0] + diff, 12), mod(chord.chord[1] + diff, 12)],
      root: mod(chord.root + diff, 12),
      base: mod(chord.base + diff, 12),
      ext: chord.ext.map((x) => mod(x + diff, 12)),
    };
  });

  const averageKey =
    Math.round(
      Math.atan2(
        Math.round(
          sum(adjustKeys.map((c) => Math.sin(c.key * (Math.PI / 6)))) * 100
        ),
        Math.round(
          sum(adjustKeys.map((c) => Math.cos(c.key * (Math.PI / 6)))) * 100
        )
      ) /
        (Math.PI / 6)
    ) + 6;
  return adjustKeys.map((chord) => ({
    ...chord,
    key: mod(chord.key - averageKey, 12),
  }));
};
