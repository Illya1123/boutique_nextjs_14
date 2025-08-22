'use client'
import AnswerTheQuestion from '../_components/AnswerTheQuestion'
import useFetchData from '@/hooks/useFetchData'

function Faq() {
    const { data: faqData, loading, error } = useFetchData('/data_faq.json')

    if (loading) {
        return <p className="text-center">Đang tải dữ liệu...</p>
    }

    if (error) {
        return <p className="text-center text-red-500">{error}</p>
    }

    return (
        <div className="min-h-screen bg-gray-50 py-16 px-4 md:px-20">
            <div className="max-w-4xl mx-auto">
                <h1 className="text-4xl font-bold text-center mb-12 text-gray-800">
                    Câu hỏi thường gặp
                </h1>

                <AnswerTheQuestion data={faqData} />
            </div>
        </div>
    )
}

export default Faq
