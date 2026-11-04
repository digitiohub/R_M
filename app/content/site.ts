/* Client-approved content lives here. Anything the client has not supplied is left
   empty on purpose: the UI renders nothing for an empty entry rather than showing
   placeholder business information. See MOM_IMPLEMENTATION_REPORT.md for what is
   still needed and where each value goes. */

/* NEXT_PUBLIC_* values are inlined at build time (see the Dockerfile ARGs). */
const digits = (v?: string) => (v ?? "").replace(/\D/g, "");

export const contact = {
  /** Approved company LinkedIn page URL. */
  linkedin: (process.env.NEXT_PUBLIC_RETENTIONMAX_LINKEDIN ?? "").trim(),
  /** Vishal's approved WhatsApp number, digits only with country code (e.g. 91XXXXXXXXXX). */
  vishalWhatsapp: digits(process.env.NEXT_PUBLIC_VISHAL_WHATSAPP),
};

export const whatsappLink = (number: string, text = "Hello Vishal, I would like to know more about RetentionMax.") =>
  number ? `https://wa.me/${number}?text=${encodeURIComponent(text)}` : "";

export type Testimonial = { quote: string; name: string; role: string; logo?: { src: string; alt: string } };

export const testimonials: Testimonial[] = [
  {
    quote: "RetentionMax helped us stop thinking in campaigns and start thinking in customer journeys.",
    name: "Nayan Shah",
    role: "Co-founder, PetChef",
    logo: { src: "/petchef-logo.png", alt: "PetChef" },
  },
];

export type FaqEntry = { question: string; answer: string };
/** Approved FAQ for the AI widget. Pending the approved document from Ganesh. Entries added
    here are given to the assistant as its source of truth (see app/api/chat/route.ts). */
export const faq: FaqEntry[] = [];

export type RewardsContent = { eyebrow: string; title: string; intro: string; pillars: { name: string; detail: string }[] };
/** Rewards, Referrals & Loyalty section. Pending approved business content. The section
    stays hidden until this is filled in. */
export const rewards: RewardsContent | null = null;
