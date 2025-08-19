'use client'
import { useState, useEffect } from 'react'
import { ChevronLeft, ChevronRight } from 'lucide-react'

export default function CategoriesSection() {
    const categories = [
        {
            id: 1,
            name: 'Áo Sơ Mi, Áo Khoác & Quần Jean Nam Nữ',
            image: 'https://plus.unsplash.com/premium_photo-1679056835084-7f21e64a3402?q=80&w=687&auto=format&fit=crop',
        },
        {
            id: 2,
            name: 'Túi Xách Thời Trang Cao Cấp',
            image: 'https://images.unsplash.com/photo-1594223274512-ad4803739b7c?q=80&w=757&auto=format&fit=crop',
        },
        {
            id: 3,
            name: 'Giày Dép & Sandal Nam Nữ',
            image: 'https://plus.unsplash.com/premium_photo-1664202526744-516d0dd22932?q=80&w=1470&auto=format&fit=crop',
        },
        {
            id: 4,
            name: 'Phụ Kiện Thời Trang & Trang Sức',
            image: 'https://images.unsplash.com/photo-1611243705491-71487c2ed137?q=80&w=687&auto=format&fit=crop',
        },
    ]

    const [index, setIndex] = useState(0)
    const [itemsPerView, setItemsPerView] = useState(4)

    useEffect(() => {
        const updateItems = () => {
            if (window.innerWidth < 640) {
                setItemsPerView(1) // mobile
            } else if (window.innerWidth < 1024) {
                setItemsPerView(2) // tablet
            } else {
                setItemsPerView(4) // desktop
            }
        }

        updateItems()
        window.addEventListener('resize', updateItems)
        return () => window.removeEventListener('resize', updateItems)
    }, [])

    const prev = () => setIndex((prev) => (prev - 1 + categories.length) % categories.length)
    const next = () => setIndex((prev) => (prev + 1) % categories.length)

    const visible = Array.from({ length: itemsPerView }, (_, i) => {
        const pos = (index + i) % categories.length
        return categories[pos]
    })

    return (
        <section className="py-20 bg-gray-50 relative overflow-hidden">
            <h2 className="text-3xl font-semibold text-center mb-12 tracking-wide uppercase">
                Product Catalog
            </h2>

            <div className="relative max-w-6xl mx-auto">
                <button
                    onClick={prev}
                    className="absolute left-0 top-1/2 -translate-y-1/2 z-10 p-2 bg-white rounded-full shadow hover:bg-gray-100"
                >
                    <ChevronLeft className="w-6 h-6" />
                </button>

                <div className="flex gap-6 justify-center transition-all duration-500">
                    {visible.map((category) => (
                        <div
                            key={category.id}
                            className="relative w-64 h-80 rounded-2xl overflow-hidden shadow-md"
                        >
                            <img
                                src={category.image}
                                alt={category.name}
                                className="w-full h-full object-cover"
                            />
                            <div className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 hover:opacity-100 transition">
                                <h3 className="text-lg font-semibold text-white text-center px-4">
                                    {category.name}
                                </h3>
                            </div>
                        </div>
                    ))}
                </div>

                <button
                    onClick={next}
                    className="absolute right-0 top-1/2 -translate-y-1/2 z-10 p-2 bg-white rounded-full shadow hover:bg-gray-100"
                >
                    <ChevronRight className="w-6 h-6" />
                </button>
            </div>
        </section>
    )
}
