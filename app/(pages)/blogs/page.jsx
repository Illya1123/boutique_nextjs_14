import BlogsClient from './BlogsClient'

export const metadata = {
    title: 'Blog thời trang | Boutique',
    description:
        'Góc chia sẻ xu hướng thời trang, mix & match, mẹo bảo quản quần áo và tin tức từ Boutique.',
    alternates: { canonical: '/blogs' },
    robots: {
        index: true,
        follow: true,
        googleBot: { index: true, follow: true, maxSnippet: -1, maxImagePreview: 'large' },
    },
    openGraph: {
        type: 'website',
        url: 'https://boutique.vn/blogs',
        title: 'Blog thời trang | Boutique',
        description: 'Xu hướng mới nhất, mẹo phối đồ và tin tức thời trang từ Boutique.',
        siteName: 'Boutique',
        images: [
            {
                url: '/favicon.ico',
                width: 1200,
                height: 630,
                alt: 'Blog thời trang Boutique',
            },
        ],
    },
    twitter: {
        card: 'summary_large_image',
        title: 'Blog thời trang | Boutique',
        description: 'Cập nhật xu hướng, mẹo phối đồ và tin tức thời trang từ Boutique.',
        images: ['/favicon.ico'],
    },
}

export default function BlogsPage() {
    return <BlogsClient />
}
