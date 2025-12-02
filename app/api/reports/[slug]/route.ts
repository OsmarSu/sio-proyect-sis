// app/api/reports/[slug]/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { generatePdfReport } from '@/lib/report-generators/pdf';
import { generateExcelReport } from '@/lib/report-generators/excel';
import {
  getGeneralReportData,
  getProductosReportData,
  getVentasReportData,
  getInventarioReportData,
  getClientesReportData,
} from '@/lib/report-data-fetchers';

interface ReportDataParams {
  range: string;
}

// === CORRECCIÓN 1: Definir params como Promise ===
export async function GET(
  request: NextRequest, 
  { params }: { params: Promise<{ slug: string }> } 
) {
  try {
    // === CORRECCIÓN 2: Esperar (await) a que se resuelvan los params ===
    const { slug } = await params;
    const reportType = slug;

    const searchParams = request.nextUrl.searchParams;
    const format = searchParams.get('format');
    const dateRange = searchParams.get('range') || 'month';

    const reportDataParams: ReportDataParams = { range: dateRange };

    let data: any;

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
      return NextResponse.json({ error: `Error interno del servidor: ${dbError.message}` }, { status: 500 });
    }

    if (!data || Object.keys(data).length === 0 || (Array.isArray(data) && data.length === 0)) {
      return NextResponse.json({ error: 'No se encontraron datos para el reporte con los filtros actuales.' }, { status: 404 });
    }

    if (!format) {
      return NextResponse.json(data);
    }

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
      console.error(`Error generando reporte ${format}:`, genError);
      return NextResponse.json({ error: `Error generando archivo: ${genError.message}` }, { status: 500 });
    }

    if (!fileBuffer) {
      return NextResponse.json({ error: 'El archivo no pudo ser generado.' }, { status: 500 });
    }

    return new NextResponse(new Uint8Array(fileBuffer), {
      headers: {
        'Content-Type': contentType,
        'Content-Disposition': `attachment; filename="${fileName}"`,
        'Content-Length': fileBuffer.length.toString(),
      },
    });

  } catch (error: any) {
    console.error('Error general en API Route:', error);
    return NextResponse.json({ error: error.message || 'Error interno' }, { status: 500 });
  }
}