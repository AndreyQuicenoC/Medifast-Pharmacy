import { BrowserRouter, Routes, Route } from "react-router-dom";
import { useCallback } from "react";
import PageNotFound from "./pages/PageNotFound";
import Proyecto from "./pages/Proyecto";
import KeyboardShortcutsHelp from "./components/KeyboardShortcutsHelp";
import { useKeyboardShortcuts } from "./hooks/useKeyboardShortcuts";
import AppBackground from "./components/AppBackground";
import { ConfirmProvider } from "./components/ConfirmProvider";
import Home from "./pages/Home";
import SobreNosotros from "./pages/SobreNosotros";
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
  const focusMain = useCallback(() => {
    document.getElementById("main-content")?.focus();
  }, []);
  const { helpOpen, setHelpOpen } = useKeyboardShortcuts({ onFocusMain: focusMain });

  return (
    <div className="relative flex min-h-screen flex-col">
      <BrowserRouter>
        <ConfirmProvider>
        <AppBackground />
        <Header />

        <KeyboardShortcutsHelp open={helpOpen} onClose={() => setHelpOpen(false)} />
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/home" element={<Home />} />
          <Route path="/sobre-nosotros" element={<SobreNosotros />} />
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
          <Route path="/proyecto" element={<Proyecto />} />
          <Route path="*" element={<PageNotFound />} />
        </Routes>
        <Toaster position="top-right" toastOptions={{ className: "text-sm" }} />
        <Footer />
        </ConfirmProvider>
      </BrowserRouter>
    </div>
  );
}

export default App;
