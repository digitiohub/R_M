import { faq, type FaqEntry } from "./site";

const STOP = new Set(["what", "does", "with", "your", "from", "that", "this", "have", "will", "about", "into", "they", "them", "are", "the", "and", "for", "how", "can", "you", "our", "who", "why", "when", "where", "which", "there", "their", "should", "would", "could"]);

const words = (text: string) => text.toLowerCase().replace(/[^a-z0-9\s]/g, " ").split(/\s+/).filter(w => w.length > 2 && !STOP.has(w));

/** Best approved-FAQ answer for a visitor message, or null. Used by the chat widget's offline
    replies before its keyword rules, so approved answers always win over built-in text.
    A match needs at least two shared keywords covering at least 60% of the FAQ question's keywords. */
export function matchFaq(input: string, entries: FaqEntry[] = faq): FaqEntry | null {
  const asked = new Set(words(input));
  let best: { entry: FaqEntry; score: number } | null = null;
  for (const entry of entries) {
    const keys = words(entry.question);
    if (!keys.length) continue;
    const hits = keys.filter(k => asked.has(k)).length;
    const score = hits / keys.length;
    if (hits >= Math.min(2, keys.length) && score >= 0.6 && (!best || score > best.score)) best = { entry, score };
  }
  return best?.entry ?? null;
}
