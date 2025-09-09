'use client'

import { useEffect, useMemo, useState } from 'react'
import { useSelector } from 'react-redux'
import Link from 'next/link'
import Image from 'next/image'
import { useSession } from 'next-auth/react'
import Swal from 'sweetalert2'

const fVND = (n) => Number(n || 0).toLocaleString('vi-VN') + 'đ'

const fmtAddress = ({ street, ward, district, province }) => {
    const parts = []
    if (street) parts.push(street)
    if (ward?.name) parts.push(ward.name)
    if (district?.name) parts.push(district.name)
    if (province?.name) parts.push(province.name)
    return parts.join(', ')
}

const _strip = (s) => String(s || '').replace(/[\s\-._()]/g, '')

// E.164 VN (+84xxxxxxxxx) – hợp lệ thì trả chuỗi, ngược lại null
const toE164VNMobile = (raw) => {
    const s = _strip(raw)
    let body = ''
    if (s.startsWith('+84')) body = s.slice(3)
    else if (s.startsWith('84')) body = s.slice(2)
    else if (s.startsWith('0')) body = s.slice(1)
    else return null
    if (!/^[35789]\d{8}$/.test(body)) return null
    return `+84${body}`
}

export default function PaymentPage() {
    const { data: session } = useSession()
    const cartItems = useSelector((state) => state.cart.items)
    const userStore = useSelector((state) => state.user?.user ?? null)

    const [methods, setMethods] = useState([])
    const [loading, setLoading] = useState(false)
    const [message, setMessage] = useState(null)

    const [name, setName] = useState('')
    const [email, setEmail] = useState('')
    const [phone, setPhone] = useState('')
    const [phoneError, setPhoneError] = useState('')

    const [addrMode, setAddrMode] = useState('picker') // 'picker' | 'gps'
    const [vn, setVn] = useState([])
    const [provinceCode, setProvinceCode] = useState('')
    const [districtCode, setDistrictCode] = useState('')
    const [wardCode, setWardCode] = useState('')
    const [street, setStreet] = useState('')

    const [gpsLoading, setGpsLoading] = useState(false)
    const [gpsText, setGpsText] = useState('')
    const [gpsLatLng, setGpsLatLng] = useState(null)

    const [selectedMethodId, setSelectedMethodId] = useState('') // chỉ lưu lựa chọn, không auto-create

    const subtotal = useMemo(
        () => cartItems.reduce((s, i) => s + i.price * i.quantity, 0),
        [cartItems]
    )

    useEffect(() => {
        setName(userStore?.name || session?.user?.name || '')
        setEmail(userStore?.email || session?.user?.email || '')
        setPhone(userStore?.phone || session?.user?.phone || '')
    }, [session, userStore])

    useEffect(() => {
        fetch('/api/payment-methods')
            .then((r) => r.json())
            .then((data) => setMethods(data?.methods ?? []))
            .catch(() => setMethods([]))
    }, [])

    useEffect(() => {
        let cancel = false
        ;(async () => {
            try {
                const res = await fetch('/country_before_1-8.json', { cache: 'force-cache' })
                if (!res.ok) throw new Error('Không tải được dữ liệu VN')
                const j = await res.json()
                if (!cancel) setVn(j || [])
            } catch {
                if (!cancel) setVn([])
            }
        })()
        return () => {
            cancel = true
        }
    }, [])

    const districts = useMemo(() => {
        const p = vn.find((x) => String(x.code) === String(provinceCode))
        return p?.districts || []
    }, [vn, provinceCode])

    const wards = useMemo(() => {
        const d = districts.find((x) => String(x.code) === String(districtCode))
        return d?.wards || []
    }, [districts, districtCode])

    const selectedProvince = useMemo(
        () => vn.find((x) => String(x.code) === String(provinceCode)) || null,
        [vn, provinceCode]
    )
    const selectedDistrict = useMemo(
        () => districts.find((x) => String(x.code) === String(districtCode)) || null,
        [districts, districtCode]
    )
    const selectedWard = useMemo(
        () => wards.find((x) => String(x.code) === String(wardCode)) || null,
        [wards, wardCode]
    )

    useEffect(() => {
        setDistrictCode('')
        setWardCode('')
    }, [provinceCode])

    useEffect(() => {
        setWardCode('')
    }, [districtCode])

    const fetchGPS = async () => {
        setGpsLoading(true)
        setGpsText('')
        setGpsLatLng(null)
        try {
            await new Promise((resolve, reject) => {
                if (!navigator.geolocation) return reject(new Error('Trình duyệt không hỗ trợ GPS'))
                navigator.geolocation.getCurrentPosition(resolve, reject, {
                    enableHighAccuracy: true,
                    timeout: 10000,
                    maximumAge: 0,
                })
            }).then(async (pos) => {
                const { latitude, longitude } = pos.coords || {}
                setGpsLatLng({ lat: latitude, lng: longitude })
                const url = `https://nominatim.openstreetmap.org/reverse?format=jsonv2&lat=${latitude}&lon=${longitude}&zoom=18&addressdetails=1`
                const res = await fetch(url, { headers: { Accept: 'application/json' } })
                const data = await res.json()
                const addr =
                    data?.display_name ||
                    [
                        data?.address?.road,
                        data?.address?.suburb,
                        data?.address?.city || data?.address?.town || data?.address?.village,
                        data?.address?.state,
                        data?.address?.country,
                    ]
                        .filter(Boolean)
                        .join(', ')
                setGpsText(addr || 'Không xác định được địa chỉ')
            })
        } catch (e) {
            setGpsText(e?.message || 'Không thể lấy vị trí')
        } finally {
            setGpsLoading(false)
        }
    }

    const officialAddress = useMemo(() => {
        if (addrMode === 'picker') {
            return fmtAddress({
                street,
                ward: selectedWard,
                district: selectedDistrict,
                province: selectedProvince,
            })
        }
        return gpsText
    }, [addrMode, street, selectedWard, selectedDistrict, selectedProvince, gpsText])

    // ---------- validate & payload ----------
    const canCreateOrder = () => {
        if (!cartItems.length) {
            setMessage('Giỏ hàng trống — vui lòng chọn sản phẩm trước khi thanh toán.')
            Swal.fire({
                icon: 'warning',
                title: 'Giỏ hàng trống',
                text: 'Hãy thêm sản phẩm trước nhé.',
            })
            return false
        }
        if (!name?.trim() || !email?.trim()) {
            setMessage('Vui lòng điền họ tên và email.')
            Swal.fire({
                icon: 'warning',
                title: 'Thiếu thông tin',
                text: 'Vui lòng nhập họ tên và email.',
            })
            return false
        }
        if (!toE164VNMobile(phone)) {
            setMessage('Số điện thoại VN không hợp lệ.')
            Swal.fire({
                icon: 'warning',
                title: 'Số điện thoại không hợp lệ',
                text: 'Hãy nhập số di động VN hợp lệ.',
            })
            return false
        }
        if (!officialAddress?.trim()) {
            setMessage('Vui lòng nhập/nhận địa chỉ giao hàng hợp lệ.')
            Swal.fire({
                icon: 'warning',
                title: 'Thiếu địa chỉ',
                text: 'Vui lòng cung cấp địa chỉ giao hàng.',
            })
            return false
        }
        return true
    }

    const buildPayload = (id, paymentMethodId) => ({
        id,
        paymentMethodId,
        address: officialAddress || null,
        contact_phone: toE164VNMobile(phone) || null,
        items: cartItems.map((i) => ({
            product_id: String(i.productId),
            quantity: Number(i.quantity),
            price: Number(i.price),
            size: String(i.size),
        })),
    })

    const createOrder = async (methodId) => {
        setLoading(true)
        setMessage(null)
        try {
            const orderId =
                typeof crypto !== 'undefined' && crypto.randomUUID
                    ? crypto.randomUUID()
                    : `${Date.now()}-${Math.random().toString(36).slice(2)}`
            const userIdHeader =
                userStore?.guestId ||
                userStore?.id ||
                (session?.user && (session.user.id || session.user.guestId)) ||
                null

            const res = await fetch('/api/orders', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    ...(userIdHeader ? { 'x-user-id': userIdHeader } : {}),
                },
                body: JSON.stringify(buildPayload(orderId, methodId)),
            })
            const json = await res.json()
            if (!res.ok) throw new Error(json?.error || 'Tạo đơn hàng thất bại')

            setMessage(`Đặt hàng thành công! Mã đơn: ${json.order.id}`)

            await Swal.fire({
                icon: 'success',
                title: 'Đặt hàng thành công!',
                text: `Mã đơn: ${json.order.id}`,
                confirmButtonText: 'Đóng',
            })

            // TODO: reset cart nếu cần
        } catch (err) {
            const msg = err?.message || 'Có lỗi xảy ra'
            setMessage(msg)
            Swal.fire({
                icon: 'error',
                title: 'Tạo đơn thất bại',
                text: msg,
                confirmButtonText: 'Thử lại',
            })
        } finally {
            setLoading(false)
        }
    }
    // ---------------------------------------

    // Chỉ cập nhật lựa chọn, KHÔNG tạo đơn/confirm ở đây
    const onPaymentChange = (e) => {
        const id = Number(e.target.value)
        setSelectedMethodId(id)
    }

    async function handleSubmit(e) {
        e.preventDefault()
        setMessage(null)

        const form = e.currentTarget
        const formData = new FormData(form)
        const methodFromForm = Number(formData.get('paymentMethodId'))
        const methodId = Number(selectedMethodId || methodFromForm)

        if (!methodId) {
            Swal.fire({
                icon: 'warning',
                title: 'Chưa chọn phương thức thanh toán',
                text: 'Vui lòng chọn phương thức trước khi đặt hàng.',
            })
            return
        }

        if (!canCreateOrder()) return
        await createOrder(methodId)
    }

    return (
        <div className="max-w-5xl px-4 py-8 mx-auto">
            <h1 className="mb-6 text-2xl font-semibold">Thanh toán</h1>

            <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
                {/* Tóm tắt đơn hàng */}
                <section className="p-4 bg-white border border-gray-200 md:col-span-2 dark:bg-gray-900 rounded-2xl dark:border-gray-800">
                    <h2 className="mb-4 text-lg font-semibold">Tóm tắt đơn hàng</h2>

                    {cartItems.length === 0 ? (
                        <div className="flex flex-col items-center py-10">
                            <Image
                                src="/images/cart/empty_cart.png"
                                alt="Empty"
                                width={160}
                                height={160}
                            />
                            <p className="mt-3 text-sm text-gray-500">Giỏ hàng trống</p>
                            <Link href="/shop" className="mt-4 text-blue-600 hover:underline">
                                Tiếp tục mua sắm
                            </Link>
                        </div>
                    ) : (
                        <div className="space-y-4">
                            {cartItems.map((i) => (
                                <div
                                    key={i.cartItemId}
                                    className="flex items-center gap-3 pb-3 border-b last:border-b-0"
                                >
                                    <img
                                        src={i.image}
                                        alt={i.name}
                                        className="object-cover w-16 h-16 rounded"
                                    />
                                    <div className="flex-1 min-w-0">
                                        <p className="font-medium truncate">{i.name}</p>
                                        <p className="text-xs text-gray-500">
                                            {i.color ? `${i.color} / ` : ''}
                                            {i.size}
                                        </p>
                                        <p className="text-sm">
                                            {i.quantity} × {fVND(i.price)}
                                        </p>
                                    </div>
                                    <div className="font-semibold">
                                        {fVND(i.price * i.quantity)}
                                    </div>
                                </div>
                            ))}
                            <div className="flex justify-between pt-2 text-base font-semibold">
                                <span>Tạm tính</span>
                                <span>{fVND(subtotal)}</span>
                            </div>
                        </div>
                    )}
                </section>

                {/* Form thanh toán */}
                <section className="p-4 bg-white border border-gray-200 dark:bg-gray-900 rounded-2xl dark:border-gray-800">
                    <h2 className="mb-4 text-lg font-semibold">Thông tin thanh toán</h2>

                    <form onSubmit={handleSubmit} className="space-y-3">
                        <div>
                            <label className="block mb-1 text-sm">Họ và tên</label>
                            <input
                                name="name"
                                required
                                className="w-full px-3 py-2 bg-transparent border rounded-lg"
                                value={name}
                                onChange={(e) => setName(e.target.value)}
                                autoComplete="name"
                            />
                        </div>
                        <div>
                            <label className="block mb-1 text-sm">Email</label>
                            <input
                                name="email"
                                type="email"
                                required
                                className="w-full px-3 py-2 bg-transparent border rounded-lg"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                autoComplete="email"
                                readOnly
                            />
                        </div>
                        <div>
                            <label className="block mb-1 text-sm">Số điện thoại</label>
                            <input
                                name="phone"
                                required
                                className={`w-full px-3 py-2 bg-transparent border rounded-lg ${phoneError ? 'border-red-500' : ''}`}
                                value={phone}
                                onChange={(e) => {
                                    setPhone(e.target.value)
                                    if (!e.target.value)
                                        setPhoneError('Vui lòng nhập số điện thoại')
                                    else
                                        setPhoneError(
                                            toE164VNMobile(e.target.value)
                                                ? ''
                                                : 'Số điện thoại VN không hợp lệ'
                                        )
                                }}
                                onBlur={() => {
                                    if (phone)
                                        setPhoneError(
                                            toE164VNMobile(phone)
                                                ? ''
                                                : 'Số điện thoại VN không hợp lệ'
                                        )
                                }}
                                autoComplete="tel"
                                inputMode="tel"
                            />
                            {phoneError && (
                                <p className="mt-1 text-xs text-red-600">{phoneError}</p>
                            )}
                        </div>

                        {/* Địa chỉ */}
                        <div className="mt-4">
                            <label className="block mb-2 text-sm font-medium">
                                Địa chỉ giao hàng
                            </label>

                            <div className="flex items-center gap-4 mb-3">
                                <label className="inline-flex items-center gap-2">
                                    <input
                                        type="radio"
                                        name="addrMode"
                                        value="picker"
                                        checked={addrMode === 'picker'}
                                        onChange={() => setAddrMode('picker')}
                                    />
                                    <span>Chọn từ Tỉnh/Quận/Phường</span>
                                </label>
                                <label className="inline-flex items-center gap-2">
                                    <input
                                        type="radio"
                                        name="addrMode"
                                        value="gps"
                                        checked={addrMode === 'gps'}
                                        onChange={() => setAddrMode('gps')}
                                    />
                                    <span>Dùng GPS</span>
                                </label>
                            </div>

                            {addrMode === 'picker' ? (
                                <div className="grid grid-cols-1 gap-3">
                                    <div className="grid grid-cols-1 gap-3">
                                        <select
                                            className="px-3 py-2 bg-transparent border rounded-lg"
                                            value={provinceCode}
                                            onChange={(e) => setProvinceCode(e.target.value)}
                                        >
                                            <option value="">— Chọn Tỉnh/Thành —</option>
                                            {vn.map((p) => (
                                                <option key={p.code} value={p.code}>
                                                    {p.name}
                                                </option>
                                            ))}
                                        </select>

                                        <select
                                            className="px-3 py-2 bg-transparent border rounded-lg"
                                            value={districtCode}
                                            onChange={(e) => setDistrictCode(e.target.value)}
                                            disabled={!provinceCode}
                                        >
                                            <option value="">— Chọn Quận/Huyện —</option>
                                            {districts.map((d) => (
                                                <option key={d.code} value={d.code}>
                                                    {d.name}
                                                </option>
                                            ))}
                                        </select>

                                        <select
                                            className="px-3 py-2 bg-transparent border rounded-lg"
                                            value={wardCode}
                                            onChange={(e) => setWardCode(e.target.value)}
                                            disabled={!districtCode}
                                        >
                                            <option value="">— Chọn Phường/Xã —</option>
                                            {wards.map((w) => (
                                                <option key={w.code} value={w.code}>
                                                    {w.name}
                                                </option>
                                            ))}
                                        </select>
                                    </div>

                                    <input
                                        className="w-full px-3 py-2 bg-transparent border rounded-lg"
                                        placeholder="Số nhà, tên đường (ví dụ: 12 Nguyễn Huệ)"
                                        value={street}
                                        onChange={(e) => setStreet(e.target.value)}
                                    />

                                    <div className="p-2 text-sm text-gray-600 bg-gray-50 rounded-lg">
                                        <div className="font-medium">Địa chỉ chuẩn:</div>
                                        <div>{officialAddress || '—'}</div>
                                    </div>
                                </div>
                            ) : (
                                <div className="grid grid-cols-1 gap-3">
                                    <div className="flex items-center gap-2">
                                        <button
                                            type="button"
                                            onClick={fetchGPS}
                                            disabled={gpsLoading}
                                            className="px-3 py-2 text-sm text-white bg-teal-600 rounded-lg hover:bg-teal-700 disabled:opacity-60"
                                        >
                                            {gpsLoading ? 'Đang lấy GPS…' : 'Lấy vị trí hiện tại'}
                                        </button>
                                        {gpsLatLng && (
                                            <span className="text-xs text-gray-500">
                                                ({gpsLatLng.lat.toFixed(5)},{' '}
                                                {gpsLatLng.lng.toFixed(5)})
                                            </span>
                                        )}
                                    </div>

                                    <input
                                        className="w-full px-3 py-2 bg-transparent border rounded-lg"
                                        value={gpsText}
                                        readOnly
                                        placeholder="Địa chỉ (tự động điền bằng GPS)"
                                    />

                                    <div className="p-2 text-sm text-gray-600 bg-gray-50 rounded-lg">
                                        <div className="font-medium">Địa chỉ chuẩn:</div>
                                        <div>{officialAddress || '—'}</div>
                                    </div>
                                </div>
                            )}
                        </div>

                        {/* Phương thức thanh toán */}
                        <div>
                            <label className="block mb-1 text-sm">Phương thức thanh toán</label>
                            <select
                                name="paymentMethodId"
                                required
                                className="w-full px-3 py-2 bg-transparent border rounded-lg"
                                value={selectedMethodId}
                                onChange={onPaymentChange}
                            >
                                <option value="" disabled>
                                    Chọn phương thức
                                </option>
                                {methods.map((m) => (
                                    <option key={m.id} value={m.id}>
                                        {m.name}
                                    </option>
                                ))}
                            </select>
                            {methods.length === 0 && (
                                <p className="mt-1 text-xs text-amber-600">
                                    Không có phương thức nào khả dụng — hãy seed bảng PaymentMethod.
                                </p>
                            )}
                        </div>

                        <button
                            type="submit"
                            disabled={loading}
                            className="inline-flex items-center justify-center w-full py-2 text-white bg-blue-600 rounded-lg hover:bg-blue-700 disabled:opacity-60"
                        >
                            {loading ? 'Đang tạo đơn…' : 'Đặt hàng'}
                        </button>

                        {message && (
                            <p
                                className={`text-sm mt-2 ${
                                    message.startsWith('Đặt hàng thành công')
                                        ? 'text-green-600'
                                        : 'text-red-600'
                                }`}
                            >
                                {message}
                            </p>
                        )}
                    </form>
                </section>
            </div>
        </div>
    )
}
