/* Shop facts: the seed and fallback values for the `branches` table.
   Pages read branch details from the database (the admin edits them at
   /admin/branches); this file seeds that table and covers the brief moment
   before it has rows. Never hard-code these facts in components.
   Sources: docs/client-answers.md, docs/prescription_card.jpg, docs/dummy-data.md. */

export type BranchSeed = {
  slug: "indresham" | "patelguda";
  name: string;
  address: string;
  phone: string;
  whatsapp: string;
  opens: string; // 24-hour "HH:MM"
  closes: string;
  /** Set while a value is a placeholder from docs/dummy-data.md. Never shown live. */
  dummy?: string;
};

export const site = {
  name: "VS Lens Mart",
  since: 1999, // compute "years" from this; never hard-code a year count
  tagline: "Welcome to the Optical Family",
} as const;

export const branches: readonly BranchSeed[] = [
  {
    slug: "indresham",
    name: "Indresham",
    address: "Plot No 30/Part Block-B, Citizens Colony, Indresham, Patancheruvu, Sangareddy",
    phone: "9550685417",
    whatsapp: "9550685417",
    opens: "09:00",
    closes: "21:30",
  },
  {
    slug: "patelguda",
    name: "Patelguda",
    address: "Falcon One Shopping Plaza, beside Apollo Pharmacy, Ellenki College, Patelguda",
    phone: "0000000000", // DUMMY D2: the client hasn't sent the Patelguda number
    whatsapp: "0000000000", // DUMMY D2
    opens: "09:00",
    closes: "21:30",
    dummy: "D2",
  },
];

export const yearsSince = (now = new Date()) => now.getFullYear() - site.since;
