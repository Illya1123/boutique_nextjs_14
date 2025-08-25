import { NextResponse } from 'next/server'
import prisma from '@/app/_lib/prisma'

// // POST - tạo sản phẩm
// export async function POST(req) {
//     try {
//         const body = await req.json()

//         const product = await prisma.product.create({
//             data: {
//                 name: body.name,
//                 description: body.description,
//                 price: body.price,
//                 category: { connect: { id: body.category_id } },
//                 variants: body.variants
//                     ? {
//                           create: body.variants.map((variant) => ({
//                               color: variant.color,
//                               sizes: variant.sizes
//                                   ? {
//                                         create: variant.sizes.map((s) => ({
//                                             size: s.size,
//                                             stock: s.stock || 0,
//                                         })),
//                                     }
//                                   : undefined,
//                               images: variant.images
//                                   ? {
//                                         create: variant.images.map((img) => ({
//                                             url: img.url,
//                                             is_primary: img.is_primary || false,
//                                         })),
//                                     }
//                                   : undefined,
//                           })),
//                       }
//                     : undefined,
//             },
//             include: {
//                 variants: {
//                     include: {
//                         sizes: true,
//                         images: true,
//                     },
//                 },
//                 category: true,
//             },
//         })

//         return NextResponse.json({ success: true, product })
//     } catch (error) {
//         console.error(error)
//         return NextResponse.json({ success: false, error: error.message }, { status: 500 })
//     }
// }

// GET - lấy tất cả sản phẩm hoặc 1 sản phẩm theo query param id
export async function GET(req) {
    try {
        const { searchParams } = new URL(req.url)
        const id = searchParams.get('id')

        if (id) {
            // Lấy 1 sản phẩm theo id
            const product = await prisma.product.findUnique({
                where: { id: id },
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
            if (!product) {
                return NextResponse.json(
                    { success: false, error: 'Product not found' },
                    { status: 404 }
                )
            }
            return NextResponse.json({ success: true, product })
        } else {
            // Lấy tất cả sản phẩm
            const products = await prisma.product.findMany({
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
            return NextResponse.json({ success: true, products })
        }
    } catch (error) {
        console.error(error)
        return NextResponse.json({ success: false, error: error.message }, { status: 500 })
    }
}

// // PUT - cập nhật sản phẩm
// // PUT - cập nhật sản phẩm toàn bộ, bao gồm variants, sizes, images
// export async function PUT(req) {
//     try {
//         // Lấy `id` từ query string: /api/products?id=abc123
//         const { searchParams } = new URL(req.url)
//         const id = searchParams.get('id')

//         if (!id) {
//             return NextResponse.json(
//                 { success: false, error: 'Product id is required' },
//                 { status: 400 }
//             )
//         }

//         const body = await req.json()

//         // Nếu bạn muốn xài UUID, không cần Number(id)
//         // Xóa variants cũ (cascade sẽ xóa sizes/images nếu cấu hình đúng)
//         await prisma.productVariant.deleteMany({
//             where: { product_id: id },
//         })

//         // Cập nhật thông tin sản phẩm
//         const product = await prisma.product.update({
//             where: { id },
//             data: {
//                 name: body.name,
//                 description: body.description,
//                 price: body.price,
//                 category: body.category_id
//                     ? { connect: { id: body.category_id } }
//                     : undefined,
//                 variants: body.variants
//                     ? {
//                           create: body.variants.map((variant) => ({
//                               color: variant.color,
//                               sizes: {
//                                   create:
//                                       variant.sizes?.map((s) => ({
//                                           size: s.size,
//                                           stock: s.stock || 0,
//                                       })) || [],
//                               },
//                               images: {
//                                   create:
//                                       variant.images?.map((img) => ({
//                                           url: img.url,
//                                           is_primary: img.is_primary || false,
//                                       })) || [],
//                               },
//                           })),
//                       }
//                     : undefined,
//             },
//             include: {
//                 variants: {
//                     include: {
//                         sizes: true,
//                         images: true,
//                     },
//                 },
//                 category: true,
//             },
//         })

//         return NextResponse.json({ success: true, product })
//     } catch (error) {
//         console.error(error)
//         return NextResponse.json({ success: false, error: error.message }, { status: 500 })
//     }
// }


// // DELETE - xóa sản phẩm
// export async function DELETE(req) {
//     try {
//         const { searchParams } = new URL(req.url)
//         const id = searchParams.get('id')
//         if (!id) {
//             return NextResponse.json(
//                 { success: false, error: 'Product id is required' },
//                 { status: 400 }
//             )
//         }

//         await prisma.product.delete({
//             where: { id: id },
//         })

//         return NextResponse.json({ success: true, message: 'Product deleted' })
//     } catch (error) {
//         console.error(error)
//         return NextResponse.json({ success: false, error: error.message }, { status: 500 })
//     }
// }
