import { Link } from "react-router-dom";

export default function Footer() {
  return (
    <footer className="bg-green-900 text-white py-3 mt-8 mb-0">
      <div className="max-w-5xl mb-0 mx-auto px-4 flex flex-col md:flex-row justify-between items-center">
        {/* Sección de enlaces */}
        <div className="mb-4 md:mb-0 w-full md:w-auto">
          <h3 className="text-xl font-bold">Enlaces</h3>
          <ul className="mt-2 space-y-1 px-3">
            <li>
              <Link to="/login" className="hover:text-yellow-200">
                - Inicio
              </Link>
            </li>
            <li>
              <Link to="/proyecto" className="hover:text-yellow-200">
                - Acerca del proyecto
              </Link>
            </li>
            <li>
              <a href="#" className="hover:text-yellow-200">
                - Productos
              </a>
            </li>
            <li>
              <a href="#" className="hover:text-yellow-200">
                - Contacto
              </a>
            </li>
          </ul>
        </div>

        {/* Información de contacto */}
        <div className="mb-4 md:mb-0 w-full md:w-auto">
          <h3 className="text-xl font-bold">Contacto</h3>
          <div className="px-3">
            <p className="mt-2">📍 Dirección: Calle 5, Cali, Colombia</p>
            <p>📞 Teléfono: +57 300 123 4567</p>
            <p>✉️ Email: contacto@medifast.com</p>
          </div>
        </div>

        {/* Derechos de autor y redes */}
        <div className="text-center md:text-right w-full md:w-auto">
          <p className="text-sm">
            © {new Date().getFullYear()} Farmacia. Todos los derechos
            reservados.
          </p>
          <div className="flex space-x-4 mt-2 justify-center md:justify-end">
            <a href="#" className="hover:text-yellow-300">
              🌐 Facebook
            </a>
            <a href="#" className="hover:text-yellow-300">
              📷 Instagram
            </a>
            <a href="#" className="hover:text-yellow-300">
              🐦 Twitter
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}
