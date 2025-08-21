'use client'
import { useState, useRef, useEffect } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import { FaShoppingBag } from 'react-icons/fa'
import { X } from 'lucide-react'
import Link from 'next/link'
import { slugify } from '@/app/_utils/slugify'
import { removeFromCart } from '@/store/cartSlice'

function CartControl() {
    const [open, setOpen] = useState(false)
    const cartItems = useSelector((state) => state.cart.items)
    const cartCount = cartItems.reduce((total, item) => total + item.quantity, 0)
    const subtotal = cartItems.reduce((total, item) => total + item.price * item.quantity, 0)
    const ref = useRef(null)
    const dispatch = useDispatch()

    // Đóng popup khi click ra ngoài
    useEffect(() => {
        function handleClickOutside(e) {
            if (ref.current && !ref.current.contains(e.target)) {
                setOpen(false)
            }
        }
        document.addEventListener('mousedown', handleClickOutside)
        return () => document.removeEventListener('mousedown', handleClickOutside)
    }, [])

    return (
        <div className="relative" ref={ref}>
            {/* Nút mở popup */}
            <button
                onClick={() => setOpen(!open)}
                className="flex items-center space-x-2 text-xl focus:outline-none"
            >
                <span className="relative inline-flex items-center justify-center">
                    <FaShoppingBag className="align-middle" />
                    {cartCount > 0 && (
                        <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs w-5 h-5 flex items-center justify-center rounded-full">
                            {cartCount}
                        </span>
                    )}
                </span>
                <span>Cart</span>
            </button>

            {/* Popup menu */}
            {open && (
                <div className="absolute right-0 mt-2 w-80 bg-white dark:bg-gray-800 shadow-lg rounded-lg border border-gray-200 dark:border-gray-700 z-50">
                    <div className="p-4 text-gray-700 dark:text-gray-200">
                        <h3 className="font-semibold mb-2">Giỏ hàng</h3>

                        {cartItems.length === 0 ? (
                            <p className="text-sm text-gray-500">Giỏ hàng trống</p>
                        ) : (
                            <>
                                <div className="space-y-3 max-h-64 overflow-y-auto">
                                    {cartItems.map((item) => {
                                        const slug = slugify(item.name)
                                        const productUrl = `/shop/${slug}?id=${item.productId}&variantId=${item.variantId}&size=${item.size}`
                                        return (
                                            <div
                                                key={item.cartItemId}
                                                className="flex items-center gap-3 border-b pb-2 last:border-b-0"
                                            >
                                                <Link
                                                    href={productUrl}
                                                    className="flex items-center gap-3 flex-1 hover:bg-gray-100 dark:hover:bg-gray-700 p-1 rounded"
                                                    onClick={() => setOpen(false)} // đóng popup khi vào chi tiết
                                                >
                                                    <img
                                                        src={item.image}
                                                        alt={item.name}
                                                        className="w-12 h-12 object-cover rounded"
                                                    />
                                                    <div className="flex-1">
                                                        <p className="text-sm font-medium">{item.name}</p>
                                                        <p className="text-xs text-gray-500">
                                                            {item.color} / {item.size}
                                                        </p>
                                                        <p className="text-sm">
                                                            {item.quantity} × {item.price.toLocaleString()}đ
                                                        </p>
                                                    </div>
                                                </Link>
                                                {/* Nút xóa */}
                                                <button
                                                    onClick={() => dispatch(removeFromCart(item.cartItemId))}
                                                    className="text-gray-400 hover:text-red-600"
                                                >
                                                    <X size={16} />
                                                </button>
                                            </div>
                                        )
                                    })}
                                </div>

                                {/* Tổng giá */}
                                <div className="mt-3 flex justify-between font-semibold text-gray-800 dark:text-gray-100">
                                    <span>Tổng:</span>
                                    <span>{subtotal.toLocaleString()}đ</span>
                                </div>
                            </>
                        )}

                        <button className="mt-3 w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700">
                            Xem giỏ hàng
                        </button>
                    </div>
                </div>
            )}
        </div>
    )
}

export default CartControl
