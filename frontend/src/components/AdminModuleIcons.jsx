const base =
  "h-12 w-12 transition-transform duration-300 group-hover:rotate-12 group-hover:scale-110";

export function IconAdminStats({ className = base }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" aria-hidden>
      <path strokeLinecap="round" d="M4 19V5M4 19h16M8 15v-4M12 15V7M16 15v-6" />
    </svg>
  );
}

export function IconAdminCajas({ className = base }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" aria-hidden>
      <rect x="3" y="6" width="18" height="14" rx="2" />
      <path strokeLinecap="round" d="M3 10h18M8 6V4M16 6V4" />
    </svg>
  );
}

export function IconAdminServicios({ className = base }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" aria-hidden>
      <path strokeLinecap="round" d="M12 3v18M3 12h18" />
      <rect x="5" y="5" width="14" height="14" rx="3" />
    </svg>
  );
}

export function IconAdminUsuarios({ className = base }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" aria-hidden>
      <circle cx="9" cy="8" r="3" />
      <path strokeLinecap="round" d="M3 19c0-3 2.5-5 6-5s6 2 6 5M16 7h5M18.5 4.5v5" />
    </svg>
  );
}

export function IconAdminProductos({ className = base }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" aria-hidden>
      <path strokeLinecap="round" d="M8 8h8v12a2 2 0 01-2 2h-4a2 2 0 01-2-2V8z" />
      <path strokeLinecap="round" d="M10 8V6a2 2 0 012-2h0a2 2 0 012 2v2" />
    </svg>
  );
}

export function IconAdminFacturas({ className = base }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" aria-hidden>
      <path strokeLinecap="round" d="M6 4h12v16l-3-2-3 2-3-2-3 2V4z" />
      <path strokeLinecap="round" d="M9 9h6M9 13h6" />
    </svg>
  );
}
