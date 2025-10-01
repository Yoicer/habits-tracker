// 💾 GESTOR DE DATOS OPTIMIZADO
class DataManager {
    constructor() {
        console.log('🔧 Creando DataManager...');
        this.storageKey = 'habitsData';
        this.version = '1.0.0';
        this.init();
        console.log('✅ DataManager constructor completo');
    }

    // Inicializar gestor de datos
    init() {
        this.migrateOldData();
        this.setupAutoBackup();
    }

    // Estructura de datos optimizada
    getDataStructure() {
        return {
            version: this.version,
            lastModified: new Date().toISOString(),
            user: {
                preferences: {
                    theme: 'light',
                    notifications: true,
                    language: 'es'
                },
                stats: {
                    totalHabits: 0,
                    totalCompletions: 0,
                    longestStreak: 0,
                    joinDate: new Date().toISOString()
                }
            },
            habits: [],
            achievements: [],
            categories: [
                { id: 'health', name: 'Salud', icon: '💊', color: '#4CAF50' },
                { id: 'fitness', name: 'Ejercicio', icon: '💪', color: '#FF9800' },
                { id: 'learning', name: 'Aprendizaje', icon: '📚', color: '#2196F3' },
                { id: 'productivity', name: 'Productividad', icon: '⚡', color: '#9C27B0' },
                { id: 'mindfulness', name: 'Bienestar', icon: '🧘', color: '#00BCD4' },
                { id: 'social', name: 'Social', icon: '👥', color: '#FF5722' },
                { id: 'hobby', name: 'Hobbies', icon: '🎨', color: '#607D8B' },
                { id: 'other', name: 'Otros', icon: '📌', color: '#795548' }
            ],
            backups: []
        };
    }

    // Cargar datos completos
    loadData() {
        try {
            const data = localStorage.getItem(this.storageKey);
            if (!data) {
                return this.getDataStructure();
            }
            
            const parsedData = JSON.parse(data);
            
            // Verificar versión y migrar si es necesario
            if (!parsedData.version || parsedData.version !== this.version) {
                return this.migrateData(parsedData);
            }
            
            return parsedData;
        } catch (error) {
            console.error('Error loading data:', error);
            return this.getDataStructure();
        }
    }

    // Guardar datos completos
    saveData(data) {
        try {
            data.lastModified = new Date().toISOString();
            data.version = this.version;
            
            // Crear backup antes de guardar
            this.createBackup(data);
            
            // Guardar en localStorage
            console.log('💾 Guardando en localStorage...');
            localStorage.setItem(this.storageKey, JSON.stringify(data));
            console.log('✅ Datos guardados exitosamente');
            
            // Verificar integridad
            const verified = this.verifyDataIntegrity();
            console.log(`🔍 Verificación: ${verified ? 'OK' : 'FALLO'}`);
            return verified;
        } catch (error) {
            console.error('Error saving data:', error);
            return false;
        }
    }

    // Migrar datos antiguos al nuevo formato
    migrateOldData() {
        const oldHabits = localStorage.getItem('habits');
        const oldAchievements = localStorage.getItem('achievements');
        
        if (oldHabits || oldAchievements) {
            const newData = this.getDataStructure();
            
            if (oldHabits) {
                try {
                    newData.habits = JSON.parse(oldHabits);
                    newData.user.stats.totalHabits = newData.habits.length;
                } catch (e) {
                    console.error('Error migrating habits:', e);
                }
            }
            
            if (oldAchievements) {
                try {
                    newData.achievements = JSON.parse(oldAchievements);
                } catch (e) {
                    console.error('Error migrating achievements:', e);
                }
            }
            
            this.saveData(newData);
            
            // Limpiar datos antiguos
            localStorage.removeItem('habits');
            localStorage.removeItem('achievements');
            
            console.log('Data migrated successfully');
        }
    }

    // Migrar datos de versión anterior
    migrateData(oldData) {
        const newData = this.getDataStructure();
        
        // Preservar datos existentes
        if (oldData.habits) newData.habits = oldData.habits;
        if (oldData.achievements) newData.achievements = oldData.achievements;
        if (oldData.user) {
            newData.user = { ...newData.user, ...oldData.user };
        }
        
        return newData;
    }

    // Crear backup automático
    createBackup(data) {
        try {
            const backup = {
                timestamp: new Date().toISOString(),
                data: JSON.stringify(data),
                size: JSON.stringify(data).length
            };
            
            // Mantener solo los últimos 5 backups
            let backups = JSON.parse(localStorage.getItem('dataBackups') || '[]');
            backups.unshift(backup);
            backups = backups.slice(0, 5);
            
            localStorage.setItem('dataBackups', JSON.stringify(backups));
        } catch (error) {
            console.error('Error creating backup:', error);
        }
    }

    // Restaurar desde backup
    restoreBackup(backupIndex = 0) {
        try {
            const backups = JSON.parse(localStorage.getItem('dataBackups') || '[]');
            if (backups[backupIndex]) {
                const restoredData = JSON.parse(backups[backupIndex].data);
                localStorage.setItem(this.storageKey, JSON.stringify(restoredData));
                return true;
            }
            return false;
        } catch (error) {
            console.error('Error restoring backup:', error);
            return false;
        }
    }

