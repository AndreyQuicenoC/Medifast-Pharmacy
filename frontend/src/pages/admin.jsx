import { useNavigate } from "react-router-dom";
import {
  IconAdminCajas,
  IconAdminFacturas,
  IconAdminProductos,
  IconAdminServicios,
  IconAdminStats,
  IconAdminUsuarios,
} from "../components/AdminModuleIcons";

export default function AdminDashboard() {
  const navigate = useNavigate();

  const rol = localStorage.getItem("rol");

  if (rol !== "administrador") {
    return (
      <main id="main-content" className="flex min-h-[50vh] flex-1 items-center justify-center px-4">
        <p className="rounded-xl bg-white/90 px-6 py-4 text-[var(--color-text-muted)] shadow-[var(--shadow-card)]">
          No tienes permiso para acceder a esta sección. Solo administradores.
        </p>
      </main>
    );
  }

  const options = [
    { label: "Estadísticas", Icon: IconAdminStats, path: "/estadisticas", tone: "from-emerald-600 to-green-700" },
    { label: "Cajas", Icon: IconAdminCajas, path: "/cajas", tone: "from-teal-600 to-emerald-700" },
    { label: "Servicios", Icon: IconAdminServicios, path: "/servicios", tone: "from-green-600 to-lime-700" },
    { label: "Usuarios", Icon: IconAdminUsuarios, path: "/clienteManagement", tone: "from-emerald-700 to-teal-800" },
    { label: "Productos", Icon: IconAdminProductos, path: "/producto", tone: "from-green-700 to-emerald-800" },
    { label: "Facturas", Icon: IconAdminFacturas, path: "/facturas", tone: "from-teal-700 to-green-800" },
  ];

  return (
    <main id="main-content" className="mx-auto flex w-full max-w-4xl flex-1 flex-col px-4 py-10" tabIndex={-1}>
      <div className="rounded-2xl border border-emerald-100 bg-white/95 p-8 shadow-[var(--shadow-card)]">
        <header className="mb-8 border-b border-gray-100 pb-6 text-center">
          <h1 className="text-2xl font-bold text-[var(--color-text)]">Panel administrativo</h1>
          <p className="mt-1 text-sm text-[var(--color-text-muted)]">Selecciona un módulo para continuar</p>
        </header>
        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {options.map((opt) => (
            <button
              key={opt.path}
              type="button"
              onClick={() => navigate(opt.path)}
              className={`group flex min-h-[10.5rem] flex-col items-center justify-center gap-3 rounded-2xl bg-gradient-to-br ${opt.tone} p-6 text-white shadow-md transition duration-200 hover:-translate-y-1 hover:shadow-lg`}
            >
              <opt.Icon />
              <span className="text-base font-semibold">{opt.label}</span>
            </button>
          ))}
        </div>
      </div>
    </main>
  );
}
