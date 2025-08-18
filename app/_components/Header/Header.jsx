'use client'
import { useEffect, useState } from 'react'
import { useSession } from 'next-auth/react'
import { useDispatch } from 'react-redux'
import { setUser, clearUser } from '@/store/userSlice'
import Navigation from './Navigation/Navigation'
import Logo from './Logo'
import UserControls from './UserControls/UserControls'
import SearchInput from './searching/Search'

export default function Header() {
    const { data: session } = useSession()
    const dispatch = useDispatch()
    const [visible, setVisible] = useState(true)
    const [lastScrollY, setLastScrollY] = useState(0)

    useEffect(() => {
        if (session?.user) dispatch(setUser(session.user))
        else dispatch(clearUser())
    }, [session, dispatch])

    const controlHeader = () => {
        if (typeof window !== 'undefined') {
            if (window.scrollY > lastScrollY) setVisible(false)
            else setVisible(true)
            setLastScrollY(window.scrollY)
        }
    }

    useEffect(() => {
        window.addEventListener('scroll', controlHeader)
        return () => window.removeEventListener('scroll', controlHeader)
    }, [lastScrollY])

    return (
        <header
            className={`fixed top-0 left-0 w-full z-50 bg-white shadow-sm transition-transform duration-300 ${
                visible ? 'translate-y-0' : '-translate-y-full'
            }`}
        >
            <div className="flex justify-center py-2">
                <Logo name={process.env.NEXT_PUBLIC_BOUTIQUE_NAME} />
            </div>
            <div className="flex justify-center items-center space-x-6 border-t border-gray-200 py-4">
                <Navigation />
                <UserControls session={session}/>
                <SearchInput />
            </div>
        </header>
    )
}
