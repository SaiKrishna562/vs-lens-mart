"use client";

/* Virtual try-on picture for one frame (Requirements_TryOn.md 6), on the
   frame's edit page. Staff choose a front-view photo; this page turns the
   white background see-through, trims the arm tips, crops to the frame and
   marks the lens centres, all in the browser (from the developer's
   prototype). Only the finished PNG is uploaded; the server checks it again. */
import { useEffect, useMemo, useRef, useState, type RefObject } from "react";
import { saveTryon, type TryonResult } from "@/app/admin/(staff)/frames/tryon-actions";

export type TryonValue = { enabled: boolean; path: string | null; lensLeft: number; lensRight: number; lensY: number };

const MAX_SIDE = 1600; // source photos are scaled down to this first
const MAX_OUT = 1200; // the saved picture's widest side

type Source = { canvas: HTMLCanvasElement; transparent: boolean };

const SOLID = 24; // alpha above this counts as part of the frame

/** Shadows: pale grey, colourless pixels fade out, then any piece not joined
    to the frame (a shadow line under a lens, specks) is dropped. A very shiny
    frame can lose highlights, which is why staff can switch this off. */
function removeShadows(px: Uint8ClampedArray, w: number, h: number) {
  for (let i = 0; i < px.length; i += 4) {
    if (!px[i + 3]) continue;
    const mx = Math.max(px[i], px[i + 1], px[i + 2]), mn = Math.min(px[i], px[i + 1], px[i + 2]);
    if (mx - mn < 24 && mn > 150) px[i + 3] = Math.round(px[i + 3] * Math.max(0, Math.min(1, (185 - mn) / 35)));
  }
  // Pieces of the picture (8 neighbours), keeping those at least 8% the size of the largest
  const label = new Int32Array(w * h).fill(-1);
  const sizes: number[] = [];
  const stack: number[] = [];
  for (let start = 0; start < w * h; start++) {
    if (label[start] >= 0 || px[start * 4 + 3] <= SOLID) continue;
    const id = sizes.length;
    let n = 0;
    label[start] = id; stack.push(start);
    while (stack.length) {
      const p = stack.pop()!; n++;
      const x = p % w, y = (p - x) / w;
      for (let dy = -1; dy <= 1; dy++) for (let dx = -1; dx <= 1; dx++) {
        const nx = x + dx, ny = y + dy;
        if (nx < 0 || ny < 0 || nx >= w || ny >= h) continue;
        const q = ny * w + nx;
        if (label[q] < 0 && px[q * 4 + 3] > SOLID) { label[q] = id; stack.push(q); }
      }
    }
    sizes.push(n);
  }
  if (!sizes.length) return;
  const keep = Math.max(...sizes) * 0.08;
  for (let p = 0; p < w * h; p++) {
    if (label[p] >= 0 ? sizes[label[p]] < keep : px[p * 4 + 3] > 0 && px[p * 4 + 3] <= SOLID) px[p * 4 + 3] = 0;
  }
}

/** Arms seen through clear lenses: in each half, the see-through area the rim
    encloses (not joined to the outside) marks the lens; anything inside the
    outline around it, shrunk a little to keep the rim, is cleared. Dark
    sunglass lenses hide the arms already, so nothing changes there. */
