'use client'

import { useState, useEffect } from 'react'
import axios from 'axios'

export function useAdminCallBlog() {
    const [blogs, setBlogs] = useState([])
    const [loading, setLoading] = useState(true)
    const [showForm, setShowForm] = useState(false)
    const [editingBlogId, setEditingBlogId] = useState(null)
    const isEditing = editingBlogId !== null

    const [newBlog, setNewBlog] = useState({
        title: '',
        category_id: '',
        author_id: '',
        tags: [],
        paragraphs: [], // [{ type: 'text', text: '', image_url: '', order: 0 }]
    })

    useEffect(() => {
        fetchBlogs()
    }, [])

    const fetchBlogs = async () => {
        try {
            const res = await axios.get('/api/blogs') // route GET blog (bạn nên tạo thêm)
            setBlogs(res.data)
        } catch (error) {
            console.error(error)
        } finally {
            setLoading(false)
        }
    }

    const handleCreate = async () => {
        try {
            const payload = { ...newBlog }
            const res = await axios.post('/api/admin/blogs', payload)
            if (res.data.success) {
                setBlogs([...blogs, res.data.blog])
                resetForm()
            }
        } catch (error) {
            console.error(error)
        }
    }

    const handleUpdate = async (id) => {
        try {
            const payload = { ...newBlog }
            const res = await axios.put(`/api/admin/blogs?id=${id}`, payload)
            if (res.data.success) {
                const updated = res.data.blog
                setBlogs(blogs.map((b) => (b.id === updated.id ? updated : b)))
                resetForm()
            }
        } catch (error) {
            console.error(error)
        }
    }

    const handleEdit = (blog) => {
        setNewBlog({
            title: blog.title,
            category_id: blog.category_id,
            author_id: blog.author_id,
            tags: blog.tags || [],
            paragraphs: blog.paragraph || [],
        })
        setEditingBlogId(blog.id)
        setShowForm(true)
    }

    const handleDelete = async (id) => {
        if (!confirm('Bạn có chắc muốn xoá blog này?')) return
        try {
            const res = await axios.delete(`/api/admin/blogs?id=${id}`)
            if (res.data.success) {
                setBlogs(blogs.filter((b) => b.id !== id))
            }
        } catch (error) {
            console.error(error)
        }
    }

    const resetForm = () => {
        setShowForm(false)
        setEditingBlogId(null)
        setNewBlog({
            title: '',
            category_id: '',
            author_id: '',
            tags: [],
            paragraphs: [],
        })
    }

    return {
        blogs,
        loading,
        showForm,
        setShowForm,
        editingBlogId,
        setEditingBlogId,
        isEditing,
        newBlog,
        setNewBlog,
        handleCreate,
        handleUpdate,
        handleEdit,
        handleDelete,
        resetForm,
    }
}
