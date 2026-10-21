import { auditEnquiries } from "../../../db/schema";
import { getDb } from "../../../db";

const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const urlPattern = /^https?:\/\/.+/i;

type Lead = { name: string; company: string; email: string; phone: string; website: string; orderVolume: string; platforms: string; challenge: string };

const escapeHtml = (s: string) => s.replace(/[&<>"']/g, c => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]!));

async function saveLead(lead: Lead) {
  const db = await getDb();
  await db.insert(auditEnquiries).values({ ...lead, consent: true });
}

// Sends the enquiry through Resend's HTTP API so it works on both the Docker
// (Node) server and the Cloudflare runtime. RESEND_API_KEY is read at runtime.
async function emailLead(lead: Lead) {
  const apiKey = process.env.RESEND_API_KEY;
  if (!apiKey) throw new Error("RESEND_API_KEY is not set.");
  const rows: [string, string][] = [
    ["Name", lead.name], ["Company", lead.company], ["Work email", lead.email], ["Phone", lead.phone],
    ["Website", lead.website], ["Monthly order volume", lead.orderVolume], ["Existing platforms", lead.platforms || "—"],
    ["Primary retention challenge", lead.challenge],
  ];
  const res = await fetch("https://api.resend.com/emails", {
    method: "POST",
    headers: { Authorization: `Bearer ${apiKey}`, "Content-Type": "application/json" },
    body: JSON.stringify({
      from: process.env.AUDIT_EMAIL_FROM || "RetentionMax Website <hello@retentionmax.in>",
      to: [process.env.AUDIT_EMAIL_TO || "hello@retentionmax.in"],
      reply_to: lead.email,
      subject: "New Lead - Audit Enquiry",
      text: rows.map(([k, v]) => `${k}: ${v}`).join("\n"),
      html: `<h2>New Lead - Audit Enquiry</h2><table cellpadding="6" style="border-collapse:collapse">${rows.map(([k, v]) => `<tr><td><b>${k}</b></td><td style="white-space:pre-wrap">${escapeHtml(v)}</td></tr>`).join("")}</table>`,
    }),
  });
  if (!res.ok) throw new Error(`Resend responded ${res.status}: ${await res.text()}`);
}

export async function POST(request: Request) {
  try {
    const b = await request.json() as Record<string, string>;
    const required = ["name","company","email","phone","website","orderVolume","challenge"];
    if (required.some(k => !b[k]?.trim())) return Response.json({ error: "Please complete every required field." }, { status: 400 });
    if (!emailPattern.test(b.email)) return Response.json({ error: "Please enter a valid work email." }, { status: 400 });
    if (!urlPattern.test(b.website)) return Response.json({ error: "Website must begin with http:// or https://." }, { status: 400 });
    if (b.phone.replace(/\D/g,"").length < 7) return Response.json({ error: "Please enter a valid phone number." }, { status: 400 });
    if (b.consent !== "true") return Response.json({ error: "Consent is required." }, { status: 400 });
    const lead: Lead = {
      name: b.name.trim(), company: b.company.trim(), email: b.email.trim().toLowerCase(), phone: b.phone.trim(),
      website: b.website.trim(), orderVolume: b.orderVolume, platforms: b.platforms?.trim() || "", challenge: b.challenge.trim(),
    };
    // The D1 database only exists on the Cloudflare runtime, so the lead counts
    // as received if either the email or the database write succeeds.
    const [emailed, saved] = await Promise.allSettled([emailLead(lead), saveLead(lead)]);
    if (emailed.status === "rejected") console.error("Audit enquiry email failed:", emailed.reason);
    if (saved.status === "rejected") console.error("Audit enquiry save failed:", saved.reason);
    if (emailed.status === "rejected" && saved.status === "rejected") throw new Error("Lead was not delivered.");
    return Response.json({ ok: true }, { status: 201 });
  } catch {
    return Response.json({ error: "We couldn’t save your audit request. Please try again." }, { status: 500 });
  }
}
