'use client';

import { useState } from 'react';
import { Link2, Check } from 'lucide-react';

/** Botones para compartir el artículo, conservando el idioma en la URL. */
export default function ShareArticle({
    slug,
    title,
    locale,
}: {
    slug: string;
    title: string;
    locale: string;
}) {
    const [copiado, setCopiado] = useState(false);
    // El prefijo mantiene el idioma al abrirlo, igual que el resto del sitio.
    const url = `https://ivanivanovich.com/${locale === 'en' ? 'en' : 'es'}/blog/${slug}`;
    const texto = encodeURIComponent(`${title} ${url}`);

    const copiar = async () => {
        try {
            await navigator.clipboard.writeText(url);
        } catch {
            const campo = document.createElement('input');
            campo.value = url;
            document.body.appendChild(campo);
            campo.select();
            document.execCommand('copy');
            document.body.removeChild(campo);
        }
        setCopiado(true);
        setTimeout(() => setCopiado(false), 2200);
    };

    const boton = 'flex h-9 w-9 items-center justify-center text-gray-500 transition-colors hover:text-[#B70126]';

    return (
        <div className="flex items-center gap-1">
            <span className="mr-2 text-sm text-gray-500">{locale === 'en' ? 'Share:' : 'Compartir:'}</span>

            <a href={`https://wa.me/?text=${texto}`} target="_blank" rel="noopener noreferrer" aria-label="WhatsApp" className={boton}>
                <svg viewBox="0 0 24 24" className="h-5 w-5" fill="currentColor"><path d="M17.5 14.4c-.3-.1-1.8-.9-2-1-.3-.1-.5-.1-.7.1-.2.3-.7.9-.9 1.1-.2.2-.3.2-.6.1-.3-.1-1.2-.5-2.3-1.4-.9-.8-1.4-1.7-1.6-2-.2-.3 0-.5.1-.6l.4-.5c.2-.2.2-.3.3-.5.1-.2 0-.4 0-.5 0-.1-.7-1.6-.9-2.2-.2-.6-.5-.5-.7-.5h-.6c-.2 0-.5.1-.8.4-.3.3-1 1-1 2.4s1 2.8 1.2 3c.1.2 2 3.1 4.9 4.3 2.9 1.2 2.9.8 3.4.8.5 0 1.7-.7 2-1.4.2-.7.2-1.2.2-1.4-.1-.1-.3-.2-.5-.3M12 2a10 10 0 0 0-8.6 15L2 22l5.1-1.3A10 10 0 1 0 12 2m0 18.2c-1.7 0-3.3-.5-4.7-1.3l-.3-.2-3 .8.8-2.9-.2-.3A8.2 8.2 0 1 1 12 20.2" /></svg>
            </a>

            <a href={`https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(url)}`} target="_blank" rel="noopener noreferrer" aria-label="LinkedIn" className={boton}>
                <svg viewBox="0 0 24 24" className="h-5 w-5" fill="currentColor"><path d="M4.98 3.5a2.5 2.5 0 1 1 0 5 2.5 2.5 0 0 1 0-5M3 9h4v12H3zM9 9h3.8v1.7h.1c.5-1 1.8-2 3.7-2 4 0 4.7 2.5 4.7 5.8V21h-4v-5.6c0-1.3 0-3-1.9-3s-2.2 1.4-2.2 2.9V21H9z" /></svg>
            </a>

            <a href={`https://twitter.com/intent/tweet?text=${texto}`} target="_blank" rel="noopener noreferrer" aria-label="X" className={boton}>
                <svg viewBox="0 0 24 24" className="h-[18px] w-[18px]" fill="currentColor"><path d="M18.9 2H22l-6.8 7.8L23 22h-6.2l-4.9-6.4L6.2 22H3l7.3-8.3L2.4 2h6.4l4.4 5.8zm-1.1 18h1.7L8.3 3.7H6.5z" /></svg>
            </a>

            <button onClick={copiar} aria-label={locale === 'en' ? 'Copy link' : 'Copiar enlace'} className={boton}>
                {copiado ? <Check className="h-5 w-5 text-green-600" /> : <Link2 className="h-5 w-5" />}
            </button>
        </div>
    );
}