function removeArms(px: Uint8ClampedArray, w: number, h: number) {
  const clear = (p: number) => px[p * 4 + 3] <= SOLID;
  // Background joined to the picture's edges
  const outside = new Uint8Array(w * h);
  const stack: number[] = [];
  const seed = (p: number) => { if (!outside[p] && clear(p)) { outside[p] = 1; stack.push(p); } };
  for (let x = 0; x < w; x++) { seed(x); seed((h - 1) * w + x); }
  for (let y = 0; y < h; y++) { seed(y * w); seed(y * w + w - 1); }
  while (stack.length) {
    const p = stack.pop()!;
    const x = p % w;
    if (x > 0) seed(p - 1);
    if (x < w - 1) seed(p + 1);
    if (p >= w) seed(p - w);
    if (p < w * (h - 1)) seed(p + w);
  }
  let x0 = w, x1 = -1;
  for (let p = 0; p < w * h; p++) if (!clear(p)) { const x = p % w; if (x < x0) x0 = x; if (x > x1) x1 = x; }
  if (x1 < 0) return;
  const mid = Math.round((x0 + x1) / 2);
  for (const [from, to] of [[x0, mid], [mid, x1 + 1]] as const) {
    // The enclosed see-through pieces in this half (4 neighbours). The arm splits a lens
    // opening into pieces; a strip shut in by a shadow under the rim is a piece too, so
    // only the largest piece and the pieces inside its area count as the lens.
    const piece = new Int32Array(w * h).fill(-1);
    const found: { n: number; minX: number; maxX: number; minY: number; maxY: number; sx: number; sy: number }[] = [];
    for (let y = 0; y < h; y++) for (let x = from; x < to; x++) {
      const start = y * w + x;
      if (piece[start] >= 0 || !clear(start) || outside[start]) continue;
      const id = found.length;
      const f = { n: 0, minX: x, maxX: x, minY: y, maxY: y, sx: 0, sy: 0 };
      piece[start] = id; stack.push(start);
      while (stack.length) {
        const p = stack.pop()!;
        const px0 = p % w, py0 = (p - px0) / w;
        f.n++; f.sx += px0; f.sy += py0;
        if (px0 < f.minX) f.minX = px0; if (px0 > f.maxX) f.maxX = px0; if (py0 < f.minY) f.minY = py0; if (py0 > f.maxY) f.maxY = py0;
        for (const q of [px0 > from ? p - 1 : -1, px0 < to - 1 ? p + 1 : -1, py0 > 0 ? p - w : -1, py0 < h - 1 ? p + w : -1]) {
          if (q >= 0 && piece[q] < 0 && clear(q) && !outside[q]) { piece[q] = id; stack.push(q); }
        }
      }
      found.push(f);
    }
    if (!found.length) continue;
    const lens = found.reduce((a, b) => (b.n > a.n ? b : a));
    if (lens.n < (to - from) * h * 0.005) continue; // no lens opening (dark lenses, rimless)
    // A piece counts as lens only if nearly all of it (90%) lies within the main opening's
    // area: the pieces an arm cuts off do; the gap under a double bridge and a strip shut
    // in by a shadow stick out, so they don't (or the bridge and rims would be cleared)
    const within = new Array<number>(found.length).fill(0);
    for (let y = lens.minY; y <= lens.maxY; y++) for (let x = Math.max(from, lens.minX); x <= Math.min(to - 1, lens.maxX); x++) {
      const id = piece[y * w + x];
      if (id >= 0) within[id]++;
    }
    const keep = found.map((f, id) => f === lens || (f.n > 20 && within[id] >= f.n * 0.9));
    // The lens pieces' left- and right-most points in each row
    const pts: [number, number][] = [];
    for (let y = lens.minY; y <= lens.maxY; y++) {
      let a = -1, b = -1;
      for (let x = from; x < to; x++) {
        const id = piece[y * w + x];
        if (id >= 0 && keep[id]) { if (a < 0) a = x; b = x; }
      }
      if (a >= 0) pts.push([a, y], [b, y]);
    }
    const hull = convexHull(pts);
    if (hull.length < 3) continue;
    // Shrink it towards its middle by about 4 px, so the rim's inner edge stays
    const cx = hull.reduce((s, p) => s + p[0], 0) / hull.length, cy = hull.reduce((s, p) => s + p[1], 0) / hull.length;
    const r = hull.reduce((s, p) => s + Math.hypot(p[0] - cx, p[1] - cy), 0) / hull.length;
    const k = Math.max(0, 1 - 4 / r);
    const poly = hull.map(([x, y]) => [cx + (x - cx) * k, cy + (y - cy) * k] as [number, number]);
    const ys = poly.map((p) => p[1]), xs = poly.map((p) => p[0]);
    for (let y = Math.floor(Math.min(...ys)); y <= Math.ceil(Math.max(...ys)); y++) {
      for (let x = Math.floor(Math.min(...xs)); x <= Math.ceil(Math.max(...xs)); x++) {
        if (x < 0 || y < 0 || x >= w || y >= h) continue;
        if (!clear(y * w + x) && inside(poly, x, y)) px[(y * w + x) * 4 + 3] = 0;
      }
    }
  }
}

/** Convex hull (monotone chain), anticlockwise. */
function convexHull(points: [number, number][]): [number, number][] {
  const p = [...points].sort((a, b) => a[0] - b[0] || a[1] - b[1]);
  if (p.length < 3) return p;
  const cross = (o: number[], a: number[], b: number[]) => (a[0] - o[0]) * (b[1] - o[1]) - (a[1] - o[1]) * (b[0] - o[0]);
  const lower: [number, number][] = [];
  for (const q of p) { while (lower.length >= 2 && cross(lower[lower.length - 2], lower[lower.length - 1], q) <= 0) lower.pop(); lower.push(q); }
  const upper: [number, number][] = [];
  for (const q of p.reverse()) { while (upper.length >= 2 && cross(upper[upper.length - 2], upper[upper.length - 1], q) <= 0) upper.pop(); upper.push(q); }
  return lower.slice(0, -1).concat(upper.slice(0, -1));
}

function inside(poly: [number, number][], x: number, y: number) {
  for (let i = 0; i < poly.length; i++) {
    const [ax, ay] = poly[i], [bx, by] = poly[(i + 1) % poly.length];
    if ((bx - ax) * (y - ay) - (by - ay) * (x - ax) < 0) return false;
  }
  return true;
}

