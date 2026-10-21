"use client";

import { useEffect, useRef, useState } from "react";
import RetentionChat from "../RetentionChat";

const serviceDetails = [
  { n:"01", slug:"email", tag:"EMAIL", icon:"/service-icons/email.svg", name:"Email Marketing", line:"Lifecycle depth, delivered personally.", desc:"We build email systems that welcome, educate, convert and win customers back—using behavior, purchase history and timing to make every message more relevant.", deliverables:["Lifecycle strategy","Flow architecture","Campaign calendar","Creative direction"], metrics:["Repeat rate","Revenue per recipient","Flow contribution"], color:"violet" },
  { n:"02", slug:"whatsapp", tag:"WA", icon:"/service-icons/whatsapp.svg", name:"WhatsApp Marketing", line:"High-intent conversations at the right moment.", desc:"Permission-led WhatsApp journeys for purchase assistance, post-purchase education, replenishment, support, loyalty and win-back—coordinated with every other channel.", deliverables:["Conversation map","Template strategy","Automation logic","Frequency governance"], metrics:["Response rate","Conversion rate","Assisted revenue"], color:"lime" },
  { n:"03", slug:"sms", tag:"SMS", icon:"/service-icons/sms.svg", name:"SMS Campaigns", line:"Urgency without exhausting attention.", desc:"A precise SMS layer for moments where speed matters. We define when a text earns its place and ensure it complements—not duplicates—your email and WhatsApp program.", deliverables:["Moment selection","Message system","Send governance","Test roadmap"], metrics:["Click rate","Conversion lift","Opt-out health"], color:"pink" },
  { n:"04", slug:"push", tag:"PUSH", icon:"/service-icons/push.svg", name:"Web Push", line:"Bring known customers back into motion.", desc:"Contextual browser notifications for product interest, price changes, inventory, replenishment and timely content—built to create useful return visits.", deliverables:["Permission journey","Trigger library","Message templates","Performance testing"], metrics:["Return visits","Click-through rate","Recovered revenue"], color:"blue" },
  { n:"05", slug:"segmentation", tag:"DATA", icon:"/service-icons/segmentation.svg", name:"Segmentation", line:"Turn customer data into living audiences.", desc:"We translate transactions and behavior into clear, usable segments your team can activate across the lifecycle, with definitions that stay useful as the business changes.", deliverables:["Data audit","Segment framework","Audience rules","Activation map"], metrics:["Audience coverage","Segment lift","Personalization reach"], color:"gold" },
  { n:"06", slug:"automation", tag:"FLOW", icon:"/service-icons/automation.svg", name:"Automation", line:"A journey system that reacts to what happens next.", desc:"Connected automations that respond to customer signals across channels. Every trigger, delay, branch and message has a defined job in moving the relationship forward.", deliverables:["Journey blueprint","Trigger logic","Cross-channel build","QA framework"], metrics:["Automation revenue","Journey completion","Time to repeat"], color:"violet" },
  { n:"07", slug:"analytics", tag:"LTV", icon:"/service-icons/analytics.svg", name:"Retention Analytics", line:"Know what creates order number two.", desc:"Measurement designed around the commercial questions that matter: what drives repeat purchase, reduces churn, increases lifetime value and deserves the next investment.", deliverables:["Measurement plan","Retention dashboard","Cohort analysis","Test reporting"], metrics:["Customer LTV","Cohort retention","Incremental revenue"], color:"lime" },
];

export default function ServicesPage() {
  const page = useRef<HTMLElement>(null);
  const [menu, setMenu] = useState(false);
  useEffect(() => {
    const root = page.current;
    if (!root) return;
    const observer = new IntersectionObserver(entries => entries.forEach(entry => entry.isIntersecting && entry.target.classList.add("service-visible")), { threshold:.18 });
    root.querySelectorAll("[data-reveal]").forEach(node => observer.observe(node));
    return () => observer.disconnect();
  }, []);

  return <main className="services-page" ref={page}>
    <nav className="nav shell">
      <a className="logo" href="/" aria-label="RetentionMax home"><img src="/retentionmax-logo.png" alt="RetentionMax" width="404" height="176" /></a>
      <button className="menu" onClick={() => setMenu(!menu)} aria-label="Toggle navigation">MENU</button>
      <div className={`links ${menu ? "open" : ""}`}><a href="/services">Services</a><a href="/about">About</a><a href="/#work">Work</a><a href="/#process">Process</a></div>
      <a href="/#audit" className="nav-cta">Free retention audit <span aria-hidden="true">↗</span></a>
    </nav>

    <header className="services-hero shell">
      <span className="services-kicker"><i/> RETENTION CAPABILITIES / 01—07</span>
      <h1>Seven services.<br/><em>One relationship system.</em></h1>
      <div className="services-hero-bottom"><p>Strategy, creative, technology and measurement—connected around the moments that turn a first purchase into durable customer value.</p><a href="#service-01">EXPLORE THE SYSTEM <span>↓</span></a></div>
      <div className="services-hero-orbit" aria-hidden="true"><i/><i/><i/><b>07</b><span>CONNECTED<br/>CAPABILITIES</span></div>
    </header>

    <div className="services-ticker"><div>{serviceDetails.concat(serviceDetails).map((s,i)=><span key={i}>{s.name} <i>✦</i></span>)}</div></div>

    <aside className="services-index" aria-label="Service navigation">{serviceDetails.map(service=><a href={`#service-${service.n}`} key={service.n}><span>{service.n}</span>{service.tag}</a>)}</aside>

    <section className="services-stories">
      {serviceDetails.map((service,index)=><article id={`service-${service.n}`} className={`service-story story-${service.color}`} data-reveal key={service.name}>
        <div className="service-story-grid shell">
          <div className="story-copy"><span className="story-number">{service.n} / {service.tag}</span><h2>{service.name}</h2><h3>{service.line}</h3><p>{service.desc}</p><a href="/#audit">Discuss this service <span>↗</span></a></div>
          <div className="story-visual" aria-hidden="true"><div className="story-rings"><i/><i/><i/><b><img src={service.icon} alt=""/></b></div><div className="story-signal signal-a">SIGNAL / {String(index+3).padStart(2,"0")}</div><div className="story-signal signal-b">LIVE ↗</div></div>
          <div className="story-details"><div><span>WHAT WE BUILD</span>{service.deliverables.map(item=><p key={item}>+ {item}</p>)}</div><div><span>WHAT WE MEASURE</span>{service.metrics.map(item=><p key={item}>↗ {item}</p>)}</div></div>
        </div>
      </article>)}
    </section>

    <section className="services-close"><div className="shell" data-reveal><span>NOT SURE WHERE TO START?</span><h2>Start with the customer.<br/><em>We’ll map the system.</em></h2><p>A focused retention audit will identify the clearest opportunities across your lifecycle, channels and data.</p><a href="/#audit">Get your free retention audit <span>↗</span></a></div></section>
    <footer><div className="shell footer-top"><a className="logo" href="/"><img src="/retentionmax-logo.png" alt="RetentionMax" width="404" height="176" /></a><p>Customer retention systems for brands<br/>built to last.</p><div><a href="/services">Services</a><a href="/about">About</a><a href="/#process">Process</a><a href="/#audit">Contact</a></div></div><div className="footer-word">RETENTION<span>MAX</span></div><div className="shell legal"><span>© 2026 RETENTIONMAX</span><span>PRIVACY · TERMS · LINKEDIN</span><span>MADE FOR THE SECOND PURCHASE</span></div></footer>
    <RetentionChat />
  </main>;
}
