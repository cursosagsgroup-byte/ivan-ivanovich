import { NextAuthOptions } from "next-auth"
import CredentialsProvider from "next-auth/providers/credentials"
import { prisma } from "@/lib/prisma"
import bcrypt from "bcryptjs"

export const authOptions: NextAuthOptions = {
    debug: process.env.NODE_ENV === 'development',
    providers: [
        CredentialsProvider({
            name: "credentials",
            credentials: {
                email: { label: "Email", type: "email" },
                password: { label: "Password", type: "password" }
            },
            async authorize(credentials) {
                try {
                    if (!credentials?.email || !credentials?.password) {
                        throw new Error("Invalid credentials")
                    }

                    const user = await prisma.user.findUnique({
                        where: {
                            email: credentials.email
                        }
                    })

                    if (!user || !user?.password) {
                        throw new Error("Invalid credentials")
                    }

                    const isCorrectPassword = await bcrypt.compare(
                        credentials.password,
                        user.password
                    )

                    if (!isCorrectPassword) {
                        throw new Error("Invalid credentials")
                    }

                    return user
                } catch (error) {
                    console.error(`[AUTH] authorize() ERROR for ${credentials?.email}:`, error)
                    throw error
                }
            }
        })
    ],
    // Fix for NextAuth v4 + Next.js 15 App Router: trustHost allows NextAuth
    // to accept requests from the configured NEXTAUTH_URL domain without
    // rejecting them due to host validation mismatches.
    // See: https://next-auth.js.org/configuration/options#trusthost
    // @ts-ignore
    trustHost: true,
    callbacks: {
        async session({ session, token }) {
            if (token) {
                session.user.id = token.id
                session.user.name = token.name
                session.user.email = token.email
                session.user.role = token.role
                // image excluido del JWT para evitar cookies enormes (494)
            }
            return session
        },
        async jwt({ token, user }) {
            try {
                // Si el token ya tiene id y role, reutilizarlo sin hacer query a DB.
                // Esto evita queries innecesarias en cada API request (checkout, coupons, etc.)
                // y previene que el JWT se regenere constantemente, lo que infla las cookies
                // y causa el error 494 REQUEST_HEADER_TOO_LARGE en Vercel.
                if (!user && token.id && token.role) {
                    return token;
                }

                const dbUser = await prisma.user.findUnique({
                    where: {
                        email: token.email!,
                    },
                })

                if (!dbUser) {
                    if (user) {
                        token.id = user?.id
                    }
                    return token
                }

                return {
                    id: dbUser.id,
                    name: dbUser.name,
                    email: dbUser.email,
                    // picture excluido: si es base64 infla el JWT y causa 494 al hacer login
                    role: dbUser.role as "ADMIN" | "STUDENT",
                }
            } catch (error) {
                console.error(`[AUTH] jwt() ERROR for ${token.email}:`, error)
                throw error
            }
        }
    },
    pages: {
        signIn: "/login",
    },
    session: {
        strategy: "jwt",
        // MaxAge de 30 días. Cookies viejas sin maxAge explícito vivían indefinidamente
        // y se acumulaban causando el error 494 REQUEST_HEADER_TOO_LARGE en Vercel.
        maxAge: 30 * 24 * 60 * 60, // 30 días
    },
    cookies: {
        sessionToken: {
            name: process.env.NODE_ENV === 'production'
                ? '__Secure-next-auth.session-token'
                : 'next-auth.session-token',
            options: {
                httpOnly: true,
                sameSite: 'lax',
                path: '/',
                secure: process.env.NODE_ENV === 'production',
                maxAge: 30 * 24 * 60 * 60, // 30 días — fuerza expiración de cookies viejas
            }
        }
    },
    secret: process.env.NEXTAUTH_SECRET,
}
