import type { Metadata } from "next";
import Link from "next/link";
import { HomeNav } from "@/components/home/home-nav";
import { PickerButton } from "@/components/site/branch-picker";
import { DummyTag } from "@/components/site/dummy-tag";
import { YearsSince } from "@/components/site/footer-year";
import { Icon, type IconName } from "@/components/site/icons";
import { Reveal } from "@/components/site/reveal";
import { hoursLine } from "@/components/site/site-chrome";
import { site } from "@/lib/site-config";
import { getBranches } from "@/lib/site-data";

export const metadata: Metadata = {
  title: { absolute: "VS Lens Mart | Opticians in Indresham and Patelguda since 1999" },
  description: "VS Lens Mart, a family optical shop since 1999 in Indresham and Patelguda: frames, sunglasses, all branded lenses and eye testing. Open 7 days.",
  alternates: { canonical: "/" },
};

const CATEGORIES: [string, string, IconName][] = [
  ["Men", "/frames?for=men", "glasses"],
  ["Women", "/frames?for=women", "glasses"],
  ["Kids", "/frames?for=kids", "glasses"],
  ["Sunglasses", "/sunglasses", "sun"],
];

/* Home (Requirements_HomePage.md), from the signed-off mockups/home.html.
   The hero has no photo yet: the mockup's (DUMMY C12) shows AI-generated people
   and never goes live; the client's real shop photo replaces it. The founder
   story is DUMMY (C1, C3), as on About. Category tiles wait for the client's
   product photos. Hours, branch names and numbers come from the database. */
export default async function HomePage() {
  const branches = await getBranches();
  const names = branches.map((b) => b.name);
  const hours = hoursLine(branches);

  return (
    <>
      <HomeNav />
      <section className="hero hero--home" aria-labelledby="hero-title">
        <div className="container hero__inner">
          <p className="eyebrow"><span>TRUST</span><i>/</i><span>CARE</span><i>/</i><span>INNOVATION</span></p>
          <h1 className="hero__title" id="hero-title">
            <span><YearsSince /> Years of Trust.</span>
            <span className="gold">A Clearer Vision</span>
            <span>for Tomorrow.</span>
          </h1>
          <p className="hero__sub">Premium eyewear, expert eye care and a commitment to your vision, for every generation.</p>
          <div className="hero__actions">
            <Link className="btn btn--primary" href="/frames">Explore our frames <Icon name="arrow" className="icon icon--sm" /></Link>
            <Link className="btn btn--outline" href="/book-eye-test">Book an eye test</Link>
          </div>
          <p className="caps hero__legacy">Since {site.since} · {names.join(" & ")} <DummyTag id="C12" /></p>
        </div>
      </section>

      <section className="quick" id="quick" aria-label="Quick contact">
        <div className="container">
          <div className="quick__grid">
            <PickerButton kind="whatsapp" className="quick__card">
              <span className="quick__icon"><Icon name="wa" /></span>
              <span><span className="quick__title">WhatsApp us</span><span className="quick__text">Ask about a frame, a lens or your order.</span></span>
              <Icon name="arrow" />
            </PickerButton>
            <Link className="quick__card" href="/contact#branches">
              <span className="quick__icon"><Icon name="store" /></span>
              <span><span className="quick__title">Visit a store</span><span className="quick__text">{names.join(" and ")}, {hours.charAt(0).toLowerCase() + hours.slice(1)}.</span></span>
              <Icon name="arrow" />
            </Link>
          </div>
        </div>
      </section>

      <section className="trust" aria-label="Why VS Lens Mart">
        <div className="container">
          <ul className="trust__list">
            <li className="trust__item"><Icon name="shield" />Since {site.since}</li>
            <li className="trust__item"><Icon name="pin" />{branches.length} branches: {names.join(" & ")}</li>
            <li className="trust__item"><Icon name="lens" />All branded lenses</li>
            <li className="trust__item"><Icon name="clock" />{hours}</li>
          </ul>
        </div>
      </section>

      <section className="section section--white" aria-labelledby="welcome-title">
        <Reveal className="container welcome">
          <div className="ph" aria-hidden="true"><Icon name="store" className="icon icon--lg" /></div>
          <div className="welcome__body">
            <p className="caps section__eyebrow">Our story</p>
            <h2 className="section__title" id="welcome-title">{site.tagline}</h2>
            <p>{site.name} was started in {site.since} by <strong>[Founder name]</strong> with one small counter in Indresham and a simple promise: honest advice and careful eye testing for every family. Over the years the shop grew with its customers, and in <strong>2022</strong> opened its second branch in Patelguda. <DummyTag id="C1" /> <DummyTag id="C3" /></p>
            <p>Today, three generations of customers still come back to us, and we still treat every one of them like family.</p>
            <Link className="link-arrow" href="/about">Read our journey <Icon name="arrow" /></Link>
          </div>
        </Reveal>
      </section>

      <section className="section" aria-labelledby="cats-title">
        <Reveal className="container">
          <div className="section__head"><div>
            <p className="caps section__eyebrow">Shop by category</p>
            <h2 className="section__title" id="cats-title">Find your frame</h2>
          </div></div>
          <div className="cats">
            {CATEGORIES.map(([label, href, icon]) => (
              <Link className="cat" key={label} href={href}>
                <div className="ph" aria-hidden="true"><Icon name={icon} className="icon icon--lg" /></div>
                <span className="cat__name">{label} <Icon name="arrow" /></span>
              </Link>
            ))}
          </div>
        </Reveal>
      </section>
    </>
  );
}
