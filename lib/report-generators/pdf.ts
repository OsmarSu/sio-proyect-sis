// lib/report-generators/pdf.ts
import PDFDocument from 'pdfkit';
import { format } from 'date-fns';
import { es } from 'date-fns/locale';
import path from 'path';
import fs from 'fs';

interface ReportDataParams {
  range: string;
}

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

const FONT_REGULAR_PATH = path.join(process.cwd(), 'lib', 'fonts', 'Roboto-Italic-VariableFont_wdth,wght.ttf');
const FONT_BOLD_PATH = path.join(process.cwd(), 'lib', 'fonts', 'Roboto-Italic-VariableFont_wdth,wght.ttf');

const FONT_REGULAR_NAME = 'CustomFontRegular';
const FONT_BOLD_NAME = 'CustomFontBold';

function checkFontExists(fontPath: string) {
    if (!fs.existsSync(fontPath)) {
        console.error(`ERROR: La fuente PDF no se encontró en: ${fontPath}`);
        throw new Error(`Font file not found: ${fontPath}`);
    }
}

export async function generatePdfReport(reportType: string, data: any, params: ReportDataParams): Promise<Buffer> {
  return new Promise((resolve, reject) => {
    try {
        checkFontExists(FONT_REGULAR_PATH);

        // === 1. CONFIGURACIÓN DEL DOCUMENTO ===
        const doc = new PDFDocument({
          margin: 50,
          font: FONT_REGULAR_PATH,
          bufferPages: true,       // NECESARIO para poner números de página al final
          autoFirstPage: true      // Dejamos que cree la primera página automáticamente
        });
        
        const buffers: Buffer[] = [];

        doc.on('data', buffers.push.bind(buffers));
        doc.on('end', () => resolve(Buffer.concat(buffers)));
        doc.on('error', reject);

        doc.registerFont(FONT_REGULAR_NAME, FONT_REGULAR_PATH);
        doc.registerFont(FONT_BOLD_NAME, FONT_BOLD_PATH);
        doc.font(FONT_REGULAR_NAME);

        // --- FUNCIONES AUXILIARES ---
        const drawTableHeader = (headers: string[], y: number, colWidths: number[]) => {
          const x = doc.page.margins.left;
          doc.save()
             .fillColor('#FFFFFF')
             .rect(x, y, colWidths.reduce((a, b) => a + b), 20)
             .fill('#5556EE')
             .stroke()
             .fillColor('#FFFFFF')
             .fontSize(9)
             .font(FONT_BOLD_NAME);

          let currentX = x;
          headers.forEach((header, i) => {
            doc.text(header, currentX, y + 6, {
              width: colWidths[i],
              align: 'center',
              lineGap: 0
            });
            currentX += colWidths[i];
          });
          doc.restore();
        };

        const drawTableRow = (row: (string | number)[], y: number, colWidths: number[], isHeader: boolean = false) => {
          const x = doc.page.margins.left;
          doc.save();
          let currentX = x;
          const rowHeight = 20;

          doc.fillColor(isHeader ? '#5556EE' : (y % 40 === 0 ? '#F8F8F8' : '#FFFFFF'))
             .rect(x, y, colWidths.reduce((a, b) => a + b), rowHeight)
             .fill()
             .stroke('#CCCCCC');

          doc.fillColor(isHeader ? '#FFFFFF' : '#333333')
             .fontSize(9)
             .font(isHeader ? FONT_BOLD_NAME : FONT_REGULAR_NAME);

          row.forEach((cellText, i) => {
            doc.text(String(cellText || ''), currentX + 5, y + 6, {
              width: colWidths[i] - 10,
              align: 'left',
              ellipsis: true,
              lineGap: 0
            });
            currentX += colWidths[i];
          });
          doc.restore();
        };

        const addTable = (doc: PDFKit.PDFDocument, headers: string[], rows: any[][], colWidths: number[], y: number) => {
          let currentY = y;
          drawTableHeader(headers, currentY, colWidths);
          currentY += 20;

          rows.forEach((row) => {
            // Verificar si necesitamos nueva página
            if (currentY + 20 > doc.page.height - doc.page.margins.bottom - 20) {
                doc.addPage();
                currentY = doc.page.margins.top + 20;
                drawTableHeader(headers, currentY, colWidths);
                currentY += 20;
            }
            drawTableRow(row, currentY, colWidths);
            currentY += 20;
          });
          return currentY;
        };

        const addSectionTitle = (doc: PDFKit.PDFDocument, title: string, moveDownAfter: number = 0.5) => {
          doc.moveDown(moveDownAfter)
             .fontSize(16)
             .font(FONT_BOLD_NAME)
             .fillColor('#333333')
             .text(title, { underline: true })
             .moveDown(0.5);
        };

        const addPageHeaderAndFooter = (doc: PDFKit.PDFDocument, currentPage: number, totalPages: number, reportType: string, paramsRange: string) => {
            const top = doc.page.margins.top;
            const bottom = doc.page.margins.bottom;
            const left = doc.page.margins.left;

            // Header
            doc.fillColor('#333333')
               .fontSize(10)
               .font(FONT_REGULAR_NAME)
               .text('Tienda de Juguetes OASIS - Panel Administrativo', left, top - 20, { align: 'left' });
            doc.text(`Reporte de ${reportType.toUpperCase()} | Período: ${translateDateRange(paramsRange)}`, left, top - 20, { align: 'right' });

            // Footer
            doc.y = doc.page.height - bottom + 10;
            doc.fontSize(8).font(FONT_REGULAR_NAME).fillColor('#666666');
            doc.text(`Página ${currentPage} de ${totalPages}`, left, doc.y, { align: 'right' });
        };

        // ==========================================
        // 2. CONTENIDO INICIAL (Página 1 ya existe por autoFirstPage: true)
        // ==========================================
        
        // CORRECCIÓN ERROR DATE-FNS: Si te da error de argumentos, usaremos un string directo o casting
        const today = new Date();
       

        doc.fontSize(20).font(FONT_BOLD_NAME).fillColor('#333333').text(`Reporte de ${reportType.toUpperCase()}`, { align: 'center' });
        
        doc.moveDown(2);


        // ==========================================
        // 3. LÓGICA DE CONTENIDO
        // ==========================================
        if (reportType === 'general') {
          addSectionTitle(doc, 'Métricas Principales');
          data.metrics.forEach((metric: any) => {
            doc.fontSize(12).font(FONT_REGULAR_NAME).text(`${metric.titulo}: ${metric.valor} (${metric.cambio})`);
          });
          doc.moveDown(1);

          addSectionTitle(doc, 'Ventas Mensuales');
          const ventasMensualesHeaders = ['Mes', 'Ventas (Bs.)', 'Productos Vendidos'];
          const ventasMensualesRows = data.ventasMensuales.map((item: any) => [item.mes, item.ventas.toLocaleString('es-BO'), item.productos]);
          doc.y = addTable(doc, ventasMensualesHeaders, ventasMensualesRows, [70, 100, 150], doc.y);
          doc.moveDown(1);

          // === CORRECCIÓN DE SINTAXIS AQUÍ ===
          addSectionTitle(doc, 'Ventas por Categoría');
          const ventasPorCategoriaHeaders = ['Categoría', 'Porcentaje', 'Monto (Bs.)'];
          const ventasPorCategoriaRows = data.ventasPorCategoria.map((item: any) => [item.categoria, `${item.valor}%`, item.monto.toLocaleString('es-BO')]);
          doc.y = addTable(doc, ventasPorCategoriaHeaders, ventasPorCategoriaRows, [150, 80, 100], doc.y);
          // ===================================
          doc.moveDown(1);

          if (data.activityLog && data.activityLog.length > 0) {
            addSectionTitle(doc, 'Bitácora de Actividades');
            const activityLogHeaders = ['Fecha/Hora', 'Acción', 'Usuario'];
            const activityLogRows = data.activityLog.map((log: any) => [log.timestamp, log.action, log.user]);
            doc.y = addTable(doc, activityLogHeaders, activityLogRows, [100, 250, 100], doc.y);
          }

        } else if (reportType === 'productos') {
          addSectionTitle(doc, 'Productos Más Vendidos');
          const productosMasVendidosHeaders = ['#', 'Producto', 'Cantidad Vendida', 'Ingresos (Bs.)'];
          const productosMasVendidosRows = data.productosMasVendidos.map((item: any, index: number) => [index + 1, item.nombre, item.cantidad, item.ingresos.toLocaleString('es-BO')]);
          doc.y = addTable(doc, productosMasVendidosHeaders, productosMasVendidosRows, [30, 150, 80, 100], doc.y);
          doc.moveDown(1);

          addSectionTitle(doc, 'Stock Actual de Productos');
          const stockActualHeaders = ['Producto', 'Stock Actual', 'Stock Mínimo', 'Ubicación', 'Estado'];
          const stockActualRows = data.stockActual.map((item: any) => {
            const status = item.stockActual < item.minStock ? 'Bajo Stock' : 'En Stock';
            return [item.nombre, item.stockActual, item.minStock, item.ubicacion || 'N/A', status];
          });
          doc.y = addTable(doc, stockActualHeaders, stockActualRows, [150, 80, 80, 100, 80], doc.y);
          doc.moveDown(1);

          if (data.activityLog && data.activityLog.length > 0) {
            addSectionTitle(doc, 'Bitácora de Actividades de Productos');
            const productActivityLogHeaders = ['Fecha/Hora', 'Acción', 'Usuario', 'Producto ID'];
            const productActivityLogRows = data.activityLog.map((log: any) => [log.timestamp, log.action, log.user, log.productId || 'N/A']);
            doc.y = addTable(doc, productActivityLogHeaders, productActivityLogRows, [100, 180, 100, 100], doc.y);
          }

        } else if (reportType === 'ventas') {
          addSectionTitle(doc, 'Ventas Diarias');
          const ventasDiariasHeaders = ['Día', 'Total (Bs.)', 'Items Vendidos'];
          const ventasDiariasRows = data.ventasDiarias.map((item: any) => [item.dia, item.total.toLocaleString('es-BO'), item.items]);
          doc.y = addTable(doc, ventasDiariasHeaders, ventasDiariasRows, [50, 100, 100], doc.y);
          doc.moveDown(1);

          addSectionTitle(doc, 'Ventas por Vendedor');
          const ventasPorVendedorHeaders = ['Vendedor', 'Ventas (Bs.)', 'Comisión (Bs.)'];
          const ventasPorVendedorRows = data.ventasPorVendedor.map((item: any) => [item.vendedor, item.ventas.toLocaleString('es-BO'), item.comision.toLocaleString('es-BO')]);
          doc.y = addTable(doc, ventasPorVendedorHeaders, ventasPorVendedorRows, [100, 100, 100], doc.y);
          doc.moveDown(1);

          if (data.salesHistory && data.salesHistory.length > 0) {
            addSectionTitle(doc, 'Historial Detallado de Ventas');
            const salesHistoryHeaders = ['ID Venta', 'Cliente', 'Total (Bs.)', 'Fecha', 'Estado'];
            const salesHistoryRows = data.salesHistory.map((sale: any) => [sale.id, sale.customer, sale.total.toLocaleString('es-BO'), sale.date, sale.status]);
            doc.y = addTable(doc, salesHistoryHeaders, salesHistoryRows, [80, 150, 90, 80, 80], doc.y);
          }
        } else if (reportType === 'inventario') {
          addSectionTitle(doc, 'Stock por Categoría');
          const stockPorCategoriaHeaders = ['Categoría', 'Unidades en Stock', 'Valor Total (Bs.)'];
          const stockPorCategoriaRows = data.stockPorCategoria.map((item: any) => [item.categoria, item.totalStock, item.valorTotal.toLocaleString('es-BO')]);
          doc.y = addTable(doc, stockPorCategoriaHeaders, stockPorCategoriaRows, [150, 100, 120], doc.y);
          doc.moveDown(1);

          addSectionTitle(doc, 'Productos con Stock Crítico');
          const productosBajoStockHeaders = ['Producto', 'Stock Actual', 'Stock Mínimo', 'Ubicación', 'Acción'];
          const productosBajoStockRows = data.productosBajoStock.map((item: any) => [item.nombre, item.stock, item.minStock, item.ubicacion || 'N/A', 'Reabastecer']);
          doc.y = addTable(doc, productosBajoStockHeaders, productosBajoStockRows, [150, 80, 80, 100, 80], doc.y);
          doc.moveDown(1);

          if (data.inventoryMovements && data.inventoryMovements.length > 0) {
            addSectionTitle(doc, 'Movimientos de Inventario');
            const inventoryMovementsHeaders = ['Fecha/Hora', 'Producto', 'Tipo', 'Cantidad', 'Usuario'];
            const inventoryMovementsRows = data.inventoryMovements.map((mov: any) => [mov.timestamp, mov.product, mov.type, mov.quantity, mov.user]);
            doc.y = addTable(doc, inventoryMovementsHeaders, inventoryMovementsRows, [100, 150, 80, 60, 100], doc.y);
          }
        } else if (reportType === 'clientes') {
          addSectionTitle(doc, 'Clientes por Tipo');
          const clientesPorTipoHeaders = ['Tipo', 'Cantidad', 'Porcentaje'];
          const clientesPorTipoRows = data.clientesPorTipo.map((item: any) => [item.tipo, item.count, `${item.valor}%`]);
          doc.y = addTable(doc, clientesPorTipoHeaders, clientesPorTipoRows, [100, 80, 80], doc.y);
          doc.moveDown(1);

          addSectionTitle(doc, 'Top Clientes por Compras');
          const clientesTopComprasHeaders = ['Cliente', 'Compras Realizadas', 'Total Gastado (Bs.)'];
          const clientesTopComprasRows = data.clientesTopCompras.map((item: any) => [item.cliente, item.compras, item.totalGastado.toLocaleString('es-BO')]);
          doc.y = addTable(doc, clientesTopComprasHeaders, clientesTopComprasRows, [150, 100, 100], doc.y);
          doc.moveDown(1);

          if (data.clientActivityLog && data.clientActivityLog.length > 0) {
            addSectionTitle(doc, 'Bitácora de Clientes');
            const clientActivityLogHeaders = ['Fecha/Hora', 'Cliente', 'Acción', 'Usuario'];
            const clientActivityLogRows = data.clientActivityLog.map((log: any) => [log.timestamp, log.clientName, log.action, log.user]);
            doc.y = addTable(doc, clientActivityLogHeaders, clientActivityLogRows, [100, 150, 150, 100], doc.y);
          }
        }

        // ==========================================
        // 4. APLICAR HEADER/FOOTER (SOLUCIÓN SWITCHTOPAGE)
        // ==========================================
        const range = doc.bufferedPageRange(); // Obtener rango de páginas buffered
        // IMPORTANTE: Iterar usando range.start y count
        for (let i = range.start; i < range.start + range.count; i++) {
          doc.switchToPage(i); // Cambiar a la página 'i'
          addPageHeaderAndFooter(doc, i + 1, range.count, reportType, params.range);
        }

        doc.end();
    } catch (error) {
        console.error("Error al generar PDF:", error);
        reject(error);
    }
  });
}