'use client';

import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { setLanguage } from '@/actions/language';
import { useRouter } from 'next/navigation';

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
    const router = useRouter();

    const switchLanguage = async (lang: Language) => {
        setLanguageState(lang);
        await setLanguage(lang);
        router.refresh(); // Refresh server components
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
