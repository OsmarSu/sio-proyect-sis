// app/api/auth/login/route.ts
import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { verifyPassword, createToken, setAuthCookie } from '@/lib/auth';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { email, password } = body;

    if (!email || !password) {
      return NextResponse.json({ error: 'Email y contraseña son requeridos' }, { status: 400 });
    }

    // 1. Buscar al usuario
    const user = await prisma.user.findUnique({ where: { email: email.toLowerCase() } });
    if (!user || !user.password) {
      return NextResponse.json({ error: 'Credenciales inválidas' }, { status: 401 });
    }

    // 2. Verificar la contraseña usando tu función
    const isPasswordValid = await verifyPassword(password, user.password);
    if (!isPasswordValid) {
      return NextResponse.json({ error: 'Credenciales inválidas' }, { status: 401 });
    }

    // 3. Crear el payload y el token JWT usando tus funciones
    if (user.role !== 'PERSONAL' && user.role !== 'CLIENTE') {
      return NextResponse.json({ error: 'Rol de usuario inválido' }, { status: 400 });
    }

    const userPayload = {
      id: user.id,
      email: user.email,
      name: user.name || '',
      role: user.role as 'PERSONAL' | 'CLIENTE',
    };
    const token = await createToken(userPayload);

    // 4. Establecer la cookie de sesión usando tu función
    await setAuthCookie(token);

    // Devolvemos los datos del usuario para el AuthContext
    return NextResponse.json({ user: userPayload });

  } catch (error) {
    console.error("Error en login:", error);
    return NextResponse.json({ error: 'Error interno del servidor' }, { status: 500 });
  }
}