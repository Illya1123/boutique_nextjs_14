'use client'

import { useEffect, useMemo, useState } from 'react'
import OrdersFilters from '@/app/_components/Admin/orders/OrdersFilters'
import OrdersTable from '@/app/_components/Admin/orders/OrdersTable'
import Pagination from '@/app/_components/ui/Pagination'

const ORDER_STATUSES = [
    'PENDING',
    'CONFIRMED',
    'PROCESSING',
    'SHIPPED',
    'DELIVERED',
    'COMPLETED',
    'CANCELLED',
    'REFUNDED',
]

export default function AdminOrdersPage() {
    const [q, setQ] = useState('')
    const [status, setStatus] = useState('')
    const [page, setPage] = useState(1)
    const [pageSize, setPageSize] = useState(10)
    const [data, setData] = useState({ items: [], total: 0, page: 1, pageSize: 10 })
    const [loading, setLoading] = useState(false)
    const [updatingId, setUpdatingId] = useState(null)

    const totalPages = useMemo(
        () => Math.max(1, Math.ceil((data?.total || 0) / pageSize)),
        [data?.total, pageSize]
    )

    async function fetchOrders() {
        setLoading(true)
        try {
            const params = new URLSearchParams({
                page: String(page),
                pageSize: String(pageSize),
            })
            if (q.trim()) params.set('q', q.trim())
            if (status) params.set('status', status)

            const res = await fetch(`/api/admin/orders?${params.toString()}`, { cache: 'no-store' })
            const json = await res.json()
            if (!res.ok) throw new Error(json?.error || 'Fetch failed')
            setData(json)
        } catch (e) {
            console.error(e)
            alert(`Lỗi tải đơn hàng: ${e.message}`)
        } finally {
            setLoading(false)
        }
    }

    useEffect(() => {
        fetchOrders()
    }, [page, pageSize, status])

    async function handleSearchSubmit(e) {
        e.preventDefault()
        setPage(1)
        fetchOrders()
    }

    async function updateStatus(orderId, newStatus) {
        if (!newStatus) return
        setUpdatingId(orderId)
        try {
            const res = await fetch('/api/admin/orders', {
                method: 'PATCH',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ id: orderId, status: newStatus }),
            })
            const json = await res.json()
            if (!res.ok) throw new Error(json?.error || 'Update failed')
            setData((prev) => ({
                ...prev,
                items: prev.items.map((it) =>
                    it.id === orderId ? { ...it, status: newStatus } : it
                ),
            }))
        } catch (e) {
            console.error(e)
            alert(`Cập nhật trạng thái thất bại: ${e.message}`)
        } finally {
            setUpdatingId(null)
        }
    }

    return (
        <div className="p-5">
            <h1 className="text-2xl font-semibold mb-4">Orders (Admin)</h1>

            <OrdersFilters
                q={q}
                setQ={setQ}
                status={status}
                setStatus={(v) => {
                    setStatus(v)
                    setPage(1)
                }}
                pageSize={pageSize}
                setPageSize={(n) => {
                    setPageSize(n)
                    setPage(1)
                }}
                onSubmit={handleSearchSubmit}
                statuses={ORDER_STATUSES}
            />

            <OrdersTable
                items={data.items}
                loading={loading}
                updatingId={updatingId}
                onUpdateStatus={updateStatus}
                statuses={ORDER_STATUSES}
            />

            <div className="mt-3">
                <Pagination
                    page={page}
                    totalPages={totalPages}
                    onPrev={() => setPage((p) => Math.max(1, p - 1))}
                    onNext={() => setPage((p) => Math.min(totalPages, p + 1))}
                />
            </div>
        </div>
    )
}
