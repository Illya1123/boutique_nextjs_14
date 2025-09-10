import { auth } from '@/app/_lib/auth'
import { redirect } from 'next/navigation'
import OrdersClient from './OrdersClient'

export const metadata = {
    title: 'Đơn hàng của tôi',
    description: 'Xem lịch sử mua hàng và trạng thái xử lý đơn.',
}

export default async function Page() {
    const session = await auth()
    if (!session?.user?.email) redirect('/login')

    return (
        <main className="max-w-4xl px-4 py-8 mx-auto">
            <h2 className="mb-4 text-2xl font-semibold text-accent-400">Đơn hàng của tôi</h2>
            <p className="mb-8 text-lg text-primary-200">
                Xem lịch sử mua hàng và trạng thái xử lý đơn.
            </p>
            <OrdersClient />
        </main>
    )
}
