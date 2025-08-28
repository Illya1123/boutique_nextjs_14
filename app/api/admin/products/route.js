import { NextResponse } from 'next/server'
import prisma from '@/app/_lib/prisma'

/**
 * @swagger
 * /admin/products:
 *   post:
 *     summary: Tạo sản phẩm mới
 *     tags: [Products - Admin]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *               description:
 *                 type: string
 *               price:
 *                 type: number
 *               category_id:
 *                 type: string
 *               variants:
 *                 type: array
 *                 items:
 *                   type: object
 *                   properties:
 *                     color:
 *                       type: string
 *                     sizes:
 *                       type: array
 *                       items:
 *                         type: object
 *                         properties:
 *                           size: { type: string }
 *                           stock: { type: integer }
 *                     images:
 *                       type: array
 *                       items:
 *                         type: object
 *                         properties:
 *                           url: { type: string }
 *                           is_primary: { type: boolean }
 *     responses:
 *       200:
 *         description: Sản phẩm đã được tạo
 *       500:
 *         description: Lỗi server
 */
export async function POST(req) {
    try {
        const body = await req.json()

        const product = await prisma.product.create({
            data: {
                name: body.name,
                description: body.description,
                price: body.price,
                category: { connect: { id: body.category_id } },
                variants: body.variants
                    ? {
                          create: body.variants.map((variant) => ({
                              color: variant.color,
                              sizes: variant.sizes
                                  ? {
                                        create: variant.sizes.map((s) => ({
                                            size: s.size,
                                            stock: s.stock || 0,
                                        })),
                                    }
                                  : undefined,
                              images: variant.images
                                  ? {
                                        create: variant.images.map((img) => ({
                                            url: img.url,
                                            is_primary: img.is_primary || false,
                                        })),
                                    }
                                  : undefined,
                          })),
                      }
                    : undefined,
            },
            include: {
                variants: {
                    include: {
                        sizes: true,
                        images: true,
                    },
                },
                category: true,
            },
        })

        return NextResponse.json({ success: true, product })
    } catch (error) {
        console.error(error)
        return NextResponse.json({ success: false, error: error.message }, { status: 500 })
    }
}

/**
 * @swagger
 * /admin/products:
 *   put:
 *     summary: Cập nhật sản phẩm theo ID
 *     tags: [Products - Admin]
 *     parameters:
 *       - in: query
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: ID của sản phẩm
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name: { type: string }
 *               description: { type: string }
 *               price: { type: number }
 *               category_id: { type: string }
 *               variants:
 *                 type: array
 *                 items:
 *                   type: object
 *                   properties:
 *                     color: { type: string }
 *                     sizes:
 *                       type: array
 *                       items:
 *                         type: object
 *                         properties:
 *                           size: { type: string }
 *                           stock: { type: integer }
 *                     images:
 *                       type: array
 *                       items:
 *                         type: object
 *                         properties:
 *                           url: { type: string }
 *                           is_primary: { type: boolean }
 *     responses:
 *       200:
 *         description: Sản phẩm đã được cập nhật
 *       400:
 *         description: Thiếu id sản phẩm
 *       500:
 *         description: Lỗi server
 */

export async function PUT(req) {
    try {
        // Lấy `id` từ query string: /api/products?id=abc123
        const { searchParams } = new URL(req.url)
        const id = searchParams.get('id')

        if (!id) {
            return NextResponse.json(
                { success: false, error: 'Product id is required' },
                { status: 400 }
            )
        }

        const body = await req.json()

        // Nếu bạn muốn xài UUID, không cần Number(id)
        // Xóa variants cũ (cascade sẽ xóa sizes/images nếu cấu hình đúng)
        await prisma.productVariant.deleteMany({
            where: { product_id: id },
        })

        // Cập nhật thông tin sản phẩm
        const product = await prisma.product.update({
            where: { id },
            data: {
                name: body.name,
                description: body.description,
                price: body.price,
                category: body.category_id
                    ? { connect: { id: body.category_id } }
                    : undefined,
                variants: body.variants
                    ? {
                          create: body.variants.map((variant) => ({
                              color: variant.color,
                              sizes: {
                                  create:
                                      variant.sizes?.map((s) => ({
                                          size: s.size,
                                          stock: s.stock || 0,
                                      })) || [],
                              },
                              images: {
                                  create:
                                      variant.images?.map((img) => ({
                                          url: img.url,
                                          is_primary: img.is_primary || false,
                                      })) || [],
                              },
                          })),
                      }
                    : undefined,
            },
            include: {
                variants: {
                    include: {
                        sizes: true,
                        images: true,
                    },
                },
                category: true,
            },
        })

        return NextResponse.json({ success: true, product })
    } catch (error) {
        console.error(error)
        return NextResponse.json({ success: false, error: error.message }, { status: 500 })
    }
}


/**
 * @swagger
 * /admin/products:
 *   delete:
 *     summary: Xóa sản phẩm theo ID
 *     tags: [Products - Admin]
 *     parameters:
 *       - in: query
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: ID sản phẩm cần xóa
 *     responses:
 *       200:
 *         description: Sản phẩm đã được xóa
 *       400:
 *         description: Thiếu id sản phẩm
 *       500:
 *         description: Lỗi server
 */
export async function DELETE(req) {
    try {
        const { searchParams } = new URL(req.url)
        const id = searchParams.get('id')
        if (!id) {
            return NextResponse.json(
                { success: false, error: 'Product id is required' },
                { status: 400 }
            )
        }

        await prisma.product.delete({
            where: { id: id },
        })

        return NextResponse.json({ success: true, message: 'Product deleted' })
    } catch (error) {
        console.error(error)
        return NextResponse.json({ success: false, error: error.message }, { status: 500 })
    }
}
