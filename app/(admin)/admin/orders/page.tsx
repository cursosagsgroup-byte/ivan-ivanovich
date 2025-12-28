
import { prisma } from '@/lib/prisma';

import { Metadata } from 'next';
import Link from 'next/link';
import { ShoppingBag, Search, Filter, ArrowLeft } from 'lucide-react';

export const metadata: Metadata = {
    title: 'Pedidos (Orders) | Keting Media Admin',
};

export default async function OrdersPage() {
    const orders = await prisma.order.findMany({
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
    });

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
                {/* Search/Filter placeholders for future enhancement */}
                <div className="flex gap-2">
                    <div className="relative">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                        <input
                            type="text"
                            placeholder="Buscar pedido..."
                            className="pl-9 pr-4 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-black focus:border-transparent"
                        />
                    </div>
                </div>
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
                                        No hay pedidos registrados.
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
                                                    <span key={item.id} className="inline-block bg-gray-100 px-2 py-1 rounded text-xs text-gray-700 truncate max-w-[200px]">
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
