import { SVG } from "@svgdotjs/svg.js";

import { resolve } from "./maraca";

const onChanged = (prev, next, func) => {
  for (const key in { ...prev, ...next }) {
    if (next[key] !== prev) func(key, next[key]);
  }
  return next;
};

const updateChildren = (node, children) => {
  if (
    node.childNodes.length !== children.length ||
    [...node.childNodes].some((c, i) => children[i] !== c)
  ) {
    node.replaceChildren(...children);
  }
};

const directions = (v) => [
  v.values.top ?? v.items[0],
  v.values.right ?? v.items[3] ?? v.items[1] ?? v.items[0],
  v.values.bottom ?? v.items[2] ?? v.items[0],
  v.values.left ?? v.items[1] ?? v.items[0],
];

const borderDirections = (round) => {
  if (!round) return [0, 0, 0, 0];
  if (typeof round === "number") return [round, round, round, round];
  return [
    round.values.topLeft ??
      round.values.top ??
      round.values.left ??
      round.items[0],
    round.values.topRight ??
      round.values.top ??
      round.values.right ??
      round.items[3] ??
      round.items[1] ??
      round.items[0],
    round.values.bottomRight ??
      round.values.bottom ??
      round.values.right ??
      round.items[2] ??
      round.items[0],
    round.values.bottomLeft ??
      round.values.bottom ??
      round.values.left ??
      round.items[1] ??
      round.items[0],
  ];
};

const getContext = ($values, items, context) => {
  return {
    size: resolve($values.size) || context.size,
    line: resolve($values.line) || context.line,
    inline: context.inline
      ? "inline"
      : resolve($values.flow) === "inline" ||
        (items.length > 0 &&
          items.some(
            (x) =>
              typeof x === "number" ||
              typeof x === "string" ||
              resolve(x.values.input) !== undefined
          ))
      ? "wrap"
      : undefined,
  };
};

const getFlow = ($flow) => {
  const flow = resolve($flow, true);
  if (!flow || flow === "inline") return {};
  const items = flow ? (typeof flow === "object" ? flow.items : [flow]) : [];
  const values = flow.values || {};
  if (items.includes("grid")) {
    return {
      type: "grid",
      widths: items.filter((v) => typeof v === "number" || v === "auto"),
      gap: values.gap,
    };
  }
  return {
    type: "flow",
    direction: items.find((v) => ["column", "row"].includes(v)),
    gap: items.find((v) => typeof v === "number"),
    align: items.find((v) => ["start", "end", "center"].includes(v)),
  };
};

const getTag = ($values) => {
  if (resolve($values.image)) return "img";
  if (resolve($values.link)) return "a";
  if (resolve($values.input) !== undefined) return "input";
  return resolve($values.tag) || "div";
};

const getItems = (items, $values) => {
  if (resolve($values.flow) || resolve($values.fill)) {
    return items.map((x) =>
      typeof x === "number" || typeof x === "string"
        ? { __type: "block", values: {}, items: [x] }
        : x
    );
  }
  return items;
};

const getProps = ({ image, link, input }) => {
  const result = {} as any;
  if (image) result.src = image;
  if (link) result.href = link;
  if (input) result.value = input;
  return result;
};

const getSetters = ({ hover, click, input }) => {
  const result = {} as any;
  if (hover?.__type === "signal" && hover?.set) {
    result.onmouseover = () => hover.set(true);
    result.onmouseleave = () => hover.set(false);
  }
  if (click?.__type === "signal" && click?.set) {
    result.onclick = () => {
      click.set({});
      // setTimeout(() => click.set(false));
    };
  }
  if (input?.__type === "signal" && input?.set) {
    result.oninput = (e) => input.set(e.target.value);
  }
  return result;
};

