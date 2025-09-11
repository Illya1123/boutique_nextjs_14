'use client'

import { useEffect, useState } from 'react'
import { Th, Td } from '@/app/_components/ui/Table'

export default function BlogCategoriesCard() {
    const [items, setItems] = useState([])
    const [loading, setLoading] = useState(false)

    // form create
    const [name, setName] = useState('')
    const [description, setDescription] = useState('')

    // edit state
    const [editingId, setEditingId] = useState(null)
    const [editName, setEditName] = useState('')
    const [editDesc, setEditDesc] = useState('')

    async function load() {
        setLoading(true)
        try {
            const res = await fetch('/api/admin/blog-categories', { cache: 'no-store' })
            const json = await res.json()
            if (!res.ok) throw new Error(json?.error || 'Fetch failed')
            setItems(json.items || [])
        } catch (e) {
            console.error(e)
            alert(`Lỗi tải categories: ${e.message}`)
        } finally {
            setLoading(false)
        }
    }

    useEffect(() => {
        load()
    }, [])

    async function createCategory(e) {
        e.preventDefault()
        try {
            const res = await fetch('/api/admin/blog-categories', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ name, description }),
            })
            const json = await res.json()
            if (!res.ok) throw new Error(json?.error || 'Create failed')
            setItems((prev) => [...prev, json.item])
            setName('')
            setDescription('')
        } catch (e) {
            console.error(e)
            alert(`Lỗi tạo category: ${e.message}`)
        }
    }

    function startEdit(cat) {
        setEditingId(cat.id)
        setEditName(cat.name)
        setEditDesc(cat.description || '')
    }

    function cancelEdit() {
        setEditingId(null)
        setEditName('')
        setEditDesc('')
    }

    async function saveEdit(id) {
        try {
            const res = await fetch(`/api/admin/blog-categories/${id}`, {
                method: 'PATCH',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ name: editName, description: editDesc }),
            })
            const json = await res.json()
            if (!res.ok) throw new Error(json?.error || 'Update failed')
            setItems((prev) => prev.map((it) => (it.id === id ? json.item : it)))
            cancelEdit()
        } catch (e) {
            console.error(e)
            alert(`Lỗi cập nhật: ${e.message}`)
        }
    }

    async function remove(id) {
        if (!confirm('Xoá category này?')) return
        try {
            const res = await fetch(`/api/admin/blog-categories/${id}`, { method: 'DELETE' })
            const json = await res.json()
            if (!res.ok) throw new Error(json?.error || 'Delete failed')
            setItems((prev) => prev.filter((it) => it.id !== id))
        } catch (e) {
            console.error(e)
            alert(`Lỗi xoá: ${e.message}`)
        }
    }

    return (
        <div className="space-y-6">
            {/* Form tạo mới */}
            <form
                onSubmit={createCategory}
                className="flex flex-col md:flex-row gap-2 md:items-end"
            >
                <div className="flex-1">
                    <label className="block text-sm text-gray-600 mb-1">Name</label>
                    <input
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        className="w-full px-3 py-2 rounded border border-gray-300 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                        placeholder="Nhập tên category…"
                        required
                    />
                </div>
                <div className="flex-1">
                    <label className="block text-sm text-gray-600 mb-1">Description</label>
                    <input
                        value={description}
                        onChange={(e) => setDescription(e.target.value)}
                        className="w-full px-3 py-2 rounded border border-gray-300 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                        placeholder="Mô tả (tuỳ chọn)"
                    />
                </div>
                <button
                    type="submit"
                    className="px-4 py-2 rounded bg-indigo-600 text-white hover:bg-indigo-700 active:bg-indigo-800"
                >
                    Thêm
                </button>
            </form>

            {/* Bảng categories */}
            <div className="border border-gray-200 rounded-lg overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full text-left">
                        <thead className="bg-gray-50 border-b border-gray-200">
                            <tr>
                                <Th>ID</Th>
                                <Th>Tên Danh mục</Th>
                                <Th>Mô tả</Th>
                                <Th>Actions</Th>
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
                                items.map((cat) => (
                                    <tr key={cat.id} className="border-t border-gray-100 align-top">
                                        <Td className="font-mono">{cat.id}</Td>

                                        <Td className="w-[260px]">
                                            {editingId === cat.id ? (
                                                <input
                                                    value={editName}
                                                    onChange={(e) => setEditName(e.target.value)}
                                                    className="w-full px-2 py-1 rounded border border-gray-300 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                                                />
                                            ) : (
                                                cat.name
                                            )}
                                        </Td>

                                        <Td className="max-w-[520px]">
                                            {editingId === cat.id ? (
                                                <input
                                                    value={editDesc}
                                                    onChange={(e) => setEditDesc(e.target.value)}
                                                    className="w-full px-2 py-1 rounded border border-gray-300 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                                                />
                                            ) : (
                                                <span className="text-sm text-gray-600 break-words">
                                                    {cat.description || '-'}
                                                </span>
                                            )}
                                        </Td>

                                        <Td className="space-x-2 whitespace-nowrap">
                                            {editingId === cat.id ? (
                                                <>
                                                    <button
                                                        onClick={() => saveEdit(cat.id)}
                                                        className="px-3 py-1 rounded bg-green-600 text-white hover:bg-green-700"
                                                    >
                                                        Lưu
                                                    </button>
                                                    <button
                                                        onClick={cancelEdit}
                                                        className="px-3 py-1 rounded border border-gray-300 bg-white hover:bg-gray-50"
                                                    >
                                                        Huỷ
                                                    </button>
                                                </>
                                            ) : (
                                                <>
                                                    <button
                                                        onClick={() => startEdit(cat)}
                                                        className="px-3 py-1 rounded border border-gray-300 bg-white hover:bg-gray-50"
                                                    >
                                                        Sửa
                                                    </button>
                                                    <button
                                                        onClick={() => remove(cat.id)}
                                                        className="px-3 py-1 rounded bg-red-600 text-white hover:bg-red-700"
                                                    >
                                                        Xoá
                                                    </button>
                                                </>
                                            )}
                                        </Td>
                                    </tr>
                                ))
                            ) : (
                                <tr>
                                    <td colSpan={4} className="p-4">
                                        Chưa có category
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    )
}
