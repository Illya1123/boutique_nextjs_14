'use client'

import { useEffect } from 'react'
import { useSession } from 'next-auth/react'
import { useRouter } from 'next/navigation'

export function useRequireAdmin() {
    const { data: session, status } = useSession()
    const router = useRouter()

    useEffect(() => {
        if (status === 'loading') return
        if (!session?.user?.role || session.user.role !== 'admin') {
            router.push('/not-admin')
        }
    }, [session, status, router])

    const isLoading = status === 'loading' || !session?.user?.role || session.user.role !== 'admin'

    return { session, isLoading }
}
