'use client';

import { useRouter, useSearchParams } from 'next/navigation';
import { useMemo, useState, useTransition } from 'react';
import { Search, X, Loader2, Download } from 'lucide-react';

type Curso = { id: string; title: string };

const ESTADOS = [
    { valor: 'completed', etiqueta: 'Completado' },
    { valor: 'pending', etiqueta: 'Pendiente' },
    { valor: 'failed', etiqueta: 'Fallido' },
    { valor: 'cancelled', etiqueta: 'Cancelado' },
];

/**
 * Filtros de la tabla de pedidos. El estado vive en la URL, no en el
 * componente: así el listado filtrado se puede compartir, guardar en
 * marcadores y sobrevive a recargar la página.
 */
export default function OrdersFilters({ cursos }: { cursos: Curso[] }) {
    const router = useRouter();
    const rawParams = useSearchParams();
    const searchParams = useMemo(
        () => new URLSearchParams(rawParams?.toString() ?? ''),
        [rawParams]
    );
    const [pendiente, iniciarTransicion] = useTransition();
    const [busqueda, setBusqueda] = useState(searchParams.get('q') ?? '');

    const valor = (clave: string) => searchParams.get(clave) ?? '';

    const aplicar = (cambios: Record<string, string>) => {
        const params = new URLSearchParams(searchParams.toString());
        for (const [clave, v] of Object.entries(cambios)) {
            if (v) params.set(clave, v);
            else params.delete(clave);
        }
        iniciarTransicion(() => {
            router.replace(params.toString() ? `?${params.toString()}` : '?', { scroll: false });
        });
    };

    const hayFiltros = ['producto', 'estado', 'desde', 'hasta', 'q'].some((k) => searchParams.get(k));

    const limpiar = () => {
        setBusqueda('');
        iniciarTransicion(() => router.replace('?', { scroll: false }));
    };

    const campo = 'px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-black focus:border-transparent bg-white';

    return (
        <div className="bg-white rounded-xl border border-gray-200 p-4 mb-4">
            <div className="flex flex-wrap items-end gap-3">
                {/* Búsqueda por pedido, cliente o correo */}
                <div className="flex-1 min-w-[220px]">
                    <label className="block text-xs font-semibold text-gray-600 mb-1">Buscar</label>
                    <form
                        onSubmit={(e) => { e.preventDefault(); aplicar({ q: busqueda.trim() }); }}
                        className="relative"
                    >
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                        <input
                            type="text"
                            value={busqueda}
                            onChange={(e) => setBusqueda(e.target.value)}
                            onBlur={() => aplicar({ q: busqueda.trim() })}
                            placeholder="Nº de pedido, cliente o correo"
                            className={`${campo} pl-9 w-full`}
                        />
                    </form>
                </div>

                <div>
                    <label className="block text-xs font-semibold text-gray-600 mb-1">Producto</label>
                    <select
                        value={valor('producto')}
                        onChange={(e) => aplicar({ producto: e.target.value })}
                        className={`${campo} max-w-[260px]`}
                    >
                        <option value="">Todos</option>
                        {cursos.map((c) => (
                            <option key={c.id} value={c.id}>{c.title}</option>
                        ))}
                    </select>
                </div>

                <div>
                    <label className="block text-xs font-semibold text-gray-600 mb-1">Estado</label>
                    <select
                        value={valor('estado')}
                        onChange={(e) => aplicar({ estado: e.target.value })}
                        className={campo}
                    >
                        <option value="">Todos</option>
                        {ESTADOS.map((e) => (
                            <option key={e.valor} value={e.valor}>{e.etiqueta}</option>
                        ))}
                    </select>
                </div>

                <div>
                    <label className="block text-xs font-semibold text-gray-600 mb-1">Desde</label>
                    <input
                        type="date"
                        value={valor('desde')}
                        onChange={(e) => aplicar({ desde: e.target.value })}
                        className={campo}
                    />
                </div>

                <div>
                    <label className="block text-xs font-semibold text-gray-600 mb-1">Hasta</label>
                    <input
                        type="date"
                        value={valor('hasta')}
                        onChange={(e) => aplicar({ hasta: e.target.value })}
                        className={campo}
                    />
                </div>

                {hayFiltros && (
                    <button
                        onClick={limpiar}
                        className="flex items-center gap-1.5 px-3 py-2 text-sm font-medium text-gray-600 hover:text-black hover:bg-gray-100 rounded-lg transition-colors"
                    >
                        <X className="w-4 h-4" />
                        Limpiar
                    </button>
                )}

                {/* Descarga los pedidos que cumplen los filtros actuales, no todos */}
                <a
                    href={`/api/admin/orders/export${searchParams.toString() ? `?${searchParams.toString()}` : ''}`}
                    className="flex items-center gap-1.5 px-4 py-2 bg-green-600 text-white text-sm font-medium rounded-lg hover:bg-green-700 transition-colors"
                >
                    <Download className="w-4 h-4" />
                    Exportar CSV
                </a>

                {pendiente && <Loader2 className="w-4 h-4 animate-spin text-gray-400 mb-2.5" />}
            </div>
        </div>
    );
}
