'use client';

import Link from 'next/link';
import { Facebook, Instagram, Youtube } from 'lucide-react';
import { useTranslation } from '@/hooks/useTranslation';

export default function PublicFooter() {
    const { t } = useTranslation();

    return (
        <footer className="bg-black border-t border-white/10">
            <div className="mx-auto max-w-7xl px-6 py-16 lg:px-8">
                <div className="grid grid-cols-1 gap-8 lg:grid-cols-3">
                    {/* Contact Section */}
                    <div>
                        <h3 className="text-sm font-bold uppercase tracking-wider text-white mb-4">{t('footer.contactTitle')}</h3>
                        <ul className="space-y-3 text-sm text-gray-400">
                            <li>CDMX</li>
                            <li>
                                <a href="mailto:contacto@ivanivanovich.com" className="hover:text-white transition-colors">
                                    contacto@ivanivanovich.com
                                </a>
                            </li>
                            <li>{t('contact.centralAmerica')}</li>
                            <li>
                                <a href="mailto:b.barrerra@ivanivanovich.com" className="hover:text-white transition-colors">
                                    b.barrerra@ivanivanovich.com
                                </a>
                            </li>
                        </ul>
                    </div>

                    {/* Company Section */}
                    <div>
                        <h3 className="text-sm font-bold uppercase tracking-wider text-white mb-4">{t('footer.companyTitle')}</h3>
                        <ul className="space-y-3 text-sm text-gray-400">
                            <li>
                                <Link href="/nuestro-equipo" className="hover:text-white transition-colors">
                                    {t('footer.aboutCompany')}
                                </Link>
                            </li>
                            <li>
                                <Link href="#" className="hover:text-white transition-colors">
                                    {t('footer.privacyPolicy')}
                                </Link>
                            </li>
                            <li>
                                <Link href="#" className="hover:text-white transition-colors">
                                    {t('footer.termsConditions')}
                                </Link>
                            </li>
                            <li>
                                <Link href="/contacto" className="hover:text-white transition-colors">
                                    {t('footer.contactUs')}
                                </Link>
                            </li>
                            <li>
                                <Link href="#" className="hover:text-white transition-colors">
                                    {t('footer.documentation')}
                                </Link>
                            </li>
                        </ul>
                    </div>

                    {/* Social Media Section */}
                    <div>
                        <h3 className="text-sm font-bold uppercase tracking-wider text-white mb-4">{t('footer.socialMediaTitle')}</h3>
                        <div className="flex gap-4">
                            <a
                                href="https://www.youtube.com/c/ivanivanovichproteccionejecutiva"
                                target="_blank"
                                rel="noopener noreferrer"
                                className="text-gray-400 hover:text-white transition-colors"
                            >
                                <Youtube className="h-6 w-6" />
                            </a>
                            <a
                                href="https://www.facebook.com/ivan.ivanovich.315"
                                target="_blank"
                                rel="noopener noreferrer"
                                className="text-gray-400 hover:text-white transition-colors"
                            >
                                <Facebook className="h-6 w-6" />
                            </a>
                            <a
                                href="https://www.instagram.com/ivan_ivanovich.ms/"
                                target="_blank"
                                rel="noopener noreferrer"
                                className="text-gray-400 hover:text-white transition-colors"
                            >
                                <Instagram className="h-6 w-6" />
                            </a>
                        </div>
                    </div>
                </div>

                {/* Bottom Section */}
                <div className="mt-12 pt-8 border-t border-white/10 flex flex-col md:flex-row justify-between items-center gap-4">
                    <p className="text-center text-xs text-gray-500">
                        &copy; {new Date().getFullYear()} Ivan Ivanovich - Executive Protection Academy. {t('footer.rights')}.
                    </p>
                    <Link href="/login" className="text-xs text-gray-600 hover:text-gray-400 transition-colors">
                        {t('footer.admin')}
                    </Link>
                </div>
            </div>
        </footer>
    );
}
