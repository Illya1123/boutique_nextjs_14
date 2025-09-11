'use client'

import { useEffect, useState } from 'react'
import { Th, Td } from '@/app/_components/ui/Table'
import ToggleSwitch from '@/app/_components/ui/ToggleSwitch'

export default function PaymentMethodsCard() {
    const [items, setItems] = useState([])
    const [loading, setLoading] = useState(false)
    const [togglingId, setTogglingId] = useState(null)

    async function load() {
        setLoading(true)
        try {
            const res = await fetch('/api/admin/payment-methods', { cache: 'no-store' })
            const json = await res.json()
            if (!res.ok) throw new Error(json?.error || 'Fetch failed')
            setItems(json.items || [])
        } catch (e) {
            console.error(e)
            alert(`Lỗi tải phương thức thanh toán: ${e.message}`)
        } finally {
            setLoading(false)
        }
    }

    useEffect(() => {
        load()
    }, [])

    async function toggleActive(id, next) {
        setTogglingId(id)
        try {
            const res = await fetch('/api/admin/payment-methods', {
                method: 'PATCH',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ id, is_active: next }),
            })
            const json = await res.json()
            if (!res.ok) throw new Error(json?.error || 'Toggle failed')
            setItems((prev) => prev.map((it) => (it.id === id ? { ...it, is_active: next } : it)))
        } catch (e) {
            console.error(e)
            alert(`Lỗi cập nhật: ${e.message}`)
        } finally {
            setTogglingId(null)
        }
    }

    return (
        <div className="border border-gray-200 rounded-lg overflow-hidden">
            <div className="overflow-x-auto">
                <table className="w-full text-left">
                    <thead className="bg-gray-50 border-b border-gray-200">
                        <tr>
                            <Th>ID</Th>
                            <Th>Tên phương thức</Th>
                            <Th>Mô tả</Th>
                            <Th>Active</Th>
                        </tr>
                    </thead>
                    <tbody>
                        {loading ? (
                            <tr>
                                <td colSpan={4} className="p-4">
                                    Đang tải…
                                </td>
                            </tr>
                        ) : items.length ? (
                            items.map((pm) => (
                                <tr key={pm.id} className="border-t border-gray-100">
                                    <Td className="font-mono">{pm.id}</Td>
                                    <Td>{pm.name}</Td>
                                    <Td className="text-sm text-gray-600">
                                        {pm.description || '-'}
                                    </Td>
                                    <Td>
                                        <ToggleSwitch
                                            checked={!!pm.is_active}
                                            onChange={(next) => toggleActive(pm.id, next)}
                                            disabled={togglingId === pm.id}
                                            onLabel="On"
                                            offLabel="Off"
                                        />
                                    </Td>
                                </tr>
                            ))
                        ) : (
                            <tr>
                                <td colSpan={4} className="p-4">
                                    Chưa có phương thức
                                </td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    )
}
