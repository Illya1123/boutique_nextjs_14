'use client'

import { useEffect, useState } from 'react'
import axios from 'axios'
import Link from 'next/link'
import Script from 'next/script'
import { slugify } from '@/app/_utils/slugify'

const PLACEHOLDER = '/images/placeholder.jpg'

/** Lấy ảnh cover: ảnh đầu tiên theo order, text làm alt */
const getCoverFromParagraphs = (paragraphs) => {
    if (!Array.isArray(paragraphs) || paragraphs.length === 0) return { src: null, alt: '' }
    const firstImage = [...paragraphs]
        .filter((p) => p?.type === 'image' && p?.image_url)
        .sort((a, b) => (a.order ?? 0) - (b.order ?? 0))[0]
    return firstImage
        ? { src: firstImage.image_url, alt: firstImage.text || '' }
        : { src: null, alt: '' }
}

const formatDate = (iso) => {
    try {
        const d = new Date(iso)
        return d.toLocaleDateString('vi-VN', { day: '2-digit', month: '2-digit', year: 'numeric' })
    } catch {
        return iso
    }
}

export default function BlogsClient() {
    const [blogs, setBlogs] = useState(null)
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState(null)

    useEffect(() => {
        const API_BASE = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000'
        const fetchBlogs = async () => {
            try {
                setLoading(true)
                const res = await axios.get(`${API_BASE}/api/blogs`, {
                    headers: { 'Cache-Control': 'no-store' },
                })
                if (!res.data?.success) throw new Error('API returned success=false')
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

    if (loading) return <div className="p-6">Đang tải...</div>
    if (error) return <div className="p-6 text-red-600">{error}</div>
    if (!blogs || blogs.length === 0) return <div className="p-6">Chưa có bài viết nào</div>

    const featured = blogs[0]
    const rest = blogs.slice(1)

    const featuredCover = getCoverFromParagraphs(featured.paragraph)
    const featuredSlug = slugify(featured.title)

    // JSON-LD: Blog + ItemList + Breadcrumb
    const listItems = blogs.map((b, idx) => ({
        '@type': 'ListItem',
        position: idx + 1,
        url: `https://boutique.vn/blogs/${slugify(b.title)}?id=${b.id}`,
        name: b.title,
    }))

    const blogLd = {
        '@context': 'https://schema.org',
        '@type': 'Blog',
        name: 'Blog thời trang Boutique',
        url: 'https://boutique.vn/blogs',
        inLanguage: 'vi',
        blogPost: blogs.slice(0, 10).map((b) => {
            const cover = getCoverFromParagraphs(b.paragraph)
            return {
                '@type': 'BlogPosting',
                headline: b.title,
                author: b.author?.name || 'Boutique',
                datePublished: b.createdAt,
                dateModified: b.updatedAt || b.createdAt,
                image: cover.src || undefined,
                mainEntityOfPage: `https://boutique.vn/blogs/${slugify(b.title)}?id=${b.id}`,
            }
        }),
    }

    const itemListLd = {
        '@context': 'https://schema.org',
        '@type': 'ItemList',
        itemListElement: listItems,
    }

    const breadcrumbLd = {
        '@context': 'https://schema.org',
        '@type': 'BreadcrumbList',
        itemListElement: [
            { '@type': 'ListItem', position: 1, name: 'Trang chủ', item: 'https://boutique.vn' },
            { '@type': 'ListItem', position: 2, name: 'Blog', item: 'https://boutique.vn/blogs' },
        ],
    }

    return (
        <section className="max-w-6xl px-4 mx-auto mt-20 mb-20">
            {/* Breadcrumb ẩn cho a11y */}
            <nav aria-label="Breadcrumb" className="sr-only">
                <ol>
                    <li>
                        <a href="/">Trang chủ</a>
                    </li>
                    <li aria-current="page">Blog</li>
                </ol>
            </nav>

            {/* Featured */}
            <Link
                href={`/blogs/${featuredSlug}?id=${featured.id}`}
                className="relative block mb-16 overflow-hidden shadow-lg rounded-2xl"
            >
                <img
                    src={featuredCover.src || PLACEHOLDER}
                    alt={featuredCover.alt || featured.title}
                    className="w-full h-[400px] object-cover"
                    loading="eager"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                <div className="absolute max-w-xl text-white bottom-8 left-8">
                    <h2 className="mb-2 text-2xl font-semibold md:text-3xl">{featured.title}</h2>
                    <div className="flex items-center gap-4 text-sm text-gray-200">
                        <span>{featured.author?.name || 'Boutique'}</span>
                        <span>{formatDate(featured.createdAt)}</span>
                    </div>
                </div>
            </Link>

            {/* Rest */}
            <section className="grid gap-8 md:grid-cols-3">
                {rest.map((blog) => {
                    const cover = getCoverFromParagraphs(blog.paragraph)
                    const slug = slugify(blog.title)
                    return (
                        <Link
                            key={blog.id}
                            href={`/blogs/${slug}?id=${blog.id}`}
                            className="overflow-hidden transition bg-white shadow-md rounded-xl hover:shadow-lg"
                        >
                            <img
                                src={cover.src || PLACEHOLDER}
                                alt={cover.alt || blog.title}
                                className="object-cover w-full h-48"
                                loading="lazy"
                            />
                            <div className="p-5">
                                {blog.category?.name && (
                                    <span className="text-xs font-semibold text-indigo-600 uppercase">
                                        {blog.category.name}
                                    </span>
                                )}
                                <h3 className="mt-2 text-lg font-semibold">{blog.title}</h3>
                                <div className="flex items-center gap-3 mt-3 text-sm text-gray-500">
                                    <span>{blog.author?.name || 'Boutique'}</span>
                                    <span>{formatDate(blog.createdAt)}</span>
                                </div>
                            </div>
                        </Link>
                    )
                })}
            </section>

            {blogs.length > 0 && (
                <>
                    <Script id="ld-blog" type="application/ld+json">
                        {JSON.stringify(blogLd)}
                    </Script>
                    <Script id="ld-itemlist" type="application/ld+json">
                        {JSON.stringify(itemListLd)}
                    </Script>
                    <Script id="ld-breadcrumb" type="application/ld+json">
                        {JSON.stringify(breadcrumbLd)}
                    </Script>
                </>
            )}
        </section>
    )
}
