'use client'
import Link from 'next/link'
import { FaHeart } from 'react-icons/fa6'

function WishControl() {
    return (
        <div>
            <Link href="/wishlist" className="flex space-x-2 justify-between text-xl">
                <FaHeart />
                <span>Wishlist</span>
            </Link>
        </div>
    )
}

export default WishControl
