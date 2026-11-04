// Sends ONE real test enquiry through /api/audit and reports whether delivery worked.
// It emails AUDIT_EMAIL_TO (default hello@retentionmax.in), so it only runs with --confirm.
//
//   node scripts/verify-form-delivery.mjs --confirm [baseUrl]
//
// Start the app first with RESEND_API_KEY set, e.g.:
//   RESEND_API_KEY=... npm run dev      (PowerShell: $env:RESEND_API_KEY="..."; npm run dev)
const args = process.argv.slice(2);
if (!args.includes("--confirm")) {
  console.log("Refusing to send: this emails a real test lead. Re-run with --confirm.");
  process.exit(2);
}
const base = args.find(a => a.startsWith("http")) ?? "http://localhost:3000";
const lead = {
  name: "Delivery Test", company: "RetentionMax Delivery Check", email: "delivery-test@example.com",
  phone: "+91 90000 00000", website: "https://example.com", orderVolume: "Under 1,000",
  platforms: "", challenge: "Automated delivery test from scripts/verify-form-delivery.mjs. Safe to ignore.", consent: "true",
};
const res = await fetch(`${base}/api/audit`, { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(lead) });
const body = await res.json().catch(() => ({}));
console.log(`POST ${base}/api/audit -> ${res.status}`, body);
if (res.status === 201) console.log("Accepted. Now confirm the 'New Lead - Audit Enquiry' email arrived in the inbox.");
else console.log("Not delivered. Check the server log for 'Audit enquiry email failed' (wrong key, unverified sender domain) or a missing RESEND_API_KEY.");
process.exit(res.status === 201 ? 0 : 1);
