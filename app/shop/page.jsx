'use client'

import { useEffect, useState } from 'react'
import SidebarFilter from './SidebarFilter'

export default function ShopPage() {
    const [products, setProducts] = useState([])
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState(null)
    const [mounted, setMounted] = useState(false)

    useEffect(() => {
        setMounted(true) // chỉ hydrate sau khi client mount

        const fetchProducts = async () => {
            try {
                setLoading(true)
                const res = await fetch('/data.json')
                if (!res.ok) throw new Error('Failed to fetch')
                const data = await res.json()
                setProducts(data)
            } catch (err) {
                console.error(err)
                setError('Không thể tải sản phẩm.')
            } finally {
                setLoading(false)
            }
        }

        fetchProducts()
    }, [])

    if (!mounted) {
        // ngăn mismatch
        return null
    }

    if (loading) {
        return <p className="p-4">Đang tải sản phẩm...</p>
    }

    if (error) {
        return <p className="p-4 text-red-600">{error}</p>
    }

    return (
        <section className="flex">
            <SidebarFilter products={products} />
        </section>
    )
}
