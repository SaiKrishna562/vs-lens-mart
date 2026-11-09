"use client";

/* Face tracking for virtual try-on (Requirements_TryOn.md 8): MediaPipe Face
   Landmarker, loaded only when a customer opens try-on, from this site's own
   public/tryon folder (scripts/tryon-assets.ts), never from a CDN. Everything
   runs in the browser; no photo or face point leaves the device. */
import type { FaceLandmarker, NormalizedLandmark } from "@mediapipe/tasks-vision";

export type Point = { x: number; y: number };
/** One face, in pixels of the image it was found in. `left` / `right` are as seen on screen. */
export type Face = { left: Point; right: Point; width: number; box: { x: number; y: number; w: number; h: number }; faces: number };

let landmarker: Promise<FaceLandmarker> | null = null;
let mode: "IMAGE" | "VIDEO" = "IMAGE";

/** Loads the model once per page (the browser caches the files after the first time). */
export function loadFaceTracker(): Promise<FaceLandmarker> {
  landmarker ??= (async () => {
    const { FaceLandmarker, FilesetResolver } = await import("@mediapipe/tasks-vision");
    const files = await FilesetResolver.forVisionTasks("/tryon/wasm");
    const make = (delegate: "GPU" | "CPU") => FaceLandmarker.createFromOptions(files, {
      baseOptions: { modelAssetPath: "/tryon/face_landmarker.task", delegate },
      runningMode: "IMAGE",
      numFaces: 3,
    });
    // The graphics card where the browser allows it, otherwise the processor
    try { return await make("GPU"); } catch { return await make("CPU"); }
  })();
  landmarker.catch(() => { landmarker = null; }); // a failed load can be tried again
  return landmarker;
}

async function tracker(want: "IMAGE" | "VIDEO") {
  const lm = await loadFaceTracker();
  if (mode !== want) { await lm.setOptions({ runningMode: want }); mode = want; }
  return lm;
}

function toFace(all: NormalizedLandmark[][], w: number, h: number): Face | null {
  if (!all.length) return null;
  const px = (p: NormalizedLandmark): Point => ({ x: p.x * w, y: p.y * h });
  // The largest face, if there are several
  const size = (f: NormalizedLandmark[]) => Math.abs(f[454].x - f[234].x);
  const f = all.reduce((a, b) => (size(b) > size(a) ? b : a));
  // Iris centres (468, 473); cheek edges (234, 454); forehead (10) and chin (152)
  const a = px(f[468]), b = px(f[473]);
  const [left, right] = a.x <= b.x ? [a, b] : [b, a];
  const c1 = px(f[234]), c2 = px(f[454]), top = px(f[10]), chin = px(f[152]);
  const x0 = Math.min(c1.x, c2.x), x1 = Math.max(c1.x, c2.x);
  return {
    left, right, width: Math.hypot(c2.x - c1.x, c2.y - c1.y), faces: all.length,
    box: { x: x0, y: Math.min(top.y, chin.y), w: x1 - x0, h: Math.abs(chin.y - top.y) },
  };
}

/** The face in a still photo, or null. */
export async function findFace(image: HTMLCanvasElement): Promise<Face | null> {
  const lm = await tracker("IMAGE");
  return toFace(lm.detect(image).faceLandmarks, image.width, image.height);
}

/** The face in the current camera frame (for the guide), or null. */
export async function trackFace(video: HTMLVideoElement, now: number): Promise<Face | null> {
  const lm = await tracker("VIDEO");
  return toFace(lm.detectForVideo(video, now).faceLandmarks, video.videoWidth, video.videoHeight);
}
