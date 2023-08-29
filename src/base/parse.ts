import * as ohm from "ohm-js";

import { mod12, mod12Dist } from "../util";

const grammar = String.raw`Chord {

  piece
    = newline* digit ("," digit)? "*"? " "* newline+ listOf<bar, newline> newline*

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
    | "sus" ("2" | "4") -- suspended

  fullnote
    = pitchnote -- single
    | "(" listOf<pitchnote, " "+> ")" -- multi
    | "." -- gap

  pitchnote
    = note (("'" | ",")+)?

  note
  	= "A".."G" ("b"+ | "#"+)?

  newline
    = " "* "\n" " "*

}`;

const g = ohm.grammar(grammar);
const s = g.createSemantics();

s.addAttribute("ast", {
  piece: (_1, a, _2, b, c, _3, _4, d, _5) => ({
    time: parseInt(a.sourceString, 10),
    height: parseInt(b.sourceString.slice(1) || "3", 10),
    allFifths: c.sourceString === "*",
    bars: d.ast,
  }),

  bar: (a, _1, b) => {
    const notes = new Set(a.ast[0]?.notes ?? []);
    const melody = b.ast;
    for (const set of melody) {
      for (const n of set) {
        notes.add(mod12(n[0] * 7));
      }
    }
    return {
      ...(a.ast[0] || {}),
      notes,
      melody,
    };
  },

  chord: (a, b, _1, c, _2, _3) => {
    const notes = new Set(b.ast.reduce((res, x) => [...res, ...x], [0]));
    if (!notes.has(-3) && !notes.has(-1) && !notes.has(2)) {
      notes.add(4);
    }
    if (
      !notes.has(6) &&
      !notes.has(-4) &&
      (notes.has(2) || notes.has(3) || notes.has(4) || notes.has(5))
    ) {
      notes.add(1);
    }
    const base = c.ast[0] !== undefined ? mod12Dist(c.ast[0] - a.ast) : 0;
    notes.add(base);
    const key = a.ast;
    return {
      name: a.sourceString + b.sourceString + c.sourceString,
      notes: [...notes].map((n) => mod12(n + key)),
      tryFifth: !notes.has(6) && !notes.has(-4) ? mod12(key + 1) : false,
      root: [
        key,
        notes.has(1) || (!notes.has(6) && !notes.has(-4))
          ? mod12(key + 1)
          : notes.has(6)
          ? mod12(key + 6)
          : mod12(key + 8),
      ],
      // root: [
      //   notes.has(4)
      //     ? mod12(key + 4)
      //     : notes.has(-3)
      //     ? mod12(key - 3)
      //     : notes.has(-1)
      //     ? mod12(key - 1)
      //     : notes.has(2)
      //     ? mod12(key + 2)
      //     : key,
      //   notes.has(-2) ? mod12(key - 2) : notes.has(5) ? mod12(key + 5) : key,
      // ],
      base: mod12(base + key),
    };
  },

  ext_sixnine: (a) =>
    ({
      "6": [3, 4],
      "6/9": [2, 3, 4],
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
  ext_suspended: (_1, a) =>
    ({
      "2": [2],
      "4": [-1],
    }[a.sourceString]),

  fullnote_single: (a) => [a.ast],
  fullnote_multi: (_1, a, _2) => a.ast,
  fullnote_gap: (_1) => [],

  pitchnote: (a, b) => [
    mod12(a.ast * 7),
    (b.sourceString[0] === "'" ? 12 : -12) * b.sourceString.length,
  ],

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

export default (piece) => {
  const m = g.match(piece.trim());
  if (m.failed()) {
    console.error(m.message);
    throw new Error("Parser error");
  }
  return s(m).ast;
};
