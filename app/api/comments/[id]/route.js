import { NextResponse } from 'next/server'
import prisma from '@/app/_lib/prisma'
import { z } from 'zod'

/**
 * @swagger
 * components:
 *   schemas:
 *     UpdateCommentRequest:
 *       type: object
 *       properties:
 *         comment:
 *           type: string
 *           minLength: 1
 *           maxLength: 10000
 *           example: "Nội dung đã chỉnh sửa"
 *       required: [comment]
 *
 *     UpdateCommentResponse:
 *       type: object
 *       properties:
 *         success:
 *           type: boolean
 *           example: true
 *         item:
 *           $ref: '#/components/schemas/Comment'
 *
 *     DeleteResult:
 *       type: object
 *       properties:
 *         success:
 *           type: boolean
 *           example: true
 *         deleted:
 *           type: boolean
 *           description: "Xoá hẳn"
 *           example: true
 *         softDeleted:
 *           type: boolean
 *           description: "Chỉ ẩn nội dung thành \"[deleted]\" nếu có replies"
 *           example: true
 *         item:
 *           $ref: '#/components/schemas/Comment'
 */

function getUserId(req) {
    const id = req.headers.get('x-user-id')
    return id && id.trim().length > 0 ? id : null
}

const UpdateCommentSchema = z.object({
    comment: z.string().trim().min(1, 'Nội dung không được rỗng').max(10_000),
})

/**
 * @swagger
 * /comments/{id}:
 *   put:
 *     summary: Cập nhật comment (chỉ chủ sở hữu)
 *     tags: [Comments]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *           format: uuid
 *         description: ID comment
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
 *             $ref: '#/components/schemas/UpdateCommentRequest'
 *     responses:
 *       200:
 *         description: Cập nhật thành công
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/UpdateCommentResponse'
 *       400:
 *         description: Dữ liệu không hợp lệ
 *       401:
 *         description: Chưa đăng nhập
 *       403:
 *         description: Không có quyền sửa
 *       404:
 *         description: Không tìm thấy comment
 *       500:
 *         description: Lỗi server
 */

// PUT /api/comments/:id — chỉ chủ sở hữu
export async function PUT(req, { params }) {
    try {
        const userId = getUserId(req)
        if (!userId) {
            return NextResponse.json({ success: false, error: 'Chưa đăng nhập' }, { status: 401 })
        }

        const id = params?.id
        const body = await req.json()
        const parsed = UpdateCommentSchema.safeParse(body)
        if (!parsed.success) {
            return NextResponse.json(
                { success: false, error: parsed.error.flatten() },
                { status: 400 }
            )
        }

        const existing = await prisma.blogComment.findUnique({
            where: { id },
            select: { id: true, account_id: true },
        })
        if (!existing) {
            return NextResponse.json(
                { success: false, error: 'Không tìm thấy comment' },
                { status: 404 }
            )
        }
        if (existing.account_id !== userId) {
            return NextResponse.json(
                { success: false, error: 'Không có quyền sửa' },
                { status: 403 }
            )
        }

        const updated = await prisma.blogComment.update({
            where: { id },
            data: { comment: parsed.data.comment },
        })

        return NextResponse.json({ success: true, item: updated })
    } catch (err) {
        console.error('PUT comment error:', err)
        return NextResponse.json(
            { success: false, error: 'Lỗi server khi cập nhật comment' },
            { status: 500 }
        )
    }
}

/**
 * @swagger
 * /comments/{id}:
 *   delete:
 *     summary: Xoá comment (chỉ chủ sở hữu). Nếu có replies thì chỉ soft-delete.
 *     tags: [Comments]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *           format: uuid
 *         description: ID comment
 *       - in: header
 *         name: x-user-id
 *         required: true
 *         schema:
 *           type: string
 *           format: uuid
 *         description: ID người dùng (demo). Thay bằng cơ chế auth thực tế nếu có.
 *     responses:
 *       200:
 *         description: Xoá thành công (soft hoặc hard)
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/DeleteResult'
 *       401:
 *         description: Chưa đăng nhập
 *       403:
 *         description: Không có quyền xoá
 *       404:
 *         description: Không tìm thấy comment
 *       500:
 *         description: Lỗi server
 */
// DELETE /api/comments/:id
// - Nếu có replies: chỉ "ẩn" nội dung -> "[deleted]"
// - Nếu không có replies: xóa hẳn
export async function DELETE(req, { params }) {
    try {
        const userId = getUserId(req)
        if (!userId) {
            return NextResponse.json({ success: false, error: 'Chưa đăng nhập' }, { status: 401 })
        }

        const id = params?.id

        const existing = await prisma.blogComment.findUnique({
            where: { id },
            include: { replies: { select: { id: true } } },
        })
        if (!existing) {
            return NextResponse.json(
                { success: false, error: 'Không tìm thấy comment' },
                { status: 404 }
            )
        }
        if (existing.account_id !== userId) {
            return NextResponse.json(
                { success: false, error: 'Không có quyền xóa' },
                { status: 403 }
            )
        }

        if (existing.replies.length > 0) {
            const updated = await prisma.blogComment.update({
                where: { id },
                data: { comment: '[deleted]' },
            })
            return NextResponse.json({ success: true, item: updated, softDeleted: true })
        } else {
            await prisma.blogComment.delete({ where: { id } })
            return NextResponse.json({ success: true, deleted: true })
        }
    } catch (err) {
        console.error('DELETE comment error:', err)
        return NextResponse.json(
            { success: false, error: 'Lỗi server khi xóa comment' },
            { status: 500 }
        )
    }
}