export type CleanOptions = { strength: number; trimLeft: number; trimRight: number; arms: boolean; shadows: boolean };
/** A new photo starts with both clean-ups on: staff switch one off if their photo doesn't need it. */
const START: CleanOptions = { strength: 236, trimLeft: 0, trimRight: 0, arms: true, shadows: true };

/** The see-through, trimmed and cropped picture from a source photo. */
function clean(src: Source, { strength, trimLeft, trimRight, arms, shadows }: CleanOptions): HTMLCanvasElement | null {
  const { width: w, height: h } = src.canvas;
  const work = document.createElement("canvas");
  work.width = w; work.height = h;
  const g = work.getContext("2d", { willReadFrequently: true })!;
  g.drawImage(src.canvas, 0, 0);
  const data = g.getImageData(0, 0, w, h);
  const px = data.data;
  if (!src.transparent) {
    // White and near-white become see-through, with a soft edge so the frame isn't jagged
    const soft = 30;
    for (let i = 0; i < px.length; i += 4) {
      const m = Math.min(px[i], px[i + 1], px[i + 2]);
      if (m >= strength) px[i + 3] = 0;
      else if (m > strength - soft) px[i + 3] = Math.round((255 * (strength - m)) / soft);
    }
  }
  if (shadows) removeShadows(px, w, h);
  if (arms) removeArms(px, w, h);
  // The frame's bounding box
  let x0 = w, y0 = h, x1 = -1, y1 = -1;
  for (let y = 0; y < h; y++) for (let x = 0; x < w; x++) {
    if (px[(y * w + x) * 4 + 3] > 24) { if (x < x0) x0 = x; if (x > x1) x1 = x; if (y < y0) y0 = y; if (y > y1) y1 = y; }
  }
  if (x1 < 0) return null;
  // Trim the arm tips: a share of the frame's width off each side
  const bw = x1 - x0 + 1;
  x0 += Math.round((bw * trimLeft) / 100);
  x1 -= Math.round((bw * trimRight) / 100);
  if (x1 <= x0) return null;
  g.putImageData(data, 0, 0);
  // Re-find the top and bottom inside the trimmed columns
  let top = h, bottom = -1;
  for (let y = 0; y < h; y++) for (let x = x0; x <= x1; x++) {
    if (px[(y * w + x) * 4 + 3] > 24) { if (y < top) top = y; if (y > bottom) bottom = y; break; }
  }
  if (bottom < 0) return null;
  const cw = x1 - x0 + 1, ch = bottom - top + 1;
  const k = Math.min(1, MAX_OUT / Math.max(cw, ch));
  const out = document.createElement("canvas");
  out.width = Math.round(cw * k); out.height = Math.round(ch * k);
  out.getContext("2d")!.drawImage(work, x0, top, cw, ch, 0, 0, out.width, out.height);
  return out;
}

/** Where the lenses are: in each half of the picture, the middle of the
    see-through area that has frame on both sides in its row (inside a rim).
    Falls back to the usual positions when a half has no closed rim. */
function findLenses(pic: HTMLCanvasElement): { left: number; right: number; y: number } {
  const { width: w, height: h } = pic;
  const px = pic.getContext("2d", { willReadFrequently: true })!.getImageData(0, 0, w, h).data;
  const solid = (x: number, y: number) => px[(y * w + x) * 4 + 3] > 128;
  const half = (from: number, to: number) => {
    let sx = 0, sy = 0, n = 0;
    for (let y = 0; y < h; y += 2) {
      let first = -1, last = -1;
      for (let x = from; x < to; x++) if (solid(x, y)) { if (first < 0) first = x; last = x; }
      if (first < 0 || last - first < (to - from) * 0.3) continue; // no rim across this row
      for (let x = first + 1; x < last; x++) if (!solid(x, y)) { sx += x; sy += y; n++; }
    }
    // Real lens openings are big; the small gaps around a top bar or the arms of solid sunglasses aren't
    return n > ((to - from) * h) / 2 * 0.05 ? { x: sx / n / w, y: sy / n / h } : null;
  };
  // Solid lenses (sunglasses) have no see-through opening: use the middle of the solid area instead
  const mass = (from: number, to: number) => {
    let sx = 0, sy = 0, n = 0;
    for (let y = 0; y < h; y += 2) for (let x = from; x < to; x += 2) if (solid(x, y)) { sx += x; sy += y; n++; }
    return n > 50 ? { x: sx / n / w, y: sy / n / h } : null;
  };
  const l = half(0, Math.floor(w / 2)) ?? mass(0, Math.floor(w / 2));
  const r = half(Math.ceil(w / 2), w) ?? mass(Math.ceil(w / 2), w);
  if (!l || !r) return { left: 0.27, right: 0.73, y: 0.48 };
  const clamp = (v: number, lo: number, hi: number) => Math.min(hi, Math.max(lo, v));
  return { left: clamp(l.x, 0.05, 0.49), right: clamp(r.x, 0.51, 0.95), y: clamp((l.y + r.y) / 2, 0.1, 0.9) };
}

