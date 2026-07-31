import { auditEnquiries } from "../../../db/schema";
import { getDb } from "../../../db";

const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const urlPattern = /^https?:\/\/.+/i;

export async function POST(request: Request) {
  try {
    const b = await request.json() as Record<string, string>;
    const required = ["name","company","email","phone","website","orderVolume","challenge"];
    if (required.some(k => !b[k]?.trim())) return Response.json({ error: "Please complete every required field." }, { status: 400 });
    if (!emailPattern.test(b.email)) return Response.json({ error: "Please enter a valid work email." }, { status: 400 });
    if (!urlPattern.test(b.website)) return Response.json({ error: "Website must begin with http:// or https://." }, { status: 400 });
    if (b.phone.replace(/\D/g,"").length < 7) return Response.json({ error: "Please enter a valid phone number." }, { status: 400 });
    if (b.consent !== "true") return Response.json({ error: "Consent is required." }, { status: 400 });
    const db = getDb();
    await db.insert(auditEnquiries).values({
      name: b.name.trim(), company: b.company.trim(), email: b.email.trim().toLowerCase(), phone: b.phone.trim(),
      website: b.website.trim(), orderVolume: b.orderVolume, platforms: b.platforms?.trim() || "", challenge: b.challenge.trim(), consent: true,
    });
    return Response.json({ ok: true }, { status: 201 });
  } catch {
    return Response.json({ error: "We couldn’t save your audit request. Please try again." }, { status: 500 });
  }
}
