// app/dashboard/precios/page.tsx
import { redirect } from "next/navigation";

export default function Page() {
  // Cuando alguien entre a /dashboard/precios, lo mandamos a /listado automáticamente
  redirect("/dashboard/precios/listado");
  // return <div>Precios Root</div>;
}