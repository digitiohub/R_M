"use client";

import { FormEvent, useEffect, useRef, useState } from "react";

const services = [
  { n: "01", name: "Email Marketing", desc: "Lifecycle email that feels personal at scale—from a considered welcome to the perfectly timed win-back.", metric: "Lifecycle orchestration", tag: "EMAIL" },
  { n: "02", name: "WhatsApp Marketing", desc: "High-intent conversations, automated thoughtfully around purchases, replenishment and support.", metric: "Conversational growth", tag: "WA" },
  { n: "03", name: "SMS Campaigns", desc: "Concise, well-timed messages built for urgency without eroding customer trust.", metric: "Timely conversion", tag: "SMS" },
  { n: "04", name: "Web Push", desc: "Bring known customers back with contextual reminders that complement—not compete with—your channels.", metric: "Re-engagement layer", tag: "PUSH" },
  { n: "05", name: "Segmentation", desc: "Turn behavioral and purchase data into living audiences your team can actually activate.", metric: "Sharper relevance", tag: "DATA" },
  { n: "06", name: "Automation", desc: "A connected journey system that reacts to what each customer does next.", metric: "Always-on journeys", tag: "FLOW" },
  { n: "07", name: "Retention Analytics", desc: "See what creates the second order, increases lifetime value and compounds over time.", metric: "Clear attribution", tag: "LTV" },
];

const cases = [
  { type: "Beauty brand", stat: "42%", label: "customer lifetime value growth", tone: "violet" },
  { type: "Fashion retailer", stat: "35%", label: "increase in repeat purchases", tone: "lime" },
  { type: "Food subscription", stat: "28%", label: "churn reduction", tone: "blue" },
  { type: "D2C brand", stat: "3×", label: "ROI through WhatsApp automation", tone: "dark" },
];

const lifecycle = ["First purchase", "Engagement", "Repeat purchase", "Loyalty", "Revenue growth"];
const integrations = ["KLAVIYO", "SHOPIFY", "GUPSHUP", "CLEVERTAP", "MOENGAGE", "RAZORPAY"];

function Arrow() { return <span aria-hidden="true">↗</span>; }

