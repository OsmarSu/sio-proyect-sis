// app/api/reports/[slug]/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { generatePdfReport } from '@/lib/report-generators/pdf'; // Tendrás que crear estos módulos
import { generateExcelReport } from '@/lib/report-generators/excel'; // Tendrás que crear estos módulos
import {
  getGeneralReportData,
  getProductosReportData,
  getVentasReportData,
  getInventarioReportData,
  getClientesReportData,
} from '@/lib/report-data-fetchers'; // Tendrás que crear/actualizar estos módulos

// Interfaz para los parámetros que se pasan a las funciones de obtención de datos
interface ReportDataParams {
  range: string;
  // Añade otros filtros si los implementas (ej. categoryId, supplierId)
}

export async function GET(request: NextRequest, { params }: { params: { slug: string } }) {
  const reportType = params.slug; // 'general', 'productos', 'ventas', etc.
  const searchParams = request.nextUrl.searchParams;
  const format = searchParams.get('format'); // 'pdf' o 'excel'
  const dateRange = searchParams.get('range') || 'month'; // Por defecto 'month'

  const reportDataParams: ReportDataParams = { range: dateRange };

  let data: any; // Tipo de dato flexible para los datos del reporte

  // 1. Obtener los datos del reporte de tu base de datos (usando Prisma)
  try {
    switch (reportType) {
      case 'general':
        data = await getGeneralReportData(reportDataParams);
        break;
      case 'productos':
        data = await getProductosReportData(reportDataParams);
        break;
      case 'ventas':
        data = await getVentasReportData(reportDataParams);
        break;
      case 'inventario':
        data = await getInventarioReportData(reportDataParams);
        break;
      case 'clientes':
        data = await getClientesReportData(reportDataParams);
        break;
      default:
        return NextResponse.json({ error: 'Tipo de reporte no válido' }, { status: 400 });
    }
  } catch (dbError: any) {
    console.error(`Error al obtener datos para el reporte ${reportType}:`, dbError);
    return NextResponse.json({ error: `Error interno del servidor al obtener los datos: ${dbError.message}` }, { status: 500 });
  }

  // Si no se encontraron datos
  if (!data || Object.keys(data).length === 0 || (Array.isArray(data) && data.length === 0)) {
    return NextResponse.json({ error: 'No se encontraron datos para el reporte seleccionado con los filtros actuales.' }, { status: 404 });
  }

  // Si no se especifica formato, o es un GET normal, devolver los datos como JSON
  if (!format) {
    return NextResponse.json(data);
  }

  // 2. Generar el reporte en el formato solicitado
  // admitir tanto Buffer (Node) como Uint8Array (alguna librerías pueden devolver esto)
  let fileBuffer: Buffer | Uint8Array | null = null;
  let contentType: string;
  let fileName: string;

  try {
    if (format === 'pdf') {
      fileBuffer = await generatePdfReport(reportType, data, reportDataParams);
      contentType = 'application/pdf';
      fileName = `${reportType}-reporte-${dateRange}.pdf`;
    } else if (format === 'excel') {
      fileBuffer = await generateExcelReport(reportType, data, reportDataParams);
      contentType = 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet';
      fileName = `${reportType}-reporte-${dateRange}.xlsx`;
    } else {
      return NextResponse.json({ error: 'Formato de exportación no soportado' }, { status: 400 });
    }
  } catch (genError: any) {
    console.error(`Error al generar el reporte ${reportType} en formato ${format}:`, genError);
    return NextResponse.json({ error: `Error interno del servidor al generar el archivo de reporte: ${genError.message}` }, { status: 500 });
  }

  if (!fileBuffer) {
    return NextResponse.json({ error: 'El archivo de reporte no pudo ser generado.' }, { status: 500 });
  }

  // 3. Devolver el archivo como respuesta descargable
  // Convertir Buffer a Uint8Array para ajustarse a BodyInit esperado por NextResponse
  return new NextResponse(new Uint8Array(fileBuffer), {
    headers: {
      'Content-Type': contentType,
      'Content-Disposition': `attachment; filename="${fileName}"`,
      'Content-Length': fileBuffer.length.toString(), // Importante para descargas
    },
  });
}