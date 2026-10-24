/* Branch details (Requirements_Admin.md 7.1): the admin's form rules, shared by
   the browser and the server action. No server imports. The Patelguda number
   is still the all-zero placeholder (DUMMY D2), which stays allowed until the
   client sends the real one. */
import { z } from "zod";
import { cleanPhone } from "./booking-rules";

export const WEEK = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"] as const;

const number = (label: string) => z.string().transform(cleanPhone)
  .refine((d) => /^[6-9]\d{9}$/.test(d) || /^0{10}$/.test(d), `Enter a 10-digit ${label} number.`);
const time = z.string().regex(/^\d{2}:\d{2}(:\d{2})?$/, "Pick a time").transform((t) => t.slice(0, 5));

export const branchFields = z.object({
  slug: z.string().regex(/^[a-z0-9-]{1,40}$/),
  address: z.string().trim().min(10, "Enter the full address.").max(200, "The address can be up to 200 characters."),
  mapUrl: z.string().trim().refine((u) => u === "" || /^https:\/\/[^\s]+$/.test(u), "Paste a Google Maps link starting with https://, or leave it empty.")
    .transform((u) => u || null),
  phone: number("phone"),
  whatsapp: number("WhatsApp"),
  opens: time,
  closes: time,
  openDays: z.array(z.enum(WEEK)).min(1, "Pick at least one day."),
  isVisible: z.boolean(),
}).refine((b) => b.closes > b.opens, { path: ["closes"], message: "Closing time must be after opening time." });
export type BranchInput = z.infer<typeof branchFields>;
