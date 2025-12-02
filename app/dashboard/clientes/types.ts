
// app/dashboard/clientes/types.ts

export interface Client {
  id: string;
  name: string;
  email: string;
  phone: string;
  address: string;
  loyaltyPoints: number;
  isActive: boolean;
  registeredAt: string; // O Date si vas a manejar objetos de fecha
}

// Tipo para el formulario del modal (sin ID ni campos autogenerados)
export type ClientFormData = Omit<Client, 'id' | 'loyaltyPoints' | 'isActive' | 'registeredAt'>;