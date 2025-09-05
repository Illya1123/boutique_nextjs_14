'use client'

import { useEffect, useState } from 'react'
import axios from 'axios'

// Lấy ảnh cover từ paragraph có order = 1 và type = image
const getCoverFromParagraphs = (paragraphs) => {
    if (!paragraphs) return null
    const img = paragraphs.find((p) => p.type === 'image' && p.order === 1 && p.image_url)
    return img?.image_url || null
}

const formatDate = (iso) => {
    try {
        const d = new Date(iso)
        return d.toLocaleDateString('en-US', {
            month: 'short',
            day: 'numeric',
            year: 'numeric',
        })
    } catch {
        return iso
    }
}

export default function Blogs() {
    const [blogs, setBlogs] = useState(null)
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState(null)

    useEffect(() => {
        const API_BASE = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000'

        const fetchBlogs = async () => {
            try {
                setLoading(true)
                setError(null)
                const res = await axios.get(`${API_BASE}/api/blogs`, {
                    headers: { 'Cache-Control': 'no-store' },
                })
                if (!res.data.success) throw new Error('API returned success=false')
                setBlogs(res.data.blogs || [])
            } catch (e) {
                setError(e?.message || 'Failed to load blogs')
                setBlogs([])
            } finally {
                setLoading(false)
            }
        }

        fetchBlogs()
    }, [])

    if (loading) {
        return (
            <section className="max-w-6xl px-4 mx-auto mt-20 mb-20 animate-pulse">
                <header className="mb-12 text-center">
                    <div className="w-40 h-4 mx-auto bg-gray-200 rounded" />
                    <div className="h-8 mx-auto mt-3 bg-gray-200 rounded w-72" />
                    <div className="h-4 mx-auto mt-4 bg-gray-200 rounded w-80" />
                </header>
                <div className="relative mb-16 overflow-hidden shadow-lg rounded-2xl h-[400px] bg-gray-200" />
                <section className="grid gap-8 md:grid-cols-3">
                    {Array.from({ length: 3 }).map((_, i) => (
                        <div key={i} className="bg-gray-200 h-72 rounded-xl" />
                    ))}
                </section>
            </section>
        )
    }

    if (error) {
        return (
            <section className="max-w-3xl px-4 mx-auto mt-20 mb-20">
                <div className="p-6 text-red-700 border border-red-200 rounded-xl bg-red-50">
                    <p className="font-semibold">Không tải được blog.</p>
                    <p className="mt-1 text-sm">Lỗi: {error}</p>
                </div>
            </section>
        )
    }

    if (!blogs || blogs.length === 0) {
        return (
            <section className="max-w-3xl px-4 mx-auto mt-20 mb-20">
                <div className="p-6 text-gray-700 border border-gray-200 rounded-xl bg-gray-50">
                    Chưa có bài viết nào.
                </div>
            </section>
        )
    }

    const featured = blogs[0]
    const rest = blogs.slice(1)
    const featuredCover = getCoverFromParagraphs(featured.paragraph) || '/images/placeholder.jpg'

    return (
        <section className="max-w-6xl px-4 mx-auto mt-20 mb-20">
            <header className="mb-12 text-center">
                <h4 className="mb-2 text-sm font-semibold text-indigo-600">Read Our Blog</h4>
                <h1 className="text-4xl font-light md:text-6xl font-cormorantGaramond">
                    Browse Our Resources
                </h1>
                <p className="mt-4 text-gray-500">
                    We provide tips and resources from industry leaders. For real.
                </p>
            </header>

            <div className="relative mb-16 overflow-hidden shadow-lg rounded-2xl">
                <img
                    src={featuredCover}
                    alt={featured.title}
                    className="w-full h-[400px] object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                <div className="absolute max-w-xl text-white bottom-8 left-8">
                    <h2 className="mb-2 text-2xl font-semibold md:text-3xl">{featured.title}</h2>
                    <div className="flex items-center gap-4 text-sm text-gray-200">
                        <span>{featured.author?.name || 'Unknown Author'}</span>
                        <span>{formatDate(featured.createdAt)}</span>
                    </div>
                    <div className="flex flex-wrap gap-2 mt-3">
                        {featured.category?.name && (
                            <span className="px-3 py-1 text-xs rounded-full bg-white/20">
                                {featured.category.name}
                            </span>
                        )}
                    </div>
                </div>
            </div>

            <section className="grid gap-8 md:grid-cols-3">
                {rest.map((blog) => {
                    const cover =
                        getCoverFromParagraphs(blog.paragraph) || '/images/placeholder.jpg'
                    return (
                        <article
                            key={blog.id}
                            className="overflow-hidden transition bg-white shadow-md rounded-xl hover:shadow-lg"
                        >
                            <img
                                src={cover}
                                alt={blog.title}
                                className="object-cover w-full h-48"
                            />
                            <div className="p-5">
                                {blog.category?.name && (
                                    <span className="text-xs font-semibold text-indigo-600 uppercase">
                                        {blog.category.name}
                                    </span>
                                )}
                                <h3 className="mt-2 text-lg font-semibold">{blog.title}</h3>
                                <div className="flex items-center gap-3 mt-3 text-sm text-gray-500">
                                    <span>{blog.author?.name || 'Unknown Author'}</span>
                                    <span>{formatDate(blog.createdAt)}</span>
                                </div>
                            </div>
                        </article>
                    )
                })}
            </section>
        </section>
    )
}
