'use client'

import { useEffect, useMemo, useState } from 'react'
import axios from 'axios'

// Utils
const slugify = (str = '') =>
  str
    .toString()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)+/g, '')

// Paragraph editor row
function ParagraphRow({ item, index, onChange, onMoveUp, onMoveDown, onRemove }) {
  const isText = item.type === 'text'
  return (
    <div className="rounded-xl border p-4 bg-white/80 flex flex-col gap-3">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <select
            className="border rounded px-2 py-1"
            value={item.type}
            onChange={(e) => onChange(index, { ...item, type: e.target.value })}
          >
            <option value="text">Đoạn văn (text)</option>
            <option value="image">Hình ảnh (image)</option>
          </select>
          <span className="text-xs text-gray-500">Thứ tự: {item.order}</span>
        </div>
        <div className="flex items-center gap-2">
          <button
            type="button"
            className="px-2 py-1 rounded border hover:bg-gray-50"
            onClick={() => onMoveUp(index)}
            disabled={index === 0}
            title="Lên"
          >
            ↑
          </button>
          <button
            type="button"
            className="px-2 py-1 rounded border hover:bg-gray-50"
            onClick={() => onMoveDown(index)}
            disabled={false}
            title="Xuống"
          >
            ↓
          </button>
          <button
            type="button"
            className="px-2 py-1 rounded border border-red-300 text-red-600 hover:bg-red-50"
            onClick={() => onRemove(index)}
            title="Xoá đoạn"
          >
            Xoá
          </button>
        </div>
      </div>

      {isText ? (
        <textarea
          className="w-full border rounded px-3 py-2 min-h-[96px]"
          placeholder="Nhập nội dung đoạn văn..."
          value={item.text}
          onChange={(e) => onChange(index, { ...item, text: e.target.value })}
        />
      ) : (
        <>
          <input
            type="url"
            className="w-full border rounded px-3 py-2"
            placeholder="https://example.com/image.jpg"
            value={item.image_url || ''}
            onChange={(e) => onChange(index, { ...item, image_url: e.target.value })}
          />
          <input
            type="text"
            className="w-full border rounded px-3 py-2"
            placeholder="Ghi chú/figcaption (tuỳ chọn)"
            value={item.text || ''}
            onChange={(e) => onChange(index, { ...item, text: e.target.value })}
          />
        </>
      )}
    </div>
  )
}

// Preview khớp với BlogDetailClient
function BlogPreview({ title, createdAt, authorName, categoryName, paragraphs }) {
  const words = useMemo(() => {
    return paragraphs
      .filter((p) => p.type === 'text' && typeof p.text === 'string')
      .map((p) => p.text.trim().split(/\s+/).length)
      .reduce((a, b) => a + b, 0)
  }, [paragraphs])

  const readMins = Math.max(1, Math.round(words / 200))
  const dateStr = createdAt
    ? new Date(createdAt).toLocaleDateString('vi-VN', {
        year: 'numeric',
        month: 'long',
        day: '2-digit',
      })
    : ''

  return (
    <div className="p-6">
      <header className="mb-6">
        <h1 className="text-2xl font-bold">{title || 'Tiêu đề bài viết'}</h1>
        <div className="flex flex-wrap items-center gap-2 mt-2 text-sm text-neutral-600">
          {authorName && <span>{authorName}</span>}
          {dateStr && <span>• {dateStr}</span>}
          <span>• {readMins} phút đọc</span>
          {categoryName && (
            <span className="rounded bg-neutral-200 px-2 py-0.5 text-xs">
              {categoryName}
            </span>
          )}
        </div>
      </header>

      <section className="prose max-w-none">
        {paragraphs.map((p, i) =>
          p.type === 'image' && p.image_url ? (
            <figure key={i} className="my-6">
              <img
                src={p.image_url}
                alt={p.text || 'blog image'}
                className="w-full h-auto rounded-xl"
                loading="lazy"
              />
              {p.text && (
                <figcaption className="mt-2 text-sm text-neutral-500">
                  {p.text}
                </figcaption>
              )}
            </figure>
          ) : (
            <p key={i} className="my-4 leading-7 text-[16.5px] text-neutral-800">
              {p.text || 'Nhập nội dung đoạn văn...'}
            </p>
          )
        )}
      </section>
    </div>
  )
}

