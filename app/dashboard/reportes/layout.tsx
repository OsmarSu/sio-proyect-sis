// app/dashboard/reportes/layout.tsx
'use client';

import React, { useState, useEffect, Suspense } from 'react';
import { usePathname, useRouter, useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { TrendingUp, Download, Calendar, Filter } from 'lucide-react';

// Colores de tu paleta como constantes para usar en 'style' donde sea necesario
const COLOR_PRIMARY = '#5556EE';
const COLOR_SECONDARY = '#8150CE';
const COLOR_SUCCESS = '#74AB41';

// Función de traducción para los rangos de fecha (puedes moverla a un utils.ts si lo prefieres)
const translateDateRange = (range: string) => {
    switch (range) {
      case 'today': return 'Hoy';
      case 'week': return 'Esta Semana';
      case 'month': return 'Este Mes';
      case 'year': return 'Este Año';
      case 'custom': return 'Personalizado';
      default: return range;
    }
  };


function ReportsLayoutContent({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();
  const searchParams = useSearchParams();

  const [dateRange, setDateRange] = useState(searchParams.get('range') || 'month');
  const [exportFormat, setExportFormat] = useState<'PDF' | 'Excel' | null>(null);
  const [isExporting, setIsExporting] = useState(false);

  const reportTabs = [
    { name: 'General', href: '/dashboard/reportes/general' },
    { name: 'Ventas', href: '/dashboard/reportes/ventas' },
    { name: 'Productos', href: '/dashboard/reportes/productos' },
    { name: 'Inventario', href: '/dashboard/reportes/inventario' },
    { name: 'Clientes', href: '/dashboard/reportes/clientes' },
  ];

  useEffect(() => {
    const params = new URLSearchParams(searchParams);
    if (dateRange) {
      params.set('range', dateRange);
    } else {
      params.delete('range');
    }
    router.push(`${pathname}?${params.toString()}`);
  }, [dateRange, pathname, router, searchParams]);

  const handleExport = async (format: 'PDF' | 'Excel') => {
    setIsExporting(true);
    setExportFormat(format);

    try {
      const reportTypeSegment = pathname.split('/dashboard/reportes/')[1];

      if (!reportTypeSegment || reportTypeSegment === '') {
        alert('Por favor, selecciona un tipo de reporte (Ej: General, Productos) antes de exportar.');
        return;
      }

      const currentParams = new URLSearchParams(searchParams);
      currentParams.set('format', format.toLowerCase());
      currentParams.set('range', dateRange);

      const response = await fetch(`/api/reports/${reportTypeSegment}?${currentParams.toString()}`);

      if (response.ok) {
        const blob = await response.blob();
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `${reportTypeSegment}-reporte-${translateDateRange(dateRange).toLowerCase().replace(/\s/g, '-')}.${format === 'Excel' ? 'xlsx' : format.toLowerCase()}`;
        document.body.appendChild(a);
        a.click();
        a.remove();
        window.URL.revokeObjectURL(url);
        alert('Reporte exportado con éxito!');
      } else {
        const errorText = await response.text();
        alert(`Error al exportar el reporte: ${errorText}`);
      }
    } catch (error) {
      console.error('Error durante la exportación:', error);
      alert('Ocurrió un error inesperado al intentar exportar el reporte.');
    } finally {
      setIsExporting(false);
      setExportFormat(null);
    }
  };

  const isBaseReportPath = pathname === '/dashboard/reportes';

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      {/* Header */}
      <div className="mb-8">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-4">
            <div className="p-4 rounded-2xl" style={{ background: `linear-gradient(to bottom right, ${COLOR_PRIMARY}, ${COLOR_SECONDARY})` }}>
              <TrendingUp className="w-8 h-8 text-white" />
            </div>
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Reportes</h1>
              <p className="text-gray-600">Análisis y estadísticas de la juguetería Oasis</p>
            </div>
          </div>
          <button
            onClick={() => handleExport('PDF')}
            className="px-6 py-3 rounded-lg font-semibold flex items-center gap-2 transition-colors text-white"
            style={{ backgroundColor: COLOR_SUCCESS }}
            disabled={isExporting || isBaseReportPath}
          >
            {isExporting && exportFormat ? `Exportando ${exportFormat}...` : <><Download className="w-5 h-5" /> Exportar Reporte</>}
          </button>
        </div>

        {/* Filtros y sub-navegación (Tabs) */}
        <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-200">
          <div className="flex items-center gap-4 mb-4 flex-wrap">
            <div className="flex items-center gap-2">
              <Calendar className="w-5 h-5 text-gray-500" />
              <span className="font-semibold text-gray-700">Período:</span>
            </div>
            <select
              value={dateRange}
              onChange={(e) => setDateRange(e.target.value)}
              className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-oasis-primary"
            >
              <option value="today">Hoy</option>
              <option value="week">Esta Semana</option>
              <option value="month">Este Mes</option>
              <option value="year">Este Año</option>
              <option value="custom">Personalizado</option>
            </select>

            <div className="flex items-center gap-2 ml-4">
              <Filter className="w-5 h-5 text-gray-500" />
              <span className="font-semibold text-gray-700">Tipo:</span>
            </div>

            <div className="ml-auto flex gap-2">
              <button
                onClick={() => handleExport('PDF')}
                className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 font-semibold text-gray-700"
                disabled={isExporting || isBaseReportPath}
              >
                PDF
              </button>
              <button
                onClick={() => handleExport('Excel')}
                className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 font-semibold text-gray-700"
                disabled={isExporting || isBaseReportPath}
              >
                Excel
              </button>
            </div>
          </div>

          {/* Tabs de Navegación de Reportes */}
          <div className="border-t border-gray-200 pt-4 mt-4">
            <nav className="flex space-x-4">
              {reportTabs.map((tab) => {
                const isActiveTab = pathname === tab.href;
                return (
                  <Link
                    key={tab.name}
                    href={`${tab.href}?${searchParams.toString()}`}
                    className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                      isActiveTab
                        ? 'text-white bg-oasis-primary'
                        : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100'
                    }`}
                  >
                    {tab.name}
                  </Link>
                );
              })}
            </nav>
          </div>
        </div>
      </div>

      {/* Contenido del Reporte Específico */}
      <div>
        {children}
      </div>
    </div>
  );
}

export default function ReportsLayout({ children }: { children: React.ReactNode }) {
  return (
    <Suspense fallback={<div>Cargando panel de reportes...</div>}>
      <ReportsLayoutContent>{children}</ReportsLayoutContent>
    </Suspense>
  );
}