import { isDef, mod, mod12, mod12Dist, sum } from "../util";

import getBlocks from "./blocks";
import extendNotes from "./extend";
import guideNotes from "./guides";
import parse from "./parse";

const average = (notes) => {
  const filtered = notes.filter((n) => n !== undefined);
  if (filtered.length === 0) return undefined;
  const angles = filtered.map((n) => (n * Math.PI) / 6);
  return mod12(
    Math.round(
      Math.atan2(
        Math.round(sum(angles.map((a) => Math.sin(a))) * 100),
        Math.round(sum(angles.map((a) => Math.cos(a))) * 100)
      ) /
        (Math.PI / 6)
    )
  );
};

export default (piece) => {
  const { time, height, allFifths, bars } = parse(piece);

  if (allFifths) {
    bars.forEach((bar) => {
      if (bar.tryFifth !== false) bar.notes.add(bar.tryFifth);
    });
  }

  const notesList = bars.map((bar) => bar.notes);
  extendNotes(
    notesList,
    bars.map((bar) => !allFifths && bar.tryFifth)
  );

  const guidesList = guideNotes(notesList);
  extendNotes(guidesList);

  let prevMelody;
  const mappedBars = bars.map(({ notes, ...bar }, i) => {
    const { blocks: guides, cover } = getBlocks([...guidesList[i]]);
    const { blocks, ext } = getBlocks([...notesList[i]]);
    return {
      ...bar,
      guides,
      blocks,
      mid: average([...notes]),
      cover,
      ext,
      melody: bar.melody.map((set) => {
        const mappedSet = set.map((n) => {
          let res = n[0];
          while (prevMelody - res <= 6) res -= 12;
          while (prevMelody - res > 6) res += 12;
          res += n[1];
          prevMelody = res;
          return res;
        });
        if (mappedSet.length > 0) prevMelody = mappedSet[0];
        return mappedSet;
      }),
    };
  });

  const averageKey = average(mappedBars.map((b) => b.mid))! - 3;
  const offset = mod12Dist(averageKey * 7);
  return {
    time,
    height,
    bars: mappedBars.map(
      ({
        guides,
        blocks,
        mid,
        ext,
        cover,
        root,
        base,
        melody,
        tryFifth,
        ...bar
      }) => ({
        ...bar,
        guides: Array.isArray(guides)
          ? [
              guides[0] && [mod12(guides[0][0] - averageKey), guides[0][1]],
              guides[1] && [mod12(guides[1][0] - averageKey), guides[1][1]],
            ]
          : guides.type === "aug"
          ? { type: "aug", rot: mod(guides.rot - averageKey, 2) }
          : guides,
        blocks: Array.isArray(blocks)
          ? [
              blocks[0] && [mod12(blocks[0][0] - averageKey), blocks[0][1]],
              blocks[1] && [mod12(blocks[1][0] - averageKey), blocks[1][1]],
            ]
          : blocks.type === "aug"
          ? { type: "aug", rot: mod(blocks.rot - averageKey, 2) }
          : blocks,
        mid: isDef(mid) && mod12(mid - averageKey),
        ext: ext.map((n) => mod12(n - averageKey)),
        cover: cover.map((n) => mod12(n - averageKey)),
        root: isDef(root) && root.map((n) => mod12(n - averageKey)),
        base: isDef(base) && mod12(base - averageKey),
        melody: melody.map((set) => set.map((n) => n - offset)),
      })
    ),
  };
};
