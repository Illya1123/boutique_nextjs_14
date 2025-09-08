'use client'

import { useEffect, useMemo, useState } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import Link from 'next/link'
import Image from 'next/image'

export default function PaymentPage() {
    const items = useSelector((state) => state.cart.items)
    const dispatch = useDispatch()

    const [methods, setMethods] = useState([])
    const [loading, setLoading] = useState(false)
    const [message, setMessage] = useState(null)

    const subtotal = useMemo(() => items.reduce((s, i) => s + i.price * i.quantity, 0), [items])

    useEffect(() => {
        fetch('/api/payment-methods')
            .then((r) => r.json())
            .then((data) => setMethods(data?.methods ?? []))
            .catch(() => setMethods([]))
    }, [])

    async function handleSubmit(e) {
        e.preventDefault()
        setMessage(null)

        const form = e.currentTarget
        const formData = new FormData(form)

        const payload = {
            customer: {
                name: formData.get('name'),
                email: formData.get('email'),
                phone: formData.get('phone'),
                address: formData.get('address'),
            },
            paymentMethodId: Number(formData.get('paymentMethodId')),
            items: items.map((i) => ({
                product_id: i.productId,
                quantity: i.quantity,
                price: i.price,
                size: i.size,
            })),
        }

        if (!payload.items.length) {
            setMessage('Giỏ hàng trống — vui lòng chọn sản phẩm trước khi thanh toán.')
            return
        }

        setLoading(true)
        try {
            const res = await fetch('/api/orders', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(payload),
            })
            const json = await res.json()
            if (!res.ok) throw new Error(json?.error || 'Tạo đơn hàng thất bại')

            setMessage(`Đặt hàng thành công! Mã đơn: ${json.order.id}`)
            // dispatch(clearCart())
            form.reset()
        } catch (err) {
            setMessage(err?.message || 'Có lỗi xảy ra')
        } finally {
            setLoading(false)
        }
    }

    return (
        <div className="max-w-5xl px-4 py-8 mx-auto">
            <h1 className="mb-6 text-2xl font-semibold">Thanh toán</h1>

            <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
                {/* Tóm tắt đơn hàng */}
                <section className="p-4 bg-white border border-gray-200 md:col-span-2 dark:bg-gray-900 rounded-2xl dark:border-gray-800">
                    <h2 className="mb-4 text-lg font-semibold">Tóm tắt đơn hàng</h2>

                    {items.length === 0 ? (
                        <div className="flex flex-col items-center py-10">
                            <Image
                                src="/images/cart/empty_cart.png"
                                alt="Empty"
                                width={160}
                                height={160}
                            />
                            <p className="mt-3 text-sm text-gray-500">Giỏ hàng trống</p>
                            <Link href="/shop" className="mt-4 text-blue-600 hover:underline">
                                Tiếp tục mua sắm
                            </Link>
                        </div>
                    ) : (
                        <div className="space-y-4">
                            {items.map((i) => (
                                <div
                                    key={i.cartItemId}
                                    className="flex items-center gap-3 pb-3 border-b last:border-b-0"
                                >
                                    <img
                                        src={i.image}
                                        alt={i.name}
                                        className="object-cover w-16 h-16 rounded"
                                    />
                                    <div className="flex-1 min-w-0">
                                        <p className="font-medium truncate">{i.name}</p>
                                        <p className="text-xs text-gray-500">
                                            {i.color ? `${i.color} / ` : ''}
                                            {i.size}
                                        </p>
                                        <p className="text-sm">
                                            {i.quantity} × {i.price.toLocaleString()}đ
                                        </p>
                                    </div>
                                    <div className="font-semibold">
                                        {(i.price * i.quantity).toLocaleString()}đ
                                    </div>
                                </div>
                            ))}
                            <div className="flex justify-between pt-2 text-base font-semibold">
                                <span>Tạm tính</span>
                                <span>{subtotal.toLocaleString()}đ</span>
                            </div>
                        </div>
                    )}
                </section>

                {/* Form thanh toán */}
                <section className="p-4 bg-white border border-gray-200 dark:bg-gray-900 rounded-2xl dark:border-gray-800">
                    <h2 className="mb-4 text-lg font-semibold">Thông tin thanh toán</h2>

                    <form onSubmit={handleSubmit} className="space-y-3">
                        <div>
                            <label className="block mb-1 text-sm">Họ và tên</label>
                            <input
                                name="name"
                                required
                                className="w-full px-3 py-2 bg-transparent border rounded-lg"
                            />
                        </div>
                        <div>
                            <label className="block mb-1 text-sm">Email</label>
                            <input
                                name="email"
                                type="email"
                                required
                                className="w-full px-3 py-2 bg-transparent border rounded-lg"
                            />
                        </div>
                        <div>
                            <label className="block mb-1 text-sm">Số điện thoại</label>
                            <input
                                name="phone"
                                required
                                className="w-full px-3 py-2 bg-transparent border rounded-lg"
                            />
                        </div>
                        <div>
                            <label className="block mb-1 text-sm">Địa chỉ</label>
                            <textarea
                                name="address"
                                rows="3"
                                required
                                className="w-full px-3 py-2 bg-transparent border rounded-lg"
                            />
                        </div>

                        <div>
                            <label className="block mb-1 text-sm">Phương thức thanh toán</label>
                            <select
                                name="paymentMethodId"
                                required
                                className="w-full px-3 py-2 bg-transparent border rounded-lg"
                                defaultValue=""
                            >
                                <option value="" disabled>
                                    Chọn phương thức
                                </option>
                                {methods.map((m) => (
                                    <option key={m.id} value={m.id}>
                                        {m.name}
                                    </option>
                                ))}
                            </select>
                            {methods.length === 0 && (
                                <p className="mt-1 text-xs text-amber-600">
                                    Không có phương thức nào khả dụng — hãy seed bảng PaymentMethod.
                                </p>
                            )}
                        </div>

                        <button
                            type="submit"
                            disabled={loading}
                            className="inline-flex items-center justify-center w-full py-2 text-white bg-blue-600 rounded-lg hover:bg-blue-700"
                        >
                            {loading ? 'Đang tạo đơn…' : 'Đặt hàng'}
                        </button>

                        {message && (
                            <p
                                className={`text-sm mt-2 ${message.startsWith('Đặt hàng thành công') ? 'text-green-600' : 'text-red-600'}`}
                            >
                                {message}
                            </p>
                        )}
                    </form>
                </section>
            </div>
        </div>
    )
}
