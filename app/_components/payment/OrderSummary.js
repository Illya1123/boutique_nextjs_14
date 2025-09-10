'use client'

import Image from 'next/image'
import Link from 'next/link'
import { fVND } from '@/app/_lib/payment-utils'

export default function OrderSummary({
    cartItems,
    subtotal,
    fastBankFee,
    payableTotal,
    selectedMethodId,
}) {
    return (
        <section className="p-4 bg-white border border-gray-200 md:col-span-2 dark:bg-gray-900 rounded-2xl dark:border-gray-800">
            <h2 className="mb-4 text-lg font-semibold">Tóm tắt đơn hàng</h2>

            {cartItems.length === 0 ? (
                <div className="flex flex-col items-center py-10">
                    <Image src="/images/cart/empty_cart.png" alt="Empty" width={160} height={160} />
                    <p className="mt-3 text-sm text-gray-500">Giỏ hàng trống</p>
                    <Link href="/shop" className="mt-4 text-blue-600 hover:underline">
                        Tiếp tục mua sắm
                    </Link>
                </div>
            ) : (
                <div className="space-y-4">
                    {cartItems.map((i) => (
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
                                    {i.quantity} × {fVND(i.price)}
                                </p>
                            </div>
                            <div className="font-semibold">{fVND(i.price * i.quantity)}</div>
                        </div>
                    ))}

                    <div className="flex justify-between pt-2 text-base font-semibold">
                        <span>Tạm tính</span>
                        <span>{fVND(subtotal)}</span>
                    </div>

                    {Number(selectedMethodId) === 3 && (
                        <div className="flex justify-between text-sm">
                            <span>Phụ phí CK nhanh</span>
                            <span>{fVND(fastBankFee)}</span>
                        </div>
                    )}

                    <div className="flex justify-between text-base font-semibold">
                        <span>Thành tiền</span>
                        <span>{fVND(payableTotal)}</span>
                    </div>
                </div>
            )}
        </section>
    )
}
