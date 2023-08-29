export default (base, bounds) => {
  const len = base.length;
  const notes = [...base];
  let first = 0;
  while (notes[0] >= bounds[0]) {
    notes.unshift(...notes.slice(0, len).map((x) => x - 12));
    first -= len;
  }
  while (notes[notes.length - 1] <= bounds[1]) {
    notes.push(...notes.slice(-len).map((x) => x + 12));
  }
  const start = notes.findIndex((n) => n >= bounds[0]);
  const end = notes.findIndex((n) => n >= bounds[1]);
  const range = [start === -1 ? 0 : start, end === -1 ? notes.length : end];
  return {
    notes: notes.slice(range[0], range[1]),
    range: [first + range[0], first + range[1] - 1],
  };
};
