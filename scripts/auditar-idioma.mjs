/**
 * Auditoría de fugas de idioma: recorre las páginas en inglés buscando texto
 * en español que no debería estar ahí. Uso:
 *
 *   node scripts/auditar-idioma.mjs [base]
 *
 * base por defecto: http://localhost:3000 (pasar https://ivanivanovich.com
 * para auditar producción). Sale con código 1 si encuentra fugas, así puede
 * usarse como verificación antes de desplegar.
 */
const BASE = process.argv[2] || 'http://localhost:3000';

const PAGINAS = ['/en', '/en/educacion/cursos-online', '/en/educacion/team-leader',
    '/en/educacion/counter-surveillance', '/en/blog', '/en/eventos', '/en/contacto',
    '/en/educacion/libro', '/en/servicios', '/en/nuestro-equipo'];

const FUGAS = ['Inscribirse', 'Descargar', 'Próximos', 'No hay fechas', '¡Contáctanos',
    'Avísenme', 'Avísame', 'Cupos limitados', 'Nombre completo', 'Correo electrónico',
    'Teléfono', 'Mensaje', 'Enviar', 'Leer más', 'Ver cursos', 'Conoce los',
    'Todos los derechos', 'Aprende cómo', 'de la semana', 'Agotado'];

let total = 0;
for (const ruta of PAGINAS) {
    try {
        const res = await fetch(BASE + ruta, { redirect: 'follow' });
        let html = await res.text();
        html = html.replace(/<script[\s\S]*?<\/script>/g, '');
        const encontradas = FUGAS.filter((w) => html.includes(w));
        if (encontradas.length) {
            total += encontradas.length;
            console.log(`✗ ${ruta}: ${encontradas.join(', ')}`);
        } else {
            console.log(`✓ ${ruta}`);
        }
    } catch (e) {
        console.log(`? ${ruta}: ${e.message}`);
    }
}
console.log(total === 0 ? '\nSin fugas de idioma.' : `\n${total} fugas encontradas.`);
process.exit(total === 0 ? 0 : 1);
