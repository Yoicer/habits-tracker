class HabitTracker {
    constructor() {
        this.habits = this.loadHabits();
        this.editingHabitId = null;
        this.initializeEventListeners();
        this.renderHabits();
    }

    // Inicializar event listeners
    initializeEventListeners() {
        // Modal
        const modal = document.getElementById('habit-modal');
        const addBtn = document.getElementById('add-habit-btn');
        const closeBtn = document.querySelector('.close');
        const cancelBtn = document.getElementById('cancel-btn');
        const form = document.getElementById('habit-form');

        addBtn.addEventListener('click', () => this.openModal());
        closeBtn.addEventListener('click', () => this.closeModal());
        cancelBtn.addEventListener('click', () => this.closeModal());
        form.addEventListener('submit', (e) => this.handleFormSubmit(e));

        // Cerrar modal al hacer click fuera
        window.addEventListener('click', (e) => {
            if (e.target === modal) {
                this.closeModal();
            }
        });
    }

    // Generar ID único
    generateId() {
        return '_' + Math.random().toString(36).substr(2, 9);
    }

    // Cargar hábitos del localStorage
    loadHabits() {
        const habits = localStorage.getItem('habits');
        return habits ? JSON.parse(habits) : [];
    }

    // Guardar hábitos en localStorage
    saveHabits() {
        localStorage.setItem('habits', JSON.stringify(this.habits));
    }

    // Abrir modal
    openModal(habit = null) {
        const modal = document.getElementById('habit-modal');
        const modalTitle = document.getElementById('modal-title');
        const form = document.getElementById('habit-form');
        
        if (habit) {
            // Modo edición
            modalTitle.textContent = 'Editar Hábito';
            document.getElementById('habit-name').value = habit.name;
            document.getElementById('habit-frequency').value = habit.frequency;
            this.editingHabitId = habit.id;
        } else {
            // Modo agregar
            modalTitle.textContent = 'Agregar Nuevo Hábito';
            form.reset();
            this.editingHabitId = null;
        }
        
        modal.style.display = 'block';
        document.getElementById('habit-name').focus();
    }

    // Cerrar modal
    closeModal() {
        const modal = document.getElementById('habit-modal');
        modal.style.display = 'none';
        this.editingHabitId = null;
    }

    // Manejar envío del formulario
    handleFormSubmit(e) {
        e.preventDefault();
        
        const name = document.getElementById('habit-name').value.trim();
        const frequency = document.getElementById('habit-frequency').value;
        
        if (!name || !frequency) {
            alert('Por favor completa todos los campos');
            return;
        }

        if (this.editingHabitId) {
            // Editar hábito existente
            this.editHabit(this.editingHabitId, name, frequency);
        } else {
            // Agregar nuevo hábito
            this.addHabit(name, frequency);
        }
        
        this.closeModal();
    }

    // Agregar nuevo hábito
    addHabit(name, frequency) {
        const habit = {
            id: this.generateId(),
            name: name,
            frequency: frequency,
            createdAt: new Date().toISOString(),
            completions: [],
            streak: 0
        };
        
        this.habits.push(habit);
        this.saveHabits();
        this.renderHabits();
    }

    // Editar hábito
    editHabit(id, name, frequency) {
        const habitIndex = this.habits.findIndex(h => h.id === id);
        if (habitIndex !== -1) {
            this.habits[habitIndex].name = name;
            this.habits[habitIndex].frequency = frequency;
            this.saveHabits();
            this.renderHabits();
        }
    }

    // Eliminar hábito
    deleteHabit(id) {
        if (confirm('¿Estás seguro de que quieres eliminar este hábito?')) {
            this.habits = this.habits.filter(h => h.id !== id);
            this.saveHabits();
            this.renderHabits();
        }
    }

    // Marcar hábito como completado
    completeHabit(id) {
        const habit = this.habits.find(h => h.id === id);
        if (!habit) return;

        const today = new Date().toDateString();
        const isAlreadyCompleted = this.isCompletedToday(habit);

        if (isAlreadyCompleted) {
            // Si ya está completado, lo desmarcamos
            habit.completions = habit.completions.filter(date => 
                new Date(date).toDateString() !== today
            );
        } else {
            // Si no está completado, lo marcamos
            habit.completions.push(new Date().toISOString());
        }

        // Actualizar racha
        this.updateStreak(habit);
        
        this.saveHabits();
        this.renderHabits();

        // Animación de completado
        if (!isAlreadyCompleted) {
            const habitCard = document.querySelector(`[data-habit-id="${id}"]`);
            if (habitCard) {
                habitCard.classList.add('completed-animation');
                setTimeout(() => {
                    habitCard.classList.remove('completed-animation');
                }, 600);
            }
        }
    }

    // Verificar si el hábito está completado hoy
    isCompletedToday(habit) {
        const today = new Date().toDateString();
        return habit.completions.some(date => 
            new Date(date).toDateString() === today
        );
    }

    // Verificar si el hábito está completado en el período actual
    isCompletedInCurrentPeriod(habit) {
        const now = new Date();
        const today = now.toDateString();
        
        switch (habit.frequency) {
            case 'diaria':
                return this.isCompletedToday(habit);
            
            case 'semanal':
                const startOfWeek = new Date(now);
                startOfWeek.setDate(now.getDate() - now.getDay());
                startOfWeek.setHours(0, 0, 0, 0);
                
                return habit.completions.some(date => {
                    const completionDate = new Date(date);
                    return completionDate >= startOfWeek;
                });
            
            case 'mensual':
                const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
                
                return habit.completions.some(date => {
                    const completionDate = new Date(date);
                    return completionDate >= startOfMonth;
                });
            
            default:
                return false;
        }
    }

    // Actualizar racha
    updateStreak(habit) {
        if (habit.completions.length === 0) {
            habit.streak = 0;
            return;
        }

        const sortedCompletions = habit.completions
            .map(date => new Date(date))
            .sort((a, b) => b - a);

        let streak = 0;
        const today = new Date();
        today.setHours(0, 0, 0, 0);

        for (let i = 0; i < sortedCompletions.length; i++) {
            const completionDate = new Date(sortedCompletions[i]);
            completionDate.setHours(0, 0, 0, 0);

            let expectedDate = new Date(today);
            
            if (habit.frequency === 'diaria') {
                expectedDate.setDate(today.getDate() - streak);
            } else if (habit.frequency === 'semanal') {
                expectedDate.setDate(today.getDate() - (streak * 7));
            } else if (habit.frequency === 'mensual') {
                expectedDate.setMonth(today.getMonth() - streak);
            }

            if (completionDate.toDateString() === expectedDate.toDateString()) {
                streak++;
            } else {
                break;
            }
        }

        habit.streak = streak;
    }

    // Obtener texto de estadísticas
    getStatsText(habit) {
        const totalCompletions = habit.completions.length;
        const streak = habit.streak;
        const daysAgo = Math.floor((new Date() - new Date(habit.createdAt)) / (1000 * 60 * 60 * 24));
        
        let statsText = `Creado hace ${daysAgo} días • ${totalCompletions} completado${totalCompletions !== 1 ? 's' : ''}`;
        
        if (streak > 0) {
            statsText += ` • Racha: ${streak}`;
        }
        
        return statsText;
    }

    // Renderizar lista de hábitos
    renderHabits() {
        const habitsList = document.getElementById('habits-list');
        const noHabits = document.getElementById('no-habits');
        
        if (this.habits.length === 0) {
            habitsList.style.display = 'none';
            noHabits.style.display = 'block';
            return;
        }
        
        habitsList.style.display = 'grid';
        noHabits.style.display = 'none';
        
        habitsList.innerHTML = this.habits.map(habit => {
            const isCompleted = this.isCompletedInCurrentPeriod(habit);
            const statsText = this.getStatsText(habit);
            
            return `
                <div class="habit-card ${isCompleted ? 'completed' : ''}" data-habit-id="${habit.id}">
                    <div class="habit-header">
                        <h3 class="habit-name">${habit.name}</h3>
                        <span class="frequency-badge">${habit.frequency}</span>
                    </div>
                    <div class="habit-stats">${statsText}</div>
                    <div class="habit-actions">
                        <button class="btn btn-complete" onclick="habitTracker.completeHabit('${habit.id}')">
                            <i class="fas ${isCompleted ? 'fa-undo' : 'fa-check'}"></i>
                            ${isCompleted ? 'Desmarcar' : 'Completar'}
                        </button>
                        <button class="btn btn-secondary" onclick="habitTracker.openModal(${JSON.stringify(habit).replace(/"/g, '&quot;')})">
                            <i class="fas fa-edit"></i>
                            Editar
                        </button>
                        <button class="btn btn-danger" onclick="habitTracker.deleteHabit('${habit.id}')">
                            <i class="fas fa-trash"></i>
                            Eliminar
                        </button>
                        <button class="btn btn-secondary" onclick="shareHabit('${habit.name}')" style="flex: none; min-width: 40px;">
                            <i class="fas fa-share"></i>
                        </button>
                    </div>
                </div>
            `;
        }).join('');
    }
}

