import { convert } from "../util";

import getBlocks from "./blocks";
import getRoots from "./roots";
import getRanges from "./ranges";
import getCurves from "./curves";
import getMoves from "./moves";
import getNotes from "./notes";
import getThin from "./thin";

export default (bars, height) => {
  const { guides, blocks } = getBlocks(
    bars.map((bar) => bar.guides),
    bars.map((bar) => bar.blocks)
  );
  const roots = getRoots(bars.map((bar) => bar.root));
  const ranges = getRanges(
    bars.map((bar) => bar.melody),
    blocks,
    height
  );
  const guidesCurves = getCurves(guides);
  const blocksCurves = getCurves(blocks);

  const moves = getMoves(
    bars.map((bar) => bar.chordNotes),
    bars.map((bar) => bar.moves),
    bars.map((bar) => bar.root[0]),
    ranges.map((r) => r.bounds)
  );

  return bars.map((bar, i) => {
    const root = roots[i] && getNotes([...roots[i]], ranges[i].bounds);
    return {
      ...bar,
      guides: Array.isArray(guides[i]) ? getThin(guides[i]) : guides[i],
      guidesCurves: guidesCurves[i],
      blocks: Array.isArray(blocks[i]) ? getThin(blocks[i]) : blocks[i],
      blocksCurves: blocksCurves[i],
      ...ranges[i],
      ext: getNotes(
        bar.ext.map((n) => convert(n)).sort((a, b) => a - b),
        ranges[i].bounds
      ).notes,
      cover: getNotes(
        bar.cover.map((n) => convert(n)).sort((a, b) => a - b),
        ranges[i].bounds
      ).notes,
      root: roots[i],
      rootRange: root.range,
      rootOffset: convert(roots[i][0]) === bar.root[0] ? 1 : 2,
      base: getNotes([convert(bar.base)], ranges[i].bounds).notes,
      moves: moves[i].filter(
        (x) => x.note >= ranges[i].bounds[0] && x.note <= ranges[i].bounds[1]
      ),
      nextMoves: moves[i + 1]?.filter(
        (x) =>
          x.note - x.move >= ranges[i].bounds[0] &&
          x.note - x.move <= ranges[i].bounds[1]
      ),
    };
  });
};
