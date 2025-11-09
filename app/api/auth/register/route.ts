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
        { message: 'Email y contraseña son requeridos' }, // <-- CAMBIO: Usamos 'message' en lugar de 'error'
        { status: 400 }
      );
    }

    if (password.length < 8) {
      return NextResponse.json(
        { message: 'La contraseña debe tener al menos 8 caracteres' }, // <-- CAMBIO
        { status: 400 }
      );
    }

    // Verificar si el email ya existe
    const existingUser = await prisma.user.findUnique({
      where: { email: email.toLowerCase() },
    });

    if (existingUser) {
      return NextResponse.json(
        { message: 'Este email ya está registrado' }, // <-- CAMBIO
        { status: 400 }
      );
    }

    // Hashear contraseña
    const hashedPassword = await hashPassword(password);

    // Crear usuario (siempre como CLIENTE por defecto)
    const user = await prisma.user.create({
      data: {
        email: email.toLowerCase(),
        name: name || email.split('@')[0],
        password: hashedPassword,
        role: 'CLIENTE',
      },
      select: {
        id: true,
        email: true,
        name: true,
        role: true,
        createdAt: true,
      },
    });

    // Crear token y cookie
    const userPayload = {
      id: user.id,
      email: user.email,
      name: user.name || '',
      role: user.role as 'CLIENTE' | 'PERSONAL',
    };
    const token = await createToken(userPayload);
    await setAuthCookie(token);

    return NextResponse.json(
      {
        message: 'Usuario registrado exitosamente',
        user,
      },
      { status: 201 }
    );
  } catch (error) {
    console.error('Error en registro:', error);
    // --- CAMBIO CLAVE AQUÍ: Aseguramos que SIEMPRE se devuelva un JSON válido ---
    return NextResponse.json(
      { message: 'Error interno del servidor al registrar usuario' }, // <-- CAMBIO
      { status: 500 }
    );
  }
}