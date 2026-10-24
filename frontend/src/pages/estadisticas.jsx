import React, { useState, useEffect, useCallback } from "react";
import axios from "axios";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  LineElement,
  PointElement,
  ArcElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";
import { Bar, Line, Pie, Doughnut } from "react-chartjs-2";

// Registrar componentes de Chart.js
ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  LineElement,
  PointElement,
  ArcElement,
  Title,
  Tooltip,
  Legend
);

export default function Estadisticas() {
  const rol = localStorage.getItem("rol");
  // const token = localStorage.getItem("token"); // Not needed for testing

  const [periodo, setPeriodo] = useState("diario");
  const [loading, setLoading] = useState(false);
  const [activeTab, setActiveTab] = useState("resumen");

  // Estados para datos
  const [resumenData, setResumenData] = useState(null);
  const [ventasGenerales, setVentasGenerales] = useState(null);
  const [ventasProductos, setVentasProductos] = useState(null);
  const [serviciosData, setServiciosData] = useState(null);
  const [clientesData, setClientesData] = useState(null);
  const [tiemposData, setTiemposData] = useState(null);

  // Función para cargar todos los datos
  const cargarDatos = useCallback(async () => {
    setLoading(true);
    try {
      const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || "http://localhost:8000/api";
      const baseURL = `${API_BASE_URL}/estadisticas`;
      const params = { periodo };
      // Simplified config for testing (AllowAny backend)
      const axiosConfig = {
        params,
        headers: {
          "Content-Type": "application/json",
        },
      };

      const [resumen, ventas, productos, servicios, clientes, tiempos] =
        await Promise.all([
          axios.get(`${baseURL}/resumen/`, axiosConfig),
          axios.get(`${baseURL}/ventas-generales/`, axiosConfig),
          axios.get(`${baseURL}/ventas-por-producto/`, axiosConfig),
          axios.get(`${baseURL}/servicios/`, axiosConfig),
          axios.get(`${baseURL}/clientes/`, axiosConfig),
          axios.get(`${baseURL}/tiempos-atencion/`, axiosConfig),
        ]);

      setResumenData(resumen.data);
      setVentasGenerales(ventas.data);
      setVentasProductos(productos.data);
      setServiciosData(servicios.data);
      setClientesData(clientes.data);
      setTiemposData(tiempos.data);
    } catch (error) {
      console.error("Error cargando estadísticas:", error);
    } finally {
      setLoading(false);
    }
  }, [periodo]);

  useEffect(() => {
    cargarDatos(); // Load data regardless of role for testing
  }, [periodo, rol, cargarDatos]);

  // Temporarily allow access for testing
  // if (rol !== "administrador") {
  //   return (
  //     <div className="flex justify-center items-center min-h-screen">
  //       <p className="text-gray-600">
  //         No tienes permiso para acceder a esta sección. Solo administradores.
  //       </p>
  //     </div>
  //   );
  // }

  // Configuraciones de gráficos
  const chartOptions = {
    responsive: true,
    plugins: {
      legend: {
        position: "top",
      },
    },
    scales: {
      y: {
        beginAtZero: true,
      },
    },
  };

  const pieOptions = {
    responsive: true,
    plugins: {
      legend: {
        position: "bottom",
      },
    },
  };

  // Preparar datos para gráficos de ventas generales
  const ventasGeneralesChart = ventasGenerales
    ? {
        labels: ventasGenerales.labels,
        datasets: [
          {
            label: "Ventas Totales ($)",
            data: ventasGenerales.ventas_totales,
            backgroundColor: "rgba(34, 197, 94, 0.8)",
            borderColor: "rgba(34, 197, 94, 1)",
            borderWidth: 1,
          },
        ],
      }
    : null;

  // Gráfico de cantidad de ventas
  const cantidadVentasChart = ventasGenerales
    ? {
        labels: ventasGenerales.labels,
        datasets: [
          {
            label: "Cantidad de Ventas",
            data: ventasGenerales.cantidad_ventas,
            backgroundColor: "rgba(59, 130, 246, 0.8)",
            borderColor: "rgba(59, 130, 246, 1)",
            borderWidth: 1,
          },
        ],
      }
    : null;

  // Gráfico de productos más vendidos
  const productosChart =
    ventasProductos && ventasProductos.productos.length > 0
      ? {
          labels: ventasProductos.productos.slice(0, 8).map((p) => p.nombre),
          datasets: [
            {
              label: "Ingresos ($)",
              data: ventasProductos.productos
                .slice(0, 8)
                .map((p) => p.ingresos_totales),
              backgroundColor: [
                "#FF6384",
                "#36A2EB",
                "#FFCE56",
                "#4BC0C0",
                "#9966FF",
                "#FF9F40",
                "#FF6384",
                "#C9CBCF",
              ],
            },
          ],
        }
      : null;

  // Gráfico de servicios
  const serviciosChart =
    serviciosData && serviciosData.servicios.length > 0
      ? {
          labels: serviciosData.servicios.map((s) => s.nombre),
          datasets: [
            {
              label: "Usos del Servicio",
              data: serviciosData.servicios.map((s) => s.cantidad_usos),
              backgroundColor: "rgba(168, 85, 247, 0.8)",
              borderColor: "rgba(168, 85, 247, 1)",
              borderWidth: 1,
            },
          ],
        }
      : null;

  // Gráfico de clientes
  const clientesChart = clientesData
    ? {
        labels: clientesData.labels,
        datasets: [
          {
            label: "Clientes Únicos",
            data: clientesData.clientes_unicos,
            backgroundColor: "rgba(34, 197, 94, 0.8)",
            borderColor: "rgba(34, 197, 94, 1)",
            tension: 0.1,
            fill: false,
          },
          {
            label: "Nuevos Clientes",
            data: clientesData.nuevos_clientes,
            backgroundColor: "rgba(239, 68, 68, 0.8)",
            borderColor: "rgba(239, 68, 68, 1)",
            tension: 0.1,
            fill: false,
          },
        ],
      }
    : null;

  // Gráfico de tiempos de espera
  const tiemposEsperaChart = tiemposData
    ? {
        labels: Object.keys(tiemposData.rangos_espera),
        datasets: [
          {
            data: Object.values(tiemposData.rangos_espera),
            backgroundColor: ["#10B981", "#F59E0B", "#EF4444", "#8B5CF6"],
          },
        ],
      }
    : null;

  // Gráfico de tiempos de atención
  const tiemposAtencionChart = tiemposData
    ? {
        labels: Object.keys(tiemposData.rangos_atencion),
        datasets: [
          {
            data: Object.values(tiemposData.rangos_atencion),
            backgroundColor: ["#06B6D4", "#84CC16", "#F97316", "#EC4899"],
          },
        ],
      }
    : null;

  return (
    <div className="min-h-screen bg-gray-100 p-6 max-w-10xl mr-50 ml-50 rounded-xl">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="bg-white rounded-lg shadow-md p-6 mb-6">
          <h1 className="text-3xl font-bold text-gray-900 mb-4">
            📊 Panel de Estadísticas
          </h1>

          {/* Selector de período */}
          <div className="flex flex-wrap gap-4 mb-4">
            <select
              value={periodo}
              onChange={(e) => setPeriodo(e.target.value)}
              className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            >
              <option value="diario">Diario</option>
              <option value="semanal">Semanal</option>
              <option value="mensual">Mensual</option>
              <option value="anual">Anual</option>
            </select>

            <button
              onClick={cargarDatos}
              disabled={loading}
              className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50"
            >
              {loading ? "Cargando..." : "Actualizar"}
            </button>
          </div>

          {/* Tabs de navegación */}
          <div className="border-b border-gray-200">
            <nav className="-mb-px flex space-x-8">
              {[
                { id: "resumen", label: "Resumen General" },
                { id: "ventas", label: "Ventas" },
                { id: "productos", label: "Productos" },
                { id: "servicios", label: "Servicios" },
                { id: "clientes", label: "Clientes" },
                { id: "tiempos", label: "Tiempos" },
              ].map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`py-2 px-1 border-b-2 font-medium text-sm ${
                    activeTab === tab.id
                      ? "border-blue-500 text-blue-600"
                      : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
                  }`}
                >
                  {tab.label}
                </button>
              ))}
            </nav>
          </div>
        </div>

        {loading && (
          <div className="flex justify-center items-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
          </div>
        )}

        {/* Contenido de tabs */}
        {!loading && (
          <>
            {/* Tab Resumen */}
            {activeTab === "resumen" && resumenData && (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <div className="bg-white p-6 rounded-lg shadow-md">
                  <h3 className="text-lg font-semibold text-gray-700 mb-2">
                    💰 Ventas Totales
                  </h3>
                  <p className="text-3xl font-bold text-green-600">
                    ${resumenData.ventas.total.toLocaleString()}
                  </p>
                  <p className="text-sm text-gray-500">
                    {resumenData.ventas.cantidad_facturas} facturas
                  </p>
                </div>

                <div className="bg-white p-6 rounded-lg shadow-md">
                  <h3 className="text-lg font-semibold text-gray-700 mb-2">
                    🎫 Turnos
                  </h3>
                  <p className="text-3xl font-bold text-blue-600">
                    {resumenData.turnos.total}
                  </p>
                  <p className="text-sm text-gray-500">
                    {resumenData.turnos.porcentaje_exito}% exitosos
                  </p>
                </div>

                <div className="bg-white p-6 rounded-lg shadow-md">
                  <h3 className="text-lg font-semibold text-gray-700 mb-2">
                    👥 Clientes Únicos
                  </h3>
                  <p className="text-3xl font-bold text-purple-600">
                    {resumenData.clientes_unicos}
                  </p>
                  <p className="text-sm text-gray-500">En {periodo}</p>
                </div>

                <div className="bg-white p-6 rounded-lg shadow-md">
                  <h3 className="text-lg font-semibold text-gray-700 mb-2">
                    🎯 Promedio por Venta
                  </h3>
                  <p className="text-3xl font-bold text-orange-600">
                    ${resumenData.ventas.promedio_por_factura.toFixed(2)}
                  </p>
                  <p className="text-sm text-gray-500">Por factura</p>
                </div>
              </div>
            )}

            {/* Tab Ventas */}
            {activeTab === "ventas" && ventasGeneralesChart && (
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <div className="bg-white p-6 rounded-lg shadow-md">
                  <h3 className="text-xl font-semibold mb-4">
                    💰 Ventas Totales por {periodo}
                  </h3>
                  <Bar data={ventasGeneralesChart} options={chartOptions} />
                </div>

                <div className="bg-white p-6 rounded-lg shadow-md">
                  <h3 className="text-xl font-semibold mb-4">
                    📊 Cantidad de Ventas por {periodo}
                  </h3>
                  <Bar data={cantidadVentasChart} options={chartOptions} />
                </div>
              </div>
            )}

            {/* Tab Productos */}
            {activeTab === "productos" && productosChart && (
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <div className="bg-white p-6 rounded-lg shadow-md">
                  <h3 className="text-xl font-semibold mb-4">
                    🏆 Top Productos por Ingresos
                  </h3>
                  <Pie data={productosChart} options={pieOptions} />
                </div>

                <div className="bg-white p-6 rounded-lg shadow-md">
                  <h3 className="text-xl font-semibold mb-4">
                    📋 Detalle de Productos
                  </h3>
                  <div className="overflow-y-auto max-h-96">
                    {ventasProductos.productos
                      .slice(0, 10)
                      .map((producto, index) => (
                        <div
                          key={index}
                          className="flex justify-between items-center py-2 border-b border-gray-100"
                        >
                          <div>
                            <p className="font-medium">{producto.nombre}</p>
                            <p className="text-sm text-gray-500">
                              Vendidos: {producto.cantidad_vendida}
                            </p>
                          </div>
                          <div className="text-right">
                            <p className="font-bold text-green-600">
                              ${producto.ingresos_totales.toFixed(2)}
                            </p>
                            <p className="text-sm text-gray-500">
                              {producto.numero_ventas} ventas
                            </p>
                          </div>
                        </div>
                      ))}
                  </div>
                </div>
              </div>
            )}

            {/* Tab Servicios */}
            {activeTab === "servicios" && serviciosChart && (
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <div className="bg-white p-6 rounded-lg shadow-md">
                  <h3 className="text-xl font-semibold mb-4">
                    🎯 Uso de Servicios
                  </h3>
                  <Bar data={serviciosChart} options={chartOptions} />
                </div>

                <div className="bg-white p-6 rounded-lg shadow-md">
                  <h3 className="text-xl font-semibold mb-4">
                    📈 Eficiencia de Servicios
                  </h3>
                  <div className="space-y-4">
                    {serviciosData.servicios.map((servicio, index) => (
                      <div key={index} className="p-4 bg-gray-50 rounded-lg">
                        <h4 className="font-semibold">{servicio.nombre}</h4>
                        <div className="mt-2 grid grid-cols-2 gap-4 text-sm">
                          <div>
                            <p className="text-gray-600">
                              Total usos:{" "}
                              <span className="font-bold">
                                {servicio.cantidad_usos}
                              </span>
                            </p>
                            <p className="text-gray-600">
                              Finalizados:{" "}
                              <span className="font-bold text-green-600">
                                {servicio.turnos_finalizados}
                              </span>
                            </p>
                          </div>
                          <div>
                            <p className="text-gray-600">
                              Cancelados:{" "}
                              <span className="font-bold text-red-600">
                                {servicio.turnos_cancelados}
                              </span>
                            </p>
                            <p className="text-gray-600">
                              Éxito:{" "}
                              <span className="font-bold text-blue-600">
                                {servicio.porcentaje_exito}%
                              </span>
                            </p>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {/* Tab Clientes */}
            {activeTab === "clientes" && clientesChart && (
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <div className="bg-white p-6 rounded-lg shadow-md">
                  <h3 className="text-xl font-semibold mb-4">
                    👥 Evolución de Clientes
                  </h3>
                  <Line data={clientesChart} options={chartOptions} />
                </div>

                <div className="bg-white p-6 rounded-lg shadow-md">
                  <h3 className="text-xl font-semibold mb-4">
                    📊 Resumen de Clientes
                  </h3>
                  <div className="space-y-4">
                    <div className="p-4 bg-blue-50 rounded-lg">
                      <h4 className="font-semibold text-blue-800">
                        Total de Clientes Registrados
                      </h4>
                      <p className="text-2xl font-bold text-blue-600">
                        {clientesData.total_clientes}
                      </p>
                    </div>

                    <div className="p-4 bg-green-50 rounded-lg">
                      <h4 className="font-semibold text-green-800">
                        Clientes Activos (Último Mes)
                      </h4>
                      <p className="text-2xl font-bold text-green-600">
                        {clientesData.clientes_activos_mes}
                      </p>
                    </div>

                    <div className="p-4 bg-purple-50 rounded-lg">
                      <h4 className="font-semibold text-purple-800">
                        Nuevos Clientes en {periodo}
                      </h4>
                      <p className="text-2xl font-bold text-purple-600">
                        {clientesData.nuevos_clientes.reduce(
                          (a, b) => a + b,
                          0
                        )}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Tab Tiempos */}
            {activeTab === "tiempos" && tiemposData && (
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <div className="bg-white p-6 rounded-lg shadow-md">
                  <h3 className="text-xl font-semibold mb-4">
                    ⏱️ Distribución de Tiempos de Espera
                  </h3>
                  <Doughnut data={tiemposEsperaChart} options={pieOptions} />
                </div>

                <div className="bg-white p-6 rounded-lg shadow-md">
                  <h3 className="text-xl font-semibold mb-4">
                    🕒 Distribución de Tiempos de Atención
                  </h3>
                  <Doughnut data={tiemposAtencionChart} options={pieOptions} />
                </div>

                <div className="bg-white p-6 rounded-lg shadow-md lg:col-span-2">
                  <h3 className="text-xl font-semibold mb-4">
                    📊 Estadísticas de Tiempos
                  </h3>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    <div className="text-center p-4 bg-blue-50 rounded-lg">
                      <p className="text-sm text-gray-600">Espera Promedio</p>
                      <p className="text-2xl font-bold text-blue-600">
                        {tiemposData.promedio_espera} min
                      </p>
                    </div>
                    <div className="text-center p-4 bg-green-50 rounded-lg">
                      <p className="text-sm text-gray-600">Atención Promedio</p>
                      <p className="text-2xl font-bold text-green-600">
                        {tiemposData.promedio_atencion} min
                      </p>
                    </div>
                    <div className="text-center p-4 bg-red-50 rounded-lg">
                      <p className="text-sm text-gray-600">Máx. Espera</p>
                      <p className="text-2xl font-bold text-red-600">
                        {tiemposData.max_espera} min
                      </p>
                    </div>
                    <div className="text-center p-4 bg-purple-50 rounded-lg">
                      <p className="text-sm text-gray-600">Turnos Analizados</p>
                      <p className="text-2xl font-bold text-purple-600">
                        {tiemposData.total_turnos_analizados}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}
