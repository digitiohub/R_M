import Anthropic from "@anthropic-ai/sdk";
import { faq } from "../../content/site";

const system = `You are the RetentionMax assistant on retentionmax.in. RetentionMax is a customer-retention marketing consultancy that builds connected retention systems across Email, WhatsApp, SMS, Web Push, segmentation, automation and analytics to increase repeat purchases and customer lifetime value.

Facts you can use:
- Email Marketing: welcome, browse/cart recovery, post-purchase, replenishment, cross-sell, loyalty and win-back journeys, with segmentation, creative testing and measurement against repeat purchase rate and lifetime value.
- WhatsApp Marketing: permission-led conversations for purchase assistance, order education, replenishment, support, loyalty and win-back, coordinated with email and SMS to avoid duplicate messaging.
- SMS: concise, timely messages where urgency matters. Web Push: contextual reminders that bring known visitors back.
- Segmentation and Analytics: behavioural and purchase data turned into segments; we measure repeat rate, churn, lifetime value and journey performance.
- Automation: connected journeys from first purchase through engagement, repeat purchase and loyalty.
- Process: 1) Diagnose lifecycle and measurement gaps, 2) Design channels, triggers and messages, 3) Deploy and test journeys, 4) Compound by measuring and improving continuously.
- Tools we work with: Bik, Bitespeed, CleverTap, MoEngage, WebEngage, Omnisend, Klaviyo, Brevo, Business On Bots, Kwik Engage, Shopify, Convert Way and Interakt.
- Pricing: scoped to order volume, channels, lifecycle complexity, existing tech and whether the brand needs strategy, implementation or ongoing optimisation. There is no published fee; the free audit lets the team recommend scope.
- Free Retention Audit: a review of lifecycle, customer data, creative, channel mix, technology and missed repeat-revenue opportunities, delivered as prioritised next steps, not a sales deck. Request it with the audit form on the homepage (#audit). The team normally replies within two business days.
- To talk to the team, visitors can use the WhatsApp button in this chat or the "Share contact details" option.

Rules: reply in 2-4 short sentences of plain text (no markdown). Only discuss RetentionMax, customer retention and e-commerce marketing; politely decline anything else. Never invent prices, guarantees, case-study numbers or client names. If you don't know, suggest the free audit or contacting the team.`;

// Approved FAQ (content/site.ts). Empty until the approved document is received.
const faqBlock = faq.length
  ? "\n\nApproved FAQ. Answer from these when relevant and do not contradict them:\n" + faq.map(f => "Q: " + f.question + "\nA: " + f.answer).join("\n\n")
  : "";

export async function POST(request: Request) {
  try {
    const { messages } = await request.json() as { messages?: { role: string; content: string }[] };
    if (!Array.isArray(messages) || !messages.length) return Response.json({ error: "No messages." }, { status: 400 });
    // Public endpoint: only forward the last few turns, as plain text, capped in length.
    const history = messages.slice(-12)
      .filter(m => (m.role === "user" || m.role === "assistant") && typeof m.content === "string" && m.content.trim())
      .map(m => ({ role: m.role as "user" | "assistant", content: m.content.slice(0, 2000) }));
    while (history[0]?.role === "assistant") history.shift();
    if (history.at(-1)?.role !== "user") return Response.json({ error: "Last message must be from the user." }, { status: 400 });

    // Created per request so a missing ANTHROPIC_API_KEY lands in the catch below.
    const response = await new Anthropic().beta.messages.create({
      model: "claude-opus-5-5",
      max_tokens: 4096,
      output_config: { effort: "low" },
      betas: ["server-side-fallback-2026-07-01"],
      fallbacks: "default",
      system: system + faqBlock,
      messages: history,
    });
    const reply = response.stop_reason === "refusal" ? "" : response.content.flatMap(b => b.type === "text" ? [b.text] : []).join("").trim();
    if (!reply) return Response.json({ error: "No reply." }, { status: 502 });
    return Response.json({ reply });
  } catch (error) {
    console.error("Chat request failed:", error);
    return Response.json({ error: "The assistant is unavailable right now." }, { status: 500 });
  }
}
