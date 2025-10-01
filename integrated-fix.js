// ============================================================================
// SOLUCIÓN INTEGRAL PARA PROBLEMAS DE INTEGRACIÓN
// ============================================================================

// Clase mejorada de HabitTracker que integra todas las funcionalidades
class IntegratedHabitTracker {
    constructor() {
        console.log('🚀 Inicializando IntegratedHabitTracker');
        
        // Inicializar propiedades
        this.habits = [];
        this.editingHabitId = null;
        this.modules = {};
        
        // Cargar datos
        this.loadHabits();
        
        // Inicializar sistemas
        this.initializeModules();
        this.initializeEventListeners();
        
        // Renderizar interfaz
        this.renderHabits();
        this.updateUI();
        
        console.log('✅ IntegratedHabitTracker inicializado correctamente');
    }

    // ========================================================================
    // GESTIÓN DE DATOS INTEGRADA
    // ========================================================================
    
    loadHabits() {
        try {
            // Intentar cargar desde el nuevo sistema de datos
            const dataManager = window.dataManager;
            if (dataManager && typeof dataManager.getData === 'function') {
                console.log('📊 Cargando datos desde DataManager');
                const data = dataManager.getData();
                this.habits = data.habits || [];
            } else {
                // Fallback al localStorage tradicional
                console.log('📁 Cargando datos desde localStorage tradicional');
                const habits = localStorage.getItem('habits');
                this.habits = habits ? JSON.parse(habits) : [];
            }
            
            console.log(`📋 ${this.habits.length} hábitos cargados`);
        } catch (error) {
            console.error('❌ Error cargando hábitos:', error);
            this.habits = [];
        }
    }

    saveHabits() {
        try {
            // Guardar en ambos sistemas para compatibilidad
            localStorage.setItem('habits', JSON.stringify(this.habits));
            
            // Si existe DataManager, también guardar ahí
            const dataManager = window.dataManager;
            if (dataManager && typeof dataManager.setData === 'function') {
                dataManager.setData('habits', this.habits);
                console.log('💾 Datos guardados en DataManager');
            }
            
            console.log('💾 Hábitos guardados correctamente');
        } catch (error) {
            console.error('❌ Error guardando hábitos:', error);
        }
    }

    // ========================================================================
    // INICIALIZACIÓN DE MÓDULOS
    // ========================================================================
    
    initializeModules() {
        // Inicializar módulos disponibles
        const moduleList = [
            'progressDashboard',
            'notificationManager', 
            'gamificationSystem',
            'themeManager',
            'customizationManager',
            'importExportManager'
        ];

        moduleList.forEach(moduleName => {
            if (window[moduleName]) {
                try {
                    this.modules[moduleName] = window[moduleName];
                    console.log(`🔧 Módulo ${moduleName} inicializado`);
                } catch (error) {
                    console.warn(`⚠️ No se pudo inicializar ${moduleName}:`, error);
                }
            }
        });
    }

    // ========================================================================
    // EVENT LISTENERS
    // ========================================================================
    
    initializeEventListeners() {
        // Modal de hábitos
        this.setupModalListeners();
        
        // Navegación
        this.setupNavigationListeners();
        
        // Acciones rápidas
        this.setupQuickActions();
        
        console.log('🎧 Event listeners configurados');
    }

    setupModalListeners() {
        const modal = document.getElementById('habit-modal');
        const addBtn = document.getElementById('add-habit-btn');
        const closeBtn = document.querySelector('.close');
        const cancelBtn = document.getElementById('cancel-btn');
        const form = document.getElementById('habit-form');

        if (addBtn) {
            addBtn.addEventListener('click', () => this.openModal());
        }
        
        if (closeBtn) {
            closeBtn.addEventListener('click', () => this.closeModal());
        }
        
        if (cancelBtn) {
            cancelBtn.addEventListener('click', () => this.closeModal());
        }
        
        if (form) {
            form.addEventListener('submit', (e) => this.handleFormSubmit(e));
        }

        // Cerrar modal al hacer click fuera
        if (modal) {
            window.addEventListener('click', (e) => {
                if (e.target === modal) {
                    this.closeModal();
                }
            });
        }
    }

    setupNavigationListeners() {
        // Botones de navegación
        const navButtons = document.querySelectorAll('.nav-btn');
        navButtons.forEach(btn => {
            btn.addEventListener('click', (e) => {
                this.handleNavigation(e.target.closest('.nav-btn').id);
            });
        });
    }

