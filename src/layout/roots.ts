import { convert, mod } from "../util";

export default (rootslist) => {
  let root;
  return rootslist.map((r) => {
    if (r === undefined) return undefined;
    let current = [convert(r[0]), convert(r[1])].sort((a, b) => a - b);
    if (!root) {
      root = current;
    } else {
      const dir = root[0] - current[0] + (root[1] - current[1]) > 0 ? 1 : -1;
      while (true) {
        const next =
          dir === 1
            ? [current[1], current[0] + 12]
            : [current[1] - 12, current[0]];
        if (
          (Math.abs(root[0] - next[0]) +
            Math.abs(root[1] - next[1]) -
            (Math.abs(root[0] - current[0]) + Math.abs(root[1] - current[1])) ||
            mod(root[0] - next[0], 2) - mod(root[0] - current[0], 2)) < 0
        ) {
          current = next;
        } else {
          break;
        }
      }
      root = current;
    }
    return root;
  });
};
