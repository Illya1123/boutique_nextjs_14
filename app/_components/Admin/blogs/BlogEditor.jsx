'use client'

import { useEffect, useMemo, useState } from 'react'
import axios from 'axios'
import { slugify } from '@/app/_utils/slugify'
import BlogPreview from './BlogPreview'
import ParagraphRow from './ParagraphRow'

export default function BlogEditor({ editingBlog, onSaved, onCancelEdit }) {
    const [title, setTitle] = useState('')
    const [categoryId, setCategoryId] = useState('')
    const [categories, setCategories] = useState([])
    const [tagsInput, setTagsInput] = useState('')
    const [paragraphs, setParagraphs] = useState([{ type: 'text', text: '', order: 1 }])

    const [saving, setSaving] = useState(false)
    const [msg, setMsg] = useState('')
    const [error, setError] = useState('')

    const isEditing = !!editingBlog?.id

    // Load categories
    useEffect(() => {
        let cancel = false
        ;(async () => {
            try {
                const res = await axios.get('/api/blog-categories')
                if (!cancel) setCategories(res?.data?.categories || [])
            } catch {}
        })()
        return () => {
            cancel = true
        }
    }, [])

    // Hydrate khi sửa
    useEffect(() => {
        if (!editingBlog) return
        setTitle(editingBlog.title || '')
        setParagraphs(
            (editingBlog.paragraph || [])
                .slice()
                .sort((a, b) => (a.order ?? 0) - (b.order ?? 0))
                .map((p) => ({
                    type: p.type === 'image' ? 'image' : 'text',
                    text: p.text || '',
                    image_url: p.type === 'image' ? p.image_url || '' : null,
                    order: p.order ?? 0,
                }))
        )
        if (Array.isArray(editingBlog.tags)) {
            const tags = editingBlog.tags
                .map((t) => t?.tag?.name)
                .filter(Boolean)
                .join(', ')
            setTagsInput(tags)
        } else {
            setTagsInput('')
        }
    }, [editingBlog])

    // Map category name → id
    useEffect(() => {
        if (!editingBlog?.category?.name || !categories.length) return
        const found = categories.find((c) => c.name === editingBlog.category.name)
        if (found) setCategoryId(String(found.id))
    }, [categories, editingBlog])

    const cleanParagraphs = useMemo(
        () =>
            paragraphs.map((p, idx) => ({
                type: p.type === 'image' ? 'image' : 'text',
                text: p.text || '',
                image_url: p.type === 'image' ? p.image_url || '' : null,
                order: idx + 1,
            })),
        [paragraphs]
    )

    const categoryName = useMemo(() => {
        const c = categories.find((x) => String(x.id) === String(categoryId))
        return c?.name || ''
    }, [categories, categoryId])

    const tagList = useMemo(
        () =>
            tagsInput
                .split(',')
                .map((t) => t.trim())
                .filter(Boolean),
        [tagsInput]
    )

    const updateParagraph = (index, next) => {
        setParagraphs((prev) => {
            const copy = [...prev]
            copy[index] = next
            return copy
        })
    }

    const addParagraph = (type = 'text') => {
        setParagraphs((prev) => [
            ...prev,
            { type, text: '', image_url: '', order: prev.length + 1 },
        ])
    }

    const removeParagraph = (index) => {
        setParagraphs((prev) => prev.filter((_, i) => i !== index))
    }

    const moveUp = (index) => {
        if (index === 0) return
        setParagraphs((prev) => {
            const copy = [...prev]
            ;[copy[index - 1], copy[index]] = [copy[index], copy[index - 1]]
            return copy
        })
    }

    const moveDown = (index) => {
        setParagraphs((prev) => {
            if (index >= prev.length - 1) return prev
            const copy = [...prev]
            ;[copy[index + 1], copy[index]] = [copy[index], copy[index + 1]]
            return copy
        })
    }

    const onSubmit = async (e) => {
        e.preventDefault()
        setMsg('')
        setError('')

        if (!title.trim()) return setError('Vui lòng nhập tiêu đề')
        if (!categoryId) return setError('Vui lòng chọn danh mục')
        if (!cleanParagraphs.length) return setError('Vui lòng thêm tối thiểu 1 đoạn nội dung')

        setSaving(true)
        try {
            const payload = {
                title: title.trim(),
                category_id: Number(categoryId),
                tags: tagList,
                paragraphs: cleanParagraphs,
            }

            let res
            if (isEditing) {
                res = await axios.put(`/api/admin/blogs?id=${editingBlog.id}`, payload)
            } else {
                res = await axios.post('/api/admin/blogs', payload)
            }

            if (res.status >= 200 && res.status < 300 && res.data?.success) {
                setMsg(isEditing ? 'Cập nhật bài viết thành công' : 'Tạo bài viết thành công')
                onSaved?.()
            } else {
                setError(res?.data?.message || 'Không thể lưu bài viết')
            }
        } catch (e) {
            setError(e?.response?.data?.message || e?.message || 'Lỗi kết nối máy chủ')
        } finally {
            setSaving(false)
        }
    }

    return (
        <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
            {/* LEFT: Editor */}
            <section className="bg-white/90 rounded-2xl border shadow p-5">
                <div className="flex items-center justify-between mb-4">
                    <h2 className="text-xl font-semibold">
                        {isEditing ? 'Sửa bài viết' : 'Soạn bài viết'}
                    </h2>
                    {isEditing && (
                        <button
                            type="button"
                            onClick={onCancelEdit}
                            className="text-sm px-3 py-1.5 rounded border hover:bg-gray-50"
                        >
                            Huỷ sửa
                        </button>
                    )}
                </div>

                <form onSubmit={onSubmit} className="space-y-5">
                    <div>
                        <label className="block text-sm font-medium mb-1">Tiêu đề</label>
                        <input
                            className="w-full border rounded px-3 py-2"
                            value={title}
                            onChange={(e) => setTitle(e.target.value)}
                            placeholder="Tiêu đề bài viết"
                        />
                        <p className="text-xs text-gray-500 mt-1">
                            Slug:{' '}
                            <span className="font-mono">
                                {slugify(title) || '(tự sinh từ tiêu đề)'}
                            </span>
                        </p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                            <label className="block text-sm font-medium mb-1">Danh mục</label>
                            <select
                                className="w-full border rounded px-3 py-2"
                                value={categoryId}
                                onChange={(e) => setCategoryId(e.target.value)}
                            >
                                <option value="">-- Chọn danh mục --</option>
                                {categories.map((c) => (
                                    <option key={c.id} value={c.id}>
                                        {c.name}
                                    </option>
                                ))}
                            </select>
                        </div>

                        <div>
                            <label className="block text-sm font-medium mb-1">
                                Tag (phân tách bởi dấu phẩy)
                            </label>
                            <input
                                className="w-full border rounded px-3 py-2"
                                value={tagsInput}
                                onChange={(e) => setTagsInput(e.target.value)}
                                placeholder="nextjs, prisma, auth"
                            />
                            {tagList.length > 0 && (
                                <div className="mt-1 flex flex-wrap gap-2 text-xs">
                                    {tagList.map((t, i) => (
                                        <span
                                            key={i}
                                            className="px-2 py-0.5 bg-neutral-200 rounded"
                                        >
                                            {t}
                                        </span>
                                    ))}
                                </div>
                            )}
                        </div>
                    </div>

                    <div className="space-y-3">
                        <div className="flex items-center justify-between">
                            <h3 className="font-semibold">Nội dung</h3>
                            <div className="flex gap-2">
                                <button
                                    type="button"
                                    className="px-3 py-1.5 rounded border hover:bg-gray-50"
                                    onClick={() => addParagraph('text')}
                                >
                                    + Thêm đoạn văn
                                </button>
                                <button
                                    type="button"
                                    className="px-3 py-1.5 rounded border hover:bg-gray-50"
                                    onClick={() => addParagraph('image')}
                                >
                                    + Thêm hình ảnh
                                </button>
                            </div>
                        </div>

                        <div className="space-y-3">
                            {paragraphs.map((p, idx) => (
                                <ParagraphRow
                                    key={idx}
                                    item={{ ...p, order: idx + 1 }}
                                    index={idx}
                                    onChange={updateParagraph}
                                    onMoveUp={moveUp}
                                    onMoveDown={moveDown}
                                    onRemove={removeParagraph}
                                />
                            ))}
                        </div>
                    </div>

                    {(error || msg) && (
                        <p className={`text-sm ${error ? 'text-red-600' : 'text-green-600'}`}>
                            {error || msg}
                        </p>
                    )}

                    <div className="flex justify-end">
                        <button
                            type="submit"
                            disabled={saving}
                            className="px-4 py-2 rounded bg-gray-900 text-white font-medium hover:opacity-90 disabled:opacity-60"
                        >
                            {saving
                                ? 'Đang lưu…'
                                : isEditing
                                  ? 'Cập nhật bài viết'
                                  : 'Lưu bài viết'}
                        </button>
                    </div>
                </form>
            </section>

            {/* RIGHT: Preview */}
            <section className="bg-white/90 rounded-2xl border shadow max-h-[calc(100vh-7rem)] overflow-auto sticky top-8">
                <h2 className="text-xl font-semibold px-5 pt-5">Preview</h2>
                <BlogPreview
                    title={title}
                    createdAt={new Date().toISOString()}
                    authorName="Bạn (Admin)"
                    categoryName={categoryName}
                    paragraphs={cleanParagraphs}
                />
            </section>
        </div>
    )
}
