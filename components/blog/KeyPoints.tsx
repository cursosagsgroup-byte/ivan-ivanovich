import { Target, MapPin, Eye, ShieldCheck, Layers, Clock, Radio, Users } from 'lucide-react';

/** Punto clave: siempre una frase literal del artículo. */
export type PuntoClave = { icon?: string; title: string; text: string };

const ICONOS = {
    objetivo: Target,
    ubicacion: MapPin,
    ojo: Eye,
    escudo: ShieldCheck,
    capas: Layers,
    reloj: Clock,
    radio: Radio,
    equipo: Users,
} as const;

const ORDEN_POR_DEFECTO: (keyof typeof ICONOS)[] = ['objetivo', 'ubicacion', 'ojo', 'escudo'];

/**
 * Franja de puntos clave, dentro del cuerpo del artículo y siempre en
 * horizontal. No va en una columna lateral: se lee como una parada dentro
 * del texto, no como material de relleno al margen.
 */
export default function KeyPoints({
    puntos,
    titulo,
}: {
    puntos: PuntoClave[];
    titulo: string;
}) {
    if (!puntos?.length) return null;

    return (
        <section className="puntos-clave my-14 border-y border-gray-200 py-10">
            <div className="mb-8 flex items-center gap-3">
                <span className="h-[3px] w-8 bg-[#B70126]" />
                <h2 className="text-sm font-bold uppercase tracking-[0.18em] text-[#B70126]">
                    {titulo}
                </h2>
            </div>

            <div className="grid grid-cols-1 gap-x-10 gap-y-9 sm:grid-cols-2">
                {puntos.map((p, i) => {
                    const clave = (p.icon && p.icon in ICONOS ? p.icon : ORDEN_POR_DEFECTO[i % ORDEN_POR_DEFECTO.length]) as keyof typeof ICONOS;
                    const Icono = ICONOS[clave];
                    return (
                        <div key={i}>
                            <Icono className="mb-4 h-8 w-8 text-[#B70126]" strokeWidth={1.4} />
                            <p className="mb-1.5 font-bold leading-snug text-gray-900">{p.title}</p>
                            <p className="text-base leading-relaxed text-gray-700">{p.text}</p>
                        </div>
                    );
                })}
            </div>
        </section>
    );
}
