// actions/get-usuarios.ts
import prisma from '@/lib/prisma';
import { User } from '@/types/user';

export async function getUsuarios(): Promise<User[]> {
  try {
    const usuarios = await prisma.usuario.findMany({
      select: {
        id: true,
        username: true,
        estado: true,
        personal: {
          select: {
            persona: {
              select: {
                nombre: true,
                apellido: true,
                email: true,
                telefono: true,
                documento: true,
              }
            },
            cargo: {
              select: {
                nombre: true
              }
            }
          }
        },
        roles: {
          select: {
            rol: {
              select: {
                nombre: true
              }
            }
          }
        }
      },
      orderBy: { id: 'desc' }
    });

    return usuarios.map((u) => ({
      id: u.id,
      username: u.username ?? 'Sin usuario',
      email: u.personal.persona.email ?? '',
      nombre: u.personal.persona.nombre,
      apellido: u.personal.persona.apellido,
      telefono: u.personal.persona.telefono ?? undefined,
      documento: u.personal.persona.documento ?? undefined,
      role: (u.roles[0]?.rol.nombre === 'Personal' ? 'PERSONAL' : 'CLIENTE') as 'PERSONAL' | 'CLIENTE',
      estado: u.estado ?? true,
      fechaRegistro: new Date(),
      cargo: u.personal.cargo?.nombre,
    }));
  } catch (error) {
    console.error('Error al obtener usuarios:', error);
    return [];
  }
}