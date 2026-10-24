# Sistema de diseno Medifast Pharmacy

Documento de referencia del frontend implementado. Actualizar junto con cambios en `frontend/src/index.css` y componentes base.

## 1. Proposito y alcance

Unificar identidad visual, tokens, patrones de interaccion y criterios de accesibilidad para todas las pantallas React del monorepo Medifast.

## 2. Identidad visual y principios

- Claridad operativa (colas, cajas, facturas).
- Confianza (verde salud + acento calido).
- Consistencia entre modulos admin, cajero y cliente.

## 3. Audiencia

Administradores, empleados/cajeros y clientes en dispositivos desktop y moviles.

## 4. Referencias (no copia literal)

Inspiracion en patrones de dashboards de servicio y Material Design (tokens, estados, elevacion) sin declarar implementacion Material completa.

## 5. Paleta y tokens CSS

Definidos en `:root` (`frontend/src/index.css`):

| Token | Uso |
|-------|-----|
| `--color-primary` | Acciones primarias, foco |
| `--color-accent` | Marca Medi**fast** |
| `--color-text` / `--color-text-muted` | Jerarquia textual |
| `--color-danger` / `--color-success` | Feedback |
| `--radius-md`, `--shadow-card` | Contenedores |

## 6. Tipografia

Familia `--font-sans`. Titulos pagina: `text-3xl font-bold`. Subtitulos: `text-xl font-semibold`.

## 7. Espaciado y dimensiones

Pagina: `--space-page`. Formularios: max-width `max-w-sm` / `max-w-lg` segun contexto. Header/footer full width con `max-w-5xl` en footer legacy.

## 8. Componentes reutilizables

- `Button.jsx`, `Header.jsx`, `Footer.jsx`
- `PageState.jsx` (LoadingState, ErrorState, EmptyState)
- `KeyboardShortcutsHelp.jsx`
- `PageNotFound.jsx`, `Proyecto.jsx`

## 9. Layout y navegacion

`App.jsx`: fondo imagen + Header + Routes + Footer + Toaster. Rutas por rol tras login (admin, cajero, cliente).

## 10. Estados e interacciones

Hover en enlaces footer/header. Botones primarios con opacidad en hover. Spinners en LoadingState. Toasts para acciones rapidas.

## 11. Formularios

Labels visibles, inputs con borde gris, toggle password en login. Validacion servidor obligatoria; cliente muestra mensajes via `getApiErrorMessage`.

## 12. Iconografia

Assets PNG/JPG en `frontend/src/assets/`. Logo Medifast en header y login con `alt` descriptivo.

## 13. Animaciones

Spinner de carga. `@media (prefers-reduced-motion: reduce)` desactiva animaciones no esenciales.

## 14. Responsive

Tailwind breakpoints (`md:` en footer y layouts). Tablas y paneles deben scroll horizontal en movil (revision continua por pantalla).

## 15. Accesibilidad WCAG 2.2 AA (objetivo)

Foco visible, roles en dialogos, `aria-live` en carga, contraste tokens primarios sobre blanco, rutas 404 comprensibles. Ver `docs/accesibilidad/wcag-22-aa.md`.

## 16. Reglas de consistencia

No introducir colores fuera de tokens sin ADR. No usar solo color para errores (acompanar texto).

## 17. Ejemplos

Correcto: boton primario + mensaje de error textual. Incorrecto: alert generico sin detalle de API cuando `error.details` existe.

## 18. Validacion visual

Checklist por PR: contraste, foco teclado en formulario login, 404 enlaza rutas validas, reduced-motion respetado.
