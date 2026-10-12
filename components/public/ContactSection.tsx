'use client';

import React, { useState } from 'react';
import { Youtube, Facebook, Instagram, ArrowRight } from 'lucide-react';
import { useTranslation } from '@/hooks/useTranslation';
import toast from 'react-hot-toast';

/** Contacto: mismo patrón editorial que el resto del inicio — ancho
 *  completo, líneas divisorias, esquinas cuadradas y la misma tipografía
 *  (etiqueta monoespaciada + Bebas). Dos columnas: información a la
 *  izquierda, formulario a la derecha. */
export default function ContactSection() {
    const { t } = useTranslation();
    const [loading, setLoading] = useState(false);
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        phone: '',
        subject: '',
        message: ''
    });

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);

        try {
            const response = await fetch('/api/contact', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(formData),
            });

            const data = await response.json();

            if (response.ok && data.success) {
                toast.success(t('common.success') || 'Mensaje enviado correctamente');
                setFormData({
                    name: '',
                    email: '',
                    phone: '',
                    subject: '',
                    message: ''
                });
            } else {
                toast.error(data.error || t('common.error') || 'Error al enviar el mensaje');
            }
        } catch (error) {
            console.error('Error submitting form:', error);
            toast.error(t('common.error') || 'Error al enviar el mensaje');
        } finally {
            setLoading(false);
        }
    };

    const inputClass = 'w-full border-b border-white/20 bg-transparent px-0 py-3 text-white placeholder:text-white/40 focus:border-[#B70126] focus:outline-none disabled:opacity-50';

    return (
        <div className="bg-[#0B121F] py-16 lg:py-20">
            <div className="mx-auto max-w-[1440px] px-4 sm:px-6 lg:px-10">
                <div className="mb-10 lg:mb-14">
                    <p className="mb-3 font-mono text-[11px] uppercase tracking-[0.16em] text-white/40">
                        {t('nav.contact')}
                    </p>
                    <h2
                        className="text-4xl font-normal uppercase leading-none text-white lg:text-6xl"
                        style={{ fontFamily: 'var(--font-bebas), sans-serif', letterSpacing: '0.02em' }}
                    >
                        {t('contact.formTitle')}
                    </h2>
                </div>

                <div className="grid grid-cols-1 border-t border-white/10 lg:grid-cols-2">
                    {/* Columna izquierda: información de contacto */}
                    <div className="flex flex-col justify-between px-0 pb-10 pt-8 lg:border-r lg:border-white/10 lg:pb-0 lg:pr-12 lg:pt-10">
                        <div className="space-y-10">
                            <div>
                                <p className="mb-2 font-mono text-[11px] uppercase tracking-[0.16em] text-white/40">
                                    {t('contact.emailLabel')}
                                </p>
                                <a
                                    href="mailto:academia@ivanivanovich.com"
                                    className="break-all text-2xl uppercase leading-tight text-white transition-colors hover:text-[#B70126] sm:text-3xl"
                                    style={{ fontFamily: 'var(--font-bebas), sans-serif', letterSpacing: '0.01em' }}
                                >
                                    academia@ivanivanovich.com
                                </a>
                            </div>

                            <div>
                                <p className="mb-2 font-mono text-[11px] uppercase tracking-[0.16em] text-white/40">
                                    {t('contact.locationLabel')}
                                </p>
                                <p
                                    className="text-2xl uppercase leading-tight text-white sm:text-3xl"
                                    style={{ fontFamily: 'var(--font-bebas), sans-serif', letterSpacing: '0.01em' }}
                                >
                                    {t('contact.cdmx')}
                                </p>
                            </div>
                        </div>

                        <div className="mt-10 flex gap-px pb-10 lg:pb-10">
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
                            <div className="grid grid-cols-1 gap-8 sm:grid-cols-2">
                                <input
                                    type="text"
                                    name="name"
                                    value={formData.name}
                                    onChange={handleChange}
                                    placeholder={t('contact.formName')}
                                    required
                                    disabled={loading}
                                    className={inputClass}
                                />
                                <input
                                    type="email"
                                    name="email"
                                    value={formData.email}
                                    onChange={handleChange}
                                    placeholder={t('contact.formEmail')}
                                    required
                                    disabled={loading}
                                    className={inputClass}
                                />
                            </div>

                            <div className="grid grid-cols-1 gap-8 sm:grid-cols-2">
                                <input
                                    type="tel"
                                    name="phone"
                                    value={formData.phone}
                                    onChange={handleChange}
                                    placeholder={t('contact.formPhone')}
                                    disabled={loading}
                                    className={inputClass}
                                />
                                <input
                                    type="text"
                                    name="subject"
                                    value={formData.subject}
                                    onChange={handleChange}
                                    placeholder={t('contact.subject')}
                                    disabled={loading}
                                    className={inputClass}
                                />
                            </div>

                            <textarea
                                rows={4}
                                name="message"
                                value={formData.message}
                                onChange={handleChange}
                                placeholder={t('contact.message')}
                                required
                                disabled={loading}
                                className={`${inputClass} resize-none`}
                            />

                            <button
                                type="submit"
                                disabled={loading}
                                className="group mt-2 flex w-fit items-stretch disabled:opacity-60"
                            >
                                <span className="bg-[#B70126] px-6 py-3 font-mono text-[11px] uppercase tracking-[0.12em] text-white transition-colors group-hover:bg-[#8f011e]">
                                    {loading ? t('common.loading') : t('contact.formButton')}
                                </span>
                                <span className="ml-px flex items-center bg-[#B70126] px-4 text-white transition-colors group-hover:bg-[#8f011e]">
                                    <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
                                </span>
                            </button>
                        </form>
                    </div>
                </div>
            </div>
        </div>
    );
}
