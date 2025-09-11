'use client'

export default function OrdersFilters({
    q,
    setQ,
    status,
    setStatus,
    pageSize,
    setPageSize,
    onSubmit,
    statuses = [],
}) {
    return (
        <form onSubmit={onSubmit} className="flex flex-wrap gap-2 mb-3 items-center">
            <input
                value={q}
                onChange={(e) => setQ(e.target.value)}
                placeholder="Tìm theo ID, địa chỉ, SĐT, tên/email/phone khách…"
                className="min-w-[280px] md:min-w-[320px] px-3 py-2 rounded border border-gray-300 focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
            <select
                value={status}
                onChange={(e) => setStatus(e.target.value)}
                className="px-3 py-2 rounded border border-gray-300 bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
            >
                <option value="">Tất cả trạng thái</option>
                {statuses.map((s) => (
                    <option key={s} value={s}>
                        {s}
                    </option>
                ))}
            </select>
            <button
                type="submit"
                className="px-4 py-2 rounded bg-indigo-600 text-white hover:bg-indigo-700 active:bg-indigo-800"
            >
                Tìm
            </button>

            <label className="ml-auto flex items-center gap-2">
                <span className="text-sm text-gray-600">Page size:</span>
                <select
                    value={pageSize}
                    onChange={(e) => setPageSize(parseInt(e.target.value, 10))}
                    className="px-2 py-2 rounded border border-gray-300 bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
                >
                    {[10, 20, 50, 100].map((n) => (
                        <option key={n} value={n}>
                            {n}
                        </option>
                    ))}
                </select>
            </label>
        </form>
    )
}
