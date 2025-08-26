'use client'
import { Button } from '@/components/ui/button'
import BasicInfoProduct from '@/app/_components/Admin/BasicInfoProduct'
import VariantsProduct from '@/app/_components/Admin/VariantsProduct'

export default function FunctionalForm({
    newProduct,
    setNewProduct,
    categories,
    handleAddImage,
    handleAddSize,
    handleAddVariant,
    handleCreate,
    handleRemoveSize,
    handleRemoveVariant,
    handleUpdate,
    isEditing,
    editingProductId,
    setShowForm,
    setEditingProductId,
}) {
    return (
        <div className="mb-6 p-6 border rounded-lg bg-white shadow-md">
            <h3 className="text-xl font-semibold mb-4">
                {' '}
                {isEditing ? `Sửa sản phẩm: ${newProduct.name || ''}` : 'Tạo sản phẩm mới'}
            </h3>
            <BasicInfoProduct
                newProduct={newProduct}
                setNewProduct={setNewProduct}
                categories={categories}
            />

            {/* Variants */}
            <VariantsProduct
                newProduct={newProduct}
                setNewProduct={setNewProduct}
                handleAddImage={handleAddImage}
                handleAddSize={handleAddSize}
                handleAddVariant={handleAddVariant}
                handleRemoveSize={handleRemoveSize}
                handleRemoveVariant={handleRemoveVariant}
            />

            <div className="flex gap-4">
                {isEditing ? (
                    <Button onClick={() => handleUpdate(editingProductId)}>Update</Button>
                ) : (
                    <Button onClick={handleCreate}>Create</Button>
                )}
                <Button
                    variant="outline"
                    onClick={() => {
                        setShowForm(false)
                        setEditingProductId(null)
                        setNewProduct({
                            name: '',
                            description: '',
                            price: '',
                            category_id: '',
                            variants: [],
                        })
                    }}
                >
                    Cancel
                </Button>
            </div>
        </div>
    )
}
