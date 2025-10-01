// 🔔 MÓDULO DE NOTIFICACIONES LOCALES
class NotificationManager {
    constructor() {
        this.checkInterval = null;
        this.notificationQueue = [];
        this.init();
    }

    // Inicializar sistema de notificaciones
    init() {
        this.createNotificationContainer();
        this.loadNotificationSettings();
        this.startNotificationChecker();
    }

    // Crear contenedor de notificaciones
    createNotificationContainer() {
        if (document.getElementById('notification-container')) return;
        
        const container = document.createElement('div');
        container.id = 'notification-container';
        container.innerHTML = `
            <style>
                #notification-container {
                    position: fixed;
                    top: 20px;
                    right: 20px;
                    z-index: 10000;
                    pointer-events: none;
                }
                
                .notification {
                    background: rgba(255, 255, 255, 0.95);
                    border-radius: 12px;
                    padding: 16px 20px;
                    margin-bottom: 10px;
                    box-shadow: 0 4px 20px rgba(0, 0, 0, 0.15);
                    border-left: 4px solid #4CAF50;
                    min-width: 300px;
                    max-width: 400px;
                    pointer-events: auto;
                    transform: translateX(450px);
                    transition: all 0.3s ease;
                    backdrop-filter: blur(10px);
                }
                
                .notification.show {
                    transform: translateX(0);
                }
                
                .notification.reminder {
                    border-left-color: #FF9800;
                }
                
                .notification.achievement {
                    border-left-color: #4CAF50;
                    background: linear-gradient(135deg, rgba(76, 175, 80, 0.1) 0%, rgba(255, 255, 255, 0.95) 100%);
                }
                
                .notification.warning {
                    border-left-color: #f44336;
                }
                
                .notification-header {
                    display: flex;
                    justify-content: between;
                    align-items: center;
                    margin-bottom: 8px;
                }
                
                .notification-title {
                    font-weight: 600;
                    color: #333;
                    flex: 1;
                }
                
                .notification-close {
                    background: none;
                    border: none;
                    font-size: 1.2rem;
                    color: #999;
                    cursor: pointer;
                    padding: 0;
                    margin-left: 10px;
                }
                
                .notification-close:hover {
                    color: #666;
                }
                
                .notification-body {
                    color: #666;
                    font-size: 0.9rem;
                    line-height: 1.4;
                }
                
                .notification-actions {
                    margin-top: 12px;
                    display: flex;
                    gap: 8px;
                }
                
                .notification-btn {
                    background: #4CAF50;
                    color: white;
                    border: none;
                    padding: 6px 12px;
                    border-radius: 6px;
                    font-size: 0.8rem;
                    cursor: pointer;
                    transition: background 0.2s ease;
                }
                
                .notification-btn:hover {
                    background: #45a049;
                }
                
                .notification-btn.secondary {
                    background: #e0e0e0;
                    color: #666;
                }
                
                .notification-btn.secondary:hover {
                    background: #d0d0d0;
                }
                
                @media (max-width: 768px) {
                    #notification-container {
                        top: 10px;
                        right: 10px;
                        left: 10px;
                    }
                    
                    .notification {
                        min-width: auto;
                        max-width: none;
                        transform: translateY(-100px);
                    }
                    
                    .notification.show {
                        transform: translateY(0);
                    }
                }
            </style>
        `;
        document.body.appendChild(container);
    }

    // Mostrar notificación
    showNotification(options) {
        const {
            title = 'Recordatorio',
            message = '',
            type = 'reminder', // reminder, achievement, warning
            duration = 5000,
            actions = []
        } = options;

        const notificationId = 'notif-' + Date.now();
        const container = document.getElementById('notification-container');
        
        const notification = document.createElement('div');
        notification.className = `notification ${type}`;
        notification.id = notificationId;
        
        notification.innerHTML = `
            <div class="notification-header">
                <div class="notification-title">${this.getNotificationIcon(type)} ${title}</div>
                <button class="notification-close" onclick="notificationManager.closeNotification('${notificationId}')">&times;</button>
            </div>
            <div class="notification-body">${message}</div>
            ${actions.length > 0 ? `
                <div class="notification-actions">
                    ${actions.map(action => `
                        <button class="notification-btn ${action.type || ''}" onclick="${action.onClick}">
                            ${action.label}
                        </button>
                    `).join('')}
                </div>
            ` : ''}
        `;
        
        container.appendChild(notification);
        
        // Mostrar notificación con animación
        setTimeout(() => {
            notification.classList.add('show');
        }, 100);
        
        // Auto-cerrar después del tiempo especificado
        if (duration > 0) {
            setTimeout(() => {
                this.closeNotification(notificationId);
            }, duration);
        }
        
        return notificationId;
    }

