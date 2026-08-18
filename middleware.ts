import { withAuth } from "next-auth/middleware"
import { NextResponse } from "next/server"
import type { NextRequest } from "next/server"

// Cookies de sesión de NextAuth (incluyendo posibles chunks)
const NEXTAUTH_COOKIE_NAMES = [
    'next-auth.session-token',
    '__Secure-next-auth.session-token',
    'next-auth.session-token.0',
    'next-auth.session-token.1',
    'next-auth.session-token.2',
    '__Secure-next-auth.session-token.0',
    '__Secure-next-auth.session-token.1',
    '__Secure-next-auth.session-token.2',
    'next-auth.callback-url',
    '__Secure-next-auth.callback-url',
    'next-auth.csrf-token',
    '__Host-next-auth.csrf-token',
];

/**
 * Limpia cookies infladas de NextAuth.
 * Retorna una respuesta con las cookies borradas si detecta el problema,
 * o null si todo está bien.
 */
function handleBloatedCookies(req: NextRequest): NextResponse | null {
    const cookieHeader = req.headers.get('cookie') || '';
    const cookieSizeBytes = new TextEncoder().encode(cookieHeader).length;

    if (cookieSizeBytes <= 12000) return null;

    console.warn(`[MIDDLEWARE] Cookie header too large (${cookieSizeBytes} bytes), clearing session cookies`);

    const pathname = req.nextUrl.pathname;
    const isApiRoute = pathname.startsWith('/api/');

    let response: NextResponse;

    if (isApiRoute) {
        // Para rutas API: no podemos redirigir, devolvemos JSON de sesión vacía
        // para que el cliente maneje el estado no-autenticado limpiamente
        response = NextResponse.json(null, { status: 200 });
    } else {
        // Para páginas: redirigir al login con mensaje de reset
        response = NextResponse.redirect(new URL('/login?reason=session_reset', req.url));
    }

    // Borrar todas las cookies de sesión stale
    for (const cookieName of NEXTAUTH_COOKIE_NAMES) {
        response.cookies.set(cookieName, '', {
            maxAge: 0,
            path: '/',
            httpOnly: true,
            sameSite: 'lax',
        });
    }

    return response;
}

