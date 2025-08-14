import { createRoot } from "react-dom/client";

import fontInfo from "../leland/glyphnames.json";

import bars from "./piece";
import { mod, extendBlocks, notesToColour } from "./utils";

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
const NOTE_HEIGHT = 7;
const BAR_THIN = 2;
const NOTE_DIST = TONE_HEIGHT * 5;
const BRIDGE = TONE_HEIGHT * 1;

const Y_BASELINE = 100;

const baseDuration = 0.5;

const noteToY = (note: number) => Y_BASELINE - note * (TONE_HEIGHT / 2);

type TimedEvent =
  | { type: "note"; pitch: number[]; time: number; duration: number }
  | { type: "rest"; pitch: number; time: number; duration: number };

const lineNotes = Array.from({ length: 2 }).map((_, i) =>
  bars
    .flatMap(({ lines }) => lines[i]!)
    .filter((e) => e.type === "note")
    .flatMap((e) => e.pitch)
);
const middles = lineNotes.map((notes) =>
  Math.round((Math.min(...notes) + Math.max(...notes)) / 2)
);

const timedBars: TimedEvent[][][] = bars.map(({ lines }) =>
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

let currentBlocks;
const baseBlocks = bars.map(({ blocks }) => {
  if (blocks) {
    currentBlocks = blocks.map((b, i) => ({
      start: b,
      end: (i + 1 < blocks.length ? blocks[i + 1]! : blocks[0]! + 12) - 1,
    }));
  }
  return currentBlocks!;
});

const blocks = extendBlocks(
  baseBlocks,
  bars.map(({ lines }) =>
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
  mids: Set<number>;
  up: boolean;
}> = ({ event, mids, up }) => {
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
          ...(mids.has(mod(p, 12))
            ? [
                <line
                  key={`${i}_mid`}
                  x1={x - NOTE_HEIGHT * 0.5}
                  x2={rightX + NOTE_HEIGHT * 0.5}
                  y1={y}
                  y2={y}
                  stroke="black"
                  strokeWidth={2}
                  strokeLinecap="round"
                />,
              ]
            : []),
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
              y={y - (mids.has(mod(p, 12)) ? NOTE_HEIGHT * 0.3 : 0)}
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
    prev: number[];
    next: number[];
    innerStart: number;
    innerEnd: number;
    innerPrev: number[];
    innerNext: number[];
    mids: number[];
  }[];
  colour: string | null;
  first: boolean;
  last: boolean;
}> = ({ lines, blocks, colour, first, last }) => (
  <svg
    width={NOTE_DIST * 3 + BRIDGE * 2}
    height={280}
    viewBox={`0 0 ${NOTE_DIST * 3 + BRIDGE * 2} 280`}
  >
    {blocks.flatMap(
      (
        { start, end, prev, next, innerStart, innerEnd, innerPrev, innerNext },
        j
      ) => [
        <Bridge
          key={`${j}_prev`}
          a={[
            0,
            noteToY(start + prev[0]!) - BAR_THIN,
            noteToY(end + prev[1]!) + BAR_THIN,
          ]}
          b={[BRIDGE, noteToY(start) - BAR_THIN, noteToY(end) + BAR_THIN]}
          colour="#ccc"
          opacity={0.5}
        />,
        <rect
          key={`${j}_base`}
          x={BRIDGE}
          width={NOTE_DIST * 3}
          y={noteToY(end) + BAR_THIN}
          height={(TONE_HEIGHT * (end - start)) / 2 - BAR_THIN * 2}
          fill="#ccc"
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
          colour="#ccc"
          opacity={0.5}
        />,
        <Bridge
          key={`${j}_innerprev`}
          a={[
            0,
            noteToY(innerStart + innerPrev[0]!) - BAR_THIN,
            noteToY(innerEnd + innerPrev[1]!) + BAR_THIN,
          ]}
          b={[
            BRIDGE,
            noteToY(innerStart) - BAR_THIN,
            noteToY(innerEnd) + BAR_THIN,
          ]}
          colour="white"
          opacity={1}
        />,
        <rect
          key={`${j}_innerbase`}
          x={BRIDGE}
          width={NOTE_DIST * 3}
          y={noteToY(innerEnd) + BAR_THIN}
          height={(TONE_HEIGHT * (innerEnd - innerStart)) / 2 - BAR_THIN * 2}
          fill="white"
          opacity={1}
        />,
        <Bridge
          key={`${j}_innernext`}
          a={[
            BRIDGE + NOTE_DIST * 3,
            noteToY(innerStart) - BAR_THIN,
            noteToY(innerEnd) + BAR_THIN,
          ]}
          b={[
            BRIDGE * 2 + NOTE_DIST * 3,
            noteToY(innerStart + innerNext[0]!) - BAR_THIN,
            noteToY(innerEnd + innerNext[1]!) + BAR_THIN,
          ]}
          colour="white"
          opacity={1}
        />,
        <Bridge
          key={`${j}_innerprev`}
          a={[
            0,
            noteToY(innerStart + innerPrev[0]!) - BAR_THIN,
            noteToY(innerEnd + innerPrev[1]!) + BAR_THIN,
          ]}
          b={[
            BRIDGE,
            noteToY(innerStart) - BAR_THIN,
            noteToY(innerEnd) + BAR_THIN,
          ]}
          colour={colour || notesToColour([start, end])}
          opacity={0.5}
        />,
        <rect
          key={`${j}_innerbase`}
          x={BRIDGE}
          width={NOTE_DIST * 3}
          y={noteToY(innerEnd) + BAR_THIN}
          height={(TONE_HEIGHT * (innerEnd - innerStart)) / 2 - BAR_THIN * 2}
          fill={colour || notesToColour([start, end])}
          opacity={0.5}
        />,
        <Bridge
          key={`${j}_innernext`}
          a={[
            BRIDGE + NOTE_DIST * 3,
            noteToY(innerStart) - BAR_THIN,
            noteToY(innerEnd) + BAR_THIN,
          ]}
          b={[
            BRIDGE * 2 + NOTE_DIST * 3,
            noteToY(innerStart + innerNext[0]!) - BAR_THIN,
            noteToY(innerEnd + innerNext[1]!) + BAR_THIN,
          ]}
          colour={colour || notesToColour([start, end])}
          opacity={0.5}
        />,
      ]
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
          mids={new Set(blocks.flatMap((b) => b.mids))}
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
