'use client'

import { useEffect, useMemo, useState } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'

const formatVND = (n) => (n ?? 0).toLocaleString('vi-VN', { style: 'currency', currency: 'VND' })

// Chuẩn hoá: lowerCase + bỏ dấu
const normalize = (str) =>
    String(str)
        .toLowerCase()
        .normalize('NFD')
        .replace(/\p{Diacritic}/gu, '')
        .trim()

// Nhận diện "CK nhanh"
const isFastTransfer = (pm) => {
    if (!pm) return false
    const s = normalize(pm)
    const patterns = [
        'ck (nhanh)',
        'ck nhanh',
        'ck-nhanh',
        'chuyen khoan nhanh',
        'chuyen khoan 247',
        'napas 247',
        'napas 24/7',
        'ck 247',
        'fast transfer',
        'quick transfer',
    ]
    return patterns.some((p) => s.includes(p))
}

const STATUS_OPTIONS = [
    'PENDING',
    'CONFIRMED',
    'PROCESSING',
    'SHIPPED',
    'DELIVERED',
    'COMPLETED',
    'CANCELLED',
    'REFUNDED',
]

export default function OrdersClient() {
    const router = useRouter()
    const searchParams = useSearchParams()

    const page = useMemo(() => Number(searchParams.get('page') || 1), [searchParams])
    const pageSize = useMemo(() => Number(searchParams.get('pageSize') || 10), [searchParams])
    const qParam = useMemo(() => searchParams.get('q') || '', [searchParams])
    const stParam = useMemo(() => searchParams.get('status') || '', [searchParams])

    const [orders, setOrders] = useState([])
    const [totalPages, setTotalPages] = useState(1)
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState(null)

    // Local state cho input (debounce)
    const [q, setQ] = useState(qParam)
    const [status, setStatus] = useState(stParam)

    // Đồng bộ khi back/forward
    useEffect(() => {
        setQ(qParam)
    }, [qParam])
    useEffect(() => {
        setStatus(stParam)
    }, [stParam])

    // Debounce search: sau 400ms mới áp dụng
    useEffect(() => {
        const t = setTimeout(() => {
            const sp = new URLSearchParams(searchParams)
            if (q.trim()) sp.set('q', q.trim())
            else sp.delete('q')
            // Khi đổi filter -> reset về page 1
            sp.set('page', '1')
            router.replace(`?${sp.toString()}`)
        }, 400)
        return () => clearTimeout(t)
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [q])

    // Áp dụng status ngay khi đổi (cũng reset page)
    useEffect(() => {
        const sp = new URLSearchParams(searchParams)
        if (status) sp.set('status', status)
        else sp.delete('status')
        sp.set('page', '1')
        router.replace(`?${sp.toString()}`)
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [status])

    useEffect(() => {
        const ac = new AbortController()
        async function load() {
            try {
                setLoading(true)
                setError(null)

                const sp = new URLSearchParams()
                sp.set('page', String(page))
                sp.set('pageSize', String(pageSize))
                if (qParam.trim()) sp.set('q', qParam.trim())
                if (stParam) sp.set('status', stParam)

                const res = await fetch(`/api/account/orders?${sp.toString()}`, {
                    cache: 'no-store',
                    signal: ac.signal,
                })

                if (res.status === 401) {
                    router.push('/login')
                    return
                }
                if (!res.ok) throw new Error('Không thể tải đơn hàng')

                const data = await res.json()
                setOrders(data.orders ?? [])
                setTotalPages(data.totalPages ?? 1)
            } catch (e) {
                if (e?.name !== 'AbortError') setError(e?.message || 'Đã xảy ra lỗi')
            } finally {
                setLoading(false)
            }
        }
        load()
        return () => ac.abort()
    }, [page, pageSize, qParam, stParam, router])

    const gotoPage = (p) => {
        const sp = new URLSearchParams(searchParams)
        sp.set('page', String(p))
        sp.set('pageSize', String(pageSize))
        router.replace(`?${sp.toString()}`)
    }

    return (
        <>
            {/* Thanh công cụ: tìm kiếm và lọc trạng thái */}
            <div className="flex flex-col gap-3 mb-4 sm:flex-row">
                <input
                    value={q}
                    onChange={(e) => setQ(e.target.value)}
                    placeholder="Tìm mã đơn, sản phẩm, địa chỉ, SĐT…"
                    className="w-full px-3 py-2 border rounded-lg sm:max-w-md"
                />
                <select
                    className="w-full px-3 py-2 border rounded-lg sm:w-56"
                    value={status}
                    onChange={(e) => setStatus(e.target.value)}
                >
                    <option value="">Tất cả trạng thái</option>
                    {STATUS_OPTIONS.map((st) => (
                        <option key={st} value={st}>
                            {st}
                        </option>
                    ))}
                </select>
            </div>

            {loading && (
                <div className="p-6 border rounded-2xl bg-white/90 backdrop-blur-md">
                    <p className="text-gray-600">Đang tải đơn hàng…</p>
                </div>
            )}

            {error && !loading && (
                <div className="p-6 border rounded-2xl bg-red-50">
                    <p className="text-red-600">{error}</p>
                </div>
            )}

            {!loading && !error && (
                <>
                    {orders.length === 0 ? (
                        <div className="p-6 border rounded-2xl bg-white/90 backdrop-blur-md">
                            <p className="text-gray-600">Không có đơn phù hợp bộ lọc.</p>
                        </div>
                    ) : (
                        <div className="grid gap-4">
                            {orders.map((order) => {
                                const addFee = isFastTransfer(order.paymentMethod) ? 2000 : 0
                                const totalWithFee = (order.total ?? 0) + addFee

                                return (
                                    <article
                                        key={order.id}
                                        className="p-6 border shadow rounded-2xl bg-white/90 backdrop-blur-md"
                                    >
                                        <div className="flex flex-wrap items-center justify-between gap-3">
                                            <div>
                                                <h3 className="text-lg font-semibold">
                                                    Mã đơn:{' '}
                                                    <span className="font-mono">
                                                        {order.id.slice(0, 8)}
                                                    </span>
                                                </h3>
                                                <p className="text-sm text-gray-500">
                                                    Ngày đặt:{' '}
                                                    {new Date(order.date).toLocaleString('vi-VN')}
                                                </p>
                                            </div>
                                            <div className="text-right">
                                                <div className="text-sm">
                                                    Thanh toán:{' '}
                                                    <span className="font-medium">
                                                        {order.paymentMethod ?? '—'}
                                                    </span>
                                                </div>
                                                <div className="text-sm">
                                                    Trạng thái:{' '}
                                                    <span className="inline-block rounded-full border px-2 py-0.5 text-xs">
                                                        {order.status}
                                                    </span>
                                                </div>
                                            </div>
                                        </div>

                                        <div className="mt-4 divide-y">
                                            {order.items.map((it) => (
                                                <div
                                                    key={it.id}
                                                    className="flex items-start justify-between py-3"
                                                >
                                                    <div className="pr-4">
                                                        <div className="font-medium">
                                                            {it.productName}
                                                        </div>
                                                        <div className="text-sm text-gray-500">
                                                            Size: {it.size} · SL: {it.quantity}
                                                        </div>
                                                    </div>
                                                    <div className="text-right min-w-[120px]">
                                                        <div className="text-sm">Đơn giá</div>
                                                        <div className="font-semibold">
                                                            {formatVND(it.price)}
                                                        </div>
                                                    </div>
                                                </div>
                                            ))}
                                        </div>

                                        <div className="flex items-center justify-between mt-4">
                                            <div className="text-sm text-gray-600">
                                                Tổng sản phẩm:{' '}
                                                <span className="font-semibold">
                                                    {order.itemCount}
                                                </span>
                                            </div>
                                            <div className="text-base text-right">
                                                <div>
                                                    Tổng tiền:{' '}
                                                    <span className="font-semibold">
                                                        {formatVND(totalWithFee)}
                                                    </span>
                                                </div>
                                                {addFee > 0 && (
                                                    <div className="text-xs text-gray-500">
                                                        (đã gồm phí xử lý tự động{' '}
                                                        {formatVND(addFee)})
                                                    </div>
                                                )}
                                            </div>
                                        </div>
                                    </article>
                                )
                            })}
                        </div>
                    )}

                    {/* Phân trang */}
                    {totalPages > 1 && (
                        <div className="flex items-center gap-2 mt-6">
                            {page > 1 && (
                                <button
                                    onClick={() => gotoPage(page - 1)}
                                    className="px-3 py-2 border rounded-lg"
                                >
                                    ← Trước
                                </button>
                            )}
                            <span className="px-3 py-2">
                                {page} / {totalPages}
                            </span>
                            {page < totalPages && (
                                <button
                                    onClick={() => gotoPage(page + 1)}
                                    className="px-3 py-2 border rounded-lg"
                                >
                                    Sau →
                                </button>
                            )}
                        </div>
                    )}
                </>
            )}
        </>
    )
}