export default withAuth(
    function middleware(req) {
        const pathname = req.nextUrl.pathname;

        // PROTECCIÓN CONTRA 494: Detectar cookies infladas PRIMERO
        const bloatedResponse = handleBloatedCookies(req);
        if (bloatedResponse) return bloatedResponse;

        // Rutas públicas que NO requieren sesión
        if (pathname.startsWith('/checkout')) {
            return NextResponse.next();
        }

        // Skip auth logic for NextAuth API routes
        if (pathname.startsWith("/api/auth")) {
            return NextResponse.next();
        }

        // Force non-www
        const hostname = req.headers.get("host") || "";
        if (hostname.startsWith("www.")) {
            const newUrl = new URL(req.url);
            newUrl.hostname = hostname.replace("www.", "");
            return NextResponse.redirect(newUrl);
        }

        // Rutas por idioma.
        //
        // /en/...  se REESCRIBE (no se redirige): la URL permanece en la barra
        // de direcciones y devuelve 200, así Google puede indexarla como la
        // versión en inglés y el hreflang tiene a dónde apuntar. Antes redirigía
        // a la ruta sin prefijo, de modo que el idioma solo vivía en una cookie
        // y un enlace compartido llegaba en español.
        //
        // /es/...  se sigue redirigiendo: el español es el idioma por defecto y
        // ya se sirve en la ruta limpia; mantener las dos crearía duplicados.
        if (pathname === '/en' || pathname.startsWith('/en/')) {
            const destino = pathname.replace(/^\/en/, '') || '/';
            const url = new URL(destino, req.url);
            url.search = req.nextUrl.search;

            // La cabecera le dice al servidor en qué idioma renderizar esta
            // petición, sin depender de que la cookie ya esté puesta.
            const requestHeaders = new Headers(req.headers);
            requestHeaders.set('x-locale', 'en');

            const response = NextResponse.rewrite(url, { request: { headers: requestHeaders } });
            response.cookies.set('NEXT_LOCALE', 'en', {
                path: '/',
                maxAge: 60 * 60 * 24 * 365,
                sameSite: 'lax'
            });
            return response;
        }

        if (pathname === '/es' || pathname.startsWith('/es/')) {
            const destino = pathname.replace(/^\/es/, '') || '/';
            const url = new URL(destino, req.url);
            url.search = req.nextUrl.search;

            const response = NextResponse.redirect(url);
            response.cookies.set('NEXT_LOCALE', 'es', {
                path: '/',
                maxAge: 60 * 60 * 24 * 365,
                sameSite: 'lax'
            });
            return response;
        }

        // Primera visita sin preferencia: se deduce el idioma del navegador
        // (Accept-Language) y, si este no dice nada, del país de la IP que
        // reporta Vercel. Solo para personas: los rastreadores reciben siempre
        // el español por defecto, y el hreflang les señala la versión /en.
        // Un clic en ES|EN o un enlace /en pisan esta deducción.
        const yaTienePreferencia = req.cookies.get('NEXT_LOCALE');
        const esNavegacion = req.headers.get('sec-fetch-dest') !== 'image';
        const userAgent = (req.headers.get('user-agent') || '').toLowerCase();
        const esBot = /bot|crawl|spider|slurp|bingpreview|facebookexternalhit|whatsapp|telegram|preview/.test(userAgent);

        if (!yaTienePreferencia && esNavegacion && !esBot) {
            const acceptLanguage = (req.headers.get('accept-language') || '').toLowerCase();
            const primerIdioma = acceptLanguage.split(',')[0] || '';

            let idioma: 'es' | 'en' | null = null;
            if (primerIdioma.startsWith('es')) idioma = 'es';
            else if (primerIdioma.startsWith('en')) idioma = 'en';
            else if (!acceptLanguage) {
                // Navegador mudo: país de la IP como respaldo
                const pais = req.headers.get('x-vercel-ip-country') || '';
                const PAISES_EN = ['US', 'GB', 'CA', 'AU', 'NZ', 'IE'];
                if (PAISES_EN.includes(pais)) idioma = 'en';
            }

            if (idioma === 'en') {
                // Renderizar YA esta petición en inglés y recordar la elección
                const requestHeaders = new Headers(req.headers);
                requestHeaders.set('x-locale', 'en');
                const response = NextResponse.next({ request: { headers: requestHeaders } });
                response.cookies.set('NEXT_LOCALE', 'en', { path: '/', maxAge: 60 * 60 * 24 * 365, sameSite: 'lax' });
                return response;
            }
            if (idioma === 'es') {
                const response = NextResponse.next();
                response.cookies.set('NEXT_LOCALE', 'es', { path: '/', maxAge: 60 * 60 * 24 * 365, sameSite: 'lax' });
                return response;
            }
        }

        const token = req.nextauth.token
        const isAuth = !!token
        const isAuthPage = pathname.startsWith('/login') || pathname.startsWith('/register')

        // Role-based redirects after login
        if (isAuthPage && isAuth) {
            if (token?.role === 'STUDENT') {
                return NextResponse.redirect(new URL('/mi-cuenta', req.url))
            }
            return NextResponse.redirect(new URL('/admin/dashboard', req.url))
        }

        if (isAuthPage) {
            return null
        }

        // El middleware ahora corre en todo el sitio (para la detección de
        // idioma), así que lo protegido se declara explícitamente en vez de
        // asumir que todo lo que llega aquí lo es.
        const RUTAS_PROTEGIDAS = ['/dashboard', '/mi-cuenta', '/profile', '/certificates', '/admin'];
        const esProtegida = RUTAS_PROTEGIDAS.some(r => pathname === r || pathname.startsWith(`${r}/`));

        if (!isAuth && esProtegida) {
            let from = pathname;
            if (req.nextUrl.search) {
                from += req.nextUrl.search;
            }
            return NextResponse.redirect(
                new URL(`/login?from=${encodeURIComponent(from)}`, req.url)
            );
        }

        // Protect admin dashboard
        if (pathname.startsWith('/admin') && token?.role !== 'ADMIN') {
            return NextResponse.redirect(new URL('/mi-cuenta', req.url))
        }

        // Protect student area
        if (pathname.startsWith('/mi-cuenta') && token?.role === 'ADMIN') {
            return NextResponse.redirect(new URL('/admin/dashboard', req.url))
        }
    },
    {
        callbacks: {
            authorized: async ({ req, token }) => {
                // Siempre true — dejamos que el middleware maneje la lógica de auth
                return true
            },
        },
    }
)

export const config = {
    // Todo el sitio salvo API, archivos generados y estáticos: hace falta en
    // cada página para detectar el idioma de la primera visita. La protección
    // de rutas se decide dentro con RUTAS_PROTEGIDAS.
    matcher: [
        "/((?!api|_next|favicon\\.ico|robots\\.txt|sitemap\\.xml|llms\\.txt|.*\\.[a-zA-Z0-9]+$).*)",
    ]
}
