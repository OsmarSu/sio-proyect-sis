// app/dashboard/compras/page.tsx
import { prisma } from "@/lib/prisma";
import ComprasClient from "./ComprasClient";
import { Supply } from "./types";

export const dynamic = 'force-dynamic';

export default async function ComprasPage() {
    const dbSupplies = await prisma.suministro.findMany({
        include: {
            proveedor: {
                include: { persona: true }
            },
            detalles: {
                include: { producto: true }
            }
        },
        orderBy: { fecha: 'desc' }
    });

    const formattedSupplies: Supply[] = dbSupplies.map(s => ({
        id: s.id,
        proveedor: `${s.proveedor.persona.nombre} ${s.proveedor.persona.apellido}`.trim(),
        fecha: s.fecha ? s.fecha.toISOString() : new Date().toISOString(),
        total: s.detalles.reduce((acc, d) => acc + (Number(d.precioUnitario || 0) * (d.cantidad || 0)), 0),
        items: s.detalles.length,
        estado: 'Completado'
    }));

    // Obtener datos para el modal de creación
    const dbProducts = await prisma.producto.findMany({
        select: { id: true, nombre: true }
    });

    const dbProviders = await prisma.proveedor.findMany({
        include: { persona: true }
    });

    const formattedProviders = dbProviders.map(p => ({
        id: p.id,
        nombre: `${p.persona.nombre} ${p.persona.apellido}`.trim()
    }));

    return (
        <ComprasClient
            initialSupplies={formattedSupplies}
            productsList={dbProducts.map(p => ({ id: p.id, nombre: p.nombre || "Sin Nombre" }))}
            providersList={formattedProviders}
        />
    );
}
