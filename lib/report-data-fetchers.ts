// lib/report-data-fetchers.ts

interface ReportDataParams {
  range: string;
}

const translateMonth = (monthCode: string) => {
    switch (monthCode) {
        case 'Ene': return 'Enero';
        case 'Feb': return 'Febrero';
        case 'Mar': return 'Marzo';
        case 'Abr': return 'Abril';
        case 'May': return 'Mayo';
        case 'Jun': return 'Junio';
        case 'Jul': return 'Julio';
        case 'Ago': return 'Agosto';
        case 'Sep': return 'Septiembre';
        case 'Oct': return 'Octubre';
        case 'Nov': return 'Noviembre';
        case 'Dic': return 'Diciembre';
        default: return monthCode;
    }
};

const translateDay = (dayCode: string) => {
    switch (dayCode) {
        case '01': return '01'; // Días numéricos no necesitan traducción
        // ... otros días si tienes nombres de días (ej. 'Lun', 'Mar')
        default: return dayCode;
    }
};

// Función auxiliar para simular el filtrado por rango de fechas (mejorada para dar más variación)
const getSimulatedDataByRange = (baseData: any[], range: string) => {
  // En un escenario real, aquí se harían las consultas SQL/Prisma filtradas por rango de fechas
  // Esta es una simulación básica
  let data = [...baseData]; // Copia de los datos base

  if (range === 'today') {
    data = data.slice(0, 1).map(d => ({ ...d, ventas: d.ventas / 30, total: d.total / 30, cantidad: d.cantidad / 5 }));
  } else if (range === 'week') {
    data = [
      { dia: 'Lun', total: 5000, items: 25 },
      { dia: 'Mar', total: 6000, items: 30 },
      { dia: 'Mié', total: 7000, items: 35 },
      { dia: 'Jue', total: 6500, items: 32 },
      { dia: 'Vie', total: 8000, items: 40 },
      { dia: 'Sáb', total: 9000, items: 45 },
      { dia: 'Dom', total: 5500, items: 28 },
    ];
  } else if (range === 'month') {
    // Si los datos base ya tienen meses, tradúcelos aquí
    data = data.map(d => ({ ...d, mes: d.mes ? translateMonth(d.mes) : d.mes }));
  } else if (range === 'year') {
    data = data.map(d => ({ ...d, ventas: d.ventas * 12, total: d.total * 12, cantidad: d.cantidad * 6 }));
  }
  return data;
};


// ====================================================================================================
// FUNCIONES PARA OBTENER DATOS DE REPORTES (Aquí iría la lógica real con Prisma)
// ====================================================================================================