    setupQuickActions() {
        // Notificaciones
        const notifBtn = document.getElementById('quick-notifications');
        if (notifBtn) {
            notifBtn.addEventListener('click', () => {
                if (this.modules.notificationManager) {
                    this.modules.notificationManager.requestPermission();
                }
            });
        }

        // Backup rápido
        const backupBtn = document.getElementById('quick-backup');
        if (backupBtn) {
            backupBtn.addEventListener('click', () => {
                if (this.modules.importExportManager) {
                    this.modules.importExportManager.exportData();
                }
            });
        }
    }

    // ========================================================================
    // GESTIÓN DE MODAL
    // ========================================================================
    
    openModal(habit = null) {
        const modal = document.getElementById('habit-modal');
        const modalTitle = document.getElementById('modal-title');
        const form = document.getElementById('habit-form');
        
        if (!modal) {
            console.error('❌ Modal no encontrado');
            return;
        }

        if (habit) {
            // Modo edición
            if (modalTitle) modalTitle.textContent = 'Editar Hábito';
            const nameField = document.getElementById('habit-name');
            const frequencyField = document.getElementById('habit-frequency');
            
            if (nameField) nameField.value = habit.name;
            if (frequencyField) frequencyField.value = habit.frequency;
            
            this.editingHabitId = habit.id;
        } else {
            // Modo agregar
            if (modalTitle) modalTitle.textContent = 'Agregar Nuevo Hábito';
            if (form) form.reset();
            this.editingHabitId = null;
        }
        
        modal.style.display = 'block';
        
        // Focus en el campo de nombre
        const nameField = document.getElementById('habit-name');
        if (nameField) {
            setTimeout(() => nameField.focus(), 100);
        }
        
        console.log('📝 Modal abierto:', habit ? 'edición' : 'nuevo');
    }

    closeModal() {
        console.log('🚪 Cerrando modal');
        
        const modal = document.getElementById('habit-modal');
        const form = document.getElementById('habit-form');
        
        if (modal) {
            modal.style.display = 'none';
        }
        
        // Resetear formulario completamente
        if (form) {
            form.reset();
        }
        
        // Limpiar campos específicos por seguridad
        const fields = ['habit-name', 'habit-frequency'];
        fields.forEach(fieldId => {
            const field = document.getElementById(fieldId);
            if (field) field.value = '';
        });
        
        this.editingHabitId = null;
        console.log('✅ Modal cerrado correctamente');
    }

    // ========================================================================
    // GESTIÓN DE HÁBITOS
    // ========================================================================
    
    handleFormSubmit(e) {
        e.preventDefault();
        console.log('📝 Procesando envío de formulario');
        
        const nameField = document.getElementById('habit-name');
        const frequencyField = document.getElementById('habit-frequency');
        
        if (!nameField || !frequencyField) {
            console.error('❌ Campos del formulario no encontrados');
            this.showNotification('Error en el formulario', 'error');
            return;
        }
        
        const name = nameField.value.trim();
        const frequency = frequencyField.value;
        
        console.log('📋 Datos del formulario:', { name, frequency, editing: this.editingHabitId });

        if (!name || !frequency) {
            console.warn('⚠️ Campos incompletos');
            this.showNotification('Por favor completa todos los campos', 'error');
            return;
        }

        try {
            if (this.editingHabitId) {
                console.log('✏️ Editando hábito:', this.editingHabitId);
                this.editHabit(this.editingHabitId, name, frequency);
            } else {
                console.log('➕ Agregando nuevo hábito');
                this.addHabit(name, frequency);
            }
            
            // Cerrar modal después de procesar
            this.closeModal();
            
        } catch (error) {
            console.error('❌ Error procesando formulario:', error);
            this.showNotification('Error al procesar el hábito', 'error');
        }
    }

    addHabit(name, frequency) {
        console.log('➕ Creando nuevo hábito:', { name, frequency });
        
        const habit = {
            id: this.generateId(),
            name: name,
            frequency: frequency,
            createdAt: new Date().toISOString(),
            completions: [],
            streak: 0,
            category: 'general',
            icon: 'fas fa-star',
            color: '#4CAF50'
        };
        
        this.habits.push(habit);
        console.log(`📝 Hábito agregado. Total: ${this.habits.length}`);
        
        // Guardar y actualizar UI
        this.saveHabits();
        this.renderHabits();
        this.updateUI();
        
        // Notificación de éxito
        this.showNotification(`¡Hábito "${name}" agregado exitosamente!`, 'success');
        
        // Actualizar gamificación
        if (this.modules.gamificationSystem) {
            this.modules.gamificationSystem.checkAchievements(this.habits);
        }
        
        console.log('✅ Hábito agregado completamente');
    }

