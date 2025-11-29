'use server';

import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";
import { ProviderSaveData } from "../dashboard/proveedores/components/ProviderModal";

export async function createProveedorAction(data: ProviderSaveData) {
    try {
        // 1. Validar datos básicos
        if (!data.razonSocial || !data.ruc) {
            return { success: false, error: "Razón Social y RUC son obligatorios" };
        }

        // 2. Crear Persona (Modelo base)
        // Nota: Separamos nombre y apellido de la razón social si es posible, o usamos razón social como nombre
        const persona = await prisma.persona.create({
            data: {
                nombre: data.razonSocial,
                apellido: "(Empresa)", // Placeholder o manejo específico
                documento: data.ruc,
                direccion: data.direccion,
                telefono: data.telefono,
                email: data.email,
                tipoPersona: "PROVEEDOR",
            },
        });

        // 3. Crear Proveedor vinculado
        const proveedor = await prisma.proveedor.create({
            data: {
                personaId: persona.id,
            },
        });

        // 4. Crear Contacto si existe
        if (data.contacto) {
            await prisma.contactoProveedor.create({
                data: {
                    proveedorId: proveedor.id,
                    nombreContacto: data.contacto,
                    telefono: data.telefono,
                    email: data.email,
                },
            });
        }

        // 5. Revalidar caché
        revalidatePath("/dashboard/proveedores");

        return { success: true, data: proveedor };
    } catch (error) {
        console.error("Error creating provider:", error);
        return { success: false, error: "Error al crear el proveedor" };
    }
}

export async function deleteProveedorAction(id: number) {
    try {
        // Eliminar contactos primero (si no hay cascade delete)
        await prisma.contactoProveedor.deleteMany({
            where: { proveedorId: id }
        });

        // Eliminar proveedor
        const proveedor = await prisma.proveedor.delete({
            where: { id }
        });

        // Opcional: Eliminar persona si no se usa en otros lados
        // await prisma.persona.delete({ where: { id: proveedor.personaId } });

        revalidatePath("/dashboard/proveedores");
        return { success: true };
    } catch (error) {
        console.error("Error deleting provider:", error);
        return { success: false, error: "Error al eliminar el proveedor" };
    }
}
