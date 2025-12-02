// app/dashboard/productos/types.ts

// 1. Interfaz del Producto que viene de la Base de Datos (Lectura)
export interface Product {
  id: number;
  name: string;
  description: string;
  
  // ✅ Nombres en Español (Coinciden con Prisma/DB)
  stockActual: number; 
  marca: string;       
  
  category: string;
  linea: string;
  unidad: string;
  minorPrice: number;
  majorPrice: number;
}

// 2. Interfaz del Formulario (Escritura)
// Definimos esto manualmente para asegurar que coincida con el Modal
export interface ProductFormData {
  name: string;
  description: string;
  category: string;
  
  // ✅ AQUI ESTABA EL ERROR: Usamos los nombres de la DB
  marca: string;       // Antes supplier
  stockActual: number; // Antes currentStock
  
  linea: string;
  unidad: string;
  minorPrice: number;

  // Campos Visuales / Opcionales (No están en la tabla Producto directamente)
  code: string;
  minStock: number;
  majorPrice: number;
  isNew: boolean;
  isOffer: boolean;
}