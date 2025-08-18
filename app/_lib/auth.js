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

        // Khi user đăng nhập
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

        // Bổ sung guestId (account id) vào session
        async session({ session }) {
            if (session?.user?.email) {
                const account = await prisma.account.findUnique({
                    where: { email: session.user.email },
                })

                if (account) {
                    session.user.guestId = account.id
                    session.user.role = account.role
                }
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
