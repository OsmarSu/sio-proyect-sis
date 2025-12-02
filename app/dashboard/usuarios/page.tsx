// app/dashboard/usuarios/page.tsx
import { getUsuarios } from '@/actions/get-usuarios';
import { getCargos } from '@/actions/get-cargos';
import { UsersGrid } from '@/components/users/users-grid';

export const dynamic = 'force-dynamic';

export default async function UsuariosPage() {
  const [users, cargos] = await Promise.all([
    getUsuarios(),
    getCargos(),
  ]);

  return (
    <div className="flex flex-col gap-6">
      {/* Header */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-8">
        <div className="flex items-start justify-between">
          <div className="flex items-start gap-4">
            <div className="w-16 h-16 bg-gradient-to-br from-purple-500 to-pink-600 rounded-2xl flex items-center justify-center shadow-lg flex-shrink-0">
              <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
              </svg>
            </div>
            <div>
              <h1 className="text-3xl font-bold text-gray-900 mb-2">Gestión de Usuarios</h1>
              <p className="text-gray-600 text-base">
                Administra usuarios, roles y permisos del sistema
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Users Grid */}
      <UsersGrid
        initialUsers={users}
        cargos={cargos}
      />


    </div>
  );
}