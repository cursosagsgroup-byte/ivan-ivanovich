import { NextAuthOptions } from "next-auth"
import CredentialsProvider from "next-auth/providers/credentials"
import { prisma } from "@/lib/prisma"
import bcrypt from "bcryptjs"

export const authOptions: NextAuthOptions = {
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

                    console.log(`[AUTH] authorize() called for: ${credentials.email}`)

                    const user = await prisma.user.findUnique({
                        where: {
                            email: credentials.email
                        }
                    })

                    console.log(`[AUTH] User found: ${!!user}`)

                    if (!user || !user?.password) {
                        throw new Error("Invalid credentials")
                    }

                    const isCorrectPassword = await bcrypt.compare(
                        credentials.password,
                        user.password
                    )

                    console.log(`[AUTH] Password correct: ${isCorrectPassword}`)

                    if (!isCorrectPassword) {
                        throw new Error("Invalid credentials")
                    }

                    console.log(`[AUTH] authorize() SUCCESS for: ${credentials.email}`)
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
    trustHost: true,
    cookies: {
        sessionToken: {
            name: `next-auth.session-token`,
            options: {
                httpOnly: true,
                sameSite: "lax",
                path: "/",
                secure: true,
            },
        },
        callbackUrl: {
            name: `next-auth.callback-url`,
            options: {
                httpOnly: true,
                sameSite: "lax",
                path: "/",
                secure: true,
            },
        },
        csrfToken: {
            name: `next-auth.csrf-token`,
            options: {
                httpOnly: true,
                sameSite: "lax",
                path: "/",
                secure: true,
            },
        },
    },
    callbacks: {
        async session({ session, token }) {
            try {
                console.log(`[AUTH] session() called for token.email: ${token.email}, token.id: ${token.id}, token.role: ${token.role}`)
                if (token) {
                    session.user.id = token.id
                    session.user.name = token.name
                    session.user.email = token.email
                    session.user.image = token.picture
                    session.user.role = token.role
                }
                console.log(`[AUTH] session() SUCCESS`)
                return session
            } catch (error) {
                console.error(`[AUTH] session() ERROR:`, error)
                throw error
            }
        },
        async jwt({ token, user }) {
            try {
                console.log(`[AUTH] jwt() called for email: ${token.email}`)
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

                console.log(`[AUTH] jwt() SUCCESS for: ${token.email}, role: ${dbUser.role}`)
                return {
                    id: dbUser.id,
                    name: dbUser.name,
                    email: dbUser.email,
                    picture: dbUser.image,
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
        strategy: "jwt"
    },
    secret: process.env.NEXTAUTH_SECRET,
}
