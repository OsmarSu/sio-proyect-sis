// prisma/seed.ts
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  console.log("🌱 Iniciando sembrado de datos (Seeding)...");

  // 1. Limpieza (Opcional: borrar datos viejos para evitar duplicados)
  // Borramos en orden inverso a las dependencias
  await prisma.inventario.deleteMany();
  await prisma.producto.deleteMany();
  await prisma.marca.deleteMany();
  await prisma.categoria.deleteMany();
  await prisma.unidadMedida.deleteMany();
  await prisma.usuario.deleteMany();
  await prisma.personal.deleteMany();
  await prisma.persona.deleteMany();
  await prisma.almacen.deleteMany();
  await prisma.tipoAlmacen.deleteMany();

  console.log("🧹 Base de datos limpiada.");

  // 2. Crear Catálogos Base
  const unidadUnidad = await prisma.unidadMedida.create({
    data: { nombre: "Unidad" },
  });
  const unidadCaja = await prisma.unidadMedida.create({
    data: { nombre: "Caja" },
  });

  const catJuegos = await prisma.categoria.create({
    data: { nombre: "Juegos de Mesa" },
  });
  const catConstruccion = await prisma.categoria.create({
    data: { nombre: "Construcción" },
  });
  const catMunecas = await prisma.categoria.create({
    data: { nombre: "Muñecas y Figuras" },
  });

  const marcaLego = await prisma.marca.create({ data: { nombre: "LEGO" } });
  const marcaMattel = await prisma.marca.create({ data: { nombre: "Mattel" } });
  const marcaHasbro = await prisma.marca.create({ data: { nombre: "Hasbro" } });

  // 3. Crear Almacén Principal
  const tipoAlmTienda = await prisma.tipoAlmacen.create({
    data: { nombre: "Tienda Física" },
  });
  const almacenPrincipal = await prisma.almacen.create({
    data: {
      nombre: "Sucursal Central - Jueguetería Oasis",
      ubicacion: "Av. Principal 123",
      capacidadMaxima: 10000,
      tipoAlmacenId: tipoAlmTienda.id,
    },
  });

  // 4. Crear PRODUCTOS
  const productosData = [
    {
      nombre: "Lego Star Wars - Millennium Falcon",
      descripcion: "Set de construcción detallado de la nave más famosa.",
      sku: "LEGO-75192", // Asumí que agregaste SKU en mi recomendación, si no, bórralo
      price: 150.0,
      cost: 100.0,
      categoriaId: catConstruccion.id,
      marcaId: marcaLego.id,
      unidadMedidaId: unidadCaja.id,
      stock: 50,
    },
    {
      nombre: "Monopoly Clásico",
      descripcion: "El juego de compra y venta de propiedades.",
      sku: "HAS-001",
      price: 25.5,
      cost: 15.0,
      categoriaId: catJuegos.id,
      marcaId: marcaHasbro.id,
      unidadMedidaId: unidadUnidad.id,
      stock: 120,
    },
    {
      nombre: "Barbie Dreamhouse",
      descripcion: "Casa de los sueños con ascensor y piscina.",
      sku: "MAT-555",
      price: 199.99,
      cost: 120.5,
      categoriaId: catMunecas.id,
      marcaId: marcaMattel.id,
      unidadMedidaId: unidadCaja.id,
      stock: 15,
    },
    {
      nombre: "UNO Cartas",
      descripcion: "Juego de cartas familiar.",
      sku: "MAT-UNO",
      price: 5.0,
      cost: 1.5,
      categoriaId: catJuegos.id,
      marcaId: marcaMattel.id,
      unidadMedidaId: unidadUnidad.id,
      stock: 500,
    },
    {
      nombre: "Lego City - Estación de Policía",
      descripcion: "Estación completa con patrullas y helicóptero.",
      sku: "LEGO-60141",
      price: 89.99,
      cost: 60.0,
      categoriaId: catConstruccion.id,
      marcaId: marcaLego.id,
      unidadMedidaId: unidadCaja.id,
      stock: 30,
    },
  ];

  console.log("🎁 Creando productos...");

  for (const p of productosData) {
    // 1. Crear Precio
    // Nota: Tu esquema es complejo, creamos producto y luego precio
    const producto = await prisma.producto.create({
      data: {
        nombre: p.nombre,
        descripcion: p.descripcion,
        stockActual: p.stock, // Cache
        categoriaId: p.categoriaId,
        marcaId: p.marcaId,
        unidadMedidaId: p.unidadMedidaId,
        // Creamos el precio inicial directamente en la relación
        precios: {
          create: {
            monto: p.price,
            // Aquí podrías ligarlo a un TipoPrecio si lo creas antes
          },
        },
        // Creamos inventario físico en el almacén
        inventarios: {
          create: {
            almacenId: almacenPrincipal.id,
            stock: p.stock,
          },
        },
      },
    });
  }

  // 5. Crear USUARIO ADMIN (Persona -> Personal -> Usuario)
  console.log("👤 Creando usuario Admin...");

  const personaAdmin = await prisma.persona.create({
    data: {
      nombre: "Admin",
      apellido: "Principal",
      email: "admin@oasis.com",
      documento: "00000000",
      tipoPersona: "EMPLEADO",
    },
  });

  const cargoGerente = await prisma.cargo.create({
    data: { nombre: "Gerente General" },
  });

  const personalAdmin = await prisma.personal.create({
    data: {
      personaId: personaAdmin.id,
      cargoId: cargoGerente.id,
      sexo: "M",
    },
  });

  // AQUÍ CREAMOS EL LOGIN
  await prisma.usuario.create({
    data: {
      personalId: personalAdmin.id,
      username: "admin",
      passwordHash: "admin123", // En producción esto se hashea con bcrypt
      estado: true,
    },
  });

  console.log("✅ Seeding completado con éxito.");
}

main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (e) => {
    console.error(e);
    await prisma.$disconnect();
    process.exit(1);
  });
