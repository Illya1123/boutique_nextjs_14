'use client'

import { useMemo } from 'react'

export default function BlogPreview({ title, createdAt, authorName, categoryName, paragraphs }) {
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
