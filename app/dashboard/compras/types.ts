// app/dashboard/compras/types.ts

export interface Supply {
    id: number;
    date: string;
    providerName: string;
    totalAmount: number; // Calculado o estimado
    itemCount: number;
    proveedor: string; // Add this field to match usage in ComprasClient
    fecha: string;     // Add this field to match usage in ComprasClient
    total: number;     // Add this field to match usage in ComprasClient
    items: number;     // Add this field to match usage in ComprasClient
    estado: string;    // Add this field to match usage in ComprasClient
}
