'use client'
import Link from 'next/link'
function Logo(props) {
    return (
        <div className="flex justify-center text-gray-800">
            <Link href="/" className="flex text-4xl uppercase py-5">
                {props.name}
            </Link>
        </div>
    )
}

export default Logo
