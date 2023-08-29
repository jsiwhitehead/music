import { mod } from "../util";

export default (blocksList) => {
  return blocksList.map((blocks, i) => [
    [
      i === 0 || mod(blocks?.[0]?.[0] - blocksList[i - 1]?.[0]?.[0], 2) === 0,
      i === blocksList.length - 1 ||
        mod(blocks?.[0]?.[0] - blocksList[i + 1]?.[0]?.[0], 2) === 0,
    ],
    [
      i === 0 || mod(blocks?.[1]?.[0] - blocksList[i - 1]?.[1]?.[0], 2) === 0,
      i === blocksList.length - 1 ||
        mod(blocks?.[1]?.[0] - blocksList[i + 1]?.[1]?.[0], 2) === 0,
    ],
  ]);
};
