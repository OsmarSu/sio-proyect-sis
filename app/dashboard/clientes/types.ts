export interface Client {
  id: string;
  name: string;
  email: string;
  phone: string;
  address: string;
  // loyaltyPoints: number; <--- ELIMINADO
  isActive: boolean;
  registeredAt: string;
}

export type ClientFormData = Omit<Client, 'id' | 'isActive' | 'registeredAt'>;