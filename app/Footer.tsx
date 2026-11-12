import { contact, whatsappLink } from "./content/site";

function LinkedInIcon() {
  return <svg viewBox="0 0 24 24" width="28" height="28" fill="currentColor" aria-hidden="true"><path d="M4.98 3.5a2.5 2.5 0 1 1 0 5 2.5 2.5 0 0 1 0-5ZM3 9.75h4v11.5H3V9.75Zm6.5 0h3.84v1.57h.06c.54-1.01 1.84-2.07 3.79-2.07 4.05 0 4.81 2.66 4.81 6.13v5.87h-4v-5.2c0-1.24-.02-2.84-1.73-2.84-1.73 0-2 1.35-2 2.75v5.29h-4V9.75Z" /></svg>;
}
function WhatsAppIcon() {
  return <svg viewBox="0 0 24 24" width="28" height="28" fill="currentColor" aria-hidden="true"><path d="M12.04 2a9.9 9.9 0 0 0-8.5 14.95L2 22l5.2-1.5A9.9 9.9 0 1 0 12.04 2Zm0 18.1a8.2 8.2 0 0 1-4.2-1.15l-.3-.18-3.08.9.92-3-.2-.31a8.2 8.2 0 1 1 6.86 3.74Zm4.5-6.1c-.25-.12-1.46-.72-1.68-.8-.23-.08-.4-.12-.56.12-.17.25-.64.8-.78.97-.14.16-.29.18-.54.06a6.7 6.7 0 0 1-3.3-2.88c-.25-.43.25-.4.72-1.33.08-.17.04-.31-.02-.43-.06-.12-.56-1.35-.77-1.85-.2-.48-.4-.42-.56-.42h-.47c-.17 0-.43.06-.66.31-.22.25-.86.85-.86 2.07s.88 2.4 1 2.57c.12.16 1.73 2.64 4.2 3.7 1.56.67 2.17.73 2.95.62.48-.07 1.46-.6 1.67-1.18.2-.58.2-1.07.14-1.18-.06-.1-.23-.16-.48-.28Z" /></svg>;
}

/** Shared by the home, services and about pages. `home` makes the anchors in-page links. */
export default function Footer({ home = false }: { home?: boolean }) {
  const waHref = whatsappLink(contact.vishalWhatsapp);
  const prefix = home ? "" : "/";
  return (
    <footer>
      <div className="shell footer-top">
        <div className="footer-brand">
          <a className="logo" href={home ? "#top" : "/"}><img src="/retentionmax-logo.png" alt="RetentionMax" width="404" height="176" /></a>
          <span className="social">
            {/* Always visible. Only a link once the approved URL is configured; no placeholder URL is ever used. */}
            {contact.linkedin
              ? <a href={contact.linkedin} target="_blank" rel="noopener noreferrer" aria-label="RetentionMax on LinkedIn" title="LinkedIn"><LinkedInIcon /></a>
              : <span className="social-static" role="img" aria-label="LinkedIn"><LinkedInIcon /></span>}
            {waHref
              ? <a href={waHref} target="_blank" rel="noopener noreferrer" aria-label="Chat with Vishal on WhatsApp" title="WhatsApp"><WhatsAppIcon /></a>
              : <span className="social-static wa" role="img" aria-label="WhatsApp"><WhatsAppIcon /></span>}
          </span>
        </div>
        <p>Customer retention systems for brands<br />built to last.</p>
        <div><a href="/services">Services</a><a href="/about">About</a><a href={`${prefix}#process`}>Process</a><a href={`${prefix}#audit`}>Contact</a></div>
      </div>
      <div className="footer-word">RETENTION<span>MAX</span></div>
      <div className="shell legal"><span>© 2026 RETENTIONMAX</span><span>PRIVACY · TERMS · LINKEDIN</span><span>MADE FOR THE SECOND PURCHASE</span></div>
    </footer>
  );
}
