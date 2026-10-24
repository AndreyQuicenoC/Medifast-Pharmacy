const badges = [
  "Django 5.2",
  "DRF 3.18",
  "React 19",
  "Vite 6",
  "Tailwind CSS 4",
  "PostgreSQL",
  "pytest + cobertura",
  "GitHub Actions",
  "Ruff / Bandit",
  "Accesibilidad WCAG",
];

const aprendizajes = [
  "Arquitectura por dominios (identity, catalog, operations) y APIs REST coherentes.",
  "Pipelines CI con lint, tests, auditoría de dependencias y gates de cobertura.",
  "Frontend accesible: foco visible, rutas claras, mensajes de error comprensibles.",
  "Gestión de turnos y colas con reglas de negocio (prioridad, una caja activa por flujo).",
  "Documentación viva: CHANGELOG, CONTRIBUTING y demo desacoplada del monorepo.",
];

export default function Proyecto() {
  return (
    <main id="main-content" className="mx-auto max-w-4xl flex-1 px-4 py-10" tabIndex={-1}>
      <div className="overflow-hidden rounded-2xl bg-white/95 shadow-[var(--shadow-card)]">
        <div className="bg-gradient-to-r from-emerald-800 to-green-600 px-8 py-10 text-white md:px-10">
          <p className="text-sm font-medium uppercase tracking-wider text-emerald-100">Acerca del proyecto</p>
          <h1 className="mt-2 text-3xl font-bold">Medifast Pharmacy</h1>
          <p className="mt-3 max-w-2xl text-emerald-50/95">
            Aplicación full-stack para operación de farmacia: turnos, cajas, catálogo, facturación y
            estadísticas. Nació como proyecto de Desarrollo de Software I y se modernizó con enfoque en
            calidad, seguridad y DevOps.
          </p>
        </div>

        <div className="space-y-10 p-8 md:p-10">
          <section aria-labelledby="stack-heading">
            <h2 id="stack-heading" className="text-xl font-semibold text-[var(--color-text)]">
              Stack y herramientas
            </h2>
            <ul className="mt-4 flex flex-wrap gap-2">
              {badges.map((b) => (
                <li
                  key={b}
                  className="rounded-full border border-emerald-200 bg-emerald-50 px-3 py-1 text-xs font-semibold text-emerald-900"
                >
                  {b}
                </li>
              ))}
            </ul>
          </section>

          <section aria-labelledby="learn-heading">
            <h2 id="learn-heading" className="text-xl font-semibold text-[var(--color-text)]">
              Aprendizajes del equipo
            </h2>
            <ul className="mt-4 space-y-3">
              {aprendizajes.map((item) => (
                <li
                  key={item}
                  className="flex gap-3 rounded-lg border border-[var(--color-border)] bg-[var(--color-surface-muted)] px-4 py-3 text-sm text-[var(--color-text-muted)]"
                >
                  <span className="mt-1 h-2 w-2 shrink-0 rounded-full bg-emerald-600" aria-hidden />
                  {item}
                </li>
              ))}
            </ul>
          </section>

          <section aria-labelledby="credits-heading">
            <h2 id="credits-heading" className="text-xl font-semibold text-[var(--color-text)]">
              Origen y evolución
            </h2>
            <p className="mt-2 text-sm leading-relaxed text-[var(--color-text-muted)]">
              Integrantes originales: Francesco Garcia Vargas, Jonathan Aristizabal, Diego Espinosa,
              Adolfo Andrey Quiceno, Miguel Casanova, Diego Armado Espinosa y Jose Daniel Trujillo
              Suarez. Modernización posterior: Andrey Quiceno. Los integrantes originales no
              participaron necesariamente en los cambios posteriores.
            </p>
          </section>
        </div>
      </div>
    </main>
  );
}
