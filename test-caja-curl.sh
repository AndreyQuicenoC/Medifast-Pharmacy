#!/bin/bash
# Script para probar las APIs de caja usando curl

echo "=== Test de APIs de Caja con curl ==="

# Primero hacer login para obtener el token
echo "1. Haciendo login para obtener token..."
LOGIN_RESPONSE=$(curl -s -X POST http://127.0.0.1:8000/api/login/ \
  -H "Content-Type: application/json" \
  -d '{"cc": "123456789", "password": "admin123"}')

echo "Login response: $LOGIN_RESPONSE"

# Extraer el token
TOKEN=$(echo $LOGIN_RESPONSE | grep -o '"token":"[^"]*' | cut -d'"' -f4)
echo "Token obtenido: $TOKEN"

if [ -z "$TOKEN" ]; then
    echo "❌ No se pudo obtener el token. Verificar credenciales."
    exit 1
fi

echo -e "\n2. Probando obtener cajas..."
curl -s -X GET http://127.0.0.1:8000/api/caja/ \
  -H "Authorization: Token $TOKEN" \
  -H "Content-Type: application/json" | python -m json.tool

echo -e "\n3. Probando usuarios disponibles..."
curl -s -X GET http://127.0.0.1:8000/api/caja/usuarios_disponibles/ \
  -H "Authorization: Token $TOKEN" \
  -H "Content-Type: application/json" | python -m json.tool

echo -e "\n4. Probando todos los empleados..."
curl -s -X GET http://127.0.0.1:8000/api/caja/empleados_todos/ \
  -H "Authorization: Token $TOKEN" \
  -H "Content-Type: application/json" | python -m json.tool
