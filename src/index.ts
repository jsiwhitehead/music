import webfont from "webfontloader";

import maraca, { effect } from "./maraca";
import render from "./render";
import getPiece from "./piece";

import "./style.css";

webfont.load({
  google: {
    families: [
      "Atkinson Hyperlegible",
      "Atkinson Hyperlegible:italic",
      "Atkinson Hyperlegible:bold",
      "Atkinson Hyperlegible:bolditalic",
    ],
  },
});

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

const songs = {
  GodOnlyKnows: `
    D/A D/A Bm6 Bm6
    F#m F#m7 B/A B/A
    E/B E/B Cdim7 Cdim7
    E/B E/B Bbm7b5 Bbm7b5
    A A E/G# E/G#
    F#m7 F#m7 Em9 Em9
  `,
  CircleOfLife: `
    Bb Cm7/Bb F/A Bb
    Gm Cm Ab F
    Bb Bb Ab/Bb Ab/Bb Eb Eb F F
    Bb/D G7 Cm Ebm6/Gb Bb F7 Eb/Bb Bb
  `,
  MyFoolishHeart: `
    Bbmaj7 Ebmaj7 D-7 G7 C-7 C-7/Bb A7sus4 A7
    D-7 D7#9 G-7 Db7 C-7 C-7 C-7b5 F7b9
    Bbmaj7 Bbmaj7 F-9 Bb+7 Ebmaj7 Ebmaj7 A-7b5 D7
    G-7 D7#9 G-7 C7 C-7 G+7 C-7 F7
  `,
  VeryEarly: `
    Amaj7 G7 Cmaj7 F7 Bbmaj7 E7 Amaj7 G7#11
    Bbmaj7 F#-7 D#-7 G#7b9 C#-9 F7 Bbmaj7 E7
  `,
  BluesForAlice: `
    F6 F6 E-7 A7b9 D-7 G7 C-7 F7
    Bb7 Bb7 Bb-7 Eb7 A-7 D7 Ab-7 Db7
    G-7 G-7 C7 C7 A-7 D-7 G-7 C7
  `,
  WillsPiece: `
    Gbmaj7 Gbmaj7 Bbmaj7/Eb Bbmaj7/Eb
    Ebm Ebm Ab13#11 Ab13#11
    Cm11 Dm D7 Gm7 Gbmaj7b5
    Bb/F Emaj7b5 Ebm9 Ab13
    Dbmaj7 Dbmaj7 Fmaj7/Bb Fmaj7/Bb
    Bbm Bbm Eb13 Eb13
    Gm11 Am A7 Dm7 Ab7sus4
    Bb7sus4 Bm7 Amaj7/Db Abm7 Db13
  `,
};

const compiled = maraca(
  {
    data: getPiece(songs.VeryEarly),
    isBlock: (x) => x.__type === "block",
    len: (block) =>
      block === null
        ? null
        : Array.isArray(block)
        ? block.length
        : block.items.length,
    floor: (num) => Math.floor(num),
    includes: (block, value) =>
      Array.isArray(block)
        ? block.includes(value)
        : block.items.includes(value),
    getRange: (start, end) => ({
      __type: "block",
      values: {},
      items: Array.from({ length: end - start + 1 }).map((_, i) => start + i),
    }),
    getKey: (key, offset) => {
      const k = mod(key, 1) === 0.5 ? key - 0.5 : key;
      let gaps = [mod((k + 1) * 4, 7), mod((k + 2) * 4, 7)].sort(
        (a, b) => a - b
      );
      gaps = [gaps[1] - 7, gaps[0]];
      // gaps = [gaps[1] - 7, gaps[0]];
      if (offset > 0) {
        for (let i = 0; i < offset; i++) {
          gaps = [gaps[1] - 7, gaps[0]];
        }
      } else if (offset < 0) {
        for (let i = 0; i < -offset; i++) {
          gaps = [gaps[1], gaps[0] + 7];
        }
      }
      const base = [1, 2, 3, 4, 5, 6]
        .map((x) => x + gaps[0])
        .filter((x) => !gaps.includes(x));
      const res = mod(key, 1) === 0.5 ? base.map((x) => x + 0.5) : base;
      return {
        __type: "block",
        values: {},
        items: [
          ...res,
          // ...res.map((x) => x + 7),
          // ...res.filter((x) => x < gaps[1]).map((x) => x + 14),
        ],
      };
    },
    getColor: (key, note) => {
      const k = mod(key, 1) === 0.5 ? key - 0.5 : key;
      const gaps = [mod((k + 1) * 4, 7), mod((k + 2) * 4, 7)]
        .sort((a, b) => a - b)
        .map((x) => (mod(key, 1) === 0.5 ? x + 0.5 : x));
      const start = (gaps[1] - gaps[0] === 3 ? gaps[0] : gaps[1]) + 1;
      const k2 = mod(key, 1) === 0.5 ? key + 6.5 : key;
      if (mod(key + note, 1) === 0) {
        return k2 + [-2, 0, 2, -3, -1, 1, 3][mod(note - start, 7)];
      }
      return k2 + [-2, 0, 2, -3, -1, 1, 3][mod(note - start - 0.5, 7)] + 7;
    },
    sort: (x) => ({ ...x, items: [...x.items].sort((a, b) => a - b) }),
    check: (x) => {
      console.log(x);
      return x;
    },
  },
  source
);
const renderer = render(document.getElementById("app"));

effect((effect) => {
  renderer(effect, compiled);
});
