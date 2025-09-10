'use client'

import { useEffect, useMemo, useState } from 'react'
import Swal from 'sweetalert2'
import { toE164VNMobile, fmtAddress, buildPayOSDescription } from '@/app/_lib/payment-utils'

export default function PaymentForm({
    cartItems,
    session,
    userStore,
    methods,
    selectedMethodId,
    onPaymentChange,
    payableTotal,
    loading,
    setLoading,
    message,
    setMessage,
}) {
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

    // ---- init form from session/store
    useEffect(() => {
        setName(userStore?.name || session?.user?.name || '')
        setEmail(userStore?.email || session?.user?.email || '')
        setPhone(userStore?.phone || session?.user?.phone || '')
    }, [session, userStore])

    // ---- load VN provinces
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

            // CK nhanh (methodId === 3) -> tạo link PayOS
            if (Number(methodId) === 3) {
                const description = buildPayOSDescription(orderId)

                const payRes = await fetch('/api/payments/payos/create-link', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({
                        orderId,
                        amount: Math.round(payableTotal), // đảm bảo số nguyên VND
                        description, // ≤ 25 ký tự
                        buyer: { name, email, phone: toE164VNMobile(phone) },
                    }),
                })

                const payJson = await payRes.json()
                const checkoutUrl = payJson?.data?.checkoutUrl || payJson?.checkoutUrl
                if (!payRes.ok || !checkoutUrl) {
                    const reason =
                        payJson?.error ||
                        payJson?.desc ||
                        payJson?.message ||
                        'Không tạo được link PayOS'
                    throw new Error(reason)
                }

                // (tuỳ chọn) tạo đơn pending trước khi chuyển hướng
                await fetch('/api/orders', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                        ...(userIdHeader ? { 'x-user-id': userIdHeader } : {}),
                    },
                    body: JSON.stringify({
                        ...buildPayload(orderId, methodId),
                        // payos_order_code: payJson.data.orderCode, // nếu bạn đã thêm cột map
                    }),
                }).catch(() => {})

                // lưu để trang success/cancel có thể đối chiếu
                localStorage.setItem('lastOrderId', orderId)

                // chuyển hướng
                window.location.href = checkoutUrl
                return
            }

            // Phương thức khác (COD, MoMo, v.v…)
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

    // ------------ submit ------------
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
                            if (!e.target.value) setPhoneError('Vui lòng nhập số điện thoại')
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
                                    toE164VNMobile(phone) ? '' : 'Số điện thoại VN không hợp lệ'
                                )
                        }}
                        autoComplete="tel"
                        inputMode="tel"
                    />
                    {phoneError && <p className="mt-1 text-xs text-red-600">{phoneError}</p>}
                </div>

                {/* Địa chỉ */}
                <div className="mt-4">
                    <label className="block mb-2 text-sm font-medium">Địa chỉ giao hàng</label>

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

                            <div className="p-2 text-sm text-gray-600 rounded-lg bg-gray-50">
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
                                        ({gpsLatLng.lat.toFixed(5)}, {gpsLatLng.lng.toFixed(5)})
                                    </span>
                                )}
                            </div>

                            <input
                                className="w-full px-3 py-2 bg-transparent border rounded-lg"
                                value={gpsText}
                                readOnly
                                placeholder="Địa chỉ (tự động điền bằng GPS)"
                            />

                            <div className="p-2 text-sm text-gray-600 rounded-lg bg-gray-50">
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
                                {m.id === 3 ? `${m.name} (+2.000đ)` : m.name}
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
    )
}
