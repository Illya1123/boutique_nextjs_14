'use client'

import { Th, Td } from '@/app/_components/ui/Table'
import { formatVND } from '@/app/_utils/format'

export default function OrdersTable({
    items = [],
    loading = false,
    updatingId = null,
    onUpdateStatus,
    statuses = [],
}) {
    return (
        <div className="border border-gray-200 rounded-lg overflow-hidden">
            <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse">
                    <thead className="bg-gray-50">
                        <tr className="border-b border-gray-200">
                            <Th>Ngày giao dịch</Th>
                            <Th>Order ID</Th>
                            <Th>Khách hàng</Th>
                            <Th>SĐT</Th>
                            <Th>Địa chỉ</Th>
                            <Th>Thanh toán</Th>
                            <Th>Sản phẩm</Th>
                            <Th>Tổng tiền</Th>
                            <Th>Tình trạng</Th>
                        </tr>
                    </thead>
                    <tbody>
                        {loading ? (
                            <tr>
                                <td colSpan={9} className="p-4">
                                    Đang tải…
                                </td>
                            </tr>
                        ) : items?.length ? (
                            items.map((o) => {
                                const date = new Date(o.date).toLocaleString()
                                const customerName = o.customer?.name || '(Guest)'

                                // Tổng tiền theo line items
                                let totalPrice =
                                    o.orderItems?.reduce((sum, oi) => {
                                        const itemTotal = Number(oi.price) * oi.quantity
                                        return sum + itemTotal
                                    }, 0) || 0

                                // Nếu Payment là "CK (nhanh)" cộng thêm 2000
                                if (o.paymentMethod?.name === 'CK (nhanh)') {
                                    totalPrice += 2000
                                }

                                return (
                                    <tr key={o.id} className="border-t border-gray-200 align-top">
                                        <Td>{date}</Td>
                                        <Td className="font-mono break-all">{o.id}</Td>
                                        <Td>{customerName}</Td>
                                        <Td>{o.contact_phone || o.customer?.phone || '-'}</Td>
                                        <Td className="max-w-[360px] truncate">
                                            {o.address || '-'}
                                        </Td>
                                        <Td>{o.paymentMethod?.name || '-'}</Td>
                                        <Td className="max-w-[420px] whitespace-pre-wrap">
                                            {o.orderItems?.length ? (
                                                <ul className="list-disc list-inside space-y-1">
                                                    {o.orderItems.map((oi) => (
                                                        <li key={oi.id} className="text-sm">
                                                            {oi.product?.name || ''} x{oi.quantity}
                                                            {oi.size ? ` (${oi.size})` : ''} —{' '}
                                                            {formatVND(oi.price)}
                                                        </li>
                                                    ))}
                                                </ul>
                                            ) : (
                                                '-'
                                            )}
                                        </Td>
                                        <Td className="font-semibold text-indigo-600">
                                            {formatVND(totalPrice)}
                                        </Td>
                                        <Td>
                                            <select
                                                value={o.status}
                                                onChange={(e) =>
                                                    onUpdateStatus?.(o.id, e.target.value)
                                                }
                                                disabled={updatingId === o.id}
                                                className="px-2 py-1 rounded border border-gray-300 bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500 disabled:opacity-60"
                                            >
                                                {statuses.map((s) => (
                                                    <option key={s} value={s}>
                                                        {s}
                                                    </option>
                                                ))}
                                            </select>
                                        </Td>
                                    </tr>
                                )
                            })
                        ) : (
                            <tr>
                                <td colSpan={9} className="p-4">
                                    Không có đơn hàng
                                </td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    )
}
