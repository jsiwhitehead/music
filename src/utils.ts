import colours from "./colours.json";

export const mod = (n: number, m: number) => ((n % m) + m) % m;

const noteToFifth = (note: number) => mod(note * 7, 12);

const fifthToColour = (fifth: number) =>
  colours.colours_full[mod(Math.round(fifth * 2), 24)]!;

// const noteToColour = (note: number) => fifthToColour(noteToFifth(note));

const array12 = Array.from({ length: 12 }).map((_, i) => i);

const notesToFifths = (notes: number[]) => {
  const unique = new Set(notes.map((n) => noteToFifth(n)));
  const values = array12.map((i) =>
    array12
      .map((j) => (unique.has(mod(i + j, 12)) ? "1" : "0"))
      .reverse()
      .join("")
  );
  const parsed = values.map((v) => parseInt(v, 2));
  const base = parsed.indexOf(Math.min(...parsed));
  const pattern = [...parsed[base]!.toString(2)]
    .map((x) => x === "1")
    .reverse();
  return { base, pattern };
};

export const notesToColour = (notes: number[]) => {
  if (notes.length === 0) return "black";
  const { base, pattern } = notesToFifths(notes);
  const present = pattern
    .map((p, i) => (p ? i : null))
    .filter((x) => x !== null);
  return fifthToColour(
    mod(base + present.reduce((a, b) => a + b, 0) / present.length, 12)
  );
};

export const extendBlocks = (
  blocks: { start: number; end: number }[][],
  lines: number[][]
) => {
  const withMids = blocks.map((bs) =>
    bs.map((b) => ({
      ...b,
      mids: Array.from({ length: (b.end - b.start) / 2 }).map((_, i) =>
        mod(b.start + i * 2 + 1, 12)
      ),
    }))
  );

  const notes = lines.map((line) => line.map((n) => mod(n, 12)));

  const withInner = withMids.map((bs, i) =>
    bs.length > 2
      ? bs.map((b) => ({ ...b, innerStart: b.start, innerEnd: b.end }))
      : bs.map((b) => {
          const opts = Array.from({ length: (b.end - b.start) / 2 + 1 }).map(
            (_, i) => b.start + i * 2
          );
          let first =
            opts.find((n) => notes[i]!.includes(mod(n, 12))) ?? b.start;
          let last =
            opts.findLast((n) => notes[i]!.includes(mod(n, 12))) ?? b.end;
          if (first === last) {
            const mid = (b.start + b.end) / 2;
            if (first >= mid) first -= 2;
            else last += 2;
          }
          return { ...b, innerStart: first, innerEnd: last };
        })
  );

  const connected = withInner.map((m, i) =>
    m.map((x, j) => {
      const prev =
        m.length === 2 &&
        withInner[i - 1]?.length === 2 &&
        withInner[i - 1]?.[j];
      const next =
        m.length === 2 &&
        withInner[i + 1]?.length === 2 &&
        withInner[i + 1]?.[j];
      return {
        ...x,
        prev: prev
          ? [(prev.start - x.start) / 2, (prev.end - x.end) / 2]
          : [0, 0],
        next: next
          ? [(next.start - x.start) / 2, (next.end - x.end) / 2]
          : [0, 0],
        innerPrev: prev
          ? [
              (prev.innerStart - x.innerStart) / 2,
              (prev.innerEnd - x.innerEnd) / 2,
            ]
          : [0, 0],
        innerNext: next
          ? [
              (next.innerStart - x.innerStart) / 2,
              (next.innerEnd - x.innerEnd) / 2,
            ]
          : [0, 0],
      };
    })
  );

  return lines.map((notes, i) => {
    if (connected[i]!.length === 0) return { blocks: [], colour: "black" };
    const res = [...connected[i]!];
    const min = Math.min(...notes);
    const max = Math.max(...notes);
    while (res[0]!.start > min) {
      res.unshift(
        ...res.slice(0, connected[i]!.length).map((x) => ({
          ...x,
          start: x.start - 12,
          end: x.end - 12,
          innerStart: x.innerStart - 12,
          innerEnd: x.innerEnd - 12,
        }))
      );
    }
    while (res.at(-1)!.end < max) {
      res.push(
        ...res.slice(-connected[i]!.length).map((x) => ({
          ...x,
          start: x.start + 12,
          end: x.end + 12,
          innerStart: x.innerStart + 12,
          innerEnd: x.innerEnd + 12,
        }))
      );
    }
    return {
      blocks: res.filter((x) => min <= x.end && x.start <= max),
      colour:
        connected[i]!.length > 2
          ? null
          : notesToColour(
              connected[i]!.flatMap(({ start, end }) =>
                Array.from({ length: (end - start) / 2 + 1 }).map((_, j) =>
                  mod(start + j * 2, 12)
                )
              )
            ),
    };
  });
};

