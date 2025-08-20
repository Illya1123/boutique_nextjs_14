'use client'

import { useEffect, useState } from 'react'

export default function ProductImages({ variant }) {
    const [selectedImage, setSelectedImage] = useState(null)

    useEffect(() => {
        if (variant?.images?.length > 0) {
            const primary = variant.images.find((img) => img.is_primary) || variant.images[0]
            setSelectedImage(primary)
        }
    }, [variant])

    if (!variant?.images || variant.images.length === 0) return null

    return (
        <div className="flex flex-col items-center bg-gray-50 rounded-lg p-6">
            {/* Ảnh chính */}
            <img
                src={selectedImage?.url}
                alt="Product"
                className="max-h-[500px] object-contain"
            />

            {/* Thumbnails */}
            <div className="flex gap-2 mt-4">
                {variant.images.map((img) => (
                    <img
                        key={img.id}
                        src={img.url}
                        alt="Thumbnail"
                        className={`w-16 h-16 object-cover border rounded cursor-pointer ${
                            selectedImage?.id === img.id ? 'border-blue-600' : 'border-gray-300'
                        }`}
                        onClick={() => setSelectedImage(img)}
                    />
                ))}
            </div>
        </div>
    )
}
