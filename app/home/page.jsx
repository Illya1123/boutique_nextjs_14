import HeroSection from "./sections/HeroSection"
import FeaturesSection from "./sections/FeaturesSection"
import ProductsSection from "./sections/ProductsSection"
import ContactSection from "./sections/ContactSection"

export default function HomePage() {
  return (
    <main>
      <HeroSection />
      <FeaturesSection />
      <ProductsSection />
      <ContactSection />
    </main>
  )
}
