'use client'
import { SessionProvider } from 'next-auth/react'
import { StoreProvider } from '@/store/StoreProvider'
import HeaderClient from './_components/Header/Header'
import ScrollToTopButton from './_components/ScrollToTopButton'

export default function ClientProviders({ children }) {
    return (
        <SessionProvider>
            <StoreProvider>
                <HeaderClient />
                <div className="pt-[194px]">
                    {children} <ScrollToTopButton />
                </div>
            </StoreProvider>
        </SessionProvider>
    )
}
