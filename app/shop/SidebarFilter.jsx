'use client'

import { useState } from 'react'
import ProductList from './ProductList'
import FilterSidebar from './FilterSidebar'

export default function SidebarFilter({ products = [] }) {
    const [sexFilter, setSexFilter] = useState('')
    const [categoryFilter, setCategoryFilter] = useState('')
    const [minPrice, setMinPrice] = useState(0)
    const [maxPrice, setMaxPrice] = useState(2000000)

    // Hàm detect giới tính từ tên sản phẩm
    const detectSex = (name) => {
        const maleKeywords = ['nam', 'men', 'man']
        const femaleKeywords = ['nữ', 'women', 'woman', 'lady', 'girl']

        const lowerName = name.toLowerCase()
        if (maleKeywords.some((kw) => lowerName.includes(kw))) return 'Nam'
        if (femaleKeywords.some((kw) => lowerName.includes(kw))) return 'Nữ'
        return null
    }

    const handleMinChange = (e) => {
        const value = Number(e.target.value)
        setMinPrice(value)
        if (value > maxPrice) setMaxPrice(value)
    }

    const handleMaxChange = (e) => {
        const value = Number(e.target.value)
        setMaxPrice(value)
        if (value < minPrice) setMinPrice(value)
    }

    // Lọc sản phẩm
    const filtered = products.filter((p) => {
        const sex = detectSex(p.name)
        const sexMatch = sexFilter ? sex === sexFilter : true
        const categoryMatch = categoryFilter ? p.category?.name === categoryFilter : true
        const price = parseInt(p.price)
        const priceMatch = price >= minPrice && price <= maxPrice
        return sexMatch && categoryMatch && priceMatch
    })

    // Danh sách giới tính duy nhất
    const sexes = Array.from(new Set(products.map((p) => detectSex(p.name)).filter(Boolean)))

    // Danh sách category duy nhất
    const categories = Array.from(new Set(products.map((p) => p.category?.name).filter(Boolean)))

    return (
        <section className="flex w-full bg-gray-50 min-h-screen">
            <FilterSidebar
                sexes={sexes}
                categories={categories}
                sexFilter={sexFilter}
                setSexFilter={setSexFilter}
                categoryFilter={categoryFilter}
                setCategoryFilter={setCategoryFilter}
                minPrice={minPrice}
                maxPrice={maxPrice}
                handleMinChange={handleMinChange}
                handleMaxChange={handleMaxChange}
            />

            <main className="flex-1 p-6">
                {filtered.length === 0 ? (
                    <p className="text-gray-500 italic">Không có sản phẩm nào.</p>
                ) : (
                    <ProductList products={filtered} />
                )}
            </main>
        </section>
    )
}
