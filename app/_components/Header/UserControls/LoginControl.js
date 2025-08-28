'use client'
import Link from 'next/link'
import { FaUserAlt } from 'react-icons/fa'
import { useSession } from 'next-auth/react'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'

export default function LoginControl() {
    const { data: session } = useSession()

    const getInitials = (name) => {
        if (!name) return '?'
        const parts = name.trim().split(' ')
        if (parts.length === 1) {
            return parts[0][0]?.toUpperCase() || '?'
        }
        return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase()
    }

    return (
        <div>
            {session?.user?.email ? (
                <Link
                    href="/account"
                    className="hover:text-accent-400 transition-colors flex items-center gap-4"
                >
                    <Avatar>
                        <AvatarImage src={session.user.image} />
                        <AvatarFallback>{getInitials(session.user.name)}</AvatarFallback>
                    </Avatar>
                    <span>{session.user.name}</span>
                </Link>
            ) : (
                <Link href="/login" className="flex space-x-2 justify-between text-xl">
                    <FaUserAlt />
                    <span>Login</span>
                </Link>
            )}
        </div>
    )
}
