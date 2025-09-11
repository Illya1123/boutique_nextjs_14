'use client'

import Script from 'next/script'
import AnswerTheQuestion from '@/app/_components/Faq/AnswerTheQuestion'
import { useFetchData } from '@/hooks/useFetchData'

export default function FaqClient() {
    const { data: faqData, loading, error } = useFetchData('/data_faq.json')

    if (loading) return <p className="text-center">Đang tải dữ liệu...</p>
    if (error) return <p className="text-center text-red-500">{error}</p>

    const faqLd = {
        '@context': 'https://schema.org',
        '@type': 'FAQPage',
        mainEntity: (faqData || []).map((item) => ({
            '@type': 'Question',
            name: item.question,
            acceptedAnswer: {
                '@type': 'Answer',
                text: item.answer,
            },
        })),
    }

    const breadcrumbLd = {
        '@context': 'https://schema.org',
        '@type': 'BreadcrumbList',
        itemListElement: [
            { '@type': 'ListItem', position: 1, name: 'Trang chủ', item: 'https://boutique.vn' },
            {
                '@type': 'ListItem',
                position: 2,
                name: 'Câu hỏi thường gặp',
                item: 'https://boutique.vn/faq',
            },
        ],
    }

    return (
        <div className="min-h-screen px-4 py-16 bg-gray-50 md:px-20">
            {/* Breadcrumb hiển thị (hữu ích cho a11y) */}
            <nav aria-label="Breadcrumb" className="sr-only">
                <ol>
                    <li>
                        <a href="/">Trang chủ</a>
                    </li>
                    <li aria-current="page">Câu hỏi thường gặp</li>
                </ol>
            </nav>

            <div className="max-w-4xl mx-auto">
                <h1 className="mb-12 text-4xl font-bold text-center text-gray-800">
                    Câu hỏi thường gặp
                </h1>

                <AnswerTheQuestion data={faqData} />
            </div>

            {/* JSON-LD: FAQ + Breadcrumb */}
            {Array.isArray(faqData) && faqData.length > 0 && (
                <Script id="ld-faq" type="application/ld+json">
                    {JSON.stringify(faqLd)}
                </Script>
            )}
            <Script id="ld-breadcrumb" type="application/ld+json">
                {JSON.stringify(breadcrumbLd)}
            </Script>
        </div>
    )
}
