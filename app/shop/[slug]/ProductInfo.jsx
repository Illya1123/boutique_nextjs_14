'use client'

import { useState, useEffect } from 'react'
import { useDispatch } from 'react-redux'
import { addToCart } from '@/store/cartSlice'
import { v4 as uuidv4 } from 'uuid'

export default function ProductInfo({ product, variant, setVariant, defaultSize }) {
    const [selectedSize, setSelectedSize] = useState(null)
    const currentStock = variant?.sizes.find((s) => s.size === selectedSize)?.stock || 0
    const dispatch = useDispatch()

    useEffect(() => {
        if (variant?.sizes?.length > 0) {
            if (defaultSize && variant.sizes.some((s) => s.size === defaultSize)) {
                setSelectedSize(defaultSize) // ưu tiên size từ query
            } else {
                setSelectedSize(variant.sizes[0].size) // mặc định
            }
        }
    }, [variant, defaultSize])

    if (!product) return null

    const handleAddToCart = () => {
        if (!variant || !selectedSize) return

        const cartItem = {
            cartItemId: uuidv4(),
            productId: product.id,
            name: product.name,
            price: parseInt(product.price),
            variantId: variant.id,
            color: variant.color,
            size: selectedSize,
            quantity: 1,
            image: variant.images.find((img) => img.is_primary)?.url,
        }

        dispatch(addToCart(cartItem))
        alert('Đã thêm vào giỏ hàng!')
    }

    return (
        <div className="flex flex-col">
            <h1 className="text-3xl font-bold text-gray-900">{product.name}</h1>
            <p className="text-red-600 text-2xl font-semibold mt-4">
                {parseInt(product.price).toLocaleString()}đ
            </p>

            {/* chọn size */}
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

            {/* chọn màu */}
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
                                style={{
                                    backgroundColor: v.color.toLowerCase().replace(/\s+/g, ''),
                                }}
                                onClick={() => setVariant(v)}
                            ></button>
                        ))}
                    </div>
                </div>
            )}

            <p className="mt-2 text-gray-600">
                {currentStock > 0 ? `Còn ${currentStock} sản phẩm` : 'Hết hàng'}
            </p>

            <div className="mt-8 flex gap-4">
                <button
                    className="flex-1 py-3 bg-blue-600 text-white rounded-lg text-lg font-medium hover:bg-blue-700 transition"
                    disabled={currentStock === 0}
                    onClick={handleAddToCart}
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
