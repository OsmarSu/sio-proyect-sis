// lib/report-data-fetchers.ts
// import prisma from '@/lib/prisma'; // Asegúrate de que esta ruta a tu instancia de Prisma sea correcta
// Si aún no tienes una instancia de prisma, puedes usar datos dummy
const prisma = {
  // Simulación de Prisma para datos dummy
  // Aquí irían tus modelos y métodos reales si estuvieras conectado a la DB
};


interface ReportDataParams {
  range: string;
  // Añade otros filtros si los implementas
}

// Función auxiliar para simular el filtrado por rango de fechas
const getSimulatedDataByRange = (data: any[], range: string) => {
  // Aquí podrías implementar lógica para filtrar los datos dummy
  // basándote en el `range`. Por simplicidad, por ahora devuelve los datos completos.
  return data;
};

// ====================================================================================================
// FUNCIONES PARA OBTENER DATOS DE REPORTES (Aquí iría la lógica real con Prisma)
// ====================================================================================================

export async function getGeneralReportData(params: ReportDataParams) {
  console.log(`[Backend] Fetching general report data for range: ${params.range}`);

  // Datos simulados (reemplazar con consultas a la DB con Prisma)
  const ventasMensualesBase = [
    { mes: 'Ene', ventas: 45678, productos: 234 },
    { mes: 'Feb', ventas: 52341, productos: 267 },
    { mes: 'Mar', ventas: 48932, productos: 245 },
    { mes: 'Abr', ventas: 61245, productos: 312 },
    { mes: 'May', ventas: 58679, productos: 298 },
    { mes: 'Jun', ventas: 67432, productos: 341 }
  ];

  const ventasPorCategoriaBase = [
    { categoria: 'Construcción', valor: 35, monto: 67432 },
    { categoria: 'Muñecas', valor: 25, monto: 48210 },
    { categoria: 'Deportes', valor: 20, monto: 38567 },
    { categoria: 'Juegos', valor: 15, monto: 28934 },
    { categoria: 'Otros', valor: 5, monto: 9634 }
  ];

  // Simula el filtrado por rango
  const ventasMensuales = getSimulatedDataByRange(ventasMensualesBase, params.range);
  const ventasPorCategoria = getSimulatedDataByRange(ventasPorCategoriaBase, params.range);

  return {
    metrics: [
      { titulo: 'Ventas Totales', valor: 'Bs. 192,777', cambio: '+23%', trend: 'up' },
      { titulo: 'Productos Vendidos', valor: '1,697', cambio: '+12%', trend: 'up' },
      { titulo: 'Clientes Nuevos', valor: '34', cambio: '+5%', trend: 'up' },
      { titulo: 'Ticket Promedio', valor: 'Bs. 513', cambio: '-3%', trend: 'down' }
    ],
    ventasMensuales,
    ventasPorCategoria,
  };
}

export async function getProductosReportData(params: ReportDataParams) {
  console.log(`[Backend] Fetching products report data for range: ${params.range}`);

  const productosMasVendidosBase = [
    { nombre: 'Lego City Policía', cantidad: 145, ingresos: 36250 },
    { nombre: 'Barbie Edición Especial', cantidad: 132, ingresos: 19800 },
    { nombre: 'Carro RC 4x4', cantidad: 98, ingresos: 17640 },
    { nombre: 'Monopoly Clásico', cantidad: 87, ingresos: 8700 },
    { nombre: 'Pelota de Fútbol', cantidad: 203, ingresos: 10150 }
  ];

  const productosMasVendidos = getSimulatedDataByRange(productosMasVendidosBase, params.range);

  return {
    productosMasVendidos,
  };
}

export async function getVentasReportData(params: ReportDataParams) {
  console.log(`[Backend] Fetching sales report data for range: ${params.range}`);
  const ventasDiariasBase = [
    { dia: '01', total: 1200, items: 15 },
    { dia: '02', total: 1500, items: 18 },
    { dia: '03', total: 1300, items: 16 },
    { dia: '04', total: 1700, items: 20 },
    { dia: '05', total: 1600, items: 19 },
    { dia: '06', total: 2000, items: 25 },
    { dia: '07', total: 1800, items: 22 },
  ];
  const ventasPorVendedorBase = [
    { vendedor: 'Ana G.', ventas: 12000, comision: 1200 },
    { vendedor: 'Luis P.', ventas: 9500, comision: 950 },
    { vendedor: 'Marta R.', ventas: 11000, comision: 1100 },
    { vendedor: 'Carlos S.', ventas: 8000, comision: 800 },
  ];
  return {
    ventasDiarias: getSimulatedDataByRange(ventasDiariasBase, params.range),
    ventasPorVendedor: getSimulatedDataByRange(ventasPorVendedorBase, params.range),
  };
}

export async function getInventarioReportData(params: ReportDataParams) {
  console.log(`[Backend] Fetching inventory report data for range: ${params.range}`);
  const stockPorCategoriaBase = [
    { categoria: 'Construcción', totalStock: 800, valorTotal: 120000 },
    { categoria: 'Muñecas', totalStock: 450, valorTotal: 75000 },
    { categoria: 'Deportes', totalStock: 600, valorTotal: 50000 },
    { categoria: 'Juegos de Mesa', totalStock: 300, valorTotal: 40000 },
    { categoria: 'Electrónicos', totalStock: 200, valorTotal: 90000 },
  ];
  const productosBajoStockBase = [
    { nombre: 'Set de Bloques Pequeños', stock: 5, minStock: 10 },
    { nombre: 'Muñeca Articulada', stock: 3, minStock: 8 },
    { nombre: 'Balón de Fútbol N°5', stock: 7, minStock: 12 },
  ];
  return {
    stockPorCategoria: getSimulatedDataByRange(stockPorCategoriaBase, params.range),
    productosBajoStock: getSimulatedDataByRange(productosBajoStockBase, params.range),
  };
}

export async function getClientesReportData(params: ReportDataParams) {
  console.log(`[Backend] Fetching clients report data for range: ${params.range}`);
  const clientesPorTipoBase = [
    { tipo: 'Activos', count: 120, valor: 60 },
    { tipo: 'Nuevos', count: 30, valor: 15 },
    { tipo: 'Inactivos', count: 40, valor: 20 },
    { tipo: 'VIP', count: 10, valor: 5 },
  ];
  const clientesTopComprasBase = [
    { cliente: 'Juan Pérez', compras: 5, totalGastado: 1500 },
    { cliente: 'María G.', compras: 3, totalGastado: 1200 },
    { cliente: 'Pedro L.', compras: 7, totalGastado: 2100 },
    { cliente: 'Ana C.', compras: 4, totalGastado: 900 },
  ];
  return {
    clientesPorTipo: getSimulatedDataByRange(clientesPorTipoBase, params.range),
    clientesTopCompras: getSimulatedDataByRange(clientesTopComprasBase, params.range),
  };
}