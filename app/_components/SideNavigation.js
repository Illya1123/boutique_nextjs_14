'use client'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import SignOutButton from './SignOutButton'

function SideNavigation({ navLinks }) {
    const pathname = usePathname()

    return (
        <nav className="border-r border-primary-900 flex flex-col">
            <ul className="flex flex-col gap-2 text-lg">
                {navLinks.map((link) => (
                    <li key={link.name}>
                        <Link
                            href={link.href}
                            className={`py-3 px-5 hover:bg-primary-900 hover:text-primary-100 transition-colors flex items-center gap-4 font-semibold text-primary-200 ${
                                pathname === link.href ? 'bg-primary-900' : ''
                            }`}
                        >
                            {link.icon}
                            <span>{link.name}</span>
                        </Link>
                    </li>
                ))}
            </ul>

            <div className="mt-4 p-3">
                <SignOutButton />
            </div>
        </nav>
    )
}

export default SideNavigation
