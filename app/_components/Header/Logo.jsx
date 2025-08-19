'use client'
import Link from 'next/link'
function Logo(props) {
    return (
        <div className="flex justify-center text-gray-800">
            <Link href="/" className="flex text-3xl uppercase py-2">
                {props.name}
            </Link>
        </div>
    )
}

export default Logo
