import { Prisma } from '@prisma/client';

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

    if (f.producto) {
        where.items = { some: { courseId: f.producto } };
    }

    if (f.estado) {
        where.status = f.estado;
    }

    if (f.desde || f.hasta) {
        const rango: Prisma.DateTimeFilter = {};
        if (f.desde) rango.gte = new Date(`${f.desde}T00:00:00`);
        // El día indicado en "hasta" se incluye completo.
        if (f.hasta) rango.lte = new Date(`${f.hasta}T23:59:59.999`);
        where.createdAt = rango;
    }

    if (f.q) {
        const texto = f.q.trim();
        where.OR = [
            { orderNumber: { contains: texto, mode: 'insensitive' } },
            { billingName: { contains: texto, mode: 'insensitive' } },
            { billingEmail: { contains: texto, mode: 'insensitive' } },
            { user: { name: { contains: texto, mode: 'insensitive' } } },
            { user: { email: { contains: texto, mode: 'insensitive' } } },
        ];
    }

    return where;
}

/** True si hay algún filtro activo. */
export function hayFiltrosActivos(f: FiltrosPedidos): boolean {
    return Boolean(f.producto || f.estado || f.desde || f.hasta || f.q);
}
