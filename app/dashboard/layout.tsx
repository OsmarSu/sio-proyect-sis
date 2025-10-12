import React from "react";
//import Sidebar from "@/components/layout/Sidebar";
import PageHeader from "@/components/layout/PageHeader";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex h-screen">
      {/* 1. La barra lateral que aparecerá en todas las páginas del dashboard */}
      {/* <Sidebar /> */}

      {/* 2. El contenedor principal para el resto del contenido */}
      <main className="flex-1 flex flex-col overflow-hidden">
        <PageHeader />

        <div className="flex-1 overflow-y-auto p-8">{children}</div>
      </main>
    </div>
  );
}
