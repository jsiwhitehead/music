import { mod12 } from "../util";

const checkOne = (notes, n) => {
  if (notes.has(mod12(n))) return 1;
  if (notes.has(mod12(n - 7)) && notes.has(mod12(n + 7))) return -1;
  return 0;
};
const checkMulti = (notesList, n) => {
  for (const notes of notesList) {
    const c = checkOne(notes, n);
    if (c !== 0) return c;
  }
  return 0;
};

export default (notesList) =>
  notesList.map(
    (notes, i) =>
      new Set(
        Array.from({ length: 12 })
          .map((_, j) => j)
          .filter((j) => {
            const c = checkOne(notes, j);
            if (c !== 0) return c === 1;
            const before = checkMulti(notesList.slice(0, i).reverse(), j);
            const after = checkMulti(notesList.slice(i + 1), j);
            return (
              before !== -1 && after !== -1 && (before === 1 || after === 1)
            );
          })
      )
  );
