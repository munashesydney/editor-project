import { ShapeKind, ElementStyle } from "../types/canvas";

export interface ShapeDef {
  kind: ShapeKind;
  label: string;
  /** Default dimensions for new instances */
  defaultDims: { width: number; height: number };
  /** Default style properties */
  defaultStyle: Partial<ElementStyle>;
}

export const SHAPE_DEFINITIONS: Record<ShapeKind, ShapeDef> = {
  rectangle: {
    kind: "rectangle",
    label: "Rectangle",
    defaultDims: { width: 150, height: 150 },
    defaultStyle: {
      shapeKind: "rectangle",
      backgroundColor: "#3b82f6",
      borderRadius: 8,
      borderWidth: 0,
      borderColor: "transparent",
    },
  },
  circle: {
    kind: "circle",
    label: "Circle",
    defaultDims: { width: 120, height: 120 },
    defaultStyle: {
      shapeKind: "circle",
      backgroundColor: "#3b82f6",
      borderRadius: 50,
      borderWidth: 0,
      borderColor: "transparent",
    },
  },
  ellipse: {
    kind: "ellipse",
    label: "Ellipse",
    defaultDims: { width: 180, height: 100 },
    defaultStyle: {
      shapeKind: "ellipse",
      backgroundColor: "#3b82f6",
      borderRadius: 50,
      borderWidth: 0,
      borderColor: "transparent",
    },
  },
  triangle: {
    kind: "triangle",
    label: "Triangle",
    defaultDims: { width: 120, height: 104 },
    defaultStyle: {
      shapeKind: "triangle",
      backgroundColor: "#3b82f6",
      borderWidth: 0,
      borderColor: "transparent",
      points: [
        { x: 60, y: 0 },
        { x: 120, y: 104 },
        { x: 0, y: 104 },
      ],
    },
  },
  line: {
    kind: "line",
    label: "Line",
    defaultDims: { width: 150, height: 2 },
    defaultStyle: {
      shapeKind: "line",
      backgroundColor: "#3b82f6",
      borderWidth: 0,
      borderColor: "transparent",
    },
  },
  custom: {
    kind: "custom",
    label: "Custom SVG",
    defaultDims: { width: 150, height: 150 },
    defaultStyle: {
      shapeKind: "custom",
      backgroundColor: "#3b82f6",
      borderWidth: 0,
      borderColor: "transparent",
      pathData: "",
    },
  },
};

export const SHAPE_KIND_LIST = Object.values(SHAPE_DEFINITIONS);

/** Quick lookup by kind */
export function getShapeDef(kind: ShapeKind): ShapeDef {
  return SHAPE_DEFINITIONS[kind];
}

/** Basic SVG path validation — returns true if the string looks like a valid d-attribute */
export function isValidSvgPath(pathData: string): boolean {
  if (!pathData.trim()) return false;
  // Must start with a valid SVG path command character
  return /^\s*[MmLlHhVvCcSsQqTtAaZz]/.test(pathData.trim());
}

/** Build inline styles for a shape element */
export function buildShapeStyleInline(
  style: ElementStyle,
): Record<string, string | number | undefined> {
  return {
    backgroundColor: style.backgroundColor,
    borderRadius:
      style.borderRadius != null ? `${style.borderRadius}%` : undefined,
    borderWidth: style.borderWidth,
    borderColor: style.borderColor,
    borderStyle: (style.borderWidth ?? 0) > 0 ? "solid" : undefined,
  };
}

/** Build SVG-style points string from point array (for polygon) */
export function pointsToString(points: { x: number; y: number }[]): string {
  return points.map((p) => `${p.x},${p.y}`).join(" ");
}

/**
 * Extract a bounding-box viewBox from raw SVG path data.
 * Parses the d-attribute command-by-command so that single-coordinate
 * commands (H, V, h, v), relative commands (c, s, q…), arc commands (A, a),
 * and close-path (z) are all handled correctly.
 */
