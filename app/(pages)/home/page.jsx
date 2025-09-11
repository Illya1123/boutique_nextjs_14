import HeroSection from './sections/HeroSection'
import FeaturesSection from './sections/FeaturesSection'
import ProductsSection from './sections/ProductsSection'
import ContactSection from './sections/ContactSection'

export const metadata = {
    title: 'Boutique - Cửa hàng quần áo & thời trang',
    description:
        'Boutique - cửa hàng quần áo & phụ kiện thời trang hiện đại. Khám phá bộ sưu tập mới nhất, chất lượng cao, đa dạng phong cách cho bạn tự tin tỏa sáng.',
    keywords: [
        'Boutique',
        'cửa hàng thời trang',
        'quần áo nữ',
        'quần áo nam',
        'phụ kiện thời trang',
        'shop quần áo',
        'mua sắm online',
    ],
    openGraph: {
        type: 'website',
        url: 'https://boutique.vn',
        title: 'Boutique - Cửa hàng quần áo & thời trang',
        description:
            'Boutique - cửa hàng quần áo & phụ kiện thời trang hiện đại. Khám phá bộ sưu tập mới nhất, chất lượng cao, đa dạng phong cách cho bạn tự tin tỏa sáng.',
        siteName: 'Boutique',
        images: [
            {
                url: '/favicon.ico',
                width: 1200,
                height: 630,
                alt: 'Boutique Fashion Store',
            },
        ],
    },
    twitter: {
        card: 'summary_large_image',
        title: 'Boutique - Cửa hàng quần áo & thời trang',
        description:
            'Khám phá bộ sưu tập quần áo và phụ kiện thời trang tại Boutique. Thời trang hiện đại, chất lượng cao.',
        images: ['/favicon.ico'],
    },
}

export default function HomePage() {
    return (
        <main>
            <HeroSection />
            <ProductsSection />
            <FeaturesSection />
            <ContactSection />
        </main>
    )
}
