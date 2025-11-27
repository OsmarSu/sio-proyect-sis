// app/dashboard/productos/types.ts

// Esta es la forma que espera tu UI (Tarjetas)
export interface Product {
  id: string;
  code: string;
  name: string;
  description: string;
  category: string;
  supplier: string; // Lo usaremos para la MARCA
  currentStock: number;
  minStock: number;
  majorPrice: number; // Lo usaremos para el COSTO
  minorPrice: number; // Lo usaremos para el PRECIO DE VENTA
  ageRange: string;
  isNew: boolean;
  isOffer: boolean;
  active: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface ProductFormData extends Omit<Product, "id" | "createdAt" | "updatedAt"> {}