// const modDist = (a: number, b: number, m: number) =>
//   Math.min(mod(a - b, m), mod(b - a, m));

// const allKeys = [
//   { notes: [0, 2, 4, 5, 7, 9, 11], starts: [0, 5], strong: true },
//   { notes: [0, 2, 3, 5, 7, 9, 11], starts: [0, 3], strong: false },
// ].flatMap((base) =>
//   array12.map((n) => ({
//     notes: base.notes.map((x) => mod(x + n, 12)),
//     starts: base.starts.map((x) => x + n),
//     strong: base.strong,
//   }))
// );

// const getMids = (x: { start: number; end: number }[]): [number, number] => [
//   (x[0]!.end + x[1]!.start) / 2,
//   (x[1]!.end + x[0]!.start + 12) / 2,
// ];
// const midsDist = (a: [number, number], b: [number, number]) =>
//   Math.abs(a[0] - b[0]) + Math.abs(a[1] - b[1]);

// const keysDist = (a: number, b: number) =>
//   Math.min(
//     modDist(allKeys[a]!.starts[0]!, allKeys[b]!.starts[0]!, 12) +
//       modDist(allKeys[a]!.starts[1]!, allKeys[b]!.starts[1]!, 12),
//     modDist(allKeys[a]!.starts[0]!, allKeys[b]!.starts[1]!, 12) +
//       modDist(allKeys[a]!.starts[1]!, allKeys[b]!.starts[0]!, 12)
//   );
// const allKeysDist = (keys: number[]) => {
//   let totalDist = 0;
//   for (let i = 1; i < keys.length; i++) {
//     totalDist += keysDist(keys[i - 1]!, keys[i]!);
//   }
//   return totalDist;
// };

// const minimiseSelection = (
//   arrays: number[][],
//   scoreFn: (x: number[]) => number
// ) => {
//   let bestSelection: null | number[] = null;
//   let bestScore = Infinity;

//   const backtrack = (index: number, currentSelection: number[]) => {
//     if (index === arrays.length) {
//       const score = scoreFn(currentSelection);
//       if (score < bestScore) {
//         bestScore = score;
//         bestSelection = [...currentSelection];
//       }
//       return;
//     }

//     for (let value of arrays[index]!) {
//       currentSelection.push(value);
//       backtrack(index + 1, currentSelection);
//       currentSelection.pop();
//     }
//   };

//   backtrack(0, []);
//   return bestSelection!;
// };

// const runLengthsCircular = (arr: number[]) => {
//   let result = Array<number>(arr.length).fill(0);
//   let n = arr.length;
//   let i = 0;

//   let runs: { start: number; length: number }[] = [];
//   while (i < n) {
//     if (arr[i] === 1) {
//       let start = i;
//       while (i < n && arr[i] === 1) i++;
//       runs.push({ start, length: i - start });
//     } else {
//       i++;
//     }
//   }

//   if (
//     runs.length > 1 &&
//     runs[0]!.start === 0 &&
//     runs[runs.length - 1]!.start + runs[runs.length - 1]!.length === n
//   ) {
//     runs[0] = {
//       start: runs[runs.length - 1]!.start,
//       length: runs[0]!.length + runs[runs.length - 1]!.length,
//     };
//     runs.pop();
//   }

