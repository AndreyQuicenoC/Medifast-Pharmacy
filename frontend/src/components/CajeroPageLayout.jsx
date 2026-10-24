import { useNavigate } from "react-router-dom";

export default function CajeroPageLayout({ title, subtitle, children }) {
  const navigate = useNavigate();

  return (
    <div className="mx-auto w-full max-w-[90rem] flex-1 px-4 py-6">
      <div className="mb-4 overflow-hidden rounded-2xl border border-emerald-100 bg-white/95 shadow-[var(--shadow-card)]">
        <div className="flex flex-wrap items-center gap-3 border-b border-emerald-100 bg-gradient-to-r from-teal-50 to-white px-5 py-4">
          <button
            type="button"
            className="btn-secondary min-h-[2.75rem] min-w-[6.5rem] py-2.5 text-sm font-semibold"
            onClick={() => navigate("/admin")}
          >
            Atrás
          </button>
          <div>
            <h1 className="text-xl font-bold text-[var(--color-text)]">{title}</h1>
            {subtitle ? (
              <p className="text-sm text-[var(--color-text-muted)]">{subtitle}</p>
            ) : null}
          </div>
        </div>
      </div>
      {children}
    </div>
  );
}
