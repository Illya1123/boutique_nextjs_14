'use client'

import axios from 'axios'
import { useEffect, useState } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import { setProducts } from '@/store/productSlice'
import { slugify } from '@/app/_utils/slugify'
import AppBreadcrumb from '@/app/_components/Breadcrumb'

function ProductDetailPayment({searchParams }) {
    const dispatch = useDispatch()
    const products = useSelector((state) => state.cart.items)
    const [product, setProduct] = useState([])
    const [selectedVariant, setSelectedVariant] = useState(null)

    return ( 
        <div className='max-w-6xl p-6 mx-auto'>
            <div className='grid-cols-2 gap-10 mt-6'>
                <div>
                    <span>
                        Địa chỉ:
                    </span>
                </div>
            </div>
        </div>
     );
}

export default ProductDetailPayment;