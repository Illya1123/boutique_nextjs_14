'use client'

import React from 'react'
import CategoryCarousel from '@/app/_components/CategoryCarousel'

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

    return (
        <section className="py-20 bg-gray-50">
            <h2 className="text-3xl font-semibold text-center mb-12 tracking-wide uppercase">
                Product Catalog
            </h2>

            <div className="max-w-6xl mx-auto">
                <CategoryCarousel categories={categories} />
            </div>
        </section>
    )
}
