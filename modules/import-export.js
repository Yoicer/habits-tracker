// 📥 GESTOR DE IMPORTACIÓN/EXPORTACIÓN
class ImportExportManager {
    constructor() {
        this.init();
    }

    // Inicializar gestor
    init() {
        this.createImportExportUI();
        this.bindEvents();
    }

    // Crear interfaz de importación/exportación
    createImportExportUI() {
        if (document.getElementById('import-export-section')) return;
        
        const section = document.createElement('div');
        section.id = 'import-export-section';
        section.className = 'import-export-section';
        section.innerHTML = `
            <div class="import-export-panel">
                <h3>📥 Gestión de Datos</h3>
                
                <div class="data-actions">
                    <div class="action-group">
                        <h4>💾 Exportar Datos</h4>
                        <p>Descarga una copia de seguridad de todos tus hábitos y progreso</p>
                        <div class="export-options">
                            <button class="btn btn-primary" id="export-json-btn">
                                📄 Exportar JSON
                            </button>
                            <button class="btn btn-secondary" id="export-csv-btn">
                                📊 Exportar CSV
                            </button>
                        </div>
                    </div>
                    
                    <div class="action-group">
                        <h4>📤 Importar Datos</h4>
                        <p>Restaura tus datos desde una copia de seguridad</p>
                        <div class="import-options">
                            <input type="file" id="import-file-input" accept=".json,.csv" style="display: none;">
                            <button class="btn btn-info" id="import-btn">
                                📂 Seleccionar Archivo
                            </button>
                            <button class="btn btn-warning" id="merge-btn" style="display: none;">
                                🔀 Combinar Datos
                            </button>
                        </div>
                        <div class="import-preview" id="import-preview" style="display: none;">
                            <!-- Preview del archivo importado -->
                        </div>
                    </div>
                    
                    <div class="action-group">
                        <h4>🔧 Herramientas</h4>
                        <div class="tools-options">
                            <button class="btn btn-secondary" id="backup-info-btn">
                                ℹ️ Info de Backups
                            </button>
                            <button class="btn btn-warning" id="cleanup-btn">
                                🧹 Limpiar Datos
                            </button>
                            <button class="btn btn-danger" id="reset-btn">
                                🗑️ Resetear Todo
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        `;
        
        // Insertar después del header
        const header = document.querySelector('header');
        header.parentNode.insertBefore(section, header.nextSibling);
    }

    // Vincular eventos
    bindEvents() {
        // Exportar JSON
        document.getElementById('export-json-btn').addEventListener('click', () => {
            this.exportJSON();
        });
        
        // Exportar CSV
        document.getElementById('export-csv-btn').addEventListener('click', () => {
            this.exportCSV();
        });
        
        // Importar archivo
        document.getElementById('import-btn').addEventListener('click', () => {
            document.getElementById('import-file-input').click();
        });
        
        document.getElementById('import-file-input').addEventListener('change', (e) => {
            this.handleFileImport(e.target.files[0]);
        });
        
        // Combinar datos
        document.getElementById('merge-btn').addEventListener('click', () => {
            this.mergeImportedData();
        });
        
        // Herramientas
        document.getElementById('backup-info-btn').addEventListener('click', () => {
            this.showBackupInfo();
        });
        
        document.getElementById('cleanup-btn').addEventListener('click', () => {
            this.cleanupData();
        });
        
        document.getElementById('reset-btn').addEventListener('click', () => {
            this.resetAllData();
        });
    }

    // Exportar datos como JSON
    exportJSON() {
        try {
            const data = window.dataManager ? window.dataManager.exportData() : this.getExportData();
            const blob = new Blob([data], { type: 'application/json' });
            const url = URL.createObjectURL(blob);
            
            const link = document.createElement('a');
            link.href = url;
            link.download = `mis-habitos-backup-${this.getDateString()}.json`;
            link.click();
            
            URL.revokeObjectURL(url);
            
            this.showNotification('✅ Datos exportados exitosamente', 'success');
        } catch (error) {
            console.error('Error exporting JSON:', error);
            this.showNotification('❌ Error al exportar datos', 'error');
        }
    }

    // Exportar datos como CSV
    exportCSV() {
        try {
            const data = this.getHabitsData();
            const csv = this.convertToCSV(data);
            const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
            const url = URL.createObjectURL(blob);
            
            const link = document.createElement('a');
            link.href = url;
            link.download = `mis-habitos-datos-${this.getDateString()}.csv`;
            link.click();
            
            URL.revokeObjectURL(url);
            
            this.showNotification('✅ CSV exportado exitosamente', 'success');
        } catch (error) {
            console.error('Error exporting CSV:', error);
            this.showNotification('❌ Error al exportar CSV', 'error');
        }
    }

