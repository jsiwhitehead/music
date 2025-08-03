import { createRoot } from "react-dom/client";

import fontInfo from "../leland/glyphnames.json";

import { barsToBlocks, noteToColour } from "./utils";

const noteGlpyhs = new Map<number, keyof typeof fontInfo>([
  [4, "noteheadWhole"],
  [2, "noteheadHalf"],
  [1, "noteheadBlack"],
]);

const restGlyphs = new Map<number, keyof typeof fontInfo>([
  [4, "restWhole"],
  [2, "restHalf"],
  [1, "restQuarter"],
  [0.5, "rest8th"],
  [0.25, "rest16th"],
  [0.125, "rest32nd"],
]);

const durationMap = new Map<number, { base: number; dots: number }>([
  [3, { base: 2, dots: 1 }],
  [1.5, { base: 1, dots: 1 }],
]);

const TONE_HEIGHT = 6;
const NOTE_HEIGHT = 7.5;
const BAR_THIN = 2;
const NOTE_DIST = TONE_HEIGHT * 5;
const BRIDGE = TONE_HEIGHT * 1;

const Y_BASELINE = 100;

const baseDuration = 0.5;

const noteToY = (note: number) => Y_BASELINE - note * (TONE_HEIGHT / 2);

type Event =
  | { type: "note"; pitch: number[]; duration: number }
  | { type: "rest"; duration: number };

type TimedEvent =
  | { type: "note"; pitch: number[]; time: number; duration: number }
  | { type: "rest"; pitch: number; time: number; duration: number };

const bars: Event[][][] = [
  [
    [{ type: "note", pitch: [-2], duration: 1 }],
    [{ type: "rest", duration: 1 }],
  ],
  [
    [{ type: "note", pitch: [7], duration: 3 }],
    [
      { type: "note", pitch: [-33], duration: 1 },
      { type: "note", pitch: [-17, -9], duration: 1 },
      { type: "note", pitch: [-14, -9, -5], duration: 1 },
    ],
  ],
  [
    [
      { type: "note", pitch: [7], duration: 1 },
      { type: "note", pitch: [5], duration: 1 },
      { type: "note", pitch: [7], duration: 1 },
    ],
    [
      { type: "note", pitch: [-21], duration: 1 },
      { type: "note", pitch: [-16, -10], duration: 1 },
      { type: "note", pitch: [-13, -10, -4], duration: 1 },
    ],
  ],
  [
    [{ type: "note", pitch: [5], duration: 3 }],
    [
      { type: "note", pitch: [-33], duration: 1 },
      { type: "note", pitch: [-17, -9], duration: 1 },
      { type: "note", pitch: [-14, -9, -5], duration: 1 },
    ],
  ],
  [
    [
      { type: "note", pitch: [3], duration: 2 },
      { type: "note", pitch: [-2], duration: 1 },
    ],
    [
      { type: "note", pitch: [-34], duration: 1 },
      { type: "note", pitch: [-17, -9], duration: 1 },
      { type: "note", pitch: [-14, -9, -5], duration: 1 },
    ],
  ],
  [
    [
      { type: "note", pitch: [7], duration: 2 },
      { type: "note", pitch: [0], duration: 1 },
    ],
    [
      { type: "note", pitch: [-36], duration: 1 },
      { type: "note", pitch: [-17, -8], duration: 1 },
      { type: "note", pitch: [-14, -8, -5], duration: 1 },
    ],
  ],
  [
    [
      { type: "note", pitch: [12], duration: 2 },
      { type: "note", pitch: [7], duration: 1 },
    ],
    [
      { type: "note", pitch: [-24], duration: 1 },
      { type: "note", pitch: [-17, -8], duration: 1 },
      { type: "note", pitch: [-12, -8, -2], duration: 1 },
    ],
  ],
  [
    [{ type: "note", pitch: [10], duration: 3 }],
    [
      { type: "note", pitch: [-31], duration: 1 },
      { type: "note", pitch: [-19, -11], duration: 1 },
      { type: "note", pitch: [-14, -11, -8], duration: 1 },
    ],
  ],
  [
    [
      { type: "note", pitch: [8], duration: 2 },
      { type: "note", pitch: [7], duration: 1 },
    ],
    [
      { type: "note", pitch: [-31], duration: 1 },
      { type: "note", pitch: [-19, -12], duration: 1 },
      { type: "note", pitch: [-16, -12, -7], duration: 1 },
    ],
  ],
  [
    [{ type: "note", pitch: [5], duration: 3 }],
    [
      { type: "note", pitch: [-26], duration: 1 },
      { type: "note", pitch: [-19, -10], duration: 1 },
      { type: "note", pitch: [-14, -10, -4], duration: 1 },
    ],
  ],
  [
    [
      { type: "note", pitch: [7], duration: 2 },
      { type: "note", pitch: [2], duration: 1 },
    ],
    [
      { type: "note", pitch: [-25], duration: 1 },
      { type: "note", pitch: [-17, -7], duration: 1 },
      { type: "note", pitch: [-10, -7, -5], duration: 1 },
    ],
  ],
  [
    [{ type: "note", pitch: [3], duration: 3 }],
    [
      { type: "note", pitch: [-24], duration: 1 },
      { type: "note", pitch: [-17, -9], duration: 1 },
      { type: "note", pitch: [-12, -9, -5], duration: 1 },
    ],
  ],
  [
    [{ type: "note", pitch: [0], duration: 3 }],
    [
      { type: "note", pitch: [-27], duration: 1 },
      { type: "note", pitch: [-18, -9], duration: 1 },
      { type: "note", pitch: [-12, -9, -6], duration: 1 },
    ],
  ],
  [
    [
      { type: "note", pitch: [-2], duration: 1 },
      { type: "note", pitch: [14], duration: 1 },
      { type: "note", pitch: [12], duration: 1 },
    ],
    [
      { type: "note", pitch: [-26], duration: 1 },
      { type: "note", pitch: [-19, -9], duration: 1 },
      { type: "note", pitch: [-14, -9, -4], duration: 1 },
    ],
  ],
  [
    [
      { type: "note", pitch: [10], duration: 0.5 },
      { type: "note", pitch: [8], duration: 0.5 },
      { type: "note", pitch: [7], duration: 0.5 },
      { type: "note", pitch: [8], duration: 0.5 },
      { type: "note", pitch: [0], duration: 0.5 },
      { type: "note", pitch: [2], duration: 0.5 },
    ],
    [
      { type: "note", pitch: [-38], duration: 1 },
      { type: "note", pitch: [-19, -10], duration: 1 },
      { type: "note", pitch: [-14, -4], duration: 1 },
    ],
  ],
  [
    [{ type: "note", pitch: [3], duration: 3 }],
    [
      { type: "note", pitch: [-33], duration: 1 },
      { type: "note", pitch: [-17, -9], duration: 1 },
      { type: "note", pitch: [-14, -9, -5], duration: 1 },
    ],
  ],
];

