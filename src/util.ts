export const mod = (x, n) => ((x % n) + n) % n;
export const mod12 = (x) => mod(x, 12);
export const mod12Dist = (x) => mod12(x + 5) - 5;

export const convert = (note) => mod(note * 7, 12);

export const mid = ([start, end]: any) => (start + end) / 2;

export const sum = (x) => x.reduce((a, b) => a + b, 0);

export const isDef = (x) => (x === undefined ? undefined : true);
