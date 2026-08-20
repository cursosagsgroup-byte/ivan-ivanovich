import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/prisma';
import { construirFiltroPedidos } from '@/lib/order-filters';

export const dynamic = 'force-dynamic';

/** Escapa un valor para CSV: comillas dobladas y campo entrecomillado. */
function celda(valor: string | number | null | undefined): string {
    const texto = valor === null || valor === undefined ? '' : String(valor);
    return `"${texto.replace(/"/g, '""')}"`;
}

export async function GET(req: NextRequest) {
    const session = await getServerSession(authOptions);
    if (!session || session.user?.role !== 'ADMIN') {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const p = req.nextUrl.searchParams;
    // Los mismos filtros que la tabla: el archivo refleja lo que se ve.
    const where = construirFiltroPedidos({
        producto: p.get('producto') || undefined,
        estado: p.get('estado') || undefined,
        desde: p.get('desde') || undefined,
        hasta: p.get('hasta') || undefined,
        q: p.get('q') || undefined,
    });

    const pedidos = await prisma.order.findMany({
        where,
        include: {
            user: { select: { name: true, email: true } },
            items: { include: { course: { select: { title: true } } } },
            payment: { select: { gateway: true, transactionId: true } },
        },
        orderBy: { createdAt: 'desc' },
    });

    const ESTADOS: Record<string, string> = {
        completed: 'Completado',
        pending: 'Pendiente',
        failed: 'Fallido',
        cancelled: 'Cancelado',
    };

    const cabeceras = [
        'Pedido', 'Fecha', 'Hora', 'Cliente', 'Email', 'Teléfono',
        'Productos', 'Estado', 'Método de pago', 'Referencia de pago',
        'Descuento', 'Total', 'Moneda',
    ];

    const filas = pedidos.map((o) => {
        const fecha = new Date(o.createdAt);
        return [
            o.orderNumber,
            fecha.toLocaleDateString('es-MX'),
            fecha.toLocaleTimeString('es-MX', { hour: '2-digit', minute: '2-digit' }),
            o.billingName || o.user.name || '',
            o.billingEmail || o.user.email || '',
            o.billingPhone || '',
            o.items.map((i) => i.course.title).join(' | '),
            ESTADOS[o.status.toLowerCase()] || o.status,
            o.paymentMethod || '',
            o.payment?.transactionId || '',
            // Números sin separador de miles: así Excel los reconoce como cifras.
            o.discountTotal.toFixed(2),
            o.total.toFixed(2),
            o.currency,
        ].map(celda).join(',');
    });

    // El BOM hace que Excel abra el archivo como UTF-8; sin él, los acentos
    // y la ñ aparecen corrompidos.
    const csv = '﻿' + [cabeceras.map(celda).join(','), ...filas].join('\r\n');

    const hoy = new Date().toISOString().slice(0, 10);
    return new NextResponse(csv, {
        headers: {
            'Content-Type': 'text/csv; charset=utf-8',
            'Content-Disposition': `attachment; filename="pedidos-${hoy}.csv"`,
            'Cache-Control': 'no-store',
        },
    });
}
