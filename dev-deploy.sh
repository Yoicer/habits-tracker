#!/bin/bash

# 🔄 Script de Desarrollo y Despliegue Rápido
# Automatiza el proceso completo de cambios en tu PWA

echo "🔄 DESARROLLO Y DESPLIEGUE RÁPIDO - MIS HÁBITOS PWA"
echo "=================================================="
echo ""

# Verificar directorio
cd /var/www/html/habit

# 1. Mostrar estado actual
echo "📊 ESTADO ACTUAL:"
echo "=================="
echo "🌍 PWA Online: https://habits-tracker-3c3ac.web.app"
echo "📁 Directorio: $(pwd)"
echo ""

# 2. Verificar cambios recientes
echo "📁 ARCHIVOS MODIFICADOS RECIENTEMENTE:"
echo "======================================"
find . -maxdepth 1 \( -name "*.html" -o -name "*.css" -o -name "*.js" -o -name "*.json" \) -not -name "package*.json" | xargs ls -lt 2>/dev/null | head -5
echo ""

# 3. Verificar herramientas
echo "🛠️ VERIFICANDO HERRAMIENTAS:"
echo "============================"
source ~/.nvm/nvm.sh 2>/dev/null
if command -v node >/dev/null 2>&1; then
    echo "✅ Node.js: $(node --version)"
else
    echo "❌ Node.js no encontrado"
    exit 1
fi

if command -v firebase >/dev/null 2>&1; then
    echo "✅ Firebase CLI: $(firebase --version)"
else
    echo "❌ Firebase CLI no encontrado"
    exit 1
fi
echo ""

# 4. Opción de prueba local
echo "🧪 PRUEBAS LOCALES:"
echo "=================="
read -p "¿Quieres iniciar servidor local para probar cambios? (y/N): " test_local
if [[ $test_local =~ ^[Yy]$ ]]; then
    echo "🚀 Iniciando servidor local en puerto 8080..."
    python3 -m http.server 8080 &
    SERVER_PID=$!
    echo "✅ Servidor activo en: http://localhost:8080"
    echo "📱 Abre tu navegador y prueba los cambios"
    echo ""
    echo "⏰ Presiona ENTER cuando hayas terminado de probar..."
    read
    echo "🛑 Deteniendo servidor local..."
    kill $SERVER_PID 2>/dev/null
    echo ""
fi

# 5. Actualizar Service Worker
echo "🔄 ACTUALIZANDO SERVICE WORKER:"
echo "==============================="
CURRENT_VERSION=$(date +"%Y%m%d-%H%M")
OLD_VERSION=$(grep -o "mis-habitos-v[^']*" sw.js 2>/dev/null | head -1)

if [[ -n "$OLD_VERSION" ]]; then
    echo "📝 Versión anterior: $OLD_VERSION"
    sed -i "s/const CACHE_NAME = 'mis-habitos-v[^']*'/const CACHE_NAME = 'mis-habitos-v$CURRENT_VERSION'/" sw.js
    echo "🆕 Nueva versión: mis-habitos-v$CURRENT_VERSION"
else
    echo "⚠️  No se pudo detectar versión anterior del SW"
fi
echo ""

# 6. Confirmar despliegue
echo "🚀 DESPLIEGUE A PRODUCCIÓN:"
echo "=========================="
read -p "¿Confirmas que quieres desplegar los cambios? (y/N): " confirm_deploy
if [[ ! $confirm_deploy =~ ^[Yy]$ ]]; then
    echo "❌ Despliegue cancelado"
    exit 0
fi

# 7. Desplegar
echo "📤 Desplegando a Firebase Hosting..."
firebase deploy --only hosting

# 8. Verificar resultado
if [ $? -eq 0 ]; then
    echo ""
    echo "✅ ¡DESPLIEGUE EXITOSO!"
    echo "======================"
    echo "🌍 Tu PWA actualizada está en: https://habits-tracker-3c3ac.web.app"
    echo "📊 Console Firebase: https://console.firebase.google.com/project/habits-tracker-3c3ac/overview"
    echo "⏰ Los cambios estarán disponibles en 1-2 minutos"
    echo ""
    echo "🔍 SIGUIENTE PASOS:"
    echo "- Abre la URL en navegador privado para ver cambios"
    echo "- Verifica funcionamiento en móvil"
    echo "- Comprueba que el Service Worker se actualiza"
else
    echo ""
    echo "❌ ERROR EN EL DESPLIEGUE"
    echo "========================"
    echo "🔧 Verifica:"
    echo "- Conexión a internet"
    echo "- Autenticación Firebase (firebase login)"
    echo "- Permisos del proyecto"
fi
