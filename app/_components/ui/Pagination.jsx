'use client'

export default function Pagination({ page, totalPages, onPrev, onNext }) {
    return (
        <div className="flex gap-2 items-center">
            <button
                onClick={onPrev}
                disabled={page <= 1}
                className="px-3 py-2 rounded border border-gray-300 bg-white disabled:opacity-50 hover:bg-gray-50"
            >
                ← Trước
            </button>
            <span className="text-sm text-gray-700">
                Trang <span className="font-medium">{page}</span> /{' '}
                <span className="font-medium">{totalPages}</span>
            </span>
            <button
                onClick={onNext}
                disabled={page >= totalPages}
                className="px-3 py-2 rounded border border-gray-300 bg-white disabled:opacity-50 hover:bg-gray-50"
            >
                Sau →
            </button>
        </div>
    )
}
