'use client'

import { useState } from 'react'
import api from '@/app/_lib/axios'

export default function ProfileClient({ account }) {
    const [name, setName] = useState(account?.name || '')
    const [phone, setPhone] = useState(account?.phone || '')
    const [saving, setSaving] = useState(false)
    const [msg, setMsg] = useState('')
    const avatar = account?.avatar
    const role = account?.role
    const email = account?.email

    const onSubmit = async (e) => {
        e.preventDefault()
        setMsg('')
        setSaving(true)
        try {
            const res = await api.patch('/api/account/profile', { name, phone })
            if (res.status >= 200 && res.status < 300) {
                setMsg('Cập nhật hồ sơ thành công')
            } else {
                setMsg(res?.data?.message || 'Cập nhật thất bại')
            }
        } catch (err) {
            const message = err?.data?.message || err?.statusText || 'Lỗi mạng, vui lòng thử lại'
            setMsg(message)
        } finally {
            setSaving(false)
        }
    }

    const isSuccess = msg.toLowerCase().includes('thành công')

    return (
        <div className="bg-white/90 backdrop-blur-md border rounded-2xl shadow p-6">
            <h3 className="text-xl font-semibold mb-4">Thông tin tài khoản</h3>

            <div className="flex gap-4 items-start mb-6">
                <div className="w-16 h-16 rounded-full overflow-hidden bg-gray-200 shrink-0">
                    {avatar ? (
                        <img src={avatar} alt="avatar" className="w-full h-full object-cover" />
                    ) : (
                        <div className="w-full h-full flex items-center justify-center text-gray-500 text-sm">
                            Không có ảnh
                        </div>
                    )}
                </div>

                <div className="grid grid-cols-2 gap-2 text-sm">
                    <div className="text-gray-500">Email</div>
                    <div className="font-medium break-all">{email}</div>

                    <div className="text-gray-500">Vai trò</div>
                    <div className="font-medium capitalize">{role}</div>

                    <div className="text-gray-500">Mã tài khoản</div>
                    <div className="font-mono break-all">{account.id}</div>
                </div>
            </div>

            <form onSubmit={onSubmit} className="grid gap-4">
                <div>
                    <label className="block text-sm font-medium mb-1">Họ và tên</label>
                    <input
                        className="w-full rounded-lg border px-3 py-2"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        placeholder="Nhập họ và tên"
                    />
                </div>

                <div>
                    <label className="block text-sm font-medium mb-1">Số điện thoại</label>
                    <input
                        className="w-full rounded-lg border px-3 py-2"
                        value={phone || ''}
                        onChange={(e) => setPhone(e.target.value)}
                        placeholder="+84..."
                    />
                </div>

                {msg && (
                    <p className={`text-sm ${isSuccess ? 'text-green-600' : 'text-red-600'}`}>
                        {msg}
                    </p>
                )}

                <div className="flex justify-end">
                    <button
                        type="submit"
                        disabled={saving}
                        className="rounded-lg bg-gray-900 text-white py-2 px-4 font-medium hover:opacity-90 disabled:opacity-60"
                    >
                        {saving ? 'Đang lưu…' : 'Lưu thay đổi'}
                    </button>
                </div>
            </form>
        </div>
    )
}
