import { useLanguage } from '@/components/providers/LanguageProvider';
import { translations, Language } from '@/lib/translations';

export function useTranslation() {
    const { language } = useLanguage();

    const t = (key: string): any => {
        const keys = key.split('.');
        let value: any = translations[language as Language];

        for (const k of keys) {
            if (value && typeof value === 'object' && k in value) {
                value = value[k];
            } else {
                console.warn(`Translation key not found: ${key}`);
                return key;
            }
        }

        return value;
    };

    return { t, language };
}