    editHabit(id, name, frequency) {
        console.log('✏️ Editando hábito:', { id, name, frequency });
        
        const habitIndex = this.habits.findIndex(h => h.id === id);
        if (habitIndex === -1) {
            console.error('❌ Hábito no encontrado para editar:', id);
            this.showNotification('Error: Hábito no encontrado', 'error');
            return;
        }

        this.habits[habitIndex].name = name;
        this.habits[habitIndex].frequency = frequency;
        
        this.saveHabits();
        this.renderHabits();
        this.updateUI();
        
        this.showNotification(`Hábito "${name}" actualizado`, 'success');
        console.log('✅ Hábito editado exitosamente');
    }

    deleteHabit(id) {
        const habit = this.habits.find(h => h.id === id);
        if (!habit) return;

        if (confirm(`¿Estás seguro de que quieres eliminar "${habit.name}"?`)) {
            this.habits = this.habits.filter(h => h.id !== id);
            this.saveHabits();
            this.renderHabits();
            this.updateUI();
            
            this.showNotification(`Hábito "${habit.name}" eliminado`, 'info');
        }
    }

    completeHabit(id) {
        const habit = this.habits.find(h => h.id === id);
        if (!habit) return;

        const today = new Date().toDateString();
        const isAlreadyCompleted = this.isCompletedToday(habit);

        if (isAlreadyCompleted) {
            // Desmarcar
            habit.completions = habit.completions.filter(date => 
                new Date(date).toDateString() !== today
            );
        } else {
            // Marcar como completado
            habit.completions.push(new Date().toISOString());
        }

        // Actualizar racha
        this.updateStreak(habit);
        
        this.saveHabits();
        this.renderHabits();
        this.updateUI();

        // Animación de completado
        if (!isAlreadyCompleted) {
            this.showCompletionAnimation(id);
            
            // Verificar logros
            if (this.modules.gamificationSystem) {
                this.modules.gamificationSystem.checkAchievements(this.habits);
            }
        }
    }

    // ========================================================================
    // UTILIDADES
    // ========================================================================
    
    generateId() {
        return '_' + Math.random().toString(36).substr(2, 9) + Date.now().toString(36);
    }

    isCompletedToday(habit) {
        const today = new Date().toDateString();
        return habit.completions.some(date => 
            new Date(date).toDateString() === today
        );
    }

    updateStreak(habit) {
        const sortedCompletions = habit.completions
            .map(date => new Date(date))
            .sort((a, b) => b - a);

        let streak = 0;
        let currentDate = new Date();
        currentDate.setHours(0, 0, 0, 0);

        for (let completion of sortedCompletions) {
            completion.setHours(0, 0, 0, 0);
            
            if (completion.getTime() === currentDate.getTime()) {
                streak++;
                currentDate.setDate(currentDate.getDate() - 1);
            } else if (completion.getTime() < currentDate.getTime()) {
                break;
            }
        }

        habit.streak = streak;
    }

    showCompletionAnimation(habitId) {
        const habitCard = document.querySelector(`[data-habit-id="${habitId}"]`);
        if (habitCard) {
            habitCard.classList.add('completed-animation');
            setTimeout(() => {
                habitCard.classList.remove('completed-animation');
            }, 600);
        }
    }

    // ========================================================================
    // RENDERIZADO Y UI
    // ========================================================================
    
    renderHabits() {
        console.log('🎨 Renderizando hábitos');
        
        const habitList = document.getElementById('habit-list');
        if (!habitList) {
            console.error('❌ Lista de hábitos no encontrada');
            return;
        }

        if (this.habits.length === 0) {
            habitList.innerHTML = `
                <div class="empty-state">
                    <i class="fas fa-plus-circle"></i>
                    <h3>¡Comienza tu primer hábito!</h3>
                    <p>Agrega un hábito para comenzar a construir mejores rutinas</p>
                    <button class="btn btn-primary" onclick="habitTracker.openModal()">
                        <i class="fas fa-plus"></i> Agregar Hábito
                    </button>
                </div>
            `;
            return;
        }

        habitList.innerHTML = this.habits.map(habit => this.renderHabitCard(habit)).join('');
        console.log(`✅ ${this.habits.length} hábitos renderizados`);
    }

