'use client'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { useState } from 'react'
import { Menu, X } from 'lucide-react'

function NavigationMobile() {
    const pathname = usePathname() || '/'
    const [isOpen, setIsOpen] = useState(false)

    const navItems = [
        { id: 1, name: 'Home', path: '/home' },
        { id: 2, name: 'About', path: '/about' },
        { id: 3, name: 'Services', path: '/services' },
        { id: 4, name: 'Shop', path: '/shop' },
        { id: 5, name: 'Blog', path: '/blog' },
        { id: 6, name: 'Portfolio', path: '/portfolio' },
        { id: 7, name: 'Contact', path: '/contact' },
        { id: 8, name: 'Faq', path: '/faq' },
    ]

    const cleanPathname = pathname.replace(/\/$/, '') || '/'

    return (
        <div className="relative lg:hidden w-full">
            <button
                className="p-2 z-60 relative"
                onClick={() => setIsOpen(!isOpen)}
                aria-label="Toggle Menu"
            >
                {isOpen ? <X size={28} /> : <Menu size={28} />}
            </button>

            <div
                className={`absolute top-full left-0 w-full bg-white shadow-md overflow-hidden transition-all duration-300 z-60 ${
                    isOpen ? 'max-h-[80vh] visible opacity-100' : 'max-h-0 invisible opacity-0'
                }`}
            >
                <ul className="flex flex-col px-6 py-4 space-y-4 text-lg uppercase font-medium">
                    {navItems.map((item) => {
                        const isActive =
                            item.path === '/'
                                ? cleanPathname === '/'
                                : cleanPathname.startsWith(item.path)

                        return (
                            <li key={item.id}>
                                <Link
                                    href={item.path}
                                    onClick={() => setIsOpen(false)}
                                    className={`block transition-colors ${
                                        isActive
                                            ? 'text-blue-600 font-semibold'
                                            : 'text-gray-700 hover:text-blue-500'
                                    }`}
                                >
                                    {item.name}
                                </Link>
                            </li>
                        )
                    })}
                </ul>
            </div>
        </div>
    )
}

export default NavigationMobile
