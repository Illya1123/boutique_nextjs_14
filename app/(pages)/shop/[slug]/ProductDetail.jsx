'use client'

import axios from 'axios'
import { useEffect, useState } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import { setProducts } from '@/store/productSlice'
import { slugify } from '@/app/_utils/slugify'
import AppBreadcrumb from '@/app/_components/Breadcrumb'
import ProductImages from './ProductImages'
import ProductInfo from './ProductInfo'

export default function ProductDetail({ params, searchParams }) {
    const dispatch = useDispatch()
    const products = useSelector((state) => state.products.items)
    const [product, setProduct] = useState(null)
    const [selectedVariant, setSelectedVariant] = useState(null)

    useEffect(() => {
        const fetchProduct = async () => {
            try {
                if (!products || products.length === 0) {
                    const res = await axios.get(`/api/products?id=${searchParams?.id}`)
                    const prod = res.data?.product
                    if (prod) {
                        setProduct(prod)
                        dispatch(setProducts([prod]))
                    }
                } else {
                    const prod = products.find((p) => slugify(p.name) === params.slug)
                    if (prod) setProduct(prod)
                }
            } catch (error) {
                console.error('Lỗi khi lấy sản phẩm:', error)
            }
        }

        fetchProduct()
    }, [products, params.slug, searchParams?.id, dispatch])

    useEffect(() => {
        if (product && product.variants?.length > 0) {
            // nếu có variantId trong url → chọn variant đó
            if (searchParams?.variantId) {
                const found = product.variants.find(
                    (v) => String(v.id) === String(searchParams.variantId)
                )
                if (found) {
                    setSelectedVariant(found)
                    return
                }
            }
            // mặc định nếu không có query
            setSelectedVariant(product.variants[0])
        }
    }, [product, searchParams?.variantId])

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
                <ProductInfo
                    product={product}
                    variant={selectedVariant}
                    setVariant={setSelectedVariant}
                    defaultSize={searchParams?.size}
                />
            </div>
        </div>
    )
}
