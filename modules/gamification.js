// 🎮 MÓDULO DE GAMIFICACIÓN
class GamificationSystem {
    constructor() {
        this.achievements = this.loadAchievements();
        this.initializeAchievements();
    }

    getHabits() {
        return window.habitTracker ? window.habitTracker.habits : [];
    }

    // Definir logros disponibles
    initializeAchievements() {
        this.availableAchievements = {
            // Logros de iniciación
            'first_habit': {
                id: 'first_habit',
                title: '🌱 Primer Paso',
                description: 'Creaste tu primer hábito',
                icon: '🌱',
                points: 10
            },
            'first_completion': {
                id: 'first_completion',
                title: '✅ Primera Victoria',
                description: 'Completaste tu primer hábito',
                icon: '✅',
                points: 20
            },
            
            // Logros de rachas
            'streak_3': {
                id: 'streak_3',
                title: '🔥 En Racha',
                description: 'Mantuviste un hábito por 3 días seguidos',
                icon: '🔥',
                points: 50
            },
            'streak_7': {
                id: 'streak_7',
                title: '⭐ Una Semana',
                description: 'Racha de 7 días en cualquier hábito',
                icon: '⭐',
                points: 100
            },
            'streak_30': {
                id: 'streak_30',
                title: '🏆 Campeón',
                description: 'Racha épica de 30 días',
                icon: '🏆',
                points: 500
            },
            
            // Logros de consistencia
            'perfect_week': {
                id: 'perfect_week',
                title: '💎 Semana Perfecta',
                description: 'Completaste todos tus hábitos diarios por una semana',
                icon: '💎',
                points: 200
            },
            'habit_collector': {
                id: 'habit_collector',
                title: '📚 Coleccionista',
                description: 'Tienes 5 o más hábitos activos',
                icon: '📚',
                points: 150
            },
            
            // Logros especiales
            'early_bird': {
                id: 'early_bird',
                title: '🌅 Madrugador',
                description: 'Completaste un hábito antes de las 8 AM',
                icon: '🌅',
                points: 75
            },
            'night_owl': {
                id: 'night_owl',
                title: '🦉 Búho Nocturno',
                description: 'Completaste un hábito después de las 10 PM',
                icon: '🦉',
                points: 75
            },
            'comeback_kid': {
                id: 'comeback_kid',
                title: '💪 Regreso Triunfal',
                description: 'Retomaste un hábito después de fallar',
                icon: '💪',
                points: 100
            }
        };
    }

    // Cargar logros del localStorage
    loadAchievements() {
        return JSON.parse(localStorage.getItem('achievements') || '[]');
    }

    // Guardar logros
    saveAchievements() {
        localStorage.setItem('achievements', JSON.stringify(this.achievements));
    }

    // Verificar si se desbloqueó un logro
    checkAchievements(habits, habitId = null) {
        const newAchievements = [];
        
        // Verificar cada tipo de logro
        newAchievements.push(...this.checkHabitAchievements(habits));
        newAchievements.push(...this.checkStreakAchievements(habits));
        newAchievements.push(...this.checkConsistencyAchievements(habits));
        newAchievements.push(...this.checkSpecialAchievements(habits, habitId));
        
        // Procesar nuevos logros
        newAchievements.forEach(achievementId => {
            if (!this.hasAchievement(achievementId)) {
                this.unlockAchievement(achievementId);
            }
        });
    }

    // Verificar logros relacionados con hábitos
    checkHabitAchievements(habits) {
        const achievements = [];
        
        // Primer hábito
        if (habits.length >= 1) {
            achievements.push('first_habit');
        }
        
        // Coleccionista
        if (habits.length >= 5) {
            achievements.push('habit_collector');
        }
        
        // Primera finalización
        const hasAnyCompletion = habits.some(habit => 
            habit.completions && habit.completions.length > 0
        );
        if (hasAnyCompletion) {
            achievements.push('first_completion');
        }
        
        return achievements;
    }

