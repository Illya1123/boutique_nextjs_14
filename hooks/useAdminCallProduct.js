'use client'

import { useState, useEffect } from 'react'
import axios from 'axios'

export function useAdminCallProduct() {
    const [products, setProducts] = useState([])
    const [categories, setCategories] = useState([])
    const [loading, setLoading] = useState(true)
    const [showForm, setShowForm] = useState(false)
    const [editingProductId, setEditingProductId] = useState(null)
    const isEditing = editingProductId !== null

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
            const res = await axios.post('/api/admin/products', payload)
            if (res.data.success) {
                setProducts([...products, res.data.product])
                resetForm()
            }
        } catch (error) {
            console.error(error)
        }
    }

    const handleUpdate = async (id) => {
        try {
            const payload = {
                ...newProduct,
                price: parseFloat(newProduct.price),
                category_id: parseInt(newProduct.category_id),
            }

            const res = await axios.put(`/api/admin/products?id=${id}`, payload)
            if (res.data.success) {
                const updated = res.data.product
                setProducts(products.map((p) => (p.id === updated.id ? updated : p)))
                resetForm()
            }
        } catch (error) {
            console.error(error)
        }
    }

    const handleEdit = (product) => {
        setNewProduct({
            id: product.id,
            name: product.name,
            description: product.description,
            price: product.price,
            category_id: product.category?.id || '',
            variants:
                product.variants?.map((variant) => ({
                    color: variant.color,
                    sizes: variant.sizes?.map((s) => ({ size: s.size, stock: s.stock })) || [],
                    images:
                        variant.images?.map((img) => ({
                            url: img.url,
                            is_primary: img.is_primary,
                        })) || [],
                })) || [],
        })
        setEditingProductId(product.id)
        setShowForm(true)
    }

    const handleDelete = async (id) => {
        if (!confirm('Bạn có chắc muốn xóa sản phẩm này?')) return
        try {
            const res = await axios.delete(`/api/admin/products?id=${id}`)
            if (res.data.success) setProducts(products.filter((p) => p.id !== id))
        } catch (error) {
            console.error(error)
        }
    }

    const resetForm = () => {
        setShowForm(false)
        setEditingProductId(null)
        setNewProduct({
            name: '',
            description: '',
            price: '',
            category_id: '',
            variants: [],
        })
    }

    return {
        products,
        categories,
        loading,
        showForm,
        setShowForm,
        editingProductId,
        setEditingProductId,
        isEditing,
        newProduct,
        setNewProduct,
        handleAddVariant,
        handleRemoveVariant,
        handleAddSize,
        handleRemoveSize,
        handleAddImage,
        handleCreate,
        handleUpdate,
        handleEdit,
        handleDelete,
    }
}
