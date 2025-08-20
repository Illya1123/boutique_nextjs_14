'use client'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { useState } from 'react'
import { Menu, X } from 'lucide-react'
import navItems from '@/app/data/NavItem'

function NavigationMobile() {
    const pathname = usePathname() || '/'
    const [isOpen, setIsOpen] = useState(false)

    const cleanPathname = pathname.replace(/\/$/, '') || '/'

    return (
        <div className="relative lg:hidden w-full">
    <button
        className="p-2 relative z-50"
        onClick={() => setIsOpen(!isOpen)}
        aria-label="Toggle Menu"
    >
        {isOpen ? <X size={28} /> : <Menu size={28} />}
    </button>

    <div
        className={`absolute top-full left-0 w-full bg-white shadow-md transition-all duration-300 z-40 ${
            isOpen ? 'max-h-[80vh] visible opacity-100' : 'max-h-0 invisible opacity-0'
        } overflow-y-auto`}
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