// Inicializar la aplicación cuando el DOM esté listo
document.addEventListener('DOMContentLoaded', () => {
    window.habitTracker = new HabitTracker();
    
    // Registrar Service Worker para PWA
    if ('serviceWorker' in navigator) {
        window.addEventListener('load', () => {
            navigator.serviceWorker.register('/sw.js')
                .then((registration) => {
                    console.log('✅ Service Worker registrado exitosamente:', registration.scope);
                    
                    // Manejar actualizaciones del Service Worker
                    registration.addEventListener('updatefound', () => {
                        const newWorker = registration.installing;
                        newWorker.addEventListener('statechange', () => {
                            if (newWorker.state === 'installed' && navigator.serviceWorker.controller) {
                                showUpdateNotification();
                            }
                        });
                    });
                })
                .catch((error) => {
                    console.log('❌ Error al registrar Service Worker:', error);
                });
        });
    }
    
    // Manejar instalación de PWA
    handlePWAInstallation();
    
    // Manejar parámetros URL para shortcuts
    handleURLParams();
});

// Función para mostrar notificación de actualización
function showUpdateNotification() {
    if (confirm('¡Hay una nueva versión disponible! ¿Quieres actualizar ahora?')) {
        window.location.reload();
    }
}

// Manejar instalación de PWA
function handlePWAInstallation() {
    let deferredPrompt;
    
    window.addEventListener('beforeinstallprompt', (e) => {
        e.preventDefault();
        deferredPrompt = e;
        showInstallButton();
    });
    
    function showInstallButton() {
        // Crear botón de instalación si no existe
        if (!document.getElementById('install-btn')) {
            const installBtn = document.createElement('button');
            installBtn.id = 'install-btn';
            installBtn.className = 'btn btn-secondary';
            installBtn.innerHTML = '<i class="fas fa-download"></i> Instalar App';
            installBtn.style.marginLeft = '10px';
            
            installBtn.addEventListener('click', async () => {
                if (deferredPrompt) {
                    deferredPrompt.prompt();
                    const { outcome } = await deferredPrompt.userChoice;
                    console.log(`PWA installation outcome: ${outcome}`);
                    deferredPrompt = null;
                    installBtn.style.display = 'none';
                }
            });
            
            document.querySelector('.add-habit-section').appendChild(installBtn);
        }
    }
    
    window.addEventListener('appinstalled', () => {
        console.log('✅ PWA instalada exitosamente');
        const installBtn = document.getElementById('install-btn');
        if (installBtn) {
            installBtn.style.display = 'none';
        }
        
        // Mostrar mensaje de bienvenida
        setTimeout(() => {
            alert('¡Aplicación instalada! Ahora puedes acceder a "Mis Hábitos" desde tu pantalla de inicio.');
        }, 1000);
    });
}

