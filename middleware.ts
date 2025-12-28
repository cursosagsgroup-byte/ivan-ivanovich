import { withAuth } from "next-auth/middleware"
import { NextResponse } from "next/server"

export default withAuth(
    function middleware(req) {
        // SEO Redirects for legacy /es and /en paths
        // We redirect them to the root (or subpath) and set the language cookie
        const pathname = req.nextUrl.pathname;
        if (pathname.startsWith('/es') || pathname.startsWith('/en')) {
            // Determine locale
            const locale = pathname.startsWith('/es') ? 'es' : 'en';

            // Remove /es or /en from path. 
            // e.g. /es -> /, /es/about -> /about
            // regex: starts with /es or /en, optionally followed by / or end of string
            // actually simpler: just replace the prefix.
            let newPath = pathname.replace(/^\/(es|en)/, '');
            if (!newPath) newPath = '/';

            const url = new URL(newPath, req.url);
            // Preserve query params
            url.search = req.nextUrl.search;

            const response = NextResponse.redirect(url);

            // Set the NEXT_LOCALE cookie so the app renders in the correct language
            response.cookies.set('NEXT_LOCALE', locale, {
                path: '/',
                maxAge: 60 * 60 * 24 * 365, // 1 year
                sameSite: 'lax'
            });

            return response;
        }

        const token = req.nextauth.token
        const isAuth = !!token
        const isAuthPage = req.nextUrl.pathname.startsWith('/login') || req.nextUrl.pathname.startsWith('/register')

        // Role-based redirects after login
        if (isAuthPage && isAuth) {
            // Redirect based on role
            if (token?.role === 'STUDENT') {
                return NextResponse.redirect(new URL('/mi-cuenta', req.url))
            }
            return NextResponse.redirect(new URL('/dashboard', req.url))
        }

        // Allow auth pages for unauthenticated users
        if (isAuthPage) {
            return null
        }

        // Redirect unauthenticated users to login
        // Only if they are accessing protected routes (defined in older matcher logic, keeping consistent)
        // But since we expanded matcher to /es and /en, we must be careful NOT to block public pages if they were accessed via /es/public-page
        // However, the original matcher only protected specific routes.
        // We should check if the CURRENT (rewritten) path is protected? 
        // Actually, preventing regression: we only enforce login if path matches the protected list.
        // The redirects happen BEFORE this check.
        // BUT, if I access /es/dashboard, it redirects to /dashboard. Then middleware runs AGAIN on /dashboard?
        // Yes, unexpected side effect if we don't catch it. 
        // Redirect triggers new request.

        // So for the rest of the logic, it applies to the target path.
        // We just need to make sure we don't accidentally block public routes if we expand matcher?
        // The matcher below includes /es* and /en*.
        // If I visit /es (public), it redirects to /. / is NOT in matcher. Middleware won't run on /. Safe.
        // If I visit /es/dashboard (protected), it redirects to /dashboard. /dashboard IS in matcher. Middleware runs. Safe.

        // Wait, what if I visit /protected-route directly? It hits this logic below.
        // What if I visit /es/protected-route? Redirects -> /protected-route. Logic runs on new request.

        // One edge case: The checks below rely on isAuth. 
        // We need to ensure we don't block auth pages or public pages if they somehow fall through?
        // matchers are inclusive. 

        if (!isAuth && !isAuthPage) {
            // We only want to redirect to login if it's a protected route.
            // The original matcher was: /dashboard, /mi-cuenta, /profile, /certificates, /login, /register
            // We are adding /es and /en to matcher.
            // If we are here, and path starts with /es or /en, we already redirected above.
            // So we are here ONLY if path does NOT start with /es or /en.
            // AND path matches one of the other matchers (/dashboard, etc).
            // So we are safe.

            let from = req.nextUrl.pathname;
            if (req.nextUrl.search) {
                from += req.nextUrl.search;
            }

            return NextResponse.redirect(
                new URL(`/login?from=${encodeURIComponent(from)}`, req.url)
            );
        }

        // Protect admin dashboard
        if (req.nextUrl.pathname.startsWith('/dashboard') && token?.role !== 'ADMIN') {
            return NextResponse.redirect(new URL('/mi-cuenta', req.url))
        }

        // Protect student area
        if (req.nextUrl.pathname.startsWith('/mi-cuenta') && token?.role === 'ADMIN') {
            return NextResponse.redirect(new URL('/dashboard', req.url))
        }
    },
    {
        callbacks: {
            authorized: async ({ req, token }) => {
                // Return true to let middleware function handle logic
                // But we must return true for our new public redirect paths too!
                // If we return false here, next-auth forces login BEFORE our middleware runs?
                // Documentation says: "If you return false, the user will be redirected to the sign-in page."
                // "If you return true, the middleware function will be invoked."

                // So we MUST return true. The default implementation checks for token.
                // Our implementation is custom.
                return true
            },
        },
    }
)

export const config = {
    matcher: [
        "/dashboard/:path*",
        "/mi-cuenta/:path*",
        "/profile/:path*",
        "/certificates/:path*",
        "/login",
        "/register",
        // Add legacy language paths to matcher so middleware runs for them
        "/es/:path*",
        "/en/:path*",
        "/admin/:path*"
    ]
}
