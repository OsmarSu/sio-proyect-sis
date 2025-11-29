// app/dashboard/compras/types.ts

export interface Supply {
    id: number;
    date: string;
    providerName: string;
    totalAmount: number; // Calculado o estimado
    itemCount: number;
}
