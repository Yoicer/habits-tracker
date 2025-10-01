// 📊 MÓDULO DE PROGRESO VISUAL
class ProgressDashboard {
    constructor() {
        // Se conectará automáticamente con el habitTracker global
    }

    getHabits() {
        return window.habitTracker ? window.habitTracker.habits : [];
    }

    // Crear HTML del dashboard
    createDashboardHTML() {
        return `
            <div class="progress-dashboard">
                <h2 class="dashboard-title">📊 Mi Progreso</h2>
                
                <!-- Estadísticas Generales -->
                <div class="stats-grid" id="stats-grid">
                    <!-- Se llenarán dinámicamente -->
                </div>
                
                <!-- Barras de Progreso por Hábito -->
                <div class="progress-section">
                    <h3 style="margin-bottom: 20px; color: #333;">📈 Progreso por Hábito</h3>
                    <div id="progress-bars">
                        <!-- Se llenarán dinámicamente -->
                    </div>
                </div>
                
                <!-- Rachas -->
                <div class="streak-section" id="streak-section">
                    <!-- Se llenarán dinámicamente -->
                </div>
            </div>
        `;
    }

    // Calcular estadísticas
    calculateStats() {
        const habits = this.getHabits();
        const now = new Date();
        
        const stats = {
            total: habits.length,
            completedToday: 0,
            currentStreak: 0,
            longestStreak: 0,
            completionRate: 0
        };

        let totalCompletions = 0;
        let totalPossible = 0;

        habits.forEach(habit => {
            const completions = habit.completions || [];
            
            // Hábitos completados hoy
            const today = now.toDateString();
            const completedToday = completions.some(date => 
                new Date(date).toDateString() === today
            );
            if (completedToday) stats.completedToday++;

            // Calcular rachas y tasa de finalización
            const streak = this.calculateStreak(habit);
            stats.currentStreak += streak.current;
            stats.longestStreak = Math.max(stats.longestStreak, streak.longest);

            // Tasa de finalización (últimos 30 días)
            const thirtyDaysAgo = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
            const recentCompletions = completions.filter(date => 
                new Date(date) >= thirtyDaysAgo
            ).length;
            
            let expectedCompletions = 30;
            if (habit.frequency === 'semanal') expectedCompletions = 4;
            if (habit.frequency === 'mensual') expectedCompletions = 1;
            
            totalCompletions += recentCompletions;
            totalPossible += expectedCompletions;
        });

        if (totalPossible > 0) {
            stats.completionRate = Math.round((totalCompletions / totalPossible) * 100);
        }

        return stats;
    }

    // Calcular racha de un hábito
    calculateStreak(habit) {
        const completions = habit.completions || [];
        if (completions.length === 0) return { current: 0, longest: 0 };

        const sortedDates = completions
            .map(date => new Date(date))
            .sort((a, b) => b - a);

        let currentStreak = 0;
        let longestStreak = 0;
        let tempStreak = 0;

        // Calcular racha actual
        const now = new Date();
        let expectedDate = new Date(now);
        
        for (let i = 0; i < sortedDates.length; i++) {
            const completionDate = sortedDates[i];
            const diffDays = Math.floor((expectedDate - completionDate) / (1000 * 60 * 60 * 24));
            
            if (diffDays <= 1) {
                currentStreak++;
                expectedDate = new Date(completionDate.getTime() - 24 * 60 * 60 * 1000);
            } else {
                break;
            }
        }

        // Calcular racha más larga
        tempStreak = 1;
        for (let i = 1; i < sortedDates.length; i++) {
            const diffDays = Math.floor((sortedDates[i-1] - sortedDates[i]) / (1000 * 60 * 60 * 24));
            if (diffDays <= 1) {
                tempStreak++;
            } else {
                longestStreak = Math.max(longestStreak, tempStreak);
                tempStreak = 1;
            }
        }
        longestStreak = Math.max(longestStreak, tempStreak);

        return { current: currentStreak, longest: longestStreak };
    }

