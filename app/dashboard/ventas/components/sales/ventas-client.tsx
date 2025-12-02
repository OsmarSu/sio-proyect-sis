'use client';

import { useState, useEffect } from 'react';
import ReceiptModal from "../ReceiptModal"; // Asegúrate de que la ruta sea correcta
import { createSale } from '@/actions/sales-actions'; // Importamos la acción
import { useRouter } from 'next/navigation';

// Tipos adaptados a lo que recibimos del Server Action
type ProductoVenta = {
  id: number;
  nombre: string;
  precio: number;
  stock: number;
  category: string;
  sku: string;
};

type Cliente = {
  id: number;
  nombre: string;
  ci: string;
  tipo: string; // Simplificado a string para flexibilidad
};

type ItemCarrito = ProductoVenta & {
  cantidad: number;
};

interface VentasClientProps {
  initialProducts: ProductoVenta[];
  initialClients: Cliente[];
}

export default function VentasClient({ initialProducts, initialClients }: VentasClientProps) {
  const router = useRouter();
  // Usamos estado local inicializado con las props
  const [productos, setProductos] = useState(initialProducts);
  const [carrito, setCarrito] = useState<ItemCarrito[]>([]);
  const [busqueda, setBusqueda] = useState("");
  const [clienteSeleccionado, setClienteSeleccionado] = useState<Cliente | null>(null);
  const [showReceipt, setShowReceipt] = useState(false);
  const [processing, setProcessing] = useState(false); // Estado de carga

  // Actualizar productos si cambian desde el servidor (revalidación)
  useEffect(() => {
    setProductos(initialProducts);
  }, [initialProducts]);

  const productosFiltrados = productos.filter(
    (p) =>
      p.nombre.toLowerCase().includes(busqueda.toLowerCase()) ||
      p.sku.toLowerCase().includes(busqueda.toLowerCase())
  );

  const getCategoryColor = (category: string) => {
    // Puedes ampliar esto según tus categorías reales
    const map: Record<string, string> = {
      'Juguetes': "border-purple-500 bg-purple-50 text-purple-700",
      'Deportes': "border-orange-500 bg-orange-50 text-orange-700",
      // Default color
    };
    return map[category] || "border-gray-500 bg-gray-50 text-gray-700";
  };

  const agregarAlCarrito = (producto: ProductoVenta) => {
    setCarrito((prev) => {
      const existe = prev.find((item) => item.id === producto.id);
      if (existe) {
        if (existe.cantidad < producto.stock) {
          return prev.map((item) =>
            item.id === producto.id
              ? { ...item, cantidad: item.cantidad + 1 }
              : item
          );
        }
        return prev;
      }
      return [...prev, { ...producto, cantidad: 1 }];
    });
  };

  const cambiarCantidad = (id: number, delta: number) => {
    setCarrito((prev) =>
      prev.map((item) => {
        if (item.id === id) {
          const nuevaCantidad = item.cantidad + delta;
          const productoOriginal = productos.find((p) => p.id === id);
          const stockMaximo = productoOriginal?.stock || 0;
          
          if (nuevaCantidad > stockMaximo) return item;
          return nuevaCantidad > 0 ? { ...item, cantidad: nuevaCantidad } : item;
        }
        return item;
      })
    );
  };

  const eliminarDelCarrito = (id: number) => {
    setCarrito((prev) => prev.filter((item) => item.id !== id));
  };

  const subtotal = carrito.reduce((sum, item) => sum + item.precio * item.cantidad, 0);
  // Lógica simple de descuento VIP (ajustar string 'Vip' según tu DB)
  const descuento = clienteSeleccionado?.tipo.toLowerCase().includes("vip") ? subtotal * 0.1 : 0;
  const total = subtotal - descuento;

  // --- LÓGICA DE CONFIRMACIÓN DE VENTA ---
  const handleConfirmarVenta = async () => {
    setProcessing(true);
    
    // 1. Llamar al Server Action
    const result = await createSale(
        clienteSeleccionado?.id || null, 
        carrito, 
        total
    );

    if (result.success) {
        // 2. Mostrar Recibo
        setShowReceipt(true);
        // El estado se limpia cuando se cierra el modal
    } else {
        alert("Error al procesar la venta: " + result.error);
    }
    setProcessing(false);
  };

  const handleCloseModal = () => {
    setShowReceipt(false);
    setCarrito([]);
    setClienteSeleccionado(null);
    router.refresh(); // Refresca para actualizar stocks visualmente
  };

  return (
    <div className="h-[calc(100vh-2rem)] flex flex-col lg:flex-row gap-4 p-2 bg-slate-100 overflow-hidden font-sans">
      {/* ... (Todo tu JSX de búsqueda y grid de productos se mantiene igual) ... */}
      
      {/* IZQUIERDA: Grid Productos */}
      <div className="flex-1 flex flex-col gap-3 min-w-0 min-h-0">
        {/* Input Busqueda */}
        <div className="bg-white p-3 rounded-xl shadow-sm border border-slate-200 flex-shrink-0">
             <div className="relative">
                <input 
                    type="text" placeholder="Buscar producto..." 
                    value={busqueda} onChange={(e) => setBusqueda(e.target.value)}
                    className="w-full pl-4 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-lg outline-none focus:ring-2 focus:ring-blue-500"
                />
             </div>
        </div>

        {/* Grid */}
        <div className="flex-1 overflow-y-auto pr-1 pb-2">
             <div className="grid grid-cols-2 sm:grid-cols-3 xl:grid-cols-4 gap-3">
                {productosFiltrados.map(prod => {
                    const colorClass = getCategoryColor(prod.category);
                    return (
                        <button
                            key={prod.id}
                            onClick={() => agregarAlCarrito(prod)}
                            disabled={prod.stock === 0}
                            className="relative p-4 rounded-xl border border-slate-200 bg-white hover:border-blue-500 hover:shadow-md transition-all flex flex-col justify-between h-32 text-left disabled:opacity-50"
                        >
                            <div className="flex justify-between items-start w-full">
                                <span className={`text-[10px] font-bold px-1.5 py-0.5 rounded uppercase ${colorClass}`}>
                                    {prod.category}
                                </span>
                                <span className={`text-xs font-mono font-medium ${prod.stock < 5 ? 'text-red-500' : 'text-slate-400'}`}>
                                    Stock: {prod.stock}
                                </span>
                            </div>
                            <div>
                                <h4 className="font-bold text-slate-700 line-clamp-1">{prod.nombre}</h4>
                                <p className="text-xs text-slate-400">{prod.sku}</p>
                            </div>
                            <div className="text-right font-extrabold text-slate-800 text-lg">
                                Bs. {prod.precio}
                            </div>
                        </button>
                    )
                })}
             </div>
        </div>
      </div>

      {/* DERECHA: Carrito y Checkout */}
      <div className="w-full lg:w-96 bg-white rounded-xl shadow-xl border border-slate-200 flex flex-col overflow-hidden">
         {/* Selector de Cliente */}
         <div className="p-4 border-b border-slate-100 bg-slate-50">
            <label className="text-xs font-bold text-slate-500 uppercase">Cliente</label>
            <select 
                className="w-full mt-1 p-2 border rounded-lg bg-white"
                onChange={(e) => {
                    const id = Number(e.target.value);
                    setClienteSeleccionado(initialClients.find(c => c.id === id) || null);
                }}
            >
                <option value="">Cliente Casual</option>
                {initialClients.map(c => (
                    <option key={c.id} value={c.id}>{c.nombre} ({c.tipo})</option>
                ))}
            </select>
         </div>

         {/* Lista Items */}
         <div className="flex-1 overflow-y-auto p-2 space-y-2">
            {carrito.map(item => (
                <div key={item.id} className="flex justify-between items-center p-2 hover:bg-slate-50 rounded-lg group">
                    <div className="flex-1">
                        <p className="font-bold text-sm text-slate-700">{item.nombre}</p>
                        <p className="text-xs text-slate-400">Bs. {item.precio} x {item.cantidad}</p>
                    </div>
                    <div className="flex items-center gap-2">
                        <button onClick={() => cambiarCantidad(item.id, -1)} className="w-6 h-6 bg-slate-100 rounded text-slate-600 hover:bg-red-100">-</button>
                        <span className="text-sm font-bold w-4 text-center">{item.cantidad}</span>
                        <button onClick={() => cambiarCantidad(item.id, 1)} className="w-6 h-6 bg-slate-100 rounded text-slate-600 hover:bg-blue-100">+</button>
                        <button onClick={() => eliminarDelCarrito(item.id)} className="text-slate-300 hover:text-red-500 ml-2">x</button>
                    </div>
                </div>
            ))}
            {carrito.length === 0 && <p className="text-center text-slate-300 mt-10">Carrito Vacío</p>}
         </div>

         {/* Total y Botón */}
         <div className="p-5 bg-slate-50 border-t border-slate-200">
            <div className="flex justify-between items-end mb-4">
                <span className="text-slate-600 font-bold">Total a Pagar</span>
                <span className="text-3xl font-black text-blue-600">Bs. {total.toFixed(2)}</span>
            </div>
            <button 
                onClick={handleConfirmarVenta}
                disabled={carrito.length === 0 || processing}
                className="w-full bg-blue-600 hover:bg-blue-700 text-white py-3 rounded-lg font-bold shadow-lg disabled:opacity-50 disabled:cursor-not-allowed transition-all"
            >
                {processing ? 'Procesando...' : 'Confirmar Venta'}
            </button>
         </div>
      </div>

      <ReceiptModal
        isOpen={showReceipt}
        onClose={handleCloseModal} // Usamos la nueva función de cierre
        total={total}
        items={carrito}
        cliente={clienteSeleccionado?.nombre || "Cliente Casual"}
      />
    </div>
  );
}