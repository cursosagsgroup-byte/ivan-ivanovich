'use client';

import { useLanguage } from '@/components/providers/LanguageProvider';

export default function LanguageSwitcher() {
    const { language, switchLanguage } = useLanguage();

    return (
        <div className="flex items-center gap-1 text-sm font-semibold">
            <button
                onClick={() => switchLanguage('es')}
                className={`px-2 py-1 transition-colors ${language === 'es'
                        ? 'text-[#B70126]'
                        : 'text-gray-500 hover:text-gray-900'
                    }`}
            >
                ES
            </button>
            <span className="text-gray-300">|</span>
            <button
                onClick={() => switchLanguage('en')}
                className={`px-2 py-1 transition-colors ${language === 'en'
                        ? 'text-[#B70126]'
                        : 'text-gray-500 hover:text-gray-900'
                    }`}
            >
                EN
            </button>
        </div>
    );
}
