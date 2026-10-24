import { useState, useEffect } from "react";
import { getFacturas } from "../api/facturas.api";
import { PageShell } from "../components/PageState";

export default function Facturas() {
  const rol = localStorage.getItem("rol");
  const token =
    localStorage.getItem("authToken") || localStorage.getItem("token");
  const [facturas, setFacturas] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [filtroFecha, setFiltroFecha] = useState("");
  const [facturasFiltradas, setFacturasFiltradas] = useState([]);
  const [modalDetalles, setModalDetalles] = useState(false);
  const [facturaSeleccionada, setFacturaSeleccionada] = useState(null);
  
  // Estados para paginación
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalFacturas, setTotalFacturas] = useState(0);
  const [pageSize] = useState(20); // Facturas por página
  const [loadingPage, setLoadingPage] = useState(false);

  // Cargar facturas al montar el componente
  useEffect(() => {
    if (rol === "administrador" && token) {
      cargarFacturas(currentPage);
    } else if (rol !== "administrador") {
      setError(
        "No tienes permiso para acceder a esta sección. Solo administradores."
      );
      setLoading(false);
    } else if (!token) {
      setError("No estás autenticado. Por favor, inicia sesión.");
      setLoading(false);
    }
  }, [rol, token, currentPage]);

  // Filtrar facturas por fecha
  useEffect(() => {
    console.log("🔍 Aplicando filtro de fecha:", filtroFecha || "ninguno");
    console.log("📊 Total facturas disponibles:", facturas.length);

    if (!filtroFecha) {
      setFacturasFiltradas(facturas);
    } else {
      console.log("📅 Analizando fechas de facturas:");

      // Log detallado de todas las fechas antes del filtrado
      facturas.forEach((factura, index) => {
        console.log(
          `  Factura #${factura.id} (${index + 1}/${facturas.length}): "${
            factura.fecha_factura
          }"`
        );
      });

      const facturasFiltradas = facturas.filter((factura) => {
        try {
          if (!factura.fecha_factura) {
            console.log(`  ❌ Factura #${factura.id}: Sin fecha`);
            return false;
          }

          let fechaParaComparar = "";

          // El backend puede devolver fechas en formato ISO: "2025-07-22T00:05:15.066473Z"
          // o en formato español: "22/07/2025 12:05:15 a. m."

          if (factura.fecha_factura.includes("T")) {
            // Formato ISO: "2025-07-22T00:05:15.066473Z"
            // IMPORTANTE: Convertir a fecha local para comparar correctamente
            const fechaObj = new Date(factura.fecha_factura);
            const año = fechaObj.getFullYear();
            const mes = String(fechaObj.getMonth() + 1).padStart(2, "0");
            const dia = String(fechaObj.getDate()).padStart(2, "0");
            fechaParaComparar = `${año}-${mes}-${dia}`;

            console.log(
              `  📅 Factura #${factura.id}: ISO "${factura.fecha_factura}" -> Local "${fechaParaComparar}"`
            );
          } else {
            // Formato español: "22/07/2025 12:05:15 a. m."
            const fechaFacturaStr = factura.fecha_factura.split(" ")[0]; // "22/07/2025"
            const [dia, mes, año] = fechaFacturaStr.split("/");

            // Convertir la fecha del filtro (formato ISO YYYY-MM-DD) a formato comparable
            fechaParaComparar = `${año}-${mes.padStart(2, "0")}-${dia.padStart(
              2,
              "0"
            )}`;
            console.log(
              `  📅 Factura #${factura.id}: Español "${factura.fecha_factura}" -> "${fechaParaComparar}"`
            );
          }

          const coincide = fechaParaComparar === filtroFecha;
          console.log(
            `  ${coincide ? "✅" : "❌"} Factura #${
              factura.id
            }: "${fechaParaComparar}" ${
              coincide ? "===" : "!=="
            } "${filtroFecha}"`
          );

          return coincide;
        } catch (error) {
          console.error(
            `❌ Error al parsear fecha de factura #${factura.id}:`,
            error,
            factura.fecha_factura
          );
          return false;
        }
      });

      console.log(
        `🎯 Filtrado completado: ${facturasFiltradas.length} de ${facturas.length} facturas coinciden con "${filtroFecha}"`
      );

      // Log de las facturas que SÍ coincidieron
      if (facturasFiltradas.length > 0) {
        console.log("✅ Facturas que coincidieron:");
        facturasFiltradas.forEach((f) => {
          console.log(`  - Factura #${f.id}: ${f.fecha_factura}`);
        });
      } else {
        console.log("❌ Ninguna factura coincidió con el filtro");
      }

      setFacturasFiltradas(facturasFiltradas);
    }
  }, [filtroFecha, facturas]);

  const cargarFacturas = async (page = 1) => {
    try {
      setLoadingPage(page !== 1); // Mostrar loading solo si no es la primera carga
      if (page === 1) setLoading(true);
      setError(""); // Limpiar errores previos

      console.log(`🔄 Cargando facturas página ${page}...`);
      const response = await getFacturas(page, pageSize);
      console.log("📦 Facturas cargadas desde API:", response);
      
      setFacturas(response.results || []);
      setTotalFacturas(response.count || 0);
      setTotalPages(response.totalPages || 1);
      setCurrentPage(response.currentPage || page);
      
      console.log("📊 Información de paginación:", {
        página: response.currentPage || page,
        totalPáginas: response.totalPages || 1,
        totalFacturas: response.count || 0,
        facturasPágina: response.results?.length || 0
      });

      // Log detallado de fechas al cargar
      if (response.results && response.results.length > 0) {
        console.log("📅 Fechas de facturas en esta página:");
        response.results.forEach((factura, index) => {
          console.log(
            `  ${index + 1}. Factura #${factura.id}: "${factura.fecha_factura}"`
          );
        });
      }

      setError("");
    } catch (err) {
      console.error("❌ Error al cargar facturas:", err);

      // Manejar diferentes tipos de errores
      if (err.response?.status === 401) {
        setError("No estás autorizado. Por favor, inicia sesión nuevamente.");
      } else if (err.response?.status === 403) {
        setError("No tienes permiso para ver las facturas.");
      } else if (err.response?.status === 404) {
        setError("El endpoint de facturas no fue encontrado.");
      } else if (err.code === "NETWORK_ERROR" || !err.response) {
        setError(
          "Error de conexión. Verifica que el servidor esté funcionando."
        );
      } else {
        setError(`Error inesperado: ${err.message}`);
      }
    } finally {
      setLoading(false);
      setLoadingPage(false);
    }
  };

  // Funciones de paginación
  const irAPagina = (page) => {
    if (page >= 1 && page <= totalPages && page !== currentPage) {
      setCurrentPage(page);
    }
  };

  const paginaAnterior = () => {
    if (currentPage > 1) {
      setCurrentPage(currentPage - 1);
    }
  };

  const paginaSiguiente = () => {
    if (currentPage < totalPages) {
      setCurrentPage(currentPage + 1);
    }
  };

  const mostrarDetallesFactura = (factura) => {
    setFacturaSeleccionada(factura);
    setModalDetalles(true);
  };

  const cerrarModal = () => {
    setModalDetalles(false);
    setFacturaSeleccionada(null);
  };

  const formatearFecha = (fecha) => {
    if (!fecha) return "N/A";

    try {
      // El backend puede devolver fechas en formato ISO: "2025-07-22T00:05:15.066473Z"
      // o en formato español: "22/07/2025 12:05:15 a. m."

      if (fecha.includes("T")) {
        // Formato ISO: "2025-07-22T00:05:15.066473Z"
        const fechaObj = new Date(fecha);
        return fechaObj.toLocaleString("es-CO", {
          year: "numeric",
          month: "2-digit",
          day: "2-digit",
          hour: "2-digit",
          minute: "2-digit",
        });
      } else if (typeof fecha === "string" && fecha.includes("/")) {
        // Formato español: "22/07/2025 12:05:15 a. m."
        const partes = fecha.split(" ");
        const fechaParte = partes[0]; // "22/07/2025"
        const horaParte = partes.slice(1).join(" "); // "12:05:15 a. m."

        const [dia, mes, año] = fechaParte.split("/");

        // Crear objeto Date
        const fechaObj = new Date(año, mes - 1, dia);

        // Formatear con hora si está disponible
        if (horaParte) {
          // Intentar parsear la hora
          let horaCompleta = horaParte;

          // Convertir formato 12h a 24h para Date
          if (
            horaCompleta.includes("a. m.") ||
            horaCompleta.includes("p. m.")
          ) {
            const esAM = horaCompleta.includes("a. m.");
            const horaSinAMPM = horaCompleta.replace(/[ap]\. m\./, "").trim();
            const [hora, minuto, segundo] = horaSinAMPM
              .split(":")
              .map((n) => parseInt(n) || 0);

            let hora24 = hora;
            if (!esAM && hora !== 12) hora24 += 12;
            if (esAM && hora === 12) hora24 = 0;

            fechaObj.setHours(hora24, minuto, segundo || 0);
          }
        }

        return fechaObj.toLocaleString("es-CO", {
          year: "numeric",
          month: "2-digit",
          day: "2-digit",
          hour: "2-digit",
          minute: "2-digit",
        });
      }

      // Fallback para otros formatos
      return new Date(fecha).toLocaleString("es-CO", {
        year: "numeric",
        month: "2-digit",
        day: "2-digit",
        hour: "2-digit",
        minute: "2-digit",
      });
    } catch (error) {
      console.error("Error al formatear fecha:", error, fecha);
      return fecha; // Devolver fecha original si hay error
    }
  };

  const formatearPrecio = (precio) => {
    return new Intl.NumberFormat("es-CO", {
      style: "currency",
      currency: "COP",
    }).format(precio);
  };

  const obtenerProductosInfo = (productos) => {
    try {
      let productosArray;

      // Si ya es un array, usarlo directamente
      if (Array.isArray(productos)) {
        productosArray = productos;
      } else if (typeof productos === "string" && productos.trim()) {
        // Intentar JSON.parse primero (formato correcto)
        try {
          productosArray = JSON.parse(productos);
        } catch (firstError) {
          // Si JSON.parse falla, intentar eval para formato Python-style
          // NOTA: eval es peligroso, pero aquí es controlado
          try {
            // Convertir comillas simples a dobles para JSON válido
            const fixedJson = productos
              .replace(/'/g, '"')
              .replace(/True/g, "true")
              .replace(/False/g, "false");

            productosArray = JSON.parse(fixedJson);
          } catch (secondError) {
            console.error("Error al parsear productos (ambos métodos):", {
              original: productos,
              firstError: firstError.message,
              secondError: secondError.message,
            });
            return "Error al leer productos";
          }
        }
      } else {
        return "Sin productos";
      }

      // Validar que sea un array válido
      if (!Array.isArray(productosArray) || productosArray.length === 0) {
        return "Sin productos";
      }

      // Calcular total de items
      const totalItems = productosArray.reduce(
        (sum, prod) => sum + (prod.cantidad || 0),
        0
      );

      return `${totalItems} producto${totalItems !== 1 ? "s" : ""}`;
    } catch (error) {
      console.error("Error general al parsear productos:", error);
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

  return (
    <PageShell loading={loading} loadingMessage="Cargando facturas...">
    <>
      {/* Estilos para saltos de página en impresión */}
      <style jsx>{`
        @media print {
          .page-break-before-always {
            page-break-before: always;
          }

          @page {
            margin: 0.75in;
            size: A4;
          }

          /* Ocultar scroll bars en impresión */
          * {
            overflow: visible !important;
          }

          /* Asegurar que cada página tenga altura completa */
          .print-page {
            min-height: 100vh;
          }
        }
      `}</style>

      <div className="min-h-screen bg-gray-100 p-6 max-w-10xl mr-50 ml-50 rounded-xl">
        <div className="max-w-7xl mx-auto">
          {/* Encabezado */}
          <div className="bg-white p-6 rounded-lg shadow-lg mb-6">
            <h1 className="text-3xl font-bold text-center text-gray-800 mb-4">
              Gestión de Facturas
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
                  onChange={(e) => {
                    console.log("Filtro de fecha cambiado a:", e.target.value);
                    setFiltroFecha(e.target.value);
                  }}
                  className="px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                  max={new Date().toISOString().split("T")[0]} // No permitir fechas futuras
                  title="Seleccionar fecha para filtrar facturas"
                />
                <button
                  onClick={() => {
                    const hoy = new Date().toISOString().split("T")[0];
                    console.log("Filtrando por hoy:", hoy);
                    setFiltroFecha(hoy);
                  }}
                  className="px-3 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition text-sm"
                >
                  Hoy
                </button>
                {filtroFecha && (
                  <button
                    onClick={() => {
                      console.log("Limpiando filtro de fecha");
                      setFiltroFecha("");
                    }}
                    className="px-3 py-2 bg-gray-500 text-white rounded-lg hover:bg-gray-600 transition"
                  >
                    Limpiar
                  </button>
                )}
              </div>

              <button
                onClick={() => {
                  console.log("Botón actualizar presionado");
                  cargarFacturas(currentPage);
                }}
                className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition"
                disabled={loading || loadingPage}
              >
                {loading || loadingPage ? "Cargando..." : "Actualizar"}
              </button>
            </div>
            
            {/* Información de paginación */}
            <div className="flex items-center justify-between text-sm text-gray-600 mb-4">
              <div>
                Mostrando {facturas.length > 0 ? ((currentPage - 1) * pageSize + 1) : 0} - {Math.min(currentPage * pageSize, totalFacturas)} de {totalFacturas} facturas
              </div>
              <div>
                Página {currentPage} de {totalPages}
              </div>
            </div>
          </div>

          {/* Estadísticas */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
            <div className="bg-white p-6 rounded-lg shadow-md">
              <h3 className="text-lg font-semibold text-gray-700 mb-2">
                Total Facturas
              </h3>
              <p className="text-3xl font-bold text-green-600">
                {filtroFecha ? facturasFiltradas.length : totalFacturas}
              </p>
              <p className="text-sm text-gray-500 mt-1">
                {filtroFecha
                  ? `Filtradas del ${filtroFecha} (de ${totalFacturas} total)`
                  : "En toda la base de datos"}
              </p>
            </div>

            <div className="bg-white p-6 rounded-lg shadow-md">
              <h3 className="text-lg font-semibold text-gray-700 mb-2">
                Ventas {filtroFecha ? "del Día" : "de esta Página"}
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
              <div
                className="overflow-x-auto"
                style={{
                  maxHeight: "calc(100vh - 280px)",
                  scrollbarWidth: "thin",
                }}
              >
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
                            onClick={() => mostrarDetallesFactura(factura)}
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

          {/* Controles de Paginación */}
          {!filtroFecha && totalPages > 1 && (
            <div className="bg-white px-6 py-4 border-t border-gray-200 rounded-b-lg">
              <div className="flex items-center justify-between">
                <div className="text-sm text-gray-700">
                  Mostrando {facturas.length > 0 ? ((currentPage - 1) * pageSize + 1) : 0} - {Math.min(currentPage * pageSize, totalFacturas)} de {totalFacturas} facturas
                </div>
                
                <div className="flex items-center space-x-2">
                  {/* Botón Primera página */}
                  <button
                    onClick={() => irAPagina(1)}
                    disabled={currentPage === 1 || loadingPage}
                    className={`px-3 py-2 text-sm rounded-md ${
                      currentPage === 1 || loadingPage
                        ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                        : 'bg-white text-gray-700 border border-gray-300 hover:bg-gray-50'
                    }`}
                  >
                    ««
                  </button>
                  
                  {/* Botón Anterior */}
                  <button
                    onClick={paginaAnterior}
                    disabled={currentPage === 1 || loadingPage}
                    className={`px-3 py-2 text-sm rounded-md ${
                      currentPage === 1 || loadingPage
                        ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                        : 'bg-white text-gray-700 border border-gray-300 hover:bg-gray-50'
                    }`}
                  >
                    ‹ Anterior
                  </button>

                  {/* Números de página */}
                  <div className="flex space-x-1">
                    {(() => {
                      const pages = [];
                      const maxVisible = 5;
                      let start = Math.max(1, currentPage - Math.floor(maxVisible / 2));
                      let end = Math.min(totalPages, start + maxVisible - 1);
                      
                      if (end - start + 1 < maxVisible) {
                        start = Math.max(1, end - maxVisible + 1);
                      }

                      for (let i = start; i <= end; i++) {
                        pages.push(
                          <button
                            key={i}
                            onClick={() => irAPagina(i)}
                            disabled={loadingPage}
                            className={`px-3 py-2 text-sm rounded-md ${
                              i === currentPage
                                ? 'bg-blue-600 text-white'
                                : loadingPage
                                ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                                : 'bg-white text-gray-700 border border-gray-300 hover:bg-gray-50'
                            }`}
                          >
                            {i}
                          </button>
                        );
                      }
                      return pages;
                    })()}
                  </div>

                  {/* Botón Siguiente */}
                  <button
                    onClick={paginaSiguiente}
                    disabled={currentPage === totalPages || loadingPage}
                    className={`px-3 py-2 text-sm rounded-md ${
                      currentPage === totalPages || loadingPage
                        ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                        : 'bg-white text-gray-700 border border-gray-300 hover:bg-gray-50'
                    }`}
                  >
                    Siguiente ›
                  </button>
                  
                  {/* Botón Última página */}
                  <button
                    onClick={() => irAPagina(totalPages)}
                    disabled={currentPage === totalPages || loadingPage}
                    className={`px-3 py-2 text-sm rounded-md ${
                      currentPage === totalPages || loadingPage
                        ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                        : 'bg-white text-gray-700 border border-gray-300 hover:bg-gray-50'
                    }`}
                  >
                    »»
                  </button>
                </div>
              </div>
              
              {loadingPage && (
                <div className="mt-4 flex items-center justify-center">
                  <div className="flex items-center space-x-2 text-blue-600">
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-blue-600"></div>
                    <span className="text-sm">Cargando página {currentPage}...</span>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* Modal de Detalles */}
          {modalDetalles && facturaSeleccionada && (
            <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
              <div className="bg-white rounded-lg shadow-xl max-w-4xl w-full h-[90vh] flex flex-col">
                {/* Header del Modal - Siempre visible */}
                <div className="bg-gradient-to-r from-blue-600 to-blue-700 text-white p-6 rounded-t-lg flex-shrink-0">
                  <div className="flex justify-between items-center">
                    <h2 className="text-2xl font-bold">
                      Detalles de Factura #{facturaSeleccionada.id}
                    </h2>
                    <button
                      onClick={cerrarModal}
                      className="text-white hover:text-gray-200 transition-colors"
                    >
                      <svg
                        className="w-6 h-6"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M6 18L18 6M6 6l12 12"
                        />
                      </svg>
                    </button>
                  </div>
                </div>

                {/* Contenido del Modal - Con scroll */}
                <div className="flex-1 overflow-y-auto">
                  <div className="p-6">
                    {/* Información General - Siempre visible */}
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
                      <div className="bg-gray-50 p-4 rounded-lg">
                        <h3 className="text-sm font-medium text-gray-500 uppercase tracking-wide mb-2">
                          Fecha de Factura
                        </h3>
                        <p className="text-lg font-semibold text-gray-900">
                          {formatearFecha(facturaSeleccionada.fecha_factura)}
                        </p>
                      </div>

                      <div className="bg-gray-50 p-4 rounded-lg">
                        <h3 className="text-sm font-medium text-gray-500 uppercase tracking-wide mb-2">
                          Turno
                        </h3>
                        <p className="text-lg font-semibold text-gray-900">
                          {facturaSeleccionada.ID_Turno
                            ? `#${facturaSeleccionada.ID_Turno}`
                            : "N/A"}
                        </p>
                      </div>

                      <div className="bg-green-50 p-4 rounded-lg border border-green-200">
                        <h3 className="text-sm font-medium text-green-600 uppercase tracking-wide mb-2">
                          Total Final
                        </h3>
                        <p className="text-2xl font-bold text-green-700">
                          {formatearPrecio(facturaSeleccionada.Total)}
                        </p>
                      </div>
                    </div>

                    {/* Lista de Productos - Con scroll independiente */}
                    <div className="mb-6">
                      <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center">
                        Productos Vendidos
                      </h3>

                      <div className="bg-gray-50 rounded-lg overflow-hidden">
                        {(() => {
                          try {
                            let productos;

                            // Manejo robusto de parsing
                            if (
                              Array.isArray(
                                facturaSeleccionada.productos_vendidos
                              )
                            ) {
                              productos =
                                facturaSeleccionada.productos_vendidos;
                            } else if (
                              typeof facturaSeleccionada.productos_vendidos ===
                                "string" &&
                              facturaSeleccionada.productos_vendidos.trim()
                            ) {
                              try {
                                // Intentar JSON.parse primero
                                productos = JSON.parse(
                                  facturaSeleccionada.productos_vendidos
                                );
                              } catch {
                                // Si falla, convertir formato Python a JSON
                                const fixedJson =
                                  facturaSeleccionada.productos_vendidos
                                    .replace(/'/g, '"')
                                    .replace(/True/g, "true")
                                    .replace(/False/g, "false");
                                productos = JSON.parse(fixedJson);
                              }
                            } else {
                              productos = [];
                            }

                            if (
                              !Array.isArray(productos) ||
                              productos.length === 0
                            ) {
                              return (
                                <div className="p-8 text-center text-gray-500">
                                  <div className="text-4xl mb-2">📦</div>
                                  <p>Sin productos registrados</p>
                                </div>
                              );
                            }

                            // Dividir productos en grupos de 2 para impresión
                            const productosEnPaginas = [];
                            for (let i = 0; i < productos.length; i += 4) {
                              productosEnPaginas.push(
                                productos.slice(i, i + 4)
                              );
                            }

                            return (
                              <>
                                {productosEnPaginas.map(
                                  (paginaProductos, paginaIndex) => (
                                    <div
                                      key={paginaIndex}
                                      className={`divide-y divide-gray-200 ${
                                        paginaIndex > 0
                                          ? "page-break-before-always"
                                          : ""
                                      }`}
                                      style={
                                        paginaIndex > 0
                                          ? { pageBreakBefore: "always" }
                                          : {}
                                      }
                                    >
                                      {/* Header de página (solo para páginas adicionales) */}
                                      {paginaIndex > 0 && (
                                        <div className="p-4 bg-blue-50 border-b">
                                          <h4 className="font-semibold text-gray-800">
                                            📋 Factura #{facturaSeleccionada.id}{" "}
                                            - Página {paginaIndex + 1}
                                          </h4>
                                          <p className="text-sm text-gray-600">
                                            Continuación de productos...
                                          </p>
                                        </div>
                                      )}

                                      {paginaProductos.map(
                                        (producto, index) => {
                                          const nombre =
                                            producto.nombre ||
                                            producto.Nombre ||
                                            "Producto sin nombre";
                                          const marca =
                                            producto.marca ||
                                            producto.Marca ||
                                            "";
                                          const cantidad =
                                            producto.cantidad || 0;
                                          const precio =
                                            producto.precio_unitario ||
                                            producto.precio ||
                                            producto.Precio ||
                                            0;
                                          const descuento =
                                            producto.descuento ||
                                            producto.Descuento ||
                                            0;
                                          const precioFinal =
                                            precio - descuento;
                                          const subtotal =
                                            producto.precio_total ||
                                            cantidad * precioFinal;

                                          return (
                                            <div
                                              key={`${paginaIndex}-${index}`}
                                              className="p-4 hover:bg-white transition-colors"
                                            >
                                              <div className="flex flex-col sm:flex-row sm:justify-between sm:items-start gap-3">
                                                <div className="flex-1">
                                                  <h4 className="font-semibold text-gray-900 text-lg">
                                                    {nombre}
                                                  </h4>
                                                  {marca && (
                                                    <p className="text-gray-600 text-sm">
                                                      Marca: {marca}
                                                    </p>
                                                  )}
                                                </div>

                                                <div className="sm:text-right space-y-1">
                                                  <div className="flex sm:flex-col gap-4 sm:gap-1">
                                                    <div className="text-sm">
                                                      <span className="text-gray-500">
                                                        Cantidad:
                                                      </span>
                                                      <span className="font-medium ml-1">
                                                        {cantidad}
                                                      </span>
                                                    </div>
                                                    <div className="text-sm">
                                                      <span className="text-gray-500">
                                                        Precio:
                                                      </span>
                                                      <span className="font-medium ml-1">
                                                        {formatearPrecio(
                                                          precio
                                                        )}
                                                      </span>
                                                    </div>
                                                  </div>

                                                  {descuento > 0 && (
                                                    <div className="text-sm text-red-600">
                                                      <span>Descuento:</span>
                                                      <span className="font-medium ml-1">
                                                        -
                                                        {formatearPrecio(
                                                          descuento
                                                        )}
                                                      </span>
                                                    </div>
                                                  )}

                                                  <div className="text-lg font-bold text-green-600 border-t pt-1">
                                                    {formatearPrecio(subtotal)}
                                                  </div>
                                                </div>
                                              </div>
                                            </div>
                                          );
                                        }
                                      )}

                                      {/* Footer de página con resumen (solo en la última página) */}
                                      {paginaIndex ===
                                        productosEnPaginas.length - 1 && (
                                        <div className="p-4 bg-green-50 border-t-2 border-green-200">
                                          <div className="flex justify-between items-center">
                                            <span className="text-gray-700 font-medium">
                                              Total de productos:{" "}
                                              {productos.length}
                                            </span>
                                            <span className="text-xl font-bold text-green-700">
                                              Total:{" "}
                                              {formatearPrecio(
                                                facturaSeleccionada.Total
                                              )}
                                            </span>
                                          </div>
                                        </div>
                                      )}
                                    </div>
                                  )
                                )}
                              </>
                            );
                          } catch (error) {
                            console.error("Error al mostrar productos:", error);
                            return (
                              <div className="p-8 text-center text-red-500">
                                <div className="text-4xl mb-2">❌</div>
                                <p>Error al cargar los productos</p>
                                <p className="text-sm text-gray-500 mt-1">
                                  {error.message}
                                </p>
                              </div>
                            );
                          }
                        })()}
                      </div>
                    </div>
                  </div>

                  {/* Botones de Acción */}
                  <div className="flex justify-end gap-3 pt-4 border-t bg-white sticky bottom-0 p-4">
                    <button
                      onClick={cerrarModal}
                      className="px-6 py-2 bg-gray-500 text-white rounded-lg hover:bg-gray-600 transition-colors"
                    >
                      Cerrar
                    </button>
                    <button
                      onClick={() => {
                        window.print();
                      }}
                      className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center gap-2"
                    >
                      <svg
                        className="w-4 h-4"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M17 17h2a2 2 0 002-2v-4a2 2 0 00-2-2H5a2 2 0 00-2 2v4a2 2 0 002 2h2m2 4h6a2 2 0 002-2v-4a2 2 0 00-2-2H9a2 2 0 00-2 2v4a2 2 0 002 2zm8-12V5a2 2 0 00-2-2H9a2 2 0 00-2 2v4h10z"
                        />
                      </svg>
                      Imprimir
                    </button>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </>
    </PageShell>
  );
}