    // Renderizar estadísticas
    renderStats(stats) {
        const statsGrid = document.getElementById('stats-grid');
        
        statsGrid.innerHTML = `
            <div class="stat-card">
                <div class="stat-number">${stats.total}</div>
                <div class="stat-label">Hábitos Activos</div>
            </div>
            
            <div class="stat-card info">
                <div class="stat-number">${stats.completedToday}</div>
                <div class="stat-label">Completados Hoy</div>
            </div>
            
            <div class="stat-card ${stats.completionRate >= 80 ? '' : stats.completionRate >= 60 ? 'warning' : 'danger'}">
                <div class="stat-number">${stats.completionRate}%</div>
                <div class="stat-label">Tasa de Éxito</div>
            </div>
            
            <div class="stat-card info">
                <div class="stat-number">${stats.longestStreak}</div>
                <div class="stat-label">Mejor Racha</div>
            </div>
        `;
    }

    // Renderizar barras de progreso
    renderProgressBars() {
        const progressBars = document.getElementById('progress-bars');
        const habits = this.getHabits();
        
        progressBars.innerHTML = habits.map(habit => {
            const progress = this.calculateHabitProgress(habit);
            return `
                <div class="progress-item">
                    <div class="progress-header">
                        <span class="progress-habit-name">${habit.name}</span>
                        <span class="progress-percentage">${progress}%</span>
                    </div>
                    <div class="progress-bar-container">
                        <div class="progress-bar" style="width: ${progress}%"></div>
                    </div>
                </div>
            `;
        }).join('');
    }

    // Calcular progreso de un hábito (últimos 7 días)
    calculateHabitProgress(habit) {
        const completions = habit.completions || [];
        const now = new Date();
        const sevenDaysAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
        
        const recentCompletions = completions.filter(date => 
            new Date(date) >= sevenDaysAgo
        ).length;
        
        let expectedCompletions = 7;
        if (habit.frequency === 'semanal') expectedCompletions = 1;
        if (habit.frequency === 'mensual') expectedCompletions = 0.25;
        
        return Math.min(100, Math.round((recentCompletions / expectedCompletions) * 100));
    }

    // Renderizar rachas
    renderStreaks() {
        const streakSection = document.getElementById('streak-section');
        const habits = this.getHabits();
        
        const streakData = habits.map(habit => {
            const streak = this.calculateStreak(habit);
            return {
                name: habit.name,
                current: streak.current,
                emoji: this.getStreakEmoji(streak.current)
            };
        }).sort((a, b) => b.current - a.current);

        streakSection.innerHTML = streakData.map(data => `
            <div class="streak-card ${data.current > 0 ? 'active' : ''}">
                <div class="streak-emoji">${data.emoji}</div>
                <div class="streak-number">${data.current}</div>
                <div class="streak-label">${data.name}</div>
            </div>
        `).join('');
    }

    // Obtener emoji según la racha
    getStreakEmoji(streak) {
        if (streak >= 30) return '🏆';
        if (streak >= 14) return '🔥';
        if (streak >= 7) return '⭐';
        if (streak >= 3) return '💪';
        if (streak >= 1) return '✅';
        return '💤';
    }

    // Renderizar todo el dashboard
    render() {
        // Buscar la sección de progreso en el DOM
        const progressSectionContainer = document.getElementById('progress-section');
        
        if (progressSectionContainer) {
            // Crear el dashboard completo
            progressSectionContainer.innerHTML = this.createDashboardHTML();
            
            const stats = this.calculateStats();
            this.renderStats(stats);
            this.renderProgressBars();
            this.renderStreaks();
        } else {
            console.error('❌ Sección de progreso no encontrada');
        }
    }

    // Método para ocultar/mostrar dashboard
    toggle() {
        const dashboard = document.getElementById('progress-dashboard');
        if (dashboard) {
            dashboard.style.display = dashboard.style.display === 'none' ? 'block' : 'none';
        }
    }
}

// Funciones de utilidad para integrar fácilmente
window.ProgressDashboard = ProgressDashboard;
