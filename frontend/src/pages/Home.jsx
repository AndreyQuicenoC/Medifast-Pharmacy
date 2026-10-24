import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { IconPharmacy } from "../components/icons";

const slides = [
  {
    title: "Atención farmacéutica con calidez humana",
    text: "Gestiona turnos, cajas y dispensación desde una plataforma pensada para equipos reales en Colombia.",
    accent: "from-emerald-600 to-green-800",
  },
  {
    title: "Operación ágil en mostrador y backoffice",
    text: "Facturación, inventario y estadísticas en un solo flujo, con roles claros para admin, cajero y cliente.",
    accent: "from-teal-600 to-emerald-800",
  },
  {
    title: "Proyecto académico, calidad de producto",
    text: "Medifast nació en equipo y evolucionó con pruebas, CI, accesibilidad y buenas prácticas de ingeniería.",
    accent: "from-green-700 to-lime-800",
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
    <main id="main-content" className="mx-auto flex w-full max-w-6xl flex-1 flex-col px-4 py-10" tabIndex={-1}>
      <section className="relative overflow-hidden rounded-2xl bg-gradient-to-br shadow-[var(--shadow-card)] text-white">
        <div className={`absolute inset-0 bg-gradient-to-br ${slide.accent} opacity-95 transition-all duration-700`} />
        <div className="relative grid gap-8 p-8 md:grid-cols-2 md:p-12">
          <div className="flex flex-col justify-center">
            <p className="text-sm font-medium uppercase tracking-wider text-emerald-100">Medifast Pharmacy</p>
            <h1 className="mt-2 text-3xl font-bold leading-tight md:text-4xl">{slide.title}</h1>
            <p className="mt-4 text-emerald-50/95">{slide.text}</p>
            <div className="mt-8 flex flex-wrap gap-3">
              <Link to="/login" className="btn-hero-white inline-flex min-h-[2.75rem] min-w-[9rem] items-center justify-center">
                Ingresar
              </Link>
              <Link
                to="/proyecto"
                className="inline-flex min-w-[9rem] items-center justify-center rounded-lg border border-white/40 bg-white/10 px-5 py-2.5 text-sm font-semibold text-white backdrop-blur hover:bg-white/20"
              >
                Ver proyecto
              </Link>
            </div>
            <div className="mt-6 flex gap-2" aria-label="Carrusel">
              {slides.map((_, i) => (
                <button
                  key={i}
                  type="button"
                  aria-label={`Diapositiva ${i + 1}`}
                  onClick={() => setIndex(i)}
                  className={`h-2 rounded-full transition-all ${i === index ? "w-8 bg-white" : "w-2 bg-white/40"}`}
                />
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

      <section className="mt-12 grid gap-6 md:grid-cols-3">
        {[
          { t: "Turnos inteligentes", d: "Colas por servicio, prioridad y caja disponible." },
          { t: "Panel administrativo", d: "Productos, usuarios, cajas y métricas en tiempo real." },
          { t: "Experiencia accesible", d: "Navegación clara, contraste y atajos de teclado." },
        ].map((item) => (
          <article
            key={item.t}
            className="rounded-xl border border-[var(--color-border)] bg-white/90 p-6 shadow-[var(--shadow-card)] transition hover:-translate-y-1"
          >
            <h2 className="text-lg font-semibold text-[var(--color-text)]">{item.t}</h2>
            <p className="mt-2 text-sm text-[var(--color-text-muted)]">{item.d}</p>
          </article>
        ))}
      </section>
    </main>
  );
}
