import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

// Helpers para datos aleatorios
const getRandomInt = (min: number, max: number) => Math.floor(Math.random() * (max - min + 1)) + min;
const getRandomElement = <T>(arr: T[]): T => arr[Math.floor(Math.random() * arr.length)];

const NOMBRES = ["Carlos", "Ana", "Luis", "Maria", "Jorge", "Sofia", "Pedro", "Lucia", "Miguel", "Elena"];
const APELLIDOS = ["Perez", "Garcia", "Lopez", "Martinez", "Rodriguez", "Fernandez", "Gonzalez", "Sanchez", "Ramirez", "Torres"];
const EMPRESAS = ["Distribuidora", "Importadora", "Comercial", "Suministros", "Logística"];
const PRODUCTOS_ADJETIVOS = ["Premium", "Deluxe", "Básico", "Pro", "Max", "Ultra", "Super"];
const CATEGORIAS_JUGUETES = ["Muñecas", "Construcción", "Vehículos", "Juegos de Mesa", "Educativos", "Aire Libre"];

async function main() {
    console.log('--- Iniciando Seeding Adicional ---');

    // 1. Crear 5 Proveedores
    console.log('-> Creando 5 Proveedores...');
    const proveedoresIds: number[] = [];
    for (let i = 0; i < 5; i++) {
        const nombre = getRandomElement(NOMBRES);
        const apellido = getRandomElement(APELLIDOS);
        const empresa = `${getRandomElement(EMPRESAS)} ${apellido} S.R.L.`;

        // Crear Persona
        const persona = await prisma.persona.create({
            data: {
                nombre: `${nombre} (Prov)`,
                apellido: apellido,
                email: `prov.${nombre.toLowerCase()}.${i}@example.com`,
                telefono: `7${getRandomInt(1000000, 9999999)}`,
                direccion: `Av. ${getRandomElement(APELLIDOS)} #${getRandomInt(100, 999)}`,
                tipoPersona: 'PROVEEDOR'
            }
        });

        // Crear Proveedor
        const proveedor = await prisma.proveedor.create({
            data: {
                personaId: persona.id
            }
        });
        proveedoresIds.push(proveedor.id);
    }

    // 2. Crear 5 Productos con Inventario
    console.log('-> Creando 5 Productos...');
    const productosIds: number[] = [];

    // Obtener categorías existentes o crear una default si no hay
    let categoria = await prisma.categoria.findFirst();
    if (!categoria) {
        categoria = await prisma.categoria.create({ data: { nombre: "General" } });
    }

    for (let i = 0; i < 5; i++) {
        const nombreProducto = `Juguete ${getRandomElement(PRODUCTOS_ADJETIVOS)} ${getRandomInt(100, 999)}`;
        const precio = getRandomInt(50, 500);

        const producto = await prisma.producto.create({
            data: {
                nombre: nombreProducto,
                descripcion: `Descripción para ${nombreProducto}`,
                categoriaId: categoria.id,
                stockActual: 0 // Se actualiza via Inventario o trigger, pero lo dejamos en 0 inicial
            }
        });
        productosIds.push(producto.id);

        // Crear Precio
        await prisma.precio.create({
            data: {
                monto: precio,
                productoId: producto.id,
                // tipoPrecioId: 1 // Asumiendo 1 es precio base
            }
        });

        // Crear Inventario Inicial (Aumentar Inventario)
        const stockInicial = getRandomInt(50, 200);
        await prisma.inventario.create({
            data: {
                productoId: producto.id,
                stock: stockInicial,
                // almacenId: 1
            }
        });
        console.log(`   Creado: ${nombreProducto} (Stock: ${stockInicial})`);
    }

    // 3. Crear Ventas (8 + 10 = 18)
    console.log('-> Creando 18 Ventas...');

    // Necesitamos clientes y productos existentes
    const clientes = await prisma.cliente.findMany();
    const todosProductos = await prisma.producto.findMany({ include: { precios: true } });

    if (clientes.length === 0 || todosProductos.length === 0) {
        console.warn("No hay clientes o productos suficientes para generar ventas.");
    } else {
        for (let i = 0; i < 18; i++) {
            const cliente = getRandomElement(clientes);

            // Seleccionar 1-3 productos para la venta
            const numItems = getRandomInt(1, 3);
            const itemsVenta = [];
            let totalVenta = 0;

            for (let j = 0; j < numItems; j++) {
                const prod = getRandomElement(todosProductos);
                const cantidad = getRandomInt(1, 3);
                const precio = Number(prod.precios[0]?.monto || 100); // Usar primer precio o default

                itemsVenta.push({
                    productoId: prod.id,
                    cantidad,
                    precioUnitario: precio
                });
                totalVenta += (cantidad * precio);
            }

            // Crear Pedido
            const pedido = await prisma.pedido.create({
                data: {
                    fecha: new Date(),
                    estado: 'COMPLETADO',
                    clienteId: cliente.id
                }
            });

            // Crear Detalles Pedido
            for (const item of itemsVenta) {
                await prisma.detallePedido.create({
                    data: {
                        pedidoId: pedido.id,
                        productoId: item.productoId,
                        cantidad: item.cantidad,
                        precioUnitario: item.precioUnitario
                    }
                });
            }

            // Crear Factura
            const factura = await prisma.factura.create({
                data: {
                    fecha: new Date(),
                    total: totalVenta,
                    pedidoId: pedido.id
                }
            });

            // Crear Venta
            await prisma.venta.create({
                data: {
                    fecha: new Date(),
                    facturaId: factura.id
                }
            });

            // Actualizar Inventario (Decrementar)
            for (const item of itemsVenta) {
                const inv = await prisma.inventario.findFirst({ where: { productoId: item.productoId } });
                if (inv && (inv.stock || 0) >= item.cantidad) {
                    await prisma.inventario.update({
                        where: { id: inv.id },
                        data: { stock: { decrement: item.cantidad } }
                    });
                }
            }
        }
    }

    console.log('--- Seeding Completado ---');
}

main()
    .catch((e) => {
        console.error(e);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });
