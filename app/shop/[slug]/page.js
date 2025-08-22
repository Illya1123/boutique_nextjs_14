import axios from 'axios'
import ProductDetail from './ProductDetail'

export async function generateMetadata({ params, searchParams }) {
  // gọi API để lấy sản phẩm theo slug hoặc id
  const res = await axios.get(
    `${process.env.NEXT_PUBLIC_SITE_URL}/api/products?id=${searchParams?.id}`
  )
  const product = res.data?.product

  if (!product) {
    return {
      title: 'Sản phẩm không tồn tại',
      description: 'Không tìm thấy sản phẩm này',
    }
  }

  return {
    title: `${product.name} – Boutique`,
    description: product.description || 'Chi tiết sản phẩm thời trang',
    openGraph: {
      title: product.name,
      description: product.description,
      images: [product.image || '/default-og.png'],
    },
  }
}

export default function ProductPage({ params, searchParams }) {
  return <ProductDetail params={params} searchParams={searchParams} />
}

