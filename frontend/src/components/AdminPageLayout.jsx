import { useNavigate } from "react-router-dom";
import Tooltip from "./Tooltip";
import { IconBack } from "./ActionIconButton";

export default function AdminPageLayout({
  title,
  subtitle,
  backTo = "/admin",
  showBack = true,
  action,
  children,
}) {
  const navigate = useNavigate();

  return (
    <div className="mx-auto w-full max-w-7xl flex-1 px-4 py-8 md:px-6 md:py-10">
      <div className="overflow-hidden rounded-2xl border border-emerald-100 bg-white/95 shadow-[var(--shadow-card)]">
        <header className="flex flex-wrap items-center gap-3 border-b border-emerald-100 bg-gradient-to-r from-emerald-50/90 to-white px-5 py-4 md:px-6">
          {showBack ? (
            <Tooltip label="Volver al panel">
              <button
                type="button"
                className="inline-flex h-10 w-10 shrink-0 items-center justify-center rounded-full border border-emerald-200 bg-white text-emerald-800 shadow-sm transition hover:border-emerald-400 hover:bg-emerald-50"
                onClick={() => navigate(backTo)}
                aria-label="Volver al panel"
              >
                <IconBack />
              </button>
            </Tooltip>
          ) : null}
          <div className="min-w-[12rem] flex-1">
            <h1 className="text-xl font-bold tracking-tight text-[var(--color-text)] md:text-2xl">
              {title}
            </h1>
            {subtitle ? (
              <p className="mt-0.5 text-sm text-[var(--color-text-muted)]">{subtitle}</p>
            ) : null}
          </div>
          {action ? <div className="flex shrink-0 flex-wrap items-center gap-2">{action}</div> : null}
        </header>
        <div className="p-5 md:p-6 lg:p-7">{children}</div>
      </div>
    </div>
  );
}
