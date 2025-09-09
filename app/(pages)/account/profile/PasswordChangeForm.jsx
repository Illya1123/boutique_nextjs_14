'use client'

import { useState } from 'react'
import api from '@/app/_lib/axios'

export default function PasswordChangeForm({ hasPassword }) {
    const [currentPassword, setCurrentPassword] = useState('')
    const [newPassword, setNewPassword] = useState('')
    const [confirm, setConfirm] = useState('')
    const [loading, setLoading] = useState(false)
    const [msg, setMsg] = useState(null)
    const [err, setErr] = useState(null)

    const onSubmit = async (e) => {
        e.preventDefault()
        setMsg(null)
        setErr(null)

        if (newPassword.length < 8) {
            setErr('Mật khẩu mới tối thiểu 8 ký tự')
            return
        }
        if (newPassword !== confirm) {
            setErr('Mật khẩu xác nhận không khớp')
            return
        }

        setLoading(true)
        try {
            const payload = {
                newPassword,
                ...(hasPassword ? { currentPassword } : {}),
            }
            const res = await api.post('/api/account/password', payload)

            if (res.status >= 200 && res.status < 300) {
                setMsg('Cập nhật mật khẩu thành công')
                setCurrentPassword('')
                setNewPassword('')
                setConfirm('')
            } else {
                setErr(res?.data?.message || 'Cập nhật thất bại')
            }
        } catch (e) {
            const message = e?.data?.message || e?.statusText || 'Có lỗi kết nối, vui lòng thử lại'
            setErr(message)
        } finally {
            setLoading(false)
        }
    }

    const strength = (() => {
        let s = 0
        if (newPassword.length >= 8) s++
        if (/[A-Z]/.test(newPassword)) s++
        if (/[a-z]/.test(newPassword)) s++
        if (/\d/.test(newPassword)) s++
        if (/[^A-Za-z0-9]/.test(newPassword)) s++
        return s
    })()

    return (
        <form onSubmit={onSubmit} className="flex flex-col gap-4">
            {hasPassword && (
                <div>
                    <label className="block text-sm font-medium mb-1">Mật khẩu hiện tại</label>
                    <input
                        type="password"
                        className="w-full rounded-lg border px-3 py-2"
                        value={currentPassword}
                        onChange={(e) => setCurrentPassword(e.target.value)}
                        placeholder="••••••••"
                        autoComplete="current-password"
                        required
                    />
                </div>
            )}

            <div>
                <label className="block text-sm font-medium mb-1">Mật khẩu mới</label>
                <input
                    type="password"
                    className="w-full rounded-lg border px-3 py-2"
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    placeholder="Tối thiểu 8 ký tự"
                    autoComplete="new-password"
                    required
                />
                <div className="mt-2 h-2 w-full bg-gray-200 rounded">
                    <div
                        className="h-2 rounded transition-all"
                        style={{
                            width: `${(strength / 5) * 100}%`,
                            background:
                                strength <= 2 ? '#f87171' : strength === 3 ? '#fbbf24' : '#34d399',
                        }}
                    />
                </div>
                <p className="text-xs text-gray-500 mt-1">
                    Nên có chữ hoa, chữ thường, số và ký tự đặc biệt để tăng độ mạnh.
                </p>
            </div>

            <div>
                <label className="block text-sm font-medium mb-1">Xác nhận mật khẩu mới</label>
                <input
                    type="password"
                    className="w-full rounded-lg border px-3 py-2"
                    value={confirm}
                    onChange={(e) => setConfirm(e.target.value)}
                    placeholder="Nhập lại mật khẩu mới"
                    autoComplete="new-password"
                    required
                />
            </div>

            {err && <p className="text-sm text-red-600">{err}</p>}
            {msg && <p className="text-sm text-green-600">{msg}</p>}

            <div className="flex justify-end">
                <button
                    type="submit"
                    disabled={loading}
                    className="rounded-lg bg-gray-900 text-white py-2 px-4 font-medium hover:opacity-90 disabled:opacity-60"
                >
                    {loading ? 'Đang lưu…' : hasPassword ? 'Đổi mật khẩu' : 'Tạo mật khẩu'}
                </button>
            </div>
        </form>
    )
}
