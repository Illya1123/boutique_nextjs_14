'use client'
import CartControl from './CartControl'
import LoginControl from './LoginControl'
import WishControl from './WishControl'

function UserControls({ session }) {
    return (
        <div className="flex items-center gap-3 py-3 text-gray-800 dark:text-white">
            <LoginControl session={session} />
            <div className="hidden custom2xl:flex items-center gap-2">
                <CartControl />
                <WishControl />
            </div>
        </div>
    )
}

export default UserControls
