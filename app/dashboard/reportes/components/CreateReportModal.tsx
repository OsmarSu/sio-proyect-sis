'use client';

import React, { useState } from 'react';
// Importamos los tipos subiendo un nivel (..) ya que estamos dentro de components
import { ReportType, ReportFormat, DateRange, SavedReport } from '../types';
import { X, FileText, FileSpreadsheet } from 'lucide-react';

interface Props {
  isOpen: boolean;
  onClose: () => void;
  onSave: (reportData: Partial<SavedReport>) => void;
}

export default function CreateReportModal({ isOpen, onClose, onSave }: Props) {
  const [title, setTitle] = useState('');
  const [type, setType] = useState<ReportType>('General');
  const [range, setRange] = useState<DateRange>('Este Mes');
  const [format, setFormat] = useState<ReportFormat>('PDF');

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave({
      title: title || `Reporte ${type} - ${range}`,
      type,
      dateRange: range,
      format
    });
    // Limpiar y cerrar
    setTitle('');
    setType('General');
    setRange('Este Mes');
    setFormat('PDF');
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 p-4">
      <div className="bg-white rounded-xl shadow-xl w-full max-w-md">
        <div className="flex justify-between items-center p-6 border-b">
          <h3 className="text-xl font-bold text-gray-800">Generar Nuevo Reporte</h3>
          <button onClick={onClose}><X className="w-6 h-6 text-gray-400" /></button>
        </div>
        
        <form onSubmit={handleSubmit} className="p-6 space-y-5">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Título (Opcional)</label>
            <input 
              type="text" 
              className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-oasis-primary outline-none"
              placeholder="Ej: Cierre Enero"
              value={title}
              onChange={e => setTitle(e.target.value)}
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
             <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Tipo</label>
                <select 
                    className="w-full px-3 py-2 border rounded-lg bg-white outline-none"
                    value={type}
                    onChange={e => setType(e.target.value as ReportType)}
                >
                    <option value="General">General</option>
                    <option value="Ventas">Ventas</option>
                    <option value="Inventario">Inventario</option>
                    <option value="Clientes">Clientes</option>
                    <option value="Productos">Productos</option>
                </select>
             </div>
             <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Rango</label>
                <select 
                    className="w-full px-3 py-2 border rounded-lg bg-white outline-none"
                    value={range}
                    onChange={e => setRange(e.target.value as DateRange)}
                >
                    <option value="Hoy">Hoy</option>
                    <option value="Esta Semana">Semana</option>
                    <option value="Este Mes">Mes</option>
                    <option value="Este Año">Año</option>
                </select>
             </div>
          </div>

          <div>
             <label className="block text-sm font-medium text-gray-700 mb-2">Formato</label>
             <div className="flex gap-4">
                <button
                    type="button"
                    onClick={() => setFormat('PDF')}
                    className={`flex-1 flex items-center justify-center gap-2 p-3 rounded-lg border transition-all ${format === 'PDF' ? 'border-red-500 bg-red-50 text-red-700' : 'border-gray-200 hover:bg-gray-50'}`}
                >
                    <FileText className="w-5 h-5" /> PDF
                </button>
                <button
                    type="button"
                    onClick={() => setFormat('Excel')}
                    className={`flex-1 flex items-center justify-center gap-2 p-3 rounded-lg border transition-all ${format === 'Excel' ? 'border-green-500 bg-green-50 text-green-700' : 'border-gray-200 hover:bg-gray-50'}`}
                >
                    <FileSpreadsheet className="w-5 h-5" /> Excel
                </button>
             </div>
          </div>

          <button type="submit" className="w-full py-3 mt-2 bg-oasis-primary text-white rounded-lg hover:bg-blue-700 font-semibold">
            Generar
          </button>
        </form>
      </div>
    </div>
  );
}