"use client";

import { FormEvent, useEffect, useRef, useState } from "react";
import RetentionChat from "./RetentionChat";

function Starfield() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const context = canvas.getContext("2d");
    if (!context) return;

    const reducedMotion = matchMedia("(prefers-reduced-motion: reduce)").matches;
    const pointer = { x: -1000, y: -1000, active: false };
    let width = 0;
    let height = 0;
    let frame = 0;
    let stars: Array<{ x: number; y: number; size: number; speed: number; phase: number; drift: number; color: string; depth: number }> = [];

    const createStars = () => {
      const palette = ["145,178,255", "196,176,255", "255,142,188", "255,211,111", "177,218,255"];
      const count = Math.min(360, Math.max(140, Math.floor((width * height) / 5200)));
      stars = Array.from({ length: count }, () => ({
        x: Math.random() * width,
        y: Math.random() * height,
        size: Math.random() < 0.08 ? Math.random() * 1.65 + 1.1 : Math.random() * 0.75 + 0.25,
        speed: Math.random() * 0.12 + 0.025,
        phase: Math.random() * Math.PI * 2,
        drift: (Math.random() - 0.5) * 0.045,
        color: palette[Math.floor(Math.random() * palette.length)],
        depth: Math.random() * 0.7 + 0.3,
      }));
    };

    const resize = () => {
      const ratio = Math.min(devicePixelRatio || 1, 2);
      width = innerWidth;
      height = innerHeight;
      canvas.width = width * ratio;
      canvas.height = height * ratio;
      canvas.style.width = `${width}px`;
      canvas.style.height = `${height}px`;
      context.setTransform(ratio, 0, 0, ratio, 0, 0);
      createStars();
    };

    const onMove = (event: PointerEvent) => {
      pointer.x = event.clientX;
      pointer.y = event.clientY;
      pointer.active = true;
    };
    const onLeave = () => { pointer.active = false; };

    const draw = (time = 0) => {
      context.clearRect(0, 0, width, height);
      for (const star of stars) {
        if (!reducedMotion) {
          star.y += star.speed;
          star.x += star.drift;
          if (star.y > height + 4) star.y = -4;
          if (star.x > width + 4) star.x = -4;
          if (star.x < -4) star.x = width + 4;
        }

        let drawX = star.x;
        let drawY = star.y;
        let angle = 0;
        let influence = 0;
        if (pointer.active && !reducedMotion) {
          const dx = star.x - pointer.x;
          const dy = star.y - pointer.y;
          const distance = Math.hypot(dx, dy);
          influence = Math.max(0, 1 - distance / 190);
          if (influence > 0) {
            const swirl = influence * influence * 18 * star.depth;
            angle = Math.atan2(dy, dx) + Math.PI / 2;
            drawX += Math.cos(angle) * swirl + (dx / Math.max(distance, 1)) * influence * 8;
            drawY += Math.sin(angle) * swirl + (dy / Math.max(distance, 1)) * influence * 8;
          }
        }

        const twinkle = (0.25 + Math.sin(time * 0.001 + star.phase) * 0.12) * star.depth;
        const radius = star.size * (1 + influence * 0.8);
        context.save();
        context.translate(drawX, drawY);
        context.fillStyle = `rgba(${star.color},${twinkle + influence * 0.35})`;
        if (radius > 1.25 || influence > 0.55) {
          context.shadowColor = `rgba(${star.color},.8)`;
          context.shadowBlur = 5 + influence * 8;
        }
        context.beginPath();
        context.arc(0, 0, radius, 0, Math.PI * 2);
        context.fill();
        context.restore();
      }
      frame = requestAnimationFrame(draw);
    };

    resize();
    addEventListener("resize", resize);
    addEventListener("pointermove", onMove, { passive: true });
    document.addEventListener("pointerleave", onLeave);
    frame = requestAnimationFrame(draw);
    return () => {
      cancelAnimationFrame(frame);
      removeEventListener("resize", resize);
      removeEventListener("pointermove", onMove);
      document.removeEventListener("pointerleave", onLeave);
    };
  }, []);

  return <canvas ref={canvasRef} className="starfield" aria-hidden="true" />;
}

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
  { type: "Beauty brand", brand: "LUMA", mark: "L", tags: ["SKINCARE", "LIFECYCLE"], signal: "+18% AOV", stat: "42%", label: "customer lifetime value growth", tone: "violet" },
  { type: "Fashion retailer", brand: "FORM", mark: "F", tags: ["APPAREL", "LOYALTY"], signal: "2.4× REPEAT", stat: "35%", label: "increase in repeat purchases", tone: "lime" },
  { type: "Food subscription", brand: "DAILY", mark: "D", tags: ["SUBSCRIPTION", "WIN-BACK"], signal: "−16% CAC", stat: "28%", label: "churn reduction", tone: "blue" },
  { type: "D2C brand", brand: "NORTH", mark: "N", tags: ["COMMERCE", "WHATSAPP"], signal: "+31% CVR", stat: "3×", label: "ROI through WhatsApp automation", tone: "dark" },
];

