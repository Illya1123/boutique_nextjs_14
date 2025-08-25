import { Truck, ShieldCheck, CreditCard, Headphones, Gift, Leaf } from 'lucide-react'
import FormatCurrency from '@/app/_utils/VietnamCurrency'

const data = [
    {
        id: 1,
        feature: 'Free Shipping',
        description: `Enjoy free delivery on all orders over ${FormatCurrency(1000000)}, straight to your door.`,
        icon: Truck,
        color: 'text-blue-600',
    },
    {
        id: 2,
        feature: 'Secure Payment',
        description: 'Multiple safe payment options including MoMo, Visa, and ZaloPay.',
        icon: CreditCard,
        color: 'text-green-600',
    },
    {
        id: 3,
        feature: 'Quality Guarantee',
        description: 'Premium fashion items with easy 7-day returns and warranty support.',
        icon: ShieldCheck,
        color: 'text-purple-600',
    },
    {
        id: 4,
        feature: '24/7 Support',
        description: 'Friendly customer service always available to help you anytime.',
        icon: Headphones,
        color: 'text-red-600',
    },
    {
        id: 5,
        feature: 'Exclusive Offers',
        description: 'Special discounts and deals only for our loyal members.',
        icon: Gift,
        color: 'text-yellow-600',
    },
    {
        id: 6,
        feature: 'Eco-Friendly Packaging',
        description: 'We use sustainable packaging to protect the environment.',
        icon: Leaf,
        color: 'text-green-700',
    },
]

export default function FeaturesSection() {
    return (
        <section className="py-20 bg-gray-100 text-center">
            <h2 className="text-3xl font-semibold mb-12">Why Choose Boutique?</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 px-6 max-w-6xl mx-auto">
                {data.map((item) => {
                    const Icon = item.icon
                    return (
                        <div
                            key={item.id}
                            className="p-8 bg-white rounded-2xl shadow hover:shadow-lg transition"
                        >
                            <Icon className={`w-12 h-12 mx-auto mb-4 ${item.color}`} />
                            <h3 className="text-xl font-semibold mb-2">{item.feature}</h3>
                            <p className="text-gray-600">{item.description}</p>
                        </div>
                    )
                })}
            </div>
        </section>
    )
}
