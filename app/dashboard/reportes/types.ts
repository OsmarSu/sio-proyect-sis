export type ReportType = 'General' | 'Ventas' | 'Inventario' | 'Clientes' | 'Productos' | 'Personalizado';
export type ReportFormat = 'PDF' | 'Excel';
export type DateRange = 'Hoy' | 'Esta Semana' | 'Este Mes' | 'Este Año';

// Estructura para un reporte guardado
export interface SavedReport {
  id: string;
  title: string;
  type: ReportType;
  // Para reportes personalizados, guardamos qué módulos incluye
  includedModules?: ('Ventas' | 'Inventario' | 'Clientes' | 'Productos')[]; 
  dateRange: DateRange;
  format: ReportFormat;
  generatedAt: string;
  generatedBy: string;
  status: 'Listo' | 'Procesando' | 'Error';
}