const lineNotes = Array.from({ length: 2 }).map((_, i) =>
  bars
    .flatMap((lines) => lines[i]!)
    .filter((e) => e.type === "note")
    .flatMap((e) => e.pitch)
);
const middles = lineNotes.map((notes) =>
  Math.round((Math.min(...notes) + Math.max(...notes)) / 2)
);

const timedBars: TimedEvent[][][] = bars.map((lines) =>
  lines.map((line, i) => {
    let current = 0;
    return line.map((l) => {
      const time = current;
      current += l.duration;
      if (l.type === "note") return { ...l, time };
      return { ...l, pitch: middles[i]!, time };
    });
  })
);

const blocks = barsToBlocks(
  bars.map((lines) =>
    lines
      .flatMap((s) => s)
      .filter((s) => s.type === "note")
      .flatMap((s) => s.pitch)
  )
);

const Glyph: React.FC<{
  glpyh: keyof typeof fontInfo;
  x: number;
  y: number;
  fill: string;
  stroke?: string;
  strokeWidth?: number;
}> = ({ glpyh, x, y, fill, stroke = "black", strokeWidth = 0 }) => (
  <text
    x={x}
    y={y}
    fontFamily="Leland"
    fontSize={NOTE_HEIGHT * 3.9}
    fill={fill}
    stroke={stroke}
    strokeWidth={strokeWidth}
  >
    {String.fromCodePoint(
      parseInt(fontInfo[glpyh].codepoint.replace("U+", ""), 16)
    )}
  </text>
);

