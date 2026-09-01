import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import QRCode from 'qrcode';
import fs from 'fs';
import path from 'path';

/** Certificado del Seminario Online de Protección Ejecutiva (agosto 2026).
 *  Usa el diseño "Táctico Claro" (HTML autocontenido con fuentes, firmas y
 *  logos embebidos), distinto del PDF genérico de los demás cursos. El QR
 *  apunta a la URL del propio certificado: escanearlo es verificarlo. */

const CURSO_SEMINARIO_ID = 'cmq8mfhot0000jgymc9u2zud7';
const PLANTILLA = path.join(process.cwd(), 'lib', 'certificados', 'certificado-tactico-claro.html');

export async function GET(
    req: NextRequest,
    { params }: { params: Promise<{ certId: string }> }
) {
    const { certId } = await params;

    let nombre: string;
    let folio: string;
    let urlVerificacion: string;

    if (certId === 'previa') {
        // Vista de prueba sin tocar la base, para revisar el diseño.
        nombre = 'Nombre del Alumno de Prueba';
        folio = 'FOLIO SEM-2026-000';
        urlVerificacion = 'https://ivanivanovich.com/api/certificado-seminario/previa';
    } else {
        const cert = await prisma.certificate.findUnique({
            where: { id: certId },
            include: { user: { select: { name: true } } },
        });
        if (!cert || cert.courseId !== CURSO_SEMINARIO_ID) {
            return new NextResponse('Certificado no encontrado', { status: 404 });
        }

        // El folio es la posición del alumno en las inscripciones del curso,
        // en orden de inscripción: estable aunque el certificado se reemita.
        const inscripciones = await prisma.enrollment.findMany({
            where: { courseId: CURSO_SEMINARIO_ID },
            orderBy: { enrolledAt: 'asc' },
            select: { userId: true },
        });
        const posicion = inscripciones.findIndex(i => i.userId === cert.userId) + 1;

        nombre = cert.user.name || 'Participante';
        folio = `FOLIO SEM-2026-${String(posicion > 0 ? posicion : 999).padStart(3, '0')}`;
        urlVerificacion = `https://ivanivanovich.com/api/certificado-seminario/${cert.id}`;
    }

    let html: string;
    try {
        html = fs.readFileSync(PLANTILLA, 'utf-8');
    } catch {
        return new NextResponse('Plantilla no disponible', { status: 500 });
    }

    html = html
        .replace(/\{\{\s*participantName\s*\}\}/g, nombre)
        .replace(/\{\{\s*folioLabel\s*\}\}/g, folio);

    // El QR vive dentro del contenido empaquetado de la plantilla, donde las
    // comillas van escapadas (\") y los cierres como </...>: el
    // reemplazo respeta ese escapado.
    try {
        const qr = await QRCode.toDataURL(urlVerificacion, { width: 192, margin: 0, color: { dark: '#16171a', light: '#00000000' } });
        html = html.replace(
            /<image-slot id=(?:\\")?qr-curso(?:\\")?[\s\S]*?image-slot>/,
            `<img src=\\"${qr}\\" alt=\\"QR de verificación\\" style=\\"width: 96px; height: 96px;\\">`
        );
    } catch {
        // Sin QR el certificado sigue siendo válido; se sirve igual.
    }

    // Barra de descarga: botón flotante que lanza el diálogo de impresión
    // (Guardar como PDF). Se inyecta tras el desempaquetado de la plantilla
    // y desaparece en la impresión. El título del documento da el nombre
    // del archivo PDF.
    const tituloDoc = `Certificado Seminario - ${nombre}`;
    html += `
<script>
(function () {
    function montar() {
        if (document.getElementById('barra-descarga')) return;
        document.title = ${JSON.stringify('__TITULO__')};
        var estilo = document.createElement('style');
        estilo.textContent = '#barra-descarga{position:fixed;top:16px;right:16px;z-index:99999;display:flex;gap:8px;font-family:-apple-system,BlinkMacSystemFont,sans-serif}#barra-descarga button{background:#B70126;color:#fff;border:0;padding:12px 20px;font-size:14px;font-weight:700;letter-spacing:.04em;cursor:pointer;box-shadow:0 4px 14px rgba(0,0,0,.25)}#barra-descarga button:hover{background:#8f011e}@media print{#barra-descarga{display:none!important}}';
        document.head.appendChild(estilo);
        var barra = document.createElement('div');
        barra.id = 'barra-descarga';
        var btn = document.createElement('button');
        btn.textContent = 'Descargar PDF';
        btn.onclick = function () { window.print(); };
        barra.appendChild(btn);
        document.body.appendChild(barra);
    }
    if (document.readyState === 'complete') { setTimeout(montar, 600); }
    else { window.addEventListener('load', function () { setTimeout(montar, 600); }); }
})();
</script>`;
    html = html.replace('"__TITULO__"', JSON.stringify(tituloDoc));

    return new NextResponse(html, {
        headers: {
            'Content-Type': 'text/html; charset=utf-8',
            'Cache-Control': 'private, no-store',
        },
    });
}
