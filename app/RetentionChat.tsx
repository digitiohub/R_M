"use client";

import { FormEvent, useEffect, useRef, useState } from "react";

type Message = { id: number; from: "bot" | "user"; text: string; feedback?: "up" | "down" };
type Profile = { name?: string; email?: string; phone?: string; consent?: boolean };
type LeadStage = "name" | "challenge" | "email" | "phone" | null;

const welcome = "Hi — I’m the RetentionMax assistant. I can explain our services, process, retention audit, or help you contact the team.";
const quickReplies = ["Recommend a service", "Free retention audit", "How it works", "Pricing", "Contact the team"];
const serviceChoices = [
  { name: "Email Marketing", icon: "@", hint: "Lifecycle depth" },
  { name: "WhatsApp Marketing", icon: "◎", hint: "High-intent conversations" },
  { name: "SMS Campaigns", icon: "•••", hint: "Urgent moments" },
  { name: "Web Push", icon: "↗", hint: "Re-engagement" },
  { name: "Segmentation", icon: "◫", hint: "Sharper targeting" },
  { name: "Automation", icon: "↻", hint: "Connected journeys" },
  { name: "Retention Analytics", icon: "▥", hint: "Clear attribution" },
];

function answerFor(input: string, name?: string) {
  const q = input.toLowerCase();
  if (/hello|hi|hey/.test(q)) return `Hi${name ? ` ${name}` : ""}! What would you like to improve: repeat purchases, lifecycle automation, or customer lifetime value?`;
  if (/recommend|which service|help my brand/.test(q)) return "The right starting point depends on the problem: choose Email for lifecycle depth, WhatsApp for high-intent conversations, SMS for urgency, Web Push for re-engagement, Segmentation when targeting is weak, Automation when journeys are disconnected, and Analytics when attribution is unclear. A retention audit can prioritize the best combination.";
  if (/email/.test(q)) return "Email Marketing: we design welcome, browse/cart recovery, post-purchase, replenishment, cross-sell, loyalty, and win-back journeys. Each program includes segmentation, creative testing, and measurement against repeat purchase rate and lifetime value.";
  if (/whatsapp|wa /.test(q)) return "WhatsApp Marketing: we build permission-led conversations for purchase assistance, order education, replenishment, support, loyalty, and win-back. It is coordinated with email and SMS to prevent duplicate or excessive messaging.";
  if (/sms/.test(q)) return "We use SMS for concise, timely moments where urgency matters, coordinated with email and WhatsApp so channels complement rather than compete.";
  if (/push/.test(q)) return "Web Push helps bring known visitors and customers back with contextual reminders, product updates, and lifecycle-triggered messages.";
  if (/segment|data|analytics/.test(q)) return "We turn behavioral and purchase data into actionable segments, then measure repeat rate, churn, customer lifetime value, and journey-level performance.";
  if (/automat|journey/.test(q)) return "RetentionMax designs connected automations that react to customer behavior—from first purchase through engagement, repeat purchase, loyalty, and revenue growth.";
  if (/audit|free/.test(q)) return "Free Retention Audit: we review your existing lifecycle, customer data, creative, channel mix, technology, and missed repeat-revenue opportunities. You receive prioritized next steps—not a generic sales deck. The team normally replies within two business days.";
  if (/process|how it works|start/.test(q)) return "Our four-stage process is: 1) Diagnose—find lifecycle and measurement gaps; 2) Design—map channels, triggers, and messages; 3) Deploy—build and test the journeys; 4) Compound—measure behavior and improve performance continuously.";
  if (/price|pricing|cost|fee|budget/.test(q)) return "Engagements are scoped around your order volume, number of channels, lifecycle complexity, existing technology, and whether you need strategy, implementation, or ongoing optimization. We do not publish a one-size-fits-all fee; the free audit gives the team enough context to recommend the right scope.";
  if (/shopify|klaviyo|gupshup|clevertap|moengage|razorpay|integrat/.test(q)) return "We work with tools including Shopify, Klaviyo, Gupshup, CleverTap, MoEngage, and Razorpay, and can assess how your current stack should connect.";
  if (/contact|team|call|book|talk/.test(q)) return "Absolutely. Choose “Share contact details” below and I’ll collect the information the RetentionMax team needs to follow up.";
  if (/what do you do|service|retentionmax/.test(q)) return "RetentionMax builds connected customer-retention systems across Email, WhatsApp, SMS, Web Push, segmentation, automation, and analytics—designed to increase repeat purchases and lifetime value.";
  return "I can help with Email, WhatsApp, SMS, Web Push, segmentation, automation, analytics, the free audit, or contacting the team. Which would you like to explore?";
}

