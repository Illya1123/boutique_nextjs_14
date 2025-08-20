'use client'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import navItems from '@/app/data/NavItem'

function Navigation() {
    const pathname = usePathname() || '/'
    
    // chuẩn hóa pathname: bỏ trailing slash
    const cleanPathname = pathname.replace(/\/$/, '') || '/'

    return (
        <nav className="flex justify-center">
            <ul className="flex space-x-6 text-lg font-thin uppercase items-center">
                {navItems.map((item) => {
                    const isActive =
                        item.path === '/'
                            ? cleanPathname === '/'
                            : cleanPathname.startsWith(item.path)

                    return (
                        <li key={item.id}>
                            <Link
                                href={item.path}
                                className={`transition-colors duration-300 px-3 ${
                                    isActive
                                        ? 'text-blue-600 border-b-2 border-blue-600 font-medium'
                                        : 'text-gray-700 hover:text-blue-500'
                                }`}
                            >
                                {item.name}
                            </Link>
                        </li>
                    )
                })}
            </ul>
        </nav>
    )
}

export default Navigation
