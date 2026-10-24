import { useState } from "react";
import { Link } from "react-router-dom";
import LegalModal from "./LegalModal";
import {
  IconFacebook,
  IconInstagram,
  IconMail,
  IconMapPin,
  IconPhone,
  IconTwitter,
} from "./icons";

export default function Footer() {
  const [legal, setLegal] = useState(null);

  return (
    <>
      <footer className="mt-auto border-t border-emerald-900/30 bg-emerald-950 text-emerald-50">
        <div className="mx-auto grid max-w-6xl gap-10 px-4 py-12 md:grid-cols-4">
          <div>
            <h3 className="text-sm font-semibold uppercase tracking-wide text-emerald-200">Mapa del sitio</h3>
            <ul className="mt-3 space-y-2 text-sm">
              <li><Link to="/home" className="hover:text-white">Inicio</Link></li>
              <li><Link to="/sobre-nosotros" className="hover:text-white">Sobre nosotros</Link></li>
              <li><Link to="/proyecto" className="hover:text-white">Acerca del proyecto</Link></li>
              <li><Link to="/login" className="hover:text-white">Acceso al sistema</Link></li>
            </ul>
          </div>

          <div>
            <h3 className="text-sm font-semibold uppercase tracking-wide text-emerald-200">Legal</h3>
            <ul className="mt-3 space-y-2 text-sm">
              <li>
                <button type="button" className="hover:text-white text-left" onClick={() => setLegal("terms")}>
                  Términos de servicio
                </button>
              </li>
              <li>
                <button type="button" className="hover:text-white text-left" onClick={() => setLegal("privacy")}>
                  Política de privacidad
                </button>
              </li>
            </ul>
          </div>

          <div>
            <h3 className="text-sm font-semibold uppercase tracking-wide text-emerald-200">Contacto</h3>
            <ul className="mt-3 space-y-3 text-sm">
              <li className="flex items-start gap-2">
                <IconMapPin className="mt-0.5 h-4 w-4 shrink-0 text-emerald-300" />
                <span>Calle 5, Cali, Colombia</span>
              </li>
              <li className="flex items-start gap-2">
                <IconPhone className="mt-0.5 h-4 w-4 shrink-0 text-emerald-300" />
                <a href="tel:+573001234567" className="hover:text-white">+57 300 123 4567</a>
              </li>
              <li className="flex items-start gap-2">
                <IconMail className="mt-0.5 h-4 w-4 shrink-0 text-emerald-300" />
                <a href="mailto:contacto@medifast.com" className="hover:text-white">contacto@medifast.com</a>
              </li>
            </ul>
          </div>

          <div>
            <p className="text-sm text-emerald-200/90">
              © {new Date().getFullYear()} Medifast Pharmacy. Todos los derechos reservados.
            </p>
            <div className="mt-4 flex gap-3">
              <a href="#" className="rounded-lg bg-emerald-900/60 p-2 hover:bg-emerald-800" aria-label="Facebook">
                <IconFacebook className="h-4 w-4" />
              </a>
              <a href="#" className="rounded-lg bg-emerald-900/60 p-2 hover:bg-emerald-800" aria-label="Instagram">
                <IconInstagram className="h-4 w-4" />
              </a>
              <a href="#" className="rounded-lg bg-emerald-900/60 p-2 hover:bg-emerald-800" aria-label="X">
                <IconTwitter className="h-4 w-4" />
              </a>
            </div>
          </div>
        </div>
      </footer>

      <LegalModal open={legal === "terms"} title="Términos de servicio" onClose={() => setLegal(null)}>
        <p>
          Medifast Pharmacy es software académico y de demostración. El uso en producción requiere
          revisión legal, políticas de datos personales (Habeas Data en Colombia) y acuerdos con el
          titular del tratamiento de información de clientes.
        </p>
        <p>
          Al usar la plataforma aceptas no compartir credenciales, reportar incidentes de seguridad
          al administrador y utilizar los datos únicamente con fines autorizados.
        </p>
      </LegalModal>

      <LegalModal open={legal === "privacy"} title="Política de privacidad" onClose={() => setLegal(null)}>
        <p>
          Recopilamos identificación (cédula), datos de contacto y registros de turnos/facturación
          necesarios para la operación de la farmacia. Los datos se almacenan en servidores
          controlados por el responsable del sistema.
        </p>
        <p>
          Puedes solicitar rectificación o eliminación conforme a la normativa aplicable. La demo
          pública utiliza datos ficticios y no debe usarse con información real de pacientes.
        </p>
      </LegalModal>
    </>
  );
}
