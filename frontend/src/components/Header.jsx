import { useNavigate, useLocation } from "react-router-dom";
import medifastLogo from "../assets/medifast_logo.png";

export default function Header() {
  const navigate = useNavigate();
  const location = useLocation();

  // Verificar si el usuario está autenticado
  const isAuthenticated =
    localStorage.getItem("authToken") || localStorage.getItem("token");
  const rol = localStorage.getItem("rol");
  const isCajero = localStorage.getItem("is_cajero") === "true";
  const isClient = localStorage.getItem("is_client") === "true";

  // Función para cerrar sesión
  const handleLogout = () => {
    if (window.confirm("¿Estás seguro de que deseas cerrar sesión?")) {
      // Limpiar todos los datos de autenticación
      localStorage.removeItem("authToken");
      localStorage.removeItem("token");
      localStorage.removeItem("rol");
      localStorage.removeItem("is_cajero");
      localStorage.removeItem("is_client");

      // Redirigir al login
      navigate("/");
    }
  };

  // Obtener el tipo de usuario para mostrar en la interfaz
  const getUserRole = () => {
    if (rol === "administrador") return "Administrador";
    if (isCajero) return "Cajero";
    if (isClient) return "Cliente";
    return "Usuario";
  };

  return (
    <header className="bg-white p-4 flex justify-between items-center mb-8">
      <div className="flex items-center">
        <img
          src={medifastLogo}
          alt="Logo"
          className="h-9 w-auto mr-2"
        />
        <span className="text-3xl font-bold cursor-pointer">
          <span className="text-green-600">Medi</span>
          <span className="text-yellow-500">fast</span>
        </span>
      </div>

      <div className="flex items-center space-x-4">
        {/* Mostrar información del usuario si está autenticado */}
        {isAuthenticated && location.pathname !== "/" && (
          <div className="text-sm text-gray-600">
            <span className="font-medium">{getUserRole()}</span>
          </div>
        )}

        {/* Botón de Atrás */}
        {location.pathname !== "/" && (
          <button
            className="bg-yellow-600 text-white hover:bg-yellow-700 cursor-pointer px-4 py-2 rounded-lg font-semibold w-32"
            onClick={() => navigate(-1)}
          >
            Atrás
          </button>
        )}

        {/* Botón de Logout */}
        {isAuthenticated && location.pathname !== "/" && (
          <button
            className="bg-red-600 text-white hover:bg-red-700 cursor-pointer px-4 py-2 rounded-lg font-semibold w-32"
            onClick={handleLogout}
          >
            Cerrar Sesión
          </button>
        )}
      </div>
    </header>
  );
}
