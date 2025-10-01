// 🎨 GESTOR DE PERSONALIZACIÓN
class CustomizationManager {
    constructor() {
        this.init();
    }

    // Inicializar gestor de personalización
    init() {
        this.loadCustomSettings();
        this.createCustomizationPanel();
    }

    // Cargar configuraciones personalizadas
    loadCustomSettings() {
        this.settings = JSON.parse(localStorage.getItem('customSettings') || '{}');
        this.defaultSettings = {
            categories: this.getDefaultCategories(),
            habitIcons: this.getDefaultHabitIcons(),
            colorSchemes: this.getDefaultColorSchemes(),
            sounds: {
                completion: true,
                achievement: true,
                reminder: true
            },
            animations: {
                enabled: true,
                speed: 'normal' // slow, normal, fast
            }
        };
        
        // Fusionar con configuración por defecto
        this.settings = { ...this.defaultSettings, ...this.settings };
    }

    // Obtener categorías por defecto
    getDefaultCategories() {
        return [
            { id: 'health', name: 'Salud', icon: '💊', color: '#4CAF50' },
            { id: 'fitness', name: 'Ejercicio', icon: '💪', color: '#FF9800' },
            { id: 'learning', name: 'Aprendizaje', icon: '📚', color: '#2196F3' },
            { id: 'productivity', name: 'Productividad', icon: '⚡', color: '#9C27B0' },
            { id: 'mindfulness', name: 'Bienestar', icon: '🧘', color: '#00BCD4' },
            { id: 'social', name: 'Social', icon: '👥', color: '#FF5722' },
            { id: 'hobby', name: 'Hobbies', icon: '🎨', color: '#607D8B' },
            { id: 'other', name: 'Otros', icon: '📌', color: '#795548' }
        ];
    }

    // Obtener iconos por defecto para hábitos
    getDefaultHabitIcons() {
        return [
            '💪', '🏃‍♂️', '📚', '💧', '🥗', '🧘', '😴', '🚿',
            '🦷', '💊', '☕', '🎯', '📝', '🎵', '🎨', '📱',
            '💻', '🌱', '🌅', '🌙', '⭐', '🔥', '💎', '🏆',
            '✨', '🎉', '🚀', '💫', '🌈', '☀️', '🌺', '🍀'
        ];
    }

    // Obtener esquemas de color por defecto
    getDefaultColorSchemes() {
        return [
            { name: 'Verde', primary: '#4CAF50', secondary: '#8BC34A' },
            { name: 'Azul', primary: '#2196F3', secondary: '#03A9F4' },
            { name: 'Púrpura', primary: '#9C27B0', secondary: '#E91E63' },
            { name: 'Naranja', primary: '#FF9800', secondary: '#FF5722' },
            { name: 'Turquesa', primary: '#00BCD4', secondary: '#009688' },
            { name: 'Índigo', primary: '#3F51B5', secondary: '#673AB7' }
        ];
    }

    // Crear panel de personalización
    createCustomizationPanel() {
        if (document.getElementById('customization-panel')) return;
        
        const panel = document.createElement('div');
        panel.id = 'customization-panel';
        panel.className = 'customization-panel hidden';
        panel.innerHTML = this.createPanelHTML();
        
        document.body.appendChild(panel);
        this.bindCustomizationEvents();
    }

    // Crear HTML del panel
    createPanelHTML() {
        return `
            <div class="customization-overlay">
                <div class="customization-content">
                    <div class="customization-header">
                        <h2>🎨 Personalización</h2>
                        <button class="close-customization">&times;</button>
                    </div>
                    
                    <div class="customization-tabs">
                        <button class="tab-btn active" data-tab="categories">Categorías</button>
                        <button class="tab-btn" data-tab="icons">Iconos</button>
                        <button class="tab-btn" data-tab="colors">Colores</button>
                        <button class="tab-btn" data-tab="preferences">Preferencias</button>
                    </div>
                    
                    <div class="customization-body">
                        <!-- Categorías -->
                        <div class="tab-content active" id="categories-tab">
                            <h3>Gestionar Categorías</h3>
                            <div class="categories-list" id="categories-list">
                                ${this.renderCategoriesList()}
                            </div>
                            <button class="btn btn-primary" id="add-category-btn">
                                <i class="fas fa-plus"></i> Nueva Categoría
                            </button>
                        </div>
                        
                        <!-- Iconos -->
                        <div class="tab-content" id="icons-tab">
                            <h3>Iconos para Hábitos</h3>
                            <div class="icons-grid">
                                ${this.renderIconsGrid()}
                            </div>
                        </div>
                        
                        <!-- Colores -->
                        <div class="tab-content" id="colors-tab">
                            <h3>Esquemas de Color</h3>
                            <div class="color-schemes">
                                ${this.renderColorSchemes()}
                            </div>
                        </div>
                        
                        <!-- Preferencias -->
                        <div class="tab-content" id="preferences-tab">
                            <h3>Preferencias</h3>
                            <div class="preferences-list">
                                ${this.renderPreferences()}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        `;
    }

