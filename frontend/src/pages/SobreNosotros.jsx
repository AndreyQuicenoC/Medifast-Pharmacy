import { Link } from "react-router-dom";
import { IconPharmacy } from "../components/icons";

const team = [
  "Francesco Garcia Vargas",
  "Jonathan Aristizabal",
  "Diego Espinosa",
  "Adolfo Andrey Quiceno",
  "Miguel Casanova",
  "Diego Armado Espinosa",
  "Jose Daniel Trujillo Suarez",
];

export default function SobreNosotros() {
  return (
    <main id="main-content" className="mx-auto max-w-4xl flex-1 px-4 py-10" tabIndex={-1}>
      <div className="rounded-2xl bg-white/95 p-8 shadow-[var(--shadow-card)] md:p-10">
        <div className="flex flex-col items-center text-center md:flex-row md:text-left md:items-start gap-6">
          <div className="rounded-2xl bg-emerald-50 p-5 text-emerald-700 animate-float">
            <IconPharmacy className="h-14 w-14" />
          </div>
          <div>
            <h1 className="text-3xl font-bold text-[var(--color-text)]">Sobre nosotros</h1>
            <p className="mt-3 text-[var(--color-text-muted)]">
              Somos un equipo de estudiantes de ingeniería que transformó una idea de clase en una
              plataforma completa para farmacias de barrio: turnos en sala de espera, cajas,
              dispensación y reportes para tomar mejores decisiones.
            </p>
          </div>
        </div>

        <section className="mt-10" aria-labelledby="mision-heading">
          <h2 id="mision-heading" className="text-xl font-semibold text-[var(--color-text)]">
            Nuestra misión
          </h2>
          <p className="mt-2 text-[var(--color-text-muted)]">
            Acercar tecnología útil a quienes atienden en mostrador cada día, sin sacrificar
            seguridad ni mantenibilidad del software.
          </p>
        </section>

        <section className="mt-8" aria-labelledby="equipo-heading">
          <h2 id="equipo-heading" className="text-xl font-semibold text-[var(--color-text)]">
            Equipo original
          </h2>
          <ul className="mt-4 grid gap-2 sm:grid-cols-2">
            {team.map((name) => (
              <li
                key={name}
                className="rounded-lg border border-[var(--color-border)] bg-[var(--color-surface-muted)] px-4 py-2 text-sm"
              >
                {name}
              </li>
            ))}
          </ul>
          <p className="mt-4 text-sm text-[var(--color-text-muted)]">
            La modernización posterior fue liderada por Andrey Quiceno, incorporando DevOps,
            pruebas automatizadas y estándares de accesibilidad.
          </p>
        </section>

        <div className="mt-10 flex flex-wrap gap-3">
          <Link to="/proyecto" className="btn-primary inline-flex min-w-[10rem] justify-center">
            Tecnologías y aprendizajes
          </Link>
          <Link to="/login" className="btn-secondary inline-flex min-w-[10rem] justify-center">
            Acceder al sistema
          </Link>
        </div>
      </div>
    </main>
  );
}
