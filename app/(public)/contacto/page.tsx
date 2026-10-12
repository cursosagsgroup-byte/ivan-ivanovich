'use client';

import { Youtube, Facebook, Instagram, ArrowRight } from 'lucide-react';
import { useTranslation } from '@/hooks/useTranslation';
import { useState, FormEvent, ChangeEvent } from 'react';

/** Página de contacto: mismo patrón editorial que el resto del sitio —
 *  ancho completo, fondo blanco, líneas divisorias, esquinas cuadradas y la
 *  misma tipografía (etiqueta monoespaciada + Bebas) que el resto del
 *  sitio. */
export default function ContactoPage() {
    const { t } = useTranslation();
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        phone: '',
        message: ''
    });
    const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');

    const handleSubmit = async (e: FormEvent) => {
        e.preventDefault();
        setStatus('loading');

        try {
            const res = await fetch('/api/contact', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(formData)
            });

            if (res.ok) {
                setStatus('success');
                setFormData({ name: '', email: '', phone: '', message: '' });
                setTimeout(() => setStatus('idle'), 3000);
            } else {
                setStatus('error');
            }
        } catch (error) {
            console.error('Error submitting form:', error);
            setStatus('error');
        }
    };

    const handleChange = (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        setFormData({ ...formData, [e.target.id]: e.target.value });
    };

    const inputClass = 'w-full border-b border-gray-300 bg-transparent px-0 py-3 text-[#16171a] placeholder:text-gray-400 focus:border-[#B70126] focus:outline-none disabled:opacity-50';
    const kickerClass = 'mb-2 font-mono text-[11px] uppercase tracking-[0.16em] text-gray-400';
    const valueClass = 'text-2xl uppercase leading-tight text-[#16171a] sm:text-3xl';
    const valueStyle = { fontFamily: 'var(--font-bebas), sans-serif', letterSpacing: '0.01em' };

    return (
        <div className="min-h-screen bg-white">
            <div className="mx-auto max-w-[1440px] px-4 pb-16 sm:px-6 lg:px-10 lg:pb-24">
                <header className="subpage-hero subpage-hero-inset">
                <p className="subpage-hero-eyebrow">
                    {t('nav.contact')}
                </p>
                <h1
                    className="text-4xl font-normal uppercase leading-none text-[#16171a] lg:text-7xl"
                    style={{ fontFamily: 'var(--font-bebas), sans-serif', letterSpacing: '0.02em' }}
                >
                    {t('contact.formTitle')}
                </h1>
                <p className="mt-5 max-w-xl text-base leading-relaxed text-gray-600 lg:text-[17px]">
                    {t('contact.subtitle')}
                </p>

                </header>

                <div className="grid grid-cols-1 border-t border-gray-200 lg:grid-cols-2">
                    {/* Columna izquierda: información de contacto */}
                    <div className="flex flex-col px-0 pb-10 pt-8 lg:border-r lg:border-gray-200 lg:pb-0 lg:pr-12 lg:pt-10">
                        <div className="space-y-10">
                            <div>
                                <p className={kickerClass}>{t('contact.emailLabel')}</p>
                                <a
                                    href="mailto:academia@ivanivanovich.com"
                                    className={`${valueClass} block break-all transition-colors hover:text-[#B70126]`}
                                    style={valueStyle}
                                >
                                    academia@ivanivanovich.com
                                </a>
                                <a
                                    href="mailto:b.barrerra@ivanivanovich.com"
                                    className="mt-2 block break-all font-mono text-xs text-gray-400 transition-colors hover:text-[#B70126] sm:text-sm"
                                >
                                    {t('contact.centralAmerica')}: b.barrerra@ivanivanovich.com
                                </a>
                            </div>

                            <div>
                                <p className={kickerClass}>{t('contact.phoneLabel')}</p>
                                <a href="tel:+52666888000" className={`${valueClass} block transition-colors hover:text-[#B70126]`} style={valueStyle}>
                                    CDMX: +52 666 888 000
                                </a>
                            </div>

                            <div>
                                <p className={kickerClass}>{t('contact.locationLabel')}</p>
                                <p className={valueClass} style={valueStyle}>{t('contact.cdmx')}</p>
                                <p className="mt-2 font-mono text-xs text-gray-400 sm:text-sm">{t('contact.centralAmerica')}</p>
                            </div>

                            <div>
                                <p className={kickerClass}>{t('contact.businessHoursTitle')}</p>
                                <div className="space-y-1 font-mono text-xs leading-relaxed text-gray-600 sm:text-sm">
                                    <p>{t('contact.mondayFriday')}</p>
                                    <p>{t('contact.saturday')}</p>
                                    <p>{t('contact.sunday')}</p>
                                </div>
                            </div>
                        </div>

                        <div className="mt-10 flex gap-px pb-10">
                            <a
                                href="https://www.youtube.com/c/ivanivanovichproteccionejecutiva"
                                target="_blank"
                                rel="noopener noreferrer"
                                aria-label="YouTube"
                                className="flex h-11 w-11 items-center justify-center bg-[#B70126] text-white transition-colors hover:bg-[#8f011e]"
                            >
                                <Youtube className="h-5 w-5" />
                            </a>
                            <a
                                href="https://www.facebook.com/ivan.ivanovich.315"
                                target="_blank"
                                rel="noopener noreferrer"
                                aria-label="Facebook"
                                className="flex h-11 w-11 items-center justify-center bg-[#B70126] text-white transition-colors hover:bg-[#8f011e]"
                            >
                                <Facebook className="h-5 w-5" />
                            </a>
                            <a
                                href="https://www.instagram.com/ivan_ivanovich.ms/"
                                target="_blank"
                                rel="noopener noreferrer"
                                aria-label="Instagram"
                                className="flex h-11 w-11 items-center justify-center bg-[#B70126] text-white transition-colors hover:bg-[#8f011e]"
                            >
                                <Instagram className="h-5 w-5" />
                            </a>
                        </div>
                    </div>

                    {/* Columna derecha: formulario */}
                    <div className="px-0 pb-10 pt-8 lg:pb-12 lg:pl-12 lg:pt-10">
                        <form onSubmit={handleSubmit} className="flex flex-col gap-8">
                            <input
                                type="text"
                                id="name"
                                value={formData.name}
                                onChange={handleChange}
                                placeholder={t('contact.fullNamePlaceholder')}
                                required
                                disabled={status === 'loading'}
                                className={inputClass}
                            />
                            <input
                                type="email"
                                id="email"
                                value={formData.email}
                                onChange={handleChange}
                                placeholder={t('contact.emailPlaceholder')}
                                required
                                disabled={status === 'loading'}
                                className={inputClass}
                            />
                            <input
                                type="tel"
                                id="phone"
                                value={formData.phone}
                                onChange={handleChange}
                                placeholder={t('contact.phonePlaceholder')}
                                disabled={status === 'loading'}
                                className={inputClass}
                            />
                            <textarea
                                id="message"
                                rows={4}
                                value={formData.message}
                                onChange={handleChange}
                                placeholder={t('contact.messagePlaceholder')}
                                className={`${inputClass} resize-none`}
                            />

                            <button
                                type="submit"
                                disabled={status === 'loading'}
                                className="group mt-2 flex w-fit items-stretch disabled:opacity-60"
                            >
                                <span className="bg-[#B70126] px-6 py-3 font-mono text-[11px] uppercase tracking-[0.12em] text-white transition-colors group-hover:bg-[#8f011e]">
                                    {status === 'loading' ? t('common.loading') : t('contact.sendMessage')}
                                </span>
                                <span className="ml-px flex items-center bg-[#B70126] px-4 text-white transition-colors group-hover:bg-[#8f011e]">
                                    <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
                                </span>
                            </button>

                            {status === 'success' && (
                                <p className="font-mono text-xs uppercase tracking-[0.12em] text-green-500">
                                    {t('common.success') || 'Mensaje enviado correctamente'}
                                </p>
                            )}
                            {status === 'error' && (
                                <p className="font-mono text-xs uppercase tracking-[0.12em] text-[#B70126]">
                                    {t('common.error') || 'Error al enviar el mensaje'}
                                </p>
                            )}
                        </form>
                    </div>
                </div>
            </div>
        </div>
    );
}
