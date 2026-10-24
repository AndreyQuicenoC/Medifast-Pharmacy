import { useState, useEffect } from "react";
import { getFacturas } from "../api/facturas.api";

export default function Facturas() {
  const rol = localStorage.getItem("rol");
  const [facturas, setFacturas] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [filtroFecha, setFiltroFecha] = useState("");
  const [facturasFiltradas, setFacturasFiltradas] = useState([]);

  // Cargar facturas al montar el componente
  useEffect(() => {
    cargarFacturas();
  }, []);

  // Filtrar facturas por fecha
  useEffect(() => {
    if (!filtroFecha) {
      setFacturasFiltradas(facturas);
    } else {
      const facturasFiltradas = facturas.filter((factura) => {
        const fechaFactura = new Date(factura.fecha_factura)
          .toISOString()
          .split("T")[0];
        return fechaFactura === filtroFecha;
      });
      setFacturasFiltradas(facturasFiltradas);
    }
  }, [filtroFecha, facturas]);

  const cargarFacturas = async () => {
    try {
      setLoading(true);
      const response = await getFacturas();
      setFacturas(response);
      setError("");
    } catch (err) {
      console.error("Error al cargar facturas:", err);
      setError("Error al cargar las facturas. Intenta nuevamente.");
    } finally {
      setLoading(false);
    }
  };

  const formatearFecha = (fecha) => {
    if (!fecha) return "N/A";
    return new Date(fecha).toLocaleString("es-CO", {
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const formatearPrecio = (precio) => {
    return new Intl.NumberFormat("es-CO", {
      style: "currency",
      currency: "COP",
    }).format(precio);
  };

  const obtenerProductosInfo = (productos) => {
    try {
      const productosArray =
        typeof productos === "string" ? JSON.parse(productos) : productos;
      if (!Array.isArray(productosArray) || productosArray.length === 0) {
        return "Sin productos";
      }

      const totalItems = productosArray.reduce(
        (sum, prod) => sum + (prod.cantidad || 0),
        0
      );
      return `${totalItems} producto${totalItems !== 1 ? "s" : ""}`;
    } catch {
      return "Error al leer productos";
    }
  };

  if (rol !== "administrador") {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <p className="text-gray-600">
          No tienes permiso para acceder a esta sección. Solo administradores.
        </p>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Cargando facturas...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Encabezado */}
        <div className="bg-white p-6 rounded-lg shadow-lg mb-6">
          <h1 className="text-3xl font-bold text-center text-gray-800 mb-4">
            📋 Gestión de Facturas
          </h1>

          {/* Filtros */}
          <div className="flex justify-between items-center">
            <div className="flex items-center space-x-4">
              <label className="text-gray-700 font-semibold">
                Filtrar por fecha:
              </label>
              <input
                type="date"
                value={filtroFecha}
                onChange={(e) => setFiltroFecha(e.target.value)}
                className="px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
              />
              {filtroFecha && (
                <button
                  onClick={() => setFiltroFecha("")}
                  className="px-3 py-2 bg-gray-500 text-white rounded-lg hover:bg-gray-600 transition"
                >
                  Limpiar
                </button>
              )}
            </div>

            <button
              onClick={cargarFacturas}
              className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition"
            >
              🔄 Actualizar
            </button>
          </div>
        </div>

        {/* Estadísticas */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
          <div className="bg-white p-6 rounded-lg shadow-md">
            <h3 className="text-lg font-semibold text-gray-700 mb-2">
              Total Facturas
            </h3>
            <p className="text-3xl font-bold text-green-600">
              {facturasFiltradas.length}
            </p>
          </div>

          <div className="bg-white p-6 rounded-lg shadow-md">
            <h3 className="text-lg font-semibold text-gray-700 mb-2">
              Ventas del Día
            </h3>
            <p className="text-3xl font-bold text-blue-600">
              {formatearPrecio(
                facturasFiltradas.reduce(
                  (sum, f) => sum + parseFloat(f.Total || 0),
                  0
                )
              )}
            </p>
          </div>

          <div className="bg-white p-6 rounded-lg shadow-md">
            <h3 className="text-lg font-semibold text-gray-700 mb-2">
              Promedio por Factura
            </h3>
            <p className="text-3xl font-bold text-purple-600">
              {facturasFiltradas.length > 0
                ? formatearPrecio(
                    facturasFiltradas.reduce(
                      (sum, f) => sum + parseFloat(f.Total || 0),
                      0
                    ) / facturasFiltradas.length
                  )
                : formatearPrecio(0)}
            </p>
          </div>
        </div>

        {/* Error */}
        {error && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-6">
            {error}
          </div>
        )}

        {/* Lista de facturas */}
        <div className="bg-white rounded-lg shadow-lg overflow-hidden">
          {facturasFiltradas.length === 0 ? (
            <div className="p-8 text-center">
              <div className="text-gray-400 text-6xl mb-4">📄</div>
              <h3 className="text-xl font-semibold text-gray-600 mb-2">
                No hay facturas disponibles
              </h3>
              <p className="text-gray-500">
                {filtroFecha
                  ? "No se encontraron facturas para la fecha seleccionada."
                  : "Aún no se han generado facturas en el sistema."}
              </p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Factura #
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Turno
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Fecha
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Productos
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Total
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Acciones
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {facturasFiltradas.map((factura) => (
                    <tr key={factura.id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm font-medium text-gray-900">
                          #{factura.id}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-900">
                          {factura.ID_Turno
                            ? `Turno #${factura.ID_Turno}`
                            : "N/A"}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-900">
                          {formatearFecha(factura.fecha_factura)}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-900">
                          {obtenerProductosInfo(factura.productos_vendidos)}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm font-bold text-green-600">
                          {formatearPrecio(factura.Total)}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                        <button
                          onClick={() => {
                            try {
                              const productos =
                                typeof factura.productos_vendidos === "string"
                                  ? JSON.parse(factura.productos_vendidos)
                                  : factura.productos_vendidos;

                              alert(
                                `Detalles de Factura #${
                                  factura.id
                                }\n\nProductos:\n${
                                  Array.isArray(productos) &&
                                  productos.length > 0
                                    ? productos
                                        .map(
                                          (p) =>
                                            `• ${
                                              p.nombre || p.Nombre
                                            } - Cantidad: ${p.cantidad} - $${
                                              p.precio || p.Precio
                                            }`
                                        )
                                        .join("\n")
                                    : "Sin productos registrados"
                                }\n\nTotal: ${formatearPrecio(factura.Total)}`
                              );
                            } catch {
                              alert("Error al mostrar detalles de la factura");
                            }
                          }}
                          className="text-blue-600 hover:text-blue-900 transition"
                        >
                          Ver Detalles
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
