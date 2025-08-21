'use client'
import { useEffect, useState } from 'react'
import { ArrowUp } from 'lucide-react'

export default function ScrollToTopButton() {
    const [isVisible, setIsVisible] = useState(false)

    // Hiện nút khi cuộn xuống một đoạn
    useEffect(() => {
        const toggleVisibility = () => {
            if (window.scrollY > 300) {
                setIsVisible(true)
            } else {
                setIsVisible(false)
            }
        }

        window.addEventListener('scroll', toggleVisibility)
        return () => window.removeEventListener('scroll', toggleVisibility)
    }, [])

    const scrollToTop = () => {
        window.scrollTo({
            top: 0,
            behavior: 'smooth',
        })
    }

    return (
        isVisible && (
            <button
                onClick={scrollToTop}
                className="fixed bottom-10 right-10 p-3 rounded-full bg-indigo-600 text-white shadow-lg hover:bg-indigo-700 transition"
            >
                <ArrowUp size={24} />
            </button>
        )
    )
}
