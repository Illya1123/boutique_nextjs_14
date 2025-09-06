'use client'
import AnswerTheQuestion from '@/app/_components/Faq/AnswerTheQuestion'
import { useFetchData } from '@/hooks/useFetchData'

function Faq() {
    const { data: faqData, loading, error } = useFetchData('/data_faq.json')

    if (loading) {
        return <p className="text-center">Đang tải dữ liệu...</p>
    }

    if (error) {
        return <p className="text-center text-red-500">{error}</p>
    }

    return (
        <div className="min-h-screen px-4 py-16 bg-gray-50 md:px-20">
            <div className="max-w-4xl mx-auto">
                <h1 className="mb-12 text-4xl font-bold text-center text-gray-800">
                    Câu hỏi thường gặp
                </h1>

                <AnswerTheQuestion data={faqData} />
            </div>
        </div>
    )
}

export default Faq
