#!/bin/bash

# Script de despliegue alternativo para Mis Hábitos PWA
# Autor: GitHub Copilot
# Fecha: $(date)

echo "🚀 Iniciando proceso de despliegue..."

# Verificar Node.js
echo "📋 Verificando Node.js..."
source ~/.nvm/nvm.sh
node --version

# Verificar Firebase CLI
echo "📋 Verificando Firebase CLI..."
firebase --version

# Verificar autenticación
echo "🔐 Verificando autenticación Firebase..."
firebase projects:list 2>/dev/null || {
    echo "❌ No estás autenticado en Firebase"
    echo "🌐 Por favor, ejecuta: firebase login --no-localhost"
    echo "📝 Y sigue las instrucciones en el navegador"
    exit 1
}

# Cambiar al directorio del proyecto
cd /var/www/html/habit

# Verificar archivos necesarios
echo "📁 Verificando archivos del proyecto..."
required_files=("index.html" "manifest.json" "sw.js" "firebase.json")
for file in "${required_files[@]}"; do
    if [[ -f "$file" ]]; then
        echo "✅ $file existe"
    else
        echo "❌ $file no encontrado"
        exit 1
    fi
done

# Verificar iconos PWA
echo "🖼️ Verificando iconos PWA..."
if [[ -d "icons" ]] && [[ $(ls icons/*.png 2>/dev/null | wc -l) -gt 0 ]]; then
    echo "✅ Iconos PWA encontrados ($(ls icons/*.png | wc -l) archivos)"
else
    echo "❌ No se encontraron iconos PWA"
    exit 1
fi

# Desplegar a Firebase
echo "🚀 Desplegando versión integrada a Firebase Hosting..."

# Crear backup de archivos originales si es necesario
echo "💾 Creando backup temporal..."
cp index.html index.html.backup

# Verificar que la solución integrada esté lista
if [[ -f "integrated-fix.js" ]]; then
    echo "✅ Solución integrada encontrada"
else
    echo "❌ integrated-fix.js no encontrado"
    exit 1
fi

# Ejecutar deploy
firebase deploy --only hosting

echo "✅ ¡Despliegue completado!"
echo "🌍 Tu PWA debería estar disponible en: https://habits-tracker-3c3ac.web.app"
