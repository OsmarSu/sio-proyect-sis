// lib/report-generators/excel.ts
import ExcelJS from 'exceljs'; // npm install exceljs
import { format } from 'date-fns'; // npm install date-fns

interface ReportDataParams {
  range: string;
}

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
  worksheet.mergeCells('A1:E1'); // Ajusta el rango de columnas según tus datos máximos
  worksheet.getCell('A1').font = { size: 16, bold: true };
  worksheet.getCell('A1').alignment = { vertical: 'middle', horizontal: 'center' as const };

  worksheet.addRow([`Generado el: ${format(new Date(), 'dd/MM/yyyy HH:mm')} | Período: ${params.range}`]);
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
  } else if (reportType === 'productos') {
    worksheet.addRow(['Productos Más Vendidos']).eachCell(cell => Object.assign(cell, subHeaderStyle));
    worksheet.addRow(['#', 'Producto', 'Cantidad Vendida', 'Ingresos (Bs.)']).eachCell(cell => Object.assign(cell, headerStyle));
    data.productosMasVendidos.forEach((item: any, index: number) => {
      worksheet.addRow([index + 1, item.nombre, item.cantidad, item.ingresos]);
    });
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
  } else if (reportType === 'inventario') {
    worksheet.addRow(['Stock por Categoría']).eachCell(cell => Object.assign(cell, subHeaderStyle));
    worksheet.addRow(['Categoría', 'Unidades en Stock', 'Valor Total (Bs.)']).eachCell(cell => Object.assign(cell, headerStyle));
    data.stockPorCategoria.forEach((item: any) => {
      worksheet.addRow([item.categoria, item.totalStock, item.valorTotal]);
    });
    worksheet.addRow([]);

    worksheet.addRow(['Productos con Stock Crítico']).eachCell(cell => Object.assign(cell, subHeaderStyle));
    worksheet.addRow(['Producto', 'Stock Actual', 'Stock Mínimo']).eachCell(cell => Object.assign(cell, headerStyle));
    data.productosBajoStock.forEach((item: any) => {
      worksheet.addRow([item.nombre, item.stock, item.minStock]);
    });
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
    column.width = maxLength < 10 ? 10 : maxLength + 2; // Ancho mínimo de 10
  });

  return await workbook.xlsx.writeBuffer() as unknown as Buffer | Uint8Array;
}