import { useNavigate } from "react-router-dom";

export default function AdminPageLayout({
  title,
  subtitle,
  backTo = "/admin",
  action,
  children,
}) {
  const navigate = useNavigate();

  return (
    <div className="mx-auto w-full max-w-7xl flex-1 px-4 py-6">
      <div className="overflow-hidden rounded-2xl border border-emerald-100 bg-white/95 shadow-[var(--shadow-card)]">
        <header className="flex flex-wrap items-center gap-3 border-b border-emerald-100 bg-gradient-to-r from-emerald-50/90 to-white px-5 py-4">
          <button
            type="button"
            className="btn-secondary min-h-[2.75rem] min-w-[6.5rem] py-2.5 text-sm font-semibold"
            onClick={() => (typeof backTo === "number" ? navigate(backTo) : navigate(backTo))}
          >
            Atrás
          </button>
          <div className="min-w-[12rem] flex-1">
            <h1 className="text-xl font-bold tracking-tight text-[var(--color-text)]">{title}</h1>
            {subtitle ? (
              <p className="mt-0.5 text-sm text-[var(--color-text-muted)]">{subtitle}</p>
            ) : null}
          </div>
          {action ? <div className="flex shrink-0 items-center gap-2">{action}</div> : null}
        </header>
        <div className="p-5 md:p-6">{children}</div>
      </div>
    </div>
  );
}
