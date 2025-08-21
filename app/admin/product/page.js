'use client'

import { useEffect, useState } from 'react'
import axios from 'axios'
import {
    Table,
    TableBody,
    TableCaption,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from '@/components/ui/table'
import { Button } from '@/components/ui/button'

export default function Product() {
    const [products, setProducts] = useState([])
    const [categories, setCategories] = useState([])
    const [loading, setLoading] = useState(true)
    const [showForm, setShowForm] = useState(false)
    const [newProduct, setNewProduct] = useState({
        name: '',
        description: '',
        price: '',
        category_id: '',
        variants: [],
    })

    useEffect(() => {
        fetchProducts()
        fetchCategories()
    }, [])

    const fetchProducts = async () => {
        try {
            const res = await axios.get('/api/products')
            if (res.data.success) setProducts(res.data.products)
        } catch (error) {
            console.error(error)
        } finally {
            setLoading(false)
        }
    }

    const fetchCategories = async () => {
        try {
            const res = await axios.get('/api/categories')
            setCategories(res.data)
        } catch (error) {
            console.error(error)
        }
    }

    const handleAddVariant = () => {
        setNewProduct({
            ...newProduct,
            variants: [...newProduct.variants, { color: '', sizes: [], images: [] }],
        })
    }

    const handleRemoveVariant = (vIndex) => {
        const variants = [...newProduct.variants]
        variants.splice(vIndex, 1)
        setNewProduct({ ...newProduct, variants })
    }

    const handleAddSize = (vIndex) => {
        const variants = [...newProduct.variants]
        variants[vIndex].sizes.push({ size: '', stock: 0 })
        setNewProduct({ ...newProduct, variants })
    }

    const handleRemoveSize = (vIndex, sIndex) => {
        const variants = [...newProduct.variants]
        variants[vIndex].sizes.splice(sIndex, 1)
        setNewProduct({ ...newProduct, variants })
    }

    const handleAddImage = (vIndex) => {
        const variants = [...newProduct.variants]
        variants[vIndex].images.push({ url: '', is_primary: false })
        setNewProduct({ ...newProduct, variants })
    }

    const handleCreate = async () => {
        try {
            const payload = {
                ...newProduct,
                price: parseFloat(newProduct.price),
                category_id: parseInt(newProduct.category_id),
            }
            const res = await axios.post('/api/products', payload)
            if (res.data.success) {
                setProducts([...products, res.data.product])
                setShowForm(false)
                setNewProduct({
                    name: '',
                    description: '',
                    price: '',
                    category_id: '',
                    variants: [],
                })
            }
        } catch (error) {
            console.error(error)
        }
    }

    const handleDelete = async (id) => {
        if (!confirm('Bạn có chắc muốn xóa sản phẩm này?')) return
        try {
            const res = await axios.delete(`/api/products?id=${id}`)
            if (res.data.success) setProducts(products.filter((p) => p.id !== id))
        } catch (error) {
            console.error(error)
        }
    }

    if (loading) return <p className="text-center py-8 text-gray-600">Đang tải dữ liệu...</p>

    return (
        <div className="px-6 py-4">
            <div className="flex justify-between items-center mb-6">
                <div>
                    <h2 className="text-3xl font-bold text-gray-800">Dashboard</h2>
                    <p className="text-gray-600">Quản lý sản phẩm</p>
                </div>
                <Button onClick={() => setShowForm(true)}>Create Product</Button>
            </div>

            {showForm && (
                <div className="mb-6 p-6 border rounded-lg bg-white shadow-md">
                    <h3 className="text-xl font-semibold mb-4">Tạo sản phẩm mới</h3>
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
                            onChange={(e) =>
                                setNewProduct({ ...newProduct, description: e.target.value })
                            }
                        />
                        <input
                            type="number"
                            placeholder="Price"
                            className="border p-2 rounded w-full"
                            value={newProduct.price}
                            onChange={(e) =>
                                setNewProduct({ ...newProduct, price: e.target.value })
                            }
                        />

                        <select
                            className="border p-2 rounded w-full"
                            value={newProduct.category_id}
                            onChange={(e) =>
                                setNewProduct({ ...newProduct, category_id: e.target.value })
                            }
                        >
                            <option value="">-- Chọn category --</option>
                            {categories.map((c) => (
                                <option key={c.id} value={c.id}>
                                    {c.name}
                                </option>
                            ))}
                        </select>
                    </div>

                    {/* Variants */}
                    <div className="mb-4">
                        <h4 className="text-lg font-semibold mb-2">Variants</h4>
                        {newProduct.variants.map((v, vIndex) => (
                            <div
                                key={vIndex}
                                className="mb-4 p-4 border rounded-lg bg-gray-50 shadow-sm"
                            >
                                <div className="flex justify-between items-center mb-2">
                                    <input
                                        type="text"
                                        placeholder="Color"
                                        className="border p-2 rounded w-full"
                                        value={v.color}
                                        onChange={(e) => {
                                            const variants = [...newProduct.variants]
                                            variants[vIndex].color = e.target.value
                                            setNewProduct({ ...newProduct, variants })
                                        }}
                                    />
                                    <Button
                                        variant="destructive"
                                        size="sm"
                                        onClick={() => handleRemoveVariant(vIndex)}
                                    >
                                        Remove Variant
                                    </Button>
                                </div>

                                <div className="mb-2">
                                    <h5 className="font-medium mb-1">Sizes</h5>
                                    {v.sizes.map((s, sIndex) => (
                                        <div key={sIndex} className="flex gap-2 mb-2 items-center">
                                            <select
                                                className="border p-2 flex-1 rounded"
                                                value={s.size}
                                                onChange={(e) => {
                                                    const variants = [...newProduct.variants]
                                                    variants[vIndex].sizes[sIndex].size =
                                                        e.target.value
                                                    setNewProduct({ ...newProduct, variants })
                                                }}
                                            >
                                                <option value="">-- Chọn size --</option>
                                                {['S', 'M', 'L', 'XL', '2XL', '3XL'].map((size) => (
                                                    <option key={size} value={size}>
                                                        {size}
                                                    </option>
                                                ))}
                                            </select>
                                            <input
                                                type="number"
                                                placeholder="Stock"
                                                min="0"
                                                className="border p-2 w-28 rounded"
                                                value={s.stock}
                                                onChange={(e) => {
                                                    const value = Math.max(
                                                        0,
                                                        parseInt(e.target.value) || 0
                                                    )
                                                    const variants = [...newProduct.variants]
                                                    variants[vIndex].sizes[sIndex].stock = value
                                                    setNewProduct({ ...newProduct, variants })
                                                }}
                                            />
                                            <Button
                                                variant="outline"
                                                size="sm"
                                                onClick={() => handleRemoveSize(vIndex, sIndex)}
                                            >
                                                X
                                            </Button>
                                        </div>
                                    ))}
                                    <Button size="sm" onClick={() => handleAddSize(vIndex)}>
                                        + Add Size
                                    </Button>
                                </div>

                                <div>
                                    <h5 className="font-medium mb-1">Images</h5>
                                    <div className="flex flex-col gap-3 mb-2">
                                        {v.images.map((img, imgIndex) => (
                                            <div
                                                key={imgIndex}
                                                className="flex items-center gap-3 p-2 border rounded bg-white shadow-sm"
                                            >
                                                <input
                                                    type="text"
                                                    placeholder="Image URL"
                                                    className="border p-2 rounded flex-1"
                                                    value={img.url}
                                                    onChange={(e) => {
                                                        const variants = [...newProduct.variants]
                                                        variants[vIndex].images[imgIndex].url =
                                                            e.target.value
                                                        setNewProduct({ ...newProduct, variants })
                                                    }}
                                                />
                                                <label className="flex items-center gap-1 text-sm">
                                                    <input
                                                        type="checkbox"
                                                        checked={img.is_primary}
                                                        onChange={(e) => {
                                                            const variants = [
                                                                ...newProduct.variants,
                                                            ]
                                                            variants[vIndex].images[
                                                                imgIndex
                                                            ].is_primary = e.target.checked
                                                            setNewProduct({
                                                                ...newProduct,
                                                                variants,
                                                            })
                                                        }}
                                                    />
                                                    Primary
                                                </label>
                                            </div>
                                        ))}
                                    </div>
                                    <Button size="sm" onClick={() => handleAddImage(vIndex)}>
                                        + Add Image
                                    </Button>
                                </div>
                            </div>
                        ))}
                        <Button onClick={handleAddVariant}>+ Add Variant</Button>
                    </div>

                    <div className="flex gap-4">
                        <Button onClick={handleCreate}>Create</Button>
                        <Button variant="outline" onClick={() => setShowForm(false)}>
                            Cancel
                        </Button>
                    </div>
                </div>
            )}

            {/* Table */}
            <Table className="min-w-full border border-gray-300 rounded-lg overflow-hidden">
                <TableCaption className="text-gray-600">Danh sách sản phẩm</TableCaption>
                <TableHeader className="bg-gray-100">
                    <TableRow className="border-b border-gray-300">
                        <TableHead>#</TableHead>
                        <TableHead>ID</TableHead>
                        <TableHead>Name</TableHead>
                        <TableHead>Price</TableHead>
                        <TableHead>Category</TableHead>
                        <TableHead>Variants</TableHead>
                        <TableHead>Actions</TableHead>
                    </TableRow>
                </TableHeader>
                <TableBody>
                    {products.map((product, index) => (
                        <TableRow key={product.id} className="hover:bg-gray-50">
                            <TableCell>{index + 1}</TableCell>
                            <TableCell>{product.id}</TableCell>
                            <TableCell>{product.name}</TableCell>
                            <TableCell>{product.price}</TableCell>
                            <TableCell>{product.category?.name || '-'}</TableCell>
                            <TableCell>
                                {product.variants?.map((v) => (
                                    <div key={v.id} className="mb-3 p-2 border rounded bg-gray-50">
                                        <p className="font-medium">Color: {v.color}</p>
                                        <p>
                                            Stock:{' '}
                                            {v.sizes?.reduce((total, s) => total + s.stock, 0)}
                                        </p>
                                        <p>
                                            Sizes:{' '}
                                            {v.sizes
                                                ?.map((s) => `${s.size}(${s.stock})`)
                                                .join(', ')}
                                        </p>
                                        <div className="flex flex-wrap gap-2 mt-2">
                                            {v.images?.map((img, idx) => (
                                                <img
                                                    key={idx}
                                                    src={img.url}
                                                    alt={`Variant ${v.color} image ${idx + 1}`}
                                                    className="w-20 h-20 object-cover rounded border shadow-sm"
                                                />
                                            ))}
                                        </div>
                                    </div>
                                ))}
                            </TableCell>
                            <TableCell>
                                <div className="flex gap-2">
                                    <Button variant="outline" size="sm">
                                        Edit
                                    </Button>
                                    <Button
                                        variant="destructive"
                                        size="sm"
                                        onClick={() => handleDelete(product.id)}
                                    >
                                        Delete
                                    </Button>
                                </div>
                            </TableCell>
                        </TableRow>
                    ))}
                </TableBody>
            </Table>
        </div>
    )
}
