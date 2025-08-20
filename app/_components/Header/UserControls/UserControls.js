'use client'
import CartControl from './CartControl'
import LoginControl from './LoginControl'
import WishControl from './WishControl'
import Link from 'next/link'

function UserControls({ session }) {
    const isAdmin = session?.user?.role === 'admin'

    return (
        <div className="flex items-center space-x-3 py-3 text-gray-800 dark:text-white">
            {/* Login */}
            <LoginControl session={session} />

            {/* Các control khác */}
            <div className="flex items-center space-x-3">
                <CartControl />
                <WishControl />
                {isAdmin && (
                    <Link
                        href="/admin"
                        className="px-3 py-1 bg-blue-600 text-white rounded hover:bg-blue-700 transition-colors"
                    >
                        Admin
                    </Link>
                )}
            </div>
        </div>
    )
}

export default UserControls
