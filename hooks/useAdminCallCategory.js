'use client'

import { useState, useEffect } from 'react'
import axios from 'axios'

export function useAdminCallCategory() {
    const [categories, setCategories] = useState([])
    const [loading, setLoading] = useState(true)
    const [showForm, setShowForm] = useState(false)
    const [editingCategoryId, setEditingCategoryId] = useState(null)
    const isEditing = editingCategoryId !== null

    const [newCategory, setNewCategory] = useState({
        name: '',
    })

    useEffect(() => {
        fetchCategories()
    }, [])

    const fetchCategories = async () => {
        try {
            const res = await axios.get('/api/categories')
            setCategories(res.data)
        } catch (error) {
            console.error(error)
        } finally {
            setLoading(false)
        }
    }

    const handleCreate = async () => {
        try {
            const payload = {
                ...newCategory,
                name: newCategory.name,
            }
            const res = await axios.post('/api/admin/categories', payload)
            if (res.data.success) {
                setCategories([...categories, res.data.category])
                resetForm()
            }
        } catch (error) {
            console.error(error)
        }
    }

    const handleUpdate = async (id) => {
        try {
            const payload = {
                ...newCategory,
                name: newCategory.name,
            }
            const res = await axios.put(`/api/admin/categories?id=${id}`, payload)
            if (res.data.success) {
                const updated = res.data.category
                setCategories(categories.map((cate) => (cate.id === updated.id ? updated : cate)))
                resetForm
            }
        } catch (error) {
            console.error(error)
        }
    }

    const handleEdit = (category) => {
        setNewCategory({
            id: category.id,
            name: category.name,
        })
        setEditingCategoryId(category.id)
        setShowForm(true)
    }

    const handleDelete = async (id) => {
        if (!confirm('Bạn có chắc muốn xoá danh mục này?')) return
        try {
            const res = await axios.delete(`/api/admin/categories?id=${id}`)
            if (res.data.success) setCategories(categories.filter((cate) => cate.id !== id))
        } catch (error) {
            console.error(error)
        }
    }

    const resetForm = () => {
        setShowForm(false)
        setEditingCategoryId(null)
        setNewCategory({
            name: '',
        })
    }

    return {
        categories,
        loading,
        showForm,
        setShowForm,
        editingCategoryId,
        setEditingCategoryId,
        isEditing,
        newCategory,
        setNewCategory,
        handleCreate,
        handleUpdate,
        handleEdit,
        handleDelete,
    }
}