const lifecycle = ["First purchase", "Engagement", "Repeat purchase", "Loyalty", "Revenue growth"];
const lifecycleIcons = [
  { main: "01", badges: ["BAG", "NEW"] },
  { main: "02", badges: ["♡", "OPEN"] },
  { main: "03", badges: ["↻", "2ND"] },
  { main: "04", badges: ["★", "VIP"] },
  { main: "05", badges: ["↗", "LTV"] },
];
const processSteps = [
  { n: "01", name: "Diagnose", desc: "Audit the data, journeys, creative and economics.", detail: "We identify lifecycle leaks, measurement gaps and the highest-value opportunities.", output: "Opportunity map", duration: "WEEK 01", bars: [48, 72, 38] },
  { n: "02", name: "Design", desc: "Map the lifecycle and prioritize the biggest levers.", detail: "Every channel, trigger and message gets a clear role in the customer relationship.", output: "Journey blueprint", duration: "WEEK 02", bars: [68, 44, 82] },
  { n: "03", name: "Deploy", desc: "Build, test and launch the connected experience.", detail: "We turn the blueprint into production-ready flows, campaigns and measurement.", output: "Live retention system", duration: "WEEKS 03–04", bars: [35, 64, 94] },
  { n: "04", name: "Compound", desc: "Measure, learn and improve every cycle.", detail: "A continuous testing rhythm converts customer behavior into stronger performance.", output: "Growth cadence", duration: "ONGOING", bars: [78, 91, 63] },
];
const integrations = ["KLAVIYO", "SHOPIFY", "GUPSHUP", "CLEVERTAP", "MOENGAGE", "RAZORPAY"];

function Arrow() { return <span aria-hidden="true">↗</span>; }

