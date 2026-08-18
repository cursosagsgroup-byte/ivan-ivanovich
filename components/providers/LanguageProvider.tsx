'use client';

import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { setLanguage } from '@/actions/language';
import { usePathname } from 'next/navigation';
import { rutaEnIdioma } from '@/lib/language-routes';

type Language = 'es' | 'en';

interface LanguageContextType {
    language: Language;
    switchLanguage: (lang: Language) => Promise<void>;
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export function LanguageProvider({
    children,
    initialLanguage = 'es'
}: {
    children: ReactNode;
    initialLanguage?: string;
}) {
    const [language, setLanguageState] = useState<Language>(initialLanguage as Language);
    const pathname = usePathname();

    const switchLanguage = async (lang: Language) => {
        setLanguageState(lang);
        await setLanguage(lang);
        // Navegar en vez de recargar: si la página tiene gemela en el otro
        // idioma hay que ir a ella, y el prefijo /en deja el idioma en la URL.
        window.location.href = rutaEnIdioma(pathname || '/', lang);
    };

    return (
        <LanguageContext.Provider value={{ language, switchLanguage }}>
            {children}
        </LanguageContext.Provider>
    );
}

export function useLanguage() {
    const context = useContext(LanguageContext);
    if (context === undefined) {
        throw new Error('useLanguage must be used within a LanguageProvider');
    }
    return context;
}
