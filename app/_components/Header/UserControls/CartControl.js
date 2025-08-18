'use client'
import Link from 'next/link'
import { FaShoppingBag } from 'react-icons/fa'

function CartControl() {
    return (
        <div>
            <Link href="/cart" className="flex space-x-2 justify-between text-xl">
                <FaShoppingBag />
                <span>Cart</span>
            </Link>
        </div>
    )
}

export default CartControl