export default function Home() {
  const [menu, setMenu] = useState(false);
  const [sending, setSending] = useState(false);
  const [result, setResult] = useState("");
  const engine = useRef<HTMLDivElement>(null);
  const manifest = useRef<HTMLElement>(null);
  const servicesSection = useRef<HTMLElement>(null);
  const servicesTrack = useRef<HTMLDivElement>(null);
  const lifecycleSection = useRef<HTMLElement>(null);
  const workSection = useRef<HTMLElement>(null);
  const whySection = useRef<HTMLElement>(null);
  const processSection = useRef<HTMLElement>(null);

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

  useEffect(() => {
    const section = processSection.current;
    if (!section) return;
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          section.classList.add("is-visible");
          observer.disconnect();
        }
      },
      { threshold: 0.2 },
    );
    observer.observe(section);
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    const section = whySection.current;
    if (!section) return;
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          section.classList.add("is-visible");
          observer.disconnect();
        }
      },
      { threshold: 0.22 },
    );
    observer.observe(section);
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    const section = workSection.current;
    if (!section) return;
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          section.classList.add("is-visible");
          observer.disconnect();
        }
      },
      { threshold: 0.16 },
    );
    observer.observe(section);
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    const section = lifecycleSection.current;
    if (!section) return;
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) section.classList.add("is-visible");
      },
      { threshold: 0.18 },
    );
    observer.observe(section);
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    const section = servicesSection.current;
    const track = servicesTrack.current;
    if (!section || !track) return;
    let ticking = false;
    const update = () => {
      ticking = false;
      if (innerWidth <= 900) {
        track.style.transform = "";
        return;
      }
      const rect = section.getBoundingClientRect();
      const distance = section.offsetHeight - innerHeight;
      const progress = Math.min(1, Math.max(0, -rect.top / Math.max(distance, 1)));
      const travel = Math.max(0, track.scrollWidth - innerWidth + 64);
      track.style.transform = `translate3d(${-progress * travel}px,0,0)`;
    };
    const onScroll = () => {
      if (!ticking) {
        ticking = true;
        requestAnimationFrame(update);
      }
    };
    addEventListener("scroll", onScroll, { passive: true });
    addEventListener("resize", onScroll);
    update();
    return () => {
      removeEventListener("scroll", onScroll);
      removeEventListener("resize", onScroll);
    };
  }, []);

  useEffect(() => {
    const section = manifest.current;
    if (!section) return;
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          section.classList.add("is-visible");
          observer.disconnect();
        }
      },
      { threshold: 0.28 },
    );
    observer.observe(section);
    return () => observer.disconnect();
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
      <Starfield />
      <nav className="nav shell">
        <a className="logo" href="#top" aria-label="RetentionMax home"><span>R</span>RetentionMax</a>
        <button className="menu" onClick={() => setMenu(!menu)} aria-label="Toggle navigation">MENU</button>
        <div className={`links ${menu ? "open" : ""}`}>
          <a href="/services">Services</a><a href="/about">About</a><a href="#work">Work</a><a href="#process">Process</a>
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

      <div className="ribbon-stage" aria-label="Retention channels and lifecycle">
        <div className="marquee diagonal purple"><div>{["EMAIL MARKETING","WHATSAPP","SMS","WEB PUSH","SEGMENTATION","AUTOMATION","EMAIL MARKETING","WHATSAPP"].map((x,i)=><span key={i}>{x} ✦ </span>)}</div></div>
        <div className="marquee diagonal lime-band"><div>{["FIRST PURCHASE","ENGAGEMENT","REPEAT PURCHASE","LOYALTY","REVENUE GROWTH","FIRST PURCHASE"].map((x,i)=><span key={i}>{x} → </span>)}</div></div>
      </div>

      <section className="manifest shell" id="approach" ref={manifest}>
        <span className="section-no">02 / THE SHIFT</span>
        <h2>
          <span className="manifest-line">Acquisition gets the first sale.</span>
          <span className="manifest-line"><em>Retention builds the business.</em></span>
        </h2>
        <p className="manifest-line">We connect customer data, channel strategy and sharp creative into one operating system for compounding growth.</p>
      </section>

      <section className="services-scroll" id="services" ref={servicesSection}>
        <div className="services-sticky">
          <div className="services-title shell">
            <span className="section-no">03 / WHAT WE BUILD</span>
            <h2>One connected<br /><em>retention system.</em></h2>
            <p>Scroll to move through the channels, intelligence and automation that turn customer signals into lasting growth.</p>
          </div>
          <div className="service-track" ref={servicesTrack}>
            {services.map((service, index) => (
              <article className={`service-card service-card-${index + 1}`} key={service.name}>
                <div className="service-card-art"><i/><i/><i/><b>{service.tag}</b></div>
                <span className="service-kicker">{service.metric}</span>
                <h3>{service.name}</h3>
                <p>{service.desc}</p>
                <div className="service-card-foot"><span>{service.tag}</span><b>{service.n}</b></div>
              </article>
            ))}
          </div>
          <div className="scroll-cue shell"><span>SCROLL TO EXPLORE</span><i/></div>
        </div>
      </section>

      <section className="lifecycle" aria-label="Customer lifecycle" ref={lifecycleSection}>
        <div className="shell section-head"><span className="section-no">04 / LIFECYCLE</span><h2>Every message should<br />move the relationship.</h2></div>
        <div className="journey">
          {lifecycle.map((x,i)=><article key={x} style={{"--delay":`${i * 120}ms`} as React.CSSProperties}>
            <span>0{i+1}</span>
            <div className="journey-dot">{i===4 ? "↗":"+"}</div>
            <div className="journey-visual" aria-hidden="true">
              <div className="journey-orbit"><i/><i/></div>
              <b>{lifecycleIcons[i].main}</b>
              <small className="journey-badge badge-a">{lifecycleIcons[i].badges[0]}</small>
              <small className="journey-badge badge-b">{lifecycleIcons[i].badges[1]}</small>
            </div>
            <h3>{x}</h3>
            <p>{["A considered welcome turns intent into momentum.","Behavior signals guide the next useful interaction.","Relevance, timing and trust earn order number two.","Recognition makes your best customers feel known.","More value per customer creates healthier growth."][i]}</p>
          </article>)}
        </div>
      </section>

      <section className="metrics shell">
        <div><span>WE OPTIMIZE FOR</span><h2>Growth that gets<br /><em>stronger</em> over time.</h2></div>
        <div className="metric"><b>02</b><p>The second purchase is the moment acquisition becomes a relationship.</p></div>
        <div className="metric"><b>∞</b><p>Customer value compounds when journeys keep learning.</p></div>
      </section>

      <section className="work shell" id="work" ref={workSection}>
        <div className="section-head row"><div><span className="section-no">05 / SELECTED OUTCOMES</span><h2>Retention in<br />the real world.</h2></div><p>Selected illustrative case-study content.<br />Replace with verified CMS data before publishing claims.</p></div>
        <div className="case-grid">
          {cases.map((c,i)=><article className={`case ${c.tone}`} style={{"--case-delay":`${i * 140}ms`} as React.CSSProperties} key={c.type}>
            <div className="case-top"><span>0{i+1} / {c.type}</span><Arrow /></div>
            <div className="case-brand"><b>{c.mark}</b><span>{c.brand}<small>ILLUSTRATIVE BRAND</small></span></div>
            <div className="case-art"><img src="/case-orbit.png" alt="" loading="lazy"/><i/><i/><strong>{c.mark}</strong></div>
            <div className="case-signal">{c.signal}<i>↗</i></div>
            <div className="case-tags">{c.tags.map(tag=><span key={tag}>{tag}</span>)}</div>
            <b>{c.stat}</b><h3>{c.label}</h3><small>EDITABLE CMS CONTENT</small>
          </article>)}
        </div>
      </section>

      <section className="why" ref={whySection}>
        <div className="shell why-grid"><div className="why-intro"><span className="section-no">06 / WHY RETENTIONMAX</span><h2>Strategy that sees<br />the whole customer.</h2>
          <div className="why-visual" aria-hidden="true"><div className="why-orbit"><i/><i/><i/></div><b>R</b><span className="why-pop pop-order">02 / REPEAT ORDER</span><span className="why-pop pop-ltv">LTV ↗</span><span className="why-pop pop-signal">LIVE SIGNAL</span></div>
        </div>
          <div className="reasons">{[["01","◎","Channel agnostic","We choose the right moment and medium, not a favorite tool."],["02","↗","Commercially grounded","Every journey connects to repeat rate, margin or lifetime value."],["03","✦","Built to learn","A testing rhythm turns customer behavior into your advantage."]].map((r,i)=><article key={r[0]} style={{"--reason-delay":`${i * 150}ms`} as React.CSSProperties}><span>{r[0]}</span><b className="reason-icon">{r[1]}</b><div><h3>{r[2]}</h3><p>{r[3]}</p></div></article>)}</div>
        </div>
      </section>

      <section className="process shell" id="process" ref={processSection}>
        <div className="section-head"><span className="section-no">07 / HOW IT WORKS</span><h2>From signal<br />to system.</h2></div>
        <p className="process-intro">A practical path from scattered customer signals to an always-improving retention engine.</p>
        <div className="steps">{processSteps.map((step,i)=><article key={step.n} tabIndex={0} style={{"--step-delay":`${i * 130}ms`} as React.CSSProperties}>
          <div className="step-top"><b>{step.n}</b><span>{step.duration}</span></div>
          <div className="step-line"><i style={{"--progress":`${(i+1)*25}%`} as React.CSSProperties}/></div>
          <div className="step-chart" aria-hidden="true">{step.bars.map((bar,j)=><i key={j} style={{"--bar":`${bar}%`,"--bar-delay":`${i * 130 + j * 90}ms`} as React.CSSProperties}/>)}</div>
          <h3>{step.name}</h3><p>{step.desc}</p>
          <div className="step-detail"><span>WHAT YOU GET</span><p>{step.detail}</p><b>{step.output}<i>↗</i></b></div>
          <small>HOVER OR FOCUS FOR DETAILS</small>
        </article>)}</div>
      </section>

      <section className="integration">
        <span>PLUGS INTO YOUR STACK</span>
        <div className="logo-ribbons" aria-label="Technology integrations">
          <div className="logo-ribbon ribbon-lime"><div>{integrations.concat(integrations).map((x,i)=><b key={i}><i>◉</i>{x}</b>)}</div></div>
          <div className="logo-ribbon ribbon-pink"><div>{integrations.slice().reverse().concat(integrations).map((x,i)=><b key={i}><i>✦</i>{x}</b>)}</div></div>
          <div className="logo-ribbon ribbon-blue"><div>{integrations.concat(integrations).map((x,i)=><b key={i}><i>◎</i>{x}</b>)}</div></div>
        </div>
      </section>

      <section className="masterclass shell" id="masterclass">
        <div className="course-art"><div className="course-orbit">RETENTION • REVENUE • RELATIONSHIPS •</div><b>R<span>M</span></b></div>
        <div className="course-copy"><span className="section-no">FREE MASTERCLASS / 38 MIN</span><h2>Why your customers<br />don’t come back.</h2><p>Learn the five lifecycle gaps quietly costing D2C brands repeat revenue—and the practical framework we use to fix them.</p>
          <div className="course-meta"><span><b>05</b> lifecycle gaps</span><span><b>01</b> practical framework</span><span><b>38</b> focused minutes</span></div>
          <a className="button light" href="#audit">Get free access <Arrow /></a>
        </div>
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
      <footer><div className="shell footer-top"><a className="logo" href="#top"><span>R</span>RetentionMax</a><p>Customer retention systems for brands<br />built to last.</p><div><a href="/services">Services</a><a href="/about">About</a><a href="#process">Process</a><a href="#audit">Contact</a></div></div><div className="footer-word">RETENTION<span>MAX</span></div><div className="shell legal"><span>© 2026 RETENTIONMAX</span><span>PRIVACY · TERMS · LINKEDIN</span><span>MADE FOR THE SECOND PURCHASE</span></div></footer>
      <RetentionChat />
    </main>
  );
}
