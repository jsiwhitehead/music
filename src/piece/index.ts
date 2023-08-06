import parse from "./parse";

const mod = (x, n) => ((x % n) + n) % n;
const getRange = (start, end) =>
  Array.from({ length: end - start + 1 }).map((_, i) => i + start);

const convert = (note) => mod(note * 7, 12);

const getEnds = (start, length) => [start, start + length];
const mid = ([start, end]: any) => (start + end) / 2;

const getClosest = (note, roots) => {
  const dists = roots.map((r) =>
    Math.abs(r - note - Math.round((r - note) / 12) * 12)
  );
  const close = roots[dists.indexOf(Math.min(...dists))];
  return note + Math.round((close - note) / 12) * 12;
};

export default (info) => {
  const chords = parse(info);

  let gaps;
  const withGaps = chords.map((chord) => {
    let current = [
      getEnds(
        convert(chord.key + chord.chord[1] - 1) + 0.5,
        Math.floor((7 - (chord.chord[1] - chord.chord[0])) / 2) * 2
      ),
      getEnds(
        convert(chord.key + chord.chord[1]) + 0.5,
        Math.floor((6 - (chord.chord[1] - chord.chord[0])) / 2) * 2
      ),
    ].sort((a, b) => a[0] - b[0]);
    if (!gaps) {
      gaps = current;
    } else {
      const dir =
        mid(gaps[0]) - mid(current[0]) + (mid(gaps[1]) - mid(current[1])) > 0
          ? 1
          : -1;
      while (true) {
        const next =
          dir === 1
            ? [current[1], current[0].map((x) => x + 12)]
            : [current[1].map((x) => x - 12), current[0]];

        const dists1 = [
          Math.abs(mid(gaps[0]) - mid(next[0])),
          Math.abs(mid(gaps[1]) - mid(next[1])),
        ];
        const dists2 = [
          Math.abs(mid(gaps[0]) - mid(current[0])),
          Math.abs(mid(gaps[1]) - mid(current[1])),
        ];
        if (
          (dists1[0] + dists1[1] - (dists2[0] + dists2[1]) ||
            mod(gaps[0][0] - next[0][0], 2) -
              mod(gaps[0][0] - current[0][0], 2) ||
            Math.abs(dists1[0] - dists1[1]) - Math.abs(dists2[0] - dists2[1])) <
          0
        ) {
          current = next;
        } else {
          break;
        }
      }
      gaps = current;
    }
    return {
      ...chord,
      gaps,
      lines: getRange(chord.chord[0] + 2, chord.chord[1] - 2).map((x) =>
        convert(chord.key + x)
      ),
    };
  });

  let roots;
  const withNotes = withGaps.map((chord) => {
    let current = [
      convert(chord.key),
      convert(
        chord.key +
          (chord.ext.includes(-4)
            ? -4
            : chord.chord[0] >= 1 || chord.chord[1] <= 0
            ? 6
            : 1)
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

  const withRange = withNotes.map((chord, i) => {
    const notes = [
      ...chord.roots,
      chord.base,
      ...chord.ext,
      ...(withNotes[i - 1]?.ext || []),
      ...(withNotes[i + 1]?.ext || []),
    ].sort((a, b) => a - b);
    const min = notes[0];
    const max = notes[notes.length - 1];

    const divides = [mid(chord.gaps[0]), mid(chord.gaps[1])];
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

    return {
      ...chord,
      range: [
        first + divides.findIndex((d) => d > min) - 1,
        first + divides.findIndex((d) => d > max),
      ],
    };
  });
  const withExtraRange = withRange.map((chord, i) => ({
    ...chord,
    range: [
      Math.min(
        withRange[i - 1]?.range[0] || chord.range[0],
        chord.range[0],
        withRange[i + 1]?.range[0] || chord.range[0]
      ),
      Math.max(
        withRange[i - 1]?.range[1] || chord.range[1],
        chord.range[1],
        withRange[i + 1]?.range[1] || chord.range[1]
      ),
    ],
  }));

  return withExtraRange.map((chord) => {
    const bottom =
      (mod(chord.range[0], 2) === 0 ? mid(chord.gaps[0]) : mid(chord.gaps[1])) +
      Math.floor(chord.range[0] / 2) * 12;
    const top =
      (mod(chord.range[1], 2) === 0 ? mid(chord.gaps[0]) : mid(chord.gaps[1])) +
      Math.floor(chord.range[1] / 2) * 12;

    const len = chord.ext.length;
    while (chord.ext[0] > bottom) {
      chord.ext.unshift(...chord.ext.slice(0, len).map((x) => x - 12));
    }
    while (chord.ext[chord.ext.length - 1] < top) {
      chord.ext.push(...chord.ext.slice(-len).map((x) => x + 12));
    }
    const ext = chord.ext.filter((x) => x > bottom && x < top);

    const len2 = chord.lines.length;
    while (chord.lines[0] > bottom) {
      chord.lines.unshift(...chord.lines.slice(0, len2).map((x) => x - 12));
    }
    while (chord.lines[chord.lines.length - 1] < top) {
      chord.lines.push(...chord.lines.slice(-len2).map((x) => x + 12));
    }

    return {
      ...chord,
      ext,
      lines: chord.lines
        .filter((x) => x > bottom && x < top)
        .filter((l) => !ext.some((e) => Math.abs(l - e) === 1)),
    };
  });
};