const DrawEvent: React.FC<{
  event: TimedEvent;
  up: boolean;
  starts: number[];
  ends: number[];
}> = ({ event, up, starts, ends }) => {
  const duration = event.duration * baseDuration;
  const { base, dots } = durationMap.has(duration)
    ? durationMap.get(duration)!
    : { base: duration, dots: 0 };
  const x =
    BRIDGE +
    NOTE_DIST / 2 -
    Math.round(NOTE_HEIGHT * 2.2) / 4 +
    event.time * NOTE_DIST;
  if (event.type === "rest") {
    return (
      <Glyph
        x={x}
        y={noteToY(event.pitch)}
        glpyh={restGlyphs.get(base)!}
        fill="black"
      />
    );
  }
  const rightX = x + Math.round(NOTE_HEIGHT * 2.2) / 2;
  return (
    <>
      {event.pitch.flatMap((p, i) => {
        const y = noteToY(p);
        return [
          <Glyph
            key={`${i}_head`}
            x={x - 0.5}
            y={y}
            glpyh={noteGlpyhs.get(base <= 1 ? 1 : base)!}
            fill={"black"}
            stroke="white"
            strokeWidth={0}
          />,
          up ? (
            <line
              key={`${i}_0`}
              x1={rightX}
              x2={rightX}
              y1={y - TONE_HEIGHT * 3.5}
              y2={y}
              stroke="black"
              strokeWidth={1}
            />
          ) : (
            <line
              key={`${i}_stem`}
              x1={x}
              x2={x}
              y1={y}
              y2={y + TONE_HEIGHT * 3.5}
              stroke="black"
              strokeWidth={1}
            />
          ),
          ...Array.from({ length: dots }).map((_, j) => (
            <Glyph
              key={`${i}_dots_${j}`}
              x={rightX + TONE_HEIGHT * (0.4 + 0.7 * j)}
              y={y}
              glpyh="augmentationDot"
              fill="black"
            />
          )),
        ];
      })}
    </>
  );
};

const Bridge: React.FC<{
  a: [number, number, number];
  b: [number, number, number];
  colour: string;
  opacity: number;
}> = ({ a, b, colour, opacity }) => (
  <polygon
    points={`${a[0]},${a[2]} ${b[0]},${b[2]} ${b[0]},${b[1]} ${a[0]},${a[1]}`}
    fill={colour}
    opacity={opacity}
  />
);

const Bar: React.FC<{
  lines: TimedEvent[][];
  blocks: {
    start: number;
    end: number;
    gap?: boolean;
    prev: number[];
    next: number[];
  }[];
  colour: string;
  first: boolean;
  last: boolean;
}> = ({ lines, blocks, colour, first, last }) => (
  <svg
    width={NOTE_DIST * 3 + BRIDGE * 2}
    height={300}
    viewBox={`0 0 ${NOTE_DIST * 3 + BRIDGE * 2} 300`}
  >
    {blocks.flatMap(({ start, end, prev, next }, j) => [
      <Bridge
        key={`${j}_prev`}
        a={[
          0,
          noteToY(start + prev[0]!) - BAR_THIN,
          noteToY(end + prev[1]!) + BAR_THIN,
        ]}
        b={[BRIDGE, noteToY(start) - BAR_THIN, noteToY(end) + BAR_THIN]}
        colour={colour}
        opacity={0.5}
      />,
      <rect
        key={`${j}_base`}
        x={BRIDGE}
        width={NOTE_DIST * 3}
        y={noteToY(end) + BAR_THIN}
        height={(TONE_HEIGHT * (end - start)) / 2 - BAR_THIN * 2}
        fill={colour}
        opacity={0.5}
      />,
      <Bridge
        key={`${j}_next`}
        a={[
          BRIDGE + NOTE_DIST * 3,
          noteToY(start) - BAR_THIN,
          noteToY(end) + BAR_THIN,
        ]}
        b={[
          BRIDGE * 2 + NOTE_DIST * 3,
          noteToY(start + next[0]!) - BAR_THIN,
          noteToY(end + next[1]!) + BAR_THIN,
        ]}
        colour={colour}
        opacity={0.5}
      />,
    ])}
    {blocks.map(({ start, gap }, j) =>
      gap ? (
        <rect
          key={j}
          x={BRIDGE}
          width={NOTE_DIST * 3}
          y={noteToY(start) - TONE_HEIGHT * 2 + BAR_THIN}
          height={TONE_HEIGHT - BAR_THIN * 2}
          rx={(TONE_HEIGHT - BAR_THIN * 2) / 2}
          ry={(TONE_HEIGHT - BAR_THIN * 2) / 2}
          fill="white"
        />
      ) : null
    )}
    {first && (
      <line x1={0} x2={0} y1={0} y2={300} stroke="white" strokeWidth={1} />
    )}
    {last && (
      <line
        x1={NOTE_DIST * 3 + BRIDGE * 2}
        x2={NOTE_DIST * 3 + BRIDGE * 2}
        y1={0}
        y2={300}
        stroke="white"
        strokeWidth={1}
      />
    )}
    {lines.flatMap((line, j) =>
      line.map((event, k) => (
        <DrawEvent
          key={`${j}_${k}`}
          event={event}
          starts={blocks.map((b) => b.start)}
          ends={blocks.map((b) => b.end)}
          up={j === 0}
        />
      ))
    )}
  </svg>
);

const App: React.FC = () => (
  <div>
    {timedBars.map((lines, i) => (
      <Bar
        key={i}
        lines={lines}
        first={i % 4 === 1}
        last={i % 4 === 0}
        {...blocks[i]!}
      />
    ))}
  </div>
);

const elem = document.getElementById("root")!;
createRoot(elem).render(<App />);