    // Verificar logros de rachas
    checkStreakAchievements(habits) {
        const achievements = [];
        
        habits.forEach(habit => {
            const streak = this.calculateHabitStreak(habit);
            
            if (streak >= 3) achievements.push('streak_3');
            if (streak >= 7) achievements.push('streak_7');
            if (streak >= 30) achievements.push('streak_30');
        });
        
        return [...new Set(achievements)]; // Remover duplicados
    }

    // Verificar logros de consistencia
    checkConsistencyAchievements(habits) {
        const achievements = [];
        
        // Semana perfecta
        if (this.hasPerfectWeek(habits)) {
            achievements.push('perfect_week');
        }
        
        return achievements;
    }

    // Verificar logros especiales
    checkSpecialAchievements(habits, habitId) {
        const achievements = [];
        
        if (habitId) {
            const habit = habits.find(h => h.id === habitId);
            if (habit && habit.completions) {
                const lastCompletion = habit.completions[habit.completions.length - 1];
                const completionTime = new Date(lastCompletion);
                const hour = completionTime.getHours();
                
                // Madrugador
                if (hour < 8) {
                    achievements.push('early_bird');
                }
                
                // Búho nocturno
                if (hour >= 22) {
                    achievements.push('night_owl');
                }
                
                // Comeback kid
                if (this.isComeback(habit)) {
                    achievements.push('comeback_kid');
                }
            }
        }
        
        return achievements;
    }

    // Calcular racha de un hábito
    calculateHabitStreak(habit) {
        const completions = habit.completions || [];
        if (completions.length === 0) return 0;

        const sortedDates = completions
            .map(date => new Date(date))
            .sort((a, b) => b - a);

        let streak = 0;
        const now = new Date();
        let expectedDate = new Date(now);
        expectedDate.setHours(0, 0, 0, 0);
        
        for (let completion of sortedDates) {
            const completionDate = new Date(completion);
            completionDate.setHours(0, 0, 0, 0);
            
            const diffDays = Math.floor((expectedDate - completionDate) / (1000 * 60 * 60 * 24));
            
            if (diffDays <= 1) {
                streak++;
                expectedDate = new Date(completionDate.getTime() - 24 * 60 * 60 * 1000);
            } else {
                break;
            }
        }
        
        return streak;
    }

    // Verificar semana perfecta
    hasPerfectWeek(habits) {
        const now = new Date();
        const weekAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
        
        const dailyHabits = habits.filter(h => h.frequency === 'diaria');
        if (dailyHabits.length === 0) return false;
        
        for (let i = 0; i < 7; i++) {
            const checkDate = new Date(weekAgo.getTime() + i * 24 * 60 * 60 * 1000);
            const dateString = checkDate.toDateString();
            
            const allCompleted = dailyHabits.every(habit => {
                return habit.completions && habit.completions.some(completion => 
                    new Date(completion).toDateString() === dateString
                );
            });
            
            if (!allCompleted) return false;
        }
        
        return true;
    }

    // Verificar si es un comeback
    isComeback(habit) {
        const completions = habit.completions || [];
        if (completions.length < 3) return false;
        
        const sortedDates = completions
            .map(date => new Date(date))
            .sort((a, b) => b - a);
        
        // Verificar si hubo un gap de más de 3 días antes de la última completion
        const lastCompletion = sortedDates[0];
        const secondLastCompletion = sortedDates[1];
        
        const daysDiff = Math.floor((lastCompletion - secondLastCompletion) / (1000 * 60 * 60 * 24));
        
        return daysDiff > 3;
    }

    // Verificar si ya tiene un logro
    hasAchievement(achievementId) {
        return this.achievements.some(a => a.id === achievementId);
    }

    // Desbloquear logro
    unlockAchievement(achievementId) {
        const achievement = this.availableAchievements[achievementId];
        if (!achievement) return;
        
        const unlockedAchievement = {
            ...achievement,
            unlockedAt: new Date().toISOString(),
            isNew: true
        };
        
        this.achievements.push(unlockedAchievement);
        this.saveAchievements();
        
        // Mostrar notificación
        if (window.notificationManager) {
            window.notificationManager.showAchievement({
                message: `${achievement.icon} ${achievement.title}: ${achievement.description}`
            });
        }
        
        // Actualizar UI si existe
        this.updateAchievementDisplay();
        
        return unlockedAchievement;
    }

