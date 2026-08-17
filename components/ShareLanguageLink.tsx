'use client';

import { useEffect, useState } from 'react';
import { usePathname } from 'next/navigation';
import { Check, Link2, Share2 } from 'lucide-react';
import { useLanguage } from '@/components/providers/LanguageProvider';
import { useTranslation } from '@/hooks/useTranslation';

/**
 * Copia la URL de la página conservando el idioma que se está viendo.
 *
 * El idioma vive en una cookie, no en la URL, así que un enlace copiado de la
 * barra de direcciones llega al destinatario en español aunque el emisor
 * estuviera en inglés. El middleware ya entiende el prefijo /en, que fija la
 * cookie y redirige: aquí solo lo anteponemos al compartir desde inglés.
 */
export default function ShareLanguageLink({ className = '' }: { className?: string }) {
    const pathname = usePathname();
    const { language } = useLanguage();
    const { t } = useTranslation();
    const [copiado, setCopiado] = useState(false);
    // Se resuelve en el cliente: en SSR no existe navigator.
    const [puedeCompartir, setPuedeCompartir] = useState(false);

    useEffect(() => {
        setPuedeCompartir(typeof navigator !== 'undefined' && typeof navigator.share === 'function');
    }, []);

    const construirUrl = () => {
        const origin = typeof window !== 'undefined' ? window.location.origin : 'https://ivanivanovich.com';
        const ruta = pathname || '/';
        // El prefijo solo hace falta para inglés: español es el idioma por defecto.
        return language === 'en' ? `${origin}/en${ruta}` : `${origin}${ruta}`;
    };

    const compartir = async () => {
        const url = construirUrl();

        // En móvil abre la hoja nativa de compartir (WhatsApp, etc.).
        if (puedeCompartir) {
            try {
                await navigator.share({ url });
                return;
            } catch {
                // Cancelado o no permitido: se copia como alternativa.
            }
        }

        try {
            await navigator.clipboard.writeText(url);
        } catch {
            // Navegadores sin permiso de portapapeles: selección manual.
            const campo = document.createElement('input');
            campo.value = url;
            document.body.appendChild(campo);
            campo.select();
            document.execCommand('copy');
            document.body.removeChild(campo);
        }

        setCopiado(true);
        setTimeout(() => setCopiado(false), 2500);
    };

    return (
        <button
            type="button"
            onClick={compartir}
            aria-live="polite"
            className={`inline-flex items-center gap-2 rounded-full border border-gray-300 px-5 py-2.5 text-sm font-bold text-gray-700 transition-colors hover:border-[#B70126] hover:text-[#B70126] ${className}`}
        >
            {copiado ? (
                <>
                    <Check className="h-4 w-4 text-green-600" />
                    {t('share.copied')}
                </>
            ) : (
                <>
                    {puedeCompartir ? <Share2 className="h-4 w-4" /> : <Link2 className="h-4 w-4" />}
                    {t('share.button')}
                </>
            )}
        </button>
    );
}
