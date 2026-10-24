import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Button from "../components/Button";
import {
  TIPOS_MEDICAMENTOS,
  fetchProductos,
  saveProducto,
  desactivarProducto,
  activarProducto,
  formatPrice,
} from "../api/producto.api";

export default function ProductosManagement() {
  const navigate = useNavigate();

  // Estado para autenticación
  const [token, setToken] = useState(null);

  // Estados
  const [productos, setProductos] = useState([]);
  const [selectedProducto, setSelectedProducto] = useState(null);
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [formData, setFormData] = useState({
    Nombre: "",
    Marca: "",
    Tipo: "",
    Precio: 0,
    Descuento: 0,
    Stock: 0,
    Presentacion: "",
    Descripcion: "",
    Activo: true,
    requiere_orden_medica: false,
    Codigo: "",
    Fecha_vencimiento: "",
  });

  // Estados para manejo de stock durante edición
  const [stockAumento, setStockAumento] = useState(0);
  const [stockDisminucion, setStockDisminucion] = useState(0);
  const [stockOriginal, setStockOriginal] = useState(0);

  // Verificar autenticación al cargar
  useEffect(() => {
    const storedToken = localStorage.getItem("token");
    const rol = localStorage.getItem("rol");

    if (!storedToken || rol !== "administrador") {
      navigate("/login");
    } else {
      setToken(storedToken);
      loadProductos(storedToken);
    }
  }, [navigate]);

  // Cargar productos desde la API
  const loadProductos = async (authToken) => {
    setLoading(true);
    const result = await fetchProductos(authToken);
    if (result.data) {
      setProductos(result.data);
      setError(null);
    } else {
      setError(result.error);
    }
    setLoading(false);
  };

  // Manejar cambios en el formulario
  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData({
      ...formData,
      [name]:
        type === "checkbox"
          ? checked
          : type === "number"
          ? parseFloat(value)
          : value,
    });
  };

  // Filtrar productos por búsqueda
  const filteredProductos = productos.filter(
    (producto) =>
      producto.Nombre?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      producto.Marca?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      producto.Tipo?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Mostrar formulario para crear
  const handleShowCreateForm = () => {
    setEditingId(null);
    setFormData({
      Nombre: "",
      Marca: "",
      Tipo: "",
      Precio: 0,
      Descuento: 0,
      Stock: 0,
      Presentacion: "",
      Descripcion: "",
      Activo: true,
      requiere_orden_medica: false,
      Codigo: "",
      Fecha_vencimiento: "",
    });
    // Resetear valores de stock para creación
    setStockAumento(0);
    setStockDisminucion(0);
    setStockOriginal(0);
    setShowForm(true);
    setSelectedProducto(null);
  };

  // Mostrar formulario para editar
  const handleShowEditForm = (producto) => {
    setEditingId(producto.id);
    // Adaptar las fechas para el formato de input date
    const fechaVencimiento = producto.Fecha_vencimiento
      ? new Date(producto.Fecha_vencimiento).toISOString().split("T")[0]
      : "";

    setFormData({
      Nombre: producto.Nombre || "",
      Marca: producto.Marca || "",
      Tipo: producto.Tipo || "",
      Precio: producto.Precio || 0,
      Descuento: producto.Descuento || 0,
      Stock: producto.Stock || 0,
      Presentacion: producto.Presentacion || "",
      Descripcion: producto.Descripcion || "",
      Activo: producto.Activo !== false,
      requiere_orden_medica: producto.requiere_orden_medica || false,
      Codigo: producto.Codigo || "",
      Fecha_vencimiento: fechaVencimiento,
    });
    // Configurar valores para edición de stock
    setStockOriginal(producto.Stock || 0);
    setStockAumento(0);
    setStockDisminucion(0);
    setShowForm(true);
  };

  // Cancelar edición/creación
  const handleCancel = () => {
    setShowForm(false);
    setEditingId(null);
    // Resetear valores de stock
    setStockAumento(0);
    setStockDisminucion(0);
    setStockOriginal(0);
  };

  // Guardar producto (crear o actualizar)
  const handleSave = async (e) => {
    e.preventDefault();

    // Validación básica
    if (!formData.Nombre || !formData.Marca || !formData.Tipo) {
      alert("Por favor complete los campos obligatorios");
      return;
    }

    // Calcular stock final si estamos editando
    let stockFinal = formData.Stock;
    if (editingId) {
      stockFinal = stockOriginal + stockAumento - stockDisminucion;

      // Validar que el stock no sea negativo
      if (stockFinal < 0) {
        alert(
          `No se puede reducir el stock por debajo de 0. Stock actual: ${stockOriginal}, intentando reducir: ${stockDisminucion}`
        );
        return;
      }
    }

    // Crear objeto con los datos actualizados
    const dataToSave = {
      ...formData,
      Stock: stockFinal,
    };

    const result = await saveProducto(dataToSave, editingId, token);

    if (result.success) {
      alert(
        editingId
          ? "Producto actualizado con éxito"
          : "Producto creado con éxito"
      );
      loadProductos(token);
      setShowForm(false);
      setEditingId(null);
      // Resetear valores de stock
      setStockAumento(0);
      setStockDisminucion(0);
      setStockOriginal(0);
    } else {
      alert(`Error al guardar el producto: ${result.error}`);
    }
  };

  // Eliminar producto (usa el endpoint de borrado lógico)
  const handleDelete = async (id) => {
    if (
      window.confirm(
        "¿Está seguro que desea eliminar este producto? Esta acción lo desactivará."
      )
    ) {
      const result = await desactivarProducto(id, token);

      if (result.success) {
        loadProductos(token);

        // Si el producto eliminado estaba seleccionado, deseleccionarlo
        if (selectedProducto && selectedProducto.id === id) {
          setSelectedProducto(null);
        }

        alert("Producto desactivado con éxito");
      } else {
        alert(result.error);
      }
    }
  };

  // Activar un producto
  const handleActivate = async (id) => {
    const result = await activarProducto(id, token);

    if (result.success) {
      loadProductos(token);
      alert("Producto activado con éxito");
    } else {
      alert(result.error);
    }
  };

  // Seleccionar producto para ver detalles
  const handleSelectProducto = (producto) => {
    setSelectedProducto(producto);
    setShowForm(false);
  };

  // Restricción de acceso
  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-[60vh]">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500 mx-auto mb-4"></div>
          <p className="text-gray-600">Cargando productos...</p>
        </div>
      </div>
    );
  }

  const rol = localStorage.getItem("rol");
  if (rol !== "administrador") {
    return (
      <div className="p-8 text-center">
        <div className="bg-red-50 border border-red-200 rounded-xl p-6 inline-block">
          <h2 className="text-xl font-semibold text-red-700 mb-2">
            Acceso Restringido
          </h2>
          <p className="text-gray-700">
            No tienes permiso para acceder a esta sección.
          </p>
          <button
            onClick={() => navigate("/")}
            className="mt-4 px-4 py-2 bg-blue-600 text-white rounded-lg"
          >
            Volver al inicio
          </button>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-8 text-center">
        <div className="bg-red-50 border border-red-200 rounded-xl p-6 inline-block">
          <h2 className="text-xl font-semibold text-red-700 mb-2">
            Error al cargar productos
          </h2>
          <p className="text-gray-700">{error}</p>
          <button
            onClick={() => loadProductos(token)}
            className="mt-4 px-4 py-2 bg-blue-600 text-white rounded-lg"
          >
            Reintentar
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="p-4 md:p-6 lg:p-8 max-w-7xl mx-auto">
      <div className="flex flex-col lg:flex-row gap-6">
        {/* Columna izquierda - Lista de productos */}
        <div className="flex-1 bg-white rounded-xl shadow p-4 md:p-6">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-semibold">Gestión de Productos</h2>
            <Button
              className="px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg"
              onClick={handleShowCreateForm}
            >
              Nuevo Producto
            </Button>
          </div>

          {/* Búsqueda */}
          <div className="mb-6">
            <input
              type="text"
              placeholder="Buscar por nombre, marca o tipo..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full border rounded-lg px-3 py-2"
            />
          </div>

          {/* Lista de productos */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {filteredProductos.length === 0 ? (
              <p className="col-span-full text-center text-gray-500 py-8">
                No hay productos disponibles
              </p>
            ) : (
              filteredProductos.map((producto) => (
                <div
                  key={producto.id}
                  className={`flex flex-col border rounded-lg shadow-sm cursor-pointer hover:shadow p-4 ${
                    selectedProducto?.id === producto.id
                      ? "bg-green-50 border-green-500"
                      : producto.Activo === false
                      ? "opacity-60 bg-gray-50 border-dashed"
                      : ""
                  }`}
                  onClick={() => handleSelectProducto(producto)}
                >
                  <div className="flex justify-between items-start mb-2">
                    <h3 className="font-bold text-lg">{producto.Nombre}</h3>
                    {producto.Activo === false && (
                      <span className="px-2 py-0.5 bg-red-100 text-red-800 rounded text-xs">
                        Inactivo
                      </span>
                    )}
                    {producto.Fecha_vencimiento &&
                      new Date(producto.Fecha_vencimiento) < new Date() && (
                        <span className="px-2 py-0.5 bg-yellow-100 text-yellow-800 rounded text-xs ml-1">
                          Vencido
                        </span>
                      )}
                  </div>

                  <div className="flex gap-2 mb-2 flex-wrap">
                    <span className="px-2 py-0.5 bg-blue-100 text-blue-800 rounded text-xs">
                      {producto.Marca}
                    </span>
                    <span className="px-2 py-0.5 bg-green-100 text-green-800 rounded text-xs">
                      {producto.Tipo}
                    </span>
                    {producto.requiere_orden_medica && (
                      <span className="px-2 py-0.5 bg-orange-100 text-orange-800 rounded text-xs">
                        Req. Orden Médica
                      </span>
                    )}
                    {producto.Codigo && (
                      <span className="px-2 py-0.5 bg-purple-100 text-purple-800 rounded text-xs">
                        {producto.Codigo}
                      </span>
                    )}
                  </div>

                  <div className="text-sm mb-1">
                    Stock: <span className="font-medium">{producto.Stock}</span>
                  </div>

                  <div className="text-sm mb-auto">{producto.Presentacion}</div>

                  <div className="flex justify-between items-center mt-3">
                    <div className="flex items-baseline">
                      {producto.Descuento > 0 && (
                        <span className="line-through text-gray-500 text-sm mr-1">
                          {formatPrice(producto.Precio)}
                        </span>
                      )}
                      <span className="font-bold text-blue-600">
                        {formatPrice(producto.Precio - producto.Descuento)}
                      </span>
                    </div>

                    <div className="flex space-x-2">
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          handleShowEditForm(producto);
                        }}
                        className="p-1.5 bg-blue-600 hover:bg-blue-700 text-white rounded-md"
                        title="Editar producto"
                      >
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          className="h-4 w-4"
                          fill="none"
                          viewBox="0 0 24 24"
                          stroke="currentColor"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"
                          />
                        </svg>
                      </button>
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          handleDelete(producto.id);
                        }}
                        className="p-1.5 bg-red-600 hover:bg-red-700 text-white rounded-md"
                        title="Eliminar producto"
                        disabled={!producto.Activo}
                      >
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          className="h-4 w-4"
                          fill="none"
                          viewBox="0 0 24 24"
                          stroke="currentColor"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                          />
                        </svg>
                      </button>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>

        {/* Columna derecha - Formulario o detalles del producto */}
        {(showForm || selectedProducto) && (
          <div className="lg:w-2/5 xl:w-1/3 bg-white rounded-xl shadow p-5 h-fit">
            {showForm ? (
              <>
                <h2 className="text-2xl font-semibold mb-4 pb-2 border-b">
                  {editingId ? "Editar Producto" : "Nuevo Producto"}
                </h2>
                <form onSubmit={handleSave} className="space-y-4">
                  <div>
                    <label className="block mb-1 text-sm font-medium">
                      Nombre*
                    </label>
                    <input
                      type="text"
                      name="Nombre"
                      value={formData.Nombre}
                      onChange={handleChange}
                      className="w-full px-3 py-2 border rounded-md"
                      placeholder="Ej: Ibuprofeno 500mg"
                      required
                    />
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block mb-1 text-sm font-medium">
                        Marca*
                      </label>
                      <input
                        type="text"
                        name="Marca"
                        value={formData.Marca}
                        onChange={handleChange}
                        className="w-full px-3 py-2 border rounded-md"
                        placeholder="Ej: Pfizer"
                        required
                      />
                    </div>

                    <div>
                      <label className="block mb-1 text-sm font-medium">
                        Tipo*
                      </label>
                      <select
                        name="Tipo"
                        value={formData.Tipo}
                        onChange={handleChange}
                        className="w-full px-3 py-2 border rounded-md"
                        required
                      >
                        <option value="">Seleccionar tipo</option>
                        {TIPOS_MEDICAMENTOS.map((tipo) => (
                          <option key={tipo} value={tipo}>
                            {tipo}
                          </option>
                        ))}
                      </select>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block mb-1 text-sm font-medium">
                        Precio*
                      </label>
                      <input
                        type="number"
                        name="Precio"
                        value={formData.Precio}
                        onChange={handleChange}
                        className="w-full px-3 py-2 border rounded-md"
                        required
                        min="0"
                      />
                    </div>

                    <div>
                      <label className="block mb-1 text-sm font-medium">
                        Descuento
                      </label>
                      <input
                        type="number"
                        name="Descuento"
                        value={formData.Descuento}
                        onChange={handleChange}
                        className="w-full px-3 py-2 border rounded-md"
                        min="0"
                      />
                    </div>
                  </div>

                  {!editingId ? (
                    // Vista para creación de producto
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div>
                        <label className="block mb-1 text-sm font-medium">
                          Stock*
                        </label>
                        <input
                          type="number"
                          name="Stock"
                          value={formData.Stock}
                          onChange={handleChange}
                          className="w-full px-3 py-2 border rounded-md"
                          required
                          min="0"
                        />
                      </div>

                      <div>
                        <label className="block mb-1 text-sm font-medium">
                          Presentación
                        </label>
                        <input
                          type="text"
                          name="Presentacion"
                          value={formData.Presentacion}
                          onChange={handleChange}
                          className="w-full px-3 py-2 border rounded-md"
                          placeholder="Ej: Tabletas 500mg x 10 und"
                        />
                      </div>
                    </div>
                  ) : (
                    // Vista para edición de producto
                    <>
                      <div className="bg-gray-100 p-4 rounded-lg mb-4">
                        <div className="mb-3">
                          <span className="block text-sm font-medium text-gray-700 mb-1">
                            Stock actual: {stockOriginal} unidades
                          </span>
                          <span className="block text-sm text-gray-600">
                            Stock resultante:{" "}
                            {stockOriginal + stockAumento - stockDisminucion}{" "}
                            unidades
                          </span>
                        </div>

                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                          <div>
                            <label className="block mb-1 text-sm font-medium text-green-700">
                              Aumentar stock
                            </label>
                            <input
                              type="number"
                              value={stockAumento}
                              onChange={(e) =>
                                setStockAumento(parseInt(e.target.value) || 0)
                              }
                              className="w-full px-3 py-2 border border-green-300 rounded-md focus:border-green-500 focus:ring-green-500"
                              min="0"
                              placeholder="Cantidad a agregar"
                            />
                          </div>

                          <div>
                            <label className="block mb-1 text-sm font-medium text-red-700">
                              Disminuir stock
                            </label>
                            <input
                              type="number"
                              value={stockDisminucion}
                              onChange={(e) =>
                                setStockDisminucion(
                                  parseInt(e.target.value) || 0
                                )
                              }
                              className="w-full px-3 py-2 border border-red-300 rounded-md focus:border-red-500 focus:ring-red-500"
                              min="0"
                              max={stockOriginal + stockAumento}
                              placeholder="Cantidad a quitar"
                            />
                          </div>
                        </div>
                      </div>

                      <div>
                        <label className="block mb-1 text-sm font-medium">
                          Presentación
                        </label>
                        <input
                          type="text"
                          name="Presentacion"
                          value={formData.Presentacion}
                          onChange={handleChange}
                          className="w-full px-3 py-2 border rounded-md"
                          placeholder="Ej: Tabletas 500mg x 10 und"
                        />
                      </div>
                    </>
                  )}

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block mb-1 text-sm font-medium">
                        Código
                      </label>
                      <input
                        type="text"
                        name="Codigo"
                        value={formData.Codigo}
                        onChange={handleChange}
                        className="w-full px-3 py-2 border rounded-md"
                        placeholder="Ej: MED001"
                      />
                    </div>

                    <div>
                      <label className="block mb-1 text-sm font-medium">
                        Fecha de vencimiento
                      </label>
                      <input
                        type="date"
                        name="Fecha_vencimiento"
                        value={formData.Fecha_vencimiento}
                        onChange={handleChange}
                        className="w-full px-3 py-2 border rounded-md"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block mb-1 text-sm font-medium">
                      Descripción
                    </label>
                    <textarea
                      name="Descripcion"
                      value={formData.Descripcion}
                      onChange={handleChange}
                      className="w-full px-3 py-2 border rounded-md"
                      rows="3"
                      placeholder="Ej: Medicamento ideal para dolores de cabeza"
                    />
                  </div>

                  <div className="flex items-center space-x-4">
                    <div className="flex items-center">
                      <input
                        type="checkbox"
                        id="Activo"
                        name="Activo"
                        checked={formData.Activo}
                        onChange={handleChange}
                        className="mr-2"
                      />
                      <label htmlFor="Activo" className="text-sm">
                        Producto Activo
                      </label>
                    </div>

                    <div className="flex items-center">
                      <input
                        type="checkbox"
                        id="requiere_orden_medica"
                        name="requiere_orden_medica"
                        checked={formData.requiere_orden_medica}
                        onChange={handleChange}
                        className="mr-2"
                      />
                      <label
                        htmlFor="requiere_orden_medica"
                        className="text-sm"
                      >
                        Requiere Orden Médica
                      </label>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-2 pt-4">
                    <button
                      type="submit"
                      className="px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded-md"
                    >
                      {editingId ? "Actualizar" : "Crear"}
                    </button>
                    <button
                      type="button"
                      onClick={handleCancel}
                      className="px-4 py-2 bg-gray-500 hover:bg-gray-600 text-white rounded-md"
                    >
                      Cancelar
                    </button>
                  </div>
                </form>
              </>
            ) : (
              /* Detalles del producto seleccionado */
              selectedProducto && (
                <div className="flex flex-col">
                  <h2 className="text-xl font-semibold border-b pb-3 mb-4">
                    Detalles del producto
                  </h2>

                  <div className="mb-4">
                    <h3 className="text-2xl font-bold text-gray-800">
                      {selectedProducto.Nombre}
                    </h3>
                    <div className="flex flex-wrap gap-2 mt-1">
                      <span className="px-2 py-0.5 bg-blue-100 text-blue-800 rounded text-sm">
                        {selectedProducto.Marca}
                      </span>
                      <span className="px-2 py-0.5 bg-green-100 text-green-800 rounded text-sm">
                        {selectedProducto.Tipo}
                      </span>
                      {selectedProducto.requiere_orden_medica && (
                        <span className="px-2 py-0.5 bg-orange-100 text-orange-800 rounded text-sm">
                          Requiere Orden Médica
                        </span>
                      )}
                      {!selectedProducto.Activo && (
                        <span className="px-2 py-0.5 bg-red-100 text-red-800 rounded text-sm">
                          Inactivo
                        </span>
                      )}
                      {selectedProducto.Codigo && (
                        <span className="px-2 py-0.5 bg-purple-100 text-purple-800 rounded text-sm">
                          Código: {selectedProducto.Codigo}
                        </span>
                      )}
                    </div>
                  </div>

                  <div className="bg-gray-50 p-4 rounded-lg mb-4">
                    <div className="mb-3">
                      <span className="block text-sm text-gray-500">
                        Presentación:
                      </span>
                      <span className="font-medium">
                        {selectedProducto.Presentacion || "No especificada"}
                      </span>
                    </div>

                    <div className="mb-3">
                      <span className="block text-sm text-gray-500">
                        Stock disponible:
                      </span>
                      <span className="font-medium">
                        {selectedProducto.Stock}
                      </span>{" "}
                      unidades
                    </div>

                    {selectedProducto.Fecha_vencimiento && (
                      <div className="mb-3">
                        <span className="block text-sm text-gray-500">
                          Fecha de vencimiento:
                        </span>
                        <span
                          className={`font-medium ${
                            new Date(selectedProducto.Fecha_vencimiento) <
                            new Date()
                              ? "text-red-600"
                              : ""
                          }`}
                        >
                          {new Date(
                            selectedProducto.Fecha_vencimiento
                          ).toLocaleDateString()}
                          {new Date(selectedProducto.Fecha_vencimiento) <
                            new Date() && " (Vencido)"}
                        </span>
                      </div>
                    )}

                    <div className="mb-3">
                      <span className="block text-sm text-gray-500">
                        Precio:
                      </span>
                      <div className="flex items-baseline">
                        {selectedProducto.Descuento > 0 && (
                          <span className="line-through text-gray-500 mr-2">
                            {formatPrice(selectedProducto.Precio)}
                          </span>
                        )}
                        <span className="text-xl font-bold text-blue-600">
                          {formatPrice(
                            selectedProducto.Precio - selectedProducto.Descuento
                          )}
                        </span>
                        {selectedProducto.Descuento > 0 && (
                          <span className="ml-2 px-2 py-0.5 bg-red-100 text-red-700 rounded text-xs">
                            Descuento: {formatPrice(selectedProducto.Descuento)}
                          </span>
                        )}
                      </div>
                    </div>
                  </div>

                  {selectedProducto.Descripcion && (
                    <div className="mb-6">
                      <span className="block text-sm text-gray-500 mb-1">
                        Descripción:
                      </span>
                      <p className="text-gray-700">
                        {selectedProducto.Descripcion}
                      </p>
                    </div>
                  )}

                  <div className="grid grid-cols-2 gap-3 mt-auto">
                    <Button
                      className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md"
                      onClick={() => handleShowEditForm(selectedProducto)}
                    >
                      Editar Producto
                    </Button>
                    {selectedProducto.Activo ? (
                      <Button
                        className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-md"
                        onClick={() => handleDelete(selectedProducto.id)}
                      >
                        Desactivar
                      </Button>
                    ) : (
                      <Button
                        className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-md"
                        onClick={() => handleActivate(selectedProducto.id)}
                      >
                        Activar
                      </Button>
                    )}
                  </div>
                </div>
              )
            )}
          </div>
        )}
      </div>
    </div>
  );
}