    // Obtener datos para exportación
    getExportData() {
        const habits = JSON.parse(localStorage.getItem('habits') || '[]');
        const achievements = JSON.parse(localStorage.getItem('achievements') || '[]');
        const customSettings = JSON.parse(localStorage.getItem('customSettings') || '{}');
        
        return JSON.stringify({
            version: '1.0.0',
            exportDate: new Date().toISOString(),
            appName: 'Mis Hábitos PWA',
            data: {
                habits,
                achievements,
                customSettings,
                metadata: {
                    totalHabits: habits.length,
                    totalCompletions: habits.reduce((total, habit) => 
                        total + (habit.completions ? habit.completions.length : 0), 0
                    ),
                    exportTimestamp: Date.now()
                }
            }
        }, null, 2);
    }

    // Obtener datos de hábitos para CSV
    getHabitsData() {
        const habits = JSON.parse(localStorage.getItem('habits') || '[]');
        const csvData = [];
        
        habits.forEach(habit => {
            const completions = habit.completions || [];
            
            if (completions.length === 0) {
                // Hábito sin completaciones
                csvData.push({
                    habitName: habit.name,
                    frequency: habit.frequency,
                    createdDate: habit.createdAt || '',
                    completionDate: '',
                    category: habit.category || 'Sin categoría',
                    streak: 0
                });
            } else {
                // Una fila por cada completación
                completions.forEach(completion => {
                    csvData.push({
                        habitName: habit.name,
                        frequency: habit.frequency,
                        createdDate: habit.createdAt || '',
                        completionDate: completion,
                        category: habit.category || 'Sin categoría',
                        streak: this.calculateStreakAtDate(habit, completion)
                    });
                });
            }
        });
        
        return csvData;
    }

    // Convertir datos a formato CSV
    convertToCSV(data) {
        if (data.length === 0) return '';
        
        const headers = Object.keys(data[0]);
        const csvHeaders = headers.join(',');
        
        const csvRows = data.map(row => 
            headers.map(header => {
                const value = row[header];
                // Escapar comillas y envolver en comillas si contiene comas
                return typeof value === 'string' && value.includes(',') 
                    ? `"${value.replace(/"/g, '""')}"` 
                    : value;
            }).join(',')
        );
        
        return [csvHeaders, ...csvRows].join('\n');
    }

    // Manejar importación de archivo
    async handleFileImport(file) {
        if (!file) return;
        
        try {
            const text = await this.readFileAsText(file);
            let importedData;
            
            if (file.name.endsWith('.json')) {
                importedData = JSON.parse(text);
                this.validateJSONImport(importedData);
            } else if (file.name.endsWith('.csv')) {
                importedData = this.parseCSV(text);
                this.validateCSVImport(importedData);
            } else {
                throw new Error('Formato de archivo no soportado');
            }
            
            this.showImportPreview(importedData, file.type);
            this.temporaryImportData = importedData;
            
        } catch (error) {
            console.error('Error importing file:', error);
            this.showNotification(`❌ Error al importar: ${error.message}`, 'error');
        }
    }

    // Leer archivo como texto
    readFileAsText(file) {
        return new Promise((resolve, reject) => {
            const reader = new FileReader();
            reader.onload = (e) => resolve(e.target.result);
            reader.onerror = () => reject(new Error('Error leyendo archivo'));
            reader.readAsText(file);
        });
    }

    // Validar importación JSON
    validateJSONImport(data) {
        if (!data.data || !data.data.habits) {
            throw new Error('Estructura de datos JSON inválida');
        }
        
        if (!Array.isArray(data.data.habits)) {
            throw new Error('Los hábitos deben ser un array');
        }
        
        // Validar cada hábito
        data.data.habits.forEach((habit, index) => {
            if (!habit.name || !habit.frequency) {
                throw new Error(`Hábito ${index + 1}: faltan campos requeridos`);
            }
        });
    }

    // Validar importación CSV
    validateCSVImport(data) {
        if (!Array.isArray(data) || data.length === 0) {
            throw new Error('Archivo CSV vacío o inválido');
        }
        
        const requiredFields = ['habitName', 'frequency'];
        const firstRow = data[0];
        
        requiredFields.forEach(field => {
            if (!(field in firstRow)) {
                throw new Error(`Campo requerido faltante: ${field}`);
            }
        });
    }

