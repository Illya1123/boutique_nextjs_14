import FaqClient from './FaqClient'

export const metadata = {
    title: 'Câu hỏi thường gặp | Boutique - Thời trang & Phụ kiện',
    description:
        'Giải đáp nhanh các câu hỏi thường gặp về mua hàng, thanh toán, vận chuyển và đổi trả tại Boutique.',
    alternates: { canonical: '/faq' },
    openGraph: {
        type: 'website',
        url: 'https://boutique.vn/faq',
        title: 'Câu hỏi thường gặp | Boutique',
        description:
            'Giải đáp nhanh các câu hỏi thường gặp về mua hàng, thanh toán, vận chuyển và đổi trả tại Boutique.',
        siteName: 'Boutique',
        images: [{ url: '/favicon.ico', width: 1200, height: 630, alt: 'FAQ Boutique' }],
    },
    twitter: {
        card: 'summary_large_image',
        title: 'Câu hỏi thường gặp | Boutique',
        description: 'Giải đáp nhanh các câu hỏi thường gặp tại Boutique.',
        images: ['/favicon.ico'],
    },
    robots: {
        index: true,
        follow: true,
        googleBot: { index: true, follow: true, maxSnippet: -1, maxImagePreview: 'large' },
    },
}

export default function FaqPage() {
    return <FaqClient />
}
