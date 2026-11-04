import { rewards } from "./content/site";

/** Rewards, Referrals & Loyalty. Renders only once approved content is supplied in content/site.ts. */
export default function RewardsSection() {
  if (!rewards || !rewards.pillars.length) return null;
  return (
    <section className="rewards shell" id="rewards">
      <span className="section-no">{rewards.eyebrow}</span>
      <h2>{rewards.title}</h2>
      <p className="rewards-intro">{rewards.intro}</p>
      <div className="rewards-grid">{rewards.pillars.map((p, i) => <article key={p.name}><span>0{i + 1}</span><h3>{p.name}</h3><p>{p.detail}</p></article>)}</div>
    </section>
  );
}