/* ---------- Lens types (sunglasses) and the eraser ---------- */

export type LensKind = "clear" | "tinted" | "mirror";
type Stroke = { r: number; pts: { x: number; y: number }[] }; // fractions of the picture's width / height

/** One lens, grown from its gold dot: the pixels of similar colour around it,
    then everything inside their outline (so arm ends, logos and nose pads seen
    through a dark lens become lens too). Null when the dot isn't on a solid lens. */
function lensArea(px: Uint8ClampedArray, w: number, h: number, sx: number, sy: number) {
  const at = (x: number, y: number) => (y * w + x) * 4;
  if (sx < 0 || sy < 0 || sx >= w || sy >= h || px[at(sx, sy) + 3] < 128) return null;
  const seed = [px[at(sx, sy)], px[at(sx, sy) + 1], px[at(sx, sy) + 2]];
  const dist = (i: number, c: number[]) => Math.hypot(px[i] - c[0], px[i + 1] - c[1], px[i + 2] - c[2]);
  const grown = new Uint8Array(w * h);
  const stack = [sy * w + sx];
  grown[sy * w + sx] = 1;
  let n = 0;
  while (stack.length) {
    const p = stack.pop()!;
    n++;
    const x = p % w, y = (p - x) / w, here = [px[p * 4], px[p * 4 + 1], px[p * 4 + 2]];
    for (const q of [x > 0 ? p - 1 : -1, x < w - 1 ? p + 1 : -1, y > 0 ? p - w : -1, y < h - 1 ? p + w : -1]) {
      if (q < 0 || grown[q]) continue;
      const i = q * 4;
      // Similar to its neighbour (lenses shade gradually) and not too far from the dot's colour (stops at the rim)
      if (px[i + 3] >= 128 && dist(i, here) < 28 && dist(i, seed) < 95) { grown[q] = 1; stack.push(q); }
    }
  }
  if (n < 200) return null;
  const pts: [number, number][] = [];
  for (let y = 0; y < h; y++) {
    let a = -1, b = -1;
    for (let x = 0; x < w; x++) if (grown[y * w + x]) { if (a < 0) a = x; b = x; }
    if (a >= 0) pts.push([a, y], [b, y]);
  }
  const hull = convexHull(pts);
  if (hull.length < 3) return null;
  // Each row's average lens colour, so a gradient lens keeps its gradient
  const ys = hull.map((q) => q[1]), top = Math.min(...ys), bottom = Math.max(...ys);
  const rows: (number[] | null)[] = [];
  for (let y = top; y <= bottom; y++) {
    let r = 0, g = 0, b = 0, k = 0;
    for (let x = 0; x < w; x++) if (grown[y * w + x]) { const i = at(x, y); r += px[i]; g += px[i + 1]; b += px[i + 2]; k++; }
    rows.push(k ? [r / k, g / k, b / k] : null);
  }
  for (let i = 0; i < rows.length; i++) if (!rows[i]) rows[i] = rows.slice(0, i).reverse().find(Boolean) ?? rows.slice(i).find(Boolean) ?? seed;
  return { hull, top, bottom, rows: rows as number[][] };
}

/** The picture with tinted or mirrored lenses and the erased strokes. Clear
    lenses are left as the clean-up made them (see-through). */
