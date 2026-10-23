import { site } from "@/lib/site-config";

/* Foundation check page (Phase 4). Shows the tokens, fonts and buttons in
   light and dark mode. Replaced by the real home page in sprint 5.2. */

const brand = [
  ["Navy", "bg-navy"],
  ["Navy 2", "bg-navy-2"],
  ["Gold", "bg-gold"],
  ["Brass", "bg-brass"],
  ["Cream", "bg-cream"],
] as const;

const roles = [
  ["Page (bg)", "bg-bg"],
  ["Alternate (bg-alt)", "bg-bg-alt"],
  ["Surface", "bg-surface"],
  ["Pressed", "bg-pressed"],
] as const;

export default function Home() {
  return (
    <>
      <section className="bg-navy px-4 py-16 text-white sm:px-12">
        <p className="text-sm font-semibold uppercase tracking-[0.08em] text-brass">Trust / Care / Innovation</p>
        <h1 className="mt-3 text-4xl text-white sm:text-6xl">
          {site.name}
          <br />
          <span className="text-gold">Since {site.since}.</span>
        </h1>
        <p className="mt-4 max-w-xl text-white/80">Foundation check: design tokens, fonts and buttons. The real home page comes in sprint 5.2.</p>
        <div className="mt-8 flex flex-wrap gap-3">
          <a href="#tokens" className="inline-flex h-12 items-center rounded-pill bg-gold px-6 font-semibold text-navy">Explore our frames</a>
          <a href="#tokens" className="inline-flex h-12 items-center rounded-pill border-2 border-white px-6 font-semibold text-white">Book an eye test</a>
        </div>
      </section>

      <section id="tokens" className="mx-auto grid max-w-5xl gap-8 px-4 py-12 sm:px-12">
        <div>
          <h2 className="text-2xl">Brand colours</h2>
          <ul className="mt-4 grid grid-cols-2 gap-3 sm:grid-cols-5">
            {brand.map(([name, cls]) => (
              <li key={name} className="overflow-hidden rounded-md border border-line bg-surface">
                <span className={`block h-16 ${cls}`} />
                <span className="block p-2 text-sm">{name}</span>
              </li>
            ))}
          </ul>
        </div>
        <div>
          <h2 className="text-2xl">Colour roles (change in dark mode)</h2>
          <ul className="mt-4 grid grid-cols-2 gap-3 sm:grid-cols-4">
            {roles.map(([name, cls]) => (
              <li key={name} className="overflow-hidden rounded-md border border-line bg-surface">
                <span className={`block h-16 border-b border-line ${cls}`} />
                <span className="block p-2 text-sm">{name}</span>
              </li>
            ))}
          </ul>
        </div>
        <div className="rounded-md border border-line bg-surface p-6 shadow-panel">
          <h3 className="text-xl">A card on the surface colour</h3>
          <p className="mt-2 text-muted">Body text in Inter; headings in Plus Jakarta Sans ExtraBold.</p>
          <button type="button" className="mt-4 inline-flex h-12 items-center rounded-pill border-2 border-btn-ink px-6 font-semibold text-btn-ink">
            Outline button
          </button>
        </div>
      </section>
    </>
  );
}
