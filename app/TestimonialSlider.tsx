"use client";

import { useEffect, useRef, useState } from "react";
import type { Testimonial } from "./content/site";

const AUTOPLAY_MS = 7000;

/** Accessible carousel: arrows, dots, keyboard, swipe, autoplay that pauses on hover/focus and
    respects reduced motion. With one testimonial it renders as a plain quote (no controls). */
export default function TestimonialSlider({ items }: { items: Testimonial[] }) {
  const [index, setIndex] = useState(0);
  const [paused, setPaused] = useState(false);
  const touchX = useRef<number | null>(null);
  const count = items.length;
  const go = (i: number) => setIndex(((i % count) + count) % count);

  useEffect(() => {
    if (count < 2 || paused || matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const timer = setTimeout(() => setIndex(i => (i + 1) % count), AUTOPLAY_MS);
    return () => clearTimeout(timer);
  }, [index, paused, count]);

  if (!count) return null;
  const multi = count > 1;

  return (
    <section
      className="testimonial shell"
      aria-roledescription="carousel"
      aria-label="Client testimonials"
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
      onFocus={() => setPaused(true)}
      onBlur={() => setPaused(false)}
      onKeyDown={e => { if (!multi) return; if (e.key === "ArrowRight") go(index + 1); if (e.key === "ArrowLeft") go(index - 1); }}
      onTouchStart={e => { touchX.current = e.touches[0].clientX; }}
      onTouchEnd={e => {
        if (touchX.current === null || !multi) return;
        const dx = e.changedTouches[0].clientX - touchX.current;
        touchX.current = null;
        if (Math.abs(dx) > 45) go(index + (dx < 0 ? 1 : -1));
      }}
    >
      <span className="quote" aria-hidden="true">“</span>
      <div className="t-viewport">
        <div className="t-track" style={{ transform: `translateX(-${index * 100}%)` }}>
          {items.map((t, i) => (
            <figure className="t-slide" key={t.name + i} role="group" aria-roledescription="slide" aria-label={`${i + 1} of ${count}`} aria-hidden={i !== index}>
              <blockquote>{t.quote}</blockquote>
              <figcaption><b>{t.name.toUpperCase()}</b><span>{t.role.toUpperCase()}</span>{t.logo && <img src={t.logo.src} alt={t.logo.alt} width="320" height="96" loading="lazy" />}</figcaption>
            </figure>
          ))}
        </div>
      </div>
      {multi && (
        <div className="t-controls">
          <button type="button" onClick={() => go(index - 1)} aria-label="Previous testimonial">←</button>
          <div className="t-dots">{items.map((t, i) => <button type="button" key={t.name + i} className={i === index ? "on" : ""} onClick={() => go(i)} aria-label={`Show testimonial ${i + 1}`} aria-current={i === index} />)}</div>
          <button type="button" onClick={() => go(index + 1)} aria-label="Next testimonial">→</button>
        </div>
      )}
    </section>
  );
}