export function computePathViewBox(pathData: string): {
  viewBox: string;
  dx: number;
  dy: number;
} {
  const tokens = tokenizePath(pathData);
  if (tokens.length === 0) return { viewBox: "0 0 100 100", dx: 0, dy: 0 };

  let cx = 0,
    cy = 0; // current pen position
  let subStartX = 0,
    subStartY = 0;
  let minX = Infinity,
    minY = Infinity,
    maxX = -Infinity,
    maxY = -Infinity;

  const visit = (x: number, y: number) => {
    minX = Math.min(minX, x);
    minY = Math.min(minY, y);
    maxX = Math.max(maxX, x);
    maxY = Math.max(maxY, y);
  };

  let i = 0;
  while (i < tokens.length) {
    const cmd = tokens[i++];
    const abs = cmd === cmd.toUpperCase();

    const next = (n = 1): number => {
      const v = parseFloat(tokens[i]);
      i += n;
      return isNaN(v) ? 0 : v;
    };

    const rel = (dx: number, dy: number) =>
      abs ? [dx, dy] : [cx + dx, cy + dy];

    switch (cmd) {
      case "M":
      case "m": {
        const x = next();
        const y = next();
        const [ax, ay] = rel(x, y);
        cx = ax;
        cy = ay;
        subStartX = ax;
        subStartY = ay;
        visit(ax, ay);
        // Implicit L commands for subsequent pairs
        while (i < tokens.length && !isNaN(parseFloat(tokens[i]))) {
          const lx = next();
          const ly = next();
          const [alx, aly] = rel(lx, ly);
          cx = alx;
          cy = aly;
          visit(alx, aly);
        }
        break;
      }
      case "L":
      case "l": {
        while (i < tokens.length && !isNaN(parseFloat(tokens[i]))) {
          const x = next();
          const y = next();
          const [ax, ay] = rel(x, y);
          cx = ax;
          cy = ay;
          visit(ax, ay);
        }
        break;
      }
      case "H":
      case "h": {
        const x = next();
        cx = abs ? x : cx + x;
        visit(cx, cy);
        break;
      }
      case "V":
      case "v": {
        const y = next();
        cy = abs ? y : cy + y;
        visit(cx, cy);
        break;
      }
      case "C":
      case "c": {
        while (i < tokens.length && !isNaN(parseFloat(tokens[i]))) {
          const x1 = next(),
            y1 = next();
          const x2 = next(),
            y2 = next();
          const x = next(),
            y = next();
          const [ax, ay] = rel(x, y);
          // Include control points for accurate bezier bounding
          const [ax1, ay1] = rel(x1, y1);
          const [ax2, ay2] = rel(x2, y2);
          visit(ax1, ay1);
          visit(ax2, ay2);
          cx = ax;
          cy = ay;
          visit(ax, ay);
        }
        break;
      }
      case "S":
      case "s": {
        while (i < tokens.length && !isNaN(parseFloat(tokens[i]))) {
          const x2 = next(),
            y2 = next();
          const x = next(),
            y = next();
          const [ax2, ay2] = rel(x2, y2);
          const [ax, ay] = rel(x, y);
          visit(ax2, ay2);
          cx = ax;
          cy = ay;
          visit(ax, ay);
        }
        break;
      }
      case "Q":
      case "q": {
        while (i < tokens.length && !isNaN(parseFloat(tokens[i]))) {
          const x1 = next(),
            y1 = next();
          const x = next(),
            y = next();
          const [ax1, ay1] = rel(x1, y1);
          const [ax, ay] = rel(x, y);
          visit(ax1, ay1);
          cx = ax;
          cy = ay;
          visit(ax, ay);
        }
        break;
      }
      case "T":
      case "t": {
        while (i < tokens.length && !isNaN(parseFloat(tokens[i]))) {
          const x = next(),
            y = next();
          const [ax, ay] = rel(x, y);
          cx = ax;
          cy = ay;
          visit(ax, ay);
        }
        break;
      }
      case "A":
      case "a": {
        while (i < tokens.length && !isNaN(parseFloat(tokens[i]))) {
          next();
          next(); // rx, ry
          next(); // x-axis-rotation
          next(); // large-arc-flag
          next(); // sweep-flag
          const x = next(),
            y = next();
          const [ax, ay] = rel(x, y);
          cx = ax;
          cy = ay;
          visit(ax, ay);
        }
        break;
      }
      case "Z":
      case "z": {
        cx = subStartX;
        cy = subStartY;
        break;
      }
      default:
        // Unknown command — skip
        break;
    }
  }

  const w = maxX - minX || 1;
  const h = maxY - minY || 1;
  return { viewBox: `0 0 ${w} ${h}`, dx: -minX, dy: -minY };
}

/** Split a path d-attribute into tokens: command letters and number strings */
function tokenizePath(d: string): string[] {
  const tokens: string[] = [];
  const re = /([MmLlHhVvCcSsQqTtAaZz])|([-+]?\d*\.?\d+(?:[eE][-+]?\d+)?)/g;
  let m: RegExpExecArray | null;
  while ((m = re.exec(d)) !== null) {
    if (m[1])
      tokens.push(m[1]); // command letter
    else if (m[2]) tokens.push(m[2]); // number
  }
  return tokens;
}
