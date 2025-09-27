# 🔄 Guía para Implementar Cambios en tu PWA

## 📝 **Flujo de Desarrollo Completo**

Tu PWA está desplegada en: **https://habits-tracker-3c3ac.web.app**

### 🛠️ **1. Hacer Cambios Localmente**

#### **Estructura de archivos principales:**

```
/var/www/html/habit/
├── index.html      # Interfaz principal
├── styles.css      # Estilos y diseño
├── script.js       # Lógica de la aplicación
├── manifest.json   # Configuración PWA
├── sw.js          # Service Worker (cache offline)
└── icons/         # Iconos PWA
```

#### **Ejemplos de cambios comunes:**

**A) Cambiar colores o diseño:**

```bash
nano /var/www/html/habit/styles.css
```

**B) Agregar nueva funcionalidad:**

```bash
nano /var/www/html/habit/script.js
```

**C) Modificar la interfaz:**

```bash
nano /var/www/html/habit/index.html
```

**D) Actualizar información de la app:**

```bash
nano /var/www/html/habit/manifest.json
```

---

### 🧪 **2. Probar Cambios Localmente**

#### **Opción A: Servidor Python (Simple)**

```bash
cd /var/www/html/habit
python3 -m http.server 8080
```

**Prueba en:** http://localhost:8080

#### **Opción B: Servidor Firebase (Recomendado)**

```bash
source ~/.nvm/nvm.sh
cd /var/www/html/habit
firebase serve --port 5000
```

**Prueba en:** http://localhost:5000

#### **Verificar PWA localmente:**

1. Abre DevTools (F12)
2. Ve a "Application" > "Service Workers"
3. Verifica que el SW se registre correctamente
4. Prueba el modo offline (Network > Offline)

---

### 🚀 **3. Desplegar Cambios a Producción**

#### **Comando Simple:**

```bash
source ~/.nvm/nvm.sh
cd /var/www/html/habit
firebase deploy --only hosting
```

#### **Script Automatizado:**

```bash
cd /var/www/html/habit
./deploy.sh
```

#### **Verificar despliegue:**

- Los cambios estarán online en 1-2 minutos
- URL: https://habits-tracker-3c3ac.web.app

---

### 🔄 **4. Actualizaciones del Service Worker**

**IMPORTANTE:** Cuando cambies funcionalidad principal, actualiza la versión del SW:

```javascript
// En sw.js, cambiar:
const CACHE_NAME = "mis-habitos-v1.0.0";
// Por:
const CACHE_NAME = "mis-habitos-v1.0.1";
```

Esto fuerza a los usuarios a obtener la nueva versión.

---

## 💡 **Ejemplos Prácticos de Cambios**

### **Ejemplo 1: Cambiar colores del tema**

```bash
# Abrir archivo de estilos
nano /var/www/html/habit/styles.css

# Buscar y cambiar, por ejemplo:
# --primary-color: #4CAF50;    (verde)
# --primary-color: #2196F3;    (azul)
```

### **Ejemplo 2: Agregar nueva frecuencia de hábito**

```bash
# Editar script principal
nano /var/www/html/habit/script.js

# Buscar: frequencies = ['diario', 'semanal', 'mensual']
# Cambiar a: frequencies = ['diario', 'semanal', 'mensual', 'anual']
```

### **Ejemplo 3: Cambiar título de la app**

```bash
# Editar HTML principal
nano /var/www/html/habit/index.html

# Cambiar: <title>Mis Hábitos</title>
# Por: <title>Mi Tracker de Hábitos</title>
```

### **Ejemplo 4: Actualizar información PWA**

```bash
# Editar manifest
nano /var/www/html/habit/manifest.json

# Cambiar nombre, descripción, etc.
```

---

## 🔧 **Script de Desarrollo Rápido**

Voy a crear un script que automatice el proceso completo:

```bash
#!/bin/bash
# Archivo: dev-deploy.sh

echo "🔄 DESARROLLO Y DESPLIEGUE RÁPIDO"
echo "================================="

# 1. Verificar cambios
echo "📁 Archivos modificados recientemente:"
find . -name "*.html" -o -name "*.css" -o -name "*.js" -o -name "*.json" | xargs ls -lt | head -5

# 2. Probar localmente (opcional)
read -p "¿Quieres probar localmente primero? (y/N): " test_local
if [[ $test_local =~ ^[Yy]$ ]]; then
    echo "🧪 Iniciando servidor local..."
    python3 -m http.server 8080 &
    SERVER_PID=$!
    echo "✅ Servidor en: http://localhost:8080"
    echo "⏰ Presiona ENTER cuando hayas terminado de probar..."
    read
    kill $SERVER_PID 2>/dev/null
fi

# 3. Actualizar versión del Service Worker
echo "🔄 Actualizando versión del Service Worker..."
CURRENT_DATE=$(date +"%Y%m%d%H%M")
sed -i "s/const CACHE_NAME = 'mis-habitos-v[^']*'/const CACHE_NAME = 'mis-habitos-v$CURRENT_DATE'/" sw.js
echo "✅ Nueva versión: mis-habitos-v$CURRENT_DATE"

# 4. Desplegar
echo "🚀 Desplegando a Firebase..."
source ~/.nvm/nvm.sh
firebase deploy --only hosting

echo "✅ ¡Cambios desplegados!"
echo "🌍 URL: https://habits-tracker-3c3ac.web.app"
```

---

## 📊 **Monitoreo y Debug**

### **Ver logs de despliegue:**

```bash
firebase hosting:channel:list
```

### **Rollback a versión anterior:**

```bash
firebase hosting:clone SOURCE_SITE_ID:SOURCE_CHANNEL_ID TARGET_SITE_ID:live
```

### **Verificar estado de la PWA:**

```bash
./check-status.sh
```

---

## 🎯 **Buenas Prácticas**

### **✅ HACER:**

- Probar cambios localmente antes de desplegar
- Actualizar versión del Service Worker para cambios importantes
- Hacer commits pequeños y frecuentes
- Documentar cambios significativos

### **❌ EVITAR:**

- Desplegar sin probar
- Cambiar múltiples archivos críticos a la vez
- Ignorar errores en la consola del navegador
- Olvidar actualizar la versión del SW

---

## 🔄 **Flujo Recomendado:**

1. **📝 Editar archivos** localmente
2. **🧪 Probar** en servidor local
3. **🔄 Actualizar** versión SW (si es necesario)
4. **🚀 Desplegar** a Firebase
5. **✅ Verificar** que funciona online
6. **📱 Probar** en dispositivos móviles

**¡Con este flujo tendrás actualizaciones rápidas y seguras!** 🎉