//   runs.forEach((run) => {
//     for (let j = 0; j < run.length; j++) {
//       result[(run.start + j) % n] = run.length;
//     }
//   });

//   return result;
// };

// export const barsToBlocks = (bars: number[][]) => {
//   const noteSets = bars.map((notes) => new Set(notes.map((n) => mod(n, 12))));

//   const barNotes = noteSets.map((set) =>
//     array12.map((j) => (set.has(j) ? 1 : 0))
//   );

//   const barKeys = barNotes.map((notes) => {
//     const dim = notes
//       .map((n, i) => {
//         if (n === 0) return -1;
//         if (
//           [0, 3, 6, 9].map((x) => mod(i + x, 12)).filter((j) => notes[j] === 1)
//             .length >= 3
//         ) {
//           return i;
//         }
//         return -1;
//       })
//       .filter((i) => i !== -1);

//     if (dim.length === notes.filter((n) => n === 1).length) {
//       return {
//         all: allKeys.map((_, i) => i),
//         some: [],
//         dim: mod(dim[0]!, 3),
//       };
//     }

//     const semis = runLengthsCircular(notes)
//       .map((x, i) => (x >= 3 ? i : -1))
//       .filter((i) => i !== -1);

//     const thinnedNotes = notes.map((n, i) => (semis.includes(i) ? 0 : n));

//     const options = dim.map((i) =>
//       thinnedNotes.map((n, j) => (j === i ? 0 : n))
//     );

//     const all = allKeys
//       .map((key, i) =>
//         thinnedNotes.every((n, j) => n === 0 || key.notes.includes(j)) ? i : -1
//       )
//       .filter((i) => i !== -1);

//     return {
//       all,
//       some: allKeys
//         .map((key, i) =>
//           options.some((optNotes) =>
//             optNotes.every((n, j) => n === 0 || key.notes.includes(j))
//           )
//             ? i
//             : -1
//         )
//         .filter((i) => i !== -1 && !all.includes(i)),
//     };
//   });

//   const allStrongKeys = barKeys.map((keys, i) => {
//     let current = keys.all.filter((k) => allKeys[k]!.strong);
//     if (current.length === 0) {
//       current = keys.some.filter((k) => allKeys[k]!.strong);
//     }
//     let index = i - 1;
//     while (true) {
//       const next = (barKeys[index]?.all || [])
//         .filter((k) => allKeys[k]!.strong)
//         .filter((k) => current.includes(k));
//       if (next.length === 0) break;
//       current = next;
//       index--;
//     }
//     index = i + 1;
//     while (true) {
//       const next = (barKeys[index]?.all || [])
//         .filter((k) => allKeys[k]!.strong)
//         .filter((k) => current.includes(k));
//       if (next.length === 0) break;
//       current = next;
//       index++;
//     }
//     return current;
//   });

//   const strongKeys: number[][] = [];
//   let lastSetIndex = 0;
//   let currentKeys = allKeys.map((_, i) => i);
//   allStrongKeys.forEach((keys, i) => {
//     const next = currentKeys.filter((x) => keys.includes(x));
//     if (next.length > 0) {
//       currentKeys = next;
//     } else {
//       const key = currentKeys;
//       for (let j = lastSetIndex; j < i; j++) {
//         strongKeys[j] = key;
//       }
//       lastSetIndex = i;
//       currentKeys = keys;
//     }
//   });
//   for (let j = lastSetIndex; j < barKeys.length; j++) {
//     strongKeys[j] = currentKeys;
//   }

//   const resKeys = strongKeys.map((keys) => keys[0]!);

//   const packedKeys = [];
//   let i = 0;
//   while (i < resKeys.length) {
//     let len = resKeys.slice(i).findIndex((key) => key !== resKeys[i]);
//     if (len === -1) len = resKeys.length - i;

//     const sliceKeys = barKeys
//       .slice(i, i + len)
//       .map((x) => [...x.all, ...x.some]);
//     const opts = sliceKeys[0]!.filter((k) =>
//       sliceKeys.every((x) => x.includes(k))
//     );

