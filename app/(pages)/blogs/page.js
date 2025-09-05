'use client'

import { useEffect, useState } from 'react'
import axios from 'axios'
import Link from 'next/link'
import { slugify } from '@/app/_utils/slugify'

const getCoverFromParagraphs = (paragraphs) => {
  if (!paragraphs) return null
  const img = paragraphs.find((p) => p.type === 'image' && p.order === 1 && p.image_url)
  return img?.image_url || null
}

const formatDate = (iso) => {
  try {
    const d = new Date(iso)
    return d.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })
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

  if (loading) return <div className="p-6">Đang tải...</div>
  if (error) return <div className="p-6 text-red-600">{error}</div>
  if (!blogs || blogs.length === 0) return <div className="p-6">Chưa có bài viết nào</div>

  const featured = blogs[0]
  const rest = blogs.slice(1)
  const featuredCover = getCoverFromParagraphs(featured.paragraph) || '/images/placeholder.jpg'
  const featuredSlug = slugify(featured.title)

  return (
    <section className="max-w-6xl px-4 mx-auto mt-20 mb-20">
      {/* Featured */}
      <Link
        href={`/blogs/${featuredSlug}?id=${featured.id}`}
        className="relative block mb-16 overflow-hidden shadow-lg rounded-2xl"
      >
        <img src={featuredCover} alt={featured.title} className="w-full h-[400px] object-cover" />
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
        <div className="absolute max-w-xl text-white bottom-8 left-8">
          <h2 className="mb-2 text-2xl font-semibold md:text-3xl">{featured.title}</h2>
          <div className="flex items-center gap-4 text-sm text-gray-200">
            <span>{featured.author?.name || 'Unknown Author'}</span>
            <span>{formatDate(featured.createdAt)}</span>
          </div>
        </div>
      </Link>

      {/* Rest */}
      <section className="grid gap-8 md:grid-cols-3">
        {rest.map((blog) => {
          const cover = getCoverFromParagraphs(blog.paragraph) || '/images/placeholder.jpg'
          const slug = slugify(blog.title)
          return (
            <Link
              key={blog.id}
              href={`/blogs/${slug}?id=${blog.id}`}
              className="overflow-hidden transition bg-white shadow-md rounded-xl hover:shadow-lg"
            >
              <img src={cover} alt={blog.title} className="object-cover w-full h-48" />
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
            </Link>
          )
        })}
      </section>
    </section>
  )
}
