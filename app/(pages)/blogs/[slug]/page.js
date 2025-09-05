// app/blogs/[slug]/page.js
import axios from 'axios'
import BlogDetailClient from './BlogDetailClient'

export async function generateMetadata({ params, searchParams }) {
    const base = process.env.NEXT_PUBLIC_SITE_URL ?? 'http://localhost:3000'
    const id = searchParams?.id
    const slug = params?.slug

    // ƯU TIÊN ID để lấy metadata chính xác
    const query = id ? `id=${encodeURIComponent(id)}` : `slug=${encodeURIComponent(slug ?? '')}`

    try {
        const res = await axios.get(`${base}/api/blogs?${query}`)
        const blog = res.data?.blog

        if (!blog) {
            return { title: 'Bài viết không tồn tại', description: 'Không tìm thấy bài viết' }
        }

        const firstText =
            blog.paragraph?.find((p) => p.type === 'text')?.text?.slice(0, 160) ??
            'Chi tiết bài viết'

        return {
            title: blog.title ?? 'Bài viết',
            description: firstText,
            openGraph: {
                title: blog.title ?? 'Bài viết',
                description: firstText,
                type: 'article',
                images: blog.paragraph?.find((p) => p.type === 'image' && p.image_url)?.image_url
                    ? [blog.paragraph.find((p) => p.type === 'image' && p.image_url).image_url]
                    : ['/default-og.png'],
            },
        }
    } catch {
        return { title: 'Bài viết', description: 'Chi tiết bài viết' }
    }
}

export default function BlogPage({ params, searchParams }) {
    return <BlogDetailClient slug={params?.slug ?? null} id={searchParams?.id ?? null} />
}
