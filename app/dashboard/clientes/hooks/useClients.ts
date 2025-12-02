'use client';

import { useState, useMemo } from 'react';
import { Client, ClientFormData } from '../types';

const DUMMY_CLIENTS: Client[] = [
  {
    id: 'C001',
    name: 'Ana García',
    email: 'ana.garcia@example.com',
    phone: '71234567',
    address: 'Av. Siempre Viva 123, Santa Cruz',
    // loyaltyPoints eliminado
    isActive: true,
    registeredAt: '2023-01-10',
  },
  {
    id: 'C002',
    name: 'Juan Pérez',
    email: 'juan.perez@example.com',
    phone: '78765432',
    address: 'Calle Falsa 456, La Paz',
    // loyaltyPoints eliminado
    isActive: true,
    registeredAt: '2023-03-22',
  },
  {
    id: 'C003',
    name: 'María López',
    email: 'maria.lopez@example.com',
    phone: '60123456',
    address: 'Zona Central, El Alto',
    // loyaltyPoints eliminado
    isActive: false,
    registeredAt: '2023-06-01',
  },
];

export const useClients = () => {
  const [clients, setClients] = useState<Client[]>(DUMMY_CLIENTS);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterActive, setFilterActive] = useState<'all' | 'active' | 'inactive'>('all');

  const filteredClients = useMemo(() => {
    return clients.filter(client => {
      const matchesSearch =
        client.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        client.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
        client.phone.includes(searchTerm);

      const matchesActiveStatus =
        filterActive === 'all' ||
        (filterActive === 'active' && client.isActive) ||
        (filterActive === 'inactive' && !client.isActive);

      return matchesSearch && matchesActiveStatus;
    });
  }, [clients, searchTerm, filterActive]);

  const saveClient = (clientData: ClientFormData & { id?: string; isActive?: boolean }) => {
    if (clientData.id) {
      // Editar
      setClients(prev =>
        prev.map(client =>
          client.id === clientData.id
            ? { ...client, ...clientData } as Client
            : client
        )
      );
    } else {
      // Crear
      const newClient: Client = {
        ...clientData,
        id: `C${Date.now()}`,
        // loyaltyPoints eliminado
        isActive: true,
        registeredAt: new Date().toISOString().split('T')[0],
      };
      setClients(prev => [newClient, ...prev]);
    }
  };

  const deleteClient = (id: string) => {
    if (window.confirm('¿Estás seguro de eliminar este cliente?')) {
      setClients(prev => prev.filter(client => client.id !== id));
    }
  };

  return {
    clients: filteredClients,
    totalClients: clients.length,
    filteredCount: filteredClients.length,
    searchTerm,
    setSearchTerm,
    filterActive,
    setFilterActive,
    saveClient,
    deleteClient,
  };
};