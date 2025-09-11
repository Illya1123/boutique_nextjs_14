'use client'

import PaymentMethodsCard from '@/app/_components/Admin/setting/PaymentMethodsCard'
import BlogCategoriesCard from '@/app/_components/Admin/setting/BlogCategoriesCard'

export default function AdminSettingPage() {
    return (
        <div className="p-5 space-y-10">
            <h1 className="text-2xl font-semibold">Settings</h1>

            <section>
                <h2 className="text-xl font-semibold mb-3">Phương thức thanh toán</h2>
                <PaymentMethodsCard />
            </section>

            <section>
                <h2 className="text-xl font-semibold mb-3">Blog Categories</h2>
                <BlogCategoriesCard />
            </section>
        </div>
    )
}
