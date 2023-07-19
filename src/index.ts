import maraca, { effect } from "./maraca";
import render from "./render";

import "./style.css";

const mod = (x, n) => ((x % n) + n) % n;

const set = (obj, path, value) =>
  path.reduce(
    (res, k, i) => (res[k] = i === path.length - 1 ? value : res[k] || {}),
    obj
  );
// @ts-ignore
const app = import.meta.glob("../app/**", { eager: true, as: "raw" });
const source = Object.keys(app).reduce((res, k) => {
  const p = k
    .slice(3, -3)
    .split(/[\\\\\\/]/)
    .slice(1);
  set(res, p, app[k]);
  return res;
}, {});

const compiled = maraca(
  {
    arr: (length) => ({
      __type: "block",
      values: {},
      items: Array.from({ length }).map((_, i) => i + 1),
    }),
    isBlock: (x) => x.__type === "block",
    len: (block) => block.items.length,
    floor: (num) => Math.floor(num),
    getKey: (key, offset) => {
      let gaps = [((key + 1) * 4) % 7, ((key + 2) * 4) % 7].sort(
        (a, b) => a - b
      );
      gaps = [gaps[1] - 7, gaps[0]];
      gaps = [gaps[1] - 7, gaps[0]];
      if (offset > 0) {
        for (let i = 0; i < offset; i++) {
          gaps = [gaps[1] - 7, gaps[0]];
        }
      } else if (offset < 0) {
        for (let i = 0; i < -offset; i++) {
          gaps = [gaps[1], gaps[0] + 7];
        }
      }
      const res = [1, 2, 3, 4, 5, 6]
        .map((x) => x + gaps[0])
        .filter((x) => !gaps.includes(x));
      return {
        __type: "block",
        values: {},
        items: [
          ...res,
          ...res.map((x) => x + 7),
          ...[1, 2, 3, 4, 5, 6]
            .map((x) => x + gaps[0])
            .filter((x) => x < gaps[1])
            .map((x) => x + 14),
        ],
      };
    },
    getColor: (key, note) => {
      const gaps = [((key + 1) * 4) % 7, ((key + 2) * 4) % 7].sort(
        (a, b) => a - b
      );
      const start = (gaps[1] - gaps[0] === 3 ? gaps[0] : gaps[1]) + 1;
      if (mod(note, 1) === 0) {
        return key + [-2, 0, 2, -3, -1, 1, 3][mod(note - start, 7)];
      }
      return key + [-2, 0, 2, -3, -1, 1, 3][mod(note - start - 0.5, 7)] + 7;
    },
    check: (x) => x,
  },
  source
);
const renderer = render(document.getElementById("app"));

effect((effect) => {
  renderer(effect, compiled);
});