    // Parsear CSV
    parseCSV(text) {
        const lines = text.split('\n').filter(line => line.trim());
        if (lines.length < 2) return [];
        
        const headers = lines[0].split(',').map(h => h.trim());
        const data = [];
        
        for (let i = 1; i < lines.length; i++) {
            const values = lines[i].split(',').map(v => v.trim());
            const row = {};
            
            headers.forEach((header, index) => {
                row[header] = values[index] || '';
            });
            
            data.push(row);
        }
        
        return data;
    }

    // Mostrar preview de importación
    showImportPreview(data, fileType) {
        const preview = document.getElementById('import-preview');
        const mergeBtn = document.getElementById('merge-btn');
        
        let previewHTML = '<h4>📋 Vista Previa de Importación</h4>';
        
        if (fileType === 'json') {
            const habits = data.data.habits;
            previewHTML += `
                <div class="import-stats">
                    <p><strong>Hábitos a importar:</strong> ${habits.length}</p>
                    <p><strong>Fecha de exportación:</strong> ${new Date(data.exportDate).toLocaleString()}</p>
                </div>
                <div class="habits-preview">
                    <h5>Primeros hábitos:</h5>
                    <ul>
                        ${habits.slice(0, 5).map(habit => 
                            `<li>${habit.name} (${habit.frequency})</li>`
                        ).join('')}
                        ${habits.length > 5 ? `<li>... y ${habits.length - 5} más</li>` : ''}
                    </ul>
                </div>
            `;
        } else {
            const uniqueHabits = [...new Set(data.map(row => row.habitName))];
            previewHTML += `
                <div class="import-stats">
                    <p><strong>Registros CSV:</strong> ${data.length}</p>
                    <p><strong>Hábitos únicos:</strong> ${uniqueHabits.length}</p>
                </div>
                <div class="habits-preview">
                    <h5>Hábitos encontrados:</h5>
                    <ul>
                        ${uniqueHabits.slice(0, 5).map(name => 
                            `<li>${name}</li>`
                        ).join('')}
                        ${uniqueHabits.length > 5 ? `<li>... y ${uniqueHabits.length - 5} más</li>` : ''}
                    </ul>
                </div>
            `;
        }
        
        previewHTML += `
            <div class="import-actions">
                <button class="btn btn-primary" onclick="importExportManager.importData()">
                    ✅ Importar (Reemplazar)
                </button>
                <button class="btn btn-secondary" onclick="importExportManager.mergeData()">
                    🔀 Combinar con Existentes
                </button>
            </div>
        `;
        
        preview.innerHTML = previewHTML;
        preview.style.display = 'block';
        mergeBtn.style.display = 'inline-block';
    }

    // Importar datos (reemplazar)
    importData() {
        if (!this.temporaryImportData) return;
        
        try {
            if (this.temporaryImportData.data && this.temporaryImportData.data.habits) {
                // Importación JSON
                localStorage.setItem('habits', JSON.stringify(this.temporaryImportData.data.habits));
                
                if (this.temporaryImportData.data.achievements) {
                    localStorage.setItem('achievements', JSON.stringify(this.temporaryImportData.data.achievements));
                }
                
                if (this.temporaryImportData.data.customSettings) {
                    localStorage.setItem('customSettings', JSON.stringify(this.temporaryImportData.data.customSettings));
                }
            } else {
                // Importación CSV
                const habits = this.convertCSVToHabits(this.temporaryImportData);
                localStorage.setItem('habits', JSON.stringify(habits));
            }
            
            this.showNotification('✅ Datos importados exitosamente', 'success');
            this.hideImportPreview();
            
            // Recargar página para reflejar cambios
            setTimeout(() => window.location.reload(), 1500);
            
        } catch (error) {
            console.error('Error importing data:', error);
            this.showNotification('❌ Error al importar datos', 'error');
        }
    }

    // Combinar datos importados con existentes
    mergeData() {
        if (!this.temporaryImportData) return;
        
        try {
            const existingHabits = JSON.parse(localStorage.getItem('habits') || '[]');
            let newHabits;
            
            if (this.temporaryImportData.data && this.temporaryImportData.data.habits) {
                newHabits = this.temporaryImportData.data.habits;
            } else {
                newHabits = this.convertCSVToHabits(this.temporaryImportData);
            }
            
            // Combinar hábitos evitando duplicados por nombre
            const mergedHabits = [...existingHabits];
            const existingNames = existingHabits.map(h => h.name.toLowerCase());
            
            newHabits.forEach(habit => {
                if (!existingNames.includes(habit.name.toLowerCase())) {
                    mergedHabits.push({
                        ...habit,
                        id: this.generateId(),
                        createdAt: new Date().toISOString()
                    });
                }
            });
            
            localStorage.setItem('habits', JSON.stringify(mergedHabits));
            
            this.showNotification(`✅ Datos combinados: ${newHabits.length} hábitos procesados`, 'success');
            this.hideImportPreview();
            
            setTimeout(() => window.location.reload(), 1500);
            
        } catch (error) {
            console.error('Error merging data:', error);
            this.showNotification('❌ Error al combinar datos', 'error');
        }
    }

