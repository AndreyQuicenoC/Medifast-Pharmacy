import { BrowserRouter, Routes, Route } from "react-router-dom";
import fondoClaro from "./assets/FondoClaro.jpg";
import Login from "./pages/Login";
import Register from "./pages/Register";
import SelectorService from "./pages/Services";
import Shift from "./pages/shift";
import AdminDashboard from "./pages/admin";
import Cajas from "./pages/cajas";
import Facturas from "./pages/facturas";
import Estadisticas from "./pages/estadisticas";
import Turno from "./pages/turnos";
import PedirTurno from "./pages/pedirTurno";
import Header from "./components/Header";
import UserList from "./components/UserList";
import Footer from "./components/Footer";
import Cajero from "./pages/cajero";
import Producto from "./pages/producto";
import { Toaster } from "react-hot-toast";

function App() {
  return (
    <div
      className="min-h-screen bg-gray-300 flex flex-col bg-cover bg-center bg-no-repeat"
      style={{ backgroundImage: `url(${fondoClaro})` }}
    >
      <BrowserRouter>
        <Header />

        <Routes>
          <Route path="/" element={<Login />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/admin" element={<AdminDashboard />} />
          <Route path="/clienteManagement" element={<UserList />} />
          <Route path="/servicios" element={<SelectorService />} />
          <Route path="/shift" element={<Shift />} />
          <Route path="/cajas" element={<Cajas />} />
          <Route path="/facturas" element={<Facturas />} />
          <Route path="/estadisticas" element={<Estadisticas />} />
          <Route path="/turnos" element={<Turno />} />
          <Route path="/pedir-turno" element={<PedirTurno />} />
          <Route path="/turno" element={<Turno />} />
          <Route path="/cajero" element={<Cajero />} />
          <Route path="/producto" element={<Producto />} />
        </Routes>
        <Toaster />
        <Footer />
      </BrowserRouter>
    </div>
  );
}

export default App;
