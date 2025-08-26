'use client'
import { Button } from '@/components/ui/button'
import BasicInfoCategory from '@/app/_components/Admin/BasicInfoCategory'

function CategoryForm({
    newCategory,
    setNewCategory,
    handleCreate,
    handleUpdate,
    isEditing,
    editingCategoryId,
    setShowForm,
    setEditingCategoryId,
}) {
    return (
        <div className="mb-6 p-6 border rounded-lg bg-white shadow-md">
            <h3 className="text-xl font-semibold mb-4">
                {' '}
                {isEditing ? `Sửa danh mục: ${newCategory.name || ''}` : 'Tạo danh mục mới'}
            </h3>
            <BasicInfoCategory newCategory={newCategory} setNewCategory={setNewCategory} />

            <div className="flex gap-4">
                {isEditing ? (
                    <Button onClick={() => handleUpdate(editingCategoryId)}>Update</Button>
                ) : (
                    <Button onClick={handleCreate}>Create</Button>
                )}
                <Button
                    variant="outline"
                    onClick={() => {
                        setShowForm(false)
                        setEditingCategoryId(null)
                        setNewCategory({
                            name: '',
                        })
                    }}
                >
                    Cancel
                </Button>
            </div>
        </div>
    )
}

export default CategoryForm
