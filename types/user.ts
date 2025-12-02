// types/user.ts
export type UserRole = 'PERSONAL' | 'CLIENTE';

export interface User {
  id: number;
  username: string;
  email: string;
  nombre: string;
  apellido: string;
  telefono?: string;
  documento?: string;
  role: UserRole;
  estado: boolean;
  fechaRegistro: Date;
  cargo?: string;
}

export interface UserFormData {
  username: string;
  email: string;
  password?: string;
  nombre: string;
  apellido: string;
  telefono?: string;
  documento?: string;
  direccion?: string;
  role: UserRole;
  cargoId?: number;
}

export interface Cargo {
  id: number;
  nombre: string;
}

export interface CreateUserRequest extends UserFormData {
  password: string;
}

export interface UpdateUserRequest extends Partial<UserFormData> {
  id: number;
}