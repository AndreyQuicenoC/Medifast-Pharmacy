# Accesibilidad WCAG 2.2 (nivel AA objetivo)

## Criterios abordados en codigo

| Criterio | Implementacion | Pendiente |
|----------|----------------|-----------|
| 1.3.1 Info and relationships | main, header, footer semanticos | Tablas datos densas |
| 2.1.1 Keyboard | Atajos ?, Alt+1, Esc | Revision por pagina |
| 2.4.1 Bypass blocks | Alt+1 foco main | skip link visible |
| 2.4.7 Focus visible | :focus-visible en CSS | Componentes custom |
| 3.3.1 Error identification | Login + apiError | Resto formularios |
| 4.1.2 Name, role, value | dialog atajos | Modales legacy |

## Verificacion

- Manual con teclado en login, 404, dialogo atajos.
- Lighthouse/axe en CI: pendiente integracion.

Excepciones documentadas aqui antes de release.
