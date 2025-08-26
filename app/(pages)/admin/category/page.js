'use client'
import ContentAndCreate from '@/app/_components/Admin/ContentAndCreate'
import TableList from '@/app/_components/Admin/TableList'
import FunctionalForm from '@/app/_components/Admin/ProductForm'
import { useAdminCallCategory } from '@/hooks/useAdminCallCategory'
import CategoryForm from '@/app/_components/Admin/CategoryForm'

export default function Category() {
    const {
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
    } = useAdminCallCategory()

    if (loading) return <p className="text-center py-8 text-gray-600">Đang tải dữ liệu...</p>

    return (
        <div className="px-6 py-4">
            <ContentAndCreate label="danh mục sản phẩm" setShowForm={setShowForm} />

            {showForm && (
                <CategoryForm
                    newCategory={newCategory}
                    setNewCategory={setNewCategory}
                    handleCreate={handleCreate}
                    handleUpdate={handleUpdate}
                    isEditing={isEditing}
                    editingCategoryId={editingCategoryId}
                    setShowForm={setShowForm}
                    setEditingCategoryId={setEditingCategoryId}
                />
            )}

            <TableList
                caption="Danh sách danh mục"
                data={categories}
                columns={[
                    { title: 'ID', key: 'id' },
                    { title: 'Tên danh mục', key: 'name' },
                ]}
                onEdit={handleEdit}
                onDelete={handleDelete}
                showIndex={false}
            />
        </div>
    )
}
