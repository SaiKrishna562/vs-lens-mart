import type { Metadata } from "next";
import Link from "next/link";
import { Suspense } from "react";
import { BranchMap, OpenStatus } from "@/components/contact/branch-live";
import { EnquiryForm, EnquiryFormPlain } from "@/components/contact/enquiry-form";
import { BranchLink } from "@/components/site/branch-link";
import { PickerButton } from "@/components/site/branch-picker";
import { DummyTag } from "@/components/site/dummy-tag";
import { Icon } from "@/components/site/icons";
import { eyeCareServices } from "@/components/site/menu-links";
import { Reveal } from "@/components/site/reveal";
import { hoursLine } from "@/components/site/site-chrome";
import { dayLabel } from "@/lib/booking-rules";
import type { Branch, Closure } from "@/lib/queries/site";
import { replyTime, shopEmail, site, time12 } from "@/lib/site-config";
import { getBranches, getClosures } from "@/lib/site-data";

export const metadata: Metadata = {
  title: { absolute: "Contact | VS Lens Mart, Indresham and Patelguda" },
  description: "Visit VS Lens Mart in Indresham or Patelguda, open 7 days. Call, WhatsApp or send us a message.",
  alternates: { canonical: "/contact" },
};

/* Contact (Requirements_Contact.md), from mockups/contact.html: hero, quick
   actions, both branches with maps, the enquiry form, FAQ and the book band.
   Every shop fact comes from the branches table. */

const DAY_CODES: Record<string, string> = { Mon: "Mo", Tue: "Tu", Wed: "We", Thu: "Th", Fri: "Fr", Sat: "Sa", Sun: "Su" };
const directions = (b: Branch) => b.mapUrl ?? `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(`VS Lens Mart, ${b.address}`)}`;
const days = (b: Branch) => (b.openDays.length === 7 ? "Mon–Sun" : b.openDays.join(", "));
/** A closure's note without the seed's DUMMY marker (the tag shows it instead, in development). */
const cleanNote = (n: string | null) => (n ?? "").replace(/\s*\(DUMMY[^)]*\)/, "").trim();

/** OpticianStore data per branch for search engines; a placeholder phone is left out. */
function storeData(branches: Branch[]) {
  return branches.map((b) => ({
    "@context": "https://schema.org", "@type": "OpticianStore", name: `${site.name}, ${b.name}`,
    address: { "@type": "PostalAddress", streetAddress: b.address, addressRegion: "Telangana", addressCountry: "IN" },
    ...(b.dummy ? {} : { telephone: `+91${b.phone}` }),
    openingHours: `${b.openDays.map((d) => DAY_CODES[d]).join(",")} ${b.opens}-${b.closes}`.replace("Mo,Tu,We,Th,Fr,Sa,Su", "Mo-Su"),
    url: `${site.url}/contact#${b.slug}`,
  }));
}

function BranchCard({ b, closures }: { b: Branch; closures: Closure[] }) {
  const mine = closures.filter((c) => c.branchSlug === null || c.branchSlug === b.slug);
  const next = mine[0];
  return (
    <article className="branch" id={b.slug} aria-labelledby={`${b.slug}-name`}>
      <BranchMap name={b.name} address={`VS Lens Mart, ${b.address}`} />
      <div className="branch__body">
        <div className="branch__head">
          <h3 className="branch__name" id={`${b.slug}-name`}>{b.name}</h3>
          <OpenStatus opens={b.opens} closes={b.closes} openDays={b.openDays} closedDays={mine.map((c) => c.day)} />
        </div>
        <p className="branch__row"><Icon name="pin" /><span>{b.address}</span></p>
        <p className="branch__row"><Icon name="clock" /><span>
          {days(b)} · {time12(b.opens)}–{time12(b.closes)}
          {next && <><br />Closed on {dayLabel(next.day)}{cleanNote(next.note) && ` (${cleanNote(next.note)})`} <DummyTag id="D3" /></>}
        </span></p>
        <p className="branch__row"><Icon name="phone" /><span>{b.dummy ? "+91 00000 00000" : b.phone}{b.dummy && <> <DummyTag id="D2" /></>}</span></p>
        <ul className="pill-list" aria-label={`Services at ${b.name}`}>{eyeCareServices.map((s) => <li key={s.label}>{s.label}</li>)}</ul>
        <div className="branch__actions">
          <a className="btn btn--outline-dark" href={directions(b)} target="_blank" rel="noopener noreferrer" aria-label={`Directions to the ${b.name} branch`}><Icon name="pin" className="icon icon--sm" />Directions</a>
          <BranchLink b={b} kind="call" className="btn btn--outline-dark" label={`Call the ${b.name} branch`}>Call</BranchLink>
          <BranchLink b={b} kind="whatsapp" className="btn btn--outline-dark" label={`WhatsApp the ${b.name} branch`} text={`Hi VS Lens Mart, I have a question for the ${b.name} branch.`}>WhatsApp</BranchLink>
        </div>
      </div>
    </article>
  );
}