//     packedKeys.push({ keys: resKeys[i]! === 3 ? [3] : opts, length: len });

//     i += len;
//   }

//   const selection = minimiseSelection(
//     packedKeys.map((x) => x.keys),
//     allKeysDist
//   );

//   const unpackedKeys = packedKeys.flatMap((p, i) =>
//     Array.from<number>({ length: p.length }).fill(selection[i]!)
//   );

//   const blocks = unpackedKeys.map((key, i) => {
//     if (barKeys[i]!.dim !== undefined) {
//       return [0, 3, 6, 9].map((n) => ({
//         start: barKeys[i]!.dim! + n,
//         end: barKeys[i]!.dim! + n + 2,
//         mids: [],
//       }));
//     }

//     const k = allKeys[key]!;
//     const res = [
//       {
//         start: k.starts[0]!,
//         end: k.starts[0]! + (k.strong ? 4 : 2),
//         mids: [] as number[],
//       },
//       {
//         start: k.starts[1]!,
//         end: k.starts[1]! + (k.strong ? 6 : 8),
//         mids: [] as number[],
//       },
//     ];
//     for (const r of res) {
//       r.mids = Array.from({ length: (r.end - r.start) / 2 }).map((_, i) =>
//         mod(r.start + i * 2 + 1, 12)
//       );
//     }
//     return res;
//   });

//   console.log(blocks.slice(0, 5));

//   let lastMids: null | [number, number] = null;
//   const moved = blocks.map((x) => {
//     if (x.length !== 2) return x;
//     if (!lastMids) {
//       lastMids = getMids(x);
//       return x;
//     }
//     let res = [...x];
//     let resMids = getMids(x);
//     for (const dir of [true, false]) {
//       while (true) {
//         const next = dir
//           ? [
//               res[1]!,
//               { ...res[0]!, start: res[0]!.start + 12, end: res[0]!.end + 12 },
//             ]
//           : [
//               { ...res[1]!, start: res[1]!.start - 12, end: res[1]!.end - 12 },
//               res[0]!,
//             ];
//         const nextMids = getMids(next);
//         if (midsDist(nextMids, lastMids) > midsDist(resMids, lastMids)) {
//           break;
//         }
//         res = next;
//         resMids = nextMids;
//       }
//     }
//     lastMids = resMids;
//     return res;
//   });

//   const connected = moved.map((m, i) =>
//     m.map((x, j) => {
//       const prev =
//         m.length === 2 && moved[i - 1]?.length === 2 && moved[i - 1]?.[j];
//       const next =
//         m.length === 2 && moved[i + 1]?.length === 2 && moved[i + 1]?.[j];
//       return {
//         ...x,
//         prev: prev
//           ? [(prev.start - x.start) / 2, (prev.end - x.end) / 2]
//           : [0, 0],
//         next: next
//           ? [(next.start - x.start) / 2, (next.end - x.end) / 2]
//           : [0, 0],
//       };
//     })
//   );

//   return bars.map((notes, i) => {
//     if (connected[i]!.length === 0) return { blocks: [], colour: "black" };
//     const res = [...connected[i]!];
//     const min = Math.min(...notes);
//     const max = Math.max(...notes);
//     while (res[0]!.start > min) {
//       res.unshift(
//         ...res
//           .slice(0, connected[i]!.length)
//           .map((x) => ({ ...x, start: x.start - 12, end: x.end - 12 }))
//       );
//     }
//     while (res.at(-1)!.end < max) {
//       res.push(
//         ...res
//           .slice(-connected[i]!.length)
//           .map((x) => ({ ...x, start: x.start + 12, end: x.end + 12 }))
//       );
//     }
//     return {
//       blocks: res.filter((x) => min <= x.end && x.start <= max),
//       colour:
//         connected[i]!.length > 2
//           ? "#999"
//           : notesToColour(
//               connected[i]!.flatMap(({ start, end }) =>
//                 Array.from({ length: (end - start) / 2 + 1 }).map((_, j) =>
//                   mod(start + j * 2, 12)
//                 )
//               )
//             ),
//     };
//   });
// };
