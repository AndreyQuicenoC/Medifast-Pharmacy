import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import medifastLogo from "../assets/medifast_logo.png";

export default function Register() {
  const [formData, setFormData] = useState({
    cc: "",
    first_name: "",
    last_name: "",
    email: "",
    phone_number: "",
    dob: "",
    password: "",
    confirmPassword: "",
  });
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleRegister = async (e) => {
    e.preventDefault();
    setLoading(true);

    // Validaciones básicas
    if (formData.password !== formData.confirmPassword) {
      alert("Las contraseñas no coinciden");
      setLoading(false);
      return;
    }

    if (formData.password.length < 6) {
      alert("La contraseña debe tener al menos 6 caracteres");
      setLoading(false);
      return;
    }

    if (
      !formData.cc ||
      !formData.first_name ||
      !formData.last_name ||
      !formData.email ||
      !formData.phone_number ||
      !formData.dob
    ) {
      alert("Todos los campos son obligatorios");
      setLoading(false);
      return;
    }

    // Validar formato de teléfono
    const phoneRegex = /^[36]\d{9}$/;
    if (!phoneRegex.test(formData.phone_number)) {
      alert("El número de teléfono debe empezar con 3 o 6 y tener 10 dígitos");
      setLoading(false);
      return;
    }

    // Validar cédula
    if (formData.cc.length < 6 || formData.cc.length > 10) {
      alert("La cédula debe tener entre 6 y 10 dígitos");
      setLoading(false);
      return;
    }

    const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || "http://localhost:8000/api";

    try {
      const response = await axios.post(`${API_BASE_URL}/register/`, {
        cc: Number(formData.cc),
        first_name: formData.first_name,
        last_name: formData.last_name,
        email: formData.email,
        phone_number: Number(formData.phone_number),
        dob: formData.dob,
        password: formData.password,
        // Forzar que siempre sea cliente
        is_client: true,
        is_cajero: false,
        is_staff: false,
        is_superuser: false,
      });

      if (response.status === 201) {
        alert("Registro exitoso. Ahora puedes iniciar sesión.");
        navigate("/login");
      }
    } catch (error) {
      console.error("Error de registro:", error);

      let errorMessage = "Error al registrarse: ";

      if (error.response?.status === 400) {
        const errors = error.response.data;
        if (errors.cc) {
          errorMessage += errors.cc[0];
        } else if (errors.email) {
          errorMessage += errors.email[0];
        } else if (errors.phone_number) {
          errorMessage += errors.phone_number[0];
        } else if (errors.password) {
          errorMessage += errors.password[0];
        } else if (errors.error) {
          errorMessage += errors.error;
        } else {
          errorMessage += "Datos inválidos. Verifique la información";
        }
      } else if (error.response?.status === 500) {
        errorMessage += "Error del servidor. Intente más tarde";
      } else if (error.code === "ECONNREFUSED" || !error.response) {
        errorMessage += "No se puede conectar al servidor";
      } else {
        errorMessage +=
          error.response?.data?.detail || error.message || "Error desconocido";
      }

      alert(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col">
      <main className="flex flex-1 items-center justify-center py-8">
        <div className="bg-white shadow-lg rounded-xl p-8 w-full max-w-md">
          <img
            src={medifastLogo}
            alt="Logo"
            className="w-40 mx-auto mb-6"
          />
          <h2 className="text-center text-xl font-semibold mb-6">
            Registrarse como Cliente
          </h2>

          {/* Toggle Buttons */}
          <div className="flex justify-center mb-6 space-x-4">
            <button
              onClick={() => navigate("/login")}
              className="px-4 py-2 rounded-full border border-green-600 text-green-600 hover:bg-green-100"
            >
              Login
            </button>
            <button className="px-4 py-2 rounded-full bg-green-600 hover:bg-green-700 text-white">
              Register
            </button>
          </div>

          {/* Form */}
          <form className="space-y-4" onSubmit={handleRegister}>
            <input
              type="number"
              name="cc"
              placeholder="Cédula de Ciudadanía"
              value={formData.cc}
              onChange={handleChange}
              className="w-full px-4 py-2 border rounded-full focus:outline-none focus:ring-2 focus:ring-green-500"
              required
            />

            <input
              type="text"
              name="first_name"
              placeholder="Nombres"
              value={formData.first_name}
              onChange={handleChange}
              className="w-full px-4 py-2 border rounded-full focus:outline-none focus:ring-2 focus:ring-green-500"
              required
            />

            <input
              type="text"
              name="last_name"
              placeholder="Apellidos"
              value={formData.last_name}
              onChange={handleChange}
              className="w-full px-4 py-2 border rounded-full focus:outline-none focus:ring-2 focus:ring-green-500"
              required
            />

            <input
              type="email"
              name="email"
              placeholder="Correo Electrónico"
              value={formData.email}
              onChange={handleChange}
              className="w-full px-4 py-2 border rounded-full focus:outline-none focus:ring-2 focus:ring-green-500"
              required
            />

            <input
              type="tel"
              name="phone_number"
              placeholder="Número de Teléfono (10 dígitos)"
              value={formData.phone_number}
              onChange={handleChange}
              className="w-full px-4 py-2 border rounded-full focus:outline-none focus:ring-2 focus:ring-green-500"
              required
              pattern="[36][0-9]{9}"
              title="El teléfono debe empezar with 3 o 6 y tener 10 dígitos"
            />

            <input
              type="date"
              name="dob"
              placeholder="Fecha de Nacimiento"
              value={formData.dob}
              onChange={handleChange}
              className="w-full px-4 py-2 border rounded-full focus:outline-none focus:ring-2 focus:ring-green-500"
              required
            />

            <div className="relative">
              <input
                type={showPassword ? "text" : "password"}
                name="password"
                placeholder="Contraseña"
                value={formData.password}
                onChange={handleChange}
                className="w-full px-4 py-2 border rounded-full focus:outline-none focus:ring-2 focus:ring-green-500 pr-10"
                required
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-gray-700 focus:outline-none"
              >
                {showPassword ? (
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

            <div className="relative">
              <input
                type={showConfirmPassword ? "text" : "password"}
                name="confirmPassword"
                placeholder="Confirmar Contraseña"
                value={formData.confirmPassword}
                onChange={handleChange}
                className="w-full px-4 py-2 border rounded-full focus:outline-none focus:ring-2 focus:ring-green-500 pr-10"
                required
              />
              <button
                type="button"
                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-gray-700 focus:outline-none"
              >
                {showConfirmPassword ? (
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
              disabled={loading}
              className={`w-full py-2 rounded-full transition ${
                loading
                  ? "bg-gray-400 cursor-not-allowed"
                  : "bg-green-600 hover:bg-green-700"
              } text-white`}
            >
              {loading ? "Registrando..." : "Registrarse"}
            </button>
          </form>

          <div className="mt-4 text-center text-sm text-gray-600">
            <p>Al registrarte, automáticamente serás un cliente.</p>
            <p>Para roles de empleado, contacta al administrador.</p>
          </div>
        </div>
      </main>
    </div>
  );
}
