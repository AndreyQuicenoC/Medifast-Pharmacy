/** Iconos SVG inline (sin emojis) para Medifast */

const iconClass = "h-5 w-5 shrink-0";

export function IconMapPin({ className = iconClass }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" aria-hidden>
      <path strokeLinecap="round" strokeLinejoin="round" d="M12 21s7-4.5 7-11a7 7 0 10-14 0c0 6.5 7 11 7 11z" />
      <circle cx="12" cy="10" r="2.5" />
    </svg>
  );
}

export function IconPhone({ className = iconClass }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" aria-hidden>
      <path strokeLinecap="round" strokeLinejoin="round" d="M6.5 4h3l1.5 4-2 1.5a11 11 0 005.5 5.5L17 13l4 1.5v3a2 2 0 01-2.2 2 15 15 0 01-6.3-1.5 15 15 0 01-4-4A15 15 0 014.2 6.2 2 2 0 016.5 4z" />
    </svg>
  );
}

export function IconMail({ className = iconClass }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" aria-hidden>
      <rect x="3" y="5" width="18" height="14" rx="2" />
      <path strokeLinecap="round" d="M3 7l9 6 9-6" />
    </svg>
  );
}

export function IconFacebook({ className = iconClass }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="currentColor" aria-hidden>
      <path d="M13 10V7.5c0-.8.7-1.5 1.5-1.5H16V3h-2c-2.2 0-4 1.8-4 4v3H8v3.5h2V21h3v-7.5h2.5L16 10h-3z" />
    </svg>
  );
}

export function IconInstagram({ className = iconClass }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" aria-hidden>
      <rect x="3" y="3" width="18" height="18" rx="5" />
      <circle cx="12" cy="12" r="4" />
      <circle cx="17.5" cy="6.5" r="1" fill="currentColor" stroke="none" />
    </svg>
  );
}

export function IconTwitter({ className = iconClass }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="currentColor" aria-hidden>
      <path d="M18.9 3H22l-6.8 7.8L22.5 21h-6.2l-4.9-6.4L5.8 21H2.7l7.3-8.3L1.5 3h6.4l4.4 5.8L18.9 3zm-2.2 16h1.7L7.1 5H5.3l11.4 14z" />
    </svg>
  );
}

export function IconInfo({ className = iconClass }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" aria-hidden>
      <circle cx="12" cy="12" r="9" />
      <path strokeLinecap="round" d="M12 10v6M12 7h.01" />
    </svg>
  );
}

export function IconPharmacy({ className = "h-8 w-8" }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" aria-hidden>
      <path strokeLinecap="round" d="M12 3v18M3 12h18" />
      <rect x="5" y="5" width="14" height="14" rx="3" />
    </svg>
  );
}

export function IconService({ name, className = "h-7 w-7" }) {
  const n = (name || "").toLowerCase();
  if (n.includes("urgencia") || n.includes("priorit")) {
    return (
      <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" aria-hidden>
        <path strokeLinecap="round" d="M12 3v4M12 17v4M4.9 4.9l2.8 2.8M16.3 16.3l2.8 2.8M3 12h4M17 12h4" />
        <circle cx="12" cy="12" r="4" />
      </svg>
    );
  }
  if (n.includes("consulta") || n.includes("farmaceut")) {
    return (
      <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" aria-hidden>
        <path strokeLinecap="round" d="M8 8h8v10a2 2 0 01-2 2h-4a2 2 0 01-2-2V8z" />
        <path strokeLinecap="round" d="M10 8V6a2 2 0 012-2h0a2 2 0 012 2v2" />
      </svg>
    );
  }
  if (n.includes("vacun") || n.includes("inyecc")) {
    return (
      <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" aria-hidden>
        <path strokeLinecap="round" d="M14 4l6 6M8 20l-2-2 8-8 2 2-8 8z" />
      </svg>
    );
  }
  return <IconPharmacy className={className} />;
}
