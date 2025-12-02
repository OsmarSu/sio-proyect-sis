import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

async function main() {
  console.log("🔄 Iniciando reseteo de contraseñas...");

  // 1. Generar hash compatible con TU proyecto
  const password = "123456";
  const hashedPassword = await bcrypt.hash(password, 10);

  console.log(`🔑 Nuevo Hash generado: ${hashedPassword}`);

  // 2. Actualizar TODOS los usuarios
  const update = await prisma.usuario.updateMany({
    data: {
      passwordHash: hashedPassword
    }
  });

  console.log(`✅ ÉXITO: Se actualizaron ${update.count} usuarios.`);
  console.log("👉 Ahora puedes entrar con 'daniel' o 'elmer' y la clave '123456'");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });