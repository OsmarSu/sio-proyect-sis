'use client';

import React, { useState } from 'react';
import { X, FileText, FileSpreadsheet, Layers, Loader2, Save } from 'lucide-react';
import { SavedReport, ReportType, DateRange, ReportFormat } from '../types';

interface Props {
  isOpen: boolean;
  onClose: () => void;
  onSave: (report: Partial<SavedReport>) => void;
}

export default function CustomReportModal({ isOpen, onClose, onSave }: Props) {
  const [title, setTitle] = useState('');
  const [range, setRange] = useState<DateRange>('Este Mes');
  const [format, setFormat] = useState<ReportFormat>('PDF');
  const [isGenerating, setIsGenerating] = useState(false);
  
  const [selectedModules, setSelectedModules] = useState<{
    ventas: boolean; inventario: boolean; clientes: boolean; productos: boolean;
  }>({
    ventas: true, inventario: false, clientes: false, productos: false,
  });

  if (!isOpen) return null;

  const toggleModule = (key: keyof typeof selectedModules) => {
    setSelectedModules(prev => ({ ...prev, [key]: !prev[key] }));
  };

  const getFormData = () => {
    const modulesArray = Object.entries(selectedModules)
      .filter(([_, isSelected]) => isSelected)
      .map(([key]) => key.charAt(0).toUpperCase() + key.slice(1));
    return { modulesArray };
  };

  // OPCIÓN 1: Solo Guardar en Tabla
  const handleSaveOnly = (e: React.MouseEvent) => {
    e.preventDefault();
    const { modulesArray } = getFormData();
    
    if (modulesArray.length === 0) { alert("Selecciona al menos un módulo."); return; }

    onSave({
        title: title || `Reporte Combinado - ${range}`,
        type: 'Personalizado',
        includedModules: modulesArray as any[],
        dateRange: range,
        format: format,
        status: 'Listo'
    });
    onClose();
    resetForm();
  };

  // OPCIÓN 2: Generar y Descargar
  const handleGenerateAndDownload = async (e: React.MouseEvent) => {
    e.preventDefault();
    const { modulesArray } = getFormData();
    if (modulesArray.length === 0) { alert("Selecciona al menos un módulo."); return; }

    setIsGenerating(true);

    try {
        const reportTypeSegment = 'general'; 
        const apiRangeMap: Record<string, string> = {
            'Hoy': 'today', 'Esta Semana': 'week', 'Este Mes': 'month', 'Este Año': 'year'
        };
        const params = new URLSearchParams();
        params.set('format', format.toLowerCase());
        params.set('range', apiRangeMap[range] || 'month'); 

        const response = await fetch(`/api/reports/${reportTypeSegment}?${params.toString()}`);

        if (response.ok) {
            const blob = await response.blob();
            const url = window.URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.href = url;
            a.download = `${title || 'Reporte_Consolidado'}.${format === 'Excel' ? 'xlsx' : 'pdf'}`;
            document.body.appendChild(a);
            a.click();
            a.remove();
            window.URL.revokeObjectURL(url);

            onSave({
              title: title || `Reporte Combinado - ${range}`,
              type: 'Personalizado',
              includedModules: modulesArray as any[],
              dateRange: range,
              format: format,
              status: 'Listo'
            });
            onClose();
            resetForm();
        } else {
            alert("Error al generar el archivo.");
        }
    } catch (error) {
        console.error("Error descarga:", error);
    } finally {
        setIsGenerating(false);
    }
  };

  const resetForm = () => {
    setTitle('');
    setRange('Este Mes');
    setSelectedModules({ ventas: true, inventario: false, clientes: false, productos: false });
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 transition-all">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-lg transform transition-all scale-100">
        
        {/* Header */}
        <div className="flex justify-between items-center p-6 border-b border-gray-100">
          <div className="flex items-center gap-3">
            <div className="bg-blue-50 p-2.5 rounded-xl text-blue-600">
                <Layers className="w-6 h-6" />
            </div>
            <div>
                <h3 className="text-xl font-bold text-gray-900">Reporte Personalizado</h3>
                <p className="text-sm text-gray-500">Configura y descarga tu reporte</p>
            </div>
          </div>
          <button onClick={onClose} className="p-2 rounded-full hover:bg-gray-100 text-gray-400 hover:text-gray-600 transition-colors">
            <X className="w-5 h-5" />
          </button>
        </div>
        
        <form className="p-6 space-y-6">
          {/* Título */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-1.5">Título del Reporte</label>
            <input 
              type="text" 
              className="w-full px-4 py-2.5 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-none transition-all text-gray-700 placeholder-gray-400"
              placeholder="Ej: Resumen Ejecutivo Mensual"
              value={title}
              onChange={e => setTitle(e.target.value)}
            />
          </div>

          {/* Módulos */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-3">¿Qué información incluir?</label>
            <div className="grid grid-cols-2 gap-3">
                {[
                    { key: 'ventas', label: 'Ventas' },
                    { key: 'inventario', label: 'Inventario' },
                    { key: 'clientes', label: 'Clientes' },
                    { key: 'productos', label: 'Productos Top' }
                ].map((item) => (
                    <label 
                        key={item.key}
                        className={`flex items-center gap-3 p-3.5 border rounded-xl cursor-pointer transition-all duration-200 ${
                            // @ts-ignore
                            selectedModules[item.key] 
                            ? 'border-blue-500 bg-blue-50/50 shadow-sm' 
                            : 'border-gray-200 hover:border-gray-300 hover:bg-gray-50'
                        }`}
                    >
                        <div className={`w-5 h-5 rounded border flex items-center justify-center transition-colors ${
                            // @ts-ignore
                            selectedModules[item.key] ? 'bg-blue-600 border-blue-600' : 'bg-white border-gray-300'
                        }`}>
                            {/* @ts-ignore */}
                            {selectedModules[item.key] && <svg className="w-3.5 h-3.5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" /></svg>}
                        </div>
                        <input 
                            type="checkbox" 
                            className="hidden"
                            // @ts-ignore
                            checked={selectedModules[item.key]} 
                            // @ts-ignore
                            onChange={() => toggleModule(item.key)} 
                        />
                        <span className={`font-medium ${
                            // @ts-ignore
                            selectedModules[item.key] ? 'text-blue-700' : 'text-gray-600'
                        }`}>{item.label}</span>
                    </label>
                ))}
            </div>
          </div>

          {/* Rango y Formato */}
          <div className="grid grid-cols-2 gap-5">
             <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1.5">Rango de Fecha</label>
                <div className="relative">
                    <select 
                        className="w-full px-4 py-2.5 border border-gray-200 rounded-xl bg-white outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 appearance-none cursor-pointer"
                        value={range}
                        onChange={e => setRange(e.target.value as DateRange)}
                    >
                        <option value="Hoy">Hoy</option>
                        <option value="Esta Semana">Esta Semana</option>
                        <option value="Este Mes">Este Mes</option>
                        <option value="Este Año">Este Año</option>
                    </select>
                    <div className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none text-gray-500">
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" /></svg>
                    </div>
                </div>
             </div>
             <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1.5">Formato</label>
                <div className="flex bg-gray-100 p-1 rounded-xl">
                    <button
                        type="button"
                        onClick={() => setFormat('PDF')}
                        className={`flex-1 flex items-center justify-center gap-2 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${format === 'PDF' ? 'bg-white shadow-sm text-red-600' : 'text-gray-500 hover:text-gray-700'}`}
                    >
                        <FileText className="w-4 h-4" /> PDF
                    </button>
                    <button
                        type="button"
                        onClick={() => setFormat('Excel')}
                        className={`flex-1 flex items-center justify-center gap-2 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${format === 'Excel' ? 'bg-white shadow-sm text-green-600' : 'text-gray-500 hover:text-gray-700'}`}
                    >
                        <FileSpreadsheet className="w-4 h-4" /> XLS
                    </button>
                </div>
             </div>
          </div>

          {/* DOBLE BOTÓN DE ACCIÓN */}
          <div className="flex flex-col gap-3 pt-2">
            <button 
                onClick={handleGenerateAndDownload}
                disabled={isGenerating}
                className={`
                    w-full py-3.5 rounded-xl font-bold text-white text-base
                    shadow-lg shadow-blue-500/20 flex items-center justify-center gap-2 
                    transition-all active:scale-[0.98]
                    ${isGenerating ? 'bg-blue-400 cursor-not-allowed' : 'bg-blue-600 hover:bg-blue-700'}
                `}
            >
                {isGenerating ? (
                    <><Loader2 className="w-5 h-5 animate-spin" /> Generando...</>
                ) : (
                    <>Generar y Descargar</>
                )}
            </button>

            <button 
                onClick={handleSaveOnly}
                disabled={isGenerating}
                className="w-full py-3.5 rounded-xl font-semibold text-gray-700 bg-white border border-gray-200 hover:bg-gray-50 hover:border-gray-300 transition-all active:scale-[0.98] flex items-center justify-center gap-2"
            >
                <Save className="w-4 h-4" />
                Solo Guardar Configuración
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}