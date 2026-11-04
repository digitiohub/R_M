# MoM Implementation Report: RetentionMax website

Updated 2026-11-03 after phase 2. Nothing has been committed, pushed or deployed.

## Summary

| # | Item | Status |
|---|------|--------|
| 1 | Form correction | Partially Completed, Pending External Activation (credentials) |
| 2 | Mandatory tick | Completed |
| 3 | Max background | Completed (applied per your answer: both changes) |
| 4 | Gap in strip | Completed |
| 5 | Strip names near hero | Pending Client Input |
| 6 | FAQ for AI widget (Ganesh) | Pending Client Input (integration ready) |
| 7 | Hero banner dead space | Completed |
| 8 | SEO activation | Completed in code, Pending External Activation |
| 9 | Font changes | Completed for sizing; specific section/typeface changes Pending Client Input |
| 10 | Rewards, Referrals & Loyalty | Pending Client Input (section built, hidden until content) |
| 11 | How It Works graph | Completed |
| 12 | Testimonials slider | Completed |
| 13 | Footer | Partially Completed, Pending Client Input (LinkedIn URL, Vishal's number) |

**Verification (phase 2).** `npm run build` passes. ESLint: 12 errors and 15 warnings repo-wide, none in new or changed code, and the 12 errors are old `<a href="/">` lint rules in the About/Services pages (18 before phase 1). A Chrome pass (Puppeteer) at desktop 1440×900, tablet 820×1180 and mobile 390×844 over `/`, `/about` and `/services` found no text under 10px and no clipped text. The only page overflow is the pre-existing 112px (desktop) / 22px (tablet) on the home page, hidden by `body{overflow-x:hidden}`. Screenshots at desktop confirmed the Max changes.

---

## 1. Form correction: Partially Completed, Pending External Activation
**Files:** `app/page.tsx`, `app/api/audit/route.ts`, `.env.example` (new), `scripts/verify-form-delivery.mjs` (new)

Phase 1 fixes stand (bare-domain websites accepted, phone validation, double-submit guard, accessible messages, server-side consent and URL checks). Phase 2 added what is needed to switch delivery on:
- `.env.example` lists every variable (`RESEND_API_KEY`, `AUDIT_EMAIL_TO`, `AUDIT_EMAIL_FROM`, and the others below). It is un-ignored in `.gitignore`, which otherwise excludes `.env*`.
- `node scripts/verify-form-delivery.mjs --confirm [baseUrl]` sends one real test lead and reports the result. It refuses to run without `--confirm` because it emails a real inbox.

**Result:** delivery is not verified. There is no `RESEND_API_KEY` on this machine, no `.env` file, and no D1 binding locally, so a real submission returns 500. The form flow itself passed in phase 1 (consent block, mocked-success path, validation).
**To finish:** set `RESEND_API_KEY` on the host, make sure the sender domain in `AUDIT_EMAIL_FROM` is verified in Resend, run the script, and check that the "New Lead - Audit Enquiry" email arrives.

## 2. Mandatory tick: Completed
Unchanged from phase 1: native validation, JS check, and a server 400 when consent is not `"true"`.

## 3. Max background: Completed
**Files:** `app/MaxApproach.tsx`, `app/globals.css` (end of file)
You chose both changes.
- The Max Approach section no longer paints its own navy base. It uses the site background (`var(--bg)`) with the existing soft blue glows, so it blends with the sections around it. The dashboard panels keep their own colours.
- Every Max logo disc (hero engine, "Why" visual, About mark, chat button and avatar) now uses Max navy `#0b1334` with a thin blue ring instead of near-black. It is controlled by one variable, `--max-disc`, so it can be retuned in one line.

**Verified** on desktop. If the intended colour was something specific, change `--max-disc` and `--max-disc-ring` at the end of `globals.css`.

## 4. Gap in strip: Completed
Unchanged from phase 1.

## 5. Strip names near hero: Pending Client Input
No approved wording has been received. Edit the two arrays at `app/page.tsx` lines 338–339 once it arrives.

## 6. FAQ for AI widget (Ganesh): Pending Client Input, integration ready
**Files:** `app/content/site.ts` (`faq`), `app/content/faq.ts` (new), `app/api/chat/route.ts`, `app/RetentionChat.tsx`, `app/layout.tsx`
Once Ganesh's approved document is pasted into `faq` as `{ question, answer }` entries, it takes effect in three places with no further code:
1. The live assistant gets the entries in its system prompt as an approved FAQ.
2. The chat's offline fallback answers from the FAQ first, before its built-in keyword rules (it needs two or more shared keywords covering at least 60% of the FAQ question). I tested the matcher with throwaway sample entries and it matched paraphrases and ignored unrelated questions; no sample data is in the repo.
3. `FAQPage` structured data is added to the site's JSON-LD for search engines.

With the array empty, behaviour is unchanged. **Needed:** the approved FAQ document.

## 7. Hero banner dead space: Completed
Unchanged from phase 1.

## 8. SEO activation: Completed in code, Pending External Activation
**Files:** `app/layout.tsx`, `app/about/layout.tsx`, `app/services/layout.tsx`, `app/robots.ts`, `app/sitemap.ts`, `public/og.jpg` (new), `Dockerfile`

Phase 1: viewport/theme colour, robots directives, `/api/` disallowed, fixed sitemap dates, verification-token support. Phase 2 added:
- **Open Graph image fixed:** `og.png` is 1734×907 but the metadata declared 1760×917, and the file was 1.6 MB. A JPEG of the same image (`public/og.jpg`, 215 KB) is now referenced with the correct size on all pages. `og.png` is left in place, unused.
- **Breadcrumb structured data** on `/about` and `/services`, and conditional `FAQPage` data (see item 6).

**Audit results:** each page has exactly one `<h1>`, a unique title, and no images without alt text; `/robots.txt` and `/sitemap.xml` respond correctly.

**External steps (cannot be done from the repo):**
1. Add the site in Google Search Console (domain property is easiest), copy the HTML-tag token into `NEXT_PUBLIC_GOOGLE_SITE_VERIFICATION` (a build arg) and redeploy, or verify through DNS instead.
2. Same in Bing Webmaster Tools with `NEXT_PUBLIC_BING_SITE_VERIFICATION`, or import the site from Search Console.
3. Submit `https://www.retentionmax.in/sitemap.xml` in both.
4. Confirm `retentionmax.in` redirects to `https://www.retentionmax.in` (canonicals assume `www`).
5. Analytics: no tracking ID was provided, so none is installed. Send the GA4/GTM ID if wanted.
6. After deploying, check the pages with Google's Rich Results Test and a social-share preview (the OG image changed).
7. Optional: create or claim a Google Business Profile and use the same LinkedIn URL as `sameAs` (see item 13).

## 9. Font changes: Completed for sizing, specifics Pending Client Input
**Files:** `app/globals.css`, `app/MaxApproach.tsx`
Every font size under 10px was raised to 10px: 61 rules in the stylesheet (the 6–9px labels on the home, services and about pages, form labels, step labels, footer legal text) plus the dashboard labels in the Max Approach View (8–9.5px). A browser audit of all three pages at three sizes found no remaining text under 10px and no clipping.
**Still needed:** the MoM never named the sections or the typeface. If a particular section should use a different font, say which and what to use. Today the body is Arial, display headings are tight-tracked sans with Georgia italics, and only the Max Approach section uses Archivo.

## 10. Rewards, Referrals & Loyalty: Pending Client Input
The section component (`app/RewardsSection.tsx`) is built, styled and placed on the homepage, and it renders nothing until `rewards` in `app/content/site.ts` has content (eyebrow, title, intro, pillars). No approved content exists, so nothing was invented. **Needed:** the approved programme details.

## 11. How It Works graph: Completed
Unchanged from phase 1.

## 12. Testimonials slider: Completed
Unchanged from phase 1. Only one approved testimonial (Nayan Shah, PetChef) exists, so no slider controls show until more are added to `testimonials` in `site.ts`.

## 13. Footer: Partially Completed, Pending Client Input
Unchanged from phase 1. LinkedIn and Vishal's WhatsApp icon stay environment-based (`NEXT_PUBLIC_RETENTIONMAX_LINKEDIN`, `NEXT_PUBLIC_VISHAL_WHATSAPP`, both listed in `.env.example` and as Docker build args) and appear only when set. **Needed:** the approved LinkedIn URL and Vishal's approved number.

---

## Privacy Policy check
**No privacy policy page exists.** There is no `/privacy` route, no policy file anywhere in the repo, and nothing in the git history. The only mention is the consent checkbox text "accept the privacy policy", which currently points nowhere. No approved policy or terms text has been provided, and drafting legal text without approval was avoided. The old footer labels "PRIVACY · TERMS" were removed in phase 1 because they were unlinked.
**Decision needed:** supply the approved policy text (or a URL if it is hosted elsewhere), and I will add the page, link it from the consent line and the footer, and add it to the sitemap. Until then, the consent text refers to a document visitors cannot read.

## All remaining client dependencies
1. **Resend API key**, and confirmation that the sender domain is verified (form delivery, item 1). Optionally the destination address if it should differ from hello@retentionmax.in.
2. **Approved strip wording** for both strips near the hero (item 5).
3. **Ganesh's approved FAQ document** (item 6).
4. **Approved Rewards, Referrals & Loyalty content** (item 10).
5. **LinkedIn URL** and **Vishal's WhatsApp number** (item 13).
6. **Typography specifics:** which sections and which typeface, if any change beyond the size fixes is wanted (item 9).
7. **Approved Privacy Policy** text or URL (and Terms if wanted).
8. **Search Console and Bing verification tokens**, analytics ID, and confirmation of the non/www redirect (item 8).
9. **More approved testimonials**, if a multi-slide slider is wanted (item 12).
10. **Anthropic API key** on the host, for the live AI assistant. Without it the chat falls back to its built-in replies. This is existing behaviour, not a new dependency.
11. Confirmation that the Max disc colour (`#0b1334`) is what was intended (item 3).

## Other notes
- Pre-existing and unchanged: the home page reports 112px of horizontal scroll width on desktop (22px on tablet), clipped by `body{overflow-x:hidden}`.
- `tsc` reports 4 errors, all in `examples/d1` and `worker/` (not touched here).
- Run locally with `npm run dev` (http://localhost:3000).
