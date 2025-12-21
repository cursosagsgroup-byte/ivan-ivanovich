import { withAuth } from "next-auth/middleware"
import { NextResponse } from "next/server"

export default withAuth(
    function middleware(req) {
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
        if (!isAuth) {
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
                // This callback is called before the middleware function above
                // We return true to let the middleware function handle the logic
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
        "/register"
    ]
}
