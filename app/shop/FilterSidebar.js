'use client'

export default function FilterSidebar({
    sexes = [],
    categories = [],
    sexFilter,
    setSexFilter,
    categoryFilter,
    setCategoryFilter,
    minPrice,
    maxPrice,
    handleMinChange,
    handleMaxChange,
}) {
    return (
        <aside className="w-72 border-r p-6 bg-white shadow-sm sticky top-0 h-screen">
            <h2 className="text-lg font-bold mb-4 text-gray-800">Bộ lọc</h2>

            {/* Giới tính */}
            <div className="mb-6">
                <h3 className="font-semibold mb-2">Giới tính</h3>
                <nav className="space-y-3">
                    <button
                        onClick={() => setSexFilter('')}
                        className={`w-full text-left px-3 py-2 rounded-lg transition ${
                            sexFilter === ''
                                ? 'bg-blue-600 text-white font-semibold shadow'
                                : 'hover:bg-blue-100 text-gray-700'
                        }`}
                    >
                        Tất cả
                    </button>
                    {sexes.map((s) => (
                        <button
                            key={s}
                            onClick={() => setSexFilter(s)}
                            className={`w-full text-left px-3 py-2 rounded-lg transition ${
                                sexFilter === s
                                    ? 'bg-blue-600 text-white font-semibold shadow'
                                    : 'hover:bg-blue-100 text-gray-700'
                            }`}
                        >
                            {s}
                        </button>
                    ))}
                </nav>
            </div>

            {/* Category */}
            <div className="mb-6">
                <h3 className="font-semibold mb-2">Danh mục</h3>
                <nav className="space-y-3">
                    <button
                        onClick={() => setCategoryFilter('')}
                        className={`w-full text-left px-3 py-2 rounded-lg transition ${
                            categoryFilter === ''
                                ? 'bg-blue-600 text-white font-semibold shadow'
                                : 'hover:bg-blue-100 text-gray-700'
                        }`}
                    >
                        Tất cả
                    </button>
                    {categories.map((cat) => (
                        <button
                            key={cat}
                            onClick={() => setCategoryFilter(cat)}
                            className={`w-full text-left px-3 py-2 rounded-lg transition ${
                                categoryFilter === cat
                                    ? 'bg-blue-600 text-white font-semibold shadow'
                                    : 'hover:bg-blue-100 text-gray-700'
                            }`}
                        >
                            {cat}
                        </button>
                    ))}
                </nav>
            </div>

            {/* Giá */}
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
    )
}
