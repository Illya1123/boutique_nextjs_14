'use client'

import axios from 'axios'
import { useEffect, useState } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import { setProducts } from '@/store/productSlice'
import { slugify } from '@/app/_utils/slugify'
import AppBreadcrumb from '@/app/_components/Breadcrumb'
import ProductImages from './ProductImages'
import ProductInfo from './ProductInfo'

export default function ProductDetail({ params }) {
    const dispatch = useDispatch()
    const products = useSelector((state) => state.products.items)
    const [selectedVariant, setSelectedVariant] = useState(null)

    useEffect(() => {
        if (!products || products.length === 0) {
            const fetchProducts = async () => {
                try {
                    const res = await axios.get('/api/products')
                    dispatch(setProducts(res.data.products || []))
                } catch (error) {
                    console.error('Lỗi khi lấy sản phẩm:', error)
                }
            }
            fetchProducts()
        }
    }, [products, dispatch])

    const product = products.find((p) => slugify(p.name) === params.slug)

    useEffect(() => {
        if (product && product.variants?.length > 0) {
            setSelectedVariant(product.variants[0])
        }
    }, [product])

    if (!product) return <p className="text-center py-10">Sản phẩm không tồn tại.</p>

    return (
        <div className="max-w-6xl mx-auto p-6">
            <AppBreadcrumb
                items={[
                    { label: 'Trang chủ', href: '/' },
                    { label: 'Shop', href: '/shop' },
                    { label: product.name },
                ]}
            />

            <div className="grid grid-cols-1 md:grid-cols-2 gap-10 mt-6">
                <ProductImages variant={selectedVariant} />
                <ProductInfo product={product} variant={selectedVariant} setVariant={setSelectedVariant} />
            </div>
        </div>
    )
}
