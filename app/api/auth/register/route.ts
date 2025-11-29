// app/api/auth/register/route.ts
import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { hashPassword, createToken, setAuthCookie } from '@/lib/auth';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { email, password, name } = body;

    // Validaciones del lado del servidor
    if (!email || !password) {
      return NextResponse.json(
        { error: 'Email y contraseña son requeridos' },
        { status: 400 }
      );
    }

    if (password.length < 8) {
      return NextResponse.json(
        { error: 'La contraseña debe tener al menos 8 caracteres' },
        { status: 400 }
      );
    }

    // Verificar si el email ya existe en Persona
    const existingPersona = await prisma.persona.findFirst({
      where: { email: email },
    });

    if (existingPersona) {
      // Verificar si ya tiene usuario
      const existingUser = await prisma.usuario.findFirst({
        where: { personal: { personaId: existingPersona.id } }
      });

      if (existingUser) {
        return NextResponse.json(
          { error: 'Este email ya está registrado como usuario' },
          { status: 400 }
        );
      }
    }

    // Hashear contraseña
    const hashedPassword = await hashPassword(password);

    // Transacción para crear todo
    const newUser = await prisma.$transaction(async (tx) => {
      // 1. Crear o usar Persona
      let personaId;
      if (existingPersona) {
        personaId = existingPersona.id;
      } else {
        const newPersona = await tx.persona.create({
          data: {
            nombre: name || email.split('@')[0],
            apellido: '', // Apellido opcional o placeholder
            email: email,
            tipoPersona: 'CLIENTE_WEB' // Identificador para usuarios web
          }
        });
        personaId = newPersona.id;
      }

      // 2. Crear Personal (Requisito para Usuario)
      // Nota: En este esquema, Usuario depende de Personal.
      // Si es un cliente web, igual necesitamos un registro en Personal para atar el Usuario.
      // O deberíamos revisar si Cliente puede tener Usuario.
      // Según schema: Usuario -> Personal.
      // Así que creamos un Personal "dummy" o real para este usuario.
      const newPersonal = await tx.personal.create({
        data: {
          personaId: personaId,
          cargoId: null, // Sin cargo específico
        }
      });

      // 3. Crear Usuario
      const usuario = await tx.usuario.create({
        data: {
          personalId: newPersonal.id,
          username: email,
          passwordHash: hashedPassword,
          estado: true
        }
      });

      // 4. Crear Cliente (Opcional, si queremos que aparezca en lista de clientes)
      await tx.cliente.create({
        data: {
          personaId: personaId,
          fechaRegistro: new Date(),
          estado: true
        }
      });

      return usuario;
    });

    return NextResponse.json(
      {
        message: 'Usuario registrado exitosamente',
        userId: newUser.id,
      },
      { status: 201 }
    );
  } catch (error) {
    console.error('Error en registro:', error);
    return NextResponse.json(
      { error: 'Error interno del servidor al registrar usuario' },
      { status: 500 }
    );
  }
}