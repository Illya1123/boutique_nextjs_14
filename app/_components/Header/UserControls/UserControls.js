'use client'
import CartControl from './CartControl'
import LoginControl from './LoginControl'
import WishControl from './WishControl'

function UserControls({session}) {
    return (
        <div className="flex space-x-3 justify-between gap-2 py-3 text-gray-800 dark:text-white">
            <LoginControl session={session}/>
            <CartControl />
            <WishControl />
        </div>
    )
}

export default UserControls
