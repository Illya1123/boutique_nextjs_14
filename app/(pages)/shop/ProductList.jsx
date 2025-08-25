'use client'

import { useState, useEffect } from 'react'
import { useDispatch } from 'react-redux'
import { setProducts } from '@/store/productSlice'
import Link from 'next/link'
import Pagination from '@/app/_components/Pagination'
import { slugify } from '@/app/_utils/slugify'

export default function ProductList({ products = [] }) {
    const dispatch = useDispatch()
    const [currentPage, setCurrentPage] = useState(1)
    const productsPerPage = 10

    useEffect(() => {
        if (products.length > 0) {
            dispatch(setProducts(products))
        }
    }, [products, dispatch])

    if (!products || products.length === 0) {
        return <p className="text-center text-gray-500 py-10 italic">Không có sản phẩm nào.</p>
    }

    const totalPages = Math.ceil(products.length / productsPerPage)
    const startIndex = (currentPage - 1) * productsPerPage
    const currentProducts = products.slice(startIndex, startIndex + productsPerPage)

    return (
        <div>
            <ul className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                {currentProducts.map((p) => {
                    const slug = slugify(p.name)

                    // Lấy hình chính của variant đầu tiên có ảnh primary
                    let mainImage = ''
                    if (p.variants?.length > 0) {
                        const variantWithPrimary = p.variants.find((v) =>
                            v.images?.some((img) => img.is_primary)
                        )
                        if (variantWithPrimary) {
                            const primaryImg = variantWithPrimary.images.find(
                                (img) => img.is_primary
                            )
                            mainImage = primaryImg?.url || ''
                        } else {
                            mainImage = p.variants[0].images?.[0]?.url || ''
                        }
                    }

                    // Lấy tất cả màu
                    const colors = p.variants?.map((v) => v.color).join(', ') || '—'
                    // Lấy tất cả size (loại trùng)
                    const sizes = [
                        ...new Set(p.variants?.flatMap((v) => v.sizes?.map((s) => s.size) || [])),
                    ].join(', ')

                    return (
                        <li
                            key={p.id}
                            className="border rounded-lg bg-white shadow-sm hover:shadow-lg transition transform hover:-translate-y-1"
                        >
                            <Link
                                href={{ pathname: `/shop/${slug}`, query: { id: p.id } }}
                                className="block"
                            >
                                <div className="w-full h-48 flex items-center justify-center bg-gray-50 rounded-t-lg overflow-hidden">
                                    {mainImage ? (
                                        <img
                                            src={mainImage}
                                            alt={p.name}
                                            className="max-h-40 object-contain"
                                        />
                                    ) : (
                                        <div className="text-gray-400">No Image</div>
                                    )}
                                </div>

                                <div className="p-4">
                                    <h3 className="text-sm font-medium text-gray-800 line-clamp-2 min-h-[40px]">
                                        {p.name}
                                    </h3>

                                    {/* Thêm màu và size */}
                                    <p className="mt-1 text-xs text-gray-500">Màu: {colors}</p>
                                    <p className="text-xs text-gray-500">Size: {sizes}</p>

                                    <p className="mt-2 text-lg font-bold text-red-600">
                                        {parseInt(p.price).toLocaleString()}đ
                                    </p>
                                </div>
                            </Link>
                        </li>
                    )
                })}
            </ul>

            <Pagination
                currentPage={currentPage}
                totalPages={totalPages}
                onPageChange={setCurrentPage}
            />
        </div>
    )
}
