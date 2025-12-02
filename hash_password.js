// hash_password.js
const bcrypt = require('bcryptjs');

async function hashAndLogPassword() {
    const passwordToHash = 'password123'; // <--- ¡CAMBIA ESTA CONTRASEÑA SI QUIERES OTRA!
    const saltRounds = 10; // Un buen número para saltRounds

    try {
        const hashedPassword = await bcrypt.hash(passwordToHash, saltRounds);
        console.log(`Contraseña original: ${passwordToHash}`);
        console.log(`Contraseña hasheada (bcrypt): ${hashedPassword}`);
    } catch (error) {
        console.error('Error al hashear la contraseña:', error);
    }
}

hashAndLogPassword();