    renderHabitCard(habit) {
        const isCompleted = this.isCompletedToday(habit);
        const completedClass = isCompleted ? 'completed' : '';
        
        return `
            <div class="habit-card ${completedClass}" data-habit-id="${habit.id}">
                <div class="habit-header">
                    <div class="habit-info">
                        <i class="${habit.icon || 'fas fa-star'}" style="color: ${habit.color || '#4CAF50'}"></i>
                        <div>
                            <h3>${habit.name}</h3>
                            <span class="habit-frequency">${this.getFrequencyText(habit.frequency)}</span>
                        </div>
                    </div>
                    <div class="habit-actions">
                        <button class="btn-icon edit-btn" onclick="habitTracker.openModal(habitTracker.habits.find(h => h.id === '${habit.id}'))" title="Editar">
                            <i class="fas fa-edit"></i>
                        </button>
                        <button class="btn-icon delete-btn" onclick="habitTracker.deleteHabit('${habit.id}')" title="Eliminar">
                            <i class="fas fa-trash"></i>
                        </button>
                    </div>
                </div>
                
                <div class="habit-body">
                    <div class="habit-stats">
                        <div class="stat">
                            <span class="stat-value">${habit.streak}</span>
                            <span class="stat-label">Racha</span>
                        </div>
                        <div class="stat">
                            <span class="stat-value">${habit.completions.length}</span>
                            <span class="stat-label">Total</span>
                        </div>
                    </div>
                    
                    <button class="complete-btn ${completedClass}" onclick="habitTracker.completeHabit('${habit.id}')">
                        <i class="fas fa-check"></i>
                        ${isCompleted ? 'Completado' : 'Marcar como completado'}
                    </button>
                </div>
            </div>
        `;
    }

    getFrequencyText(frequency) {
        const frequencies = {
            'daily': 'Diario',
            'weekly': 'Semanal', 
            'monthly': 'Mensual'
        };
        return frequencies[frequency] || frequency;
    }

    updateUI() {
        // Actualizar módulos si están disponibles
        if (this.modules.progressDashboard) {
            this.modules.progressDashboard.updateDashboard(this.habits);
        }
        
        console.log('🔄 UI actualizada');
    }

    // ========================================================================
    // NAVEGACIÓN
    // ========================================================================
    
    handleNavigation(buttonId) {
        // Actualizar estado activo
        document.querySelectorAll('.nav-btn').forEach(btn => {
            btn.classList.remove('active');
        });
        document.getElementById(buttonId).classList.add('active');

        // Mostrar/ocultar secciones
        const sections = {
            'dashboard-btn': 'main-dashboard',
            'progress-btn': 'progress-section', 
            'achievements-btn': 'achievements-section',
            'settings-btn': 'settings-section'
        };

        Object.values(sections).forEach(sectionId => {
            const section = document.getElementById(sectionId);
            if (section) {
                section.style.display = 'none';
            }
        });

        const targetSection = document.getElementById(sections[buttonId]);
        if (targetSection) {
            targetSection.style.display = 'block';
            
            // Actualizar contenido según la sección
            if (buttonId === 'progress-btn' && this.modules.progressDashboard) {
                this.modules.progressDashboard.updateDashboard(this.habits);
            }
        }
    }

    // ========================================================================
    // NOTIFICACIONES
    // ========================================================================
    
    showNotification(message, type = 'info') {
        console.log(`📢 Notificación (${type}): ${message}`);
        
        // Crear elemento de notificación
        const notification = document.createElement('div');
        notification.className = `toast toast-${type}`;
        notification.innerHTML = `
            <div class="toast-content">
                <i class="fas fa-${this.getNotificationIcon(type)}"></i>
                <span>${message}</span>
            </div>
        `;
        
        // Agregar al DOM
        document.body.appendChild(notification);
        
        // Mostrar con animación
        setTimeout(() => notification.classList.add('show'), 100);
        
        // Ocultar después de 3 segundos
        setTimeout(() => {
            notification.classList.remove('show');
            setTimeout(() => {
                if (notification.parentNode) {
                    notification.parentNode.removeChild(notification);
                }
            }, 300);
        }, 3000);
    }

    getNotificationIcon(type) {
        const icons = {
            'success': 'check-circle',
            'error': 'exclamation-circle',
            'warning': 'exclamation-triangle',
            'info': 'info-circle'
        };
        return icons[type] || 'info-circle';
    }
}

// ============================================================================
// INICIALIZACIÓN AUTOMÁTICA
// ============================================================================

document.addEventListener('DOMContentLoaded', function() {
    console.log('🌟 DOM cargado, inicializando aplicación integrada...');
    
    // Reemplazar la instancia global
    window.habitTracker = new IntegratedHabitTracker();
    
    console.log('✨ Aplicación de hábitos totalmente integrada y funcional');
});

// ============================================================================
// FUNCIONES DE DIAGNÓSTICO
// ============================================================================

window.diagnosticReport = function() {
    console.log('🔍 === REPORTE DE DIAGNÓSTICO ===');
    console.log('🏠 HabitTracker:', window.habitTracker);
    console.log('📊 Hábitos:', window.habitTracker?.habits?.length || 0);
    console.log('🔧 Módulos:', Object.keys(window.habitTracker?.modules || {}));
    console.log('💾 LocalStorage:', localStorage.getItem('habits'));
    console.log('🎯 DataManager:', window.dataManager);
    console.log('✅ Diagnóstico completado');
};

console.log('📁 integrated-fix.js cargado correctamente');
