'use client'
import { useState } from 'react'
import { signIn } from 'next-auth/react'
import { useRouter } from 'next/navigation'

export default function RegisterForm() {
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const [name, setName] = useState('')
    const [msg, setMsg] = useState('')
    const [loading, setLoading] = useState(false)
    const router = useRouter()

    const onSubmit = async (e) => {
        e.preventDefault()
        setMsg('')
        setLoading(true)

        if (password.length < 8) {
            setMsg('Mật khẩu tối thiểu 8 ký tự')
            setLoading(false)
            return
        }

        const res = await fetch('/api/auth/register', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ email, password, name }),
        })
        const data = await res.json()

        if (!res.ok) {
            setLoading(false)
            setMsg(data?.message || 'Lỗi')
            return
        }

        // Auto sign-in bằng credentials
        const sign = await signIn('credentials', {
            email,
            password,
            redirect: false,
        })

        setLoading(false)

        if (sign?.error) {
            // Trường hợp hiếm (đăng ký ok nhưng login lỗi)
            setMsg('Tạo xong nhưng đăng nhập thất bại, hãy thử đăng nhập thủ công.')
            return
        }

        router.replace('/')
    }

    return (
        <form onSubmit={onSubmit} className="w-full flex flex-col gap-3">
            <input
                className="border rounded px-3 py-2"
                placeholder="Tên tài khoản"
                value={name}
                onChange={(e) => setName(e.target.value)}
            />
            <input
                className="border rounded px-3 py-2"
                placeholder="Email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
            />
            <input
                className="border rounded px-3 py-2"
                placeholder="Mật khẩu (min 8 ký tự)"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
            />
            {msg && <p className="text-sm">{msg}</p>}
            <button className="bg-gray-900 text-white rounded px-4 py-2" disabled={loading}>
                {loading ? 'Đang tạo…' : 'Tạo tài khoản'}
            </button>
        </form>
    )
}
