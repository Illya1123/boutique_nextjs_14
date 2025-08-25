import NextAuth from 'next-auth'
import Google from 'next-auth/providers/google'
import prisma from './prisma'

const authConfig = {
    providers: [
        Google({
            clientId: process.env.AUTH_GOOGLE_ID,
            clientSecret: process.env.AUTH_GOOGLE_SECRET,
        }),
    ],
    callbacks: {
        authorized({ auth }) {
            return !!auth?.user
        },

        async signIn({ user }) {
            try {
                // Kiểm tra xem đã có account trong DB chưa
                const existingAccount = await prisma.account.findUnique({
                    where: { email: user.email },
                })

                if (!existingAccount) {
                    await prisma.account.create({
                        data: {
                            email: user.email,
                            name: user.name,
                            avatar: user.image,
                            role: 'customer',
                        },
                    })
                }
                return true
            } catch (err) {
                console.error('Error in signIn callback:', err)
                return false
            }
        },

        async jwt({ token, user }) {
            if (user?.email) {
                const account = await prisma.account.findUnique({
                    where: { email: user.email },
                })
                if (account) {
                    token.role = account.role
                    token.guestId = account.id
                }
            }
            return token
        },

        async session({ session, token }) {
            if (session.user) {
                session.user.role = token.role
                session.user.guestId = token.guestId
            }
            return session
        },
    },
    pages: {
        signIn: '/login',
    },
}

export const {
    auth,
    signIn,
    signOut,
    handlers: { GET, POST },
} = NextAuth(authConfig)
