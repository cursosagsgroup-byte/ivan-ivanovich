/**
 * Estado "visible" de un pedido: lo mismo que status en la base de datos,
 * salvo que un pendiente sin ningún intento de pago real se muestra como
 * "carrito abandonado" en vez de "pendiente". El valor guardado en la base
 * (order.status) nunca cambia — esto es solo para mostrarlo en el admin.
 */

/** Minutos de margen antes de considerar "abandonado" un pendiente: evita
 *  etiquetar así a alguien que en este momento está llenando su tarjeta. */
const MINUTOS_MARGEN_ABANDONO = 15;

export type EstadoVisible = 'completed' | 'pending' | 'abandoned' | 'failed' | 'cancelled';

type PedidoParaEstado = {
    status: string;
    createdAt: Date;
    payment?: { status: string } | null;
};

export function fechaLimiteAbandono(): Date {
    return new Date(Date.now() - MINUTOS_MARGEN_ABANDONO * 60 * 1000);
}

/** Pendiente, sin ningún registro de pago (nadie llegó a someter la
 *  tarjeta/el voucher) y con margen suficiente para no confundirlo con un
 *  pago en curso ahora mismo. */
export function esCarritoAbandonado(pedido: PedidoParaEstado): boolean {
    if (pedido.status.toLowerCase() !== 'pending') return false;
    if (pedido.payment) return false;
    return pedido.createdAt <= fechaLimiteAbandono();
}

export function estadoVisible(pedido: PedidoParaEstado): EstadoVisible {
    const status = pedido.status.toLowerCase();
    if (status === 'pending' && esCarritoAbandonado(pedido)) return 'abandoned';
    if (status in ETIQUETAS_ESTADO) return status as EstadoVisible;
    return 'pending';
}

export const ETIQUETAS_ESTADO: Record<EstadoVisible, string> = {
    completed: 'Completado',
    pending: 'Pendiente',
    abandoned: 'Carrito abandonado',
    failed: 'Fallido',
    cancelled: 'Cancelado',
};

export const ESTILOS_ESTADO: Record<EstadoVisible, string> = {
    completed: 'bg-green-100 text-green-800 border-green-200',
    pending: 'bg-yellow-100 text-yellow-800 border-yellow-200',
    abandoned: 'bg-orange-100 text-orange-800 border-orange-200',
    failed: 'bg-red-100 text-red-800 border-red-200',
    cancelled: 'bg-gray-100 text-gray-800 border-gray-200',
};
