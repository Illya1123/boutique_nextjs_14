'use client'
import { SessionProvider } from 'next-auth/react'
import { StoreProvider } from '@/store/StoreProvider'
import HeaderClient from './_components/Header/Header'

export default function ClientProviders({ children }) {
    return (
        <SessionProvider>
            <StoreProvider>
                <HeaderClient />
                <div className="pt-[182px]">{children}</div>
            </StoreProvider>
        </SessionProvider>
    )
}
