import { convert, mid, mod } from "../util";

const getClosest = (target, initial) => {
  let current = initial;
  const dir =
    (target[0] ? mid(target[0]) : mid(target[1]) + 3) -
      (current[0] ? mid(current[0]) : mid(current[1]) + 3) +
      ((target[1] ? mid(target[1]) : mid(target[0]) - 3) -
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
      target[0] && next[0] ? Math.abs(mid(target[0]) - mid(next[0])) : 0,
      target[1] && next[1] ? Math.abs(mid(target[1]) - mid(next[1])) : 0,
    ];
    const dists2 = [
      target[0] && current[0] ? Math.abs(mid(target[0]) - mid(current[0])) : 0,
      target[1] && current[1] ? Math.abs(mid(target[1]) - mid(current[1])) : 0,
    ];
    if (
      (dists1[0] + dists1[1] - (dists2[0] + dists2[1]) ||
        mod((target[0] || target[1])[0] - (next[0] || next[1])[0], 2) -
          mod((target[0] || target[1])[0] - (current[0] || current[1])[0], 2) ||
        Math.abs(dists1[0] - dists1[1]) - Math.abs(dists2[0] - dists2[1])) < 0
    ) {
      current = next;
    } else {
      break;
    }
  }
  return current;
};

export default (guidesList, blocksList) => {
  let current;
  const mappedGuides = guidesList.map((b) => {
    if (!Array.isArray(b)) return b;
    const initial = [
      b[0] && [convert(b[0][0]), convert(b[0][0]) + b[0][1]],
      b[1] && [convert(b[1][0]), convert(b[1][0]) + b[1][1]],
    ].sort((a, b) => (a?.[0] ?? 0) - (b?.[0] ?? 0));
    return (current = current ? getClosest(current, initial) : initial);
  });

  let guides = mappedGuides.find((g) => Array.isArray(g));
  const allGuides = mappedGuides.map((g) => {
    if (!Array.isArray(g)) return guides;
    return (guides = g);
  });

  return {
    guides: mappedGuides,
    blocks: blocksList.map((b, i) => {
      if (!Array.isArray(b)) return b;
      return getClosest(
        allGuides[i],
        [
          b[0] && [convert(b[0][0]), convert(b[0][0]) + b[0][1]],
          b[1] && [convert(b[1][0]), convert(b[1][0]) + b[1][1]],
        ].sort((a, b) => (a?.[0] ?? 0) - (b?.[0] ?? 0))
      );
    }),
  };
};
