import { Link } from "react-router-dom";
import { IconPharmacy } from "../components/icons";

const values = [
  {
    title: "Cercanía",
    text: "Conocemos a quienes llegan cada semana por su tratamiento; los llamamos por su nombre y los escuchamos.",
  },
  {
    title: "Rigor",
    text: "Validamos recetas, verificamos interacciones y explicamos cómo tomar cada medicamento con claridad.",
  },
  {
    title: "Inclusión",
    text: "Adultos mayores, personas con movilidad reducida y familias reciben turnos prioritarios cuando la norma lo exige.",
  },
  {
    title: "Compromiso local",
    text: "Somos farmacia de barrio en Cali: apoyamos a la comunidad con prevención, vacunación y orientación sin costo de consulta.",
  },
];

export default function SobreNosotros() {
  return (
    <main id="main-content" className="mx-auto max-w-5xl flex-1 px-4 py-10 md:py-12" tabIndex={-1}>
      <div className="overflow-hidden rounded-2xl border border-emerald-100 bg-white/95 shadow-[var(--shadow-card)]">
        <div className="relative bg-gradient-to-br from-emerald-700 via-green-700 to-teal-800 px-8 py-12 text-white md:px-12">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_20%_20%,rgba(255,255,255,0.12),transparent_45%)]" />
          <div className="relative flex flex-col items-center gap-6 md:flex-row md:items-start">
            <div className="rounded-2xl border border-white/20 bg-white/10 p-5 backdrop-blur">
              <IconPharmacy className="h-14 w-14 text-white" />
            </div>
            <div>
              <p className="text-sm font-medium uppercase tracking-wider text-emerald-100">
                Medifast Pharmacy
              </p>
              <h1 className="mt-2 text-3xl font-bold md:text-4xl">Sobre nosotros</h1>
              <p className="mt-4 max-w-2xl text-emerald-50/95 leading-relaxed">
                Llevamos más de una década acompañando familias en Cali con medicamentos confiables,
                asesoría farmacéutica y un mostrador donde la paciencia y el respeto no son negociables.
              </p>
            </div>
          </div>
        </div>

        <blockquote className="border-b border-emerald-100 bg-emerald-50/70 px-8 py-10 md:px-12">
          <p className="text-lg font-medium italic leading-relaxed text-emerald-900 md:text-xl">
            «No vendemos solo cajas: acompañamos procesos de salud. Cada receta es la historia de
            alguien que confía en nosotros para cuidar lo más valioso.»
          </p>
          <footer className="mt-4 text-sm font-semibold text-emerald-800">
            — Equipo Medifast, mostrador Cali
          </footer>
        </blockquote>

        <div className="space-y-10 p-8 md:p-12">
          <section aria-labelledby="mision-heading">
            <h2 id="mision-heading" className="text-xl font-semibold text-[var(--color-text)]">
              Misión
            </h2>
            <p className="mt-3 leading-relaxed text-[var(--color-text-muted)]">
              Garantizar acceso oportuno a medicamentos y servicios de farmacia con calidad
              profesional, trato humano y procesos claros para quien espera en sala, quien atiende en
              caja y quien supervisa la operación diaria.
            </p>
          </section>

          <section aria-labelledby="vision-heading">
            <h2 id="vision-heading" className="text-xl font-semibold text-[var(--color-text)]">
              Visión
            </h2>
            <p className="mt-3 leading-relaxed text-[var(--color-text-muted)]">
              Ser la farmacia de referencia en nuestra ciudad por la confianza que generamos: filas
              ordenadas, tiempos de espera justos y un equipo que explica, no solo despacha.
            </p>
          </section>

          <section aria-labelledby="valores-heading">
            <h2 id="valores-heading" className="text-xl font-semibold text-[var(--color-text)]">
              Propuesta de valor
            </h2>
            <div className="mt-6 grid gap-4 sm:grid-cols-2">
              {values.map((v) => (
                <article
                  key={v.title}
                  className="rounded-xl border border-emerald-100 bg-gradient-to-br from-white to-emerald-50/40 p-5"
                >
                  <h3 className="font-semibold text-emerald-900">{v.title}</h3>
                  <p className="mt-2 text-sm leading-relaxed text-[var(--color-text-muted)]">
                    {v.text}
                  </p>
                </article>
              ))}
            </div>
          </section>

          <section
            aria-labelledby="servicios-heading"
            className="rounded-xl border border-teal-100 bg-teal-50/50 p-6 md:p-8"
          >
            <h2 id="servicios-heading" className="text-xl font-semibold text-teal-900">
              Lo que ofrecemos en mostrador
            </h2>
            <ul className="mt-4 grid gap-2 text-sm text-teal-900/90 sm:grid-cols-2">
              <li>• Dispensación con validación farmacéutica</li>
              <li>• Consulta sobre tratamientos y autocuidado</li>
              <li>• Toma de presión y control de signos vitales</li>
              <li>• Vacunación según esquema PAI</li>
              <li>• Dermocosmética y planificación familiar</li>
              <li>• Entrega programada a domicilio en Cali</li>
            </ul>
          </section>

          <div className="flex flex-wrap gap-3 border-t border-gray-100 pt-8">
            <Link to="/login" className="btn-primary inline-flex min-w-[10rem] justify-center">
              Visitar farmacia (ingresar)
            </Link>
            <Link to="/proyecto" className="btn-secondary inline-flex min-w-[10rem] justify-center">
              Acerca del proyecto académico
            </Link>
          </div>
        </div>
      </div>
    </main>
  );
}
