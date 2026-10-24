import logging

from rest_framework import status
from rest_framework.response import Response
from rest_framework.views import exception_handler

logger = logging.getLogger(__name__)


def _public_message(status_code: int) -> str:
    messages = {
        status.HTTP_400_BAD_REQUEST: "La solicitud no es valida.",
        status.HTTP_401_UNAUTHORIZED: "Credenciales invalidas o sesion expirada.",
        status.HTTP_403_FORBIDDEN: "No tiene permiso para realizar esta accion.",
        status.HTTP_404_NOT_FOUND: "El recurso solicitado no existe.",
        status.HTTP_409_CONFLICT: "Conflicto con el estado actual del recurso.",
        status.HTTP_429_TOO_MANY_REQUESTS: "Demasiadas solicitudes. Intente mas tarde.",
    }
    return messages.get(status_code, "Ocurrio un error al procesar la solicitud.")


def api_exception_handler(exc, context):
    response = exception_handler(exc, context)

    if response is not None:
        payload = response.data
        response.data = {
            "success": False,
            "error": {
                "code": response.status_code,
                "message": _public_message(response.status_code),
                "details": payload,
            },
        }
        return response

    logger.exception("Unhandled exception in API view", exc_info=exc)
    return Response(
        {
            "success": False,
            "error": {
                "code": status.HTTP_500_INTERNAL_SERVER_ERROR,
                "message": "Error interno del servidor.",
                "details": None,
            },
        },
        status=status.HTTP_500_INTERNAL_SERVER_ERROR,
    )
