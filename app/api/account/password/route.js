import { NextResponse } from 'next/server'
import bcrypt from 'bcryptjs'
import prisma from '@/app/_lib/prisma'
import { auth } from '@/app/_lib/auth'

/**
 * @swagger
 * /api/account/password:
 *   post:
 *     tags:
 *       - Account
 *     summary: Đổi hoặc tạo mới mật khẩu cho tài khoản
 *     description: >
 *       - Người dùng phải đang đăng nhập (`session` hợp lệ).
 *       - Nếu tài khoản đã có mật khẩu → bắt buộc nhập đúng `currentPassword`.
 *       - Nếu tài khoản chưa có mật khẩu → chỉ cần `newPassword`.
 *       - Mật khẩu mới tối thiểu 8 ký tự.
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/PasswordChangeRequest'
 *           examples:
 *             changePassword:
 *               summary: Đổi mật khẩu khi đã có sẵn
 *               value:
 *                 currentPassword: "OldP@ssw0rd"
 *                 newPassword: "NewStrongP@ssw0rd"
 *             setPassword:
 *               summary: Tạo mật khẩu lần đầu (không cần currentPassword)
 *               value:
 *                 newPassword: "MyFirstP@ss"
 *     responses:
 *       200:
 *         description: Cập nhật mật khẩu thành công
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/MessageResponse'
 *             example:
 *               message: "Cập nhật mật khẩu thành công"
 *       400:
 *         description: Lỗi request (thiếu mật khẩu, quá ngắn hoặc currentPassword sai)
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/MessageResponse'
 *             examples:
 *               tooShort:
 *                 value:
 *                   message: "Mật khẩu mới tối thiểu 8 ký tự"
 *               missingCurrent:
 *                 value:
 *                   message: "Vui lòng nhập mật khẩu hiện tại"
 *               wrongCurrent:
 *                 value:
 *                   message: "Mật khẩu hiện tại không đúng"
 *       401:
 *         description: Chưa đăng nhập
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/MessageResponse'
 *             example:
 *               message: "Unauthorized"
 *       404:
 *         description: Không tìm thấy tài khoản
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/MessageResponse'
 *             example:
 *               message: "Tài khoản không tồn tại"
 *       500:
 *         description: Lỗi máy chủ
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/MessageResponse'
 *             example:
 *               message: "Lỗi máy chủ"
 *
 * components:
 *   schemas:
 *     PasswordChangeRequest:
 *       type: object
 *       properties:
 *         currentPassword:
 *           type: string
 *           description: Mật khẩu hiện tại (bắt buộc nếu tài khoản đã có password)
 *           example: "OldP@ssw0rd"
 *         newPassword:
 *           type: string
 *           minLength: 8
 *           description: Mật khẩu mới
 *           example: "NewStrongP@ssw0rd"
 *     MessageResponse:
 *       type: object
 *       properties:
 *         message:
 *           type: string
 *           example: "Cập nhật mật khẩu thành công"
 */
export async function POST(req) {
    try {
        const session = await auth()
        if (!session?.user?.email) {
            return NextResponse.json({ message: 'Unauthorized' }, { status: 401 })
        }

        const { currentPassword, newPassword } = await req.json()

        if (!newPassword || newPassword.length < 8) {
            return NextResponse.json({ message: 'Mật khẩu mới tối thiểu 8 ký tự' }, { status: 400 })
        }

        const account = await prisma.account.findUnique({
            where: { email: session.user.email },
            select: { id: true, password: true },
        })
        if (!account) {
            return NextResponse.json({ message: 'Tài khoản không tồn tại' }, { status: 404 })
        }

        if (account.password) {
            if (!currentPassword) {
                return NextResponse.json(
                    { message: 'Vui lòng nhập mật khẩu hiện tại' },
                    { status: 400 }
                )
            }
            const ok = await bcrypt.compare(currentPassword, account.password)
            if (!ok) {
                return NextResponse.json(
                    { message: 'Mật khẩu hiện tại không đúng' },
                    { status: 400 }
                )
            }
        }

        const hash = await bcrypt.hash(newPassword, 10)
        await prisma.account.update({
            where: { id: account.id },
            data: { password: hash },
        })

        return NextResponse.json({ message: 'Cập nhật mật khẩu thành công' }, { status: 200 })
    } catch (err) {
        console.error('Password update error:', err)
        return NextResponse.json({ message: 'Lỗi máy chủ' }, { status: 500 })
    }
}