    // Cerrar notificación
    closeNotification(notificationId) {
        const notification = document.getElementById(notificationId);
        if (notification) {
            notification.classList.remove('show');
            setTimeout(() => {
                notification.remove();
            }, 300);
        }
    }

    // Obtener icono según tipo de notificación
    getNotificationIcon(type) {
        const icons = {
            reminder: '⏰',
            achievement: '🏆',
            warning: '⚠️',
            success: '✅',
            info: 'ℹ️'
        };
        return icons[type] || '📱';
    }

    // Verificar hábitos pendientes
    checkPendingHabits(habits) {
        const now = new Date();
        const today = now.toDateString();
        const currentHour = now.getHours();
        
        // Solo notificar entre 8 AM y 10 PM
        if (currentHour < 8 || currentHour > 22) return;
        
        habits.forEach(habit => {
            const completions = habit.completions || [];
            const completedToday = completions.some(date => 
                new Date(date).toDateString() === today
            );
            
            if (!completedToday && this.shouldNotify(habit)) {
                this.showHabitReminder(habit);
            }
        });
    }

    // Determinar si se debe notificar sobre un hábito
    shouldNotify(habit) {
        const lastNotified = localStorage.getItem(`lastNotified_${habit.id}`);
        const now = Date.now();
        const oneHour = 60 * 60 * 1000;
        
        // No notificar si ya se notificó hace menos de 1 hora
        if (lastNotified && (now - parseInt(lastNotified)) < oneHour) {
            return false;
        }
        
        return true;
    }

    // Mostrar recordatorio de hábito
    showHabitReminder(habit) {
        const messages = [
            `¡No olvides ${habit.name.toLowerCase()}!`,
            `Es hora de ${habit.name.toLowerCase()}`,
            `${habit.name} te está esperando`,
            `¡Mantén tu racha de ${habit.name.toLowerCase()}!`
        ];
        
        const randomMessage = messages[Math.floor(Math.random() * messages.length)];
        
        this.showNotification({
            title: 'Recordatorio de Hábito',
            message: randomMessage,
            type: 'reminder',
            duration: 8000,
            actions: [
                {
                    label: 'Marcar como hecho',
                    onClick: `habitTracker.completeHabit('${habit.id}'); notificationManager.closeNotification(event.target.closest('.notification').id)`
                },
                {
                    label: 'Más tarde',
                    type: 'secondary',
                    onClick: `notificationManager.closeNotification(event.target.closest('.notification').id)`
                }
            ]
        });
        
        // Guardar timestamp de última notificación
        localStorage.setItem(`lastNotified_${habit.id}`, Date.now().toString());
    }

    // Mostrar notificación de logro
    showAchievement(achievement) {
        this.showNotification({
            title: '🎉 ¡Logro Desbloqueado!',
            message: achievement.message,
            type: 'achievement',
            duration: 6000
        });
    }

    // Iniciar verificador automático
    startNotificationChecker() {
        // Verificar cada 30 minutos
        this.checkInterval = setInterval(() => {
            const habits = JSON.parse(localStorage.getItem('habits') || '[]');
            this.checkPendingHabits(habits);
        }, 30 * 60 * 1000);
        
        // Verificar también al cargar la página
        setTimeout(() => {
            const habits = JSON.parse(localStorage.getItem('habits') || '[]');
            this.checkPendingHabits(habits);
        }, 5000);
    }

    // Cargar configuración de notificaciones
    loadNotificationSettings() {
        const settings = JSON.parse(localStorage.getItem('notificationSettings') || '{}');
        this.settings = {
            enabled: settings.enabled !== false, // Por defecto habilitado
            reminderHour: settings.reminderHour || 9,
            reminderFrequency: settings.reminderFrequency || 30, // minutos
            ...settings
        };
    }

    // Guardar configuración
    saveNotificationSettings() {
        localStorage.setItem('notificationSettings', JSON.stringify(this.settings));
    }

    // Habilitar/deshabilitar notificaciones
    toggleNotifications() {
        this.settings.enabled = !this.settings.enabled;
        this.saveNotificationSettings();
        
        this.showNotification({
            title: 'Notificaciones',
            message: `Notificaciones ${this.settings.enabled ? 'habilitadas' : 'deshabilitadas'}`,
            type: 'info',
            duration: 3000
        });
    }
}

// Instancia global
window.notificationManager = new NotificationManager();
