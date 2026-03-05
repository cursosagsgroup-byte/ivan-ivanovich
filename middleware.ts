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

        // SEO Redirects para rutas /es y /en legacy
        if (pathname.startsWith('/es') || pathname.startsWith('/en')) {
            const locale = pathname.startsWith('/es') ? 'es' : 'en';
            let newPath = pathname.replace(/^\/(es|en)/, '');
            if (!newPath) newPath = '/';

            const url = new URL(newPath, req.url);
            url.search = req.nextUrl.search;

            const response = NextResponse.redirect(url);
            const currentLocale = req.cookies.get('NEXT_LOCALE')?.value;
            if (currentLocale !== locale) {
                response.cookies.set('NEXT_LOCALE', locale, {
                    path: '/',
                    maxAge: 60 * 60 * 24 * 365,
                    sameSite: 'lax'
                });
            }
            return response;
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

        const isPublicPage = isAuthPage || pathname.startsWith('/checkout')

        if (!isAuth && !isPublicPage) {
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
    matcher: [
        // Rutas protegidas
        "/dashboard/:path*",
        "/mi-cuenta/:path*",
        "/profile/:path*",
        "/certificates/:path*",
        "/login",
        "/register",
        "/admin/:path*",
        // Checkout: para limpiar cookies infladas antes de que ocurra el 494
        "/checkout",
        "/checkout/:path*",
        // Legacy language paths
        "/es/:path*",
        "/en/:path*",
    ]
}
