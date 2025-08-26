'use client'
import { Button } from '@/components/ui/button'

function VariantsProduct({
    newProduct,
    setNewProduct,
    handleAddImage,
    handleAddSize,
    handleAddVariant,
    handleRemoveSize,
    handleRemoveVariant,
}) {
    return (
        <div className="mb-4">
            <h4 className="text-lg font-semibold mb-2">Variants</h4>
            {newProduct.variants.map((v, vIndex) => (
                <div key={vIndex} className="mb-4 p-4 border rounded-lg bg-gray-50 shadow-sm">
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
                                        variants[vIndex].sizes[sIndex].size = e.target.value
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
                                        const value = Math.max(0, parseInt(e.target.value) || 0)
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
                                            variants[vIndex].images[imgIndex].url = e.target.value
                                            setNewProduct({ ...newProduct, variants })
                                        }}
                                    />
                                    <label className="flex items-center gap-1 text-sm">
                                        <input
                                            type="checkbox"
                                            checked={img.is_primary}
                                            onChange={(e) => {
                                                const variants = [...newProduct.variants]
                                                variants[vIndex].images[imgIndex].is_primary =
                                                    e.target.checked
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
    )
}

export default VariantsProduct
