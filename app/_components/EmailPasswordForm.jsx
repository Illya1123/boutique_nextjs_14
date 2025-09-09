'use client'
import { useState } from 'react'
import { signIn } from 'next-auth/react'
import { useRouter } from 'next/navigation'

export default function EmailPasswordForm() {
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState('')
    const router = useRouter()

    const onSubmit = async (e) => {
        e.preventDefault()
        setError('')
        setLoading(true)
        const res = await signIn('credentials', {
            email,
            password,
            redirect: false,
        })
        setLoading(false)
        if (res?.error) {
            setError('Email hoặc mật khẩu không đúng')
            return
        }
        router.replace('/')
    }

    return (
        <form onSubmit={onSubmit} className="w-full flex flex-col gap-3">
            <div>
                <label className="block text-sm font-medium mb-1">Email</label>
                <input
                    type="email"
                    className="w-full rounded-lg border px-3 py-2 bg-white/80"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="you@example.com"
                    required
                />
            </div>
            <div>
                <label className="block text-sm font-medium mb-1">Mật khẩu</label>
                <input
                    type="password"
                    className="w-full rounded-lg border px-3 py-2 bg-white/80"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="••••••••"
                    required
                />
            </div>
            {error && <p className="text-red-600 text-sm">{error}</p>}
            <button
                type="submit"
                disabled={loading}
                className="w-full rounded-lg bg-gray-900 text-white py-2 font-medium hover:opacity-90 disabled:opacity-60"
            >
                {loading ? 'Đang đăng nhập…' : 'Đăng nhập'}
            </button>
        </form>
    )
}
