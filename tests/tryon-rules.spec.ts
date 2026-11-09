/* Virtual try-on data rules (Requirements_TryOn.md 8), security project:
   only see-through PNGs count as try-on pictures, and the database refuses
   try-on without a picture or with impossible lens centres. Database checks
   run in rolled-back transactions. */
import { expect, test } from "@playwright/test";
import { deflateSync } from "node:zlib";
import { isTransparentPng } from "../src/lib/upload-rules";
import { connect } from "./helpers";

/** A 1 × 1 PNG of the given colour type (2 = RGB, 6 = RGBA), optionally with a tRNS chunk. */
function png(colourType: 2 | 6, trns = false): Uint8Array {
  const crc = (buf: Buffer) => {
    let c = ~0;
    for (const b of buf) { c ^= b; for (let k = 0; k < 8; k++) c = (c >>> 1) ^ (0xedb88320 & -(c & 1)); }
    return ~c >>> 0;
  };
  const chunk = (type: string, data: Buffer) => {
    const head = Buffer.alloc(8); head.writeUInt32BE(data.length, 0); head.write(type, 4, "ascii");
    const tail = Buffer.alloc(4); tail.writeUInt32BE(crc(Buffer.concat([head.subarray(4), data])), 0);
    return Buffer.concat([head, data, tail]);
  };
  const ihdr = Buffer.alloc(13); ihdr.writeUInt32BE(1, 0); ihdr.writeUInt32BE(1, 4); ihdr[8] = 8; ihdr[9] = colourType;
  const row = colourType === 6 ? Buffer.from([0, 0, 0, 0, 0]) : Buffer.from([0, 255, 255, 255]);
  return new Uint8Array(Buffer.concat([
    Buffer.from([0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a]),
    chunk("IHDR", ihdr),
    ...(trns ? [chunk("tRNS", Buffer.from([0, 255, 0, 255, 0, 255]))] : []),
    chunk("IDAT", deflateSync(row)),
    chunk("IEND", Buffer.alloc(0)),
  ]));
}

test("only a PNG with see-through parts counts as a try-on picture", () => {
  expect(isTransparentPng(png(6))).toBe(true);
  expect(isTransparentPng(png(2, true))).toBe(true);
  expect(isTransparentPng(png(2))).toBe(false); // an opaque PNG would hide the face
  expect(isTransparentPng(new Uint8Array([0xff, 0xd8, 0xff, 0xe0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0]))).toBe(false); // JPEG
  expect(isTransparentPng(new Uint8Array(0))).toBe(false);
});

test("the database refuses try-on without a picture, and impossible lens centres", async () => {
  const c = await connect("owner");
  try {
    await c.query("begin");
    await c.query("select set_config('app.role', 'admin', true)");
    const { id } = (await c.query("select id from frames limit 1")).rows[0];
    const fails = async (sql: string) => {
      await c.query("savepoint s");
      const err = await c.query(sql, [id]).then(() => null, (e: Error & { code?: string }) => e);
      await c.query("rollback to savepoint s");
      return err?.code;
    };
    expect(await fails("update frames set tryon_enabled = true, tryon_path = null where id = $1")).toBe("23514");
    expect(await fails("update frames set tryon_lens_left = 0.8, tryon_lens_right = 0.2 where id = $1")).toBe("23514");
    expect(await fails("update frames set tryon_lens_y = 1.2 where id = $1")).toBe("23514");
    expect(await fails("update frames set tryon_enabled = true, tryon_path = 'frames/x/y.png' where id = $1")).toBeUndefined();
  } finally {
    await c.query("rollback");
    await c.end();
  }
});
