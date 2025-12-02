// app/api/usuarios/[id]/route.ts
import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

// PUT - Actualizar usuario
export async function PUT(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const userId = parseInt(params.id);
    const body = await request.json();
    const {
      username,
      email,
      nombre,
      apellido,
      telefono,
      documento,
      direccion,
      role,
      cargoId,
    } = body;

    // Verificar que el usuario existe
    const usuario = await prisma.usuario.findUnique({
      where: { id: userId },
      include: {
        personal: {
          include: {
            persona: true,
          },
        },
      },
    });

    if (!usuario) {
      return NextResponse.json(
        { error: 'Usuario no encontrado' },
        { status: 404 }
      );
    }

    // Verificar si el username ya existe (excluyendo el actual)
    if (username !== usuario.username) {
      const existingUsername = await prisma.usuario.findFirst({
        where: {
          username,
          NOT: { id: userId },
        },
      });

      if (existingUsername) {
        return NextResponse.json(
          { error: 'El nombre de usuario ya existe' },
          { status: 400 }
        );
      }
    }

    // Verificar si el email ya existe (excluyendo el actual)
    if (email !== usuario.personal.persona.email) {
      const existingEmail = await prisma.persona.findFirst({
        where: {
          email: email.toLowerCase(),
          NOT: { id: usuario.personal.persona.id },
        },
      });

      if (existingEmail) {
        return NextResponse.json(
          { error: 'El email ya está registrado' },
          { status: 400 }
        );
      }
    }

    // Actualizar Persona
    await prisma.persona.update({
      where: { id: usuario.personal.persona.id },
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

    // Actualizar Personal (cargo)
    await prisma.personal.update({
      where: { id: usuario.personal.id },
      data: {
        cargoId: role === 'PERSONAL' ? cargoId : null,
      },
    });

    // Actualizar Usuario
    await prisma.usuario.update({
      where: { id: userId },
      data: {
        username,
      },
    });

    // Actualizar rol si cambió
    const currentRol = await prisma.usuarioRol.findFirst({
      where: { usuarioId: userId },
      include: { rol: true },
    });

    const newRolName = role === 'PERSONAL' ? 'Personal' : 'Cliente';
    
    if (currentRol && currentRol.rol.nombre !== newRolName) {
      // Buscar o crear el nuevo rol
      let nuevoRol = await prisma.rol.findFirst({
        where: { nombre: newRolName },
      });

      if (!nuevoRol) {
        nuevoRol = await prisma.rol.create({
          data: { nombre: newRolName },
        });
      }

      // Actualizar el rol del usuario
      await prisma.usuarioRol.update({
        where: { id: currentRol.id },
        data: { rolId: nuevoRol.id },
      });
    }

    // Obtener cargo actualizado
    let cargoNombre = undefined;
    if (cargoId) {
      const cargo = await prisma.cargo.findUnique({
        where: { id: cargoId },
      });
      cargoNombre = cargo?.nombre;
    }

    // Respuesta
    return NextResponse.json({
      message: 'Usuario actualizado exitosamente',
      user: {
        id: userId,
        username,
        email: email.toLowerCase(),
        nombre,
        apellido,
        telefono,
        documento,
        role: role,
        estado: usuario.estado,
        fechaRegistro: new Date(),
        cargo: cargoNombre,
      },
    });
  } catch (error) {
    console.error('Error al actualizar usuario:', error);
    return NextResponse.json(
      { error: 'Error interno del servidor' },
      { status: 500 }
    );
  }
}

// DELETE - Eliminar (desactivar) usuario
export async function DELETE(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const userId = parseInt(params.id);

    // Verificar que el usuario existe
    const usuario = await prisma.usuario.findUnique({
      where: { id: userId },
    });

    if (!usuario) {
      return NextResponse.json(
        { error: 'Usuario no encontrado' },
        { status: 404 }
      );
    }

    // Soft delete - solo desactivar
    await prisma.usuario.update({
      where: { id: userId },
      data: { estado: false },
    });

    return NextResponse.json({
      message: 'Usuario eliminado exitosamente',
      userId,
    });
  } catch (error) {
    console.error('Error al eliminar usuario:', error);
    return NextResponse.json(
      { error: 'Error interno del servidor' },
      { status: 500 }
    );
  }
}