import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";

export const metadata: Metadata = { title: "Coming soon" };

/* Sidebar sections that later sprints build (ROADMAP.md section 4), so their
   links don't lead to a bare 404 in the meantime. Anything else is a 404. */
const LATER: Record<string, [string, string]> = {
  branches: ["Branches", "5.4"], staff: ["Staff accounts", "5.5"], holidays: ["Branch holidays", "5.4"],
};

export function generateStaticParams() {
  return Object.keys(LATER).map((k) => ({ section: [k] }));
}

export default async function Later({ params }: PageProps<"/admin/[...section]">) {
  const { section } = await params;
  const hit = section.length === 1 ? LATER[section[0]] : undefined;
  if (!hit) notFound();
  const [label, sprint] = hit;
  return (
    <>
      <header className="adm-head">
        <nav aria-label="Breadcrumb"><ol className="crumbs"><li><Link href="/admin">Dashboard</Link></li><li aria-current="page">{label}</li></ol></nav>
        <h1>{label}</h1>
        <p>This part of the staff area arrives in sprint {sprint}. Until then, ask the developer for changes here.</p>
      </header>
      <Link className="btn btn--outline-dark" href="/admin">Back to the dashboard</Link>
    </>
  );
}
