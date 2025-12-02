'use client';

import { useState } from 'react';
import { User, Cargo, UserFormData } from '@/types/user';
import UserModal from './user-modal';
import DeleteUserModal from './delete-user-modal';
import Button from '@/components/ui/Button';
import PlusIcon from '@/components/icons/PlusIcon';

interface UsersGridProps {
  initialUsers: User[];
  cargos: Cargo[];
}

export function UsersGrid({ initialUsers, cargos }: UsersGridProps) {
  const [users, setUsers] = useState<User[]>(initialUsers);
  const [filteredUsers, setFilteredUsers] = useState<User[]>(initialUsers);
  const [searchTerm, setSearchTerm] = useState('');
  const [roleFilter, setRoleFilter] = useState<'all' | 'PERSONAL' | 'CLIENTE'>('all');
  const [statusFilter, setStatusFilter] = useState<'all' | 'active' | 'inactive'>('all');
  
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [modalMode, setModalMode] = useState<'create' | 'edit'>('create');

  const handleSearch = (term: string) => {
    setSearchTerm(term);
    filterUsers(term, roleFilter, statusFilter);
  };

  const handleRoleFilter = (role: 'all' | 'PERSONAL' | 'CLIENTE') => {
    setRoleFilter(role);
    filterUsers(searchTerm, role, statusFilter);
  };

  const handleStatusFilter = (status: 'all' | 'active' | 'inactive') => {
    setStatusFilter(status);
    filterUsers(searchTerm, roleFilter, status);
  };

  const filterUsers = (search: string, role: string, status: string) => {
    let filtered = users;

    if (search) {
      filtered = filtered.filter(user =>
        user.nombre.toLowerCase().includes(search.toLowerCase()) ||
        user.apellido.toLowerCase().includes(search.toLowerCase()) ||
        user.email.toLowerCase().includes(search.toLowerCase()) ||
        user.username.toLowerCase().includes(search.toLowerCase())
      );
    }

    if (role !== 'all') {
      filtered = filtered.filter(user => user.role === role);
    }

    if (status !== 'all') {
      filtered = filtered.filter(user => 
        status === 'active' ? user.estado : !user.estado
      );
    }

    setFilteredUsers(filtered);
  };

  const handleCreateUser = () => {
    setSelectedUser(null);
    setModalMode('create');
    setIsModalOpen(true);
  };

  const handleEditUser = (user: User) => {
    setSelectedUser(user);
    setModalMode('edit');
    setIsModalOpen(true);
  };

  const handleDeleteUser = (user: User) => {
    setSelectedUser(user);
    setIsDeleteModalOpen(true);
  };

  const handleUserSaved = (user: User) => {
    if (modalMode === 'create') {
      setUsers([user, ...users]);
      setFilteredUsers([user, ...filteredUsers]);
    } else {
      setUsers(users.map(u => u.id === user.id ? user : u));
      setFilteredUsers(filteredUsers.map(u => u.id === user.id ? user : u));
    }
    setIsModalOpen(false);
  };

  const handleUserDeleted = (userId: number) => {
    setUsers(users.filter(u => u.id !== userId));
    setFilteredUsers(filteredUsers.filter(u => u.id !== userId));
    setIsDeleteModalOpen(false);
  };

  return (
    <>
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        {/* Filtros y Búsqueda */}
        <div className="flex flex-col md:flex-row gap-4 mb-6">
          <div className="flex-1">
            <input
              type="text"
              placeholder="Buscar por nombre, email o usuario..."
              value={searchTerm}
              onChange={(e) => handleSearch(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
            />
          </div>
          
          <select
            value={roleFilter}
            onChange={(e) => handleRoleFilter(e.target.value as any)}
            className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
          >
            <option value="all">Todos los roles</option>
            <option value="PERSONAL">Personal</option>
            <option value="CLIENTE">Cliente</option>
          </select>

          <select
            value={statusFilter}
            onChange={(e) => handleStatusFilter(e.target.value as any)}
            className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
          >
            <option value="all">Todos los estados</option>
            <option value="active">Activos</option>
            <option value="inactive">Inactivos</option>
          </select>

          <Button 
            variant="primary" 
            icon={<PlusIcon className="h-4 w-4" />}
            onClick={handleCreateUser}
            className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white shadow-lg whitespace-nowrap"
          >
            Nuevo Usuario
          </Button>
        </div>

        {/* Tabla de Usuarios */}
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-gray-200">
                <th className="text-left py-3 px-4 text-sm font-semibold text-gray-700">Usuario</th>
                <th className="text-left py-3 px-4 text-sm font-semibold text-gray-700">Nombre Completo</th>
                <th className="text-left py-3 px-4 text-sm font-semibold text-gray-700">Email</th>
                <th className="text-left py-3 px-4 text-sm font-semibold text-gray-700">Teléfono</th>
                <th className="text-left py-3 px-4 text-sm font-semibold text-gray-700">Rol</th>
                <th className="text-left py-3 px-4 text-sm font-semibold text-gray-700">Cargo</th>
                <th className="text-left py-3 px-4 text-sm font-semibold text-gray-700">Estado</th>
                <th className="text-center py-3 px-4 text-sm font-semibold text-gray-700">Acciones</th>
              </tr>
            </thead>
            <tbody>
              {filteredUsers.length === 0 ? (
                <tr>
                  <td colSpan={8} className="text-center py-8 text-gray-500">
                    No se encontraron usuarios
                  </td>
                </tr>
              ) : (
                filteredUsers.map((user) => (
                  <tr key={user.id} className="border-b border-gray-100 hover:bg-gray-50 transition-colors">
                    <td className="py-3 px-4">
                      <span className="font-medium text-gray-900">{user.username}</span>
                    </td>
                    <td className="py-3 px-4">
                      <span className="text-gray-700">{user.nombre} {user.apellido}</span>
                    </td>
                    <td className="py-3 px-4">
                      <span className="text-gray-600">{user.email}</span>
                    </td>
                    <td className="py-3 px-4">
                      <span className="text-gray-600">{user.telefono || '-'}</span>
                    </td>
                    <td className="py-3 px-4">
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                        user.role === 'PERSONAL' 
                          ? 'bg-purple-100 text-purple-700'
                          : 'bg-blue-100 text-blue-700'
                      }`}>
                        {user.role}
                      </span>
                    </td>
                    <td className="py-3 px-4">
                      <span className="text-gray-600">{user.cargo || '-'}</span>
                    </td>
                    <td className="py-3 px-4">
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                        user.estado 
                          ? 'bg-green-100 text-green-700'
                          : 'bg-red-100 text-red-700'
                      }`}>
                        {user.estado ? 'Activo' : 'Inactivo'}
                      </span>
                    </td>
                    <td className="py-3 px-4">
                      <div className="flex items-center justify-center gap-2">
                        <button
                          onClick={() => handleEditUser(user)}
                          className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                          title="Editar usuario"
                        >
                          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                          </svg>
                        </button>
                        <button
                          onClick={() => handleDeleteUser(user)}
                          className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                          title="Eliminar usuario"
                        >
                          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                          </svg>
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* Paginación info */}
        <div className="mt-4 text-sm text-gray-600">
          Mostrando {filteredUsers.length} de {users.length} usuarios
        </div>
      </div>

      {/* Modales */}
      {isModalOpen && (
        <UserModal
          mode={modalMode}
          user={selectedUser}
          cargos={cargos}
          onClose={() => setIsModalOpen(false)}
          onSave={handleUserSaved}
        />
      )}

      {isDeleteModalOpen && selectedUser && (
        <DeleteUserModal
          user={selectedUser}
          onClose={() => setIsDeleteModalOpen(false)}
          onConfirm={handleUserDeleted}
        />
      )}
    </>
  );
}