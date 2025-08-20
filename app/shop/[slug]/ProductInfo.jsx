'use client'

import { useState, useEffect } from 'react'

export default function ProductInfo({ product, variant, setVariant }) {
    const [selectedSize, setSelectedSize] = useState(null)
    const currentStock = variant?.sizes.find((s) => s.size === selectedSize)?.stock || 0

    useEffect(() => {
        if (variant?.sizes?.length > 0) {
            setSelectedSize(variant.sizes[0].size)
        }
    }, [variant])

    if (!product) return null

    return (
        <div className="flex flex-col">
            <h1 className="text-3xl font-bold text-gray-900">{product.name}</h1>
            <p className="text-red-600 text-2xl font-semibold mt-4">
                {parseInt(product.price).toLocaleString()}đ
            </p>

            <p className="mt-6 text-gray-700 leading-relaxed">
                {product.description ||
                    'Một sản phẩm thời trang cao cấp, thiết kế tinh tế, chất liệu thoáng mát, phù hợp cho mọi dịp.'}
            </p>

            {/* Chọn size */}
            {variant?.sizes && (
                <div className="mt-6">
                    <h3 className="text-sm font-medium text-gray-700 mb-2">Chọn size</h3>
                    <div className="flex gap-3">
                        {variant.sizes.map((s) => (
                            <button
                                key={s.id}
                                className={`w-12 h-12 border rounded flex items-center justify-center text-gray-700 hover:border-blue-600 hover:text-blue-600 transition ${
                                    selectedSize === s.size ? 'border-blue-600 text-blue-600' : ''
                                }`}
                                onClick={() => setSelectedSize(s.size)}
                            >
                                {s.size}
                            </button>
                        ))}
                    </div>
                </div>
            )}

            {/* Chọn màu */}
            {product.variants && (
                <div className="mt-6">
                    <h3 className="text-sm font-medium text-gray-700 mb-2">Màu sắc</h3>
                    <div className="flex gap-3">
                        {product.variants.map((v) => (
                            <button
                                key={v.id}
                                className={`w-8 h-8 rounded-full border ${
                                    variant?.id === v.id ? 'ring-2 ring-blue-500' : ''
                                }`}
                                style={{ backgroundColor: v.color.toLowerCase().replace(' ', '') }}
                                onClick={() => setVariant(v)}
                            ></button>
                        ))}
                    </div>
                </div>
            )}

            {/* Stock */}
            <p className="mt-2 text-gray-600">
                {currentStock > 0 ? `Còn ${currentStock} sản phẩm` : 'Hết hàng'}
            </p>

            {/* Nút */}
            <div className="mt-8 flex gap-4">
                <button
                    className="flex-1 py-3 bg-blue-600 text-white rounded-lg text-lg font-medium hover:bg-blue-700 transition"
                    disabled={currentStock === 0}
                >
                    Thêm vào giỏ
                </button>
                <button className="flex-1 py-3 bg-gray-200 text-gray-700 rounded-lg text-lg font-medium hover:bg-gray-300 transition">
                    Mua ngay
                </button>
            </div>
        </div>
    )
}
