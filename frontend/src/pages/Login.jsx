import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import medifastLogo from "../assets/medifast_logo.png";

export default function Login() {
  const [cc, setCc] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  const navigate = useNavigate();

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  const handleLogin = async (e) => {
    e.preventDefault();

    const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || "http://localhost:8000/api";

    try {
      const response = await axios.post(
        `${API_BASE_URL}/authtoken/`,
        {
          cc: Number(cc),
          password: password,
        }
      );

      const { token, rol, is_client, is_cajero, user_data } = response.data;

      // Guardar token de autenticación con clave consistente
      localStorage.setItem("authToken", token);
      localStorage.setItem("token", token); // Mantener compatibilidad
      localStorage.setItem("rol", rol || "cliente");
      localStorage.setItem("is_client", is_client);
      localStorage.setItem("is_cajero", is_cajero);

      // Guardar información del usuario para las páginas de turno
      if (user_data) {
        localStorage.setItem("user_cc", user_data.cc || cc);
        localStorage.setItem("user_name", user_data.first_name || "");
        localStorage.setItem("user_lastname", user_data.last_name || "");
        localStorage.setItem("user_email", user_data.email || "");
      } else {
        localStorage.setItem("user_cc", cc);
      }

      console.log("Token:", token);
      console.log("Rol:", rol);
      console.log("Cliente:", is_client);
      console.log("Cajero:", is_cajero);

      // Navegación basada en roles (prioridad: administrador > cajero > client)
      if (rol === "administrador") {
        // Administrador: acceso completo al sistema
        navigate("/admin");
      } else if (is_cajero) {
        // Empleado/Cajero: acceso a funciones de caja
        navigate("/cajero");
      } else if (is_client) {
        // Cliente: primero verificar si tiene turno activo, sino redirigir a pedir turno
        navigate("/pedir-turno");
      } else {
        // Usuario sin rol específico
        alert("Usuario sin rol asignado. Contacte al administrador.");
      }
    } catch (error) {
      console.error("Error de login:", error);

      let errorMessage = "Error al iniciar sesión: ";

      if (error.response?.status === 400) {
        errorMessage +=
          error.response?.data?.non_field_errors?.[0] ||
          "Credenciales inválidas";
      } else if (error.response?.status === 401) {
        errorMessage += "Credenciales incorrectas";
      } else if (error.response?.status === 500) {
        errorMessage += "Error del servidor. Intente más tarde";
      } else if (error.code === "ECONNREFUSED" || !error.response) {
        errorMessage +=
          "No se puede conectar al servidor. Verifique que el backend esté funcionando";
      } else {
        errorMessage +=
          error.response?.data?.detail || error.message || "Error desconocido";
      }

      alert(errorMessage);
    }
  };

  return (
    <div className="min-h-screen flex flex-col">
      {/* Main content */}
      <main className="flex flex-1 items-center justify-center">
        <div className="bg-white shadow-lg rounded-xl p-8 w-full max-w-sm">
          <img
            src={medifastLogo}
            alt="Logo"
            className="w-40 mx-auto mb-6"
          />
          <h2 className="text-center text-xl font-semibold mb-6">
            Welcome to Login
          </h2>

          {/* Toggle Buttons */}
          <div className="flex justify-center mb-6 space-x-4">
            <button className="px-4 py-2 rounded-full bg-green-600 hover:bg-green-700 text-white">
              Login
            </button>
            <button
              onClick={() => navigate("/register")}
              className="px-4 py-2 rounded-full border border-green-600 text-green-600 hover:bg-green-100"
            >
              Register
            </button>
          </div>

          {/* Form */}
          <form className="space-y-4" onSubmit={handleLogin}>
            <input
              type="number"
              placeholder="Cedula De Ciudadania"
              value={cc}
              onChange={(e) => setCc(e.target.value)}
              className="w-full px-4 py-2 border rounded-full focus:outline-none"
            />

            <div className="relative">
              <input
                type={showPassword ? "text" : "password"}
                placeholder="Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full px-4 py-2 border rounded-full focus:outline-none pr-10"
              />
              <button
                type="button"
                onClick={togglePasswordVisibility}
                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-gray-700 focus:outline-none"
              >
                {showPassword ? (
                  // Ícono de ojo abierto (visible)
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-5 w-5"
                    viewBox="0 0 20 20"
                    fill="currentColor"
                  >
                    <path d="M10 12a2 2 0 100-4 2 2 0 000 4z" />
                    <path
                      fillRule="evenodd"
                      d="M.458 10C1.732 5.943 5.522 3 10 3s8.268 2.943 9.542 7c-1.274 4.057-5.064 7-9.542 7S1.732 14.057.458 10zM14 10a4 4 0 11-8 0 4 4 0 018 0z"
                      clipRule="evenodd"
                    />
                  </svg>
                ) : (
                  // Ícono de ojo cerrado (oculto)
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-5 w-5"
                    viewBox="0 0 20 20"
                    fill="currentColor"
                  >
                    <path
                      fillRule="evenodd"
                      d="M3.707 2.293a1 1 0 00-1.414 1.414l14 14a1 1 0 001.414-1.414l-1.473-1.473A10.014 10.014 0 0019.542 10C18.268 5.943 14.478 3 10 3a9.958 9.958 0 00-4.512 1.074l-1.78-1.781zm4.261 4.26l1.514 1.515a2.003 2.003 0 012.45 2.45l1.514 1.514a4 4 0 00-5.478-5.478z"
                      clipRule="evenodd"
                    />
                    <path d="M12.454 16.697L9.75 13.992a4 4 0 01-3.742-3.741L2.335 6.578A9.98 9.98 0 00.458 10c1.274 4.057 5.065 7 9.542 7 .847 0 1.669-.105 2.454-.303z" />
                  </svg>
                )}
              </button>
            </div>

            <button
              type="submit"
              className="w-full bg-green-600 hover:bg-green-700 text-white text-white py-2 rounded-full transition"
            >
              Submit
            </button>
          </form>
        </div>
      </main>
    </div>
  );
}
