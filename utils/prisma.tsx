// utils/prisma.ts

import { PrismaClient } from "@prisma/client";

// 1. Añadir la propiedad 'prisma' al objeto global (type augmentation)
//    NO se usa 'var' ni 'const' en esta declaración de tipo.
declare global {
  // eslint-disable-next-line no-var
  var prisma: PrismaClient | undefined;
}

// 2. Usar la instancia global si existe, o crear una nueva
//    Exportamos la instancia Singleton.
export const prisma = global.prisma || new PrismaClient({
  // Opciones de log para desarrollo
  log: ['query', 'info', 'warn', 'error'],
});

// 3. Asignar la instancia al objeto global solo en desarrollo 
//    para evitar la recreación de instancias durante el hot-reloading de Next.js
if (process.env.NODE_ENV !== 'production') {
  global.prisma = prisma;
}

// Si estás usando TypeScript y los errores persisten, 
// puedes intentar usar 'globalThis' en lugar de 'global' 
// en el entorno de desarrollo:
// export const prisma = globalThis.prisma || new PrismaClient({ ... });