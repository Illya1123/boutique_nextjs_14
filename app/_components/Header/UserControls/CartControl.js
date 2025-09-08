'use client'
import { useState, useRef, useEffect } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import { FaShoppingBag } from 'react-icons/fa'
import { X } from 'lucide-react'
import Link from 'next/link'
import { slugify } from '@/app/_utils/slugify'
import { removeFromCart } from '@/store/cartSlice'
import Image from 'next/image'
import { motion, AnimatePresence } from 'framer-motion'

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
                        <span className="absolute flex items-center justify-center w-5 h-5 text-xs text-white bg-red-500 rounded-full -top-2 -right-2">
                            {cartCount}
                        </span>
                    )}
                </span>
                <span>Cart</span>
            </button>

            {/* Popup menu với hiệu ứng */}
            <AnimatePresence>
                {open && (
                    <motion.div
                        key="cart-popup"
                        initial={{ opacity: 0, y: -20, scale: 0.95, originX: 1, originY: 0 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: -20, scale: 0.95 }}
                        transition={{ duration: 0.25, ease: 'easeInOut' }}
                        className="absolute right-0 z-50 mt-2 bg-white border border-gray-200 rounded-lg shadow-lg w-80 dark:bg-gray-800 dark:border-gray-700"
                    >
                        <div className="p-4 text-gray-700 dark:text-gray-200">
                            <h3 className="mb-2 font-semibold">Giỏ hàng</h3>

                            {cartItems.length === 0 ? (
                                <div className="flex flex-col items-center justify-center py-6">
                                    <Image
                                        src="/images/cart/empty_cart.png"
                                        alt="Giỏ hàng trống"
                                        width={180}
                                        height={180}
                                        className="object-contain opacity-80"
                                        priority
                                    />
                                    <p className="mt-3 text-sm text-gray-500">Giỏ hàng trống</p>
                                </div>
                            ) : (
                                <>
                                    <div className="space-y-3 overflow-y-auto max-h-64">
                                        {cartItems.map((item) => {
                                            const slug = slugify(item.name)
                                            const productUrl = `/shop/${slug}?id=${item.productId}&variantId=${item.variantId}&size=${item.size}`
                                            return (
                                                <div
                                                    key={item.cartItemId}
                                                    className="flex items-center gap-3 pb-2 border-b last:border-b-0"
                                                >
                                                    <Link
                                                        href={productUrl}
                                                        className="flex items-center flex-1 gap-3 p-1 rounded hover:bg-gray-100 dark:hover:bg-gray-700"
                                                        onClick={() => setOpen(false)}
                                                    >
                                                        <img
                                                            src={item.image}
                                                            alt={item.name}
                                                            className="object-cover w-12 h-12 rounded"
                                                        />
                                                        <div className="flex-1">
                                                            <p className="text-sm font-medium">
                                                                {item.name}
                                                            </p>
                                                            <p className="text-xs text-gray-500">
                                                                {item.color} / {item.size}
                                                            </p>
                                                            <p className="text-sm">
                                                                {item.quantity} ×{' '}
                                                                {item.price.toLocaleString()}đ
                                                            </p>
                                                        </div>
                                                    </Link>
                                                    {/* Nút xóa */}
                                                    <button
                                                        onClick={() =>
                                                            dispatch(
                                                                removeFromCart(item.cartItemId)
                                                            )
                                                        }
                                                        className="text-gray-400 hover:text-red-600"
                                                    >
                                                        <X size={16} />
                                                    </button>
                                                </div>
                                            )
                                        })}
                                    </div>

                                    {/* Tổng giá */}
                                    <div className="flex justify-between mt-3 font-semibold text-gray-800 dark:text-gray-100">
                                        <span>Tổng:</span>
                                        <span>{subtotal.toLocaleString()}đ</span>
                                    </div>
                                </>
                            )}

                            <Link
                                href="/payment"
                                className="inline-flex items-center justify-center w-full py-2 mt-3 text-white bg-blue-600 rounded hover:bg-blue-700"
                                onClick={() => setOpen(false)}
                            >
                                Xem giỏ hàng
                            </Link>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    )
}

export default CartControl
