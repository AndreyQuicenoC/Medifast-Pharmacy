import ClientManagement from "../pages/clienteManagement";

export default function UserList() {
  const rol = localStorage.getItem("rol");

  if (rol !== "administrador") {
    return <p>No tienes permiso para acceder a esta sección.</p>;
  }

  return <ClientManagement />;
}
