'use client';

import Link from 'next/link';
import { useState } from 'react';
import { Menu, X, ChevronDown, User } from 'lucide-react';
import Image from 'next/image';
import CartIcon from '@/components/cart/CartIcon';
import LanguageSwitcher from '@/components/LanguageSwitcher';
import { useTranslation } from '@/hooks/useTranslation';

export default function PublicNavbar() {
    const { t } = useTranslation();
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
    const [liderazgoOpen, setLiderazgoOpen] = useState(false);
    const [educacionOpen, setEducacionOpen] = useState(false);

    return (
        <header className="fixed top-0 left-1/2 -translate-x-1/2 z-50 w-[90%] mt-4">
            <nav className="backdrop-blur-md bg-white/80 border border-white/20 shadow-lg rounded-[30px] px-6 py-4" aria-label="Global">
                <div className="flex items-center justify-between">
                    {/* Logo */}
                    <div className="flex lg:flex-1">
                        <Link href="/" className="-m-1.5 p-1.5">
                            <Image
                                src="/logo.png"
                                alt="Ivan Ivanovich - Executive Protection Academy"
                                width={280}
                                height={70}
                                className="h-14 w-auto"
                                priority
                            />
                        </Link>
                    </div>

                    {/* Mobile menu button and User Icon */}
                    <div className="flex items-center gap-4 lg:hidden">
                        <Link href="/mi-cuenta" className="-m-2.5 p-2.5 text-gray-700 hover:text-[#B70126] transition-colors">
                            <User className="h-6 w-6" aria-hidden="true" />
                        </Link>
                        <button
                            type="button"
                            className="-m-2.5 inline-flex items-center justify-center rounded-md p-2.5 text-gray-700"
                            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                        >
                            <span className="sr-only">Open main menu</span>
                            {mobileMenuOpen ? (
                                <X className="h-6 w-6" aria-hidden="true" />
                            ) : (
                                <Menu className="h-6 w-6" aria-hidden="true" />
                            )}
                        </button>
                    </div>

                    {/* Desktop menu */}
                    <div className="hidden lg:flex lg:gap-x-8">
                        <Link href="/" className="text-sm font-semibold leading-6 text-gray-900 hover:text-[#B70126] transition-colors">
                            {t('nav.home')}
                        </Link>

                        {/* Liderazgo Dropdown */}
                        <div
                            className="relative"
                            onMouseEnter={() => setLiderazgoOpen(true)}
                            onMouseLeave={() => setLiderazgoOpen(false)}
                        >
                            <button
                                className="flex items-center gap-x-1 text-sm font-semibold leading-6 text-gray-900 hover:text-[#B70126] transition-colors"
                            >
                                {t('nav.leadership')}
                                <ChevronDown className="h-4 w-4" />
                            </button>
                            {liderazgoOpen && (
                                <div
                                    className="absolute -left-8 top-full z-10 pt-3 w-56"
                                >
                                    <div className="rounded-xl bg-white/95 backdrop-blur-md p-2 shadow-lg ring-1 ring-gray-900/5">
                                        <Link href="/nuestro-equipo" className="block rounded-lg px-3 py-2 text-sm font-semibold leading-6 text-gray-900 hover:bg-gray-50">
                                            {t('nav.ourTeam')}
                                        </Link>
                                        <Link href="/medios" className="block rounded-lg px-3 py-2 text-sm font-semibold leading-6 text-gray-900 hover:bg-gray-50">
                                            {t('nav.media')}
                                        </Link>
                                        <Link href="/sobre-la-proteccion" className="block rounded-lg px-3 py-2 text-sm font-semibold leading-6 text-gray-900 hover:bg-gray-50">
                                            {t('nav.aboutProtection')}
                                        </Link>
                                    </div>
                                </div>
                            )}
                        </div>

                        {/* Educación Dropdown */}
                        <div
                            className="relative"
                            onMouseEnter={() => setEducacionOpen(true)}
                            onMouseLeave={() => setEducacionOpen(false)}
                        >
                            <button
                                className="flex items-center gap-x-1 text-sm font-semibold leading-6 text-gray-900 hover:text-[#B70126] transition-colors"
                            >
                                {t('nav.education')}
                                <ChevronDown className="h-4 w-4" />
                            </button>
                            {educacionOpen && (
                                <div
                                    className="absolute -left-8 top-full z-10 pt-3 w-56"
                                >
                                    <div className="rounded-xl bg-white/95 backdrop-blur-md p-2 shadow-lg ring-1 ring-gray-900/5">
                                        <Link href="/educacion/cursos-online" className="block rounded-lg px-3 py-2 text-sm font-semibold leading-6 text-gray-900 hover:bg-gray-50">
                                            {t('nav.onlineCourses')}
                                        </Link>
                                        <Link href="/educacion/cursos-presenciales" className="block rounded-lg px-3 py-2 text-sm font-semibold leading-6 text-gray-900 hover:bg-gray-50">
                                            {t('nav.inPersonCourses')}
                                        </Link>
                                        <Link href="/educacion/libro" className="block rounded-lg px-3 py-2 text-sm font-semibold leading-6 text-gray-900 hover:bg-gray-50">
                                            {t('nav.book')}
                                        </Link>
                                        <Link href="/educacion/certificado-deta" className="block rounded-lg px-3 py-2 text-sm font-semibold leading-6 text-gray-900 hover:bg-gray-50">
                                            {t('nav.detaCertificate')}
                                        </Link>
                                    </div>
                                </div>
                            )}
                        </div>

                        <Link href="/eventos" className="text-sm font-semibold leading-6 text-gray-900 hover:text-[#B70126] transition-colors">
                            Eventos
                        </Link>
                        <Link href="/blog" className="text-sm font-semibold leading-6 text-gray-900 hover:text-[#B70126] transition-colors">
                            {t('nav.blog')}
                        </Link>
                        <Link href="/contacto" className="text-sm font-semibold leading-6 text-gray-900 hover:text-[#B70126] transition-colors">
                            {t('nav.contact')}
                        </Link>
                    </div>

                    {/* CTA Buttons */}
                    <div className="hidden lg:flex lg:flex-1 lg:justify-end lg:gap-x-6 lg:items-center">
                        <Link href="/mi-cuenta" className="text-sm font-semibold leading-6 text-gray-900 hover:text-[#B70126] transition-colors">
                            {t('nav.myAccount')}
                        </Link>
                        <LanguageSwitcher />
                        <CartIcon />
                    </div>
                </div>

                {/* Mobile menu */}
                {mobileMenuOpen && (
                    <div className="lg:hidden mt-4 pt-4 border-t border-gray-200 max-h-[70vh] overflow-y-auto">
                        <div className="space-y-2">
                            <Link
                                href="/mi-cuenta"
                                className="block rounded-lg px-3 py-2 text-base font-semibold leading-7 text-gray-900 hover:bg-gray-50"
                                onClick={() => setMobileMenuOpen(false)}
                            >
                                {t('nav.myAccount')}
                            </Link>
                            <Link
                                href="/"
                                className="block rounded-lg px-3 py-2 text-base font-semibold leading-7 text-gray-900 hover:bg-gray-50"
                                onClick={() => setMobileMenuOpen(false)}
                            >
                                {t('nav.home')}
                            </Link>
                            <div className="space-y-2">
                                <div className="px-3 py-2 text-sm font-semibold text-gray-500">{t('nav.leadership')}</div>
                                <Link
                                    href="/nuestro-equipo"
                                    className="block rounded-lg px-6 py-2 text-sm leading-7 text-gray-900 hover:bg-gray-50"
                                    onClick={() => setMobileMenuOpen(false)}
                                >
                                    {t('nav.ourTeam')}
                                </Link>
                                <Link
                                    href="/medios"
                                    className="block rounded-lg px-6 py-2 text-sm leading-7 text-gray-900 hover:bg-gray-50"
                                    onClick={() => setMobileMenuOpen(false)}
                                >
                                    {t('nav.media')}
                                </Link>
                                <Link
                                    href="/sobre-la-proteccion"
                                    className="block rounded-lg px-6 py-2 text-sm leading-7 text-gray-900 hover:bg-gray-50"
                                    onClick={() => setMobileMenuOpen(false)}
                                >
                                    {t('nav.aboutProtection')}
                                </Link>
                            </div>
                            <div className="space-y-2">
                                <div className="px-3 py-2 text-sm font-semibold text-gray-500">{t('nav.education')}</div>
                                <Link
                                    href="/educacion/cursos-online"
                                    className="block rounded-lg px-6 py-2 text-sm leading-7 text-gray-900 hover:bg-gray-50"
                                    onClick={() => setMobileMenuOpen(false)}
                                >
                                    {t('nav.onlineCourses')}
                                </Link>
                                <Link
                                    href="/educacion/cursos-presenciales"
                                    className="block rounded-lg px-6 py-2 text-sm leading-7 text-gray-900 hover:bg-gray-50"
                                    onClick={() => setMobileMenuOpen(false)}
                                >
                                    {t('nav.inPersonCourses')}
                                </Link>
                                <Link
                                    href="/educacion/libro"
                                    className="block rounded-lg px-6 py-2 text-sm leading-7 text-gray-900 hover:bg-gray-50"
                                    onClick={() => setMobileMenuOpen(false)}
                                >
                                    {t('nav.book')}
                                </Link>
                                <Link
                                    href="/educacion/certificado-deta"
                                    className="block rounded-lg px-6 py-2 text-sm leading-7 text-gray-900 hover:bg-gray-50"
                                    onClick={() => setMobileMenuOpen(false)}
                                >
                                    {t('nav.detaCertificate')}
                                </Link>
                            </div>
                            <Link
                                href="/eventos"
                                className="block rounded-lg px-3 py-2 text-base font-semibold leading-7 text-gray-900 hover:bg-gray-50"
                                onClick={() => setMobileMenuOpen(false)}
                            >
                                Eventos
                            </Link>
                            <Link
                                href="/blog"
                                className="block rounded-lg px-3 py-2 text-base font-semibold leading-7 text-gray-900 hover:bg-gray-50"
                                onClick={() => setMobileMenuOpen(false)}
                            >
                                {t('nav.blog')}
                            </Link>
                            <Link
                                href="/contacto"
                                className="block rounded-lg px-3 py-2 text-base font-semibold leading-7 text-gray-900 hover:bg-gray-50"
                                onClick={() => setMobileMenuOpen(false)}
                            >
                                {t('nav.contact')}
                            </Link>
                        </div>
                    </div>
                )}
            </nav>
        </header>
    );
}
