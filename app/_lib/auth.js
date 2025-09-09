import NextAuth from 'next-auth'
import Google from 'next-auth/providers/google'
import Credentials from 'next-auth/providers/credentials'
import bcrypt from 'bcryptjs'
import prisma from './prisma'

const authConfig = {
    // dùng JWT cho session (mặc định v5 là 'jwt', khai báo rõ ràng cho chắc)
    session: { strategy: 'jwt' },
    secret: process.env.AUTH_SECRET, // nhớ đặt biến môi trường

    providers: [
        Google({
            clientId: process.env.GOOGLE_CLIENT_ID,
            clientSecret: process.env.GOOGLE_CLIENT_SECRET,
        }),

        Credentials({
            name: 'Email & Password',
            credentials: {
                email: { label: 'Email', type: 'email' },
                password: { label: 'Password', type: 'password' },
            },
            async authorize(credentials) {
                if (!credentials?.email || !credentials?.password) return null

                // Tìm account theo email
                const account = await prisma.account.findUnique({
                    where: { email: credentials.email },
                })
                // Không tồn tại hoặc chưa có password => không cho đăng nhập bằng credentials
                if (!account?.password) return null

                const ok = await bcrypt.compare(credentials.password, account.password)
                if (!ok) return null

                // Trả về user object cho NextAuth
                return {
                    id: account.id,
                    name: account.name,
                    email: account.email,
                    image: account.avatar,
                    role: account.role,
                }
            },
        }),
    ],

    callbacks: {
        authorized({ auth }) {
            return !!auth?.user
        },

        async signIn({ user, account }) {
            try {
                if (account?.provider === 'google') {
                    // tạo nếu chưa có
                    let acc = await prisma.account.findUnique({ where: { email: user.email } })
                    if (!acc) {
                        acc = await prisma.account.create({
                            data: {
                                email: user.email,
                                name: user.name,
                                avatar: user.image,
                                role: 'customer',
                            },
                        })
                    }
                    // QUAN TRỌNG: gán role/id vào user để jwt có thể dùng ngay
                    user.role = acc.role
                    user.id = acc.id
                    user.image = acc.avatar ?? user.image
                }
                return true
            } catch (err) {
                console.error('Error in signIn callback:', err)
                return false
            }
        },

        async jwt({ token, user }) {
            // Nếu vừa đăng nhập (Google/Credentials), user có mặt => lấy chắc từ DB
            if (user?.email) {
                const acc = await prisma.account.findUnique({
                    where: { email: user.email },
                    select: { id: true, role: true, avatar: true, name: true },
                })
                if (acc) {
                    token.role = acc.role
                    token.guestId = acc.id
                    // đồng bộ các field chuẩn của next-auth
                    token.name = acc.name ?? token.name
                    token.picture = acc.avatar ?? token.picture
                }
                return token
            }

            // Các lần request sau: vẫn bảo đảm role/id tồn tại trên token
            if (!token?.role && token?.email) {
                const acc = await prisma.account.findUnique({
                    where: { email: token.email },
                    select: { id: true, role: true },
                })
                if (acc) {
                    token.role = acc.role
                    token.guestId = acc.id
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