export default async function ContactPage() {
  const [branches, closures] = await Promise.all([getBranches(), getClosures()]);
  const hours = hoursLine(branches);
  const formProps = { branches, email: shopEmail, replyTime, hours };
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(storeData(branches)).replace(/</g, "\\u003c") }} />

      <section className="hero hero--page" aria-labelledby="contact-title">
        <div className="container hero__inner">
          <nav aria-label="Breadcrumb"><ol className="crumbs"><li><Link href="/">Home</Link></li><li aria-current="page">Contact</li></ol></nav>
          <p className="eyebrow"><span>CONTACT</span></p>
          <h1 className="hero__title" id="contact-title">Visit us or <span className="gold">say hello.</span></h1>
          <p className="hero__sub">{branches.length === 2 ? "Two branches" : `${branches.length} branches`}, {hours.replace(/^Open/, "open")}.</p>
        </div>
      </section>

      <section className="quick" aria-label="Quick contact">
        <div className="container">
          <div className="quick__grid quick__grid--3">
            <PickerButton kind="whatsapp" className="quick__card">
              <span className="quick__icon"><Icon name="wa" /></span>
              <span><span className="quick__title">WhatsApp us</span><span className="quick__text">The quickest way to reach us.</span></span>
              <Icon name="arrow" />
            </PickerButton>
            <PickerButton kind="call" className="quick__card">
              <span className="quick__icon"><Icon name="phone" /></span>
              <span><span className="quick__title">Call us</span><span className="quick__text">Talk to the branch{branches[0] ? `, ${time12(branches[0].opens)}–${time12(branches[0].closes)}` : ""}.</span></span>
              <Icon name="arrow" />
            </PickerButton>
            <Link className="quick__card" href="/book-eye-test">
              <span className="quick__icon"><Icon name="eye" /></span>
              <span><span className="quick__title">Book an eye test</span><span className="quick__text">Pick a branch, a day and a time.</span></span>
              <Icon name="arrow" />
            </Link>
          </div>
        </div>
      </section>

      <section className="section" aria-labelledby="branches-title" id="branches">
        <Reveal className="container">
          <div className="section__head">
            <div>
              <p className="caps section__eyebrow">Visit us</p>
              <h2 className="section__title" id="branches-title">Our branches</h2>
            </div>
          </div>
          <div className="branches">{branches.map((b) => <BranchCard key={b.slug} b={b} closures={closures} />)}</div>
        </Reveal>
      </section>

      <section className="section section--white" aria-labelledby="msg-title" id="message">
        <div className="container">
          <div className="section__head">
            <div>
              <p className="caps section__eyebrow">Write to us</p>
              <h2 className="section__title" id="msg-title">Send us a message</h2>
            </div>
          </div>
          {/* ?topic=&frame= apply as soon as the address is read */}
          <Suspense fallback={<EnquiryFormPlain {...formProps} />}>
            <EnquiryForm {...formProps} />
          </Suspense>
        </div>
      </section>

      <section className="section" aria-labelledby="faq-title" id="faq">
        <Reveal className="container">
          <div className="section__head"><div><h2 className="section__title" id="faq-title">Before you visit</h2></div></div>
          <div className="faq">
            <details><summary>Do I need an appointment?</summary><div className="faq__answer"><p>Booking a time means less waiting. You can <Link href="/book-eye-test">book an eye test online</Link> or on WhatsApp.</p></div></details>
            <details><summary>Can I get my frame repaired?</summary><div className="faq__answer"><p>Yes. Both branches do frame repairs and adjustments.</p></div></details>
            <details><summary>Do both branches have the same frames?</summary><div className="faq__answer"><p>Many frames are at both, but some are at one branch only. Each frame&apos;s page shows where it&apos;s available, or ask us before you visit.</p></div></details>
            <details><summary>How can I pay?</summary><div className="faq__answer"><p>Cash and UPI.</p></div></details>
          </div>
        </Reveal>
      </section>

      <section className="book-band" aria-labelledby="cta-title">
        <div className="container book-band__inner">
          <div>
            <h2 id="cta-title">Ready for an eye test?</h2>
            <p>It takes 5–20 minutes, at either branch.</p>
          </div>
          <div className="hero__actions">
            <Link className="btn btn--navy" href="/book-eye-test">Book an eye test</Link>
            <Link className="btn btn--outline-dark" href="/frames">Explore our frames</Link>
          </div>
        </div>
      </section>
    </>
  );
}