// Manejar parámetros URL para shortcuts
function handleURLParams() {
    const urlParams = new URLSearchParams(window.location.search);
    const action = urlParams.get('action');
    
    if (action === 'add') {
        // Abrir modal para agregar hábito desde shortcut
        setTimeout(() => {
            if (window.habitTracker) {
                window.habitTracker.openModal();
            }
        }, 500);
    }
}

// Funciones auxiliares para PWA

// Detectar si la app está corriendo como PWA
function isPWA() {
    return window.matchMedia('(display-mode: standalone)').matches || 
           window.navigator.standalone === true;
}

// Solicitar permisos de notificación
function requestNotificationPermission() {
    if ('Notification' in window && 'serviceWorker' in navigator) {
        Notification.requestPermission().then((permission) => {
            if (permission === 'granted') {
                console.log('✅ Permisos de notificación concedidos');
                scheduleHabitReminders();
            }
        });
    }
}

// Programar recordatorios (funcionalidad futura)
function scheduleHabitReminders() {
    // Esta función se puede expandir para programar notificaciones
    console.log('📅 Recordatorios de hábitos programados');
}

// Compartir hábito (Web Share API)
function shareHabit(habitName) {
    if (navigator.share) {
        navigator.share({
            title: 'Mis Hábitos',
            text: `¡Estoy trabajando en mi hábito: ${habitName}!`,
            url: window.location.href
        }).then(() => {
            console.log('✅ Hábito compartido exitosamente');
        }).catch((error) => {
            console.log('❌ Error al compartir:', error);
        });
    } else {
        // Fallback para navegadores sin Web Share API
        const text = `¡Estoy trabajando en mi hábito: ${habitName}!\n${window.location.href}`;
        navigator.clipboard.writeText(text).then(() => {
            alert('¡Enlace copiado al portapapeles!');
        });
    }
}

// Función auxiliar para escapar HTML
function escapeHtml(text) {
    const map = {
        '&': '&amp;',
        '<': '&lt;',
        '>': '&gt;',
        '"': '&quot;',
        "'": '&#039;'
    };
    return text.replace(/[&<>"']/g, function(m) { return map[m]; });
}
