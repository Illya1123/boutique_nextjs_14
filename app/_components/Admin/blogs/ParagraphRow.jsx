'use client'

export default function ParagraphRow({ item, index, onChange, onMoveUp, onMoveDown, onRemove }) {
    const isText = item.type === 'text'
    return (
        <div className="rounded-xl border p-4 bg-white/80 flex flex-col gap-3">
            <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                    <select
                        className="border rounded px-2 py-1"
                        value={item.type}
                        onChange={(e) => onChange(index, { ...item, type: e.target.value })}
                    >
                        <option value="text">Đoạn văn (text)</option>
                        <option value="image">Hình ảnh (image)</option>
                    </select>
                    <span className="text-xs text-gray-500">Thứ tự: {item.order}</span>
                </div>
                <div className="flex items-center gap-2">
                    <button
                        type="button"
                        className="px-2 py-1 rounded border hover:bg-gray-50"
                        onClick={() => onMoveUp(index)}
                        disabled={index === 0}
                        title="Lên"
                    >
                        ↑
                    </button>
                    <button
                        type="button"
                        className="px-2 py-1 rounded border hover:bg-gray-50"
                        onClick={() => onMoveDown(index)}
                        title="Xuống"
                    >
                        ↓
                    </button>
                    <button
                        type="button"
                        className="px-2 py-1 rounded border border-red-300 text-red-600 hover:bg-red-50"
                        onClick={() => onRemove(index)}
                        title="Xoá đoạn"
                    >
                        Xoá
                    </button>
                </div>
            </div>

            {isText ? (
                <textarea
                    className="w-full border rounded px-3 py-2 min-h-[96px]"
                    placeholder="Nhập nội dung đoạn văn..."
                    value={item.text}
                    onChange={(e) => onChange(index, { ...item, text: e.target.value })}
                />
            ) : (
                <>
                    <input
                        type="url"
                        className="w-full border rounded px-3 py-2"
                        placeholder="https://example.com/image.jpg"
                        value={item.image_url || ''}
                        onChange={(e) => onChange(index, { ...item, image_url: e.target.value })}
                    />
                    <input
                        type="text"
                        className="w-full border rounded px-3 py-2"
                        placeholder="Ghi chú/figcaption (tuỳ chọn)"
                        value={item.text || ''}
                        onChange={(e) => onChange(index, { ...item, text: e.target.value })}
                    />
                </>
            )}
        </div>
    )
}
