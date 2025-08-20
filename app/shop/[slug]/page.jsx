'use client'

import { useEffect } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import { setProducts } from '@/store/productSlice'
import { slugify } from '@/app/_utils/slugify'
import AppBreadcrumb from '@/app/_components/Breadcrumb'

export default function ProductDetail({ params }) {
    const dispatch = useDispatch()
    const products = useSelector((state) => state.products.items)

    useEffect(() => {
        if (!products || products.length === 0) {
            fetch('/data.json')
                .then((res) => res.json())
                .then((data) => {
                    dispatch(setProducts(data))
                })
        }
    }, [products, dispatch])

    const product = products.find((p) => slugify(p.title) === params.slug)

    if (!product) {
        return <p className="text-center py-10">Sản phẩm không tồn tại.</p>
    }

    return (
        <div className="max-w-6xl mx-auto p-6">
            <AppBreadcrumb
                items={[
                    { label: 'Trang chủ', href: '/' },
                    { label: 'Shop', href: '/shop' },
                    { label: product.title },
                ]}
            />

            {/* Nội dung chi tiết */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-10 mt-6">
                {/* Ảnh */}
                <div className="flex items-center justify-center bg-gray-50 rounded-lg p-6">
                    <img
                        src={product.image}
                        alt={product.title}
                        className="max-h-[500px] object-contain"
                    />
                </div>

                {/* Thông tin */}
                <div className="flex flex-col">
                    <h1 className="text-3xl font-bold text-gray-900">{product.title}</h1>
                    <p className="text-red-600 text-2xl font-semibold mt-4">
                        {product.price.toLocaleString()}đ
                    </p>

                    <p className="mt-6 text-gray-700 leading-relaxed">
                        {product.description ||
                            'Một sản phẩm thời trang cao cấp, thiết kế tinh tế, chất liệu thoáng mát, phù hợp cho mọi dịp.'}
                    </p>

                    {/* Chọn size */}
                    <div className="mt-6">
                        <h3 className="text-sm font-medium text-gray-700 mb-2">Chọn size</h3>
                        <div className="flex gap-3">
                            {['S', 'M', 'L', 'XL'].map((size) => (
                                <button
                                    key={size}
                                    className="w-12 h-12 border rounded flex items-center justify-center text-gray-700 hover:border-blue-600 hover:text-blue-600 transition"
                                >
                                    {size}
                                </button>
                            ))}
                        </div>
                    </div>

                    {/* Chọn màu */}
                    <div className="mt-6">
                        <h3 className="text-sm font-medium text-gray-700 mb-2">Màu sắc</h3>
                        <div className="flex gap-3">
                            <button className="w-8 h-8 rounded-full bg-black border hover:ring-2 hover:ring-offset-1 hover:ring-blue-500"></button>
                            <button className="w-8 h-8 rounded-full bg-gray-400 border hover:ring-2 hover:ring-offset-1 hover:ring-blue-500"></button>
                            <button className="w-8 h-8 rounded-full bg-blue-600 border hover:ring-2 hover:ring-offset-1 hover:ring-blue-500"></button>
                        </div>
                    </div>

                    {/* Nút */}
                    <div className="mt-8 flex gap-4">
                        <button className="flex-1 py-3 bg-blue-600 text-white rounded-lg text-lg font-medium hover:bg-blue-700 transition">
                            Thêm vào giỏ
                        </button>
                        <button className="flex-1 py-3 bg-gray-200 text-gray-700 rounded-lg text-lg font-medium hover:bg-gray-300 transition">
                            Mua ngay
                        </button>
                    </div>
                </div>
            </div>
        </div>
    )
}
