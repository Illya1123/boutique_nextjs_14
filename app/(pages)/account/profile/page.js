import { auth } from '@/app/_lib/auth'
import prisma from '@/app/_lib/prisma'
import { redirect } from 'next/navigation'
import ProfileClient from './ProfileClient'
import PasswordChangeForm from './PasswordChangeForm'

export const metadata = {
    title: 'Cập nhật hồ sơ',
}

export default async function Page() {
    const session = await auth()
    if (!session?.user?.email) redirect('/login')

    const account = await prisma.account.findUnique({
        where: { email: session.user.email },
        select: {
            id: true,
            name: true,
            email: true,
            phone: true,
            avatar: true,
            role: true,
            password: true,
        },
    })

    if (!account) redirect('/login')

    const hasPassword = !!account.password

    return (
        <main className="max-w-3xl mx-auto py-8 px-4">
            <h2 className="font-semibold text-2xl text-accent-400 mb-4">
                Cập nhật hồ sơ tài khoản
            </h2>
            <p className="text-lg mb-8 text-primary-200">
                Vui lòng cung cấp thông tin để quá trình sử dụng dịch vụ nhanh chóng và thuận tiện
                hơn.
            </p>

            <div className="grid gap-6">
                <ProfileClient
                    account={{
                        id: account.id,
                        name: account.name,
                        email: account.email,
                        phone: account.phone,
                        avatar: account.avatar,
                        role: account.role,
                    }}
                />

                <div className="bg-white/90 backdrop-blur-md border rounded-2xl shadow p-6">
                    <h3 className="text-xl font-semibold mb-3">Mật khẩu</h3>
                    <p className="text-sm text-gray-500 mb-4">
                        {hasPassword
                            ? 'Đổi mật khẩu hiện tại của bạn.'
                            : 'Tạo mật khẩu cho tài khoản (bổ sung cho đăng nhập Google).'}
                    </p>
                    <PasswordChangeForm hasPassword={hasPassword} />
                </div>
            </div>
        </main>
    )
}
