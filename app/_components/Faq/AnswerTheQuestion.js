import { useState, useRef } from 'react'

function AnswerTheQuestion({ data }) {
    const [activeIndex, setActiveIndex] = useState(null)
    const contentRefs = useRef([])

    const toggleIndex = (index) => {
        setActiveIndex(activeIndex === index ? null : index)
    }

    return (
        <div className="space-y-4">
            {data.map((item, index) => (
                <div key={index} className="overflow-hidden bg-white shadow-md rounded-xl">
                    <button
                        onClick={() => toggleIndex(index)}
                        className="flex items-center justify-between w-full px-6 py-4 text-left focus:outline-none"
                    >
                        {/* Câu hỏi */}
                        <span className="text-lg font-medium text-blue-700">{item.question}</span>
                        <span className="text-2xl text-blue-500">
                            {activeIndex === index ? '-' : '+'}
                        </span>
                    </button>

                    <div
                        ref={(el) => (contentRefs.current[index] = el)}
                        style={{
                            height:
                                activeIndex === index
                                    ? contentRefs.current[index]?.scrollHeight + 'px'
                                    : '0px',
                        }}
                        className="px-6 overflow-hidden transition-[height] duration-300 ease-in-out"
                    >
                        {/* Câu trả lời */}
                        <p className="pb-4 text-gray-600">{item.answer}</p>
                    </div>
                </div>
            ))}
        </div>
    )
}

export default AnswerTheQuestion
