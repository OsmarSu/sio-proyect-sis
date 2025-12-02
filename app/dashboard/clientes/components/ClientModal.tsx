'use client';

import React, { useState, useEffect } from 'react';
import { Client, ClientFormData } from '../types';
import { X } from 'lucide-react'; 

type ClientModalProps = {
  isOpen: boolean;
  onClose: () => void;
  onSave: (data: ClientFormData & { id?: string; isActive?: boolean }) => void;
  clientToEdit?: Client | null;
};

export default function ClientModal({ isOpen, onClose, onSave, clientToEdit }: ClientModalProps) {
  const [formData, setFormData] = useState<ClientFormData>({
    name: '', email: '', phone: '', address: '',
  });
  const [isActive, setIsActive] = useState(true);
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
        setIsActive(true);
      }
    }
  }, [isOpen, clientToEdit]);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!formData.name.trim() || !formData.email.trim() || !formData.phone.trim()) {
      setError('Nombre, email y teléfono son obligatorios.');
      return;
    }

    onSave({
      ...formData,
      id: clientToEdit?.id,
      isActive: isActive
    });
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 transition-all">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-lg transform transition-all scale-100">
        <div className="flex justify-between items-center p-6 border-b border-gray-100">
          <h3 className="text-xl font-bold text-gray-900">
            {clientToEdit ? 'Editar Cliente' : 'Nuevo Cliente'}
          </h3>
          <button onClick={onClose} className="p-2 rounded-full hover:bg-gray-100 text-gray-400 hover:text-gray-600 transition-colors">
            <X className="w-6 h-6" />
          </button>
        </div>
        
        <form onSubmit={handleSubmit} className="p-6 space-y-5">
          {error && (
            <div className="bg-red-50 text-red-600 p-3 rounded-lg text-sm border border-red-100 font-medium">
              {error}
            </div>
          )}
          
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-1.5">Nombre Completo</label>
            <input
              required
              type="text"
              className="w-full px-4 py-2.5 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-none transition-all text-gray-700"
              value={formData.name}
              onChange={e => setFormData({...formData, name: e.target.value})}
              placeholder="Ej: Ana García"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
             <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1.5">Email</label>
                <input
                  required
                  type="email"
                  className="w-full px-4 py-2.5 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-none transition-all text-gray-700"
                  value={formData.email}
                  onChange={e => setFormData({...formData, email: e.target.value})}
                  placeholder="ana@ejemplo.com"
                />
             </div>
             <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1.5">Teléfono</label>
                <input
                  required
                  type="text"
                  className="w-full px-4 py-2.5 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-none transition-all text-gray-700"
                  value={formData.phone}
                  onChange={e => setFormData({...formData, phone: e.target.value})}
                  placeholder="77712345"
                />
             </div>
          </div>

          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-1.5">Dirección</label>
            <input
              type="text"
              className="w-full px-4 py-2.5 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-none transition-all text-gray-700"
              value={formData.address}
              onChange={e => setFormData({...formData, address: e.target.value})}
              placeholder="Ej: Av. Principal #123"
            />
          </div>

          {clientToEdit && (
            <div className="flex items-center gap-6 pt-2">
              <label className="flex items-center gap-2 cursor-pointer group">
                <input
                  type="radio"
                  checked={isActive}
                  onChange={() => setIsActive(true)}
                  className="w-4 h-4 text-blue-600 focus:ring-blue-500 border-gray-300"
                />
                <span className="text-sm font-medium text-gray-700 group-hover:text-gray-900">Activo</span>
              </label>
              <label className="flex items-center gap-2 cursor-pointer group">
                <input
                  type="radio"
                  checked={!isActive}
                  onChange={() => setIsActive(false)}
                  className="w-4 h-4 text-blue-600 focus:ring-blue-500 border-gray-300"
                />
                <span className="text-sm font-medium text-gray-700 group-hover:text-gray-900">Inactivo</span>
              </label>
            </div>
          )}

          {/* BOTONES MEJORADOS */}
          <div className="flex gap-3 mt-8 pt-4 border-t border-gray-100">
            <button 
              type="button" 
              onClick={onClose} 
              className="flex-1 py-3.5 border border-gray-200 rounded-xl text-gray-600 font-bold hover:bg-gray-50 hover:border-gray-300 hover:text-gray-800 transition-all"
            >
              Cancelar
            </button>
            <button 
              type="submit" 
              className="flex-1 py-3.5 bg-blue-600 text-white rounded-xl font-bold shadow-lg shadow-blue-500/20 hover:bg-blue-700 hover:shadow-blue-500/30 hover:-translate-y-0.5 transition-all transform active:scale-[0.98]"
            >
              {clientToEdit ? 'Guardar Cambios' : 'Registrar Cliente'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}