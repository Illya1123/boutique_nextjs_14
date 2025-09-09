'use client'

import { useState } from 'react'
import BlogEditor from '@/app/_components/Admin/blogs/BlogEditor'
import BlogListTable from '@/app/_components/Admin/blogs/BlogListTable'

export default function BlogsManager() {
    const [tab, setTab] = useState('create') // 'create' | 'list'
    const [editingBlog, setEditingBlog] = useState(null)

    const handleEditRequest = (blogRow) => {
        setEditingBlog(blogRow)
        setTab('create')
    }

    const handleSaved = () => {
        setEditingBlog(null)
        setTab('list')
    }

    const handleCancelEdit = () => {
        setEditingBlog(null)
    }

    return (
        <div className="px-6 py-4">
            {/* Tabs */}
            <div className="mb-6">
                <div className="inline-flex rounded-lg border overflow-hidden">
                    <button
                        className={`px-4 py-2 text-sm font-medium ${
                            tab === 'create'
                                ? 'bg-gray-900 text-white'
                                : 'bg-white hover:bg-gray-50'
                        }`}
                        onClick={() => setTab('create')}
                    >
                        {editingBlog ? 'Sửa blog' : 'Thêm blog'}
                    </button>
                    <button
                        className={`px-4 py-2 text-sm font-medium ${
                            tab === 'list' ? 'bg-gray-900 text-white' : 'bg-white hover:bg-gray-50'
                        }`}
                        onClick={() => setTab('list')}
                    >
                        Danh sách blog
                    </button>
                </div>
            </div>

            {tab === 'create' ? (
                <BlogEditor
                    editingBlog={editingBlog}
                    onSaved={handleSaved}
                    onCancelEdit={handleCancelEdit}
                />
            ) : (
                <BlogListTable onEdit={handleEditRequest} />
            )}
        </div>
    )
}
