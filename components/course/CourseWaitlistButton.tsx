'use client';

import { useState } from 'react';
import { BellRing, Check, Loader2 } from 'lucide-react';

/**
 * Sustituye al botón de compra en las ediciones terminadas.
 *
 * Mostrar un curso agotado genera interés; sin una forma de recogerlo, ese
 * interés se pierde. Aquí se captura el correo como lead para avisar de la
 * próxima convocatoria.
 */
export default function CourseWaitlistButton({
    courseTitle,
    locale,
}: {
    courseTitle: string;
    locale: 'es' | 'en';
}) {
    const [abierto, setAbierto] = useState(false);
    const [nombre, setNombre] = useState('');
    const [email, setEmail] = useState('');
    const [estado, setEstado] = useState<'idle' | 'enviando' | 'listo'>('idle');
    const [error, setError] = useState('');

    const txt = locale === 'en'
        ? {
            cta: 'Notify me',
            title: 'Get notified about the next edition',
            name: 'Your name',
            email: 'you@email.com',
            send: 'Notify me',
            done: 'We will let you know',
            error: 'Could not save your request. Please try again.',
            cancel: 'Cancel',
        }
        : {
            cta: 'Avísame',
            title: 'Avísame de la próxima fecha',
            name: 'Tu nombre',
            email: 'tu@email.com',
            send: 'Avísame',
            done: 'Te avisaremos',
            error: 'No pudimos guardar tu solicitud. Inténtalo de nuevo.',
            cancel: 'Cancelar',
        };

    const enviar = async (e: React.FormEvent) => {
        e.preventDefault();
        if (estado === 'enviando') return;
        setEstado('enviando');
        setError('');
        try {
            const res = await fetch('/api/waitlist', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ name: nombre, email, courseTitle }),
            });
            if (!res.ok) throw new Error('fallo');
            setEstado('listo');
        } catch {
            setEstado('idle');
            setError(txt.error);
        }
    };

    if (estado === 'listo') {
        return (
            <span className="inline-flex items-center gap-2 rounded-md bg-green-50 px-4 py-2.5 text-sm font-bold text-green-700">
                <Check className="h-4 w-4" />
                {txt.done}
            </span>
        );
    }

    if (!abierto) {
        return (
            <button
                type="button"
                onClick={() => setAbierto(true)}
                className="inline-flex items-center gap-2 rounded-md border-2 border-[#B70126] px-6 py-2.5 text-sm font-bold text-[#B70126] transition-colors hover:bg-[#B70126] hover:text-white"
            >
                <BellRing className="h-4 w-4" />
                {txt.cta}
            </button>
        );
    }

    return (
        <form onSubmit={enviar} className="w-full space-y-2">
            <p className="text-sm font-bold text-black">{txt.title}</p>
            <input
                type="text"
                required
                value={nombre}
                onChange={(e) => setNombre(e.target.value)}
                placeholder={txt.name}
                className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:border-transparent focus:ring-2 focus:ring-[#B70126]"
            />
            <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder={txt.email}
                className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:border-transparent focus:ring-2 focus:ring-[#B70126]"
            />
            {error && <p className="text-xs font-medium text-[#B70126]">{error}</p>}
            <div className="flex gap-2">
                <button
                    type="submit"
                    disabled={estado === 'enviando'}
                    className="flex flex-1 items-center justify-center gap-2 rounded-md bg-[#B70126] px-4 py-2 text-sm font-bold text-white transition-colors hover:bg-[#D9012D] disabled:opacity-70"
                >
                    {estado === 'enviando' && <Loader2 className="h-4 w-4 animate-spin" />}
                    {txt.send}
                </button>
                <button
                    type="button"
                    onClick={() => setAbierto(false)}
                    className="rounded-md px-3 py-2 text-sm text-gray-500 hover:text-gray-800"
                >
                    {txt.cancel}
                </button>
            </div>
        </form>
    );
}
