export default function CajeroPageLayout({ title, subtitle, children }) {
  return (
    <div className="mx-auto w-full max-w-[90rem] flex-1 px-4 py-8 md:px-6 md:py-10">
      <header className="mb-5 overflow-hidden rounded-2xl border border-emerald-100 bg-gradient-to-r from-teal-50 to-white px-5 py-4 shadow-[var(--shadow-card)] md:px-6">
        <h1 className="text-xl font-bold text-[var(--color-text)] md:text-2xl">{title}</h1>
        {subtitle ? (
          <p className="mt-0.5 text-sm text-[var(--color-text-muted)]">{subtitle}</p>
        ) : null}
      </header>
      {children}
    </div>
  );
}
