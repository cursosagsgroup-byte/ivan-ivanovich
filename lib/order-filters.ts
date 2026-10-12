import { Prisma } from '@prisma/client';
import { fechaLimiteAbandono } from './order-status';

export type FiltrosPedidos = {
    producto?: string;
    estado?: string;
    desde?: string;
    hasta?: string;
    q?: string;
};

/**
 * Construye la condición de búsqueda de pedidos a partir de los filtros.
 *
 * Vive aquí, y no en la página, porque la tabla y la exportación tienen que
 * aplicar exactamente los mismos criterios: si divergieran, el archivo
 * descargado no coincidiría con lo que el administrador está viendo.
 */
export function construirFiltroPedidos(f: FiltrosPedidos): Prisma.OrderWhereInput {
    const where: Prisma.OrderWhereInput = {};
    // Condiciones que no se pueden expresar como un campo plano (como los
    // dos OR de abajo) van aquí en vez de en where.OR directamente: así no
    // se pisan entre sí ni con el OR de la búsqueda de texto.
    const and: Prisma.OrderWhereInput[] = [];

    if (f.producto) {
        where.items = { some: { courseId: f.producto } };
    }

    if (f.estado === 'abandonado') {
        // Pendiente, sin ningún registro de pago y con margen suficiente
        // para no confundirlo con un pago en curso ahora mismo — ver
        // lib/order-status.ts (la misma regla que pinta el badge).
        where.status = 'pending';
        where.payment = { is: null };
        and.push({ createdAt: { lte: fechaLimiteAbandono() } });
    } else if (f.estado === 'pending') {
        // "Pendiente" real: excluye los que ya se cuentan como carrito
        // abandonado, para que las dos categorías no se dupliquen.
        where.status = 'pending';
        and.push({
            OR: [
                { payment: { isNot: null } },
                { createdAt: { gt: fechaLimiteAbandono() } },
            ],
        });
    } else if (f.estado) {
        where.status = f.estado;
    }

    if (f.desde || f.hasta) {
        const rango: Prisma.DateTimeFilter = {};
        if (f.desde) rango.gte = new Date(`${f.desde}T00:00:00`);
        // El día indicado en "hasta" se incluye completo.
        if (f.hasta) rango.lte = new Date(`${f.hasta}T23:59:59.999`);
        and.push({ createdAt: rango });
    }

    if (f.q) {
        const texto = f.q.trim();
        and.push({
            OR: [
                { orderNumber: { contains: texto, mode: 'insensitive' } },
                { billingName: { contains: texto, mode: 'insensitive' } },
                { billingEmail: { contains: texto, mode: 'insensitive' } },
                { user: { name: { contains: texto, mode: 'insensitive' } } },
                { user: { email: { contains: texto, mode: 'insensitive' } } },
            ],
        });
    }

    if (and.length > 0) {
        where.AND = and;
    }

    return where;
}

/** True si hay algún filtro activo. */
export function hayFiltrosActivos(f: FiltrosPedidos): boolean {
    return Boolean(f.producto || f.estado || f.desde || f.hasta || f.q);
}
