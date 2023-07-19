import maraca, { effect } from "./maraca";
import render from "./render";

import "./style.css";

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
  },
  source
);
const renderer = render(document.getElementById("app"));

effect((effect) => {
  renderer(effect, compiled);
});
