// app/dashboard/proveedores/page.tsx
import { prisma } from "@/lib/prisma";
import ProveedoresClient from "./ProveedoresClient";
import { ProviderData } from "./components/ProviderModal";

export const dynamic = 'force-dynamic';

export default async function ProveedoresPage() {
  const dbProviders = await prisma.proveedor.findMany({
    include: {
      persona: true,
      contactos: true,
    },
    orderBy: {
      id: 'desc',
    },
  });

  const formattedProviders: ProviderData[] = dbProviders.map((p) => {
    // Intentar obtener el contacto principal (el primero de la lista)
    const contactoPrincipal = p.contactos[0]?.nombreContacto || "Sin contacto";

    return {
      id: p.id,
      razonSocial: `${p.persona.nombre} ${p.persona.apellido}`.trim(),
      ruc: p.persona.documento || "S/N",
      direccion: p.persona.direccion || "",
      telefono: p.persona.telefono || "",
      email: p.persona.email || "",
      contacto: contactoPrincipal,
    };
  });

  return <ProveedoresClient initialProviders={formattedProviders} />;
}