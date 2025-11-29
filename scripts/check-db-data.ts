
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
    console.log('--- Verificando datos del Dashboard ---');

    // 0. Personas
    const personasCount = await prisma.persona.count();
    console.log(`Personas (Total): ${personasCount}`);

    // 1. Productos
    const productsCount = await prisma.producto.count();
    console.log(`Productos: ${productsCount}`);

    // 2. Proveedores
    const providersCount = await prisma.proveedor.count();
    console.log(`Proveedores: ${providersCount}`);

    // 3. Compras (Suministros)
    const suppliesCount = await prisma.suministro.count();
    console.log(`Compras (Suministros): ${suppliesCount}`);

    // 4. Inventario
    const inventoryCount = await prisma.inventario.count();
    console.log(`Registros de Inventario: ${inventoryCount}`);

    // 5. Ventas
    const salesCount = await prisma.venta.count();
    console.log(`Ventas: ${salesCount}`);

    // 6. Clientes
    const clientsCount = await prisma.cliente.count();
    console.log(`Clientes: ${clientsCount}`);
}

main()
    .catch((e) => {
        console.error(e);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });
