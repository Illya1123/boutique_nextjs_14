'use client'
import ContentAndCreate from '@/app/_components/Admin/ContentAndCreate'
import TableList from '@/app/_components/Admin/TableList'
import FunctionalForm from '@/app/_components/Admin/ProductForm'
import { useAdminCallProduct } from '@/hooks/useAdminCallProduct'

export default function Product() {
    const {
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
    } = useAdminCallProduct()

    if (loading) return <p className="text-center py-8 text-gray-600">Đang tải dữ liệu...</p>

    return (
        <div className="px-6 py-4">
            <ContentAndCreate label="sản phẩm" setShowForm={setShowForm} />

            {showForm && (
                <FunctionalForm
                    newProduct={newProduct}
                    setNewProduct={setNewProduct}
                    categories={categories}
                    handleAddImage={handleAddImage}
                    handleAddSize={handleAddSize}
                    handleAddVariant={handleAddVariant}
                    handleCreate={handleCreate}
                    handleRemoveSize={handleRemoveSize}
                    handleRemoveVariant={handleRemoveVariant}
                    handleUpdate={handleUpdate}
                    isEditing={isEditing}
                    editingProductId={editingProductId}
                    setShowForm={setShowForm}
                    setEditingProductId={setEditingProductId}
                />
            )}
            <TableList
                caption="Danh sách sản phẩm"
                data={products}
                columns={[
                    { title: 'ID', key: 'id' },
                    { title: 'Tên sản phẩm', key: 'name' },
                    { title: 'Giá', key: 'price' },
                    {
                        title: 'Danh mục',
                        key: 'category',
                        render: (val) => val?.name || '-',
                    },
                    {
                        title: 'Thuộc tính sản phẩm',
                        key: 'variants',
                        render: (variants) => (
                            <div>
                                {variants?.map((v) => (
                                    <div key={v.id} className="mb-3 p-2 border rounded bg-gray-50">
                                        <p className="font-medium">Màu: {v.color}</p>
                                        <p>
                                            Số lượng tồn kho:{' '}
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
                            </div>
                        ),
                    },
                ]}
                onEdit={handleEdit}
                onDelete={handleDelete}
            />
        </div>
    )
}
