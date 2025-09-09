'use client'
import { useSession } from 'next-auth/react'
import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import SignInButtons from '@/app/_components/SignInButton'
import EmailPasswordForm from '@/app/_components/EmailPasswordForm'
import RegisterForm from '@/app/_components/RegisterForm'

export default function LoginPage() {
    const { data: session } = useSession()
    const router = useRouter()
    const [mode, setMode] = useState('login') // 'login' | 'register'

    useEffect(() => {
        if (session) router.replace('/')
    }, [session, router])

    if (session) return null

    return (
        <main className="relative flex justify-center items-center min-h-[calc(100vh-194px)] bg-gray-900 overflow-hidden">
            <div className="absolute inset-0">
                <img
                    src="https://images.unsplash.com/photo-1441984904996-e0b6ba687e04?q=80&w=2070&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
                    alt="person leaning on wall while holding gray hat"
                    className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-black/50 backdrop-blur-sm"></div>
            </div>

            <div className="relative z-10 bg-white/90 backdrop-blur-md p-10 rounded-2xl shadow-2xl flex flex-col items-center gap-6 max-w-sm w-full">
                <h1 className="text-3xl font-bold text-gray-900">
                    {mode === 'login' ? 'Welcome Back!' : 'Create your account'}
                </h1>
                <p className="text-gray-700 text-center">
                    {mode === 'login'
                        ? 'Sign in to continue to your account'
                        : 'Sign up to get started'}
                </p>

                {/* Toggle */}
                <div className="w-full grid grid-cols-2 text-sm rounded-lg overflow-hidden border">
                    <button
                        className={`py-2 ${mode === 'login' ? 'bg-gray-900 text-white' : 'bg-white/60'}`}
                        onClick={() => setMode('login')}
                    >
                        Đăng nhập
                    </button>
                    <button
                        className={`py-2 ${mode === 'register' ? 'bg-gray-900 text-white' : 'bg-white/60'}`}
                        onClick={() => setMode('register')}
                    >
                        Đăng ký
                    </button>
                </div>

                {/* Main form */}
                {mode === 'login' ? <EmailPasswordForm /> : <RegisterForm />}

                <div className="flex items-center gap-3 w-full">
                    <div className="h-px bg-gray-300 flex-1" />
                    <span className="text-xs text-gray-500">OR</span>
                    <div className="h-px bg-gray-300 flex-1" />
                </div>

                {/* Google OAuth */}
                <SignInButtons />
            </div>
        </main>
    )
}
