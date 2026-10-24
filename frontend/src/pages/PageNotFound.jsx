import { Link } from "react-router-dom";

export default function PageNotFound() {
  return (
    <main
      id="main-content"
      className="flex flex-1 flex-col items-center justify-center px-4 py-16 text-center"
      tabIndex={-1}
    >
      <p className="text-sm font-semibold uppercase tracking-wide text-[var(--color-primary)]">
        Error 404
      </p>
      <h1 className="mt-2 text-3xl font-bold text-[var(--color-text)] md:text-4xl">
        Pagina no encontrada
      </h1>
      <p className="mt-4 max-w-md text-[var(--color-text-muted)]">
        La ruta solicitada no existe o fue movida. Verifique la direccion o regrese
        a una seccion valida de Medifast.
      </p>
      <div className="mt-8 flex flex-wrap justify-center gap-3">
        <Link
          to="/login"
          className="rounded-lg bg-[var(--color-primary)] px-5 py-2.5 font-medium text-white no-underline hover:opacity-90 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--color-primary)]"
        >
          Ir al inicio de sesion
        </Link>
        <Link
          to="/servicios"
          className="rounded-lg border border-[var(--color-border)] bg-white px-5 py-2.5 font-medium text-[var(--color-text)] no-underline hover:bg-[var(--color-surface-muted)] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--color-primary)]"
        >
          Ver servicios
        </Link>
      </div>
    </main>
  );
}
