import { mod, mod12 } from "../util";

const checkOne = (notes, n) => {
  if (notes.has(mod12(n))) return 1;
  if (
    (notes.has(mod12(n - 2)) && !notes.has(mod12(n - 7))) ||
    (notes.has(mod12(n + 2)) && !notes.has(mod12(n + 7)))
  ) {
    return 0;
  }
  if (
    [...notes].every((x) => mod(x, 2) !== mod(n, 2)) &&
    (notes.has(mod12(n - 7)) ? 1 : 0) + (notes.has(mod12(n + 7)) ? 1 : 0) < 2
  ) {
    return 0;
  }
  return -1;
};
const checkMulti = (notesList, n) => {
  for (const [i, notes] of notesList.entries()) {
    const c = checkOne(notes, n);
    if (c === 1) notesList.slice(0, i).forEach((x) => x.add(n));
    if (c !== 0) return c;
  }
  notesList.forEach((x) => x.add(n));
  return 0;
};

export default (notesList, tryFifths = []) => {
  for (const _ in [1, 2, 3]) {
    notesList.forEach((notes, i) => {
      const prev = notesList
        .map((notes) => new Set(notes))
        .slice(0, i)
        .reverse();
      let done = false;
      while (!done) {
        const size = [notes, ...prev].reduce((res, x) => res + x.size, 0);
        Array.from({ length: 12 }).forEach((_, j) => {
          if (
            j === tryFifths[i] ||
            notes.has(mod12(j)) ||
            (notes.has(mod12(j - 1)) && notes.has(mod12(j + 1)))
          ) {
            if (j === tryFifths[i] || checkOne(notes, j) >= 0) {
              if (checkMulti(prev, j) >= 0) {
                notes.add(mod12(j));
              }
            }
          }
        });
        done = size === [notes, ...prev].reduce((res, x) => res + x.size, 0);
      }
    });

    notesList.forEach((notes, i) => {
      const prev = notesList
        .map((notes) => new Set(notes))
        .slice(0, i)
        .reverse();
      let done = false;
      while (!done) {
        const size = [notes, ...prev].reduce((res, x) => res + x.size, 0);
        Array.from({ length: 12 }).forEach((_, j) => {
          if (
            notes.has(mod12(j)) ||
            (notes.has(mod12(j - 2)) &&
              notes.has(mod12(j + 2)) &&
              !notes.has(mod12(j - 7)) &&
              !notes.has(mod12(j + 7)))
          ) {
            if (checkOne(notes, j) >= 0) {
              if (checkMulti(prev, j) >= 0) {
                notes.add(mod12(j));
              }
            }
          }
        });
        done = size === [notes, ...prev].reduce((res, x) => res + x.size, 0);
      }
    });
  }
};
