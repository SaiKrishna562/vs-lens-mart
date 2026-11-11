"use client";

/* Virtual try-on panel (Requirements_TryOn.md 4): "Try it on" on a frame's
   photo opens a dialog. The customer takes a selfie (camera inside the panel,
   with a face guide that takes the photo by itself) or chooses a photo; the
   frame is drawn on their face, which they can adjust, compare with and
   without, switch to other try-on frames, save, or enquire about on WhatsApp.
   The photo stays in this browser tab (sessionStorage), never on a server. */
import Link from "next/link";
import { useCallback, useEffect, useRef, useState } from "react";
import { PickerButton } from "@/components/site/branch-picker";
import { Icon } from "@/components/site/icons";
import { drawLook, faceCrop, FIT0, type Fit, type TryonPicture } from "./draw";
import { findFace, loadFaceTracker, trackFace, type Face } from "./face";

export type TryonFrame = {
  code: string; brand: string; model: string; href: string; enquiry: string;
  tryon: { path: string; left: number; right: number; y: number };
  /** The frame's real front width in mm, when its size is known (sizes the frame on the face) */
  mm: number | null;
};

type Step = "start" | "camera" | "working" | "result" | "problem";
type Photo = { canvas: HTMLCanvasElement; face: Face };

const KEY = "vslm-tryon";
const MAX_PHOTO = 1024;
const VIEW_W = 720; // the result's drawing width; CSS scales it to the screen

/* ---------- The photo, kept for this tab only ---------- */
function remember(p: Photo) {
  try { sessionStorage.setItem(KEY, JSON.stringify({ photo: p.canvas.toDataURL("image/jpeg", 0.88), face: p.face })); } catch { /* full or private mode: just not kept */ }
}
function forget() { try { sessionStorage.removeItem(KEY); } catch { /* nothing kept */ } }
async function recall(): Promise<Photo | null> {
  try {
    const raw = sessionStorage.getItem(KEY);
    if (!raw) return null;
    const { photo, face } = JSON.parse(raw) as { photo: string; face: Face };
    const img = new Image();
    img.src = photo;
    await img.decode();
    const canvas = document.createElement("canvas");
    canvas.width = img.naturalWidth; canvas.height = img.naturalHeight;
    canvas.getContext("2d")!.drawImage(img, 0, 0);
    return { canvas, face };
  } catch { return null; }
}

/** A photo (file or camera frame) scaled to at most 1024 px. `mirror` flips it like the camera preview. */
function toCanvas(src: CanvasImageSource, w: number, h: number, mirror = false): HTMLCanvasElement {
  const k = Math.min(1, MAX_PHOTO / Math.max(w, h));
  const c = document.createElement("canvas");
  c.width = Math.round(w * k); c.height = Math.round(h * k);
  const g = c.getContext("2d")!;
  if (mirror) { g.translate(c.width, 0); g.scale(-1, 1); }
  g.drawImage(src, 0, 0, c.width, c.height);
  return c;
}

const pictures = new Map<string, Promise<HTMLImageElement>>();
function picture(path: string) {
  if (!pictures.has(path)) {
    pictures.set(path, new Promise((ok, fail) => { const i = new Image(); i.onload = () => ok(i); i.onerror = fail; i.src = `/media/${path}`; }));
  }
  return pictures.get(path)!;
}

/* ---------- Camera guide ---------- */
type Guide = { text: string; ready: boolean };
function guide(face: Face | null, vw: number, vh: number): Guide {
  if (!face) return { text: "Look at the screen and fit your face in the oval", ready: false };
  if (face.faces > 1) return { text: "Only one face, please", ready: false };
  const share = face.width / vw;
  if (share < 0.3) return { text: "Move a little closer", ready: false };
  if (share > 0.62) return { text: "Move back a little", ready: false };
  const cx = (face.left.x + face.right.x) / 2 / vw, cy = (face.left.y + face.right.y) / 2 / vh;
  if (Math.abs(cx - 0.5) > 0.1 || cy < 0.28 || cy > 0.55) return { text: "Centre your face in the oval", ready: false };
  const roll = Math.abs(Math.atan2(face.right.y - face.left.y, face.right.x - face.left.x) * 180 / Math.PI);
  if (roll > 7) return { text: "Hold your head straight", ready: false };
  return { text: "Perfect, hold still", ready: true };
}

