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
import AdminPageLayout from "../components/AdminPageLayout";
import { IconAdminStats } from "../components/AdminModuleIcons";

function MetricCard({ label, value, hint, tone = "emerald" }) {
  const tones = {
    emerald: "border-emerald-200 bg-emerald-50/80 text-emerald-900",
    blue: "border-sky-200 bg-sky-50/80 text-sky-900",
    violet: "border-violet-200 bg-violet-50/80 text-violet-900",
    amber: "border-amber-200 bg-amber-50/80 text-amber-900",
  };
  return (
    <article className={`rounded-xl border p-5 shadow-sm ${tones[tone] || tones.emerald}`}>
      <p className="text-xs font-semibold uppercase tracking-wide opacity-80">{label}</p>
      <p className="mt-2 text-2xl font-bold">{value}</p>
      {hint ? <p className="mt-1 text-sm opacity-75">{hint}</p> : null}
    </article>
  );
}

function SectionCard({ title, children }) {
  return (
    <section className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm">
      <h3 className="mb-4 text-lg font-semibold text-[var(--color-text)]">{title}</h3>
      {children}
    </section>
  );
}

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
    ventasProductos?.productos?.length > 0
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
    serviciosData?.servicios?.length > 0
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
  const rangosEspera =
    tiemposData?.rangos_espera &&
    typeof tiemposData.rangos_espera === "object" &&
    !Array.isArray(tiemposData.rangos_espera)
      ? tiemposData.rangos_espera
      : null;
  const rangosAtencion =
    tiemposData?.rangos_atencion &&
    typeof tiemposData.rangos_atencion === "object" &&
    !Array.isArray(tiemposData.rangos_atencion)
      ? tiemposData.rangos_atencion
      : null;

  const tiemposEsperaChart = rangosEspera
    ? {
        labels: Object.keys(rangosEspera),
        datasets: [
          {
            data: Object.values(rangosEspera),
            backgroundColor: ["#10B981", "#F59E0B", "#EF4444", "#8B5CF6"],
          },
        ],
      }
    : null;

  const tiemposAtencionChart = rangosAtencion
    ? {
        labels: Object.keys(rangosAtencion),
        datasets: [
          {
            data: Object.values(rangosAtencion),
            backgroundColor: ["#06B6D4", "#84CC16", "#F97316", "#EC4899"],
          },
        ],
      }
    : null;

  return (
    <AdminPageLayout
      title="Panel de estadísticas"
      subtitle="Indicadores de ventas, turnos, clientes y tiempos de atención"
      action={
        <span className="hidden rounded-lg bg-emerald-100 p-2 text-emerald-800 sm:inline-flex">
          <IconAdminStats className="h-6 w-6" />
        </span>
      }
    >
        <div className="mb-6 flex flex-wrap items-center gap-3">
            <select
              value={periodo}
              onChange={(e) => setPeriodo(e.target.value)}
              className="min-h-[2.75rem] rounded-lg border border-[var(--color-border)] px-4 py-2 text-sm focus:ring-2 focus:ring-emerald-600/30"
            >
              <option value="diario">Diario</option>
              <option value="semanal">Semanal</option>
              <option value="mensual">Mensual</option>
              <option value="anual">Anual</option>
            </select>

            <button
              type="button"
              onClick={cargarDatos}
              disabled={loading}
              className="btn-primary min-h-[2.75rem] px-6 py-2.5 text-sm disabled:opacity-50"
            >
              {loading ? "Cargando..." : "Actualizar"}
            </button>
          </div>

          <nav className="-mb-px mb-6 flex flex-wrap gap-2 border-b border-gray-200 pb-1" aria-label="Secciones">
              {[
                { id: "resumen", label: "Resumen" },
                { id: "ventas", label: "Ventas" },
                { id: "productos", label: "Productos" },
                { id: "servicios", label: "Servicios" },
                { id: "clientes", label: "Clientes" },
                { id: "tiempos", label: "Tiempos" },
              ].map((tab) => (
                <button
                  key={tab.id}
                  type="button"
                  onClick={() => setActiveTab(tab.id)}
                  className={`min-h-[2.5rem] rounded-t-lg px-4 py-2 text-sm font-medium ${
                    activeTab === tab.id
                      ? "border-b-2 border-emerald-600 bg-emerald-50 text-emerald-800"
                      : "text-gray-600 hover:bg-gray-50"
                  }`}
                >
                  {tab.label}
                </button>
              ))}
          </nav>

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
              <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-4">
                <MetricCard
                  label="Ventas totales"
                  value={`$${resumenData.ventas.total.toLocaleString()}`}
                  hint={`${resumenData.ventas.cantidad_facturas} facturas`}
                  tone="emerald"
                />
                <MetricCard
                  label="Turnos"
                  value={resumenData.turnos.total}
                  hint={`${resumenData.turnos.porcentaje_exito}% exitosos`}
                  tone="blue"
                />
                <MetricCard
                  label="Clientes únicos"
                  value={resumenData.clientes_unicos}
                  hint={`Periodo: ${periodo}`}
                  tone="violet"
                />
                <MetricCard
                  label="Promedio por venta"
                  value={`$${resumenData.ventas.promedio_por_factura.toFixed(2)}`}
                  hint="Por factura"
                  tone="amber"
                />
              </div>
            )}

            {/* Tab Ventas */}
            {activeTab === "ventas" && ventasGeneralesChart && (
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <SectionCard title={`Ventas totales (${periodo})`}>
                  <Bar data={ventasGeneralesChart} options={chartOptions} />
                </SectionCard>
                <SectionCard title={`Cantidad de ventas (${periodo})`}>
                  <Bar data={cantidadVentasChart} options={chartOptions} />
                </SectionCard>
              </div>
            )}

            {/* Tab Productos */}
            {activeTab === "productos" && productosChart && (
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <SectionCard title="Top productos por ingresos">
                  <Pie data={productosChart} options={pieOptions} />
                </SectionCard>

                <SectionCard title="Detalle de productos">
                  <div className="overflow-y-auto max-h-96">
                    {(ventasProductos?.productos || [])
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
                </SectionCard>
              </div>
            )}

            {/* Tab Servicios */}
            {activeTab === "servicios" && serviciosChart && (
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <SectionCard title="Uso de servicios">
                  <Bar data={serviciosChart} options={chartOptions} />
                </SectionCard>

                <SectionCard title="Eficiencia de servicios">
                  <div className="space-y-4">
                    {(serviciosData?.servicios || []).map((servicio, index) => (
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
                </SectionCard>
              </div>
            )}

            {/* Tab Clientes */}
            {activeTab === "clientes" && clientesChart && (
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <SectionCard title="Evolución de clientes">
                  <Line data={clientesChart} options={chartOptions} />
                </SectionCard>

                <SectionCard title="Resumen de clientes">
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
                        {(clientesData.nuevos_clientes || []).reduce(
                          (a, b) => a + b,
                          0
                        )}
                      </p>
                    </div>
                  </div>
                </SectionCard>
              </div>
            )}

            {/* Tab Tiempos */}
            {activeTab === "tiempos" && tiemposData && (
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <SectionCard title="Tiempos de espera">
                  <Doughnut data={tiemposEsperaChart} options={pieOptions} />
                </SectionCard>

                <SectionCard title="Tiempos de atención">
                  <Doughnut data={tiemposAtencionChart} options={pieOptions} />
                </SectionCard>

                <SectionCard title="Estadísticas de tiempos">
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
                </SectionCard>
              </div>
            )}
          </>
        )}
    </AdminPageLayout>
  );
}
