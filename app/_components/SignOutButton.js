'use client'
import { ArrowRightOnRectangleIcon } from '@heroicons/react/24/solid'
import { signOut } from 'next-auth/react'
import { useRouter } from 'next/navigation'

export default function SignOutButton() {
    const router = useRouter()

    const handleSignOut = async () => {
        await signOut({ redirect: false })
        router.push('/')
    }

    return (
        <button
            onClick={handleSignOut}
            className="py-3 px-5 hover:bg-primary-900 hover:text-primary-100 transition-colors flex items-center gap-4 font-semibold text-primary-200 w-full"
        >
            <ArrowRightOnRectangleIcon className="h-5 w-5 text-primary-600" />
            <span>Sign out</span>
        </button>
    )
}
