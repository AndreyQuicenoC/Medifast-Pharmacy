import { useNavigate, useLocation, NavLink } from "react-router-dom";
import medifastLogo from "../assets/medifast_logo.png";
import { useConfirm } from "./ConfirmProvider";

const PUBLIC_LINKS = [
  { to: "/home", label: "Inicio" },
  { to: "/sobre-nosotros", label: "Sobre nosotros" },
  { to: "/proyecto", label: "Acerca del proyecto" },
];

export default function Header() {
  const navigate = useNavigate();
  const location = useLocation();
  const confirm = useConfirm();

  const isAuthenticated =
    localStorage.getItem("authToken") || localStorage.getItem("token");
  const rol = localStorage.getItem("rol");
  const isCajero = localStorage.getItem("is_cajero") === "true";
  const isClient = localStorage.getItem("is_client") === "true";

  const isPublicShell =
    ["/home", "/sobre-nosotros", "/proyecto", "/login", "/register", "/"].includes(
      location.pathname,
    ) || !isAuthenticated;

  const handleLogout = async () => {
    const ok = await confirm({
      title: "Cerrar sesión",
      message: "¿Estás seguro de que deseas salir de tu cuenta?",
      confirmLabel: "Cerrar sesión",
      destructive: true,
    });
    if (!ok) return;
    localStorage.removeItem("authToken");
    localStorage.removeItem("token");
    localStorage.removeItem("rol");
    localStorage.removeItem("is_cajero");
    localStorage.removeItem("is_client");
    navigate("/home");
  };

  const getUserRole = () => {
    if (rol === "administrador") return "Administrador";
    if (isCajero) return "Cajero";
    if (isClient) return "Cliente";
    return "Usuario";
  };

  const navLinkClass = ({ isActive }) =>
    `min-h-[2.75rem] inline-flex items-center text-sm font-medium transition-colors ${
      isActive ? "text-emerald-700" : "text-gray-600 hover:text-emerald-700"
    }`;

  return (
    <header className="sticky top-0 z-40 border-b border-gray-200/80 bg-white/95 backdrop-blur-md">
      <div className="mx-auto flex max-w-6xl items-center gap-4 px-4 py-3">
        <button
          type="button"
          className="flex shrink-0 items-center gap-2"
          onClick={() => navigate(isAuthenticated ? "/admin" : "/home")}
        >
          <img src={medifastLogo} alt="" className="h-9 w-auto" />
          <span className="text-2xl font-bold">
            <span className="text-green-700">Medi</span>
            <span className="text-amber-500">fast</span>
          </span>
        </button>

        {isPublicShell ? (
          <nav className="hidden flex-1 justify-center gap-8 md:flex" aria-label="Principal">
            {PUBLIC_LINKS.map((link) => (
              <NavLink key={link.to} to={link.to} className={navLinkClass}>
                {link.label}
              </NavLink>
            ))}
          </nav>
        ) : (
          <div className="flex-1" />
        )}

        <div className="ml-auto flex shrink-0 items-center gap-3">
          {!isAuthenticated && isPublicShell && (
            <NavLink to="/login" className="btn-primary min-h-[2.75rem] min-w-[7.5rem] py-2.5 text-center text-sm">
              Ingresar
            </NavLink>
          )}

          {isAuthenticated && location.pathname !== "/login" && (
            <span className="hidden text-sm text-gray-600 lg:inline">{getUserRole()}</span>
          )}

          {isAuthenticated && location.pathname !== "/login" && (
            <button
              type="button"
              className="min-h-[2.75rem] min-w-[7.5rem] rounded-lg bg-red-700 px-5 py-2.5 text-sm font-semibold text-white hover:bg-red-800"
              onClick={handleLogout}
            >
              Cerrar sesión
            </button>
          )}
        </div>
      </div>

      {isPublicShell && (
        <nav className="flex justify-center gap-4 border-t border-gray-100 px-4 py-2 md:hidden" aria-label="Principal móvil">
          {PUBLIC_LINKS.map((link) => (
            <NavLink key={link.to} to={link.to} className={navLinkClass}>
              {link.label}
            </NavLink>
          ))}
        </nav>
      )}
    </header>
  );
}