    // Renderizar lista de categorías
    renderCategoriesList() {
        return this.settings.categories.map(category => `
            <div class="category-item" data-id="${category.id}">
                <span class="category-icon">${category.icon}</span>
                <span class="category-name">${category.name}</span>
                <span class="category-color" style="background: ${category.color}"></span>
                <div class="category-actions">
                    <button class="btn-icon edit-category" data-id="${category.id}">✏️</button>
                    <button class="btn-icon delete-category" data-id="${category.id}">🗑️</button>
                </div>
            </div>
        `).join('');
    }

    // Renderizar grid de iconos
    renderIconsGrid() {
        return this.settings.habitIcons.map(icon => `
            <div class="icon-item" data-icon="${icon}">${icon}</div>
        `).join('');
    }

    // Renderizar esquemas de color
    renderColorSchemes() {
        return this.settings.colorSchemes.map((scheme, index) => `
            <div class="color-scheme" data-index="${index}">
                <div class="scheme-preview">
                    <div class="color-primary" style="background: ${scheme.primary}"></div>
                    <div class="color-secondary" style="background: ${scheme.secondary}"></div>
                </div>
                <span class="scheme-name">${scheme.name}</span>
            </div>
        `).join('');
    }

    // Renderizar preferencias
    renderPreferences() {
        return `
            <div class="preference-item">
                <label>
                    <input type="checkbox" ${this.settings.sounds.completion ? 'checked' : ''} 
                           id="sound-completion"> 
                    Sonido al completar hábito
                </label>
            </div>
            
            <div class="preference-item">
                <label>
                    <input type="checkbox" ${this.settings.sounds.achievement ? 'checked' : ''} 
                           id="sound-achievement"> 
                    Sonido de logros
                </label>
            </div>
            
            <div class="preference-item">
                <label>
                    <input type="checkbox" ${this.settings.animations.enabled ? 'checked' : ''} 
                           id="animations-enabled"> 
                    Animaciones habilitadas
                </label>
            </div>
            
            <div class="preference-item">
                <label for="animation-speed">Velocidad de animaciones:</label>
                <select id="animation-speed">
                    <option value="slow" ${this.settings.animations.speed === 'slow' ? 'selected' : ''}>Lenta</option>
                    <option value="normal" ${this.settings.animations.speed === 'normal' ? 'selected' : ''}>Normal</option>
                    <option value="fast" ${this.settings.animations.speed === 'fast' ? 'selected' : ''}>Rápida</option>
                </select>
            </div>
        `;
    }

    // Vincular eventos del panel
    bindCustomizationEvents() {
        const panel = document.getElementById('customization-panel');
        
        // Tabs
        panel.querySelectorAll('.tab-btn').forEach(btn => {
            btn.addEventListener('click', (e) => {
                const tabId = e.target.dataset.tab;
                this.switchTab(tabId);
            });
        });
        
        // Cerrar panel
        panel.querySelector('.close-customization').addEventListener('click', () => {
            this.hideCustomizationPanel();
        });
        
        // Agregar categoría
        panel.querySelector('#add-category-btn').addEventListener('click', () => {
            this.showAddCategoryModal();
        });
        
        // Otros eventos
        this.bindCategoryEvents();
        this.bindPreferenceEvents();
    }

    // Vincular eventos de categorías
    bindCategoryEvents() {
        const panel = document.getElementById('customization-panel');
        
        panel.addEventListener('click', (e) => {
            if (e.target.classList.contains('edit-category')) {
                const categoryId = e.target.dataset.id;
                this.editCategory(categoryId);
            } else if (e.target.classList.contains('delete-category')) {
                const categoryId = e.target.dataset.id;
                this.deleteCategory(categoryId);
            }
        });
    }

