import { mid, mod, sum } from "../util";

export default (melodyList, blocksList, height) => {
  const noteRanges = melodyList.map((melody) => {
    const notes = melody
      .reduce((res, set) => [...res, ...set], [])
      .sort((a, b) => a - b);
    if (notes.length === 0) return undefined;
    return [notes[0], notes[notes.length - 1]];
  });
  const baseMids = noteRanges.map((_, i) => {
    const ranges = noteRanges.slice(Math.max(0, i - 3), i + 4).filter((r) => r);
    if (ranges.length === 0) return null;
    return (
      ranges.reduce((res, r) => res + (r[0] + r[1]) / 2, 0) / ranges.length
    );
  });
  const filteredMids = baseMids.filter((m) => m !== null);
  const averageMid =
    filteredMids.length === 0 ? 0 : sum(filteredMids) / filteredMids.len;
  const noteMids = baseMids.map((m) => (m === null ? averageMid : m));

  return blocksList.map((blocks, i) => {
    if (!Array.isArray(blocks)) {
      if (blocks.type === "aug") {
        const boundsBase = [
          Math.min((noteRanges[i]?.[0] ?? noteMids[i]) - 2, noteMids[i] - 8),
          Math.max((noteRanges[i]?.[1] ?? noteMids[i]) - 2, noteMids[i] + 8),
        ];
        return {
          bounds:
            blocks.rot === 0
              ? [
                  Math.round(boundsBase[0] / 2) * 2,
                  Math.round(boundsBase[1] / 2) * 2,
                ]
              : [
                  Math.round((boundsBase[0] - 1) / 2) * 2 + 1,
                  Math.round((boundsBase[1] - 1) / 2) * 2 + 1,
                ],
        };
      }
      return {
        bounds: [
          Math.min((noteRanges[i]?.[0] ?? noteMids[i]) - 2, noteMids[i] - 9),
          Math.max((noteRanges[i]?.[1] ?? noteMids[i]) - 2, noteMids[i] + 9),
        ],
      };
    }

    const divideBlocks = [blocks[0], blocks[1]];
    if (!divideBlocks[0]) {
      const halfway = (blocks[1][1] - 12 + blocks[1][0]) / 12;
      divideBlocks[0] = [halfway, halfway];
    }
    if (!divideBlocks[1]) {
      const halfway = (blocks[0][1] + blocks[0][0] + 12) / 12;
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

    const min = noteRanges[i]?.[0] ?? noteMids[i];
    const max = noteRanges[i]?.[1] ?? noteMids[i];

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
    while (range[1] - range[0] < height - 1) {
      if ((getBound(range[0]) + getBound(range[1] + 1)) / 2 >= noteMids[i]) {
        range[0] = range[0] - 1;
      } else {
        range[1] = range[1] + 1;
      }
    }
    return {
      range,
      bounds: [getBound(range[0]), getBound(range[1] + 1)],
    };
  });
};