export default function Home() {
  const [active, setActive] = useState(0);
  const [menu, setMenu] = useState(false);
  const [sending, setSending] = useState(false);
  const [result, setResult] = useState("");
  const engine = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const onMove = (e: PointerEvent) => {
      if (!engine.current || matchMedia("(prefers-reduced-motion: reduce)").matches) return;
      const x = (e.clientX / innerWidth - .5) * 14;
      const y = (e.clientY / innerHeight - .5) * 10;
      engine.current.style.setProperty("--rx", `${-y}deg`);
      engine.current.style.setProperty("--ry", `${x}deg`);
    };
    addEventListener("pointermove", onMove, { passive: true });
    return () => removeEventListener("pointermove", onMove);
  }, []);

  async function submit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setSending(true); setResult("");
    const form = e.currentTarget;
    const data = Object.fromEntries(new FormData(form));
    try {
      const res = await fetch("/api/audit", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(data) });
      const json = await res.json() as { error?: string };
      if (!res.ok) throw new Error(json.error || "Please check your details.");
      setResult("You’re in. We’ll review your retention journey and reply within two business days.");
      form.reset();
    } catch (err) {
      setResult(err instanceof Error ? err.message : "Something went wrong. Please try again.");
    } finally { setSending(false); }
  }

  return (
    <main>
      <nav className="nav shell">
        <a className="logo" href="#top" aria-label="RetentionMax home"><span>R</span>RetentionMax</a>
        <button className="menu" onClick={() => setMenu(!menu)} aria-label="Toggle navigation">MENU</button>
        <div className={`links ${menu ? "open" : ""}`}>
          <a href="#services">Services</a><a href="#work">Work</a><a href="#process">Process</a><a href="#masterclass">Insights</a>
        </div>
        <a href="#audit" className="nav-cta">Free retention audit <Arrow /></a>
      </nav>

      <section className="hero shell" id="top">
        <div className="eyebrow"><i /> RETENTION, ENGINEERED FOR GROWTH</div>
        <h1>Turn first-time buyers<br />into <em>lifelong</em> customers.</h1>
        <p className="hero-copy">RetentionMax builds data-driven journeys across Email, WhatsApp, SMS and Web Push—helping brands grow repeat purchases, customer lifetime value and sustainable revenue.</p>
        <div className="hero-actions"><a className="button lime" href="#audit">Get your free retention audit <Arrow /></a><a className="text-link" href="#approach">Explore our approach ↓</a></div>
        <div className="engine-scene" ref={engine} aria-label="Animated retention growth engine">
          <div className="orbit orbit-one"><b className="channel c-email">@<small>EMAIL</small></b><b className="channel c-wa">◎<small>WHATSAPP</small></b></div>
          <div className="orbit orbit-two"><b className="channel c-sms">···<small>SMS</small></b><b className="channel c-push">↗<small>WEB PUSH</small></b></div>
          <div className="engine">
            <span className="engine-ring one" /><span className="engine-ring two" />
            <div className="engine-core"><i>R</i><small>RETENTION<br />ENGINE</small></div>
          </div>
          <div className="pulse p1" /><div className="pulse p2" />
        </div>
        <div className="hero-foot"><span>SCROLL TO BUILD THE LIFECYCLE</span><span>01 — 05</span></div>
      </section>

      <section className="signal">
        <div className="signal-cell"><b>+37%</b><span>Repeat purchase rate</span></div>
        <div className="signal-cell"><b>4.8×</b><span>Average campaign ROI</span></div>
        <div className="signal-cell"><b>−24%</b><span>Customer churn</span></div>
        <p>Illustrative performance indicators.<br />Actual results vary by brand.</p>
      </section>

      <div className="marquee diagonal purple"><div>{["EMAIL MARKETING","WHATSAPP","SMS","WEB PUSH","SEGMENTATION","AUTOMATION"].map((x,i)=><span key={i}>{x} ✦ </span>)}</div></div>
      <div className="marquee diagonal lime-band"><div>{["FIRST PURCHASE","ENGAGEMENT","REPEAT PURCHASE","LOYALTY","REVENUE GROWTH"].map((x,i)=><span key={i}>{x} → </span>)}</div></div>

      <section className="manifest shell" id="approach">
        <span className="section-no">02 / THE SHIFT</span>
        <h2>Acquisition gets the first sale.<br /><em>Retention builds the business.</em></h2>
        <p>We connect customer data, channel strategy and sharp creative into one operating system for compounding growth.</p>
      </section>

      <section className="services shell" id="services">
        <div className="section-head"><span className="section-no">03 / WHAT WE BUILD</span><h2>One connected<br />retention system.</h2></div>
        <div className="services-grid">
          <div className="accordion">
            {services.map((s,i)=><button key={s.name} className={active===i ? "active":""} onClick={()=>setActive(i)} aria-expanded={active===i}>
              <span>{s.n}</span><strong>{s.name}</strong><i>{active===i ? "−":"+"}</i>
              {active===i && <p>{s.desc}</p>}
            </button>)}
          </div>
          <div className="service-visual">
            <div className="visual-top"><span>LIVE SYSTEM</span><b>{services[active].tag}</b></div>
            <div className="radar"><i/><i/><i/><div><span>{services[active].n}</span>{services[active].name}</div></div>
            <div className="visual-bottom"><span>OUTCOME</span><strong>{services[active].metric}</strong></div>
          </div>
        </div>
      </section>

      <section className="lifecycle" aria-label="Customer lifecycle">
        <div className="shell section-head"><span className="section-no">04 / LIFECYCLE</span><h2>Every message should<br />move the relationship.</h2></div>
        <div className="journey">
          {lifecycle.map((x,i)=><article key={x}><span>0{i+1}</span><div className="journey-dot">{i===4 ? "↗":"+"}</div><h3>{x}</h3><p>{["A considered welcome turns intent into momentum.","Behavior signals guide the next useful interaction.","Relevance, timing and trust earn order number two.","Recognition makes your best customers feel known.","More value per customer creates healthier growth."][i]}</p></article>)}
        </div>
      </section>

      <section className="metrics shell">
        <div><span>WE OPTIMIZE FOR</span><h2>Growth that gets<br /><em>stronger</em> over time.</h2></div>
        <div className="metric"><b>02</b><p>The second purchase is the moment acquisition becomes a relationship.</p></div>
        <div className="metric"><b>∞</b><p>Customer value compounds when journeys keep learning.</p></div>
      </section>

      <section className="work shell" id="work">
        <div className="section-head row"><div><span className="section-no">05 / SELECTED OUTCOMES</span><h2>Retention in<br />the real world.</h2></div><p>Selected illustrative case-study content.<br />Replace with verified CMS data before publishing claims.</p></div>
        <div className="case-grid">
          {cases.map((c,i)=><article className={`case ${c.tone}`} key={c.type}><div className="case-top"><span>0{i+1} / {c.type}</span><Arrow /></div><div className="case-art"><i/><i/><i/></div><b>{c.stat}</b><h3>{c.label}</h3><small>EDITABLE CMS CONTENT</small></article>)}
        </div>
      </section>

      <section className="why">
        <div className="shell why-grid"><div><span className="section-no">06 / WHY RETENTIONMAX</span><h2>Strategy that sees<br />the whole customer.</h2></div>
          <div className="reasons">{[["01","Channel agnostic","We choose the right moment and medium, not a favorite tool."],["02","Commercially grounded","Every journey connects to repeat rate, margin or lifetime value."],["03","Built to learn","A testing rhythm turns customer behavior into your advantage."]].map(r=><article key={r[0]}><span>{r[0]}</span><div><h3>{r[1]}</h3><p>{r[2]}</p></div></article>)}</div>
        </div>
      </section>

      <section className="process shell" id="process">
        <div className="section-head"><span className="section-no">07 / HOW IT WORKS</span><h2>From signal<br />to system.</h2></div>
        <div className="steps">{[["01","Diagnose","Audit the data, journeys, creative and economics."],["02","Design","Map the lifecycle and prioritize the biggest levers."],["03","Deploy","Build, test and launch the connected experience."],["04","Compound","Measure, learn and improve every cycle."]].map((x,i)=><article key={x[0]}><b>{x[0]}</b><div className="step-line"><i style={{width:`${(i+1)*25}%`}}/></div><h3>{x[1]}</h3><p>{x[2]}</p></article>)}</div>
      </section>

      <section className="integration"><span>PLUGS INTO YOUR STACK</span><div className="marquee"><div>{integrations.concat(integrations).map((x,i)=><b key={i}>{x} <i>×</i></b>)}</div></div></section>

      <section className="masterclass shell" id="masterclass">
        <div className="course-art"><div className="course-orbit">RETENTION • REVENUE • RELATIONSHIPS •</div><b>R<span>M</span></b></div>
        <div className="course-copy"><span className="section-no">FREE MASTERCLASS / 38 MIN</span><h2>Why your customers<br />don’t come back.</h2><p>Learn the five lifecycle gaps quietly costing D2C brands repeat revenue—and the practical framework we use to fix them.</p><a className="button light" href="#audit">Get free access <Arrow /></a></div>
      </section>

      <section className="testimonial shell">
        <span className="quote">“</span><blockquote>RetentionMax helped us stop thinking in campaigns and start thinking in customer journeys.</blockquote>
        <div><b>PLACEHOLDER TESTIMONIAL</b><span>Replace with verified client quote and attribution</span></div>
      </section>

      <section className="audit" id="audit">
        <div className="shell audit-grid"><div className="audit-copy"><span className="section-no">09 / FREE RETENTION AUDIT</span><h2>Find the revenue<br />already in your<br /><em>customer base.</em></h2><p>We’ll assess your lifecycle, identify missed retention opportunities and share the clearest next moves. No generic deck. No hard sell.</p><div className="audit-badge"><b>FREE</b><span>Personalized<br />retention teardown</span></div></div>
          <form onSubmit={submit}>
            <div className="form-row"><label>Name *<input name="name" required minLength={2} placeholder="Your name" /></label><label>Company *<input name="company" required placeholder="Brand name" /></label></div>
            <div className="form-row"><label>Work email *<input name="email" type="email" required placeholder="you@company.com" /></label><label>Phone number *<input name="phone" required minLength={7} placeholder="+91 98765 43210" /></label></div>
            <label>Website URL *<input name="website" type="url" required placeholder="https://yourbrand.com" /></label>
            <div className="form-row"><label>Monthly order volume *<select name="orderVolume" required defaultValue=""><option value="" disabled>Select range</option><option>Under 1,000</option><option>1,000–5,000</option><option>5,000–20,000</option><option>20,000+</option></select></label><label>Existing platforms<input name="platforms" placeholder="Klaviyo, Shopify…" /></label></div>
            <label>Primary retention challenge *<textarea name="challenge" required minLength={10} placeholder="What’s keeping customers from coming back?" /></label>
            <label className="consent"><input type="checkbox" name="consent" value="true" required /> I agree to be contacted about my retention audit and accept the privacy policy.</label>
            <button className="button lime submit" disabled={sending}>{sending ? "Building your audit…" : "Get my free audit"} <Arrow /></button>
            <p className="form-result" role="status">{result}</p>
          </form>
        </div>
      </section>

      <section className="final-cta shell"><span>READY WHEN YOU ARE</span><h2>Make the next<br />purchase <em>inevitable.</em></h2><a href="#audit" className="round-cta">LET’S GROW <Arrow /></a></section>
      <footer><div className="shell footer-top"><a className="logo" href="#top"><span>R</span>RetentionMax</a><p>Customer retention systems for brands<br />built to last.</p><div><a href="#services">Services</a><a href="#work">Work</a><a href="#process">Process</a><a href="#audit">Contact</a></div></div><div className="footer-word">RETENTION<span>MAX</span></div><div className="shell legal"><span>© 2026 RETENTIONMAX</span><span>PRIVACY · TERMS · LINKEDIN</span><span>MADE FOR THE SECOND PURCHASE</span></div></footer>
    </main>
  );
}
