import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
    console.log('Modelos disponibles en prisma:');
    const keys = Object.keys(prisma);
    const models = keys.filter(key => !key.startsWith('_') && !key.startsWith('$'));
    console.log(models);

    // Check specific models
    console.log('¿Existe prisma.user?', 'user' in prisma);
    console.log('¿Existe prisma.usuario?', 'usuario' in prisma);
}

main()
    .catch(e => console.error(e))
    .finally(async () => await prisma.$disconnect());
