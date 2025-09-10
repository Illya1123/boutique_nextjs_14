import { Suspense } from 'react'
import CheckoutSuccessClient from './CheckoutSuccessClient'

export default function CheckoutSuccessPage() {
    return (
        <Suspense
            fallback={
                <div className="max-w-2xl px-4 py-10 mx-auto">
                    <div className="p-6 bg-white border rounded-2xl dark:bg-gray-900 dark:border-gray-800">
                        <h1 className="mb-1 text-2xl font-semibold">Thanh toán</h1>
                        <p className="text-sm text-gray-600">Đang tải kết quả…</p>
                    </div>
                </div>
            }
        >
            <CheckoutSuccessClient />
        </Suspense>
    )
}
