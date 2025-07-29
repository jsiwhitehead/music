import colours from "./colours.json";

const mod = (n: number, m: number) => ((n % m) + m) % m;

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
  const filled =
    pattern.length <= 7
      ? pattern.map(() => true)
      : pattern.map((p, i) => {
          if (p) return p;
          return pattern[mod(i - 1, 12)] && pattern[mod(i + 1, 12)];
        });
  return { base, pattern: filled };
};

const notesToColour = (notes: number[]) => {
  if (notes.length === 0) return "black";
  const { base, pattern } = notesToFifths(notes);
  const thinned = pattern.map((p, i) => p && !pattern[mod(i + 6, 12)]);
  const present = thinned
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

  return bars.map((notes, i) => {
    if (runs[i]!.length === 0) return { blocks: [], colour: "black" };
    const res = [...runs[i]!];
    const min = Math.min(...notes);
    const max = Math.max(...notes);
    while (res[0]!.start > min) {
      res.unshift(
        ...res
          .slice(0, runs[i]!.length)
          .map((x) => ({ ...x, start: x.start - 12 }))
      );
    }
    while (res.at(-1)!.start + res.at(-1)!.size * 2 < max) {
      res.push(
        ...res
          .slice(-runs[i]!.length)
          .map((x) => ({ ...x, start: x.start + 12 }))
      );
    }
    return {
      blocks: res.filter((x) => min <= x.start + x.size * 2 && x.start <= max),
      colour: notesToColour(
        runs[i]!.flatMap(({ start, size }) =>
          Array.from({ length: size + 1 }).map((_, j) => mod(start + j * 2, 12))
        )
      ),
    };
  });
};
