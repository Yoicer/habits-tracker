# 📱 Mis Hábitos - PWA de Seguimiento de Hábitos

Una aplicación moderna para registrar y seguir tus hábitos diarios, semanales y mensuales. Ahora disponible como PWA para instalación en tu dispositivo.

## ✨ Características

### 🎯 Funcionalidades principales

- ✅ **Agregar hábitos** con nombre y frecuencia personalizada
- 📊 **Seguimiento inteligente** según la frecuencia (diaria, semanal, mensual)
- ✏️ **Editar hábitos** cuando sea necesario
- 🗑️ **Eliminar hábitos** con confirmación de seguridad
- 💾 **Almacenamiento persistente** en localStorage
- 🔥 **Sistema de rachas** para motivarte
- 📈 **Estadísticas detalladas** de cada hábito

### 📱 Características PWA

- 🚀 **Instalable** en dispositivos móviles y escritorio
- ⚡ **Funciona offline** una vez instalada
- 🔄 **Actualizaciones automáticas** con notificación
- 📤 **Compartir hábitos** usando Web Share API
- 🎨 **Interfaz nativa** cuando se instala
- ⚡ **Carga rápida** con Service Worker

## 🚀 Instalación como PWA

### En móvil (Android/iOS):

1. Abre la aplicación en tu navegador
2. Busca el botón "Instalar App" o el mensaje del navegador
3. Toca "Agregar a pantalla de inicio" o "Instalar"
4. ¡Listo! Ahora tendrás un ícono en tu pantalla de inicio

### En escritorio (Chrome/Edge):

1. Abre la aplicación en tu navegador
2. Verás un ícono de instalación en la barra de direcciones
3. Haz clic en "Instalar" cuando aparezca la opción
4. La app se abrirá en su propia ventana

## 🛠️ Tecnologías utilizadas

- **HTML5** - Estructura semántica
- **CSS3** - Diseño moderno con Grid y Flexbox
- **JavaScript ES6+** - Lógica de la aplicación
- **Service Worker** - Funcionalidad offline y caché
- **Web App Manifest** - Configuración PWA
- **LocalStorage** - Persistencia de datos
- **Font Awesome** - Iconografía

## 📂 Estructura del proyecto

```
/habit/
├── index.html              # Página principal
├── styles.css              # Estilos de la aplicación
├── script.js               # Lógica de la aplicación y PWA
├── manifest.json           # Configuración PWA
├── sw.js                   # Service Worker
├── icon-base.svg           # Ícono base en SVG
├── generate-icons.html     # Generador de iconos
├── icons/                  # Iconos para PWA
│   ├── icon-16x16.png
│   ├── icon-32x32.png
│   ├── icon-72x72.png
│   ├── icon-96x96.png
│   ├── icon-128x128.png
│   ├── icon-144x144.png
│   ├── icon-152x152.png
│   ├── icon-192x192.png
│   ├── icon-384x384.png
│   └── icon-512x512.png
└── README.md               # Este archivo
```

## 🎨 Personalización

### Colores principales:

- **Verde principal**: `#4CAF50`
- **Verde hover**: `#45a049`
- **Gradiente de fondo**: `#667eea` → `#764ba2`

### Modificar iconos:

1. Edita `icon-base.svg` con tu diseño
2. Ejecuta el generador en `generate-icons.html`
3. O usa ImageMagick: `convert icon-base.svg -resize 192x192 icons/icon-192x192.png`

## 🔧 Desarrollo

### Comandos útiles:

```bash
# Generar iconos desde SVG
convert icon-base.svg -resize 192x192 icons/icon-192x192.png

# Servir localmente (requiere servidor web)
python3 -m http.server 8000
# O con Node.js
npx serve .
```

### Características técnicas:

- **Estrategia de caché**: Cache First para recursos estáticos, Network First para la app
- **Offline support**: Funciona completamente offline una vez cacheada
- **Update strategy**: Notifica al usuario cuando hay actualizaciones disponibles
- **Storage**: localStorage para persistencia de datos

## 📱 Shortcuts de la PWA

La aplicación incluye shortcuts que aparecen al hacer clic largo en el ícono:

- **Agregar Hábito**: Abre directamente el modal para agregar un nuevo hábito

## 🔔 Notificaciones (Futuro)

La PWA está preparada para implementar notificaciones push para recordar completar hábitos.

## 🚀 Estado del Proyecto

✅ **COMPLETADO:** Aplicación PWA totalmente funcional
✅ **COMPLETADO:** Todos los archivos de configuración Firebase
✅ **COMPLETADO:** Iconos PWA generados (10 tamaños)
✅ **COMPLETADO:** Service Worker con cache offline
✅ **COMPLETADO:** Scripts de despliegue automatizado

⚠️ **PENDIENTE:** Autenticación Firebase y despliegue final

## 🔥 Despliegue a Firebase

### Opción 1: Usar nuestra Guía Completa

```bash
cat DEPLOY-GUIDE.md  # Lee la guía paso a paso
```

### Opción 2: Despliegue Rápido

```bash
./deploy.sh  # Script automático (requiere auth Firebase)
```

### Opción 3: Prueba Local

```bash
# Servidor local ya ejecutándose
python3 -m http.server 8080
# Visita: http://localhost:8080
```

## 📞 URLs Importantes

- **🌐 Aplicación Local:** http://localhost:8080
- **🔥 Firebase Auth:** Ve el archivo DEPLOY-GUIDE.md
- **📚 Documentación:** Todos los archivos .md incluidos

## 🎯 Próximos Pasos

1. **Completa la autenticación Firebase** (ver DEPLOY-GUIDE.md)
2. **Ejecuta el despliegue:**
   ```bash
   firebase deploy --only hosting
   ```
3. **¡Tu PWA estará online!** 🎉

## 🤝 Contribuir

¿Quieres mejorar la aplicación? ¡Las contribuciones son bienvenidas!

### Ideas para nuevas características:

- 📊 Gráficos de progreso
- 🎯 Metas personalizadas
- 🏆 Sistema de logros
- 📅 Calendario de hábitos
- 🔔 Notificaciones push
- 📱 Sincronización en la nube
- 👥 Compartir con amigos
- 🎨 Temas personalizables

## 📄 Licencia

Este proyecto es de código abierto y está disponible bajo la licencia MIT.

---

**¡Comienza a construir mejores hábitos hoy mismo! 🚀**

## 🎉 **¡APLICACIÓN DESPLEGADA EXITOSAMENTE!**

### 🌍 **Tu PWA está ONLINE:**

- **🔗 URL de la aplicación:** https://habits-tracker-3c3ac.web.app
- **📊 Firebase Console:** https://console.firebase.google.com/project/habits-tracker-3c3ac/overview

### ✅ **Estado del Proyecto:**

- ✅ **PWA Funcional:** 100% completa
- ✅ **Despliegue Firebase:** ✅ EXITOSO
- ✅ **Acceso Global:** 🌍 ONLINE 24/7
- ✅ **Instalable:** 📱 Como app nativa
- ✅ **Offline:** 🔄 Funcionamiento sin internet
