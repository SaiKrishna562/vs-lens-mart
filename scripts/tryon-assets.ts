/* Virtual try-on (Phase 6): copies MediaPipe's WebAssembly runtime from
   node_modules into public/tryon/wasm, so customers' browsers load it from
   this site, never from a CDN or Google (Requirements_TryOn.md section 8).
   Runs before `npm run dev` and `npm run build`. The folder is gitignored:
   the files (about 30 MB) come with `npm install`. The face model,
   public/tryon/face_landmarker.task, is committed. */
import { copyFileSync, existsSync, mkdirSync, readdirSync, statSync } from "node:fs";
import path from "node:path";

const from = path.join("node_modules", "@mediapipe", "tasks-vision", "wasm");
const to = path.join("public", "tryon", "wasm");

if (!existsSync(from)) {
  console.error(`tryon-assets: ${from} is missing. Run npm install.`);
  process.exit(1);
}
mkdirSync(to, { recursive: true });
let copied = 0;
for (const name of readdirSync(from)) {
  const src = path.join(from, name);
  const dst = path.join(to, name);
  // Copy only when missing or changed (a package update), so dev starts stay quick
  if (existsSync(dst) && statSync(dst).size === statSync(src).size && statSync(dst).mtimeMs >= statSync(src).mtimeMs) continue;
  copyFileSync(src, dst);
  copied++;
}
if (copied) console.log(`tryon-assets: copied ${copied} file(s) to ${to}`);
