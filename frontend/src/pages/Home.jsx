import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { IconPharmacy } from "../components/icons";
import Tooltip from "../components/Tooltip";

const slides = [
  {
    title: "Medifast, tu farmacia de confianza en Cali",
    text: "Medicamentos de calidad, orientación profesional y atención cercana para toda la familia.",
    accent: "from-emerald-600 to-green-800",
  },
  {
    title: "Cuidamos de ti en cada visita",
    text: "Dispensación segura, control de tratamientos y servicios de bienestar en mostrador.",
    accent: "from-teal-600 to-emerald-800",
  },
  {
    title: "Más que medicinas: acompañamiento real",
    text: "Vacunación, signos vitales, consulta farmacéutica y entrega a domicilio cuando lo necesitas.",
    accent: "from-green-700 to-lime-800",
  },
];

const services = [
  {
    title: "Dispensación responsable",
    description:
      "Entrega de medicamentos con validación farmacéutica y orientación sobre dosis y horarios.",
  },
  {
    title: "Consulta farmacéutica",
    description:
      "Resolvemos dudas sobre tratamientos, interacciones y productos de autocuidado.",
  },
  {
    title: "Signos vitales y prevención",
    description:
      "Toma de presión, control de glucosa y seguimiento para personas con condiciones crónicas.",
  },
  {
    title: "Vacunación y PAI",
    description: "Esquemas según calendario nacional, con registro y recomendaciones posteriores.",
  },
  {
    title: "Dermocosmética y bienestar",
    description: "Asesoría en cuidado de la piel, protección solar y productos de higiene personal.",
  },
  {
    title: "Entrega a domicilio",
    description: "Pedidos programados en Cali para quienes prefieren recibir en casa con puntualidad.",
  },
];

export default function Home() {
  const [index, setIndex] = useState(0);

  useEffect(() => {
    const id = setInterval(() => setIndex((i) => (i + 1) % slides.length), 6000);
    return () => clearInterval(id);
  }, []);

  const slide = slides[index];

  return (
    <main
      id="main-content"
      className="mx-auto flex w-full max-w-6xl flex-1 flex-col px-4 py-10 md:py-12"
      tabIndex={-1}
    >
      <section className="relative overflow-hidden rounded-2xl text-white shadow-[var(--shadow-card)]">
        <div
          className={`absolute inset-0 bg-gradient-to-br ${slide.accent} opacity-95 transition-all duration-700`}
        />
        <div className="relative grid gap-8 p-8 md:grid-cols-2 md:p-12">
          <div className="flex flex-col justify-center">
            <p className="text-sm font-medium uppercase tracking-wider text-emerald-100">
              Medifast Pharmacy
            </p>
            <h1 className="mt-2 text-3xl font-bold leading-tight md:text-4xl">{slide.title}</h1>
            <p className="mt-4 text-emerald-50/95">{slide.text}</p>
            <div className="mt-8 flex flex-wrap gap-3">
              <Tooltip label="Acceder a turnos y servicios">
                <Link
                  to="/login"
                  className="btn-hero-white inline-flex min-h-[2.75rem] min-w-[9rem] items-center justify-center"
                >
                  Ingresar
                </Link>
              </Tooltip>
              <Tooltip label="Conoce nuestra historia y valores">
                <Link
                  to="/sobre-nosotros"
                  className="inline-flex min-w-[9rem] items-center justify-center rounded-lg border border-white/40 bg-white/10 px-5 py-2.5 text-sm font-semibold text-white backdrop-blur hover:bg-white/20"
                >
                  Sobre nosotros
                </Link>
              </Tooltip>
            </div>
            <div className="mt-6 flex gap-2" aria-label="Carrusel">
              {slides.map((_, i) => (
                <Tooltip key={i} label={`Ver mensaje ${i + 1}`}>
                  <button
                    type="button"
                    aria-label={`Diapositiva ${i + 1}`}
                    onClick={() => setIndex(i)}
                    className={`h-2 rounded-full transition-all ${i === index ? "w-8 bg-white" : "w-2 bg-white/40"}`}
                  />
                </Tooltip>
              ))}
            </div>
          </div>
          <div className="flex items-center justify-center">
            <div className="animate-float rounded-3xl border border-white/20 bg-white/10 p-10 backdrop-blur">
              <IconPharmacy className="h-24 w-24 text-white" />
            </div>
          </div>
        </div>
      </section>

      <section className="mt-12">
        <h2 className="text-center text-2xl font-bold text-[var(--color-text)]">
          Lo que encontrarás en Medifast
        </h2>
        <p className="mx-auto mt-2 max-w-2xl text-center text-sm text-[var(--color-text-muted)]">
          Un espacio pensado para tu salud: filas ordenadas, atención prioritaria para adultos mayores
          y un equipo que te escucha en mostrador.
        </p>
        <div className="mt-8 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {services.map((item) => (
            <article
              key={item.title}
              className="rounded-xl border border-emerald-100 bg-white/95 p-6 shadow-[var(--shadow-card)] transition hover:-translate-y-0.5 hover:border-emerald-200"
            >
              <h3 className="text-lg font-semibold text-emerald-900">{item.title}</h3>
              <p className="mt-2 text-sm leading-relaxed text-[var(--color-text-muted)]">
                {item.description}
              </p>
            </article>
          ))}
        </div>
      </section>

      <section className="mt-12 rounded-2xl border border-emerald-100 bg-emerald-50/60 p-8 md:p-10">
        <div className="grid gap-6 md:grid-cols-3 md:gap-8">
          <div className="text-center md:text-left">
            <p className="text-3xl font-bold text-emerald-800">Turnos claros</p>
            <p className="mt-2 text-sm text-[var(--color-text-muted)]">
              Solicita tu turno por servicio y conoce tu número y caja asignada sin confusiones.
            </p>
          </div>
          <div className="text-center md:text-left">
            <p className="text-3xl font-bold text-emerald-800">Atención justa</p>
            <p className="mt-2 text-sm text-[var(--color-text-muted)]">
              Personas con condiciones prioritarias son atendidas con el respeto y la agilidad que merecen.
            </p>
          </div>
          <div className="text-center md:text-left">
            <p className="text-3xl font-bold text-emerald-800">Compromiso local</p>
            <p className="mt-2 text-sm text-[var(--color-text-muted)]">
              Farmacia de barrio con estándares profesionales: trato humano, productos confiables y horarios amplios.
            </p>
          </div>
        </div>
      </section>
    </main>
  );
}
