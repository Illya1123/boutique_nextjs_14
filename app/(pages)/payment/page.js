import PaymentClient from './PaymentClient'

export const metadata = {
    title: 'Thanh toán | Boutique thời trang',
    description:
        'Hoàn tất đơn hàng thời trang của bạn một cách an toàn. Xem tóm tắt giỏ hàng và chọn phương thức thanh toán phù hợp.',
    openGraph: {
        title: 'Thanh toán | Boutique thời trang',
        description:
            'Trang thanh toán an toàn cho đơn hàng thời trang: xem tóm tắt, phí và phương thức thanh toán.',
        url: 'https://boutique.com/payment',
        type: 'website',
        siteName: 'Boutique',
    },
    alternates: {
        canonical: 'https://boutique.com/payment',
    },
    robots: {
        index: false, // checkout/payment thường không cho index
        follow: false,
    },
    // icons: { icon: '/favicon.ico' },
}

export default function Page() {
    return <PaymentClient />
}
