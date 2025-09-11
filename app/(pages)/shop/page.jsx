import ShopPageClient from './ShopPageClient'

export const metadata = {
    title: 'Cửa hàng | Boutique - Quần áo & Thời trang',
    description:
        'Khám phá bộ sưu tập quần áo và phụ kiện thời trang tại Boutique. Đa dạng mẫu mã, phong cách hiện đại, chất lượng cao.',
    keywords: [
        'Boutique',
        'shop quần áo',
        'cửa hàng thời trang',
        'phụ kiện thời trang',
        'mua sắm online',
    ],
    openGraph: {
        type: 'website',
        url: 'https://boutique.vn/shop',
        title: 'Cửa hàng | Boutique - Quần áo & Thời trang',
        description:
            'Khám phá bộ sưu tập quần áo và phụ kiện thời trang tại Boutique. Đa dạng mẫu mã, phong cách hiện đại, chất lượng cao.',
        siteName: 'Boutique',
        images: [
            {
                url: '/favicon.ico', 
                width: 1200,
                height: 630,
                alt: 'Cửa hàng thời trang Boutique',
            },
        ],
    },
    twitter: {
        card: 'summary_large_image',
        title: 'Cửa hàng | Boutique - Quần áo & Thời trang',
        description:
            'Khám phá bộ sưu tập quần áo và phụ kiện thời trang tại Boutique. Đa dạng mẫu mã, phong cách hiện đại, chất lượng cao.',
        images: ['/favicon.ico'],
    },
}

export default function ShopPage() {
    return <ShopPageClient />
}