    // Vincular eventos de preferencias
    bindPreferenceEvents() {
        const panel = document.getElementById('customization-panel');
        
        // Sonidos
        panel.querySelector('#sound-completion').addEventListener('change', (e) => {
            this.settings.sounds.completion = e.target.checked;
            this.saveSettings();
        });
        
        panel.querySelector('#sound-achievement').addEventListener('change', (e) => {
            this.settings.sounds.achievement = e.target.checked;
            this.saveSettings();
        });
        
        // Animaciones
        panel.querySelector('#animations-enabled').addEventListener('change', (e) => {
            this.settings.animations.enabled = e.target.checked;
            this.applyAnimationSettings();
            this.saveSettings();
        });
        
        panel.querySelector('#animation-speed').addEventListener('change', (e) => {
            this.settings.animations.speed = e.target.value;
            this.applyAnimationSettings();
            this.saveSettings();
        });
    }

    // Cambiar tab
    switchTab(tabId) {
        // Actualizar botones
        document.querySelectorAll('.tab-btn').forEach(btn => {
            btn.classList.toggle('active', btn.dataset.tab === tabId);
        });
        
        // Actualizar contenido
        document.querySelectorAll('.tab-content').forEach(content => {
            content.classList.toggle('active', content.id === `${tabId}-tab`);
        });
    }

    // Mostrar panel de personalización
    showCustomizationPanel() {
        const panel = document.getElementById('customization-panel');
        panel.classList.remove('hidden');
        document.body.style.overflow = 'hidden';
    }

    // Ocultar panel de personalización
    hideCustomizationPanel() {
        const panel = document.getElementById('customization-panel');
        panel.classList.add('hidden');
        document.body.style.overflow = '';
    }

    // Agregar nueva categoría
    addCategory(name, icon, color) {
        const newCategory = {
            id: `custom_${Date.now()}`,
            name,
            icon,
            color
        };
        
        this.settings.categories.push(newCategory);
        this.saveSettings();
        this.refreshCategoriesList();
        
        return newCategory;
    }

    // Editar categoría
    editCategory(categoryId) {
        const category = this.settings.categories.find(c => c.id === categoryId);
        if (!category) return;
        
        // Mostrar modal de edición (implementar según necesidad)
        this.showEditCategoryModal(category);
    }

    // Eliminar categoría
    deleteCategory(categoryId) {
        if (confirm('¿Eliminar esta categoría?')) {
            this.settings.categories = this.settings.categories.filter(c => c.id !== categoryId);
            this.saveSettings();
            this.refreshCategoriesList();
        }
    }

    // Refrescar lista de categorías
    refreshCategoriesList() {
        const list = document.getElementById('categories-list');
        list.innerHTML = this.renderCategoriesList();
        this.bindCategoryEvents();
    }

    // Aplicar configuración de animaciones
    applyAnimationSettings() {
        const root = document.documentElement;
        
        if (this.settings.animations.enabled) {
            root.style.setProperty('--animation-duration', 
                this.settings.animations.speed === 'slow' ? '0.8s' :
                this.settings.animations.speed === 'fast' ? '0.2s' : '0.4s'
            );
        } else {
            root.style.setProperty('--animation-duration', '0s');
        }
    }

    // Guardar configuraciones
    saveSettings() {
        localStorage.setItem('customSettings', JSON.stringify(this.settings));
    }

    // Obtener categorías disponibles
    getCategories() {
        return this.settings.categories;
    }

    // Obtener iconos disponibles
    getHabitIcons() {
        return this.settings.habitIcons;
    }

    // Reproducir sonido
    playSound(type) {
        if (!this.settings.sounds[type]) return;
        
        // Crear audio context para sonidos simples
        const audioContext = new (window.AudioContext || window.webkitAudioContext)();
        const oscillator = audioContext.createOscillator();
        const gainNode = audioContext.createGain();
        
        oscillator.connect(gainNode);
        gainNode.connect(audioContext.destination);
        
        // Configurar sonido según tipo
        switch (type) {
            case 'completion':
                oscillator.frequency.value = 800;
                gainNode.gain.setValueAtTime(0.1, audioContext.currentTime);
                gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.3);
                oscillator.start(audioContext.currentTime);
                oscillator.stop(audioContext.currentTime + 0.3);
                break;
                
            case 'achievement':
                // Secuencia de tonos para logro
                [523, 659, 784].forEach((freq, i) => {
                    const osc = audioContext.createOscillator();
                    const gain = audioContext.createGain();
                    osc.connect(gain);
                    gain.connect(audioContext.destination);
                    osc.frequency.value = freq;
                    gain.gain.setValueAtTime(0.1, audioContext.currentTime + i * 0.2);
                    gain.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + i * 0.2 + 0.2);
                    osc.start(audioContext.currentTime + i * 0.2);
                    osc.stop(audioContext.currentTime + i * 0.2 + 0.2);
                });
                break;
        }
    }
}

// Instancia global
window.customizationManager = new CustomizationManager();
