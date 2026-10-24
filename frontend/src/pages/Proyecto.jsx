export default function Proyecto() {
  return (
    <main id="main-content" className="mx-auto max-w-3xl flex-1 px-4 py-10" tabIndex={-1}>
      <h1 className="text-3xl font-bold text-[var(--color-text)]">Acerca del proyecto</h1>
      <p className="mt-4 text-[var(--color-text-muted)]">
        Medifast Pharmacy es una aplicacion de gestion para farmacia desarrollada
        originalmente como proyecto academico en equipo (Desarrollo de Software I) y
        sometida a un proceso de modernizacion individual orientado a calidad,
        seguridad, accesibilidad, pruebas y DevOps.
      </p>
      <section className="mt-8" aria-labelledby="tech-heading">
        <h2 id="tech-heading" className="text-xl font-semibold text-[var(--color-text)]">
          Tecnologias verificadas
        </h2>
        <ul className="mt-2 list-disc space-y-1 pl-6 text-[var(--color-text-muted)]">
          <li>Backend: Django 5.1, Django REST Framework, PostgreSQL / SQLite (local)</li>
          <li>Frontend: React 19, Vite, Tailwind CSS 4</li>
          <li>Autenticacion: token DRF</li>
        </ul>
      </section>
      <section className="mt-8" aria-labelledby="credits-heading">
        <h2 id="credits-heading" className="text-xl font-semibold text-[var(--color-text)]">
          Origen y evolucion
        </h2>
        <p className="mt-2 text-sm text-[var(--color-text-muted)]">
          Integrantes originales: Francesco Garcia Vargas, Jonathan Aristizabal,
          Diego Espinosa, Adolfo Andrey Quiceno, Miguel Casanova, Diego Armado
          Espinosa y Jose Daniel Trujillo Suarez. Modernizacion posterior: Andrey
          Quiceno. Los integrantes originales no participaron necesariamente en
          los cambios posteriores.
        </p>
      </section>
    </main>
  );
}
