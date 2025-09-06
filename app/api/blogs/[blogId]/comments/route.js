import { NextResponse } from 'next/server'
import prisma from '@/app/_lib/prisma'
import { z } from 'zod'

/**
 * @swagger
 * components:
 *   schemas:
 *     AccountLite:
 *       type: object
 *       properties:
 *         id:
 *           type: string
 *           format: uuid
 *           example: "3b2f0d42-0a9d-4c9e-9d6e-6e5f8e2d9a1c"
 *         name:
 *           type: string
 *           nullable: true
 *           example: "Nguyễn Văn A"
 *         avatar:
 *           type: string
 *           nullable: true
 *           example: "https://cdn.example.com/u/ava.png"
 *
 *     Comment:
 *       type: object
 *       properties:
 *         id:
 *           type: string
 *           format: uuid
 *         blog_id:
 *           type: string
 *           format: uuid
 *         account_id:
 *           type: string
 *           format: uuid
 *         comment:
 *           type: string
 *         reply_to:
 *           type: string
 *           format: uuid
 *           nullable: true
 *         createdAt:
 *           type: string
 *           format: date-time
 *         updatedAt:
 *           type: string
 *           format: date-time
 *         account:
 *           $ref: '#/components/schemas/AccountLite'
 *
 *     CreateCommentRequest:
 *       type: object
 *       properties:
 *         comment:
 *           type: string
 *           minLength: 1
 *           maxLength: 10000
 *           example: "Bài viết rất hay!"
 *         reply_to:
 *           type: string
 *           format: uuid
 *           nullable: true
 *           example: "f1c1d0eb-9a2f-49a8-a1cf-9a3c8c0b2f77"
 *       required: [comment]
 *
 *     ApiError:
 *       type: object
 *       properties:
 *         success:
 *           type: boolean
 *           example: false
 *         error:
 *           oneOf:
 *             - type: string
 *             - type: object
 *       required: [success, error]
 */

// Demo: lấy user từ header. Thay bằng auth của bạn (NextAuth/JWT...) nếu có.
function getUserId(req) {
    const id = req.headers.get('x-user-id')
    return id && id.trim().length > 0 ? id : null
}

const CreateCommentSchema = z.object({
    comment: z.string().trim().min(1, 'Nội dung không được rỗng').max(10_000),
    reply_to: z.string().uuid().optional().nullable(),
})

/**
 * @swagger
 * /blogs/{blogId}/comments:
 *   get:
 *     summary: Lấy toàn bộ comment của 1 blog (trả phẳng, mọi cấp). Client tự build tree.
 *     tags: [Comments]
 *     parameters:
 *       - in: path
 *         name: blogId
 *         required: true
 *         schema:
 *           type: string
 *           format: uuid
 *         description: ID của bài blog
 *     responses:
 *       200:
 *         description: Thành công
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 items:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/Comment'
 *                 nextCursor:
 *                   type: string
 *                   nullable: true
 *                   example: null
 *       400:
 *         description: Thiếu tham số
 *       500:
 *         description: Lỗi server
 */
// GET /api/blogs/:blogId/comments?limit=20&cursor=<commentId>
export async function GET(req, { params }) {
    try {
        const blogId = params?.blogId
        if (!blogId) {
            return NextResponse.json({ success: false, error: 'Thiếu blogId' }, { status: 400 })
        }

        // Lấy TẤT CẢ comment của blog (mọi cấp), để client build tree
        const items = await prisma.blogComment.findMany({
            where: { blog_id: blogId },
            orderBy: { createdAt: 'asc' }, // đảm bảo thứ tự thời gian
            include: {
                account: { select: { id: true, name: true, avatar: true } },
            },
        })

        // Trả về phẳng + nextCursor=null (không phân trang)
        return NextResponse.json({ success: true, items, nextCursor: null })
    } catch (err) {
        console.error('GET comments error:', err)
        return NextResponse.json(
            { success: false, error: 'Lỗi server khi lấy comments' },
            { status: 500 }
        )
    }
}

/**
 * @swagger
 * /blogs/{blogId}/comments:
 *   post:
 *     summary: Tạo comment mới hoặc reply (mọi cấp) trong blog
 *     tags: [Comments]
 *     parameters:
 *       - in: path
 *         name: blogId
 *         required: true
 *         schema:
 *           type: string
 *           format: uuid
 *         description: ID của bài blog
 *       - in: header
 *         name: x-user-id
 *         required: true
 *         schema:
 *           type: string
 *           format: uuid
 *         description: ID người dùng (demo). Thay bằng cơ chế auth thực tế nếu có.
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/CreateCommentRequest'
 *     responses:
 *       200:
 *         description: Tạo thành công
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 item:
 *                   $ref: '#/components/schemas/Comment'
 *       400:
 *         description: Dữ liệu không hợp lệ hoặc blog/reply_to không hợp lệ
 *       401:
 *         description: Chưa đăng nhập
 *       404:
 *         description: Blog không tồn tại
 *       500:
 *         description: Lỗi server
 */
// POST /api/blogs/:blogId/comments
export async function POST(req, { params }) {
    try {
        const blogId = params?.blogId
        if (!blogId) {
            return NextResponse.json({ success: false, error: 'Thiếu blogId' }, { status: 400 })
        }

        const userId = getUserId(req)
        if (!userId) {
            return NextResponse.json({ success: false, error: 'Chưa đăng nhập' }, { status: 401 })
        }

        const body = await req.json()
        const parsed = CreateCommentSchema.safeParse(body)
        if (!parsed.success) {
            return NextResponse.json(
                { success: false, error: parsed.error.flatten() },
                { status: 400 }
            )
        }
        const { comment, reply_to } = parsed.data

        // Kiểm tra blog tồn tại
        const blog = await prisma.blog.findUnique({ where: { id: blogId }, select: { id: true } })
        if (!blog) {
            return NextResponse.json(
                { success: false, error: 'Blog không tồn tại' },
                { status: 404 }
            )
        }

        // Nếu là reply -> kiểm tra parent
        if (reply_to) {
            const parent = await prisma.blogComment.findUnique({
                where: { id: reply_to },
                select: { id: true, blog_id: true },
            })
            if (!parent || parent.blog_id !== blogId) {
                return NextResponse.json(
                    { success: false, error: 'reply_to không hợp lệ' },
                    { status: 400 }
                )
            }
        }

        const created = await prisma.blogComment.create({
            data: {
                account_id: userId, // map tới Account.id (UUID)
                blog_id: blogId,
                comment,
                reply_to: reply_to ?? null,
            },
            include: { account: { select: { id: true, name: true, avatar: true } } },
        })

        return NextResponse.json({ success: true, item: created })
    } catch (err) {
        console.error('POST comments error:', err)
        return NextResponse.json(
            { success: false, error: 'Lỗi server khi tạo comment' },
            { status: 500 }
        )
    }
}