function finishPicture(pic: HTMLCanvasElement, centres: { left: number; right: number; y: number }, kind: LensKind, darkness: number, strokes: Stroke[]) {
  const out = document.createElement("canvas");
  out.width = pic.width; out.height = pic.height;
  const g = out.getContext("2d", { willReadFrequently: true })!;
  g.drawImage(pic, 0, 0);
  let lensFound = true;
  if (kind !== "clear") {
    const { width: w, height: h } = out;
    const data = g.getImageData(0, 0, w, h);
    const px = data.data;
    for (const cx of [centres.left, centres.right]) {
      const area = lensArea(px, w, h, Math.round(cx * w), Math.round(centres.y * h));
      if (!area) { lensFound = false; continue; }
      const xs = area.hull.map((q) => q[0]), left = Math.min(...xs), right = Math.max(...xs);
      for (let y = area.top; y <= area.bottom; y++) for (let x = left; x <= right; x++) {
        if (!inside(area.hull, x, y)) continue;
        const i = (y * w + x) * 4;
        let [r, gg, b] = area.rows[y - area.top];
        if (kind === "tinted") {
          // See-through in the lens's own colour: the eyes show, in the same shade
          px[i] = r; px[i + 1] = gg; px[i + 2] = b; px[i + 3] = Math.round((darkness / 100) * 255);
        } else {
          // Mirrored / opaque: a soft reflection of sky, horizon and ground, and one light streak
          const t = (y - area.top) / Math.max(1, area.bottom - area.top), u = (x - left) / Math.max(1, right - left);
          const mix = (c: number, to: number, k: number) => c + (to - c) * k;
          if (t < 0.48) { const k = 0.42 * (1 - t / 0.48) + 0.06; r = mix(r, 255, k); gg = mix(gg, 255, k); b = mix(b, 255, k); }
          else { const k = 0.22 * ((t - 0.48) / 0.52); r = mix(r, 0, k); gg = mix(gg, 0, k); b = mix(b, 0, k); }
          const d = u + t * 0.55;
          if (d > 0.18 && d < 0.3) { const k = 0.22 * (1 - Math.abs(d - 0.24) / 0.06); r = mix(r, 255, k); gg = mix(gg, 255, k); b = mix(b, 255, k); }
          px[i] = r; px[i + 1] = gg; px[i + 2] = b; px[i + 3] = 255;
        }
      }
    }
    g.putImageData(data, 0, 0);
  }
  // The eraser: painted strokes become see-through
  if (strokes.length) {
    g.globalCompositeOperation = "destination-out";
    g.lineCap = "round"; g.lineJoin = "round";
    for (const s of strokes) {
      g.lineWidth = s.r * 2 * out.width;
      g.beginPath();
      s.pts.forEach((q, i) => (i ? g.lineTo(q.x * out.width, q.y * out.height) : g.moveTo(q.x * out.width, q.y * out.height)));
      if (s.pts.length === 1) g.lineTo(s.pts[0].x * out.width + 0.01, s.pts[0].y * out.height);
      g.stroke();
    }
    g.globalCompositeOperation = "source-over";
  }
  return { canvas: out, lensFound };
}

async function loadSource(file: File): Promise<Source> {
  const bitmap = await createImageBitmap(file);
  const k = Math.min(1, MAX_SIDE / Math.max(bitmap.width, bitmap.height));
  const canvas = document.createElement("canvas");
  canvas.width = Math.round(bitmap.width * k); canvas.height = Math.round(bitmap.height * k);
  const g = canvas.getContext("2d", { willReadFrequently: true })!;
  g.drawImage(bitmap, 0, 0, canvas.width, canvas.height);
  bitmap.close();
  // A photo that already has see-through parts is kept as it is
  const px = g.getImageData(0, 0, canvas.width, canvas.height).data;
  let transparent = false;
  for (let i = 3; i < px.length; i += 4 * 97) if (px[i] < 240) { transparent = true; break; }
  return { canvas, transparent };
}

/** Saves a chosen picture for a frame once it exists; null when no picture was chosen (try-on is optional). */
export type TryonSaver = (frameId: string) => Promise<TryonResult | null>;
export const NO_TRYON: TryonValue = { enabled: false, path: null, lensLeft: 0.27, lensRight: 0.73, lensY: 0.48 };

/** On a frame's edit page (`frameId` set) it has its own Save. On the Add frame
    page (`frameId` null) the frame form saves it right after the new frame,
    through `saverRef`. */
