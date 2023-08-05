import parse from "./parse";

const mod = (x, n) => ((x % n) + n) % n;
const modDist = (a, b) => mod(b - a + 5, 12) - 5;
const getRange = (a, b) =>
  Array.from({ length: b - a + 1 }).map((_, i) => i + a);
const halfFloor = (x, alt) => (alt ? Math.floor(x - 0.5) + 0.5 : Math.floor(x));

const getClosest = (note, roots) => {
  const dists = roots.map((r) =>
    Math.abs(r - note - Math.round((r - note) / 7) * 7)
  );
  const close = roots[dists.indexOf(Math.min(...dists))];
  return note + Math.round((close - note) / 7) * 7;
};

export default (info) => {
  const chords = parse(info);

  let baseline = 0;
  let offset = false;
  const withGaps = chords.map((chord, i) => {
    if (i > 0) {
      const diff = modDist(chords[i - 1].key, chord.key);
      if (diff === 6) {
        offset = !offset;
      } else if (diff === -5) {
        baseline += 0.5;
        offset = !offset;
      } else if (diff === 5) {
        baseline -= 0.5;
        offset = !offset;
      } else {
        baseline += diff * 0.5;
      }
    }
    return {
      ...chord,
      alt: mod(baseline + (offset ? 0.5 : 0), 1) === 0.5,
      white: [
        halfFloor(baseline, offset) - 0.5,
        halfFloor(baseline + 3.5, offset) - 0.5,
      ],
      grey: [
        getRange(
          halfFloor(baseline + (chord.chord[1] - 6) / 2, offset),
          halfFloor(baseline + chord.chord[0] / 2, offset)
        ).map((x) => x - 0.5),
        getRange(
          halfFloor(baseline + 3.5 + (chord.chord[1] - 6) / 2, offset),
          halfFloor(baseline + 3.5 + chord.chord[0] / 2, offset)
        ).map((x) => x - 0.5),
      ],
    };
  });

  let roots;
  let range = [0, 3];
  return withGaps.map((chord, i) => {
    const getPos = (fifth) =>
      chord.white[0] +
      0.5 +
      (chord.alt
        ? [0, 4, 1, 5, 2, 6, 3, 0.5, 4.5, 1.5, 5.5, 2.5]
        : [3, 0, 4, 1, 5, 2, 6, 3.5, 0.5, 4.5, 1.5, 5.5])[fifth];
    let current = [
      getPos(chord.root),
      getPos(chord.ext.includes(10) ? 10 : mod(chord.root + 1, 7)),
    ].sort((a, b) => a - b);
    let offset = 0;
    if (i === 0) {
      roots = current;
    } else {
      let dist = roots[0] - current[0] + (roots[1] - current[1]);
      let dir = dist > 0 ? 1 : -1;
      while (true) {
        const next =
          dir === 1
            ? [current[1], current[0] + 7]
            : [current[1] - 7, current[0]];
        if (
          Math.abs(roots[0] - next[0]) + Math.abs(roots[1] - next[1]) <
          Math.abs(roots[0] - current[0]) + Math.abs(roots[1] - current[1])
        ) {
          current = next;
          offset += dir;
        } else {
          break;
        }
      }
      roots = current;
    }
    range = [offset, offset + 3];

    return {
      ...chord,
      roots,
      base: getClosest(getPos(chord.base), roots),
      ext: chord.ext.map((x) => getClosest(getPos(x), roots)),
      range,
    };
  });
};
