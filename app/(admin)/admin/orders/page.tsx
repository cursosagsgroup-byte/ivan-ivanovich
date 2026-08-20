
import { prisma } from '@/lib/prisma';

import { Metadata } from 'next';
import Link from 'next/link';
import { ShoppingBag, ArrowLeft } from 'lucide-react';
import { Prisma } from '@prisma/client';
import OrdersFilters from '@/components/admin/OrdersFilters';

export const metadata: Metadata = {
    title: 'Pedidos (Orders) | Keting Media Admin',
};

export const dynamic = 'force-dynamic';
export const revalidate = 0;

type Busqueda = {
    producto?: string;
    estado?: string;
    desde?: string;
    hasta?: string;
    q?: string;
};

export default async function OrdersPage({
    searchParams,
}: {
    searchParams: Promise<Busqueda>;
}) {
    const filtros = await searchParams;

    // Los filtros se combinan: producto Y estado Y rango de fechas Y búsqueda.
    const where: Prisma.OrderWhereInput = {};

    if (filtros.producto) {
        where.items = { some: { courseId: filtros.producto } };
    }

    if (filtros.estado) {
        where.status = filtros.estado;
    }

    if (filtros.desde || filtros.hasta) {
        const rango: Prisma.DateTimeFilter = {};
        if (filtros.desde) rango.gte = new Date(`${filtros.desde}T00:00:00`);
        // El día "hasta" se incluye entero: hasta las 23:59:59 de esa fecha.
        if (filtros.hasta) rango.lte = new Date(`${filtros.hasta}T23:59:59.999`);
        where.createdAt = rango;
    }

    if (filtros.q) {
        const texto = filtros.q.trim();
        where.OR = [
            { orderNumber: { contains: texto, mode: 'insensitive' } },
            { billingName: { contains: texto, mode: 'insensitive' } },
            { billingEmail: { contains: texto, mode: 'insensitive' } },
            { user: { name: { contains: texto, mode: 'insensitive' } } },
            { user: { email: { contains: texto, mode: 'insensitive' } } },
        ];
    }

    // Solo se ofrecen en el desplegable los cursos que tienen algún pedido:
    // filtrar por uno sin ventas devolvería siempre una tabla vacía.
    const [orders, cursos, totalSinFiltrar] = await Promise.all([
        prisma.order.findMany({
            where,
            include: {
            user: {
                select: {
                    name: true,
                    email: true,
                },
            },
            items: {
                include: {
                    course: {
                        select: {
                            title: true,
                        },
                    },
                },
            },
        },
            orderBy: {
                createdAt: 'desc',
            },
        }),
        prisma.course.findMany({
            where: { orderItems: { some: {} } },
            select: { id: true, title: true },
            orderBy: { title: 'asc' },
        }),
        prisma.order.count(),
    ]);

    const hayFiltros = Boolean(filtros.producto || filtros.estado || filtros.desde || filtros.hasta || filtros.q);
    const sumaTotal = orders.reduce((suma, o) => suma + o.total, 0);

    return (
        <div className="p-6">
            <div className="flex justify-between items-center mb-6">
                <div className="flex items-center gap-4">
                    <Link href="/admin/dashboard" className="p-2 -ml-2 text-gray-500 hover:text-gray-900 hover:bg-gray-100 rounded-full transition-all">
                        <ArrowLeft className="w-5 h-5" />
                    </Link>
                    <h1 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
                        <ShoppingBag className="w-6 h-6" />
                        Pedidos
                    </h1>
                </div>
            </div>

            <OrdersFilters cursos={cursos} />

            <div className="flex items-baseline justify-between mb-3 px-1">
                <p className="text-sm text-gray-600">
                    {hayFiltros ? (
                        <>Mostrando <strong className="text-gray-900">{orders.length}</strong> de {totalSinFiltrar} pedidos</>
                    ) : (
                        <><strong className="text-gray-900">{orders.length}</strong> pedidos</>
                    )}
                </p>
                {orders.length > 0 && (
                    <p className="text-sm text-gray-600">
                        Suma: <strong className="text-gray-900">${sumaTotal.toLocaleString('es-MX', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</strong>
                    </p>
                )}
            </div>

            <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full text-left text-sm">
                        <thead className="bg-gray-50 border-b border-gray-200">
                            <tr>
                                <th className="px-6 py-4 font-semibold text-gray-700">Pedido</th>
                                <th className="px-6 py-4 font-semibold text-gray-700">Cliente</th>
                                <th className="px-6 py-4 font-semibold text-gray-700">Email</th>
                                <th className="px-6 py-4 font-semibold text-gray-700">Productos</th>
                                <th className="px-6 py-4 font-semibold text-gray-700">Fecha</th>
                                <th className="px-6 py-4 font-semibold text-gray-700">Estado</th>
                                <th className="px-6 py-4 font-semibold text-gray-700 text-right">Total</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-200">
                            {orders.length === 0 ? (
                                <tr>
                                    <td colSpan={7} className="px-6 py-8 text-center text-gray-500">
                                        {hayFiltros
                                            ? 'Ningún pedido coincide con estos filtros.'
                                            : 'No hay pedidos registrados.'}
                                    </td>
                                </tr>
                            ) : (
                                orders.map((order) => (
                                    <tr key={order.id} className="hover:bg-gray-50 transition-colors">
                                        <td className="px-6 py-4 font-medium text-gray-900">
                                            #{order.orderNumber.slice(-6).toUpperCase()}
                                        </td>
                                        <td className="px-6 py-4 font-medium text-gray-900">
                                            {order.user.name || 'N/A'}
                                        </td>
                                        <td className="px-6 py-4 text-gray-600">
                                            {order.user.email}
                                        </td>
                                        <td className="px-6 py-4">
                                            <div className="flex flex-col gap-1">
                                                {order.items.map((item) => (
                                                    <span key={item.id} className="inline-block bg-gray-100 px-2 py-1 rounded text-xs text-gray-700 truncate max-w-[350px] cursor-help hover:text-black hover:bg-gray-200 transition-colors" title={item.course.title}>
                                                        {item.course.title}
                                                    </span>
                                                ))}
                                            </div>
                                        </td>
                                        <td className="px-6 py-4 text-gray-600">
                                            {new Date(order.createdAt).toLocaleDateString('es-MX', {
                                                year: 'numeric',
                                                month: 'short',
                                                day: 'numeric',
                                                hour: '2-digit',
                                                minute: '2-digit'
                                            })}
                                        </td>
                                        <td className="px-6 py-4">
                                            <StatusBadge status={order.status} />
                                        </td>
                                        <td className="px-6 py-4 text-right font-medium text-gray-900">
                                            ${order.total.toFixed(2)} {order.currency}
                                        </td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
}

function StatusBadge({ status }: { status: string }) {
    const styles: Record<string, string> = {
        pending: 'bg-yellow-100 text-yellow-800 border-yellow-200',
        completed: 'bg-green-100 text-green-800 border-green-200',
        failed: 'bg-red-100 text-red-800 border-red-200',
        refunded: 'bg-gray-100 text-gray-800 border-gray-200',
    };

    const labels: Record<string, string> = {
        pending: 'Pendiente',
        completed: 'Completado',
        failed: 'Fallido',
        refunded: 'Reembolsado',
    };

    const normalizedStatus = status.toLowerCase();
    const className = styles[normalizedStatus] || 'bg-gray-100 text-gray-800 border-gray-200';
    const label = labels[normalizedStatus] || status;

    return (
        <span className={`px-2.5 py-0.5 rounded-full text-xs font-medium border ${className}`}>
            {label}
        </span>
    );
}