export default function RetentionChat() {
  const whatsappNumber = (process.env.NEXT_PUBLIC_RETENTIONMAX_WHATSAPP || "918483952398").replace(/\D/g, "");
  const whatsappMessage = encodeURIComponent("Hi RetentionMax, I’d like to discuss improving customer retention for my brand.");
  const whatsappHref = whatsappNumber ? `https://wa.me/${whatsappNumber}?text=${whatsappMessage}` : "#audit";
  const [open, setOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([{ id: 1, from: "bot", text: welcome }]);
  const [profile, setProfile] = useState<Profile>({});
  const [input, setInput] = useState("");
  const [leadForm, setLeadForm] = useState(false);
  const [showQuickActions, setShowQuickActions] = useState(true);
  const [showServiceChoices, setShowServiceChoices] = useState(false);
  const [leadStage, setLeadStage] = useState<LeadStage>(null);
  const [leadDraft, setLeadDraft] = useState<{ name?: string; challenge?: string; email?: string }>({});
  const endRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    try {
      const savedMessages = localStorage.getItem("retentionmax-chat");
      const savedProfile = localStorage.getItem("retentionmax-profile");
      if (savedMessages) {
        const parsed = JSON.parse(savedMessages) as Message[];
        setMessages(parsed);
        if (parsed.length > 1) setShowQuickActions(false);
      }
      if (savedProfile) setProfile(JSON.parse(savedProfile));
    } catch { /* Ignore unavailable storage. */ }
  }, []);

  useEffect(() => {
    try { localStorage.setItem("retentionmax-chat", JSON.stringify(messages.slice(-40))); } catch { /* Ignore unavailable storage. */ }
    endRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, open]);

  const send = (text: string) => {
    const clean = text.trim();
    if (!clean) return;
    const time = Date.now();
    if (leadStage) {
      if (leadStage === "name") {
        if (clean.length < 2) {
          setMessages(current => [...current, { id: time, from: "user", text: clean }, { id: time + 1, from: "bot", text: "Please enter your name using at least two characters." }]);
          setInput(""); return;
        }
        setLeadDraft(current => ({ ...current, name: clean }));
        setMessages(current => [...current, { id: time, from: "user", text: clean }, { id: time + 1, from: "bot", text: `Great to meet you, ${clean}. What is the biggest retention challenge your brand is facing right now?` }]);
        setLeadStage("challenge"); setInput(""); return;
      }
      if (leadStage === "challenge") {
        if (clean.length < 5) {
          setMessages(current => [...current, { id: time, from: "user", text: clean }, { id: time + 1, from: "bot", text: "Could you share a little more detail so the team can understand the challenge?" }]);
          setInput(""); return;
        }
        setLeadDraft(current => ({ ...current, challenge: clean }));
        setMessages(current => [...current, { id: time, from: "user", text: clean }, { id: time + 1, from: "bot", text: "That context is helpful. What is your work email address?" }]);
        setLeadStage("email"); setInput(""); return;
      }
      if (leadStage === "email") {
        if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(clean)) {
          setMessages(current => [...current, { id: time, from: "user", text: clean }, { id: time + 1, from: "bot", text: "That email does not look complete. Please enter a valid work email, such as name@company.com." }]);
          setInput(""); return;
        }
        setLeadDraft(current => ({ ...current, email: clean }));
        setMessages(current => [...current, { id: time, from: "user", text: clean }, { id: time + 1, from: "bot", text: "Last step: what phone number should the team use for a call or WhatsApp reply? By sharing it, you agree to be contacted about your enquiry." }]);
        setLeadStage("phone"); setInput(""); return;
      }
      if (clean.replace(/\D/g, "").length < 7) {
        setMessages(current => [...current, { id: time, from: "user", text: clean }, { id: time + 1, from: "bot", text: "Please enter a valid phone number including the country code." }]);
        setInput(""); return;
      }
      const completedProfile = { name: leadDraft.name, email: leadDraft.email, phone: clean, consent: true };
      setProfile(completedProfile);
      try { localStorage.setItem("retentionmax-profile", JSON.stringify({ ...completedProfile, challenge: leadDraft.challenge })); } catch { /* Ignore unavailable storage. */ }
      setMessages(current => [...current, { id: time, from: "user", text: clean }, { id: time + 1, from: "bot", text: `You’re all set, ${leadDraft.name}. I’ve saved your details and retention challenge on this device. You can now message the team directly on WhatsApp below.` }]);
      setLeadStage(null); setInput(""); return;
    }
    setMessages(current => [...current, { id: time, from: "user", text: clean }, { id: time + 1, from: "bot", text: answerFor(clean, profile.name) }]);
    setShowQuickActions(false);
    setShowServiceChoices(false);
    if (/contact|team|call|book|talk/.test(clean.toLowerCase())) setLeadForm(true);
    setInput("");
  };

  const selectService = (serviceName: string) => {
    const time = Date.now();
    setMessages(current => [...current,
      { id: time, from: "user", text: serviceName },
      { id: time + 1, from: "bot", text: answerFor(serviceName, profile.name) },
      { id: time + 2, from: "bot", text: "To personalize the next step, what’s your name?" },
    ]);
    setShowServiceChoices(false);
    setLeadStage("name");
  };

  const submitLead = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const data = new FormData(event.currentTarget);
    const next = { name: String(data.get("name") || ""), email: String(data.get("email") || ""), phone: String(data.get("phone") || ""), consent: true };
    setProfile(next);
    try { localStorage.setItem("retentionmax-profile", JSON.stringify(next)); } catch { /* Ignore unavailable storage. */ }
    setLeadForm(false);
    setMessages(current => [...current, { id: Date.now(), from: "bot", text: `Thanks, ${next.name}. Your details are saved on this device. Complete the audit form to send your request to the team, including a request to continue the conversation on WhatsApp.` }]);
  };

  const feedback = (id: number, value: "up" | "down") => {
    setMessages(current => current.map(message => message.id === id ? { ...message, feedback: value } : message));
  };

  return <div className={`retention-chat ${open ? "chat-open" : ""}`}>
    {open && <section className="chat-panel" aria-label="RetentionMax assistant">
      <header><div><span className="chat-avatar">R<i className="chat-status"/></span><span className="chat-title"><em>AI RETENTION GUIDE</em><b>RetentionMax Assistant</b><small>Online · Typically replies instantly</small></span></div><button onClick={() => setOpen(false)} aria-label="Close chat">×</button></header>
      <div className="chat-messages">
        {messages.map(message => <div className={`chat-message ${message.from}`} key={message.id}>
          <p>{message.text}</p>
          {message.from === "bot" && <div className="chat-feedback"><span>Helpful?</span><button className={message.feedback === "up" ? "selected" : ""} onClick={() => feedback(message.id,"up")} aria-label="Helpful answer">↑</button><button className={message.feedback === "down" ? "selected" : ""} onClick={() => feedback(message.id,"down")} aria-label="Unhelpful answer">↓</button></div>}
        </div>)}
        {!leadForm && showQuickActions && <div className="chat-quick">{quickReplies.map(reply => <button key={reply} onClick={() => {
          if (reply === "Recommend a service") {
            setShowQuickActions(false);
            setShowServiceChoices(true);
            setMessages(current => [...current, { id: Date.now(), from: "bot", text: "Choose the outcome you want to explore. I’ll explain the most relevant RetentionMax service." }]);
          } else if (reply === "Contact the team") {
            setShowQuickActions(false);
            setLeadForm(true);
          } else send(reply);
        }}>{reply}</button>)}<button onClick={() => { setShowQuickActions(false); setLeadForm(true); }}>Share contact details</button></div>}
        {!leadForm && showServiceChoices && <div className="chat-services">{serviceChoices.map(service => <button key={service.name} onClick={() => selectService(service.name)}><b>{service.icon}</b><span>{service.name}<small>{service.hint}</small></span><i>→</i></button>)}</div>}
        {leadForm && <form className="chat-lead" onSubmit={submitLead}><b>Contact the team</b><input name="name" required minLength={2} defaultValue={profile.name} placeholder="Your name"/><input name="email" type="email" required defaultValue={profile.email} placeholder="Work email"/><input name="phone" required minLength={7} defaultValue={profile.phone} placeholder="Phone number"/><label><input type="checkbox" required/> I agree to save these details on this device and be contacted by RetentionMax.</label><button type="submit">Save details <span>↗</span></button><button type="button" onClick={() => setLeadForm(false)}>Cancel</button></form>}
        <div ref={endRef}/>
      </div>
      <a className="chat-whatsapp" href={whatsappHref} target={whatsappNumber ? "_blank" : undefined} rel={whatsappNumber ? "noreferrer" : undefined} onClick={() => { if (!whatsappNumber) setOpen(false); }}><b>◉</b><span>{whatsappNumber ? "Chat with the team on WhatsApp" : "Request a WhatsApp callback"}<small>{whatsappNumber ? "Opens WhatsApp" : "Complete the contact form"}</small></span><i>↗</i></a>
      <form className="chat-input" onSubmit={event => { event.preventDefault(); send(input); }}><input value={input} onChange={event => setInput(event.target.value)} placeholder={leadStage === "name" ? "Enter your name…" : leadStage === "challenge" ? "Describe your challenge…" : leadStage === "email" ? "Enter your work email…" : leadStage === "phone" ? "Enter phone with country code…" : "Ask a detailed question…"} aria-label="Chat message"/><button aria-label="Send message">↗</button></form>
      <small className="chat-memory">Conversation memory is stored only on this device.</small>
    </section>}
    <button className="chat-launcher" onClick={() => setOpen(value => !value)} aria-label={open ? "Close chat" : "Open chat"}><span>{open ? "×" : "R"}</span><b>{open ? "CLOSE" : "ASK RETENTIONMAX"}</b></button>
  </div>;
}
