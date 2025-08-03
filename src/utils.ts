import colours from "./colours.json";

const mod = (n: number, m: number) => ((n % m) + m) % m;

const modDist = (a: number, b: number, m: number) =>
  Math.min(mod(a - b, m), mod(b - a, m));

const modDistDir = (a: number, b: number, m: number) => {
  const d1 = mod(a - b, m);
  const d2 = mod(b - a, m);
  return d1 < d2 ? -d1 : d2;
};

const noteToFifth = (note: number) => mod(note * 7, 12);

const fifthToColour = (fifth: number) =>
  colours.colours_full[mod(Math.round(fifth * 2), 24)]!;

export const noteToColour = (note: number) => fifthToColour(noteToFifth(note));

const array12 = Array.from({ length: 12 }).map((_, i) => i);

const notesToFifths = (notes: number[]) => {
  const unique = new Set(notes.map((n) => noteToFifth(n)));
  const values = array12.map((i) =>
    array12
      .map((j) => (unique.has(mod(i + j, 12)) ? "1" : "0"))
      .reverse()
      .join("")
  );
  const parsed = values.map((v) => parseInt(v, 2));
  const base = parsed.indexOf(Math.min(...parsed));
  const pattern = [...parsed[base]!.toString(2)]
    .map((x) => x === "1")
    .reverse();
  let filled = pattern;
  for (let i = 0; i < 5; i++) {
    filled = filled.map((p, j) => {
      if (p) return p;
      if (filled[mod(j - 7, 12)] || filled[mod(j + 7, 12)]) {
        return false;
      }
      if (filled[mod(j - 2, 12)] && filled[mod(j + 2, 12)]) {
        return true;
      }
      if (filled[mod(j - 1, 12)] && filled[mod(j + 1, 12)]) {
        return true;
      }
      return false;
    });
  }
  return { base, pattern: filled };
};

const notesToColour = (notes: number[]) => {
  if (notes.length === 0) return "black";
  const { base, pattern } = notesToFifths(notes);
  const present = pattern
    .map((p, i) => (p ? i : null))
    .filter((x) => x !== null);
  return fifthToColour(
    mod(base + present.reduce((a, b) => a + b, 0) / present.length, 12)
  );
};

export const barsToBlocks = (bars: number[][]) => {
  const barFillsBase = bars.map((notes) => {
    const { base, pattern } = notesToFifths(notes);
    const filled = new Set(
      pattern
        .map((p, i) => (p ? i : null))
        .filter((x) => x !== null)
        .map((n) => mod((base + n) * 7, 12))
    );
    return array12.map((i) => {
      if (filled.has(mod(i + 1, 12))) return -1;
      return filled.has(i) && filled.has(mod(i + 2, 12)) ? 1 : 0;
    });
  });
  const barFills = barFillsBase.map((fills, i) => {
    return fills.map((f, j) => {
      if (f === 1) return true;
      if (f === -1) return false;
      const prev =
        barFillsBase
          .slice(0, i)
          .map((f) => f[j]!)
          .findLast((f) => f !== 0) !== -1;
      const next =
        barFillsBase
          .slice(i + 1)
          .map((f) => f[j]!)
          .find((f) => f !== 0) !== -1;
      return prev && next;
    });
  });

  const runs = barFills.map((fills) => {
    const wrapped = [...fills, ...fills];
    return array12
      .map((i) =>
        wrapped[i] && !wrapped[mod(i - 2, 12)]
          ? wrapped
              .slice(i)
              .filter((_, j) => j % 2 === 0)
              .indexOf(false)
          : 0
      )
      .map((size, start) => ({ start, size }))
      .filter((x) => x.size > 0);
  });

  const blocks = runs
    .map((r) => {
      const gapRun = r.find(
        (x) =>
          x.size === 1 &&
          r.some((y) => y.size === 1 && mod(y.start - x.start, 12) === 4)
      );
      if (!gapRun) return r;
      return [
        ...r.filter(
          (x) =>
            !(
              x.size === 1 &&
              (x.start === gapRun.start ||
                mod(x.start - gapRun.start, 12) === 4)
            )
        ),
        { start: gapRun.start, size: 3, gap: true },
      ].sort((a, b) => a.start - b.start);
    })
    .map((x) => x.map(({ size, ...y }) => ({ ...y, end: y.start + size * 2 })));

  let lastMids: null | [number, number] = null;
  const getMids = (x: { start: number; end: number }[]): [number, number] => [
    (x[0]!.end + x[1]!.start) / 2,
    (x[1]!.end + x[0]!.start + 12) / 2,
  ];
  const moved = blocks.map((x) => {
    if (!lastMids) {
      lastMids = getMids(x);
      return x;
    }
    let res = [...x];
    let resMids = getMids(x);
    for (const dir of [true, false]) {
      while (true) {
        const next = dir
          ? [
              res[1]!,
              { ...res[0]!, start: res[0]!.start + 12, end: res[0]!.end + 12 },
            ]
          : [
              { ...res[1]!, start: res[1]!.start - 12, end: res[1]!.end - 12 },
              res[0]!,
            ];
        const nextMids = getMids(next);
        if (
          Math.abs(nextMids[0] - lastMids[0]) +
            Math.abs(nextMids[1] - lastMids[1]) >
          Math.abs(resMids[0] - lastMids[0]) +
            Math.abs(resMids[1] - lastMids[1])
        ) {
          break;
        }
        res = next;
        resMids = nextMids;
      }
    }
    lastMids = resMids;
    return res;
  });

  const connected = moved.map((m, i) =>
    m.map((x, j) => {
      const prev = moved[i - 1]?.[j];
      const next = moved[i + 1]?.[j];
      return {
        ...x,
        prev: prev
          ? [(prev.start - x.start) / 2, (prev.end - x.end) / 2]
          : [0, 0],
        next: next
          ? [(next.start - x.start) / 2, (next.end - x.end) / 2]
          : [0, 0],
      };
    })
  );

  return bars.map((notes, i) => {
    if (connected[i]!.length === 0) return { blocks: [], colour: "black" };
    const res = [...connected[i]!];
    const min = Math.min(...notes);
    const max = Math.max(...notes);
    while (res[0]!.start > min) {
      res.unshift(
        ...res
          .slice(0, connected[i]!.length)
          .map((x) => ({ ...x, start: x.start - 12, end: x.end - 12 }))
      );
    }
    while (res.at(-1)!.end < max) {
      res.push(
        ...res
          .slice(-connected[i]!.length)
          .map((x) => ({ ...x, start: x.start + 12, end: x.end + 12 }))
      );
    }
    return {
      blocks: res.filter((x) => min <= x.end && x.start <= max),
      colour: notesToColour(
        connected[i]!.flatMap(({ start, end }) =>
          Array.from({ length: (end - start) / 2 + 1 }).map((_, j) =>
            mod(start + j * 2, 12)
          )
        )
      ),
    };
  });
};
