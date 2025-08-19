import './globals.css'
import { Itim } from 'next/font/google'
import ClientProviders from './ClientProviders'

const itim = Itim({ subsets: ['latin'], weight: '400' })

export const metadata = {
    title: 'Boutique',
    description: 'Thiên đường của thời trang',
}

export default function RootLayout({ children }) {
    return (
        <html lang="en" className={itim.className}>
            <body>
                <ClientProviders>{children}</ClientProviders>
            </body>
        </html>
    )
}