const getStyle = (values, context, flow) => {
  const result = { ...(values.style?.values || {}) } as any;
  if (context.inline !== "wrap" && !flow.type) {
    result.display = "flex";
    result.flexDirection = "column";
  }
  if (context.inline === "inline") result.display = "inline";
  if (flow.type === "flow") {
    result.display = "flex";
    result.flexDirection = "column";
    result.gap = flow.gap && `${flow.gap}px`;
    result.flexDirection = flow.direction || "column";
    result.alignItems = ["start", "end"].includes(flow.align)
      ? `flex-${flow.align}`
      : flow.align || "stretch";
    result.justifyContent = flow.align === "center" ? "center" : null;
  }
  if (flow.type === "grid") {
    result.display = "grid";
    result.gridTemplateColumns = flow.widths
      .map((x) => (typeof x === "string" ? x : x <= 1 ? `${x}fr` : `${x}px`))
      .join(" ");
    result.gap = flow.gap && `${flow.gap}px`;
  }
  if (values.span) {
    if (typeof values.span === "number") {
      result.gridColumn = `span ${values.span}`;
    } else {
      const [column, row] = values.span.items;
      result.gridColumn = `span ${column}`;
      result.gridRow = `span ${row}`;
    }
  }
  if (values.font) result.fontFamily = values.font;
  if (context.size) result.fontSize = `${context.size}px`;
  if (context.line) result.lineHeight = context.line;
  if (values.bold !== undefined) {
    result.fontWeight = values.bold ? "bold" : "normal";
  }
  if (values.italic !== undefined) {
    result.fontStyle = values.italic ? "italic" : "normal";
  }
  if (values.underline) result.textDecoration = "underline";
  if (values.uppercase) result.textTransform = "uppercase";
  if (values.align) {
    if (values.align.includes("justify")) {
      result.textAlign = "justify";
      result.textAlignLast = values.align.slice(8);
    } else {
      result.textAlign = values.align;
    }
  }
  if (values.indent) result.textIndent = `${values.indent}px`;
  if (values.color) result.color = values.color;
  if (values.fill) result.background = values.fill;
  if (context.inline === "wrap") {
    const gap = ((context.line - 1) * context.size) / 2;
    result.marginTop = `${-gap}px`;
    result.marginBottom = `${-gap}px`;
  }
  if (values.pad) {
    result.padding =
      typeof values.pad === "number"
        ? `${values.pad}px`
        : directions(values.pad)
            .map((x) => (x && x < 1 ? `${x * 100}%` : `${x || 0}px`))
            .join(" ");
  }
  if (values.round) {
    result.borderRadius = borderDirections(values.round)
      .map((x) => `${x || 0}px`)
      .join(" ");
  }
  if (values.width) {
    result.width =
      typeof values.width === "string"
        ? values.width
        : values.width <= 1
        ? `${values.width * 100}%`
        : `${values.width}px`;
  }
  if (values.height) {
    result.height =
      values.height <= 1 ? `${values.height * 100}%` : `${values.height}px`;
  }
  if (values.maxWidth) {
    result.maxWidth =
      values.maxWidth <= 1
        ? `${values.maxWidth * 100}%`
        : `${values.maxWidth}px`;
    result.marginLeft = "auto";
    result.marginRight = "auto";
  }
  if (values.border) {
    if (typeof values.border === "number") {
      result.border = `${values.border}px solid black`;
    } else {
      result.borderWidth = directions(values.border)
        .map((x) => `${x || 0}px`)
        .join(" ");
      result.borderStyle =
        typeof (values.border.values.style || "solid") === "string"
          ? values.border.values.style || "solid"
          : directions(values.border.values.style).join(" ");
      result.borderColor =
        typeof (values.border.values.color || "black") === "string"
          ? values.border.values.color || "black"
          : directions(values.border.values.color).join(" ");
    }
  }
  if (values.link || values.pointer || values.click !== undefined) {
    result.cursor = "pointer";
    result.userSelect = "none";
  }
  return result;
};

const getSVGElement = (svg, { shape }, items) => {
  if (shape === "rect") {
    return svg
      .rect(items[1].items[0], items[1].items[1])
      .move(items[0].items[0], items[0].items[1]);
  }
  if (shape === "ellipse") {
    return svg
      .ellipse(items[1].items[0], items[1].items[1])
      .move(items[0].items[0], items[0].items[1]);
  }
  if (shape === "path") {
    return svg.path(items.map((x) => x.items.join(" ")).join(" "));
  }
};

const updateNode = (effect, node, data, prevContext) => {
  if (!data && data !== 0) return null;

  if (typeof data === "number" || typeof data === "string") {
    const text = `${data}`
      .normalize("NFD")
      .replace(/\u0323/g, "")
      .normalize("NFC");
    const next =
      node?.nodeName === "#text" ? node : document.createTextNode(text);
    next.textContent = text;
    return next;
  }

  if (resolve(data.values.svg)) {
    const svg = node?.nodeName === "svg" ? node : SVG().size(2000, 2000);
    const items = resolve(data.items, true);
    for (const x of items) {
      const e = getSVGElement(svg, x.values, x.items);
      const { radius, fill, stroke, opacity, rotate } = x.values;
      if (radius) {
        if (typeof radius === "number") e.radius(radius);
        e.radius(radius.items[0], radius.items[1]);
      }
      if (fill) {
        if (typeof fill !== "string" && fill.items.length > 0) {
          const g = svg.gradient("linear", (add) => {
            for (const stop of fill.items) {
              add.stop({
                offset: stop.items[0],
                color: stop.items[1],
                opacity: stop.items[2] ?? opacity ?? 1,
              });
            }
          });
          if (fill.values.dir === "y") g.from(0, 0).to(0, 1);
          e.fill(g);
        } else {
          e.fill({
            opacity,
            ...(typeof fill === "string" ? { color: fill } : fill.values),
          });
        }
      }
      if (stroke) {
        e.stroke({
          opacity,
          ...(typeof stroke === "string" ? { color: stroke } : stroke.values),
        });
      }
      if (rotate) {
        e.rotate(rotate);
      }
    }
    return svg.node;
  }

  const flow = getFlow(data.values.flow);
  const tag = getTag(data.values);
  const items = getItems(
    data.items.map((d) => resolve(d)),
    data.values
  );
  const context = getContext(data.values, items, prevContext);
  const next =
    node?.nodeName.toLowerCase() === tag ? node : document.createElement(tag);

  effect(() => {
    const values = resolve(data.values, true);
    next.__props = onChanged(
      next.__props || {},
      { ...getProps(values), ...getSetters(data.values) },
      (k, v) => {
        if (k === "focus") {
          if (v) setTimeout(() => next.focus());
        } else {
          next[k] = v === null || v === undefined ? null : v;
        }
      }
    );
    next.__style = onChanged(
      next.__style || {},
      getStyle(values, context, flow),
      (k, v) => {
        next.style[k] = v || null;
      }
    );
  });

  effect((effect) => {
    updateChildren(
      next,
      items
        .map((x, i) => updateNode(effect, next.childNodes[i], x, context))
        .filter((x) => x)
    );
  });

  return next;
};

export default (root) => (effect, data) => {
  updateChildren(root, [
    updateNode(
      effect,
      root.childNodes[0],
      resolve(resolve(data).values.index),
      { size: 16, line: 1.5 }
    ),
  ]);
};
