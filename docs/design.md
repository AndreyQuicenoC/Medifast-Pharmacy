# Sistema de diseno — Medifast Pharmacy

## 1. Proposito y alcance

Define la identidad visual y los tokens reutilizables del frontend React. Aplica a pantallas operativas (login, turnos, cajas, productos, facturas, estadisticas) y paginas de soporte (404, acerca del proyecto).

## 2. Identidad visual

Marca **Medifast**: salud comunitaria, confianza y claridad operativa. Paleta verde farmaceutico + acento dorado (no copia de marcas comerciales existentes).

## 3. Audiencia

Personal de farmacia (administrador, empleado/cajero) y clientes en fila/turnos. Uso en escritorio y movil.

## 4. Tokens (implementados en `frontend/src/index.css`)

| Token | Valor | Uso |
|-------|-------|-----|
| `--color-primary` | `#166534` | Acciones principales, enlaces |
| `--color-accent` | `#ca8a04` | Acento marca "fast" |
| `--color-text` | `#111827` | Texto principal |
| `--color-text-muted` | `#4b5563` | Texto secundario |
| `--color-danger` | `#b91c1c` | Errores |
| `--color-success` | `#15803d` | Exito |

## 5. Tipografia

Sans-serif sistema (`Segoe UI`, system-ui). Titulos en `font-bold`; cuerpo 16px base.

## 6. Componentes base

- `Button.jsx`, `Header.jsx`, `Footer.jsx`
- Paginas usan utilidades Tailwind 4 + tokens CSS

## 7. Estados de interfaz

Carga, error, vacio y exito deben mostrarse explicitamente (toast `react-hot-toast` donde ya se usa). No simular exito si la API fallo.

## 8. Formularios

Etiquetas visibles, foco visible (`:focus-visible`), mensajes de error asociados al campo.

## 9. Accesibilidad (objetivo WCAG 2.2 AA)

HTML semantico, contraste en tokens primarios, `prefers-reduced-motion`, dialogo de atajos con `role="dialog"`, pagina 404 con titulo claro y acciones.

## 10. Atajos de teclado

| Atajo | Accion |
|-------|--------|
| `?` | Ayuda de atajos |
| `Alt+1` | Foco en `#main-content` |
| `Esc` | Cerrar dialogo de ayuda |

## 11. Responsive

Breakpoints Tailwind por defecto; layouts flex en header/footer.

## 12. Pagina 404

Componente `PageNotFound.jsx`: mensaje comprensible, enlaces a login y servicios.

## 13. Mantenimiento

Cambios visuales deben actualizar tokens en `index.css` y esta guia en el mismo PR.