export function TryOn({ frame, others }: { frame: TryonFrame; others: TryonFrame[] }) {
  const dialog = useRef<HTMLDialogElement>(null);
  const [step, setStep] = useState<Step>("start");
  const [problem, setProblem] = useState("");
  const [status, setStatus] = useState("");
  const [photo, setPhoto] = useState<Photo | null>(null);
  const [current, setCurrent] = useState<TryonFrame>(frame);
  const [pic, setPic] = useState<TryonPicture | null>(null);
  const [fit, setFit] = useState<Fit>(FIT0);
  const [bare, setBare] = useState(false);
  const [adjusting, setAdjusting] = useState(false);
  const [cam, setCam] = useState<Guide & { count: number }>({ text: "", ready: false, count: 0 });
  const view = useRef<HTMLCanvasElement>(null);
  const video = useRef<HTMLVideoElement>(null);
  const stream = useRef<MediaStream | null>(null);
  const file = useRef<HTMLInputElement>(null);
  const all = [frame, ...others.filter((o) => o.code !== frame.code)];

  /* Opening and closing */
  const stopCamera = useCallback(() => {
    stream.current?.getTracks().forEach((t) => t.stop());
    stream.current = null;
  }, []);
  async function open() {
    dialog.current?.showModal();
    loadFaceTracker().catch(() => {}); // start fetching the model while they read
    const kept = await recall();
    if (kept) { setPhoto(kept); setStep("result"); } else setStep("start");
  }
  function close() { stopCamera(); dialog.current?.close(); }
  useEffect(() => stopCamera, [stopCamera]);

  /* The frame picture for the chosen frame */
  useEffect(() => {
    let live = true;
    picture(current.tryon.path).then((img) => { if (live) setPic({ img, ...current.tryon, mm: current.mm }); }, () => { if (live) setPic(null); });
    return () => { live = false; };
  }, [current]);

  /* Drawing the result */
  useEffect(() => {
    const c = view.current;
    if (step !== "result" || !c || !photo) return;
    const crop = faceCrop(photo.face, photo.canvas.width, photo.canvas.height);
    c.width = VIEW_W; c.height = Math.round(VIEW_W * (crop.h / crop.w));
    drawLook(c.getContext("2d")!, photo.canvas, photo.face, crop, pic, fit, bare);
  }, [step, photo, pic, fit, bare]);

  /* A photo is ready: find the face */
  async function acceptPhoto(canvas: HTMLCanvasElement) {
    setStep("working"); setStatus("Finding your face…");
    try {
      const face = await findFace(canvas);
      if (!face) { setProblem("We couldn't find a face in that photo. Try one taken from the front, in good light, without glasses."); setStep("problem"); return; }
      if (face.width < 120) { setProblem("Your face is quite small in that photo. Try one taken closer, from the front."); setStep("problem"); return; }
      const p = { canvas, face };
      setPhoto(p); remember(p); setFit(FIT0); setStep("result");
      setStatus(face.faces > 1 ? "We used the largest face in the photo." : "");
    } catch {
      setProblem("Try-on couldn't start on this device. Check your internet connection and try again."); setStep("problem");
    }
  }

  async function chooseFile(f: File | undefined) {
    if (!f) return;
    try {
      const bmp = await createImageBitmap(f);
      const c = toCanvas(bmp, bmp.width, bmp.height);
      bmp.close();
      await acceptPhoto(c);
    } catch {
      setProblem("That file couldn't be opened. Choose a JPG, PNG or HEIC photo."); setStep("problem");
    }
  }

  /* Camera with the face guide */
  async function startCamera() {
    setProblem("");
    if (!navigator.mediaDevices?.getUserMedia) {
      setProblem("This browser can't use the camera here. Choose a photo instead."); setStep("problem"); return;
    }
    try {
      stream.current = await navigator.mediaDevices.getUserMedia({ video: { facingMode: "user", width: { ideal: 1280 }, height: { ideal: 960 } }, audio: false });
    } catch {
      setProblem("The camera isn't available or wasn't allowed. You can choose a photo instead."); setStep("problem"); return;
    }
    setStep("camera");
  }
  useEffect(() => {
    if (step !== "camera") return;
    const v = video.current;
    if (!v || !stream.current) return;
    v.srcObject = stream.current;
    let stop = false, readySince = 0, last = 0;
    const tick = async (now: number) => {
      if (stop) return;
      if (v.readyState >= 2 && now - last > 120) {
        last = now;
        try {
          const g = guide(await trackFace(v, now), v.videoWidth, v.videoHeight);
          readySince = g.ready ? readySince || now : 0;
          const left = g.ready ? Math.max(0, 3 - Math.floor((now - readySince) / 1000)) : 0;
          setCam({ ...g, count: left });
          if (g.ready && now - readySince >= 3000) { capture(); return; }
        } catch { setCam({ text: "Getting the camera ready…", ready: false, count: 0 }); }
      }
      requestAnimationFrame(tick);
    };
    v.play().then(() => requestAnimationFrame(tick)).catch(() => {});
    return () => { stop = true; };
    // capture is stable for this purpose; re-running would restart the guide
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [step]);

  function capture() {
    const v = video.current;
    if (!v || !v.videoWidth) return;
    const c = toCanvas(v, v.videoWidth, v.videoHeight, true); // as they saw it, like a mirror
    stopCamera();
    acceptPhoto(c);
  }

  /* Results */
  function newPhoto() { forget(); setPhoto(null); setFit(FIT0); setAdjusting(false); setStep("start"); }
  async function save() {
    const c = view.current;
    if (!c || !photo) return;
    const out = document.createElement("canvas");
    const band = Math.round(c.width * 0.11);
    out.width = c.width; out.height = c.height + band;
    const g = out.getContext("2d")!;
    g.drawImage(c, 0, 0);
    g.fillStyle = "#0D1B2A"; g.fillRect(0, c.height, out.width, band);
    g.textBaseline = "middle";
    // A canvas can't read CSS variables, so take the font names the page uses
    const css = getComputedStyle(document.documentElement);
    const heading = css.getPropertyValue("--font-jakarta").trim() || "sans-serif";
    const body = css.getPropertyValue("--font-inter").trim() || "sans-serif";
    g.fillStyle = "#F5C842"; g.font = `800 ${Math.round(band * 0.34)}px ${heading}`;
    g.fillText("VS Lens Mart", band * 0.4, c.height + band * 0.38);
    g.fillStyle = "#FAF6EE"; g.font = `400 ${Math.round(band * 0.24)}px ${body}`;
    g.fillText(`${current.brand} ${current.model} · ${location.host}${current.href}`, band * 0.4, c.height + band * 0.72);
    const blob = await new Promise<Blob | null>((ok) => out.toBlob(ok, "image/jpeg", 0.92));
    if (!blob) return;
    const a = document.createElement("a");
    a.href = URL.createObjectURL(blob); a.download = `vs-lens-mart-${current.code.toLowerCase()}.jpg`; a.click();
    setTimeout(() => URL.revokeObjectURL(a.href), 4000);
    setStatus("Image saved to your device.");
  }

  const name = `${current.brand} ${current.model}`;
  return (
    <>
      <button className="tryon-cta" type="button" onClick={open} aria-haspopup="dialog">
        <Icon name="glasses" className="icon" />Try it on
      </button>

      <dialog ref={dialog} className="tryon" aria-labelledby="tryon-title" onClose={stopCamera} onCancel={stopCamera}>
        <div className="tryon__head">
          <h2 id="tryon-title">Try on <span>{name}</span></h2>
          <button className="icon-btn" type="button" onClick={close} aria-label="Close try-on"><Icon name="x" /></button>
        </div>

        <div className="tryon__body">
          {step === "start" && (
            <div className="tryon__start">
              <p className="tryon__lead">See the {current.model} on your own face, right here.</p>
              <div className="tryon__choices">
                <button className="btn btn--primary" type="button" onClick={startCamera}><Icon name="eye" className="icon icon--sm" />Take a selfie</button>
                <button className="btn btn--outline-dark" type="button" onClick={() => file.current?.click()}>Choose a photo</button>
                <input ref={file} type="file" accept="image/*" hidden onChange={(e) => { chooseFile(e.target.files?.[0]); e.target.value = ""; }} />
              </div>
              <ul className="tryon__tips">
                <li>Face a light, look straight at the camera</li>
                <li>Take off your glasses</li>
                <li>Tuck your hair behind your ears</li>
              </ul>
              <p className="tryon__privacy"><Icon name="shield" className="icon icon--sm" />Your photo stays on this device. It isn&apos;t uploaded or saved by VS Lens Mart. <Link href="/privacy#tryon">Privacy</Link></p>
            </div>
          )}

          {step === "camera" && (
            <div className="tryon__camera">
              <div className="tryon__video">
                <video ref={video} playsInline muted aria-label="Camera preview" />
                <svg className={`tryon__oval${cam.ready ? " is-ready" : ""}`} viewBox="0 0 100 100" preserveAspectRatio="none" aria-hidden="true">
                  <ellipse cx="50" cy="44" rx="21" ry="30" />
                </svg>
                {cam.ready && cam.count > 0 && <span className="tryon__count" aria-hidden="true">{cam.count}</span>}
              </div>
              <p className="tryon__guide" role="status" aria-live="polite">{cam.text || "Starting the camera…"}</p>
              <div className="tryon__choices">
                <button className="btn btn--primary" type="button" onClick={capture}>Take photo</button>
                <button className="btn btn--outline-dark" type="button" onClick={() => { stopCamera(); setStep("start"); }}>Back</button>
              </div>
            </div>
          )}

          {step === "working" && <p className="tryon__working" role="status">{status || "Getting try-on ready…"}</p>}

          {step === "problem" && (
            <div className="tryon__start">
              <p className="tryon__problem" role="alert">{problem}</p>
              <div className="tryon__choices">
                <button className="btn btn--primary" type="button" onClick={() => file.current?.click()}>Choose a photo</button>
                <button className="btn btn--outline-dark" type="button" onClick={startCamera}>Try the camera again</button>
                <input ref={file} type="file" accept="image/*" hidden onChange={(e) => { chooseFile(e.target.files?.[0]); e.target.value = ""; }} />
              </div>
            </div>
          )}

          {step === "result" && photo && (
            <div className="tryon__result">
              <div className="tryon__stage">
                <canvas ref={view} role="img" aria-label={bare ? "Your photo without the frame" : `Your photo wearing the ${name}`} />
                <button className="tryon__compare" type="button"
                  onPointerDown={() => setBare(true)} onPointerUp={() => setBare(false)} onPointerLeave={() => setBare(false)}
                  onKeyDown={(e) => { if (e.key === " " || e.key === "Enter") { e.preventDefault(); setBare(true); } }}
                  onKeyUp={() => setBare(false)} aria-pressed={bare}>
                  {bare ? "Without frame" : "Hold to compare"}
                </button>
              </div>

              <div className="tryon__side">
                {all.length > 1 && (
                  <div className="tryon__strip" role="group" aria-label="Try another frame">
                    {all.map((o) => (
                      <button key={o.code} type="button" className="tryon__thumb" aria-pressed={o.code === current.code} onClick={() => { setCurrent(o); setFit(FIT0); }}>
                        {/* eslint-disable-next-line @next/next/no-img-element -- see-through try-on picture, served by /media */}
                        <img src={`/media/${o.tryon.path}`} alt="" />
                        <span>{o.brand} {o.model}</span>
                      </button>
                    ))}
                  </div>
                )}

                <details className="tryon__adjust" open={adjusting} onToggle={(e) => setAdjusting((e.target as HTMLDetailsElement).open)}>
                  <summary>Adjust fit</summary>
                  {([["size", "Size", 0.8, 1.25, 0.01], ["up", "Up / down", -25, 25, 1], ["tilt", "Tilt", -12, 12, 0.5]] as const).map(([k, label, min, max, st]) => (
                    <label className="tryon__slider" key={k}>
                      <span>{label}</span>
                      <input type="range" min={min} max={max} step={st} value={fit[k]} onChange={(e) => setFit({ ...fit, [k]: +e.target.value })} />
                    </label>
                  ))}
                  <button className="clear-all" type="button" onClick={() => setFit(FIT0)}>Reset</button>
                </details>

                <div className="tryon__actions">
                  <PickerButton kind="whatsapp" className="btn btn--primary" waText={current.enquiry}><Icon name="wa" className="icon icon--sm" />Enquire on WhatsApp</PickerButton>
                  <button className="btn btn--outline-dark" type="button" onClick={save}>Save image</button>
                  {current.code !== frame.code && <Link className="btn btn--outline-dark" href={current.href} onClick={close}>See this frame</Link>}
                </div>
                <p className="tryon__status" role="status" aria-live="polite">{status}</p>
                <div className="tryon__again">
                  <button className="clear-all" type="button" onClick={newPhoto}>Use another photo</button>
                  <button className="clear-all" type="button" onClick={() => { newPhoto(); close(); }}>Remove my photo</button>
                </div>
                <p className="tryon__note">Preview only. Size and fit may look different in person. Try it on at a branch.</p>
              </div>
            </div>
          )}
        </div>
      </dialog>
    </>
  );
}