    // Verificar integridad de datos
    verifyDataIntegrity() {
        try {
            const data = this.loadData();
            
            // Verificaciones básicas
            if (!data.habits || !Array.isArray(data.habits)) return false;
            if (!data.achievements || !Array.isArray(data.achievements)) return false;
            if (!data.user || typeof data.user !== 'object') return false;
            
            // Verificar estructura de hábitos
            for (const habit of data.habits) {
                if (!habit.id || !habit.name || !habit.frequency) return false;
                if (!habit.completions || !Array.isArray(habit.completions)) {
                    habit.completions = [];
                }
            }
            
            return true;
        } catch (error) {
            console.error('Data integrity check failed:', error);
            return false;
        }
    }

    // Configurar backup automático
    setupAutoBackup() {
        // Backup automático cada 10 minutos si hay cambios
        setInterval(() => {
            const data = this.loadData();
            if (data.lastModified) {
                const lastBackup = JSON.parse(localStorage.getItem('dataBackups') || '[]')[0];
                const lastBackupTime = lastBackup ? new Date(lastBackup.timestamp) : new Date(0);
                const lastModified = new Date(data.lastModified);
                
                // Crear backup si han pasado más de 10 minutos desde el último
                if (lastModified - lastBackupTime > 10 * 60 * 1000) {
                    this.createBackup(data);
                }
            }
        }, 10 * 60 * 1000);
    }

    // Obtener estadísticas de almacenamiento
    getStorageStats() {
        const data = JSON.stringify(this.loadData());
        const backups = localStorage.getItem('dataBackups') || '[]';
        
        return {
            totalSize: data.length + backups.length,
            dataSize: data.length,
            backupsSize: backups.length,
            habitsCount: this.loadData().habits.length,
            achievementsCount: this.loadData().achievements.length,
            lastModified: this.loadData().lastModified
        };
    }

    // Limpiar datos antiguos
    cleanup() {
        try {
            // Limpiar backups antiguos (más de 7 días)
            const backups = JSON.parse(localStorage.getItem('dataBackups') || '[]');
            const weekAgo = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000);
            
            const recentBackups = backups.filter(backup => 
                new Date(backup.timestamp) > weekAgo
            );
            
            localStorage.setItem('dataBackups', JSON.stringify(recentBackups));
            
            // Limpiar notificaciones antiguas
            const notifications = Object.keys(localStorage).filter(key => 
                key.startsWith('lastNotified_')
            );
            
            notifications.forEach(key => {
                const timestamp = parseInt(localStorage.getItem(key));
                if (Date.now() - timestamp > 24 * 60 * 60 * 1000) {
                    localStorage.removeItem(key);
                }
            });
            
            return true;
        } catch (error) {
            console.error('Error during cleanup:', error);
            return false;
        }
    }

    // Exportar datos para backup externo
    exportData() {
        const data = this.loadData();
        const exportData = {
            ...data,
            exportDate: new Date().toISOString(),
            exportVersion: this.version
        };
        
        return JSON.stringify(exportData, null, 2);
    }

    // Importar datos desde backup externo
    importData(jsonData) {
        try {
            const importedData = JSON.parse(jsonData);
            
            // Validar estructura básica
            if (!importedData.habits || !Array.isArray(importedData.habits)) {
                throw new Error('Invalid data structure');
            }
            
            // Migrar si es necesario
            const migratedData = this.migrateData(importedData);
            
            // Crear backup antes de importar
            this.createBackup(this.loadData());
            
            // Importar datos
            this.saveData(migratedData);
            
            return { success: true, habitsCount: migratedData.habits.length };
        } catch (error) {
            console.error('Error importing data:', error);
            return { success: false, error: error.message };
        }
    }

    // Resetear todos los datos
    reset() {
        try {
            // Crear backup antes de resetear
            this.createBackup(this.loadData());
            
            // Resetear a estructura inicial
            const freshData = this.getDataStructure();
            this.saveData(freshData);
            
            return true;
        } catch (error) {
            console.error('Error resetting data:', error);
            return false;
        }
    }

    // Método helper para obtener datos específicos
    getData(key) {
        const data = this.loadData();
        if (!data) return null;
        
        // Permitir acceso anidado con notación de punto
        const keys = key.split('.');
        let current = data;
        
        for (const k of keys) {
            if (current && typeof current === 'object' && k in current) {
                current = current[k];
            } else {
                return null;
            }
        }
        
        return current;
    }

    // Método helper para establecer datos específicos
    setData(key, value) {
        try {
            console.log(`📝 DataManager.setData('${key}'):`, value);
            
            const data = this.loadData() || this.getDataStructure();
            console.log('📦 Datos actuales cargados:', data);
            
            // Permitir establecimiento anidado con notación de punto
            const keys = key.split('.');
            const lastKey = keys.pop();
            let current = data;
            
            // Navegar hasta el contenedor padre
            for (const k of keys) {
                if (!current[k] || typeof current[k] !== 'object') {
                    current[k] = {};
                }
                current = current[k];
            }
            
            // Establecer el valor
            current[lastKey] = value;
            console.log(`✅ Valor establecido en ${key}:`, current[lastKey]);
            
            // Actualizar timestamp
            data.lastModified = new Date().toISOString();
            
            // Guardar datos actualizados
            const success = this.saveData(data);
            console.log(`💾 Guardado ${success ? 'exitoso' : 'falló'}`);
            return success;
        } catch (error) {
            console.error('❌ Error setting data:', error);
            return false;
        }
    }

    // Método para actualizar hábitos específicamente
    updateHabits(habits) {
        return this.setData('habits', habits);
    }

    // Método para obtener hábitos específicamente
    getHabits() {
        return this.getData('habits') || [];
    }
}

// Instancia global
console.log('🔧 Inicializando DataManager...');
window.dataManager = new DataManager();
console.log('✅ DataManager inicializado:', window.dataManager);
