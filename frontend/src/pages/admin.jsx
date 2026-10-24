import { useNavigate } from "react-router-dom";

import estadisticasImg from "../assets/estadisticas.png";
import cajerosImg from "../assets/cajeros.png";
import serviciosImg from "../assets/servicios.png";
import usuariosImg from "../assets/ids.png";
import resenasImg from "../assets/resenas.png";
import productosImg from "../assets/productos.png";

export default function AdminDashboard() {
  const navigate = useNavigate();

  const rol = localStorage.getItem("rol");

  if (rol !== "administrador") {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <p className="text-gray-600">
          No tienes permiso para acceder a esta sección. Solo administradores.
        </p>
      </div>
    );
  }

  const options = [
    { label: "Estadísticas", icon: estadisticasImg, path: "/estadisticas" },
    { label: "Cajas", icon: cajerosImg, path: "/cajas" },
    { label: "Servicios", icon: serviciosImg, path: "/servicios" },
    { label: "Usuarios", icon: usuariosImg, path: "/clienteManagement" },
    { label: "Productos", icon: productosImg, path: "/producto" },
    { label: "Facturas", icon: resenasImg, path: "/facturas" },
  ];

  return (
    <main className="flex justify-center items-center min-h-screen">
      <div className="bg-white p-15 rounded-xl shadow-lg w-full max-w-3xl">
        {/* Opciones de menú */}
        <div className="grid grid-cols-3 gap-6">
          {options.map((opt, index) => (
            <div
              key={index}
              className="flex flex-col items-center bg-green-500 text-white rounded-lg p-6 shadow-md hover:scale-105 transition transform cursor-pointer"
              onClick={() => navigate(opt.path)}
            >
              <img src={opt.icon} alt={opt.label} className="h-22 w-22 mb-0" />
              <span className="text-lg font-bold">{opt.label}</span>
            </div>
          ))}
        </div>
      </div>
    </main>
  );
}
