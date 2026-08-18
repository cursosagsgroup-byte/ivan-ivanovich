/**
 * Rutas que existen como página propia en cada idioma.
 *
 * La mayoría del sitio es bilingüe con una sola ruta (los textos salen de las
 * traducciones), pero unas pocas tienen página separada porque su contenido
 * fijo cambia —vídeos, por ejemplo—. Sin este mapa, el conmutador ES|EN
 * cambiaba el idioma pero dejaba al visitante en la ruta del otro idioma:
 * textos en español con el vídeo en inglés.
 */
// Vacío desde la fusión de contravigilancia/counter-surveillance: hoy todas
// las páginas sirven ambos idiomas en la misma ruta. Si alguna vuelve a
// necesitar página propia por idioma, se registra aquí su pareja.
const ES_A_EN: Record<string, string> = {};

const EN_A_ES: Record<string, string> = Object.fromEntries(
    Object.entries(ES_A_EN).map(([es, en]) => [en, es])
);

/** Quita el prefijo /en de una ruta, si lo lleva. */
export function rutaSinPrefijo(pathname: string): string {
    const limpia = pathname.replace(/^\/(en|es)(?=\/|$)/, '');
    return limpia === '' ? '/' : limpia;
}

/**
 * URL equivalente de `pathname` en el idioma `destino`.
 * Traduce la ruta si tiene gemela y añade o quita el prefijo /en, que es lo
 * que mantiene el idioma al compartir el enlace.
 */
export function rutaEnIdioma(pathname: string, destino: 'es' | 'en'): string {
    let ruta = rutaSinPrefijo(pathname);

    if (destino === 'en' && ES_A_EN[ruta]) {
        ruta = ES_A_EN[ruta];
    } else if (destino === 'es' && EN_A_ES[ruta]) {
        ruta = EN_A_ES[ruta];
    }

    // Ambos idiomas llevan prefijo: la ruta desnuda significa "el idioma que
    // el visitante ya tenga", no "español". Sin el prefijo /es, un enlace
    // compartido se abría en inglés si el destinatario había visitado antes
    // una página en inglés. /es redirige a la ruta limpia tras fijar el idioma.
    if (destino === 'es') return ruta === '/' ? '/es' : `/es${ruta}`;
    return ruta === '/' ? '/en' : `/en${ruta}`;
}
