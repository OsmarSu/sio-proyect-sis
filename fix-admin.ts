// fix-admin.ts
const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcryptjs');

const prisma = new PrismaClient();

async function main() {
  console.log("🔧 Iniciando reparación de credenciales...");

  // 1. Buscamos al usuario 'admin' que creaste
  const usuario = await prisma.usuario.findFirst({
    where: { username: "admin" } // Buscamos por el username que pusiste
  });

  if (!usuario) {
    console.error("❌ No encontré al usuario 'admin' en la base de datos.");
    return;
  }

  // 2. Encriptamos la contraseña "admin123"
  const hashedPassword = await bcrypt.hash("admin123", 10);

  // 3. Actualizamos el registro existente
  await prisma.usuario.update({
    where: { id: usuario.id },
    data: {
      passwordHash: hashedPassword // Guardamos el hash real ($2b$10$...)
    }
  });

  console.log("✅ ÉXITO: Contraseña actualizada.");
  console.log("👉 Ahora puedes loguearte con:");
  console.log("   User (Email asociado a ese personal): admin@oasis.com (asegúrate que la Persona tenga este email)");
  console.log("   Password: admin123");
}

main()
  .catch((e) => console.error(e))
  .finally(async () => await prisma.$disconnect());