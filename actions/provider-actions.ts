'use server';

import prisma from '@/lib/prisma';
import { revalidatePath } from 'next/cache';

export interface ProviderData {
    id: number;
    razonSocial: string;
    ruc: string;
    direccion: string;
    telefono: string;
    email: string;
    contacto: string;
}

export type ProviderSaveData = Omit<ProviderData, 'id'> & { id?: number };

export async function getProviders(): Promise<ProviderData[]> {
    try {
        const providers = await prisma.proveedor.findMany({
            include: {
                persona: true,
                contactos: true,
            },
            orderBy: {
                id: 'desc',
            },
        });

        return providers.map((p) => ({
            id: p.id,
            razonSocial: p.persona.nombre + ' ' + p.persona.apellido, // Ajustar según lógica de negocio (si es empresa, usar nombre como Razón Social)
            ruc: p.persona.documento || '',
            direccion: p.persona.direccion || '',
            telefono: p.persona.telefono || '',
            email: p.persona.email || '',
            contacto: p.contactos[0]?.nombreContacto || 'Sin Contacto',
        }));
    } catch (error) {
        console.error('Error fetching providers:', error);
        return [];
    }
}

export async function createProvider(data: ProviderSaveData) {
    try {
        // 1. Crear Persona
        const persona = await prisma.persona.create({
            data: {
                nombre: data.razonSocial, // Simplificación: Usamos Razón Social como nombre
                apellido: '', // Opcional o manejar lógica de separación
                documento: data.ruc,
                direccion: data.direccion,
                telefono: data.telefono,
                email: data.email,
                tipoPersona: 'PROVEEDOR',
            },
        });

        // 2. Crear Proveedor vinculado
        const proveedor = await prisma.proveedor.create({
            data: {
                personaId: persona.id,
                contactos: {
                    create: {
                        nombreContacto: data.contacto,
                        telefono: data.telefono,
                        email: data.email,
                    },
                },
            },
        });

        revalidatePath('/dashboard/proveedores');
        return { success: true, data: proveedor };
    } catch (error: any) {
        console.error('Error creating provider:', error);
        return { success: false, error: error.message };
    }
}

export async function updateProvider(data: ProviderSaveData) {
    if (!data.id) return { success: false, error: 'ID requerido para actualizar' };

    try {
        // Obtener proveedor para saber ID de persona
        const existingProvider = await prisma.proveedor.findUnique({
            where: { id: data.id },
            include: { contactos: true },
        });

        if (!existingProvider) return { success: false, error: 'Proveedor no encontrado' };

        // 1. Actualizar Persona
        await prisma.persona.update({
            where: { id: existingProvider.personaId },
            data: {
                nombre: data.razonSocial,
                documento: data.ruc,
                direccion: data.direccion,
                telefono: data.telefono,
                email: data.email,
            },
        });

        // 2. Actualizar Contacto (Asumiendo uno principal)
        if (existingProvider.contactos.length > 0) {
            await prisma.contactoProveedor.update({
                where: { id: existingProvider.contactos[0].id },
                data: {
                    nombreContacto: data.contacto,
                    telefono: data.telefono,
                    email: data.email,
                },
            });
        } else {
            // Crear si no existe
            await prisma.contactoProveedor.create({
                data: {
                    proveedorId: existingProvider.id,
                    nombreContacto: data.contacto,
                    telefono: data.telefono,
                    email: data.email
                }
            })
        }

        revalidatePath('/dashboard/proveedores');
        return { success: true };
    } catch (error: any) {
        console.error('Error updating provider:', error);
        return { success: false, error: error.message };
    }
}

export async function deleteProvider(id: number) {
    try {
        // Eliminar contactos primero (si no hay cascade delete)
        await prisma.contactoProveedor.deleteMany({
            where: { proveedorId: id },
        });

        // Eliminar proveedor
        const provider = await prisma.proveedor.delete({
            where: { id },
        });

        // Opcional: Eliminar persona si no tiene otras relaciones
        // await prisma.persona.delete({ where: { id: provider.personaId } });

        revalidatePath('/dashboard/proveedores');
        return { success: true };
    } catch (error: any) {
        console.error('Error deleting provider:', error);
        return { success: false, error: error.message };
    }
}
