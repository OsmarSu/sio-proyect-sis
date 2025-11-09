// app/api/auth/logout/route.ts
import { NextResponse } from 'next/server';
import { removeAuthCookie } from '@/lib/auth';

export async function POST(request: Request) {
  // 1. Borramos la cookie de sesión usando tu función
  await removeAuthCookie();

  // 2. Devolvemos una respuesta de éxito
  return NextResponse.json({ message: 'Sesión cerrada exitosamente' });
}