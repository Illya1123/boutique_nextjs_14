'use client'

import { useState } from 'react'
import ProductList from './ProductList'
import FilterSidebar from './FilterSidebar'

export default function SidebarFilter({ products }) {
    const [sexFilter, setSexFilter] = useState('')
    const [categoryFilter, setCategoryFilter] = useState('')
    const [minPrice, setMinPrice] = useState(0)
    const [maxPrice, setMaxPrice] = useState(2000000)

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

    const filtered = products.filter((p) => {
        const sexMatch = sexFilter ? p.sex === sexFilter : true
        const categoryMatch = categoryFilter ? p.category === categoryFilter : true
        const priceMatch = p.price >= minPrice && p.price <= maxPrice
        return sexMatch && categoryMatch && priceMatch
    })

    // Lấy danh sách giới tính duy nhất
    const sexes = Array.from(new Set(products.map((p) => p.sex)))

    // Lấy danh sách category duy nhất
    const categories = Array.from(new Set(products.map((p) => p.category)))

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
