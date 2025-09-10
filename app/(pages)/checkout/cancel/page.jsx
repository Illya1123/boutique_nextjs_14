'use client'

import Link from 'next/link'
import { useEffect, useState } from 'react'

export default function CheckoutCancelPage() {
    const [msg, setMsg] = useState('')

    useEffect(() => {
        const lastOrderId = localStorage.getItem('lastOrderId')
        if (!lastOrderId) return // Gọi API handle-return để cập nhật trạng thái CANCELLED
        ;(async () => {
            try {
                const res = await fetch('/api/payments/payos/handle-return', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({
                        searchParams: { status: 'CANCELLED' }, // ép status CANCELLED
                        lastOrderId,
                    }),
                })
                const data = await res.json()
                if (data.ok === false) {
                    setMsg(data.message || 'Đơn đã hủy.')
                } else {
                    setMsg('Đơn đã được cập nhật trạng thái CANCELLED.')
                }
                // Nếu muốn, bạn có thể xóa lastOrderId khỏi localStorage
                localStorage.removeItem('lastOrderId')
            } catch (e) {
                setMsg('Không thể cập nhật trạng thái đơn hàng.')
            }
        })()
    }, [])

    return (
        <div className="max-w-lg px-4 py-10 mx-auto">
            <div className="p-6 bg-white border rounded-2xl dark:bg-gray-900 dark:border-gray-800">
                <h1 className="mb-1 text-2xl font-semibold">Thanh toán đã hủy</h1>
                <p className="mb-6 text-sm text-gray-600">
                    Bạn đã hủy thanh toán hoặc đóng cửa sổ thanh toán. Bạn có thể thử lại bất cứ lúc
                    nào.
                </p>

                {msg && <p className="mb-4 text-sm text-amber-600">{msg}</p>}

                <div className="flex flex-wrap gap-3">
                    <Link
                        href="/cart"
                        className="px-4 py-2 text-white bg-blue-600 rounded-lg hover:bg-blue-700"
                    >
                        Quay lại giỏ hàng
                    </Link>
                    <Link
                        href="/shop"
                        className="px-4 py-2 bg-gray-200 rounded-lg hover:bg-gray-300 dark:bg-gray-800 dark:hover:bg-gray-700"
                    >
                        Tiếp tục mua sắm
                    </Link>
                </div>
            </div>
        </div>
    )
}
