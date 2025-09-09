import { NextResponse } from 'next/server'
import bcrypt from 'bcryptjs'
import prisma from '@/app/_lib/prisma'

/**
 * @swagger
 * /api/auth/register:
 *   post:
 *     tags:
 *       - Auth
 *     summary: Đăng ký tài khoản mới bằng email & mật khẩu
 *     description: |
 *       Tạo tài khoản mới trong hệ thống. Mật khẩu được băm bằng **bcrypt** trước khi lưu.
 *       - Email phải là duy nhất.
 *       - Mật khẩu tối thiểu 8 ký tự.
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/RegisterRequest'
 *           examples:
 *             valid:
 *               summary: Ví dụ hợp lệ
 *               value:
 *                 email: "user@example.com"
 *                 password: "StrongP@ssw0rd"
 *                 name: "Nguyễn Văn A"
 *     responses:
 *       201:
 *         description: Tạo tài khoản thành công
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/MessageResponse'
 *             examples:
 *               created:
 *                 value:
 *                   message: "Đăng ký thành công"
 *       400:
 *         description: Thiếu trường bắt buộc hoặc mật khẩu quá ngắn
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/MessageResponse'
 *             examples:
 *               missingFields:
 *                 value:
 *                   message: "Email và mật khẩu là bắt buộc"
 *               weakPassword:
 *                 value:
 *                   message: "Mật khẩu tối thiểu 8 ký tự"
 *       409:
 *         description: Email đã tồn tại
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/MessageResponse'
 *             examples:
 *               duplicatedEmail:
 *                 value:
 *                   message: "Email đã tồn tại"
 *       500:
 *         description: Lỗi máy chủ
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/MessageResponse'
 *             examples:
 *               serverError:
 *                 value:
 *                   message: "Lỗi máy chủ"
 *
 * components:
 *   schemas:
 *     RegisterRequest:
 *       type: object
 *       required:
 *         - email
 *         - password
 *       properties:
 *         email:
 *           type: string
 *           format: email
 *           example: "user@example.com"
 *         password:
 *           type: string
 *           minLength: 8
 *           example: "StrongP@ssw0rd"
 *         name:
 *           type: string
 *           nullable: true
 *           example: "Nguyễn Văn A"
 *     MessageResponse:
 *       type: object
 *       properties:
 *         message:
 *           type: string
 *           example: "Đăng ký thành công"
 */
export async function POST(req) {
    try {
        const { email, password, name } = await req.json()

        if (!email || !password) {
            return NextResponse.json({ message: 'Email và mật khẩu là bắt buộc' }, { status: 400 })
        }
        if (password.length < 8) {
            return NextResponse.json({ message: 'Mật khẩu tối thiểu 8 ký tự' }, { status: 400 })
        }

        const existing = await prisma.account.findUnique({ where: { email } })
        if (existing) {
            return NextResponse.json({ message: 'Email đã tồn tại' }, { status: 409 })
        }

        const hash = await bcrypt.hash(password, 10)
        await prisma.account.create({
            data: {
                email,
                name: name || null,
                password: hash,
                role: 'customer',
            },
        })

        return NextResponse.json({ message: 'Đăng ký thành công' }, { status: 201 })
    } catch (err) {
        console.error('Register error:', err)
        return NextResponse.json({ message: 'Lỗi máy chủ' }, { status: 500 })
    }
}
