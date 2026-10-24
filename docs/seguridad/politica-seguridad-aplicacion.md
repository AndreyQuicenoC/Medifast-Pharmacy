# Politica de seguridad de aplicacion

## Backend Django

- `SECRET_KEY` obligatoria; fallo al arrancar si falta.
- `DEBUG=False` en produccion; cabeceras seguras activas.
- Validacion de entrada en modelos y serializers.
- ORM por defecto; evitar SQL concatenado.
- Logs sin contrasenas ni tokens.

## Frontend React

- Token en localStorage (deuda conocida XSS); no almacenar secretos de servidor.
- Variables publicas solo via prefijo `VITE_`.
- Mensajes de error sin detalles internos del servidor.

## Autenticacion

- Token opaco DRF revocable eliminando token en BD.
- Throttle en `authtoken/` configurable por `LOGIN_THROTTLE`.

## Revision periodica

- Dependencias: ver backlog epica E4.
- Auditoria OWASP: `auditoria-owasp.md`.
