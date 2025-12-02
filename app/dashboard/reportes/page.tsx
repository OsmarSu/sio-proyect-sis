// app/dashboard/reportes/page.tsx
// Este es el componente que se renderiza cuando la URL es exactamente /dashboard/reportes
// Muestra un mensaje para que el usuario seleccione un sub-reporte.
export const dynamic = 'force-dynamic';

export default function ReportesHomePage() {
  return (
    <div className="flex items-center justify-center h-full min-h-[50vh] bg-white rounded-xl shadow-sm border border-gray-200 p-8 text-center">
      <div className="space-y-4">
        <svg className="mx-auto h-16 w-16 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
        </svg>
        <h2 className="text-xl font-bold text-gray-800">Selecciona un tipo de reporte</h2>
        <p className="text-gray-600">Utiliza las opciones de navegación superior para ver tus datos.</p>
      </div>
    </div>
  );
}