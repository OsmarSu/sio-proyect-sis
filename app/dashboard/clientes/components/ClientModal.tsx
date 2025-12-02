// app/dashboard/clientes/components/ClientModal.tsx
'use client';

import React, { useState, useEffect } from 'react';
import { Client, ClientFormData } from '../types';

type ClientModalProps = {
  isOpen: boolean;
  onClose: () => void;
  onSave: (data: ClientFormData & { id?: string }) => void; // Puede recibir ID para edición
  clientToEdit?: Client | null;
};

export default function ClientModal({ isOpen, onClose, onSave, clientToEdit }: ClientModalProps) {
  const [formData, setFormData] = useState<ClientFormData>({
    name: '',
    email: '',
    phone: '',
    address: '',
  });
  const [isActive, setIsActive] = useState(true); // Para clientes existentes
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (isOpen) {
      setError(null);
      if (clientToEdit) {
        setFormData({
          name: clientToEdit.name,
          email: clientToEdit.email,
          phone: clientToEdit.phone,
          address: clientToEdit.address,
        });
        setIsActive(clientToEdit.isActive);
      } else {
        setFormData({ name: '', email: '', phone: '', address: '' });
        setIsActive(true); // Default para nuevo cliente
      }
    }
  }, [isOpen, clientToEdit]);

  if (!isOpen) return null;

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!formData.name || !formData.email || !formData.phone) {
      setError('Nombre, email y teléfono son campos obligatorios.');
      return;
    }
    if (!/\S+@\S+\.\S+/.test(formData.email)) {
      setError('Formato de email inválido.');
      return;
    }

    
    onClose();
  };

  const isEditMode = !!clientToEdit;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 backdrop-blur-sm p-4 overflow-y-auto">
      <div className="bg-white rounded-xl shadow-2xl w-full max-w-lg mx-auto overflow-hidden">
        <div className="bg-gray-50 px-6 py-4 border-b border-gray-100 flex justify-between items-center">
          <h3 className="text-lg font-semibold text-gray-800">
            {isEditMode ? 'Editar Cliente' : 'Registrar Nuevo Cliente'}
          </h3>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600">
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          {error && (
            <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative" role="alert">
              <span className="block sm:inline">{error}</span>
            </div>
          )}

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Nombre Completo <span className="text-red-500">*</span></label>
            <input
              type="text"
              required
              name="name"
              value={formData.name}
              onChange={handleChange}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-oasis-primary outline-none"
              placeholder="Ej: Ana María García"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Correo Electrónico <span className="text-red-500">*</span></label>
            <input
              type="email"
              required
              name="email"
              value={formData.email}
              onChange={handleChange}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-oasis-primary outline-none"
              placeholder="ejemplo@email.com"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Teléfono <span className="text-red-500">*</span></label>
            <input
              type="tel"
              required
              name="phone"
              value={formData.phone}
              onChange={handleChange}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-oasis-primary outline-none"
              placeholder="Ej: 77712345"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Dirección</label>
            <textarea
              name="address"
              rows={2}
              value={formData.address}
              onChange={handleChange}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-oasis-primary outline-none resize-none"
              placeholder="Ej: Calle Principal #123, Zona Centro"
            />
          </div>

          {isEditMode && ( // Solo mostrar el estado activo/inactivo en modo edición
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Estado del Cliente</label>
              <div className="flex gap-4 mt-2">
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="radio"
                    name="isActive"
                    checked={isActive === true}
                    onChange={() => setIsActive(true)}
                    className="text-oasis-success focus:ring-oasis-success"
                  />
                  <span className="text-sm text-gray-700">Activo</span>
                </label>
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="radio"
                    name="isActive"
                    checked={isActive === false}
                    onChange={() => setIsActive(false)}
                    className="text-oasis-danger focus:ring-oasis-danger"
                  />
                  <span className="text-sm text-gray-700">Inactivo</span>
                </label>
              </div>
            </div>
          )}

          <div className="flex justify-end gap-3 pt-4 mt-4 border-t border-gray-100">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
            >
              Cancelar
            </button>
            <button
              type="submit"
              className="px-4 py-2 text-sm font-medium text-white bg-oasis-primary rounded-lg hover:bg-blue-700 transition-colors shadow-sm"
            >
              {isEditMode ? 'Guardar Cambios' : 'Registrar Cliente'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}