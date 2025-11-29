"use client";

import { useState } from "react";
import ReceiptModal from "./components/ReceiptModal";
import { createVentaAction } from "@/app/actions/venta-actions";

export type ProductoVenta = {
    id: number;
    nombre: string;
    precio: number;
    stock: number;
    category: string;
    sku: string;
};

export type ItemCarrito = ProductoVenta & {
    cantidad: number;
};

export type ClienteVenta = {
    id: number;
    nombre: string;
    ci: string;
    tipo: string;
};

interface VentasClientProps {
    initialProducts: ProductoVenta[];
    initialClients: ClienteVenta[];
}

const getCategoryColor = (category: string) => {
    const map: Record<string, string> = {
        Deportes: "border-orange-500 bg-orange-50 text-orange-700",
        Muñecas: "border-pink-500 bg-pink-50 text-pink-700",
        Construcción: "border-blue-500 bg-blue-50 text-blue-700",
        Juegos: "border-purple-500 bg-purple-50 text-purple-700",
        General: "border-gray-500 bg-gray-50 text-gray-700",
    };
    return map[category] || "border-gray-500 bg-gray-50 text-gray-700";
};

export default function VentasClient({ initialProducts, initialClients }: VentasClientProps) {
    const [carrito, setCarrito] = useState<ItemCarrito[]>([]);
    const [busqueda, setBusqueda] = useState("");
    const [clienteSeleccionado, setClienteSeleccionado] = useState<ClienteVenta | null>(null);
    const [showReceipt, setShowReceipt] = useState(false);

    const productosFiltrados = initialProducts.filter(
        (p) =>
            p.nombre.toLowerCase().includes(busqueda.toLowerCase()) ||
            p.sku.toLowerCase().includes(busqueda.toLowerCase())
    );

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
                    const productoOriginal = initialProducts.find(
                        (p) => p.id === id
                    );
                    const stockMaximo = productoOriginal?.stock || 0;
                    if (nuevaCantidad > stockMaximo) return item;
                    return nuevaCantidad > 0
                        ? { ...item, cantidad: nuevaCantidad }
                        : item;
                }
                return item;
            })
        );
    };

    const eliminarDelCarrito = (id: number) => {
        setCarrito((prev) => prev.filter((item) => item.id !== id));
    };

    const subtotal = carrito.reduce(
        (sum, item) => sum + item.precio * item.cantidad,
        0
    );

    const isVip = clienteSeleccionado?.tipo?.toLowerCase().includes("vip");
    const descuento = isVip ? subtotal * 0.1 : 0;
    const total = subtotal - descuento;

    const handleConfirmarPago = async () => {
        if (carrito.length === 0) return;

        try {
            const result = await createVentaAction(carrito, clienteSeleccionado?.id || null, total);

            if (result.success) {
                setShowReceipt(true);
            } else {
                alert("Error al procesar la venta: " + result.error);
            }
        } catch (error) {
            console.error(error);
            alert("Error inesperado");
        }
    };

    return (
        <div className="h-[100dvh] lg:h-[calc(100vh-2rem)] flex flex-col lg:flex-row gap-4 p-2 lg:p-4 bg-slate-100 overflow-hidden font-sans">
            <div className="flex-1 flex flex-col gap-3 min-w-0 min-h-0">
                <div className="bg-white p-3 rounded-xl shadow-sm border border-slate-200 flex-shrink-0">
                    <div className="relative">
                        <svg
                            className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                        >
                            <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                            />
                        </svg>
                        <input
                            type="text"
                            placeholder="Buscar..."
                            value={busqueda}
                            onChange={(e) => setBusqueda(e.target.value)}
                            className="w-full pl-12 pr-4 py-2 lg:py-3 text-base lg:text-lg bg-slate-50 border border-slate-200 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                        />
                    </div>
                </div>

                <div className="flex-1 overflow-y-auto pr-1 pb-2">
                    <div className="grid grid-cols-2 sm:grid-cols-3 xl:grid-cols-4 gap-3">
                        {productosFiltrados.map((prod) => {
                            const colorClass = getCategoryColor(prod.category);
                            return (
                                <button
                                    key={prod.id}
                                    onClick={() => agregarAlCarrito(prod)}
                                    disabled={prod.stock === 0}
                                    className={`
                    relative p-3 lg:p-4 rounded-xl border-2 text-left transition-all duration-150 group
                    flex flex-col justify-between h-28 lg:h-32
                    hover:shadow-md active:scale-95
                    bg-white border-slate-200 hover:border-blue-400
                    disabled:opacity-50 disabled:grayscale
                  `}
                                >
                                    <div className="flex justify-between items-start w-full mb-1">
                                        <span
                                            className={`text-[9px] lg:text-[10px] font-bold px-1.5 py-0.5 rounded uppercase tracking-wider ${colorClass.split(" ")[1]
                                                } ${colorClass.split(" ")[2]}`}
                                        >
                                            {prod.category.substring(0, 8)}
                                        </span>
                                        <span
                                            className={`text-[10px] lg:text-xs font-mono font-medium ${prod.stock < 3 ? "text-red-500" : "text-slate-400"
                                                }`}
                                        >
                                            Stock: {prod.stock}
                                        </span>
                                    </div>

                                    <div>
                                        <h4 className="text-sm lg:text-base font-bold text-slate-700 leading-tight line-clamp-1 group-hover:text-blue-700">
                                            {prod.nombre}
                                        </h4>
                                        <p className="text-[10px] text-slate-400 font-mono">
                                            {prod.sku}
                                        </p>
                                    </div>

                                    <div className="mt-auto pt-2 border-t border-slate-50 w-full text-right">
                                        <span className="text-lg lg:text-xl font-extrabold text-slate-800">
                                            Bs. {prod.precio}
                                        </span>
                                    </div>
                                </button>
                            );
                        })}
                    </div>
                </div>
            </div>

            <div className="w-full lg:w-80 xl:w-96 h-[45%] lg:h-full flex-shrink-0 bg-white rounded-xl shadow-[0_-5px_20px_-5px_rgba(0,0,0,0.1)] lg:shadow-xl border border-slate-200 flex flex-col z-20 overflow-hidden">
                <div className="p-3 lg:p-4 border-b border-slate-100 bg-slate-50/50 flex-shrink-0">
                    <div className="flex justify-between items-center mb-2">
                        <h2 className="font-bold text-slate-800 text-sm lg:text-base flex items-center gap-2">
                            <span className="bg-blue-100 text-blue-600 p-1 rounded">
                                <svg
                                    className="w-4 h-4"
                                    fill="none"
                                    stroke="currentColor"
                                    viewBox="0 0 24 24"
                                >
                                    <path
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        strokeWidth={2}
                                        d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                                    />
                                </svg>
                            </span>
                            Cliente
                        </h2>
                        {isVip && (
                            <span className="text-[10px] px-2 py-0.5 rounded bg-purple-100 text-purple-700 font-bold border border-purple-200">
                                VIP
                            </span>
                        )}
                    </div>
                    <select
                        className="w-full px-2 py-1.5 lg:py-2 border border-slate-300 rounded-lg text-xs lg:text-sm bg-white"
                        onChange={(e) =>
                            setClienteSeleccionado(
                                initialClients.find(
                                    (c) => c.id === Number(e.target.value)
                                ) || null
                            )
                        }
                    >
                        <option value="">Cliente Casual</option>
                        {initialClients.map((c) => (
                            <option key={c.id} value={c.id}>
                                {c.nombre}
                            </option>
                        ))}
                    </select>
                </div>

                <div className="flex-1 p-2 overflow-y-auto space-y-1 bg-white">
                    {carrito.length === 0 ? (
                        <div className="h-full flex flex-col items-center justify-center text-slate-300">
                            <p className="text-sm font-medium">Carrito Vacío</p>
                        </div>
                    ) : (
                        carrito.map((item) => (
                            <div
                                key={item.id}
                                className="flex items-center justify-between p-2 rounded-lg hover:bg-slate-50 border border-transparent hover:border-slate-100 group"
                            >
                                <div className="flex-1 min-w-0 pr-2">
                                    <div className="flex justify-between items-baseline">
                                        <p className="text-xs lg:text-sm font-bold text-slate-700 truncate">
                                            {item.nombre}
                                        </p>
                                        <p className="text-xs font-semibold text-slate-900 ml-1">
                                            Bs. {item.precio * item.cantidad}
                                        </p>
                                    </div>
                                    <p className="text-[10px] text-slate-400 font-mono truncate">
                                        {item.sku}
                                    </p>
                                </div>

                                {/* Controles Cantidad */}
                                <div className="flex items-center bg-white border border-slate-200 rounded shadow-sm h-6 lg:h-7 flex-shrink-0">
                                    <button
                                        onClick={() => cambiarCantidad(item.id, -1)}
                                        className="w-6 h-full text-slate-500 hover:text-red-600 font-bold"
                                    >
                                        -
                                    </button>
                                    <span className="text-xs font-bold w-5 text-center">
                                        {item.cantidad}
                                    </span>
                                    <button
                                        onClick={() => cambiarCantidad(item.id, 1)}
                                        className="w-6 h-full text-slate-500 hover:text-blue-600 font-bold"
                                    >
                                        +
                                    </button>
                                </div>

                                <button
                                    onClick={() => eliminarDelCarrito(item.id)}
                                    className="ml-1 lg:ml-2 p-1 text-slate-300 hover:text-red-500"
                                >
                                    <svg
                                        className="w-4 h-4"
                                        fill="none"
                                        stroke="currentColor"
                                        viewBox="0 0 24 24"
                                    >
                                        <path
                                            strokeLinecap="round"
                                            strokeLinejoin="round"
                                            strokeWidth={2}
                                            d="M6 18L18 6M6 6l12 12"
                                        />
                                    </svg>
                                </button>
                            </div>
                        ))
                    )}
                </div>

                <div className="p-3 lg:p-5 bg-slate-50 border-t border-slate-200 flex-shrink-0">
                    <div className="flex justify-between items-end mb-3">
                        <span className="text-slate-600 font-bold text-sm">Total</span>
                        <span className="text-2xl lg:text-3xl font-black text-blue-600">
                            Bs. {total.toFixed(2)}
                        </span>
                    </div>

                    <button
                        className="w-full bg-blue-600 hover:bg-blue-700 text-white py-3 rounded-lg font-bold text-sm lg:text-lg shadow-lg shadow-blue-200 active:scale-[0.98] transition-transform disabled:opacity-50"
                        disabled={carrito.length === 0}
                        onClick={handleConfirmarPago}
                    >
                        Confirmar Pago
                    </button>
                </div>
            </div>

            <ReceiptModal
                isOpen={showReceipt}
                onClose={() => {
                    setShowReceipt(false);
                    setCarrito([]);
                    setClienteSeleccionado(null);
                }}
                total={total}
                items={carrito}
                cliente={clienteSeleccionado?.nombre || "Cliente Casual"}
            />
        </div>
    );
}
