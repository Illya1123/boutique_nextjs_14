'use client'

import SidebarFilter from './SidebarFilter'
import useFetchData from '@/hooks/useFetchData'

export default function ShopPage() {
    const {data: products, loading, error} = useFetchData('/api/products')

    if (loading) {
        return <p className="p-4">Đang tải sản phẩm...</p>
    }

    if (error) {
        return <p className="p-4 text-red-600">{error}</p>
    }

    return (
        <section className="flex">
            <SidebarFilter products={products.products} />
        </section>
    )
}
