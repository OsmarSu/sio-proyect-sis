// app/api/usuarios/create/route.ts
import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import bcrypt from 'bcryptjs';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const {
      username,
      email,
      password,
      nombre,
      apellido,
      telefono,
      documento,
      direccion,
      role,
      cargoId,
    } = body;

    // Validaciones
    if (!username || !email || !password || !nombre || !apellido || !role) {
      return NextResponse.json(
        { error: 'Faltan campos requeridos' },
        { status: 400 }
      );
    }

    // Verificar si el username ya existe
    const existingUsername = await prisma.usuario.findFirst({
      where: { username },
    });

    if (existingUsername) {
      return NextResponse.json(
        { error: 'El nombre de usuario ya existe' },
        { status: 400 }
      );
    }

    // Verificar si el email ya existe
    const existingEmail = await prisma.persona.findFirst({
      where: { email: email.toLowerCase() },
    });

    if (existingEmail) {
      return NextResponse.json(
        { error: 'El email ya está registrado' },
        { status: 400 }
      );
    }

    // Hash de la contraseña
    const hashedPassword = await bcrypt.hash(password, 10);

    // Crear Persona
    const persona = await prisma.persona.create({
      data: {
        nombre,
        apellido,
        email: email.toLowerCase(),
        telefono,
        documento,
        direccion,
        tipoPersona: role,
      },
    });

    // Crear Personal
    const personal = await prisma.personal.create({
      data: {
        personaId: persona.id,
        cargoId: role === 'PERSONAL' ? cargoId : null,
      },
    });

    // Crear Usuario
    const usuario = await prisma.usuario.create({
      data: {
        personalId: personal.id,
        username,
        passwordHash: hashedPassword,
        estado: true,
      },
    });

    // Buscar o crear el rol
    let rol = await prisma.rol.findFirst({
      where: { nombre: role === 'PERSONAL' ? 'Personal' : 'Cliente' },
    });

    if (!rol) {
      rol = await prisma.rol.create({
        data: { nombre: role === 'PERSONAL' ? 'Personal' : 'Cliente' },
      });
    }

    // Asignar rol al usuario
    await prisma.usuarioRol.create({
      data: {
        usuarioId: usuario.id,
        rolId: rol.id,
      },
    });

    // Obtener cargo si existe
    let cargoNombre = undefined;
    if (cargoId) {
      const cargo = await prisma.cargo.findUnique({
        where: { id: cargoId },
      });
      cargoNombre = cargo?.nombre;
    }

    // Respuesta
    return NextResponse.json(
      {
        message: 'Usuario creado exitosamente',
        user: {
          id: usuario.id,
          username: usuario.username,
          email: persona.email,
          nombre: persona.nombre,
          apellido: persona.apellido,
          telefono: persona.telefono,
          documento: persona.documento,
          role: role,
          estado: usuario.estado,
          fechaRegistro: new Date(),
          cargo: cargoNombre,
        },
      },
      { status: 201 }
    );
  } catch (error) {
    console.error('Error al crear usuario:', error);
    return NextResponse.json(
      { error: 'Error interno del servidor' },
      { status: 500 }
    );
  }
}