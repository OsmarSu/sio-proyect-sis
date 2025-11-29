'use client';

import { useState, useEffect } from 'react';
import { CompraItem } from '@/app/actions/compra-actions';

type ProductoSimple = {
    id: number;
    nombre: string;
};

type ProveedorSimple = {
    id: number;
    nombre: string;
};

type CompraModalProps = {
    isOpen: boolean;
    onClose: () => void;
    onSave: (proveedorId: number, items: CompraItem[]) => void;
    productos: ProductoSimple[];
    proveedores: ProveedorSimple[];
};

export default function CompraModal({ isOpen, onClose, onSave, productos, proveedores }: CompraModalProps) {
    const [proveedorId, setProveedorId] = useState<number | ''>('');
    const [items, setItems] = useState<CompraItem[]>([]);

    // Estado para nuevo item
    const [selectedProd, setSelectedProd] = useState<number | ''>('');
    const [cantidad, setCantidad] = useState(1);
    const [precio, setPrecio] = useState(0);

    useEffect(() => {
        if (isOpen) {
            setProveedorId('');
            setItems([]);
            setSelectedProd('');
            setCantidad(1);
            setPrecio(0);
        }
    }, [isOpen]);

    if (!isOpen) return null;

    const handleAddItem = () => {
        if (!selectedProd || cantidad <= 0 || precio < 0) return;

        setItems(prev => [
            ...prev,
            { productoId: Number(selectedProd), cantidad, precioUnitario: precio }
        ]);

        // Reset inputs
        setSelectedProd('');
        setCantidad(1);
        setPrecio(0);
    };

    const handleRemoveItem = (index: number) => {
        setItems(prev => prev.filter((_, i) => i !== index));
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (!proveedorId || items.length === 0) return;
        onSave(Number(proveedorId), items);
    };

    const totalEstimado = items.reduce((acc, item) => acc + (item.cantidad * item.precioUnitario), 0);

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 backdrop-blur-sm p-4">
            <div className="bg-white rounded-xl shadow-2xl w-full max-w-2xl overflow-hidden flex flex-col max-h-[90vh]">

                <div className="bg-gray-50 px-6 py-4 border-b border-gray-100 flex justify-between items-center">
                    <h3 className="text-lg font-bold text-gray-800">Registrar Nueva Compra</h3>
                    <button onClick={onClose} className="text-gray-400 hover:text-gray-600">
                        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
                    </button>
                </div>

                <form onSubmit={handleSubmit} className="p-6 space-y-6 overflow-y-auto flex-1">

                    {/* Selección de Proveedor */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Proveedor</label>
                        <select
                            required
                            value={proveedorId}
                            onChange={(e) => setProveedorId(Number(e.target.value))}
                            className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                        >
                            <option value="">Seleccionar Proveedor...</option>
                            {proveedores.map(p => (
                                <option key={p.id} value={p.id}>{p.nombre}</option>
                            ))}
                        </select>
                    </div>

                    {/* Agregar Productos */}
                    <div className="bg-gray-50 p-4 rounded-lg border border-gray-200 space-y-3">
                        <h4 className="text-sm font-semibold text-gray-700">Agregar Producto</h4>
                        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                            <div className="sm:col-span-1">
                                <select
                                    value={selectedProd}
                                    onChange={(e) => setSelectedProd(Number(e.target.value))}
                                    className="w-full px-3 py-2 border rounded text-sm"
                                >
                                    <option value="">Producto...</option>
                                    {productos.map(p => (
                                        <option key={p.id} value={p.id}>{p.nombre}</option>
                                    ))}
                                </select>
                            </div>
                            <div>
                                <input
                                    type="number" min="1" placeholder="Cant."
                                    value={cantidad} onChange={(e) => setCantidad(Number(e.target.value))}
                                    className="w-full px-3 py-2 border rounded text-sm"
                                />
                            </div>
                            <div className="flex gap-2">
                                <input
                                    type="number" min="0" step="0.01" placeholder="Costo Unit."
                                    value={precio} onChange={(e) => setPrecio(Number(e.target.value))}
                                    className="w-full px-3 py-2 border rounded text-sm"
                                />
                                <button
                                    type="button"
                                    onClick={handleAddItem}
                                    className="bg-blue-600 text-white px-3 py-2 rounded hover:bg-blue-700"
                                >
                                    +
                                </button>
                            </div>
                        </div>
                    </div>

                    {/* Lista de Items */}
                    <div className="border rounded-lg overflow-hidden">
                        <table className="min-w-full divide-y divide-gray-200">
                            <thead className="bg-gray-50">
                                <tr>
                                    <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">Producto</th>
                                    <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">Cant.</th>
                                    <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">Costo</th>
                                    <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">Subtotal</th>
                                    <th className="px-4 py-2"></th>
                                </tr>
                            </thead>
                            <tbody className="bg-white divide-y divide-gray-200">
                                {items.length === 0 ? (
                                    <tr><td colSpan={5} className="px-4 py-4 text-center text-sm text-gray-500">Sin items</td></tr>
                                ) : (
                                    items.map((item, idx) => {
                                        const prodName = productos.find(p => p.id === item.productoId)?.nombre || 'Desconocido';
                                        return (
                                            <tr key={idx}>
                                                <td className="px-4 py-2 text-sm text-gray-900">{prodName}</td>
                                                <td className="px-4 py-2 text-sm text-gray-900">{item.cantidad}</td>
                                                <td className="px-4 py-2 text-sm text-gray-900">{item.precioUnitario}</td>
                                                <td className="px-4 py-2 text-sm text-gray-900">{(item.cantidad * item.precioUnitario).toFixed(2)}</td>
                                                <td className="px-4 py-2 text-right">
                                                    <button type="button" onClick={() => handleRemoveItem(idx)} className="text-red-500 hover:text-red-700">
                                                        &times;
                                                    </button>
                                                </td>
                                            </tr>
                                        );
                                    })
                                )}
                            </tbody>
                        </table>
                    </div>

                    <div className="flex justify-end items-center gap-4 pt-2">
                        <span className="text-lg font-bold text-gray-800">Total: {totalEstimado.toFixed(2)}</span>
                    </div>

                    <div className="flex justify-end gap-3 pt-4 border-t border-gray-100">
                        <button type="button" onClick={onClose} className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50">
                            Cancelar
                        </button>
                        <button
                            type="submit"
                            disabled={!proveedorId || items.length === 0}
                            className="px-4 py-2 text-sm font-medium text-white bg-green-600 rounded-lg hover:bg-green-700 shadow-sm disabled:opacity-50"
                        >
                            Registrar Compra
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}
