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
    }, [])

    const fetchProducts = async () => {
        try {
            const res = await axios.get('/api/products')
            if (res.data.success) setProducts(res.data.products)
            else console.error(res.data.error)
        } catch (error) {
            console.error(error)
        } finally {
            setLoading(false)
        }
    }

    const handleAddVariant = () => {
        setNewProduct({
            ...newProduct,
            variants: [...newProduct.variants, { color: '', sizes: [], images: [] }],
        })
    }

    const handleAddSize = (vIndex) => {
        const variants = [...newProduct.variants]
        variants[vIndex].sizes.push({ size: '', stock: 0 })
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
            } else console.error(res.data.error)
        } catch (error) {
            console.error(error)
        }
    }

    const handleDelete = async (id) => {
        if (!confirm('Bạn có chắc muốn xóa sản phẩm này?')) return
        try {
            const res = await axios.delete(`/api/products?id=${id}`)
            if (res.data.success) setProducts(products.filter((p) => p.id !== id))
            else console.error(res.data.error)
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
                        <input
                            type="number"
                            placeholder="Category ID"
                            className="border p-2 rounded w-full"
                            value={newProduct.category_id}
                            onChange={(e) =>
                                setNewProduct({ ...newProduct, category_id: e.target.value })
                            }
                        />
                    </div>

                    <div className="mb-4">
                        <h4 className="text-lg font-semibold mb-2">Variants</h4>
                        {newProduct.variants.map((v, vIndex) => (
                            <div
                                key={vIndex}
                                className="mb-4 p-4 border rounded-lg bg-gray-50 shadow-sm"
                            >
                                <input
                                    type="text"
                                    placeholder="Color"
                                    className="border p-2 mb-2 rounded w-full"
                                    value={v.color}
                                    onChange={(e) => {
                                        const variants = [...newProduct.variants]
                                        variants[vIndex].color = e.target.value
                                        setNewProduct({ ...newProduct, variants })
                                    }}
                                />

                                <div className="mb-2">
                                    <h5 className="font-medium mb-1">Sizes</h5>
                                    {v.sizes.map((s, sIndex) => (
                                        <div key={sIndex} className="flex gap-2 mb-2">
                                            <input
                                                type="text"
                                                placeholder="Size"
                                                className="border p-2 flex-1 rounded"
                                                value={s.size}
                                                onChange={(e) => {
                                                    const variants = [...newProduct.variants]
                                                    variants[vIndex].sizes[sIndex].size =
                                                        e.target.value
                                                    setNewProduct({ ...newProduct, variants })
                                                }}
                                            />
                                            <input
                                                type="number"
                                                placeholder="Stock"
                                                className="border p-2 w-24 rounded"
                                                value={s.stock}
                                                onChange={(e) => {
                                                    const variants = [...newProduct.variants]
                                                    variants[vIndex].sizes[sIndex].stock = parseInt(
                                                        e.target.value
                                                    )
                                                    setNewProduct({ ...newProduct, variants })
                                                }}
                                            />
                                        </div>
                                    ))}
                                    <Button size="sm" onClick={() => handleAddSize(vIndex)}>
                                        + Add Size
                                    </Button>
                                </div>

                                <div>
                                    <h5 className="font-medium mb-1">Images</h5>
                                    <div className="flex flex-wrap gap-2 mb-2">
                                        {v.images.map((img, imgIndex) => (
                                            <div
                                                key={imgIndex}
                                                className="flex flex-col items-center"
                                            >
                                                <input
                                                    type="text"
                                                    placeholder="Image URL"
                                                    className="border p-2 rounded w-40 mb-1"
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

            <Table className="min-w-full border border-gray-300 rounded-lg overflow-hidden">
                <TableCaption className="text-gray-600">Danh sách sản phẩm</TableCaption>
                <TableHeader className="bg-gray-100">
                    <TableRow className="border-b border-gray-300">
                        <TableHead className="border-r border-gray-300">#</TableHead>
                        <TableHead className="border-r border-gray-300">ID</TableHead>
                        <TableHead className="border-r border-gray-300">Name</TableHead>
                        <TableHead className="border-r border-gray-300">Price</TableHead>
                        <TableHead className="border-r border-gray-300">Category</TableHead>
                        <TableHead className="border-r border-gray-300">Variants</TableHead>
                        <TableHead>Actions</TableHead>
                    </TableRow>
                </TableHeader>
                <TableBody>
                    {products.map((product, index) => (
                        <TableRow
                            key={product.id}
                            className="border-b border-gray-200 hover:bg-gray-50"
                        >
                            <TableCell className="border-r border-gray-300">{index + 1}</TableCell>
                            <TableCell className="border-r border-gray-300">{product.id}</TableCell>
                            <TableCell className="border-r border-gray-300">
                                {product.name}
                            </TableCell>
                            <TableCell className="border-r border-gray-300">
                                {product.price}
                            </TableCell>
                            <TableCell className="border-r border-gray-300">
                                {product.category?.name || '-'}
                            </TableCell>
                            <TableCell className="border-r border-gray-300">
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
