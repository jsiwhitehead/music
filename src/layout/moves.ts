import { convert, mod12Dist } from "../util";

export default (chordNotesList, movesList, rootsList, boundsList) => {
  const chordNotes = chordNotesList.map((notes) => {
    if (notes === undefined) return undefined;
    const mapped = notes.map((n) => convert(n)).sort((a, b) => a - b);
    return [
      ...mapped.map((n) => n - 12),
      ...mapped,
      ...mapped.map((n) => n + 12),
    ];
  });

  return movesList.map((barMoves, i) => {
    const res = barMoves
      .map((move) => {
        const x = convert(move.note);
        if (i === 0 || chordNotes[i - 1].length === 0) {
          return { note: x, role: move.role, role2: move.role, move: 0 };
        }
        const min = Math.min(...chordNotes[i - 1].map((y) => Math.abs(y - x)));
        const res = chordNotes[i - 1]
          .map((y) => ({
            note: x,
            role: move.role,
            move: x - y,
            role2: mod12Dist((y - convert(rootsList[i - 1])) * 7),
          }))
          .filter((x) => Math.abs(x.move) === min);
        // if (move.role !== 0 && min > 1 && res.length > 1) return [];
        const minRole = Math.min(...res.map((m) => Math.abs(m.role2)));
        const options = res.filter((m) => Math.abs(m.role2) === minRole);
        if (options.length > 1) return options.find((m) => m.role2 >= 0);
        return options[0];
      })
      .sort((a, b) => a.note - b.note);
    if (res.length === 0) return [];
    const len = res.length;
    while (
      Math.max(res[0].note, res[0].note - res[0].move) >=
      Math.min(boundsList[i][0], boundsList[i - 1]?.[0] ?? boundsList[i][0])
    ) {
      res.unshift(
        ...res.slice(0, len).map((x) => ({ ...x, note: x.note - 12 }))
      );
    }
    while (
      Math.min(
        res[res.length - 1].note,
        res[res.length - 1].note - res[res.length - 1].move
      ) <=
      Math.max(boundsList[i][1], boundsList[i - 1]?.[1] ?? boundsList[i][1])
    ) {
      res.push(...res.slice(-len).map((x) => ({ ...x, note: x.note + 12 })));
    }
    return res.filter((x) => Math.abs(x.move) === 1);
  });
};
