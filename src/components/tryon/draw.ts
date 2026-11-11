/* Drawing a frame on a face (Requirements_TryOn.md 4.2): the frame is centred
   on the customer's eyes, turned with the line between them, and sized to the
   face (see frameWidth), then the customer's Size / Up-down / Tilt adjustments. The view is
   cropped to the face so the frame is big enough to judge. Plain functions,
   used by the panel and the saved image. */
import type { Face } from "./face";

/** `mm`: the frame's real front width in millimetres, when its lens and bridge sizes are known. */
export type TryonPicture = { img: HTMLImageElement; left: number; right: number; y: number; mm?: number | null };

/** The front width of a frame from its size, e.g. lens 58 + bridge 14: two lenses, the bridge and the end pieces. */
export const frontMm = (lens: number | null | undefined, bridge: number | null | undefined) =>
  lens && bridge ? 2 * lens + bridge + 6 : null;

const PD_MM = 63; // an average adult's distance between the pupils, the ruler when a frame's size is known

/** How wide the frame should be drawn, in canvas pixels. With the frame's size known, its real
    width (the pupils as the ruler); otherwise 103% of the face, cheek to cheek: glasses sit
    slightly wider than the cheeks (tuned 2026-11-11 on the developer's own fittings, where
    95% needed the Size slider raised about 8% for both an aviator and a square frame). Kept within sensible limits of the eye distance either way. */
function frameWidth(eyes: number, faceWidth: number, mm: number | null | undefined) {
  const want = mm ? (mm / PD_MM) * eyes : faceWidth * 1.03;
  return Math.min(Math.max(want, eyes * 1.9), eyes * 2.8);
}
export type Fit = { size: number; up: number; tilt: number }; // 1 = as found; up in % of the eye distance; tilt in degrees
export const FIT0: Fit = { size: 1, up: 0, tilt: 0 };

/** The part of the photo to show: head and shoulders, portrait, centred on the eyes. */
export function faceCrop(face: Face, w: number, h: number) {
  const cw = Math.min(w, face.width * 2.1);
  const ch = Math.min(h, cw * 1.25);
  const cx = (face.left.x + face.right.x) / 2;
  const cy = (face.left.y + face.right.y) / 2 + face.width * 0.12;
  const x = Math.min(Math.max(0, cx - cw / 2), w - cw);
  const y = Math.min(Math.max(0, cy - ch / 2), h - ch);
  return { x, y, w: cw, h: ch };
}

/** Draws the photo (the crop) and, unless `bare`, the frame on it. */
export function drawLook(
  ctx: CanvasRenderingContext2D, photo: CanvasImageSource, face: Face,
  crop: { x: number; y: number; w: number; h: number }, frame: TryonPicture | null, fit: Fit, bare = false,
) {
  // The canvas has the crop's shape, so the photo fills it exactly
  const { width: W, height: H } = ctx.canvas;
  const k = W / crop.w;
  ctx.clearRect(0, 0, W, H);
  ctx.drawImage(photo, crop.x, crop.y, crop.w, crop.h, 0, 0, W, H);
  if (bare || !frame) return;

  const L = { x: (face.left.x - crop.x) * k, y: (face.left.y - crop.y) * k };
  const R = { x: (face.right.x - crop.x) * k, y: (face.right.y - crop.y) * k };
  const eyes = Math.hypot(R.x - L.x, R.y - L.y);
  const fw = frame.img.naturalWidth, fh = frame.img.naturalHeight;
  // The picture's width is the frame's front, so scale it to the width the face needs
  const scale = (frameWidth(eyes, face.width * k, frame.mm) / fw) * fit.size;
  const angle = Math.atan2(R.y - L.y, R.x - L.x) + (fit.tilt * Math.PI) / 180;
  const mid = { x: (L.x + R.x) / 2, y: (L.y + R.y) / 2 };
  const anchor = { x: ((frame.left + frame.right) / 2) * fw, y: frame.y * fh };

  ctx.save();
  ctx.translate(mid.x, mid.y);
  ctx.rotate(angle);
  ctx.translate(0, eyes * (0.04 + fit.up / 100)); // lens centres sit just below the pupils
  ctx.shadowColor = "rgba(13, 27, 42, 0.35)"; // navy, soft: the frame sits on the face, not on top of the photo
  ctx.shadowBlur = eyes * 0.06;
  ctx.shadowOffsetY = eyes * 0.04;
  ctx.drawImage(frame.img, -anchor.x * scale, -anchor.y * scale, fw * scale, fh * scale);
  ctx.restore();
}
