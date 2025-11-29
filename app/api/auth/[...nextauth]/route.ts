import NextAuth, { NextAuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

export const authOptions: NextAuthOptions = {
  providers: [
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "text" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) {
          throw new Error("Credenciales requeridas");
        }

        const usuario = await prisma.usuario.findFirst({
          where: {
            estado: true,
            personal: {
              persona: { email: credentials.email }
            }
          },
          include: {
            personal: { include: { persona: true, cargo: true } }
          }
        });

        if (!usuario || !usuario.passwordHash) {
          throw new Error("Usuario no encontrado");
        }

        const isValid = await bcrypt.compare(credentials.password, usuario.passwordHash);

        if (!isValid) throw new Error("Contraseña incorrecta");

        return {
          id: usuario.id.toString(),
          name: `${usuario.personal.persona.nombre} ${usuario.personal.persona.apellido}`,
          email: usuario.personal.persona.email,
          role: "ADMIN" // O el rol que corresponda
        };
      },
    }),
  ],
  session: {
    strategy: "jwt",
    maxAge: 30 * 24 * 60 * 60, // 30 días
  },
  secret: process.env.NEXTAUTH_SECRET,
  // ¡SIN COOKIES MANUALES AQUÍ!
};

const handler = NextAuth(authOptions);
export { handler as GET, handler as POST };