'use client';

import React from 'react';
import { MapPin, Mail, Youtube, Facebook, Instagram } from 'lucide-react';
import { useTranslation } from '@/hooks/useTranslation';

export default function ContactSection() {
    const { t } = useTranslation();

    return (
        <section className="bg-white py-24 sm:py-32">
            <div className="mx-auto max-w-7xl px-6 lg:px-8">
                <div className="mx-auto max-w-2xl text-center mb-16 lg:text-left lg:mx-0">
                    <h2 className="text-4xl font-black tracking-tight text-black sm:text-5xl mb-6 uppercase" style={{
                        fontFamily: 'Montserrat, sans-serif'
                    }}>
                        {t('contact.title')}:
                    </h2>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-24">
                    {/* Left Column: Contact Info */}
                    <div className="space-y-8">
                        {/* Email Card */}
                        <div className="bg-white rounded-[30px] p-8 shadow-[0_0_40px_-10px_rgba(0,0,0,0.1)] flex items-center gap-6">
                            <div className="flex-grow">
                                <p className="text-lg font-bold text-black mb-1">contacto@ivanivanovich.com</p>
                                <p className="text-gray-500 text-sm">{t('contact.sendAction')}</p>
                            </div>
                        </div>

                        {/* Location Card */}
                        <div className="bg-white rounded-[30px] p-8 shadow-[0_0_40px_-10px_rgba(0,0,0,0.1)] flex items-center gap-6">
                            <div className="w-12 h-12 flex items-center justify-center flex-shrink-0">
                                <MapPin className="w-8 h-8 text-black" strokeWidth={2.5} />
                            </div>
                            <div>
                                <p className="text-lg font-bold text-black mb-1">CDMX</p>
                                <p className="text-gray-500 text-sm">{t('contact.addressLabel')}</p>
                            </div>
                        </div>

                        {/* Social Icons */}
                        <div className="flex gap-4 justify-center lg:justify-start pt-4">
                            <a
                                href="https://www.youtube.com/c/ivanivanovichproteccionejecutiva"
                                target="_blank"
                                rel="noopener noreferrer"
                                className="w-12 h-12 bg-[#B70126] rounded-full flex items-center justify-center text-white hover:bg-[#D9012D] transition-colors"
                            >
                                <Youtube className="w-6 h-6" />
                            </a>
                            <a
                                href="https://www.facebook.com/ivan.ivanovich.315"
                                target="_blank"
                                rel="noopener noreferrer"
                                className="w-12 h-12 bg-[#B70126] rounded-full flex items-center justify-center text-white hover:bg-[#D9012D] transition-colors"
                            >
                                <Facebook className="w-6 h-6" />
                            </a>
                            <a
                                href="https://www.instagram.com/ivan_ivanovich.ms/"
                                target="_blank"
                                rel="noopener noreferrer"
                                className="w-12 h-12 bg-[#B70126] rounded-full flex items-center justify-center text-white hover:bg-[#D9012D] transition-colors"
                            >
                                <Instagram className="w-6 h-6" />
                            </a>
                        </div>
                    </div>

                    {/* Right Column: Form */}
                    <div className="bg-white">
                        <form className="space-y-6">
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                                <div>
                                    <input
                                        type="text"
                                        placeholder={t('contact.formName')}
                                        className="w-full rounded-full bg-gray-100 px-6 py-4 text-gray-900 placeholder:text-gray-500 focus:ring-2 focus:ring-[#B70126] focus:outline-none border-none"
                                    />
                                </div>
                                <div>
                                    <input
                                        type="email"
                                        placeholder={t('contact.formEmail')}
                                        className="w-full rounded-full bg-gray-100 px-6 py-4 text-gray-900 placeholder:text-gray-500 focus:ring-2 focus:ring-[#B70126] focus:outline-none border-none"
                                    />
                                </div>
                            </div>

                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                                <div>
                                    <input
                                        type="tel"
                                        placeholder={t('contact.formPhone')}
                                        className="w-full rounded-full bg-gray-100 px-6 py-4 text-gray-900 placeholder:text-gray-500 focus:ring-2 focus:ring-[#B70126] focus:outline-none border-none"
                                    />
                                </div>
                                <div>
                                    <input
                                        type="text"
                                        placeholder={t('contact.subject')}
                                        className="w-full rounded-full bg-gray-100 px-6 py-4 text-gray-900 placeholder:text-gray-500 focus:ring-2 focus:ring-[#B70126] focus:outline-none border-none"
                                    />
                                </div>
                            </div>

                            <div>
                                <textarea
                                    rows={4}
                                    placeholder={t('contact.message')}
                                    className="w-full rounded-3xl bg-gray-100 px-6 py-4 text-gray-900 placeholder:text-gray-500 focus:ring-2 focus:ring-[#B70126] focus:outline-none border-none resize-none"
                                />
                            </div>

                            <div>
                                <button
                                    type="submit"
                                    className="w-full rounded-full bg-[#B70126] px-8 py-4 text-center text-base font-bold text-white shadow-sm hover:bg-[#D9012D] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#B70126] transition-colors"
                                >
                                    {t('contact.formButton')}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            </div>
        </section>
    );
}
