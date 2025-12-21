'use client';

import { Mail, MapPin, Phone } from 'lucide-react';
import { useTranslation } from '@/hooks/useTranslation';
import { useState, FormEvent, ChangeEvent } from 'react';

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
                // Reset success message after 3 seconds
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

    return (
        <div className="bg-slate-900 min-h-screen pt-40 pb-24 sm:py-32">
            <div className="mx-auto max-w-7xl px-6 lg:px-8">
                <div className="mx-auto max-w-2xl text-center mb-16">
                    <h1 className="text-4xl font-bold tracking-tight text-white sm:text-5xl">
                        {t('contact.title')}
                    </h1>
                    <p className="mt-6 text-lg leading-8 text-gray-300">
                        {t('contact.subtitle')}
                    </p>
                </div>

                <div className="mx-auto grid max-w-6xl grid-cols-1 gap-8 lg:grid-cols-2">
                    {/* Contact Form */}
                    <div className="rounded-2xl bg-slate-800 p-8 ring-1 ring-white/10">
                        <h2 className="text-2xl font-bold text-white mb-6">{t('contact.formTitle')}</h2>
                        <form onSubmit={handleSubmit} className="space-y-6">
                            <div>
                                <label htmlFor="name" className="block text-sm font-medium text-gray-300 mb-2">
                                    {t('contact.fullName')}
                                </label>
                                <input
                                    type="text"
                                    id="name"
                                    value={formData.name}
                                    onChange={handleChange}
                                    required
                                    className="w-full rounded-md bg-slate-700 border-0 px-4 py-3 text-white placeholder:text-gray-400 focus:ring-2 focus:ring-[#B70126]"
                                    placeholder={t('contact.fullNamePlaceholder')}
                                />
                            </div>
                            <div>
                                <label htmlFor="email" className="block text-sm font-medium text-gray-300 mb-2">
                                    {t('contact.email')}
                                </label>
                                <input
                                    type="email"
                                    id="email"
                                    value={formData.email}
                                    onChange={handleChange}
                                    required
                                    className="w-full rounded-md bg-slate-700 border-0 px-4 py-3 text-white placeholder:text-gray-400 focus:ring-2 focus:ring-[#B70126]"
                                    placeholder={t('contact.emailPlaceholder')}
                                />
                            </div>
                            <div>
                                <label htmlFor="phone" className="block text-sm font-medium text-gray-300 mb-2">
                                    {t('contact.phone')}
                                </label>
                                <input
                                    type="tel"
                                    id="phone"
                                    value={formData.phone}
                                    onChange={handleChange}
                                    className="w-full rounded-md bg-slate-700 border-0 px-4 py-3 text-white placeholder:text-gray-400 focus:ring-2 focus:ring-[#B70126]"
                                    placeholder={t('contact.phonePlaceholder')}
                                />
                            </div>
                            <div>
                                <label htmlFor="message" className="block text-sm font-medium text-gray-300 mb-2">
                                    {t('contact.message')}
                                </label>
                                <textarea
                                    id="message"
                                    value={formData.message}
                                    onChange={handleChange}
                                    rows={4}
                                    className="w-full rounded-md bg-slate-700 border-0 px-4 py-3 text-white placeholder:text-gray-400 focus:ring-2 focus:ring-[#B70126]"
                                    placeholder={t('contact.messagePlaceholder')}
                                />
                            </div>
                            <div>
                                <button
                                    type="submit"
                                    disabled={status === 'loading'}
                                    className="w-full rounded-md bg-[#B70126] px-6 py-3 text-base font-semibold text-white shadow-sm hover:bg-[#D9012D] transition-colors disabled:opacity-50"
                                >
                                    {status === 'loading' ? 'Enviando...' : t('contact.sendMessage')}
                                </button>
                                {status === 'success' && (
                                    <p className="mt-4 text-green-500 text-center font-medium">Message sent successfully!</p>
                                )}
                                {status === 'error' && (
                                    <p className="mt-4 text-red-500 text-center font-medium">Error sending message. Please try again.</p>
                                )}
                            </div>
                        </form>
                    </div>

                    {/* Contact Information */}
                    <div className="space-y-8">
                        <div className="rounded-2xl bg-slate-800 p-8 ring-1 ring-white/10">
                            <h2 className="text-2xl font-bold text-white mb-6">{t('contact.contactInfoTitle')}</h2>
                            <div className="space-y-6">
                                <div className="flex items-start gap-x-4">
                                    <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-[#B70126]/10">
                                        <Mail className="h-5 w-5 text-[#B70126]" />
                                    </div>
                                    <div>
                                        <h3 className="text-sm font-semibold text-white mb-1">{t('contact.emailLabel')}</h3>
                                        <p className="text-gray-300">contacto@ivanivanovich.com</p>
                                        <p className="text-gray-400 text-sm mt-1">{t('contact.centralAmerica')}: b.barrerra@ivanivanovich.com</p>
                                    </div>
                                </div>
                                <div className="flex items-start gap-x-4">
                                    <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-[#B70126]/10">
                                        <Phone className="h-5 w-5 text-[#B70126]" />
                                    </div>
                                    <div>
                                        <h3 className="text-sm font-semibold text-white mb-1">{t('contact.phoneLabel')}</h3>
                                        <p className="text-gray-300">CDMX: +52 666 888 000</p>
                                    </div>
                                </div>
                                <div className="flex items-start gap-x-4">
                                    <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-[#B70126]/10">
                                        <MapPin className="h-5 w-5 text-[#B70126]" />
                                    </div>
                                    <div>
                                        <h3 className="text-sm font-semibold text-white mb-1">{t('contact.locationLabel')}</h3>
                                        <p className="text-gray-300">{t('contact.cdmx')}</p>
                                        <p className="text-gray-400 text-sm mt-1">{t('contact.centralAmerica')}</p>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div className="rounded-2xl bg-slate-800 p-8 ring-1 ring-white/10">
                            <h3 className="text-xl font-bold text-white mb-4">{t('contact.businessHoursTitle')}</h3>
                            <div className="space-y-2 text-gray-300">
                                <p>{t('contact.mondayFriday')}</p>
                                <p>{t('contact.saturday')}</p>
                                <p>{t('contact.sunday')}</p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