export async function getGeneralReportData(params: ReportDataParams) {
  console.log(`[Backend] Fetching general report data for range: ${params.range}`);

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

  const ventasMensuales = getSimulatedDataByRange(ventasMensualesBase, params.range);
  const ventasPorCategoria = getSimulatedDataByRange(ventasPorCategoriaBase, params.range);

  const generalActivityLog = [
    { timestamp: "2024-01-01 10:00", action: "Producto 'Lego City' añadido", user: "Admin Test" },
    { timestamp: "2024-01-02 11:30", action: "Venta 'V001' registrada", user: "Empleado 1" },
    { timestamp: "2024-01-03 14:00", action: "Stock 'Barbie' actualizado (+50)", user: "Admin Test" },
  ];


  return {
    metrics: [
      { titulo: 'Ventas Totales', valor: 'Bs. ' + (ventasMensuales.reduce((sum, item) => sum + item.ventas, 0)).toLocaleString('es-BO'), cambio: '+23%', trend: 'up' },
      { titulo: 'Productos Vendidos', valor: (ventasMensuales.reduce((sum, item) => sum + item.productos, 0)).toLocaleString('es-BO'), cambio: '+12%', trend: 'up' },
      { titulo: 'Clientes Nuevos', valor: '34', cambio: '+5%', trend: 'up' },
      { titulo: 'Ticket Promedio', valor: 'Bs. 513', cambio: '-3%', trend: 'down' }
    ],
    ventasMensuales,
    ventasPorCategoria,
    activityLog: generalActivityLog,
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

  const stockActualBase = [
    { nombre: 'Lego City Policía', stockActual: 20, minStock: 10, ubicacion: 'Estante A' },
    { nombre: 'Muñeca Barbie', stockActual: 30, minStock: 15, ubicacion: 'Depósito 1' },
    { nombre: 'Carro RC 4x4', stockActual: 5, minStock: 8, ubicacion: 'Estante B' },
    { nombre: 'Monopoly Clásico', stockActual: 12, minStock: 5, ubicacion: 'Estante C' },
  ];

  const productActivityLog = [
    { timestamp: "2024-01-01 10:00", action: "Producto 'Lego City' añadido", user: "Admin Test", productId: "P001" },
    { timestamp: "2024-01-05 11:30", action: "Stock 'Carro RC 4x4' reducido en 3", user: "Empleado 1", productId: "P003" },
    { timestamp: "2024-01-10 14:00", action: "Descripción 'Barbie' actualizada", user: "Admin Test", productId: "P002" },
  ];

  return {
    productosMasVendidos: getSimulatedDataByRange(productosMasVendidosBase, params.range),
    stockActual: getSimulatedDataByRange(stockActualBase, params.range),
    activityLog: productActivityLog,
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
  const salesHistory = [
    { id: "V001", customer: "Juan Pérez", total: 250, date: "2024-01-01", status: "Completada" },
    { id: "V002", customer: "Ana García", total: 180, date: "2024-01-02", status: "Completada" },
    { id: "V003", customer: "María López", total: 500, date: "2024-01-03", status: "Pendiente" },
  ];

  return {
    ventasDiarias: getSimulatedDataByRange(ventasDiariasBase, params.range),
    ventasPorVendedor: getSimulatedDataByRange(ventasPorVendedorBase, params.range),
    salesHistory: salesHistory,
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
    { nombre: 'Set de Bloques Pequeños', stock: 5, minStock: 10, ubicacion: 'Depósito' },
    { nombre: 'Muñeca Articulada', stock: 3, minStock: 8, ubicacion: 'Estante' },
    { nombre: 'Balón de Fútbol N°5', stock: 7, minStock: 12, ubicacion: 'Entrada' },
    { nombre: 'Carro RC 4x4', stock: 2, minStock: 5, ubicacion: 'Estante' },
  ];
  const inventoryMovements = [
    { timestamp: "2024-01-01 09:00", product: "Lego City Policía", type: "Entrada", quantity: 100, user: "Admin Test" },
    { timestamp: "2024-01-05 15:00", product: "Muñeca Barbie", type: "Salida por Venta", quantity: 5, user: "Empleado 1" },
    { timestamp: "2024-01-10 11:00", product: "Carro RC 4x4", type: "Ajuste de Stock", quantity: -2, user: "Admin Test" },
  ];

  return {
    stockPorCategoria: getSimulatedDataByRange(stockPorCategoriaBase, params.range),
    productosBajoStock: getSimulatedDataByRange(productosBajoStockBase, params.range),
    inventoryMovements: inventoryMovements,
  };
}

export async function getClientesReportData(params: ReportDataParams) {
  console.log(`[Backend] Fetching clients report data for range: ${params.range}`);
  const clientesPorTipoBase = [
    { tipo: 'Activos', count: 120, valor: 48 },
    { tipo: 'Nuevos', count: 30, valor: 12 },
    { tipo: 'Inactivos', count: 40, valor: 16 },
    { tipo: 'Mayoristas', count: 50, valor: 20 },
    { tipo: 'Minoristas', count: 10, valor: 4 },
  ];
  const clientesTopComprasBase = [
    { cliente: 'Juan Pérez', compras: 5, totalGastado: 1500 },
    { cliente: 'María G.', compras: 3, totalGastado: 1200 },
    { cliente: 'Pedro L.', compras: 7, totalGastado: 2100 },
    { cliente: 'Ana C.', compras: 4, totalGastado: 900 },
  ];
  const clientActivityLog = [
    { timestamp: "2024-01-01 10:00", clientName: "Juan Pérez", action: "Cliente registrado", user: "Admin Test" },
    { timestamp: "2024-01-15 11:30", clientName: "Ana García", action: "Datos actualizados", user: "Admin Test" },
    { timestamp: "2024-02-01 14:00", clientName: "María López", action: "Estado inactivo", user: "Admin Test" },
  ];

  return {
    clientesPorTipo: getSimulatedDataByRange(clientesPorTipoBase, params.range),
    clientesTopCompras: getSimulatedDataByRange(clientesTopComprasBase, params.range),
    clientActivityLog: clientActivityLog,
  };
}