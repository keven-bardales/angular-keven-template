#!/bin/bash

# Directorio raíz de búsqueda (ajustado a tu estructura real)
BASE_DIR="./src/app"

# Encuentra carpetas vacías dentro de 'src/app' y les agrega un .gitkeep
find "$BASE_DIR" -type d -empty -exec touch {}/.gitkeep \;

echo "✅ Se han agregado archivos .gitkeep en las carpetas vacías dentro de $BASE_DIR."