export default function BlogsManager() {
  // form state
  const [title, setTitle] = useState('')
  const [categoryId, setCategoryId] = useState('')
  const [categories, setCategories] = useState([])
  const [tagsInput, setTagsInput] = useState('') // ví dụ: "nextjs, prisma, auth"
  const [paragraphs, setParagraphs] = useState([
    { type: 'text', text: '', order: 1 },
  ])

  const [saving, setSaving] = useState(false)
  const [msg, setMsg] = useState('')
  const [error, setError] = useState('')

  // tải category
  useEffect(() => {
    let cancel = false
    ;(async () => {
      try {
        const res = await axios.get('/api/blog-categories') // bạn cần có endpoint GET categories
        if (!cancel) setCategories(res?.data?.categories || [])
      } catch (e) {
        // fallback: để trống, hoặc hiển thị lỗi
      }
    })()
    return () => {
      cancel = true
    }
  }, [])

  // helpers
  const cleanParagraphs = useMemo(() => {
    return paragraphs
      .map((p, idx) => ({
        type: p.type === 'image' ? 'image' : 'text',
        text: p.text || '',
        image_url: p.type === 'image' ? (p.image_url || '') : null,
        order: idx + 1,
      }))
  }, [paragraphs])

  const categoryName = useMemo(() => {
    const c = categories.find((x) => String(x.id) === String(categoryId))
    return c?.name || ''
  }, [categories, categoryId])

  const tagList = useMemo(() => {
    return tagsInput
      .split(',')
      .map((t) => t.trim())
      .filter(Boolean)
  }, [tagsInput])

  // paragraph ops
  const updateParagraph = (index, next) => {
    setParagraphs((prev) => {
      const copy = [...prev]
      copy[index] = next
      return copy
    })
  }

  const addParagraph = (type = 'text') => {
    setParagraphs((prev) => [...prev, { type, text: '', image_url: '', order: prev.length + 1 }])
  }

  const removeParagraph = (index) => {
    setParagraphs((prev) => prev.filter((_, i) => i !== index))
  }

  const moveUp = (index) => {
    if (index === 0) return
    setParagraphs((prev) => {
      const copy = [...prev]
      const tmp = copy[index - 1]
      copy[index - 1] = copy[index]
      copy[index] = tmp
      return copy
    })
  }

  const moveDown = (index) => {
    setParagraphs((prev) => {
      if (index >= prev.length - 1) return prev
      const copy = [...prev]
      const tmp = copy[index + 1]
      copy[index + 1] = copy[index]
      copy[index] = tmp
      return copy
    })
  }

  const onSubmit = async (e) => {
    e.preventDefault()
    setMsg('')
    setError('')
    if (!title.trim()) {
      setError('Vui lòng nhập tiêu đề')
      return
    }
    if (!categoryId) {
      setError('Vui lòng chọn danh mục')
      return
    }
    if (!cleanParagraphs.length) {
      setError('Vui lòng thêm tối thiểu 1 đoạn nội dung')
      return
    }

    setSaving(true)
    try {
      const payload = {
        title: title.trim(),
        category_id: Number(categoryId),
        tags: tagList,
        paragraphs: cleanParagraphs,
      }
      const res = await axios.post('/api/admin/blogs', payload)
      if (res.status >= 200 && res.status < 300 && res.data?.success) {
        setMsg('Tạo bài viết thành công')
        // reset (tuỳ chọn)
        // setTitle(''); setCategoryId(''); setTagsInput(''); setParagraphs([{type:'text', text:'', order:1}])
      } else {
        setError(res?.data?.message || 'Không thể tạo bài viết')
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
        <h2 className="text-xl font-semibold mb-4">Soạn bài viết</h2>

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
              Slug: <span className="font-mono">{slugify(title) || '(tự sinh từ tiêu đề)'}</span>
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
                  <option key={c.id} value={c.id}>{c.name}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium mb-1">Tag (phân tách bởi dấu phẩy)</label>
              <input
                className="w-full border rounded px-3 py-2"
                value={tagsInput}
                onChange={(e) => setTagsInput(e.target.value)}
                placeholder="nextjs, prisma, auth"
              />
              {tagList.length > 0 && (
                <div className="mt-1 flex flex-wrap gap-2 text-xs">
                  {tagList.map((t, i) => (
                    <span key={i} className="px-2 py-0.5 bg-neutral-200 rounded">
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
              {saving ? 'Đang lưu…' : 'Lưu bài viết'}
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