export function TryonEditor({ frameId, initial, siteOn, noun, saverRef }: {
  frameId: string | null; initial: TryonValue; siteOn: boolean; noun: string; saverRef?: RefObject<TryonSaver | null>;
}) {
  const [saved, setSaved] = useState(initial);
  const [enabled, setEnabled] = useState(initial.enabled);
  const [lens, setLens] = useState({ left: initial.lensLeft, right: initial.lensRight, y: initial.lensY });
  const [source, setSource] = useState<Source | null>(null);
  const [opts, setOpts] = useState<CleanOptions>(START);
  const [loaded, setLoaded] = useState<{ path: string; img: HTMLImageElement } | null>(null);
  const [note, setNote] = useState("");
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);
  // Lens type: sunglasses start tinted (see-through in their own colour), frames clear
  const [lensKind, setLensKind] = useState<LensKind>(/sunglasses/.test(noun) ? "tinted" : "clear");
  const [darkness, setDarkness] = useState(60);
  const [erasing, setErasing] = useState(false);
  const [brush, setBrush] = useState(2.5); // % of the picture's width
  const [strokes, setStrokes] = useState<Stroke[]>([]);
  const pick = useRef<HTMLInputElement>(null);
  const view = useRef<HTMLCanvasElement>(null);

  // The saved picture, for the preview when no new photo is chosen
  useEffect(() => {
    if (!saved.path) return;
    const path = saved.path;
    const img = new Image();
    img.onload = () => setLoaded({ path, img });
    img.src = `/media/${path}`;
  }, [saved.path]);
  const existing = loaded && loaded.path === saved.path ? loaded.img : null;

  // The new photo, cleaned again whenever a slider moves
  const cleaned = useMemo(() => (source ? clean(source, opts) : null), [source, opts]);
  // ...then the lens type and anything erased
  const finished = useMemo(() => (cleaned ? finishPicture(cleaned, lens, lensKind, darkness, strokes) : null), [cleaned, lens, lensKind, darkness, strokes]);
  const picture = finished?.canvas ?? null;
  const lensMissing = finished && !finished.lensFound
    ? "A gold dot isn't on a lens. Move the dots onto the lenses, or choose Clear for clear lenses." : "";
  const notFound = source && !picture ? `No ${noun} found in this photo. Try a lower Background removal, or a photo on a plainer background.` : "";

  // Draw the preview: the picture on a chequered background, with the lens centres marked
  const shown: CanvasImageSource | null = picture ?? existing;
  useEffect(() => {
    const c = view.current;
    if (!c) return;
    const g = c.getContext("2d")!;
    const w = picture?.width ?? existing?.naturalWidth ?? 0;
    const h = picture?.height ?? existing?.naturalHeight ?? 0;
    if (!shown || !w) { c.width = 0; c.height = 0; return; }
    c.width = w; c.height = h;
    const sq = Math.max(8, Math.round(w / 60));
    for (let y = 0; y < h; y += sq) for (let x = 0; x < w; x += sq) {
      g.fillStyle = ((x / sq + y / sq) % 2) ? "#FFFFFF" : "#FAF6EE";
      g.fillRect(x, y, sq, sq);
    }
    g.drawImage(shown, 0, 0, w, h);
    const r = Math.max(6, w / 70);
    g.strokeStyle = "#1e3a5f"; g.lineWidth = Math.max(2, w / 400); g.setLineDash([r, r * 0.7]);
    g.beginPath(); g.moveTo(0, lens.y * h); g.lineTo(w, lens.y * h); g.stroke();
    g.setLineDash([]);
    for (const x of [lens.left, lens.right]) {
      g.fillStyle = "#f5c842"; g.beginPath(); g.arc(x * w, lens.y * h, r, 0, Math.PI * 2); g.fill();
      g.strokeStyle = "#0d1b2a"; g.stroke();
    }
  }, [shown, picture, existing, lens]);

  /** Loads the saved picture back in, so the clean-up switches and trims can be applied to it. */
  function reclean() {
    if (!existing) return;
    setNote(""); setError("");
    const canvas = document.createElement("canvas");
    canvas.width = existing.naturalWidth; canvas.height = existing.naturalHeight;
    canvas.getContext("2d", { willReadFrequently: true })!.drawImage(existing, 0, 0);
    const src = { canvas, transparent: true };
    setSource(src);
    setOpts(START);
    setStrokes([]);
    const out = clean(src, START);
    if (out) setLens(findLenses(out));
  }

  async function choose(file: File | undefined) {
    setNote(""); setError("");
    if (!file) return;
    try {
      const src = await loadSource(file);
      if (!saved.path) setEnabled(true); // a first picture: they want try-on
      setSource(src);
      setOpts(START);
      setStrokes([]);
      const out = clean(src, START);
      setLens(out ? findLenses(out) : { left: 0.27, right: 0.73, y: 0.48 });
    } catch {
      setError("That photo couldn't be opened. Use a JPG, PNG or WebP photo.");
    }
  }

  /** Sends the settings (and the cleaned picture, if a new photo was chosen) for one frame. */
  async function send(id: string, remove: boolean): Promise<TryonResult> {
    const fd = new FormData();
    fd.set("frameId", id);
    fd.set("enabled", String(enabled && !remove));
    fd.set("lensLeft", String(lens.left)); fd.set("lensRight", String(lens.right)); fd.set("lensY", String(lens.y));
    fd.set("remove", String(remove));
    if (picture && !remove) {
      const blob = await new Promise<Blob | null>((ok) => picture.toBlob(ok, "image/png"));
      if (blob) fd.set("picture", blob, "tryon.png");
    }
    return saveTryon(fd);
  }

  // Add frame page: the frame form calls this after the new frame is saved
  useEffect(() => {
    if (!saverRef) return;
    saverRef.current = async (id) => (picture && !notFound && !lensMissing ? send(id, false) : null);
  });

  async function save(remove = false) {
    if (!frameId) return;
    setBusy(true); setNote(""); setError("");
    const r = await send(frameId, remove);
    setBusy(false);
    if (!r.ok) { setError(r.error); return; }
    setSaved({ enabled: r.enabled, path: r.path, lensLeft: lens.left, lensRight: lens.right, lensY: lens.y });
    setEnabled(r.enabled);
    setSource(null); setStrokes([]); setErasing(false);
    setNote(remove ? "Try-on picture removed." : r.enabled ? "Saved. Try-on is on for this frame." : "Saved. Try-on is off for this frame.");
  }

  /** Eraser: a press starts a stroke, moving adds to it (positions as fractions of the picture). */
  // Listened for on the whole preview area, not just the canvas: the canvas's rounded
  // corners don't take presses, and leftover arms are often right in those corners
  const paint = (e: React.PointerEvent<HTMLDivElement>, start: boolean) => {
    const c = view.current;
    if (!c || !erasing || !source || (!start && e.buttons !== 1)) return;
    const box = c.getBoundingClientRect();
    const clamp = (v: number) => Math.min(1, Math.max(0, v));
    const q = { x: clamp((e.clientX - box.left) / box.width), y: clamp((e.clientY - box.top) / box.height) };
    if (start) {
      setStrokes((all) => [...all, { r: brush / 200, pts: [q] }]);
      try { e.currentTarget.setPointerCapture(e.pointerId); } catch { /* keeps working without capture */ }
    }
    else setStrokes((all) => all.length ? [...all.slice(0, -1), { ...all[all.length - 1], pts: [...all[all.length - 1].pts, q] }] : all);
  };

  const hasPicture = !!(picture || saved.path);
  const pct = (v: number) => `${Math.round(v * 100)}%`;
  /** A clean-up slider moved: clean again and find the lenses in the new picture. */
  const tune = (next: typeof opts) => {
    setOpts(next);
    setStrokes([]); // the picture's shape may change, so earlier erasing no longer lines up
    const out = source && clean(source, next);
    if (out) setLens(findLenses(out));
  };
  return (
    <section className="fsec tryon-edit" aria-labelledby="sec-tryon">
      <h2 className="fsec__title" id="sec-tryon">Try-on picture</h2>
      {!siteOn && <p className="ffield__hint tryon-edit__off">Try-on is not switched on for the website yet. You can prepare frames now; customers see them once it is.</p>}
      <p className="photo-tip">One photo of the {noun} straight from the front, on plain white paper, lenses without reflections, nothing else in the photo. The white background is removed here; only the cleaned picture is saved.</p>

      <div className="tryon-edit__grid">
        <div className={`tryon-edit__preview${erasing && source ? " is-erasing" : ""}`}
          onPointerDown={(e) => paint(e, true)} onPointerMove={(e) => paint(e, false)}>
          {shown ? <canvas ref={view} aria-label={`Try-on picture of this ${noun}, with the lens centres marked`} role="img" />
            : <p className="ffield__hint">No try-on picture yet.</p>}
        </div>

        <div className="tryon-edit__controls">
          <input ref={pick} type="file" accept="image/jpeg,image/png,image/webp" hidden onChange={(e) => { choose(e.target.files?.[0]); e.target.value = ""; }} />
          <p className="tryon-edit__pick">
            <button className="btn btn--outline-dark" type="button" onClick={() => pick.current?.click()}>{hasPicture ? "Choose a new front-view photo" : "Choose a front-view photo"}</button>
            {existing && !source && <button className="btn btn--outline-dark" type="button" onClick={reclean}>Clean up this picture again</button>}
          </p>

          {source && !source.transparent && (
            <div className="ffield">
              <label htmlFor="tr-strength">Background removal: {opts.strength}</label>
              <input id="tr-strength" type="range" min={190} max={252} value={opts.strength} onChange={(e) => tune({ ...opts, strength: +e.target.value })} />
              <span className="ffield__hint">Lower removes more. Stop before the frame itself starts to fade.</span>
            </div>
          )}
          {source && (
            <div className="tryon-edit__switches">
              <label className="switch">
                <span className="switch__text"><b>Remove arms seen through the lenses</b><span>For clear lenses where the side arms show inside. Switch off if the photo has none.</span></span>
                <input type="checkbox" role="switch" checked={opts.arms} onChange={(e) => tune({ ...opts, arms: e.target.checked })} />
              </label>
              <label className="switch">
                <span className="switch__text"><b>Remove shadows</b><span>The grey shadow under the frame. Switch off if parts of a shiny frame disappear.</span></span>
                <input type="checkbox" role="switch" checked={opts.shadows} onChange={(e) => tune({ ...opts, shadows: e.target.checked })} />
              </label>
            </div>
          )}
          {source && (
            <div className="tryon-edit__pair">
              <div className="ffield">
                <label htmlFor="tr-left">Trim left arm: {opts.trimLeft}%</label>
                <input id="tr-left" type="range" min={0} max={30} value={opts.trimLeft} onChange={(e) => tune({ ...opts, trimLeft: +e.target.value })} />
              </div>
              <div className="ffield">
                <label htmlFor="tr-right">Trim right arm: {opts.trimRight}%</label>
                <input id="tr-right" type="range" min={0} max={30} value={opts.trimRight} onChange={(e) => tune({ ...opts, trimRight: +e.target.value })} />
              </div>
            </div>
          )}
          {source && (
            <fieldset className="tryon-edit__kind">
              <legend>Lenses</legend>
              <div className="tryon-edit__kinds" role="radiogroup" aria-label="Lens type">
                {([["clear", "Clear", "See-through, like eyeglasses"], ["tinted", "Tinted", "The eyes show through, in the lens colour"], ["mirror", "Mirrored / opaque", "Solid lenses with a soft reflection"]] as const).map(([k, label, hint]) => (
                  <label key={k} className="tryon-edit__kindopt">
                    <input type="radio" name="lens-kind" value={k} checked={lensKind === k} onChange={() => setLensKind(k)} />
                    <span><b>{label}</b><small>{hint}</small></span>
                  </label>
                ))}
              </div>
              {lensKind === "tinted" && (
                <div className="ffield">
                  <label htmlFor="tr-dark">Lens darkness: {darkness}%</label>
                  <input id="tr-dark" type="range" min={25} max={90} value={darkness} onChange={(e) => setDarkness(+e.target.value)} />
                  <span className="ffield__hint">How much of the eyes shows through. Match the real lenses.</span>
                </div>
              )}
              {lensMissing && <p className="ferr" role="alert">{lensMissing}</p>}
            </fieldset>
          )}
          {source && (
            <div className="tryon-edit__erase">
              <button className="btn btn--outline-dark btn--sm" type="button" aria-pressed={erasing} onClick={() => setErasing(!erasing)}>{erasing ? "Stop erasing" : "Erase bits"}</button>
              {erasing && (
                <>
                  <label className="tryon-edit__brush">Brush <input type="range" min={1} max={8} step={0.5} value={brush} onChange={(e) => setBrush(+e.target.value)} aria-label="Eraser size" /></label>
                  <button className="clear-all" type="button" disabled={!strokes.length} onClick={() => setStrokes(strokes.slice(0, -1))}>Undo</button>
                  <button className="clear-all" type="button" disabled={!strokes.length} onClick={() => setStrokes([])}>Clear all</button>
                </>
              )}
              <span className="ffield__hint">{erasing ? "Paint over anything left over, such as arms above the lenses." : "For leftover bits the switches don't remove."}</span>
            </div>
          )}
          {hasPicture && (
            <fieldset className="tryon-edit__lens">
              <legend>Lens centres (the gold dots)</legend>
              <div className="ffield">
                <label htmlFor="tr-ll">Left lens: {pct(lens.left)}</label>
                <input id="tr-ll" type="range" min={5} max={49} value={Math.round(lens.left * 100)} onChange={(e) => setLens({ ...lens, left: +e.target.value / 100 })} />
              </div>
              <div className="ffield">
                <label htmlFor="tr-lr">Right lens: {pct(lens.right)}</label>
                <input id="tr-lr" type="range" min={51} max={95} value={Math.round(lens.right * 100)} onChange={(e) => setLens({ ...lens, right: +e.target.value / 100 })} />
              </div>
              <div className="ffield">
                <label htmlFor="tr-ly">Height: {pct(lens.y)}</label>
                <input id="tr-ly" type="range" min={10} max={90} value={Math.round(lens.y * 100)} onChange={(e) => setLens({ ...lens, y: +e.target.value / 100 })} />
              </div>
              <span className="ffield__hint">Found automatically; move a dot if it isn&apos;t in the middle of its lens. The dots are lined up with the customer&apos;s eyes.</span>
            </fieldset>
          )}

          <label className="switch">
            <span className="switch__text"><b>Try-on for this {noun}</b><span>{hasPicture ? "Customers can see it on their own photo." : "Add a try-on picture first."}</span></span>
            <input type="checkbox" role="switch" checked={enabled && hasPicture} disabled={!hasPicture} onChange={(e) => setEnabled(e.target.checked)} />
          </label>

          {frameId ? (
            <div className="tryon-edit__actions">
              <button className="btn btn--primary" type="button" disabled={busy || !!notFound || !!lensMissing || !hasPicture} onClick={() => save()}>{busy ? "Saving…" : "Save try-on"}</button>
              {saved.path && !source && <button className="btn btn--outline-dark" type="button" disabled={busy} onClick={() => save(true)}>Remove picture</button>}
              {source && <button className="btn btn--outline-dark" type="button" disabled={busy} onClick={() => { setSource(null); setError(""); setStrokes([]); setErasing(false); setLens({ left: saved.lensLeft, right: saved.lensRight, y: saved.lensY }); }}>Cancel</button>}
            </div>
          ) : (
            <>
              <p className="ffield__hint tryon-edit__with">Optional. It&apos;s saved with the {noun} when you send it for approval or save it as a draft. You can also add or change it later, on the {noun}&apos;s edit page.</p>
              {source && <div className="tryon-edit__actions"><button className="btn btn--outline-dark" type="button" onClick={() => { setSource(null); setError(""); setEnabled(false); }}>Don&apos;t add a try-on picture</button></div>}
            </>
          )}
          <p className="ffield__hint" aria-live="polite">{note}</p>
          {(notFound || error) && <p className="ferr" role="alert">{notFound || error}</p>}
        </div>
      </div>
    </section>
  );
}
