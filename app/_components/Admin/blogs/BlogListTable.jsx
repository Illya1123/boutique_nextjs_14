'use client'

import { useEffect, useMemo, useState } from 'react'
import axios from 'axios'

const formatVNDate = (iso) => {
    try {
        const d = new Date(iso)
        return d.toLocaleDateString('vi-VN', { day: '2-digit', month: '2-digit', year: 'numeric' })
    } catch {
        return iso ?? ''
    }
}

// bỏ dấu & lowercase để search không phân biệt dấu
const norm = (s) =>
    String(s ?? '')
        .normalize('NFD')
        .replace(/[\u0300-\u036f]/g, '')
        .replace(/[Đđ]/g, 'd')
        .toLowerCase()

export default function BlogListTable({ onEdit }) {
    const [rows, setRows] = useState([])
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState('')

    // search
    const [q, setQ] = useState('')
    const [field, setField] = useState('all') // 'all' | 'title' | 'author'

    useEffect(() => {
        let cancel = false
        ;(async () => {
            try {
                setLoading(true)
                const res = await axios.get('/api/blogs', {
                    headers: { 'Cache-Control': 'no-store' },
                })
                if (!res.data?.success) throw new Error('API trả về success=false')
                if (!cancel) setRows(res.data.blogs || [])
            } catch (e) {
                if (!cancel) setError(e?.message || 'Không tải được danh sách')
            } finally {
                if (!cancel) setLoading(false)
            }
        })()
        return () => {
            cancel = true
        }
    }, [])

    const filtered = useMemo(() => {
        if (!q.trim()) return rows
        const needle = norm(q)
        return rows.filter((b) => {
            const title = norm(b.title)
            const author = norm(b.author?.name || '')
            if (field === 'title') return title.includes(needle)
            if (field === 'author') return author.includes(needle)
            return title.includes(needle) || author.includes(needle)
        })
    }, [rows, q, field])

    const handleDelete = async (id) => {
        if (!confirm('Bạn chắc chắn muốn xoá bài viết này?')) return
        try {
            const res = await axios.delete(`/api/admin/blogs?id=${id}`)
            if (res.data?.success) {
                setRows((r) => r.filter((x) => x.id !== id))
            } else {
                alert(res?.data?.error || 'Xoá thất bại')
            }
        } catch (e) {
            alert(e?.response?.data?.error || e?.message || 'Lỗi kết nối')
        }
    }

    if (loading) return <div className="p-6">Đang tải danh sách…</div>
    if (error) return <div className="p-6 text-red-600">{error}</div>
    if (!rows.length) return <div className="p-6">Chưa có bài viết nào</div>

    return (
        <div className="bg-white/90 rounded-2xl border shadow">
            <div className="px-5 pt-5">
                <h2 className="text-xl font-semibold">Danh sách blog</h2>
                <p className="text-sm text-gray-500 mt-1">
                    Hiển thị: ID, Tác giả, Tiêu đề, Ngày đăng, Chức năng
                </p>

                {/* Search bar */}
                <div className="mt-4 flex flex-col gap-3 md:flex-row md:items-center">
                    <input
                        value={q}
                        onChange={(e) => setQ(e.target.value)}
                        placeholder="Tìm theo tiêu đề hoặc tác giả…"
                        className="border rounded px-3 py-2 w-full md:max-w-sm"
                    />
                    <div className="flex items-center gap-3">
                        <label className="text-sm text-gray-600">Lọc theo:</label>
                        <select
                            value={field}
                            onChange={(e) => setField(e.target.value)}
                            className="border rounded px-3 py-2"
                        >
                            <option value="all">Tất cả</option>
                            <option value="title">Tiêu đề</option>
                            <option value="author">Tác giả</option>
                        </select>
                        {q && (
                            <button
                                className="text-sm px-3 py-2 rounded border hover:bg-gray-50"
                                onClick={() => setQ('')}
                            >
                                Xoá tìm kiếm
                            </button>
                        )}
                    </div>
                </div>
            </div>

            <div className="overflow-x-auto mt-4">
                <table className="min-w-full text-sm">
                    <thead>
                        <tr className="bg-gray-100 text-left">
                            <th className="px-5 py-3 font-semibold">ID</th>
                            <th className="px-5 py-3 font-semibold">Tác giả</th>
                            <th className="px-5 py-3 font-semibold">Tiêu đề</th>
                            <th className="px-5 py-3 font-semibold">Ngày đăng</th>
                            <th className="px-5 py-3 font-semibold">Chức năng</th>
                        </tr>
                    </thead>
                    <tbody>
                        {filtered.map((b) => (
                            <tr key={b.id} className="border-t">
                                <td className="px-5 py-3 font-mono text-xs">{b.id}</td>
                                <td className="px-5 py-3">{b.author?.name || '—'}</td>
                                <td className="px-5 py-3">{b.title}</td>
                                <td className="px-5 py-3">{formatVNDate(b.createdAt)}</td>
                                <td className="px-5 py-3">
                                    <div className="flex gap-2">
                                        <button
                                            className="px-3 py-1.5 rounded border hover:bg-gray-50"
                                            onClick={() => onEdit?.(b)}
                                        >
                                            Sửa
                                        </button>
                                        <button
                                            className="px-3 py-1.5 rounded border border-red-300 text-red-600 hover:bg-red-50"
                                            onClick={() => handleDelete(b.id)}
                                        >
                                            Xoá
                                        </button>
                                    </div>
                                </td>
                            </tr>
                        ))}
                        {filtered.length === 0 && (
                            <tr>
                                <td colSpan={5} className="px-5 py-6 text-center text-gray-500">
                                    Không tìm thấy kết quả phù hợp
                                </td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    )
}
