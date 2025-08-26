'use client'
function BasicInfoProduct({newProduct, setNewProduct, categories}) {
    return (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
            <input
                type="text"
                placeholder="Name"
                className="border p-2 rounded w-full"
                value={newProduct.name}
                onChange={(e) => setNewProduct({ ...newProduct, name: e.target.value })}
            />
            <input
                type="text"
                placeholder="Description"
                className="border p-2 rounded w-full"
                value={newProduct.description}
                onChange={(e) => setNewProduct({ ...newProduct, description: e.target.value })}
            />
            <input
                type="number"
                placeholder="Price"
                className="border p-2 rounded w-full"
                value={newProduct.price}
                onChange={(e) => setNewProduct({ ...newProduct, price: e.target.value })}
            />

            <select
                className="border p-2 rounded w-full"
                value={newProduct.category_id}
                onChange={(e) => setNewProduct({ ...newProduct, category_id: e.target.value })}
            >
                <option value="">-- Chọn category --</option>
                {categories.map((c) => (
                    <option key={c.id} value={c.id}>
                        {c.name}
                    </option>
                ))}
            </select>
        </div>
    )
}

export default BasicInfoProduct
