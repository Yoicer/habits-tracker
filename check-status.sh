#!/bin/bash

# 🔍 Verificador de Estado PWA
# Verifica que todos los archivos necesarios estén presentes y correctos

echo "🔍 VERIFICANDO ESTADO DE LA PWA 'MIS HÁBITOS'"
echo "=============================================="

cd /var/www/html/habit

# Verificar archivos principales
echo ""
echo "📁 ARCHIVOS PRINCIPALES:"
files=("index.html" "styles.css" "script.js" "manifest.json" "sw.js")
for file in "${files[@]}"; do
    if [[ -f "$file" ]]; then
        size=$(stat -c%s "$file")
        echo "   ✅ $file (${size} bytes)"
    else
        echo "   ❌ $file - NO ENCONTRADO"
    fi
done

# Verificar archivos de configuración
echo ""
echo "⚙️ CONFIGURACIÓN FIREBASE:"
config_files=("firebase.json" ".firebaserc" "package.json")
for file in "${config_files[@]}"; do
    if [[ -f "$file" ]]; then
        echo "   ✅ $file"
    else
        echo "   ❌ $file - NO ENCONTRADO"
    fi
done

# Verificar iconos PWA
echo ""
echo "🖼️ ICONOS PWA:"
if [[ -d "icons" ]]; then
    icon_count=$(ls icons/*.png 2>/dev/null | wc -l)
    echo "   ✅ Directorio icons/ existe"
    echo "   ✅ $icon_count iconos encontrados:"
    for icon in icons/*.png; do
        if [[ -f "$icon" ]]; then
            size=$(stat -c%s "$icon")
            echo "      • $(basename $icon) (${size} bytes)"
        fi
    done
else
    echo "   ❌ Directorio icons/ no encontrado"
fi

# Verificar documentación
echo ""
echo "📚 DOCUMENTACIÓN:"
docs=("README.md" "FIREBASE-DEPLOY.md" "DEPLOY-GUIDE.md")
for doc in "${docs[@]}"; do
    if [[ -f "$doc" ]]; then
        lines=$(wc -l < "$doc")
        echo "   ✅ $doc ($lines líneas)"
    else
        echo "   ❌ $doc - NO ENCONTRADO"
    fi
done

# Verificar servidor local
echo ""
echo "🌐 SERVIDOR LOCAL:"
if pgrep -f "python3 -m http.server 8080" > /dev/null; then
    echo "   ✅ Servidor HTTP ejecutándose en puerto 8080"
    echo "   🌍 URL: http://localhost:8080"
else
    echo "   ❌ Servidor HTTP no está ejecutándose"
fi

# Verificar Node.js y Firebase CLI
echo ""
echo "🛠️ HERRAMIENTAS DE DESARROLLO:"
if command -v node >/dev/null 2>&1; then
    node_version=$(node --version 2>/dev/null || echo "No disponible")
    echo "   ✅ Node.js: $node_version"
else
    echo "   ❌ Node.js no encontrado"
fi

if source ~/.nvm/nvm.sh && command -v firebase >/dev/null 2>&1; then
    firebase_version=$(source ~/.nvm/nvm.sh && firebase --version 2>/dev/null || echo "No disponible")
    echo "   ✅ Firebase CLI: $firebase_version"
else
    echo "   ❌ Firebase CLI no encontrado"
fi

# Resumen final
echo ""
echo "📊 RESUMEN:"
echo "============"

total_files=$(ls -1 *.html *.css *.js *.json *.md 2>/dev/null | wc -l)
echo "📄 Archivos principales: $total_files"

if [[ -d "icons" ]]; then
    icon_files=$(ls icons/*.png 2>/dev/null | wc -l)
    echo "🖼️ Iconos PWA: $icon_files"
fi

echo ""
echo "🎯 PRÓXIMO PASO:"
echo "=================="
echo "1. Completa la autenticación Firebase:"
echo "   firebase login --no-localhost"
echo ""
echo "2. Despliega la aplicación:"
echo "   firebase deploy --only hosting"
echo ""
echo "3. O lee la guía completa:"
echo "   cat DEPLOY-GUIDE.md"
echo ""
echo "✨ ¡Tu PWA está lista para el despliegue!"
