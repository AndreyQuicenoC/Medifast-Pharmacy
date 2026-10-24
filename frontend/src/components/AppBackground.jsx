export default function AppBackground() {
  return (
    <div className="pointer-events-none fixed inset-0 -z-10 overflow-hidden bg-[#ecfdf5]" aria-hidden>
      <svg className="absolute h-full w-full" preserveAspectRatio="xMidYMid slice" viewBox="0 0 1440 900">
        <defs>
          <linearGradient id="mf-bg" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#d1fae5" />
            <stop offset="45%" stopColor="#ecfdf5" />
            <stop offset="100%" stopColor="#fef9c3" stopOpacity="0.35" />
          </linearGradient>
          <pattern id="mf-grid" width="48" height="48" patternUnits="userSpaceOnUse">
            <path d="M48 0H0V48" fill="none" stroke="#059669" strokeOpacity="0.06" />
          </pattern>
        </defs>
        <rect width="1440" height="900" fill="url(#mf-bg)" />
        <rect width="1440" height="900" fill="url(#mf-grid)" />
        <circle cx="200" cy="160" r="120" fill="#10b981" fillOpacity="0.12" />
        <circle cx="1240" cy="720" r="180" fill="#ca8a04" fillOpacity="0.1" />
        <path
          d="M0 620 Q360 520 720 640 T1440 580 V900 H0 Z"
          fill="#059669"
          fillOpacity="0.08"
        />
        <g fill="#047857" fillOpacity="0.07">
          <rect x="980" y="120" width="64" height="64" rx="16" transform="rotate(12 1012 152)" />
          <rect x="110" y="640" width="48" height="48" rx="12" transform="rotate(-8 134 664)" />
        </g>
        <text x="1120" y="200" fontSize="14" fill="#065f46" fillOpacity="0.25" fontFamily="system-ui,sans-serif">
          Medifast
        </text>
      </svg>
    </div>
  );
}
