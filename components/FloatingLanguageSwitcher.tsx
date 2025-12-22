'use client';

import { useLanguage } from '@/components/providers/LanguageProvider';

export default function FloatingLanguageSwitcher() {
    const { language, switchLanguage } = useLanguage();

    return (
        <div className="fixed bottom-4 left-4 z-50 lg:hidden">
            <div className="flex items-center gap-1 bg-white/90 backdrop-blur-sm border border-gray-200 rounded-full shadow-lg px-3 py-2 text-sm font-semibold">
                <button
                    onClick={() => switchLanguage('es')}
                    className={`transition-colors ${language === 'es'
                        ? 'text-[#B70126]'
                        : 'text-gray-500'
                        }`}
                >
                    ES
                </button>
                <span className="text-gray-300">|</span>
                <button
                    onClick={() => switchLanguage('en')}
                    className={`transition-colors ${language === 'en'
                        ? 'text-[#B70126]'
                        : 'text-gray-500'
                        }`}
                >
                    EN
                </button>
            </div>
        </div>
    );
}