    // Convertir CSV a formato de hábitos
    convertCSVToHabits(csvData) {
        const habitsMap = new Map();
        
        csvData.forEach(row => {
            const habitName = row.habitName || row.habitname || row.name;
            const frequency = row.frequency || row.frecuencia || 'diaria';
            
            if (!habitName) return;
            
            if (!habitsMap.has(habitName)) {
                habitsMap.set(habitName, {
                    id: this.generateId(),
                    name: habitName,
                    frequency: frequency,
                    completions: [],
                    createdAt: row.createdDate || new Date().toISOString(),
                    category: row.category || 'other'
                });
            }
            
            if (row.completionDate) {
                habitsMap.get(habitName).completions.push(row.completionDate);
            }
        });
        
        return Array.from(habitsMap.values());
    }

    // Ocultar preview de importación
    hideImportPreview() {
        const preview = document.getElementById('import-preview');
        const mergeBtn = document.getElementById('merge-btn');
        
        preview.style.display = 'none';
        mergeBtn.style.display = 'none';
        this.temporaryImportData = null;
    }

    // Mostrar información de backups
    showBackupInfo() {
        const stats = window.dataManager ? window.dataManager.getStorageStats() : this.getBasicStats();
        
        this.showNotification(`
            📊 Información de Almacenamiento:<br>
            • Hábitos: ${stats.habitsCount}<br>
            • Tamaño total: ${this.formatBytes(stats.totalSize)}<br>
            • Última modificación: ${new Date(stats.lastModified).toLocaleString()}
        `, 'info', 8000);
    }

    // Limpiar datos antiguos
    cleanupData() {
        if (confirm('¿Limpiar datos antiguos y temporales?')) {
            if (window.dataManager) {
                window.dataManager.cleanup();
            }
            this.showNotification('✅ Datos limpiados', 'success');
        }
    }

    // Resetear todos los datos
    resetAllData() {
        const confirmation = prompt('Escribe "CONFIRMAR" para resetear todos los datos:');
        if (confirmation === 'CONFIRMAR') {
            localStorage.clear();
            this.showNotification('🗑️ Todos los datos han sido eliminados', 'warning');
            setTimeout(() => window.location.reload(), 2000);
        }
    }

    // Utilidades
    getDateString() {
        return new Date().toISOString().split('T')[0];
    }

    generateId() {
        return '_' + Math.random().toString(36).substr(2, 9);
    }

    calculateStreakAtDate(habit, targetDate) {
        // Calcular racha hasta una fecha específica
        const completions = habit.completions || [];
        const target = new Date(targetDate);
        
        let streak = 0;
        const sortedDates = completions
            .map(date => new Date(date))
            .filter(date => date <= target)
            .sort((a, b) => b - a);
        
        let expectedDate = new Date(target);
        for (let completion of sortedDates) {
            const diffDays = Math.floor((expectedDate - completion) / (1000 * 60 * 60 * 24));
            if (diffDays <= 1) {
                streak++;
                expectedDate = new Date(completion.getTime() - 24 * 60 * 60 * 1000);
            } else {
                break;
            }
        }
        
        return streak;
    }

    formatBytes(bytes) {
        if (bytes === 0) return '0 Bytes';
        const k = 1024;
        const sizes = ['Bytes', 'KB', 'MB'];
        const i = Math.floor(Math.log(bytes) / Math.log(k));
        return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
    }

    getBasicStats() {
        const habits = JSON.parse(localStorage.getItem('habits') || '[]');
        return {
            habitsCount: habits.length,
            totalSize: JSON.stringify(habits).length,
            lastModified: new Date().toISOString()
        };
    }

    showNotification(message, type = 'info', duration = 4000) {
        if (window.notificationManager) {
            window.notificationManager.showNotification({
                title: 'Gestión de Datos',
                message: message,
                type: type,
                duration: duration
            });
        } else {
            alert(message);
        }
    }
}

// Instancia global
window.importExportManager = new ImportExportManager();
