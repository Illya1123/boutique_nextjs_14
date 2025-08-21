'use client'
import { useState, useRef, useEffect } from 'react'
import { FaShoppingBag } from 'react-icons/fa'

function CartControl() {
    const [open, setOpen] = useState(false)
    const cartCount = 3 // giả sử số lượng trong giỏ
    const ref = useRef(null)

    // Đóng menu khi click ra ngoài
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
                <div className="absolute right-0 mt-2 w-64 bg-white dark:bg-gray-800 shadow-lg rounded-lg border border-gray-200 dark:border-gray-700 z-50">
                    <div className="p-4 text-gray-700 dark:text-gray-200">
                        <h3 className="font-semibold mb-2">Giỏ hàng</h3>
                        <div className="space-y-2">
                            <div className="flex justify-between">
                                <span>Áo thun</span>
                                <span>2x</span>
                            </div>
                            <div className="flex justify-between">
                                <span>Giày thể thao</span>
                                <span>1x</span>
                            </div>
                        </div>
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
