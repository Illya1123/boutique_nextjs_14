import AboutHero from './sections/HeroSection'
import SocialSidebar from '@/app/_components/SocialSidebar'

export const metadata = {
  title: 'Về chúng tôi | Trang bán quần áo, thời trang',
  description:
    'Giới thiệu về cửa hàng thời trang: chuyên cung cấp quần áo, phụ kiện và phong cách mới nhất.'
}

export default function AboutPage() {
  return (
    <div>
      <SocialSidebar />
      <AboutHero />
    </div>
  )
}
