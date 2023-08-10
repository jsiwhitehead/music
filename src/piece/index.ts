import parse from "./parse";

const mod = (x, n) => ((x % n) + n) % n;

const convert = (note) => mod(note * 7, 12);

const mid = ([start, end]: any) => (start + end) / 2;

const getClosest = (note, roots) => {
  const dists = roots.map((r) =>
    Math.abs(r - note - Math.round((r - note) / 12) * 12)
  );
  const close = roots[dists.indexOf(Math.min(...dists))];
  return note + Math.round((close - note) / 12) * 12;
};

export default (info, time) => {
  const chords = parse(info);

  let blocks;
  const withBlocks = chords.map((chord) => {
    if (!Array.isArray(chord.chord)) {
      if (chord.chord === "dim") {
        return {
          ...chord,
          ext: [0, 3, 6, 9],
          lines: [],
        };
      }
      return {
        ...chord,
        lines: [0, 2, 4, 6, 8, 10, 12].map((x) => convert(chord.key) + x),
      };
    }
    let current = [
      [
        convert(chord.key + chord.chord[0][0]),
        convert(chord.key + chord.chord[0][0]) + chord.chord[0][1],
      ],
      [
        convert(chord.key + chord.chord[1][0]),
        convert(chord.key + chord.chord[1][0]) + chord.chord[1][1],
      ],
    ].sort((a, b) => a[0] - b[0]);
    if (!blocks) {
      blocks = current;
    } else {
      const dir =
        mid(blocks[0]) - mid(current[0]) + (mid(blocks[1]) - mid(current[1])) >
        0
          ? 1
          : -1;
      while (true) {
        const next =
          dir === 1
            ? [current[1], current[0].map((x) => x + 12)]
            : [current[1].map((x) => x - 12), current[0]];

        const dists1 = [
          Math.abs(mid(blocks[0]) - mid(next[0])),
          Math.abs(mid(blocks[1]) - mid(next[1])),
        ];
        const dists2 = [
          Math.abs(mid(blocks[0]) - mid(current[0])),
          Math.abs(mid(blocks[1]) - mid(current[1])),
        ];
        if (
          (dists1[0] + dists1[1] - (dists2[0] + dists2[1]) ||
            mod(blocks[0][0] - next[0][0], 2) -
              mod(blocks[0][0] - current[0][0], 2) ||
            Math.abs(dists1[0] - dists1[1]) - Math.abs(dists2[0] - dists2[1])) <
          0
        ) {
          current = next;
        } else {
          break;
        }
      }
      blocks = current;
    }
    return {
      ...chord,
      blocks,
      lines: [
        ...Array.from({ length: (blocks[0][1] - blocks[0][0]) / 2 - 1 }).map(
          (_, i) => blocks[0][0] + (i + 1) * 2
        ),
        ...Array.from({ length: (blocks[1][1] - blocks[1][0]) / 2 - 1 }).map(
          (_, i) => blocks[1][0] + (i + 1) * 2
        ),
      ],
    };
  });

  let roots;
  const withNotes = withBlocks.map((chord) => {
    let current = [
      convert(chord.key),
      convert(
        chord.key +
          (chord.chord === "aug" ? -4 : chord.chord === "dim" ? 6 : chord.root2)
      ),
    ].sort((a, b) => a - b);
    if (!roots) {
      roots = current;
    } else {
      const dir = roots[0] - current[0] + (roots[1] - current[1]) > 0 ? 1 : -1;
      while (true) {
        const next =
          dir === 1
            ? [current[1], current[0] + 12]
            : [current[1] - 12, current[0]];
        if (
          (Math.abs(roots[0] - next[0]) +
            Math.abs(roots[1] - next[1]) -
            (Math.abs(roots[0] - current[0]) +
              Math.abs(roots[1] - current[1])) ||
            mod(roots[0] - next[0], 2) - mod(roots[0] - current[0], 2)) < 0
        ) {
          current = next;
        } else {
          break;
        }
      }
      roots = current;
    }
    return {
      ...chord,
      roots,
      base: getClosest(convert(chord.key + chord.base), roots),
      ext: chord.ext
        .map((x) => getClosest(convert(chord.key + x), roots))
        .sort((a, b) => a - b),
    };
  });

  const withNotesRange = withNotes.map((chord) => {
    const notes = chord.melody.filter((x) => x !== null).sort((a, b) => a - b);
    if (notes.length === 0) return chord;
    return {
      ...chord,
      notesRange: [notes[0], notes[notes.length - 1]],
    };
  });

  const rangeMids = withNotesRange.map((_, i) => {
    const ranges = withNotesRange
      .slice(Math.max(0, i - 3), i + 4)
      .map((chord) => chord.notesRange)
      .filter((r) => r);
    return (
      ranges.reduce((res, r) => res + (r[0] + r[1]) / 2, 0) / ranges.length
    );
  });
  const withRange = withNotesRange.map((chord, i) => {
    if (!chord.blocks) {
      const boundsBase =
        chord.chord === "aug"
          ? [
              Math.min(chord.notesRange?.[0] ?? rangeMids[i], rangeMids[i] - 8),
              Math.max(chord.notesRange?.[1] ?? rangeMids[i], rangeMids[i] + 8),
            ]
          : [
              Math.min(chord.notesRange?.[0] ?? rangeMids[i], rangeMids[i] - 9),
              Math.max(chord.notesRange?.[1] ?? rangeMids[i], rangeMids[i] + 9),
            ];
      const bounds =
        mod(chord.key, 2) === 0
          ? [
              Math.round(boundsBase[0] / 2) * 2,
              Math.round(boundsBase[1] / 2) * 2,
            ]
          : [
              Math.round((boundsBase[0] - 1) / 2) * 2 + 1,
              Math.round((boundsBase[1] - 1) / 2) * 2 + 1,
            ];
      return {
        ...chord,
        bounds,
        ...(chord.chord === "aug"
          ? {
              lines: Array.from({
                length: (bounds[1] - bounds[0]) / 2 - 1,
              }).map((_, i) => bounds[0] + (i + 1) * 2),
            }
          : {}),
      };
    }

    const baseDivides = [
      mid([chord.blocks[0][0], chord.blocks[1][1] - 12]),
      mid([chord.blocks[0][1], chord.blocks[1][0]]),
    ];
    const divides = [...baseDivides];

    const min = chord.notesRange?.[0] ?? rangeMids[i];
    const max = chord.notesRange?.[1] ?? rangeMids[i];

    let first = 0;
    while (divides[0] > min) {
      divides.unshift(divides[0] - 12, divides[1] - 12);
      first -= 2;
    }
    while (divides[divides.length - 1] < max) {
      divides.push(
        divides[divides.length - 2] + 12,
        divides[divides.length - 1] + 12
      );
    }
    const range = [
      first + divides.findIndex((d) => d > min) - 1,
      first + divides.findIndex((d) => d > max) - 1,
    ];

    const getBound = (index) =>
      (mod(index, 2) === 0 ? baseDivides[0] : baseDivides[1]) +
      Math.floor(index / 2) * 12;
    while (range[1] - range[0] < 2) {
      if ((getBound(range[0]) + getBound(range[1] + 1)) / 2 >= rangeMids[i]) {
        range[0] = range[0] - 1;
      } else {
        range[1] = range[1] + 1;
      }
    }
    return {
      ...chord,
      range,
      bounds: [getBound(range[0]), getBound(range[1] + 1)],
    };
  });

  const withRepeats = withRange.map((chord) => {
    const len = chord.ext.length;
    while (chord.ext[0] >= chord.bounds[0]) {
      chord.ext.unshift(...chord.ext.slice(0, len).map((x) => x - 12));
    }
    while (chord.ext[chord.ext.length - 1] <= chord.bounds[1]) {
      chord.ext.push(...chord.ext.slice(-len).map((x) => x + 12));
    }
    const ext = chord.ext.filter(
      (x) => x > chord.bounds[0] && x < chord.bounds[1]
    );

    const len2 = chord.lines.length;
    while (chord.lines[0] >= chord.bounds[0]) {
      chord.lines.unshift(...chord.lines.slice(0, len2).map((x) => x - 12));
    }
    while (chord.lines[chord.lines.length - 1] <= chord.bounds[1]) {
      chord.lines.push(...chord.lines.slice(-len2).map((x) => x + 12));
    }

    const base = [chord.base];
    while (base[0] >= chord.bounds[0]) {
      base.unshift(...base.slice(0, 1).map((x) => x - 12));
    }
    while (base[base.length - 1] <= chord.bounds[1]) {
      base.push(...base.slice(-1).map((x) => x + 12));
    }

    let first = 0;
    const roots = [...chord.roots];
    while (roots[0] >= chord.bounds[0]) {
      roots.unshift(...roots.slice(0, 2).map((x) => x - 12));
      first -= 2;
    }
    while (roots[roots.length - 1] <= chord.bounds[1]) {
      roots.push(...roots.slice(-2).map((x) => x + 12));
    }

    return {
      ...chord,
      ext,
      lines: chord.lines
        .filter((x) => x > chord.bounds[0] && x < chord.bounds[1])
        .filter((l) => !ext.some((e) => Math.abs(l - e) === 1)),
      base: base.filter((x) => x > chord.bounds[0] && x < chord.bounds[1]),
      rootsRange: [
        first + roots.findIndex((d) => d > chord.bounds[0]),
        first + roots.findIndex((d) => d > chord.bounds[1]) - 1,
      ],
    };
  });

  const result = withRepeats.map((chord, i) => {
    const thin1 = chord.blocks && chord.blocks[0][0] === chord.blocks[0][1];
    const thin2 = chord.blocks && chord.blocks[1][0] === chord.blocks[1][1];
    return {
      ...chord,
      curves: [
        i === 0 ||
          mod(chord?.blocks?.[0][0] - withRepeats[i - 1]?.blocks?.[0][0], 2) ===
            0,
        i === withRepeats.length - 1 ||
          mod(chord?.blocks?.[0][0] - withRepeats[i + 1]?.blocks?.[0][0], 2) ===
            0,
      ],
      ...(chord.blocks
        ? {
            blocks: [
              [
                chord.blocks[0][0] - (thin1 ? 0.25 : 0),
                chord.blocks[0][1] + (thin1 ? 0.25 : 0),
              ],
              [
                chord.blocks[1][0] - (thin2 ? 0.25 : 0),
                chord.blocks[1][1] + (thin2 ? 0.25 : 0),
              ],
            ],
          }
        : {}),
    };
  });

  return result.map((chord) => ({ ...chord, time }));
};
