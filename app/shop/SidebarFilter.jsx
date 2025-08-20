'use client'

import { useState } from 'react'
import ProductList from './ProductList'

export default function SidebarFilter({ products }) {
    const [filter, setFilter] = useState('')
    const [minPrice, setMinPrice] = useState(0)
    const [maxPrice, setMaxPrice] = useState(2000000)

    const handleMinChange = (e) => {
        const value = Number(e.target.value)
        setMinPrice(value)
        if (value > maxPrice) {
            setMaxPrice(value) // giữ max >= min
        }
    }

    const handleMaxChange = (e) => {
        const value = Number(e.target.value)
        setMaxPrice(value)
        if (value < minPrice) {
            setMinPrice(value) // giữ min <= max
        }
    }

    const filtered = products.filter((p) => {
        const inCategory = filter ? p.category.toLowerCase() === filter.toLowerCase() : true
        const inPriceRange = p.price >= minPrice && p.price <= maxPrice
        return inCategory && inPriceRange
    })

    return (
        <section className="flex w-full bg-gray-50 min-h-screen">
            {/* Sidebar */}
            <aside className="w-72 border-r p-6 bg-white shadow-sm sticky top-0 h-screen">
                <h2 className="text-lg font-bold mb-4 text-gray-800">Bộ lọc</h2>

                {/* Lọc theo danh mục */}
                <div className="mb-6">
                    <h3 className="font-semibold mb-2">Danh mục</h3>
                    <nav className="space-y-3">
                        {[
                            { label: 'Tất cả', value: '' },
                            { label: 'Nam', value: 'men' },
                            { label: 'Nữ', value: 'women' },
                        ].map((item) => (
                            <button
                                key={item.value}
                                onClick={() => setFilter(item.value)}
                                className={`w-full text-left px-3 py-2 rounded-lg transition ${
                                    filter === item.value
                                        ? 'bg-blue-600 text-white font-semibold shadow'
                                        : 'hover:bg-blue-100 text-gray-700'
                                }`}
                            >
                                {item.label}
                            </button>
                        ))}
                    </nav>
                </div>

                <div>
                    <h3 className="font-semibold mb-2">Khoảng giá</h3>
                    <div className="space-y-4">
                        <div>
                            <label className="block text-sm text-gray-600">
                                Giá tối thiểu: {minPrice.toLocaleString()}đ
                            </label>
                            <input
                                type="range"
                                min="0"
                                max="2000000"
                                step="50000"
                                value={minPrice}
                                onChange={handleMinChange}
                                className="w-full accent-blue-600"
                            />
                        </div>
                        <div>
                            <label className="block text-sm text-gray-600">
                                Giá tối đa: {maxPrice.toLocaleString()}đ
                            </label>
                            <input
                                type="range"
                                min="0"
                                max="2000000"
                                step="50000"
                                value={maxPrice}
                                onChange={handleMaxChange}
                                className="w-full accent-blue-600"
                            />
                        </div>
                    </div>
                </div>
            </aside>

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
