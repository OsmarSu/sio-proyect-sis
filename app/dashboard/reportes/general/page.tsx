'use client';

import React, { useState, useEffect } from 'react';
import { 
  LineChart, Line, PieChart, Pie, Cell, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer 
} from 'recharts';
import { 
  TrendingUp, TrendingDown, DollarSign, Package, Users, ShoppingCart, 
  Plus, Trash2, Download, Layers, Loader2
} from 'lucide-react';
import { useSearchParams } from 'next/navigation';
import CustomReportModal from '../components/CustomReportModal'; 
import { SavedReport } from '../types';

const translateDateRange = (range: string) => {
    switch (range) {
      case 'today': return 'Hoy';
      case 'week': return 'Esta Semana';
      case 'month': return 'Este Mes';
      case 'year': return 'Este Año';
      default: return range;
    }
};

export default function GeneralReportPage() {
    const searchParams = useSearchParams();
    const dateRange = searchParams.get('range') || 'month';

    const [reportData, setReportData] = useState<any>(null);
    const [isLoading, setIsLoading] = useState(true);
    
    const [customReports, setCustomReports] = useState<SavedReport[]>([
        { 
            id: '1', 
            title: 'Cierre Consolidado Enero', 
            type: 'Personalizado', 
            includedModules: ['Ventas', 'Inventario'], 
            dateRange: 'Este Mes', 
            format: 'PDF', 
            generatedAt: '2024-01-31 23:00', 
            generatedBy: 'Admin', 
            status: 'Listo' 
        }
    ]);
    const [isModalOpen, setIsModalOpen] = useState(false);
    // Estado para controlar qué reporte se está descargando (spinner en el botón)
    const [downloadingId, setDownloadingId] = useState<string | null>(null);

    const PRIMARY_COLOR = '#5556EE';
    const SECONDARY_COLOR = '#8150CE';
    const SUCCESS_COLOR = '#74AB41';
    const DANGER_COLOR = '#DE6415';
    const ACCENT_COLOR = '#2EB4D1';
    const PIE_CHART_COLORS = [PRIMARY_COLOR, SECONDARY_COLOR, DANGER_COLOR, SUCCESS_COLOR, ACCENT_COLOR];

    useEffect(() => {
        const fetchReportData = async () => {
            setIsLoading(true);
            try {
                const res = await fetch(`/api/reports/general?range=${dateRange}`);
                if (res.ok) {
                    const data = await res.json();
                    setReportData(data);
                }
            } catch (err) {
                console.error(err);
            } finally {
                setIsLoading(false);
            }
        };
        fetchReportData();
    }, [dateRange]);

    const handleSaveCustomReport = (newReportData: Partial<SavedReport>) => {
        const newReport: SavedReport = {
            id: Math.random().toString(36).substr(2, 9),
            title: newReportData.title!,
            type: 'Personalizado',
            includedModules: newReportData.includedModules,
            dateRange: newReportData.dateRange!,
            format: newReportData.format!,
            generatedAt: new Date().toLocaleString(),
            generatedBy: 'Usuario Actual',
            status: 'Listo'
        };
        setCustomReports([newReport, ...customReports]);
    };

    const handleDeleteReport = (id: string) => {
        if(confirm('¿Eliminar este reporte personalizado?')) {
            setCustomReports(prev => prev.filter(r => r.id !== id));
        }
    };

    // === NUEVA FUNCIÓN DE DESCARGA ===
    const handleDownloadReport = async (report: SavedReport) => {
        setDownloadingId(report.id);
        try {
            const apiRangeMap: Record<string, string> = {
                'Hoy': 'today', 'Esta Semana': 'week', 'Este Mes': 'month', 'Este Año': 'year'
            };
            const params = new URLSearchParams();
            params.set('format', report.format.toLowerCase());
            params.set('range', apiRangeMap[report.dateRange] || 'month');

            const response = await fetch(`/api/reports/general?${params.toString()}`);

            if (response.ok) {
                const blob = await response.blob();
                const url = window.URL.createObjectURL(blob);
                const a = document.createElement('a');
                a.href = url;
                a.download = `${report.title}.${report.format === 'Excel' ? 'xlsx' : 'pdf'}`;
                document.body.appendChild(a);
                a.click();
                a.remove();
                window.URL.revokeObjectURL(url);
            } else {
                alert("Error al descargar el archivo.");
            }
        } catch (error) {
            console.error("Error descarga:", error);
            alert("Ocurrió un error.");
        } finally {
            setDownloadingId(null);
        }
    };

    if (isLoading) return <div className="p-8 text-center text-gray-500">Cargando métricas...</div>;
    if (!reportData) return <div className="p-8 text-center">No hay datos disponibles.</div>;

    return (
        <div className="space-y-10">
            <section>
                <div className="flex items-center justify-between mb-6">
                    <h2 className="text-xl font-bold text-gray-800">Vista Rápida: Métricas Generales</h2>
                    <span className="text-sm text-gray-500 bg-gray-100 px-3 py-1 rounded-full">
                        {translateDateRange(dateRange)}
                    </span>
                </div>
                {/* ... (Métricas y Gráficos iguales, omitidos para brevedad) ... */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                    {reportData.metrics.map((metrica: any, index: number) => (
                        <div key={index} className="bg-white rounded-xl p-5 shadow-sm border border-gray-200">
                            <div className="flex justify-between items-start mb-4">
                                <div className={`p-3 rounded-lg ${metrica.trend === 'up' ? 'bg-green-50 text-green-600' : 'bg-red-50 text-red-600'}`}>
                                    {metrica.titulo.includes('Ventas') ? <DollarSign className="w-6 h-6" /> : 
                                     metrica.titulo.includes('Productos') ? <Package className="w-6 h-6" /> :
                                     metrica.titulo.includes('Clientes') ? <Users className="w-6 h-6" /> : <ShoppingCart className="w-6 h-6" />}
                                </div>
                                <span className={`flex items-center text-sm font-semibold ${metrica.trend === 'up' ? 'text-green-600' : 'text-red-600'}`}>
                                    {metrica.trend === 'up' ? <TrendingUp className="w-4 h-4 mr-1" /> : <TrendingDown className="w-4 h-4 mr-1" />}
                                    {metrica.cambio}
                                </span>
                            </div>
                            <h3 className="text-gray-500 text-sm">{metrica.titulo}</h3>
                            <p className="text-2xl font-bold text-gray-900 mt-1">{metrica.valor}</p>
                        </div>
                    ))}
                </div>
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
                        <h3 className="font-bold text-gray-800 mb-4">Tendencia de Ventas</h3>
                        <ResponsiveContainer width="100%" height={300}>
                            <LineChart data={reportData.ventasMensuales}>
                                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E5E7EB" />
                                <XAxis dataKey="mes" axisLine={false} tickLine={false} tick={{fill: '#6B7280'}} />
                                <YAxis axisLine={false} tickLine={false} tick={{fill: '#6B7280'}} />
                                <Tooltip contentStyle={{borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)'}} />
                                <Line type="monotone" dataKey="ventas" stroke={PRIMARY_COLOR} strokeWidth={3} dot={{r: 4}} activeDot={{r: 6}} />
                            </LineChart>
                        </ResponsiveContainer>
                    </div>
                    <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
                        <h3 className="font-bold text-gray-800 mb-4">Ventas por Categoría</h3>
                        <ResponsiveContainer width="100%" height={300}>
                            <PieChart>
                                <Pie data={reportData.ventasPorCategoria} cx="50%" cy="50%" innerRadius={60} outerRadius={80} paddingAngle={5} dataKey="valor">
                                    {reportData.ventasPorCategoria.map((entry: any, index: number) => (
                                        <Cell key={`cell-${index}`} fill={PIE_CHART_COLORS[index % PIE_CHART_COLORS.length]} />
                                    ))}
                                </Pie>
                                <Tooltip />
                                <Legend verticalAlign="bottom" height={36} iconType="circle" />
                            </PieChart>
                        </ResponsiveContainer>
                    </div>
                </div>
            </section>

            <section className="bg-gray-50 p-6 rounded-2xl border border-dashed border-gray-300">
                <div className="flex flex-col md:flex-row justify-between items-center mb-6 gap-4">
                    <div>
                        <h2 className="text-xl font-bold text-gray-900 flex items-center gap-2">
                            <Layers className="w-6 h-6 text-oasis-primary" />
                            Gestor de Reportes Personalizados
                        </h2>
                        <p className="text-gray-500 text-sm mt-1">Crea reportes combinando módulos (Ej. Ventas + Inventario) y guárdalos aquí.</p>
                    </div>
                    <button 
                        onClick={() => setIsModalOpen(true)}
                        className="bg-gray-900 hover:bg-black text-white px-5 py-2.5 rounded-lg flex items-center gap-2 font-medium shadow-lg shadow-gray-200 transition-all"
                    >
                        <Plus className="w-5 h-5" />
                        Crear Reporte Combinado
                    </button>
                </div>

                <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
                    {customReports.length > 0 ? (
                        <table className="w-full text-left">
                            <thead className="bg-gray-50 border-b border-gray-100 text-gray-500 text-xs uppercase font-semibold">
                                <tr>
                                    <th className="px-6 py-4">Nombre del Reporte</th>
                                    <th className="px-6 py-4">Módulos Incluidos</th>
                                    <th className="px-6 py-4">Rango</th>
                                    <th className="px-6 py-4">Generado</th>
                                    <th className="px-6 py-4 text-right">Acciones</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-100">
                                {customReports.map((report) => (
                                    <tr key={report.id} className="hover:bg-gray-50 transition-colors">
                                        <td className="px-6 py-4">
                                            <div className="font-medium text-gray-900">{report.title}</div>
                                            <div className="text-xs text-gray-400 mt-0.5">{report.format} • {report.generatedBy}</div>
                                        </td>
                                        <td className="px-6 py-4">
                                            <div className="flex gap-1 flex-wrap">
                                                {report.includedModules?.map((mod, idx) => (
                                                    <span key={idx} className="bg-blue-50 text-blue-700 px-2 py-1 rounded text-xs font-medium border border-blue-100">
                                                        {mod}
                                                    </span>
                                                ))}
                                            </div>
                                        </td>
                                        <td className="px-6 py-4 text-sm text-gray-600">{report.dateRange}</td>
                                        <td className="px-6 py-4 text-sm text-gray-500">{report.generatedAt}</td>
                                        <td className="px-6 py-4 text-right">
                                            <div className="flex justify-end gap-2">
                                                {/* BOTÓN DESCARGA FUNCIONAL */}
                                                <button 
                                                    onClick={() => handleDownloadReport(report)}
                                                    disabled={downloadingId === report.id}
                                                    className="p-2 text-green-600 hover:bg-green-50 rounded-lg transition-colors disabled:opacity-50" 
                                                    title="Descargar"
                                                >
                                                    {downloadingId === report.id ? <Loader2 className="w-5 h-5 animate-spin" /> : <Download className="w-5 h-5" />}
                                                </button>
                                                <button onClick={() => handleDeleteReport(report.id)} className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors" title="Eliminar">
                                                    <Trash2 className="w-5 h-5" />
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    ) : (
                        <div className="p-12 text-center text-gray-400">
                            <Layers className="w-12 h-12 mx-auto mb-3 opacity-20" />
                            <p>No tienes reportes personalizados guardados aún.</p>
                        </div>
                    )}
                </div>
            </section>

            <CustomReportModal 
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                onSave={handleSaveCustomReport}
            />
        </div>
    );
}