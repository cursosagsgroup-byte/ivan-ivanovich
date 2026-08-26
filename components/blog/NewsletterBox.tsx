'use client';

import { useState } from 'react';
import { Mail } from 'lucide-react';

/** Caja de suscripción al cierre de los artículos del blog. */
export default function NewsletterBox({ locale }: { locale: string }) {
    const en = locale === 'en';
    const [email, setEmail] = useState('');
    const [estado, setEstado] = useState<'inicial' | 'enviando' | 'listo' | 'error'>('inicial');

    const suscribir = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!email.trim() || estado === 'enviando') return;
        setEstado('enviando');
        try {
            const res = await fetch('/api/newsletter', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ email: email.trim(), lang: en ? 'en' : 'es' }),
            });
            setEstado(res.ok ? 'listo' : 'error');
        } catch {
            setEstado('error');
        }
    };

    return (
        <section className="caja-boletin mt-14 border border-gray-200 px-6 py-8 sm:px-10">
            <div className="flex flex-col items-start gap-6 sm:flex-row sm:items-center">
                <Mail className="h-10 w-10 shrink-0 text-[#B70126]" strokeWidth={1.4} />
                <div className="w-full">
                    <p className="mb-4 font-semibold leading-snug text-gray-900">
                        {en
                            ? 'Receive exclusive executive protection analysis and strategies.'
                            : 'Recibe análisis y estrategias exclusivas de protección ejecutiva.'}
                    </p>
                    {estado === 'listo' ? (
                        <p className="font-semibold text-green-600" aria-live="polite">
                            {en ? 'Done — check your inbox.' : 'Listo — revisa tu correo.'}
                        </p>
                    ) : (
                        <form onSubmit={suscribir} className="flex flex-col gap-3 sm:flex-row">
                            <input
                                type="email"
                                required
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                placeholder={en ? 'Your email address' : 'Tu correo electrónico'}
                                className="w-full border border-gray-300 px-4 py-3 text-sm outline-none focus:border-[#B70126]"
                            />
                            <button
                                type="submit"
                                disabled={estado === 'enviando'}
                                className="shrink-0 bg-[#B70126] px-6 py-3 text-sm font-bold uppercase tracking-wide text-white transition-colors hover:bg-[#8f011e] disabled:opacity-60"
                            >
                                {estado === 'enviando'
                                    ? (en ? 'Sending…' : 'Enviando…')
                                    : (en ? 'Subscribe' : 'Suscribirme')}
                            </button>
                        </form>
                    )}
                    {estado === 'error' && (
                        <p className="mt-2 text-sm text-red-600" aria-live="polite">
                            {en ? 'Something went wrong. Try again.' : 'Algo falló. Intenta de nuevo.'}
                        </p>
                    )}
                    <p className="mt-3 text-xs text-gray-500">
                        {en
                            ? 'Your privacy is our priority. We never share your information.'
                            : 'Tu privacidad es nuestra prioridad. No compartimos tu información.'}
                    </p>
                </div>
            </div>
        </section>
    );
}
