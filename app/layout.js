import './globals.css'
import { Itim, Cormorant_Garamond, Poppins } from 'next/font/google'
import ClientProviders from './ClientProviders'

const itim = Itim({ subsets: ['latin'], weight: '400' })
const cormorant_garamond = Cormorant_Garamond({
    subsets: ['latin'],
    variable: '--font-cormorant-garamond',
    weight: ['400'],
})

const poppins = Poppins({
    subnet: ['latin'],
    variable: '--font-poppins',
    weight: ['400', '600'],
    preload: false,
})

export const metadata = {
    title: 'Boutique',
    description: 'Thiên đường của thời trang',
    icons: {
        icon: '/favicon.ico',
    },
}

export default function RootLayout({ children }) {
    return (
        <html lang="en" className={itim.className}>
            <body className={`${cormorant_garamond.variable} ${poppins.variable}`}>
                <ClientProviders>{children}</ClientProviders>
            </body>
        </html>
    )
}
