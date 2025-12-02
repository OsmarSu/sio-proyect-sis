import NextAuth, { NextAuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";

// Instanciamos Prisma (o impórtalo de tu lib/prisma.ts si ya tienes uno global)
const prisma = new PrismaClient();

export const authOptions: NextAuthOptions = {
  providers: [
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        email: { label: "Usuario o Email", type: "text" },
        password: { label: "Contraseña", type: "password" },
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) {
          throw new Error("Por favor ingrese sus credenciales");
        }

        const input = credentials.email; // Puede ser usuario o email

        // 🔍 BÚSQUEDA INTELIGENTE (Usuario O Email)
        const usuario = await prisma.usuario.findFirst({
          where: {
            estado: true, // Solo usuarios activos
            OR: [
              { username: input }, // 1. Busca por nombre de usuario (ej: "daniel")
              { personal: { persona: { email: input } } } // 2. Busca por email (ej: "daniel@oasis.com")
            ]
          },
          include: {
            personal: { 
              include: { 
                persona: true, // Para sacar el nombre real
                cargo: true    // Para saber su cargo
              } 
            },
            roles: { include: { rol: true } } // Traemos los roles para permisos
          }
        });

        // 1. Verificación de existencia
        if (!usuario || !usuario.passwordHash) {
          throw new Error("Usuario no encontrado o inactivo");
        }

        // 2. Verificación de contraseña
        const isValid = await bcrypt.compare(credentials.password, usuario.passwordHash);

        if (!isValid) {
          throw new Error("Contraseña incorrecta");
        }

        // 3. Determinar el ROL principal
        // Si tiene roles asignados tomamos el primero, si no, usamos el cargo como fallback
        const rolPrincipal = usuario.roles.length > 0 
          ? usuario.roles[0].rol.nombre 
          : "Usuario";

        // ✅ ÉXITO: Retornamos los datos a la sesión
        return {
          id: usuario.id.toString(),
          name: `${usuario.personal.persona.nombre} ${usuario.personal.persona.apellido}`,
          email: usuario.personal.persona.email,
          image: null, // Podrías poner una foto aquí si tuvieras
          role: rolPrincipal // Pasamos el rol real a la sesión
        };
      },
    }),
  ],
  pages: {
    signIn: '/login', // Si tienes una página de login personalizada
  },
  session: {
    strategy: "jwt",
    maxAge: 30 * 24 * 60 * 60, // 30 días
  },
  callbacks: {
    // Estas callbacks aseguran que el ID y el ROL viajen al frontend
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id;
        // @ts-ignore
        token.role = user.role;
      }
      return token;
    },
    async session({ session, token }) {
      if (session.user) {
        // @ts-ignore
        session.user.id = token.id;
        // @ts-ignore
        session.user.role = token.role;
      }
      return session;
    }
  },
  secret: process.env.NEXTAUTH_SECRET,
};

const handler = NextAuth(authOptions);
export { handler as GET, handler as POST };