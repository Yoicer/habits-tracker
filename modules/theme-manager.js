// 🎨 GESTOR DE TEMAS
class ThemeManager {
    constructor() {
        this.currentTheme = localStorage.getItem('theme') || 'light';
        this.init();
    }

    // Inicializar gestor de temas
    init() {
        this.applyTheme(this.currentTheme);
        this.createThemeSelector();
        this.bindEvents();
    }

    // Crear selector de temas
    createThemeSelector() {
        if (document.querySelector('.theme-selector')) return;
        
        const selector = document.createElement('div');
        selector.className = 'theme-selector';
        selector.innerHTML = `
            <button class="theme-btn light ${this.currentTheme === 'light' ? 'active' : ''}" 
                    data-theme="light" title="Tema Claro">☀️</button>
            <button class="theme-btn dark ${this.currentTheme === 'dark' ? 'active' : ''}" 
                    data-theme="dark" title="Tema Oscuro">🌙</button>
            <button class="theme-btn minimal ${this.currentTheme === 'minimal' ? 'active' : ''}" 
                    data-theme="minimal" title="Tema Minimalista">🎨</button>
        `;
        
        document.body.appendChild(selector);
    }

    // Aplicar tema
    applyTheme(theme) {
        document.documentElement.setAttribute('data-theme', theme);
        this.currentTheme = theme;
        localStorage.setItem('theme', theme);
        
        // Actualizar botones activos
        document.querySelectorAll('.theme-btn').forEach(btn => {
            btn.classList.toggle('active', btn.dataset.theme === theme);
        });
    }

    // Vincular eventos
    bindEvents() {
        document.addEventListener('click', (e) => {
            if (e.target.classList.contains('theme-btn')) {
                const theme = e.target.dataset.theme;
                this.applyTheme(theme);
                this.animateThemeChange();
            }
        });
    }

    // Animación de cambio de tema
    animateThemeChange() {
        document.body.style.transition = 'all 0.5s ease';
        setTimeout(() => {
            document.body.style.transition = '';
        }, 500);
    }

    // Alternar entre claro y oscuro
    toggleDarkMode() {
        const newTheme = this.currentTheme === 'dark' ? 'light' : 'dark';
        this.applyTheme(newTheme);
    }

    // Detectar preferencia del sistema
    detectSystemTheme() {
        if (window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches) {
            return 'dark';
        }
        return 'light';
    }

    // Auto-aplicar tema del sistema si no hay preferencia guardada
    autoApplySystemTheme() {
        if (!localStorage.getItem('theme')) {
            const systemTheme = this.detectSystemTheme();
            this.applyTheme(systemTheme);
        }
    }
}

// Instancia global
window.themeManager = new ThemeManager();
