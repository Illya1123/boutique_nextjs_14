'use client'

import { useRequireAdmin } from '@/hooks/useRequireAdmin'
import SideNavigation from '@/app/_components/SideNavigation'
import navLinks from '@/app/data/NavLinkAdmin'

export default function AdminLayout({ children }) {
    const { isLoading } = useRequireAdmin()

    if (isLoading) {
        return (
            <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100">
                <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-b-4 border-blue-600 mb-4"></div>
                <p className="text-gray-700 text-lg">Đang kiểm tra quyền truy cập...</p>
            </div>
        )
    }

    return (
        <div className="min-h-screen bg-gray-100 flex flex-col">
            <header className="bg-gray-800 text-white p-4">
                <h1 className="text-xl font-bold">Admin Panel</h1>
            </header>

            <div className="flex h-screen">
                <div className="w-64 bg-white border-r border-gray-200">
                    <SideNavigation navLinks={navLinks} />
                </div>

                <div className="flex-1 overflow-y-auto">{children}</div>
            </div>
        </div>
    )
}
