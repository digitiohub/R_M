"use client";

import { useEffect, useRef, useState } from "react";
import RetentionChat from "../RetentionChat";

const founders = [
  { n:"01", initials:"CS", role:"Co-founder / Strategy", focus:"Customer strategy, lifecycle architecture and commercial growth.", skills:["RETENTION STRATEGY","CUSTOMER LTV","GROWTH SYSTEMS"], tone:"violet" },
  { n:"02", initials:"CX", role:"Co-founder / Experience", focus:"Creative systems, channel experience and journey execution.", skills:["CREATIVE DIRECTION","AUTOMATION","EXPERIENCE DESIGN"], tone:"lime" },
];

export default function AboutPage() {
  const root = useRef<HTMLElement>(null);
  const [menu,setMenu] = useState(false);
  useEffect(() => {
    const page = root.current;
    if (!page) return;
    const observer = new IntersectionObserver(entries => entries.forEach(entry => entry.isIntersecting && entry.target.classList.add("about-visible")),{threshold:.18});
    page.querySelectorAll("[data-about-reveal]").forEach(node => observer.observe(node));
    return () => observer.disconnect();
  },[]);

  return <main className="about-page" ref={root}>
    <nav className="nav shell"><a className="logo" href="/"><img src="/retentionmax-logo.png" alt="RetentionMax" width="404" height="176" /></a><button className="menu" onClick={()=>setMenu(!menu)} aria-label="Toggle navigation">MENU</button><div className={`links ${menu?"open":""}`}><a href="/services">Services</a><a href="/about">About</a><a href="/#work">Work</a><a href="/#process">Process</a></div><a href="/#audit" className="nav-cta">Free retention audit <span>↗</span></a></nav>

    <header className="about-hero shell">
      <span className="about-kicker"><i/> ABOUT RETENTIONMAX / BUILT FOR ORDER NUMBER TWO</span>
      <h1>We help brands<br/><em>earn the return.</em></h1>
      <div className="about-hero-copy"><p>RetentionMax is a customer-retention studio connecting strategy, data, creative and technology around one commercial goal: more valuable customer relationships.</p><a href="#founders">MEET THE FOUNDERS <span>↓</span></a></div>
      <div className="about-hero-mark" aria-hidden="true"><div><b>R</b><i/><i/><i/></div><span>RELATIONSHIPS<br/>COMPOUND HERE</span></div>
    </header>

    <section className="about-statement"><div className="shell" data-about-reveal><span>01 / OUR POINT OF VIEW</span><h2>Acquisition creates attention.<br/><em>Retention creates enterprise value.</em></h2><p>We started RetentionMax because the most important customer work often sits between teams, tools and channels. Our job is to connect it into one operating system that learns.</p></div></section>

    <section className="about-numbers shell" data-about-reveal><article><b>02</b><span>Co-founders<br/>one shared standard</span></article><article><b>07</b><span>Connected<br/>retention capabilities</span></article><article><b>01</b><span>Customer view<br/>across every channel</span></article><article><b>∞</b><span>Cycles of learning<br/>and improvement</span></article></section>

    <section className="about-founders shell" id="founders">
      <div className="about-section-head" data-about-reveal><span>02 / THE FOUNDERS</span><h2>Two disciplines.<br/><em>One customer system.</em></h2><p>Replace these editable profiles with verified founder names, portraits and biographies before publishing.</p></div>
      <div className="founder-grid">
        {founders.map((founder,index)=><article className={`founder-card founder-${founder.tone}`} data-about-reveal style={{"--founder-delay":`${index*180}ms`} as React.CSSProperties} key={founder.n}>
          <div className="founder-top"><span>{founder.n} / CO-FOUNDER</span><i>↗</i></div>
          <div className="founder-portrait" aria-hidden="true"><div className="founder-orbit"><i/><i/></div><b>{founder.initials}</b><span className="founder-pop pop-one">CO-FOUNDER</span><span className="founder-pop pop-two">RETENTIONMAX</span></div>
          <div className="founder-copy"><small>NAME TO BE ADDED</small><h3>{founder.role}</h3><p>{founder.focus}</p><div>{founder.skills.map(skill=><span key={skill}>{skill}</span>)}</div></div>
        </article>)}
      </div>
    </section>

    <section className="about-principles"><div className="shell"><div className="about-section-head" data-about-reveal><span>03 / HOW WE THINK</span><h2>Principles before<br/><em>playbooks.</em></h2></div><div className="principle-list">{[["01","See the whole customer","Channels are delivery mechanisms. The relationship is the strategy."],["02","Connect to economics","Every journey should improve repeat rate, margin or lifetime value."],["03","Protect attention","More messages are not the goal. More useful moments are."],["04","Build to learn","Testing is not a campaign phase; it is how the system compounds."]].map((item,index)=><article data-about-reveal style={{"--principle-delay":`${index*100}ms`} as React.CSSProperties} key={item[0]}><span>{item[0]}</span><i>✦</i><h3>{item[1]}</h3><p>{item[2]}</p></article>)}</div></div></section>

    <section className="about-close"><div className="shell" data-about-reveal><span>LET’S BUILD THE SECOND PURCHASE</span><h2>Bring us the customer.<br/><em>We’ll find the opportunity.</em></h2><a href="/#audit">Start with a free audit <span>↗</span></a></div></section>

    <footer><div className="shell footer-top"><a className="logo" href="/"><img src="/retentionmax-logo.png" alt="RetentionMax" width="404" height="176" /></a><p>Customer retention systems for brands<br/>built to last.</p><div><a href="/services">Services</a><a href="/about">About</a><a href="/#process">Process</a><a href="/#audit">Contact</a></div></div><div className="footer-word">RETENTION<span>MAX</span></div><div className="shell legal"><span>© 2026 RETENTIONMAX</span><span>PRIVACY · TERMS · LINKEDIN</span><span>MADE FOR THE SECOND PURCHASE</span></div></footer>
    <RetentionChat/>
  </main>;
}
