'use client'

export default function Pagination({ currentPage, totalPages, onPageChange }) {
    return (
        <div className="flex justify-center items-center gap-2 mt-6">
            <button
                onClick={() => onPageChange(Math.max(currentPage - 1, 1))}
                disabled={currentPage === 1}
                className={`px-3 py-1 border rounded ${
                    currentPage === 1
                        ? 'text-gray-400 border-gray-300 cursor-not-allowed'
                        : 'hover:bg-gray-100'
                }`}
            >
                ← Trước
            </button>

            {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                <button
                    key={page}
                    onClick={() => onPageChange(page)}
                    className={`px-3 py-1 rounded ${
                        currentPage === page
                            ? 'bg-blue-600 text-white'
                            : 'hover:bg-gray-100 text-gray-700'
                    }`}
                >
                    {page}
                </button>
            ))}

            <button
                onClick={() => onPageChange(Math.min(currentPage + 1, totalPages))}
                disabled={currentPage === totalPages}
                className={`px-3 py-1 border rounded ${
                    currentPage === totalPages
                        ? 'text-gray-400 border-gray-300 cursor-not-allowed'
                        : 'hover:bg-gray-100'
                }`}
            >
                Sau →
            </button>
        </div>
    )
}
