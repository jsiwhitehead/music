import parse from "./parse";

const mod = (x, n) => ((x % n) + n) % n;

const convert = (note) => mod(note * 7, 12);

const mid = ([start, end]: any) => (start + end) / 2;

export default (info) => {
  const { time, chords } = parse(info);

  let blocks;
  const withBlocks = chords.map((chord) => {
    if (!Array.isArray(chord.chord)) {
      if (chord.chord === "dim") {
        return {
          ...chord,
          lines: [],
        };
      }
      return {
        ...chord,
        lines: [0, 2, 4, 6, 8, 10, 12].map((x) => convert(chord.rot) + x),
      };
    }
    let current = [
      chord.chord[0] && [
        convert(chord.chord[0][0]),
        convert(chord.chord[0][0]) + chord.chord[0][1],
      ],
      chord.chord[1] && [
        convert(chord.chord[1][0]),
        convert(chord.chord[1][0]) + chord.chord[1][1],
      ],
    ].sort((a, b) => (a?.[0] ?? 0) - (b?.[0] ?? 0));
    if (!blocks) {
      blocks = current;
    } else {
      const dir =
        (blocks[0] ? mid(blocks[0]) : mid(blocks[1]) + 3) -
          (current[0] ? mid(current[0]) : mid(current[1]) + 3) +
          ((blocks[1] ? mid(blocks[1]) : mid(blocks[0]) - 3) -
            (current[1] ? mid(current[1]) : mid(current[0]) - 3)) >
        0
          ? 1
          : -1;
      while (true) {
        const next =
          dir === 1
            ? [current[1], current[0] && current[0].map((x) => x + 12)]
            : [current[1] && current[1].map((x) => x - 12), current[0]];

        const dists1 = [
          blocks[0] && next[0] ? Math.abs(mid(blocks[0]) - mid(next[0])) : 0,
          blocks[1] && next[1] ? Math.abs(mid(blocks[1]) - mid(next[1])) : 0,
        ];
        const dists2 = [
          blocks[0] && current[0]
            ? Math.abs(mid(blocks[0]) - mid(current[0]))
            : 0,
          blocks[1] && current[1]
            ? Math.abs(mid(blocks[1]) - mid(current[1]))
            : 0,
        ];
        if (
          (dists1[0] + dists1[1] - (dists2[0] + dists2[1]) ||
            mod((blocks[0] || blocks[1])[0] - (next[0] || next[1])[0], 2) -
              mod(
                (blocks[0] || blocks[1])[0] - (current[0] || current[1])[0],
                2
              ) ||
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
        ...(blocks[0]
          ? Array.from({ length: (blocks[0][1] - blocks[0][0]) / 2 - 1 }).map(
              (_, i) => blocks[0][0] + (i + 1) * 2
            )
          : []),
        ...(blocks[1]
          ? Array.from({ length: (blocks[1][1] - blocks[1][0]) / 2 - 1 }).map(
              (_, i) => blocks[1][0] + (i + 1) * 2
            )
          : []),
      ],
    };
  });

  let root;
  const withRoot = withBlocks.map((chord) => {
    if (!chord.root) return chord;
    let current = [convert(chord.root[0]), convert(chord.root[1])].sort(
      (a, b) => a - b
    );
    if (!root) {
      root = current;
    } else {
      const dir = root[0] - current[0] + (root[1] - current[1]) > 0 ? 1 : -1;
      while (true) {
        const next =
          dir === 1
            ? [current[1], current[0] + 12]
            : [current[1] - 12, current[0]];
        if (
          (Math.abs(root[0] - next[0]) +
            Math.abs(root[1] - next[1]) -
            (Math.abs(root[0] - current[0]) + Math.abs(root[1] - current[1])) ||
            mod(root[0] - next[0], 2) - mod(root[0] - current[0], 2)) < 0
        ) {
          current = next;
        } else {
          break;
        }
      }
      root = current;
    }
    return { ...chord, root };
  });

  const withNotesRange = withRoot.map((chord) => {
    const notes = chord.melody.filter((x) => x !== false).sort((a, b) => a - b);
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
    if (ranges.length === 0) return 0;
    return (
      ranges.reduce((res, r) => res + (r[0] + r[1]) / 2, 0) / ranges.length
    );
  });
  const withRange = withNotesRange.map((chord, i) => {
    if (!chord.blocks) {
      if (chord.chord === "aug") {
        const boundsBase = [
          Math.min(
            (chord.notesRange?.[0] ?? rangeMids[i]) - 2,
            rangeMids[i] - 8
          ),
          Math.max(
            (chord.notesRange?.[1] ?? rangeMids[i]) - 2,
            rangeMids[i] + 8
          ),
        ];
        const bounds =
          chord.rot === 0
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
          lines: Array.from({
            length: (bounds[1] - bounds[0]) / 2 - 1,
          }).map((_, i) => bounds[0] + (i + 1) * 2),
        };
      }
      return {
        ...chord,
        bounds: [
          Math.min(
            (chord.notesRange?.[0] ?? rangeMids[i]) - 2,
            rangeMids[i] - 9
          ),
          Math.max(
            (chord.notesRange?.[1] ?? rangeMids[i]) - 2,
            rangeMids[i] + 9
          ),
        ],
      };
    }

    const divideBlocks = [chord.blocks[0], chord.blocks[1]];
    if (!divideBlocks[0]) {
      const halfway = (chord.blocks[1][1] - 12 + chord.blocks[1][0]) / 12;
      divideBlocks[0] = [halfway, halfway];
    }
    if (!divideBlocks[1]) {
      const halfway = (chord.blocks[0][1] + chord.blocks[0][0] + 12) / 12;
      divideBlocks[1] = [halfway, halfway];
    }

    const baseDivides =
      divideBlocks[0] && divideBlocks[1]
        ? [
            mid([divideBlocks[0][0], divideBlocks[1][1] - 12]),
            mid([divideBlocks[0][1], divideBlocks[1][0]]),
          ]
        : [
            mid([
              (divideBlocks[0] || divideBlocks[1])[0],
              (divideBlocks[0] || divideBlocks[1])[1] - 12,
            ]),
            mid([
              (divideBlocks[0] || divideBlocks[1])[1],
              (divideBlocks[0] || divideBlocks[1])[0] + 12,
            ]),
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
    const extMapped = chord.ext.map((x) => convert(x)).sort((a, b) => a - b);
    while (extMapped[0] >= chord.bounds[0]) {
      extMapped.unshift(...extMapped.slice(0, len).map((x) => x - 12));
    }
    while (extMapped[extMapped.length - 1] <= chord.bounds[1]) {
      extMapped.push(...extMapped.slice(-len).map((x) => x + 12));
    }
    const ext = extMapped.filter(
      (x) => x >= chord.bounds[0] && x <= chord.bounds[1]
    );

    const len2 = chord.lines.length;
    while (chord.lines[0] >= chord.bounds[0]) {
      chord.lines.unshift(...chord.lines.slice(0, len2).map((x) => x - 12));
    }
    while (chord.lines[chord.lines.length - 1] <= chord.bounds[1]) {
      chord.lines.push(...chord.lines.slice(-len2).map((x) => x + 12));
    }

    const base = chord.base === undefined ? undefined : [convert(chord.base)];
    if (base) {
      while (base[0] >= chord.bounds[0]) {
        base.unshift(...base.slice(0, 1).map((x) => x - 12));
      }
      while (base[base.length - 1] <= chord.bounds[1]) {
        base.push(...base.slice(-1).map((x) => x + 12));
      }
    }

    let first = 0;
    const root = chord.root === undefined ? undefined : [...chord.root];
    if (root) {
      while (root[0] >= chord.bounds[0]) {
        root.unshift(...root.slice(0, 2).map((x) => x - 12));
        first -= 2;
      }
      while (root[root.length - 1] <= chord.bounds[1]) {
        root.push(...root.slice(-2).map((x) => x + 12));
      }
    }

    return {
      ...chord,
      ext,
      lines: chord.lines
        .filter((x) => x >= chord.bounds[0] && x <= chord.bounds[1])
        .filter((l) => !ext.some((e) => Math.abs(l - e) === 1)),
      base:
        base &&
        base.filter((x) => x >= chord.bounds[0] && x <= chord.bounds[1]),
      rootRange: root && [
        first + root.findIndex((d) => d >= chord.bounds[0]),
        first + root.findIndex((d) => d >= chord.bounds[1]) - 1,
      ],
    };
  });

  const result = withRepeats.map((chord, i) => {
    const thin1 = chord.blocks && chord.blocks[0]?.[0] === chord.blocks[0]?.[1];
    const thin2 = chord.blocks && chord.blocks[1]?.[0] === chord.blocks[1]?.[1];
    return {
      ...chord,
      curves: [
        [
          i === 0 ||
            mod(
              chord?.blocks?.[0]?.[0] - withRepeats[i - 1]?.blocks?.[0]?.[0],
              2
            ) === 0,
          i === withRepeats.length - 1 ||
            mod(
              chord?.blocks?.[0]?.[0] - withRepeats[i + 1]?.blocks?.[0]?.[0],
              2
            ) === 0,
        ],
        [
          i === 0 ||
            mod(
              chord?.blocks?.[1]?.[0] - withRepeats[i - 1]?.blocks?.[1]?.[0],
              2
            ) === 0,
          i === withRepeats.length - 1 ||
            mod(
              chord?.blocks?.[1]?.[0] - withRepeats[i + 1]?.blocks?.[1]?.[0],
              2
            ) === 0,
        ],
      ],
      ...(chord.blocks
        ? {
            blocks: [
              chord.blocks[0] && [
                chord.blocks[0][0] - (thin1 ? 0.25 : 0),
                chord.blocks[0][1] + (thin1 ? 0.25 : 0),
              ],
              chord.blocks[1] && [
                chord.blocks[1][0] - (thin2 ? 0.25 : 0),
                chord.blocks[1][1] + (thin2 ? 0.25 : 0),
              ],
            ],
          }
        : {}),
    };
  });

  console.log(
    JSON.stringify(
      result.map((r) => r.bounds),
      null,
      2
    )
  );

  return {
    time,
    bars: result,
    range: [
      Math.floor(Math.min(...result.map((r) => r.bounds[0]))),
      Math.ceil(Math.max(...result.map((r) => r.bounds[1]))),
    ],
  };
};
