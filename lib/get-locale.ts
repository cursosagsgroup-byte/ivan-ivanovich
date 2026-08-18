import { cookies, headers } from 'next/headers';

export type Locale = 'es' | 'en';

/**
 * Idioma de la petición actual, por orden de prioridad:
 *
 *  1. Cabecera x-locale que inyecta el middleware para las rutas /en/...
 *     Es una señal explícita de la URL, así que gana sobre todo lo demás:
 *     un enlace compartido debe abrirse en su idioma aunque quien lo reciba
 *     tenga otra preferencia guardada.
 *  2. Cookie NEXT_LOCALE, que refleja el conmutador ES|EN del sitio.
 *  3. Español, el idioma por defecto.
 */
export async function getLocale(): Promise<Locale> {
    const headerList = await headers();
    const fromUrl = headerList.get('x-locale');
    if (fromUrl === 'en' || fromUrl === 'es') return fromUrl;

    const cookieStore = await cookies();
    return cookieStore.get('NEXT_LOCALE')?.value === 'en' ? 'en' : 'es';
}

/** True si el idioma viene impuesto por la URL (/en/...), no por la cookie. */
export async function localeFromUrl(): Promise<boolean> {
    const headerList = await headers();
    const v = headerList.get('x-locale');
    return v === 'en' || v === 'es';
}