    // Obtener puntos totales
    getTotalPoints() {
        return this.achievements.reduce((total, achievement) => {
            return total + (achievement.points || 0);
        }, 0);
    }

    // Obtener nivel basado en puntos
    getLevel() {
        const points = this.getTotalPoints();
        if (points >= 1000) return { level: 5, title: '🏆 Maestro de Hábitos' };
        if (points >= 500) return { level: 4, title: '⭐ Experto' };
        if (points >= 200) return { level: 3, title: '💪 Veterano' };
        if (points >= 50) return { level: 2, title: '🌱 Principiante' };
        return { level: 1, title: '👶 Novato' };
    }

    // Crear HTML para mostrar logros
    createAchievementHTML() {
        const level = this.getLevel();
        const points = this.getTotalPoints();
        const nextLevelPoints = this.getNextLevelPoints();
        
        return `
            <div class="achievement-panel">
                <div class="level-display">
                    <div class="level-info">
                        <span class="level-title">${level.title}</span>
                        <span class="level-points">${points} puntos</span>
                    </div>
                    <div class="level-progress">
                        <div class="level-bar" style="width: ${this.getLevelProgress()}%"></div>
                    </div>
                </div>
                
                <div class="achievements-grid">
                    ${Object.values(this.availableAchievements).map(achievement => `
                        <div class="achievement-item ${this.hasAchievement(achievement.id) ? 'unlocked' : 'locked'}">
                            <div class="achievement-icon">${achievement.icon}</div>
                            <div class="achievement-info">
                                <div class="achievement-title">${achievement.title}</div>
                                <div class="achievement-description">${achievement.description}</div>
                                <div class="achievement-points">${achievement.points} pts</div>
                            </div>
                        </div>
                    `).join('')}
                </div>
            </div>
        `;
    }

    // Obtener progreso del nivel actual
    getLevelProgress() {
        const points = this.getTotalPoints();
        const levels = [0, 50, 200, 500, 1000];
        const currentLevelIndex = this.getLevel().level - 1;
        
        if (currentLevelIndex >= levels.length - 1) return 100;
        
        const currentLevelPoints = levels[currentLevelIndex];
        const nextLevelPoints = levels[currentLevelIndex + 1];
        const progress = ((points - currentLevelPoints) / (nextLevelPoints - currentLevelPoints)) * 100;
        
        return Math.min(100, Math.max(0, progress));
    }

    // Obtener puntos necesarios para siguiente nivel
    getNextLevelPoints() {
        const levels = [0, 50, 200, 500, 1000];
        const currentLevelIndex = this.getLevel().level - 1;
        
        if (currentLevelIndex >= levels.length - 1) return levels[levels.length - 1];
        return levels[currentLevelIndex + 1];
    }

    // Actualizar display de logros
    updateAchievementDisplay() {
        const achievementPanel = document.querySelector('.achievement-panel');
        if (achievementPanel) {
            const container = achievementPanel.parentNode;
            container.innerHTML = this.createAchievementHTML();
        }
    }

    // Generar mensaje motivacional
    getMotivationalMessage() {
        const messages = [
            "¡Sigue así! Cada pequeño paso cuenta 🌟",
            "La consistencia es la clave del éxito 🔑",
            "¡Estás construyendo un mejor tú! 💪",
            "Los hábitos pequeños crean grandes cambios 🚀",
            "¡Tu futuro yo te lo agradecerá! 🙏",
            "Progreso, no perfección ✨",
            "¡Cada día es una nueva oportunidad! 🌅",
            "¡Estás más cerca de tu meta! 🎯"
        ];
        
        return messages[Math.floor(Math.random() * messages.length)];
    }

    // Método principal para actualizar progreso
    updateProgress(habits) {
        this.checkAchievements(habits);
    }
}

// Exportar para uso global
window.GamificationSystem = GamificationSystem;

// Instancia global
window.gamificationManager = new GameificationManager();
