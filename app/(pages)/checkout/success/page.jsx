'use client'

import { useEffect, useMemo, useState } from 'react'
import Link from 'next/link'
import { useSearchParams } from 'next/navigation'

export default function CheckoutSuccessPage() {
    const sp = useSearchParams()

    const status = sp.get('status') || sp.get('code') || ''
    const orderCode = sp.get('orderCode') || sp.get('order_code') || ''
    const amount = sp.get('amount') || sp.get('totalAmount') || ''
    const messageFromGateway = sp.get('desc') || sp.get('message') || ''

    const [verifying, setVerifying] = useState(true)
    const [verifyRes, setVerifyRes] = useState(null)

    const lastOrderId = useMemo(() => {
        if (typeof window === 'undefined') return ''
        return localStorage.getItem('lastOrderId') || ''
    }, [])

    useEffect(() => {
        ;(async () => {
            try {
                const qs = {}
                sp.forEach((v, k) => (qs[k] = v))

                const res = await fetch('/api/payments/payos/handle-return', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({
                        searchParams: qs,
                        lastOrderId,
                    }),
                })

                if (!res.ok) {
                    const j = await res.json().catch(() => ({}))
                    throw new Error(j?.error || 'Xác minh thanh toán thất bại')
                }

                const data = await res.json()
                setVerifyRes(data) // { ok, message, orderId, paidAmount, orderCode }
            } catch (e) {
                setVerifyRes({ ok: false, message: e?.message || 'Có lỗi khi xác minh' })
            } finally {
                setVerifying(false)
            }
        })()
    }, [sp, lastOrderId])

    return (
        <div className="max-w-2xl px-4 py-10 mx-auto">
            <div className="p-6 bg-white border rounded-2xl dark:bg-gray-900 dark:border-gray-800">
                <h1 className="mb-1 text-2xl font-semibold">Thanh toán thành công</h1>
                <p className="mb-6 text-sm text-gray-600">
                    Cảm ơn bạn! Chúng tôi đã nhận thông tin từ cổng thanh toán.
                </p>

                <div className="grid grid-cols-1 gap-3 mb-6 text-sm">
                    <Row label="Trạng thái từ cổng">{status || '—'}</Row>
                    <Row label="Mã đơn (PayOS)">{orderCode || '—'}</Row>
                    <Row label="Số tiền">
                        {amount ? Number(amount).toLocaleString('vi-VN') + 'đ' : '—'}
                    </Row>
                    {messageFromGateway ? <Row label="Thông điệp">{messageFromGateway}</Row> : null}
                </div>

                <div className="p-4 mb-6 text-sm rounded-lg bg-gray-50 dark:bg-gray-800">
                    <div className="mb-2 font-medium">Xác minh trên hệ thống</div>
                    {verifying ? (
                        <p>Đang xác minh đơn hàng của bạn…</p>
                    ) : verifyRes?.ok ? (
                        <ul className="space-y-1">
                            <li>
                                <span className="font-medium">Mã đơn nội bộ: </span>
                                {verifyRes.orderId || lastOrderId || '—'}
                            </li>
                            {typeof verifyRes?.paidAmount === 'number' && (
                                <li>
                                    <span className="font-medium">Số tiền ghi nhận: </span>
                                    {verifyRes.paidAmount.toLocaleString('vi-VN')}đ
                                </li>
                            )}
                            {verifyRes?.orderCode && (
                                <li>
                                    <span className="font-medium">orderCode: </span>
                                    {verifyRes.orderCode}
                                </li>
                            )}
                            {verifyRes?.message && (
                                <li>
                                    <span className="font-medium">Ghi chú: </span>
                                    {verifyRes.message}
                                </li>
                            )}
                        </ul>
                    ) : (
                        <p className="text-amber-700">
                            {verifyRes?.message ||
                                'Không xác minh được trên hệ thống. Đơn có thể đang chờ webhook từ PayOS.'}
                        </p>
                    )}
                </div>

                <div className="flex flex-wrap gap-3">
                    <Link
                        href="/orders"
                        className="px-4 py-2 text-white bg-blue-600 rounded-lg hover:bg-blue-700"
                    >
                        Xem đơn hàng
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

function Row({ label, children }) {
    return (
        <div className="flex items-center justify-between gap-3">
            <span className="text-gray-500">{label}</span>
            <span className="font-medium text-right break-all">{children}</span>
        </div>
    )
}
