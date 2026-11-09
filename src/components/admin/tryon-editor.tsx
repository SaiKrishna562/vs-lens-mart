"use client";

/* Virtual try-on picture for one frame (Requirements_TryOn.md 6), on the
   frame's edit page. Staff choose a front-view photo; this page turns the
   white background see-through, trims the arm tips, crops to the frame and
   marks the lens centres, all in the browser (from the developer's
   prototype). Only the finished PNG is uploaded; the server checks it again. */
import { useEffect, useMemo, useRef, useState } from "react";
import { saveTryon } from "@/app/admin/(staff)/frames/tryon-actions";

export type TryonValue = { enabled: boolean; path: string | null; lensLeft: number; lensRight: number; lensY: number };

const MAX_SIDE = 1600; // source photos are scaled down to this first
const MAX_OUT = 1200; // the saved picture's widest side

type Source = { canvas: HTMLCanvasElement; transparent: boolean };

/** The see-through, trimmed and cropped picture from a source photo. */
function clean(src: Source, strength: number, trimLeft: number, trimRight: number): HTMLCanvasElement | null {
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
    return n > 50 ? { x: sx / n / w, y: sy / n / h } : null;
  };
  const l = half(0, Math.floor(w / 2));
  const r = half(Math.ceil(w / 2), w);
  if (!l || !r) return { left: 0.27, right: 0.73, y: 0.48 };
  const clamp = (v: number, lo: number, hi: number) => Math.min(hi, Math.max(lo, v));
  return { left: clamp(l.x, 0.05, 0.49), right: clamp(r.x, 0.51, 0.95), y: clamp((l.y + r.y) / 2, 0.1, 0.9) };
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

export function TryonEditor({ frameId, initial, siteOn, noun }: { frameId: string; initial: TryonValue; siteOn: boolean; noun: string }) {
  const [saved, setSaved] = useState(initial);
  const [enabled, setEnabled] = useState(initial.enabled);
  const [lens, setLens] = useState({ left: initial.lensLeft, right: initial.lensRight, y: initial.lensY });
  const [source, setSource] = useState<Source | null>(null);
  const [opts, setOpts] = useState({ strength: 236, trimLeft: 0, trimRight: 0 });
  const [loaded, setLoaded] = useState<{ path: string; img: HTMLImageElement } | null>(null);
  const [note, setNote] = useState("");
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);
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
  const picture = useMemo(() => (source ? clean(source, opts.strength, opts.trimLeft, opts.trimRight) : null), [source, opts]);
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

  async function choose(file: File | undefined) {
    setNote(""); setError("");
    if (!file) return;
    try {
      const src = await loadSource(file);
      const start = { strength: 236, trimLeft: 0, trimRight: 0 };
      setSource(src);
      setOpts(start);
      const out = clean(src, start.strength, start.trimLeft, start.trimRight);
      setLens(out ? findLenses(out) : { left: 0.27, right: 0.73, y: 0.48 });
    } catch {
      setError("That photo couldn't be opened. Use a JPG, PNG or WebP photo.");
    }
  }

  async function save(remove = false) {
    setBusy(true); setNote(""); setError("");
    const fd = new FormData();
    fd.set("frameId", frameId);
    fd.set("enabled", String(enabled && !remove));
    fd.set("lensLeft", String(lens.left)); fd.set("lensRight", String(lens.right)); fd.set("lensY", String(lens.y));
    fd.set("remove", String(remove));
    if (picture && !remove) {
      const blob = await new Promise<Blob | null>((ok) => picture.toBlob(ok, "image/png"));
      if (blob) fd.set("picture", blob, "tryon.png");
    }
    const r = await saveTryon(fd);
    setBusy(false);
    if (!r.ok) { setError(r.error); return; }
    setSaved({ enabled: r.enabled, path: r.path, lensLeft: lens.left, lensRight: lens.right, lensY: lens.y });
    setEnabled(r.enabled);
    setSource(null);
    setNote(remove ? "Try-on picture removed." : r.enabled ? "Saved. Try-on is on for this frame." : "Saved. Try-on is off for this frame.");
  }

  const hasPicture = !!(picture || saved.path);
  const pct = (v: number) => `${Math.round(v * 100)}%`;
  /** A clean-up slider moved: clean again and find the lenses in the new picture. */
  const tune = (next: typeof opts) => {
    setOpts(next);
    const out = source && clean(source, next.strength, next.trimLeft, next.trimRight);
    if (out) setLens(findLenses(out));
  };
  return (
    <section className="fsec tryon-edit" aria-labelledby="sec-tryon">
      <h2 className="fsec__title" id="sec-tryon">Try-on picture</h2>
      {!siteOn && <p className="ffield__hint tryon-edit__off">Try-on is not switched on for the website yet. You can prepare frames now; customers see them once it is.</p>}
      <p className="photo-tip">One photo of the {noun} straight from the front, on plain white paper, lenses without reflections, nothing else in the photo. The white background is removed here; only the cleaned picture is saved.</p>

      <div className="tryon-edit__grid">
        <div className="tryon-edit__preview">
          {shown ? <canvas ref={view} aria-label={`Try-on picture of this ${noun}, with the lens centres marked`} role="img" />
            : <p className="ffield__hint">No try-on picture yet.</p>}
        </div>

        <div className="tryon-edit__controls">
          <input ref={pick} type="file" accept="image/jpeg,image/png,image/webp" hidden onChange={(e) => { choose(e.target.files?.[0]); e.target.value = ""; }} />
          <p><button className="btn btn--outline-dark" type="button" onClick={() => pick.current?.click()}>{hasPicture ? "Choose a new front-view photo" : "Choose a front-view photo"}</button></p>

          {source && !source.transparent && (
            <div className="ffield">
              <label htmlFor="tr-strength">Background removal: {opts.strength}</label>
              <input id="tr-strength" type="range" min={190} max={252} value={opts.strength} onChange={(e) => tune({ ...opts, strength: +e.target.value })} />
              <span className="ffield__hint">Lower removes more. Stop before the frame itself starts to fade.</span>
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

          <div className="tryon-edit__actions">
            <button className="btn btn--primary" type="button" disabled={busy || !!notFound || !hasPicture} onClick={() => save()}>{busy ? "Saving…" : "Save try-on"}</button>
            {saved.path && !source && <button className="btn btn--outline-dark" type="button" disabled={busy} onClick={() => save(true)}>Remove picture</button>}
            {source && <button className="btn btn--outline-dark" type="button" disabled={busy} onClick={() => { setSource(null); setError(""); setLens({ left: saved.lensLeft, right: saved.lensRight, y: saved.lensY }); }}>Cancel</button>}
          </div>
          <p className="ffield__hint" aria-live="polite">{note}</p>
          {(notFound || error) && <p className="ferr" role="alert">{notFound || error}</p>}
        </div>
      </div>
    </section>
  );
}
