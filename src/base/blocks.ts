import { mod12 } from "../util";

export default (notes) => {
  const ranges = Array.from({ length: 12 }).map((_, i) => {
    if (!notes.includes(mod12(i))) return 0;
    if (notes.includes(mod12(i + 7))) return 1;
    const max = Array.from({ length: 6 })
      .map((_, j) => notes.includes(mod12(i + j * 2)))
      .findIndex((x) => !x);
    return (
      max -
      Array.from({ length: max })
        .map((_, j) => j === 0 || !notes.includes(mod12(i + j * 2 - 7)))
        .reverse()
        .findIndex((x) => x)
    );
  });
  const max1 = Math.max(...ranges.filter((_, i) => i % 2 === 0));
  const max2 = Math.max(...ranges.filter((_, i) => i % 2 === 1));

  if (max1 < 1 && max2 < 1) {
    return {
      blocks: { type: "aug", rot: max1 === -1 ? 0 : 1 },
      ext: [],
      cover: [],
    };
  }

  for (let i = Math.max(max1, max2); i > 0; i--) {
    for (let j = 0; j < 12; j++) {
      if (ranges[j] === i) {
        for (let k = 1; k < i; k++) ranges[mod12(j + k * 2)] = 0;
      }
    }
  }

  const counts = Array.from({ length: Math.max(max1, max2) + 1 }).map(
    (_, i) => ranges.filter((x) => x === i).length
  );
  counts[max1]--;
  counts[max2]--;

  const defined1 = counts[max1] === 0;
  const defined2 = counts[max2] === 0;
  if (!defined1 && !defined2) {
    return {
      blocks: { type: "dim" },
      ext: [...notes],
      cover: [],
    };
  }

  const index1 = defined1
    ? ranges.findIndex((r, i) => i % 2 === 0 && r === max1)
    : false;
  const index2 = defined2
    ? ranges.findIndex((r, i) => i % 2 === 1 && r === max2)
    : false;

  const blocks = [
    index1 === false ? false : [index1, (ranges[index1] - 1) * 2],
    index2 === false ? false : [index2, (ranges[index2] - 1) * 2],
  ];

  const covered = [] as any[];
  if (index1 !== false) {
    for (let i = 1; i < max1; i++) covered[mod12(index1 + 5 + i * 2)] = true;
  }
  if (index2 !== false) {
    for (let i = 1; i < max2; i++) covered[mod12(index2 + 5 + i * 2)] = true;
  }

  const ext = notes.filter(
    (x) => x !== index1 && x !== index2 && ranges[x] === 1
  );

  return {
    blocks,
    ext,
    cover: ext.filter((x) => covered[x]),
  };
};
