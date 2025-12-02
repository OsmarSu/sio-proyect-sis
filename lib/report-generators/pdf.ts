// lib/report-generators/pdf.ts
import PDFDocument from 'pdfkit';
import { format } from 'date-fns';
import path from 'path';
import fs from 'fs';

interface ReportDataParams {
  range: string;
}

// === VERIFICAR ESTA RUTA DE FUENTE NUEVAMENTE ===
// Asegúrate de que el archivo 'Roboto-Italic-VariableFont_wdth,wght.ttf' existe en 'lib/fonts/'
const FONT_PATH = path.join(process.cwd(), 'lib', 'fonts', 'Roboto-Italic-VariableFont_wdth,wght.ttf');

function checkFontExists(fontPath: string) {
    console.log(`Intentando cargar la fuente PDF desde: ${fontPath}`);
    if (!fs.existsSync(fontPath)) {
        console.error(`ERROR: La fuente PDF no se encontró en: ${fontPath}`);
        throw new Error(`Font file not found: ${fontPath}`);
    }
}

export async function generatePdfReport(reportType: string, data: any, params: ReportDataParams): Promise<Buffer> {
  return new Promise((resolve, reject) => {
    checkFontExists(FONT_PATH);

    const doc = new PDFDocument({ margin: 50 });
    const buffers: Buffer[] = [];

    doc.on('data', buffers.push.bind(buffers));
    doc.on('end', () => resolve(Buffer.concat(buffers)));
    doc.on('error', reject);

    doc.registerFont('CustomFont', FONT_PATH);

    // Header del documento PDF
    doc.fontSize(24).font('CustomFont').text(`Reporte de ${reportType.toUpperCase()}`, { align: 'center' });
    doc.fontSize(12).font('CustomFont').text(`Generado el: ${format(new Date(), 'dd/MM/yyyy HH:mm')} | Período: ${params.range}`, { align: 'center' });
    doc.moveDown(2);

    // Contenido específico según el tipo de reporte
    if (reportType === 'general') {
      doc.fontSize(18).font('CustomFont').text('Métricas Principales', { underline: true }).moveDown(0.5);
      data.metrics.forEach((metric: any) => {
        doc.fontSize(12).font('CustomFont').text(`${metric.titulo}: ${metric.valor} (${metric.cambio})`);
      });
      doc.moveDown(1);

      doc.fontSize(18).font('CustomFont').text('Ventas Mensuales', { underline: true }).moveDown(0.5);
      doc.fontSize(10).font('CustomFont').text('Mes - Ventas (Bs.) - Productos Vendidos');
      data.ventasMensuales.forEach((item: any) => {
        doc.fontSize(10).font('CustomFont').text(`${item.mes} - ${item.ventas.toLocaleString()} - ${item.productos}`);
      });
      doc.moveDown(1);

      doc.fontSize(18).font('CustomFont').text('Ventas por Categoría', { underline: true }).moveDown(0.5);
      doc.fontSize(10).font('CustomFont').text('Categoría - Porcentaje - Monto (Bs.)');
      data.ventasPorCategoria.forEach((item: any) => {
        doc.fontSize(10).font('CustomFont').text(`${item.categoria} - ${item.valor}% - ${item.monto.toLocaleString()}`);
      });
      doc.moveDown(1);

      // === NUEVA SECCIÓN DE HISTORIAL PARA PDF ===
      if (data.activityLog && data.activityLog.length > 0) {
        doc.addPage(); // Puedes añadir una nueva página para el historial si es largo
        doc.fontSize(18).font('CustomFont').text('Bitácora de Actividades', { underline: true }).moveDown(0.5);
        doc.fontSize(10).font('CustomFont').text('Fecha/Hora - Acción - Usuario');
        data.activityLog.forEach((log: any) => {
            doc.fontSize(10).font('CustomFont').text(`${log.timestamp} - ${log.action} - ${log.user}`);
        });
      }
      // ^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^

    } else if (reportType === 'productos') {
      doc.fontSize(18).font('CustomFont').text('Productos Más Vendidos', { underline: true }).moveDown(0.5);
      doc.fontSize(10).font('CustomFont').text('# - Producto - Cantidad Vendida - Ingresos (Bs.)');
      data.productosMasVendidos.forEach((item: any, index: number) => {
        doc.fontSize(10).font('CustomFont').text(`${index + 1}. ${item.nombre} - ${item.cantidad} uds. - ${item.ingresos.toLocaleString()} Bs.`);
      });
      doc.moveDown(1);

      doc.fontSize(18).font('CustomFont').text('Stock Actual de Productos', { underline: true }).moveDown(0.5);
      doc.fontSize(10).font('CustomFont').text('Producto - Stock Actual - Stock Mínimo - Estado');
      data.stockActual.forEach((item: any) => {
        const status = item.stockActual < item.minStock ? 'Bajo Stock' : 'En Stock';
        doc.fontSize(10).font('CustomFont').text(`${item.nombre} - ${item.stockActual} uds. - ${item.minStock} uds. - ${status}`);
      });
      doc.moveDown(1);

      // === NUEVA SECCIÓN DE HISTORIAL PARA PDF (Productos) ===
      if (data.activityLog && data.activityLog.length > 0) {
        doc.addPage();
        doc.fontSize(18).font('CustomFont').text('Bitácora de Actividades de Productos', { underline: true }).moveDown(0.5);
        doc.fontSize(10).font('CustomFont').text('Fecha/Hora - Acción - Usuario - Producto ID');
        data.activityLog.forEach((log: any) => {
            doc.fontSize(10).font('CustomFont').text(`${log.timestamp} - ${log.action} - ${log.user} - ${log.productId || 'N/A'}`);
        });
      }
      // ^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^

    } else if (reportType === 'ventas') {
        doc.fontSize(18).font('CustomFont').text('Ventas Diarias', { underline: true }).moveDown(0.5);
        doc.fontSize(10).font('CustomFont').text('Día - Total (Bs.) - Items');
        data.ventasDiarias.forEach((item: any) => {
            doc.fontSize(10).font('CustomFont').text(`${item.dia} - ${item.total.toLocaleString()} - ${item.items}`);
        });
        doc.moveDown(1);

        doc.fontSize(18).font('CustomFont').text('Ventas por Vendedor', { underline: true }).moveDown(0.5);
        doc.fontSize(10).font('CustomFont').text('Vendedor - Ventas (Bs.) - Comisión (Bs.)');
        data.ventasPorVendedor.forEach((item: any) => {
            doc.fontSize(10).font('CustomFont').text(`${item.vendedor} - ${item.ventas.toLocaleString()} - ${item.comision.toLocaleString()}`);
        });
        doc.moveDown(1);

        // === NUEVA SECCIÓN DE HISTORIAL PARA PDF (Ventas) ===
        if (data.salesHistory && data.salesHistory.length > 0) {
            doc.addPage();
            doc.fontSize(18).font('CustomFont').text('Historial Detallado de Ventas', { underline: true }).moveDown(0.5);
            doc.fontSize(10).font('CustomFont').text('ID Venta - Cliente - Total (Bs.) - Fecha - Estado');
            data.salesHistory.forEach((sale: any) => {
                doc.fontSize(10).font('CustomFont').text(`${sale.id} - ${sale.customer} - ${sale.total.toLocaleString()} - ${sale.date} - ${sale.status}`);
            });
        }
        // ^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^
    } else if (reportType === 'inventario') {
        doc.fontSize(18).font('CustomFont').text('Stock por Categoría', { underline: true }).moveDown(0.5);
        doc.fontSize(10).font('CustomFont').text('Categoría - Unidades en Stock - Valor Total (Bs.)');
        data.stockPorCategoria.forEach((item: any) => {
            doc.fontSize(10).font('CustomFont').text(`${item.categoria} - ${item.totalStock} uds. - ${item.valorTotal.toLocaleString()} Bs.`);
        });
        doc.moveDown(1);

        doc.fontSize(18).font('CustomFont').text('Productos con Stock Crítico', { underline: true }).moveDown(0.5);
        doc.fontSize(10).font('CustomFont').text('Producto - Stock Actual - Stock Mínimo - Ubicación');
        data.productosBajoStock.forEach((item: any) => {
            doc.fontSize(10).font('CustomFont').text(`${item.nombre} - ${item.stock} uds. - ${item.minStock} uds. - ${item.ubicacion || 'N/A'}`);
        });
        doc.moveDown(1);

        // === NUEVA SECCIÓN DE HISTORIAL PARA PDF (Inventario) ===
        if (data.inventoryMovements && data.inventoryMovements.length > 0) {
            doc.addPage();
            doc.fontSize(18).font('CustomFont').text('Movimientos de Inventario', { underline: true }).moveDown(0.5);
            doc.fontSize(10).font('CustomFont').text('Fecha/Hora - Producto - Tipo - Cantidad - Usuario');
            data.inventoryMovements.forEach((mov: any) => {
                doc.fontSize(10).font('CustomFont').text(`${mov.timestamp} - ${mov.product} - ${mov.type} - ${mov.quantity} - ${mov.user}`);
            });
        }
        // ^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^
    } else if (reportType === 'clientes') {
        doc.fontSize(18).font('CustomFont').text('Clientes por Tipo', { underline: true }).moveDown(0.5);
        doc.fontSize(10).font('CustomFont').text('Tipo - Cantidad - Porcentaje');
        data.clientesPorTipo.forEach((item: any) => {
            doc.fontSize(10).font('CustomFont').text(`${item.tipo} - ${item.count} - ${item.valor}%`);
        });
        doc.moveDown(1);

        doc.fontSize(18).font('CustomFont').text('Top Clientes por Compras', { underline: true }).moveDown(0.5);
        doc.fontSize(10).font('CustomFont').text('Cliente - Compras Realizadas - Total Gastado (Bs.)');
        data.clientesTopCompras.forEach((item: any) => {
            doc.fontSize(10).font('CustomFont').text(`${item.cliente} - ${item.compras} - ${item.totalGastado.toLocaleString()} Bs.`);
        });
        doc.moveDown(1);

        // === NUEVA SECCIÓN DE HISTORIAL PARA PDF (Clientes) ===
        if (data.clientActivityLog && data.clientActivityLog.length > 0) {
            doc.addPage();
            doc.fontSize(18).font('CustomFont').text('Bitácora de Clientes', { underline: true }).moveDown(0.5);
            doc.fontSize(10).font('CustomFont').text('Fecha/Hora - Cliente - Acción - Usuario');
            data.clientActivityLog.forEach((log: any) => {
                doc.fontSize(10).font('CustomFont').text(`${log.timestamp} - ${log.clientName} - ${log.action} - ${log.user}`);
            });
        }
        // ^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^
    }

    doc.end();
  });
}