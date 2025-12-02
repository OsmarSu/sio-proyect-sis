// lib/report-generators/excel.ts
import ExcelJS from 'exceljs';
import { format } from 'date-fns';
import { es } from 'date-fns/locale'; // <--- IMPORTAR EL LOCALE DE ESPAÑOL

interface ReportDataParams {
  range: string;
}

// Función de traducción para los rangos de fecha (para Excel)
const translateDateRange = (range: string) => {
    switch (range) {
      case 'today': return 'Hoy';
      case 'week': return 'Esta Semana';
      case 'month': return 'Este Mes';
      case 'year': return 'Este Año';
      case 'custom': return 'Personalizado';
      default: return range;
    }
  };

export async function generateExcelReport(reportType: string, data: any, params: ReportDataParams): Promise<Buffer | Uint8Array> {
  const workbook = new ExcelJS.Workbook();
  const worksheet = workbook.addWorksheet(`Reporte de ${reportType}`);

  // Estilos comunes
  const headerStyle = {
    font: { bold: true, color: { argb: 'FFFFFFFF' } },
    fill: { type: 'pattern', pattern: 'solid', fgColor: { argb: 'FF5556EE' } }, // Color PRIMARY #5556EE
    alignment: { vertical: 'middle', horizontal: 'center' as const },
    border: {
      top: { style: 'thin' }, bottom: { style: 'thin' },
      left: { style: 'thin' }, right: { style: 'thin' },
    }
  };
  const subHeaderStyle = {
    font: { bold: true, size: 14 },
    alignment: { vertical: 'middle', horizontal: 'left' as const },
  };

  // Información del reporte
  worksheet.addRow([`Reporte de ${reportType.toUpperCase()}`]);
  worksheet.mergeCells('A1:E1');
  worksheet.getCell('A1').font = { size: 16, bold: true };
  worksheet.getCell('A1').alignment = { vertical: 'middle', horizontal: 'center' as const };


  worksheet.mergeCells('A2:E2');
  worksheet.getCell('A2').alignment = { vertical: 'middle', horizontal: 'center' as const };
  worksheet.addRow([]); // Línea en blanco para separar

  if (reportType === 'general') {
    worksheet.addRow(['Métricas Principales']).eachCell(cell => Object.assign(cell, subHeaderStyle));
    worksheet.addRow(['Título', 'Valor', 'Cambio']).eachCell(cell => Object.assign(cell, headerStyle));
    data.metrics.forEach((metric: any) => {
      worksheet.addRow([metric.titulo, metric.valor, metric.cambio]);
    });
    worksheet.addRow([]);

    worksheet.addRow(['Ventas Mensuales']).eachCell(cell => Object.assign(cell, subHeaderStyle));
    worksheet.addRow(['Mes', 'Ventas (Bs.)', 'Productos Vendidos']).eachCell(cell => Object.assign(cell, headerStyle));
    data.ventasMensuales.forEach((item: any) => {
      worksheet.addRow([item.mes, item.ventas, item.productos]);
    });
    worksheet.addRow([]);

    worksheet.addRow(['Ventas por Categoría']).eachCell(cell => Object.assign(cell, subHeaderStyle));
    worksheet.addRow(['Categoría', 'Porcentaje', 'Monto (Bs.)']).eachCell(cell => Object.assign(cell, headerStyle));
    data.ventasPorCategoria.forEach((item: any) => {
      worksheet.addRow([item.categoria, `${item.valor}%`, item.monto]);
    });
    worksheet.addRow([]);

    if (data.activityLog && data.activityLog.length > 0) {
      worksheet.addRow(['Bitácora de Actividades']).eachCell(cell => Object.assign(cell, subHeaderStyle));
      worksheet.addRow(['Fecha/Hora', 'Acción', 'Usuario']).eachCell(cell => Object.assign(cell, headerStyle));
      data.activityLog.forEach((log: any) => {
          worksheet.addRow([log.timestamp, log.action, log.user]);
      });
    }

  } else if (reportType === 'productos') {
    worksheet.addRow(['Productos Más Vendidos']).eachCell(cell => Object.assign(cell, subHeaderStyle));
    worksheet.addRow(['#', 'Producto', 'Cantidad Vendida', 'Ingresos (Bs.)']).eachCell(cell => Object.assign(cell, headerStyle));
    data.productosMasVendidos.forEach((item: any, index: number) => {
      worksheet.addRow([index + 1, item.nombre, item.cantidad, item.ingresos]);
    });
    worksheet.addRow([]);

    worksheet.addRow(['Stock Actual de Productos']).eachCell(cell => Object.assign(cell, subHeaderStyle));
    worksheet.addRow(['Producto', 'Stock Actual', 'Stock Mínimo', 'Ubicación', 'Estado']).eachCell(cell => Object.assign(cell, headerStyle));
    data.stockActual.forEach((item: any) => {
      const status = item.stockActual < item.minStock ? 'Bajo Stock' : 'En Stock';
      worksheet.addRow([item.nombre, item.stockActual, item.minStock, item.ubicacion || 'N/A', status]);
    });
    worksheet.addRow([]);

    if (data.activityLog && data.activityLog.length > 0) {
      worksheet.addRow(['Bitácora de Actividades de Productos']).eachCell(cell => Object.assign(cell, subHeaderStyle));
      worksheet.addRow(['Fecha/Hora', 'Acción', 'Usuario', 'Producto ID']).eachCell(cell => Object.assign(cell, headerStyle));
      data.activityLog.forEach((log: any) => {
          worksheet.addRow([log.timestamp, log.action, log.user, log.productId || 'N/A']);
      });
    }

  } else if (reportType === 'ventas') {
    worksheet.addRow(['Ventas Diarias']).eachCell(cell => Object.assign(cell, subHeaderStyle));
    worksheet.addRow(['Día', 'Total (Bs.)', 'Items Vendidos']).eachCell(cell => Object.assign(cell, headerStyle));
    data.ventasDiarias.forEach((item: any) => {
      worksheet.addRow([item.dia, item.total, item.items]);
    });
    worksheet.addRow([]);

    worksheet.addRow(['Ventas por Vendedor']).eachCell(cell => Object.assign(cell, subHeaderStyle));
    worksheet.addRow(['Vendedor', 'Ventas (Bs.)', 'Comisión (Bs.)']).eachCell(cell => Object.assign(cell, headerStyle));
    data.ventasPorVendedor.forEach((item: any) => {
      worksheet.addRow([item.vendedor, item.ventas, item.comision]);
    });
    worksheet.addRow([]);

    if (data.salesHistory && data.salesHistory.length > 0) {
        worksheet.addRow(['Historial Detallado de Ventas']).eachCell(cell => Object.assign(cell, subHeaderStyle));
        worksheet.addRow(['ID Venta', 'Cliente', 'Total (Bs.)', 'Fecha', 'Estado']).eachCell(cell => Object.assign(cell, headerStyle));
        data.salesHistory.forEach((sale: any) => {
            worksheet.addRow([sale.id, sale.customer, sale.total, sale.date, sale.status]);
        });
    }
  } else if (reportType === 'inventario') {
    worksheet.addRow(['Stock por Categoría']).eachCell(cell => Object.assign(cell, subHeaderStyle));
    worksheet.addRow(['Categoría', 'Unidades en Stock', 'Valor Total (Bs.)']).eachCell(cell => Object.assign(cell, headerStyle));
    data.stockPorCategoria.forEach((item: any) => {
      worksheet.addRow([item.categoria, item.totalStock, item.valorTotal]);
    });
    worksheet.addRow([]);

    worksheet.addRow(['Productos con Stock Crítico']).eachCell(cell => Object.assign(cell, subHeaderStyle));
    worksheet.addRow(['Producto', 'Stock Actual', 'Stock Mínimo', 'Ubicación', 'Acción']).eachCell(cell => Object.assign(cell, headerStyle));
    data.productosBajoStock.forEach((item: any) => {
      worksheet.addRow([item.nombre, item.stock, item.minStock, item.ubicacion || 'N/A', 'Reabastecer']);
    });
    worksheet.addRow([]);

    if (data.inventoryMovements && data.inventoryMovements.length > 0) {
        worksheet.addRow(['Movimientos de Inventario']).eachCell(cell => Object.assign(cell, subHeaderStyle));
        worksheet.addRow(['Fecha/Hora', 'Producto', 'Tipo', 'Cantidad', 'Usuario']).eachCell(cell => Object.assign(cell, headerStyle));
        data.inventoryMovements.forEach((mov: any) => {
            worksheet.addRow([mov.timestamp, mov.product, mov.type, mov.quantity, mov.user]);
        });
    }
  } else if (reportType === 'clientes') {
    worksheet.addRow(['Clientes por Tipo']).eachCell(cell => Object.assign(cell, subHeaderStyle));
    worksheet.addRow(['Tipo', 'Cantidad', 'Porcentaje']).eachCell(cell => Object.assign(cell, headerStyle));
    data.clientesPorTipo.forEach((item: any) => {
      worksheet.addRow([item.tipo, item.count, `${item.valor}%`]);
    });
    worksheet.addRow([]);

    worksheet.addRow(['Top Clientes por Compras']).eachCell(cell => Object.assign(cell, subHeaderStyle));
    worksheet.addRow(['Cliente', 'Compras Realizadas', 'Total Gastado (Bs.)']).eachCell(cell => Object.assign(cell, headerStyle));
    data.clientesTopCompras.forEach((item: any) => {
      worksheet.addRow([item.cliente, item.compras, item.totalGastado]);
    });
    worksheet.addRow([]);

    if (data.clientActivityLog && data.clientActivityLog.length > 0) {
        worksheet.addRow(['Bitácora de Clientes']).eachCell(cell => Object.assign(cell, subHeaderStyle));
        worksheet.addRow(['Fecha/Hora', 'Cliente', 'Acción', 'Usuario']).eachCell(cell => Object.assign(cell, headerStyle));
        data.clientActivityLog.forEach((log: any) => {
            worksheet.addRow([log.timestamp, log.clientName, log.action, log.user]);
        });
    }
  }

  // Ajustar ancho de columnas automáticamente
  worksheet.columns.forEach((column) => {
    if (!column || typeof column.eachCell !== 'function') return;
    let maxLength = 0;
    column.eachCell({ includeEmpty: true }, (cell) => {
      const columnLength = cell.value ? String(cell.value).length : 10;
      if (columnLength > maxLength) {
        maxLength = columnLength;
      }
    });
    column.width = maxLength < 10 ? 10 : maxLength + 2;
  });

  return await workbook.xlsx.writeBuffer() as unknown as Buffer | Uint8Array;
}