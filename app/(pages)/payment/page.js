'use client'

import { useEffect, useMemo, useState } from 'react'
import { useSelector } from 'react-redux'
import Link from 'next/link'
import Image from 'next/image'
import { useSession } from 'next-auth/react'

/** Helper: format tiền VND */
const fVND = (n) => Number(n || 0).toLocaleString('vi-VN') + 'đ'

/** Helper: chuẩn hoá địa chỉ hiển thị */
const fmtAddress = ({ street, ward, district, province }) => {
  const parts = []
  if (street) parts.push(street)
  if (ward?.name) parts.push(ward.name)
  if (district?.name) parts.push(district.name)
  if (province?.name) parts.push(province.name)
  return parts.join(', ')
}

/** Chuẩn hoá chuỗi: bỏ khoảng trắng, dấu, ngoặc */
const _strip = (s) => String(s || '').replace(/[\s\-._()]/g, '')

/** 
 * Trả về số di động VN dạng E.164 (+84xxxxxxxxx) nếu hợp lệ, ngược lại trả về null.
 * Hỗ trợ: 0xxxxxxxxx | +84xxxxxxxxx | 84xxxxxxxxx
 * Chỉ chấp nhận đầu số di động 3/5/7/8/9 (10 số nội địa).
 */
const toE164VNMobile = (raw) => {
  const s = _strip(raw)
  let body = ''

  if (s.startsWith('+84')) body = s.slice(3)
  else if (s.startsWith('84')) body = s.slice(2)
  else if (s.startsWith('0')) body = s.slice(1)
  else return null

  // Sau khi bỏ prefix, phải còn 9 số và bắt đầu bằng 3/5/7/8/9
  if (!/^[35789]\d{8}$/.test(body)) return null
  return `+84${body}`
}


export default function PaymentPage() {
  const { data: session } = useSession()
  const cartItems = useSelector((state) => state.cart.items)
  const userStore = useSelector((state) => state.user?.user ?? null)

  // Phương thức thanh toán
  const [methods, setMethods] = useState([])
  const [loading, setLoading] = useState(false)
  const [message, setMessage] = useState(null)

  // Thông tin KH (prefill)
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [phone, setPhone] = useState('')
  const [phoneError, setPhoneError] = useState('')

  // Địa chỉ: chọn mode "picker" hoặc "gps"
  const [addrMode, setAddrMode] = useState('picker') // 'picker' | 'gps'

  // Data hành chính VN
  const [vn, setVn] = useState([])
  const [provinceCode, setProvinceCode] = useState('')
  const [districtCode, setDistrictCode] = useState('')
  const [wardCode, setWardCode] = useState('')
  const [street, setStreet] = useState('')

  // GPS
  const [gpsLoading, setGpsLoading] = useState(false)
  const [gpsText, setGpsText] = useState('') // chuỗi địa chỉ reverse geocode
  const [gpsLatLng, setGpsLatLng] = useState(null) // { lat, lng }

  // Tính tạm tính
  const subtotal = useMemo(
    () => cartItems.reduce((s, i) => s + i.price * i.quantity, 0),
    [cartItems]
  )

  // Prefill thông tin từ session / redux store
  useEffect(() => {
    setName(userStore?.name || session?.user?.name || '')
    setEmail(userStore?.email || session?.user?.email || '')
    setPhone(userStore?.phone || '')
  }, [session, userStore])

  // Lấy payment methods
  useEffect(() => {
    fetch('/api/payment-methods')
      .then((r) => r.json())
      .then((data) => setMethods(data?.methods ?? []))
      .catch(() => setMethods([]))
  }, [])

  // Tải JSON hành chính VN (đặt tại /public/data/vn.json)
  useEffect(() => {
    let cancel = false
    ;(async () => {
      try {
        const res = await fetch('/country_before_1-8.json', { cache: 'force-cache' })
        if (!res.ok) throw new Error('Không tải được dữ liệu VN')
        const j = await res.json()
        if (!cancel) setVn(j || [])
      } catch (e) {
        console.warn(e)
        if (!cancel) setVn([])
      }
    })()
    return () => { cancel = true }
  }, [])

  // Lấy danh sách quận theo tỉnh
  const districts = useMemo(() => {
    const p = vn.find((x) => String(x.code) === String(provinceCode))
    return p?.districts || []
  }, [vn, provinceCode])

  // Lấy danh sách phường theo quận
  const wards = useMemo(() => {
    const d = districts.find((x) => String(x.code) === String(districtCode))
    return d?.wards || []
  }, [districts, districtCode])

  // Object lựa chọn hiện tại
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

  // Nếu đổi tỉnh thì reset quận/phường
  useEffect(() => {
    setDistrictCode('')
    setWardCode('')
  }, [provinceCode])

  // Nếu đổi quận thì reset phường
  useEffect(() => {
    setWardCode('')
  }, [districtCode])

  // GPS: lấy vị trí & reverse geocode
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

        // Nominatim reverse
        const url = `https://nominatim.openstreetmap.org/reverse?format=jsonv2&lat=${latitude}&lon=${longitude}&zoom=18&addressdetails=1`
        const res = await fetch(url, {
          headers: {
            // Một số triển khai yêu cầu header; giữ đơn giản:
            'Accept': 'application/json',
          },
        })
        const data = await res.json()

        // Gộp thành chuỗi
        const addr =
          data?.display_name ||
          [data?.address?.road, data?.address?.suburb, data?.address?.city || data?.address?.town || data?.address?.village, data?.address?.state, data?.address?.country]
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

  // Địa chỉ chuẩn hiển thị dưới phần địa chỉ
  const officialAddress = useMemo(() => {
    if (addrMode === 'picker') {
      return fmtAddress({
        street,
        ward: selectedWard,
        district: selectedDistrict,
        province: selectedProvince,
      })
    }
    // gps: lấy trực tiếp từ gpsText
    return gpsText
  }, [addrMode, street, selectedWard, selectedDistrict, selectedProvince, gpsText])

  async function handleSubmit(e) {
    e.preventDefault()
    setMessage(null)

    const form = e.currentTarget
    const formData = new FormData(form)
    const paymentMethodId = Number(formData.get('paymentMethodId'))

    // Tạo payload customer.address theo mode
    let address = ''
    if (addrMode === 'picker') {
      address = officialAddress
    } else {
      address = gpsText || ''
    }

    const payload = {
      customer: {
        name,
        email,
        phone,
        address,
      },
      paymentMethodId,
      items: cartItems.map((i) => ({
        product_id: i.productId,
        quantity: i.quantity,
        price: i.price,
        size: i.size,
      })),
      // bonus theo nhu cầu:
      meta: {
        addressMode: addrMode,
        wardCode: addrMode === 'picker' ? selectedWard?.code ?? null : null,
        districtCode: addrMode === 'picker' ? selectedDistrict?.code ?? null : null,
        provinceCode: addrMode === 'picker' ? selectedProvince?.code ?? null : null,
        gps: addrMode === 'gps' ? gpsLatLng : null,
      },
    }

    if (!payload.items.length) {
      setMessage('Giỏ hàng trống — vui lòng chọn sản phẩm trước khi thanh toán.')
      return
    }
    if (!payload.customer.address) {
      setMessage('Vui lòng nhập/nhận địa chỉ giao hàng hợp lệ.')
      return
    }

    setLoading(true)
    try {
      const res = await fetch('/api/orders', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      })
      const json = await res.json()
      if (!res.ok) throw new Error(json?.error || 'Tạo đơn hàng thất bại')

      setMessage(`Đặt hàng thành công! Mã đơn: ${json.order.id}`)
      form.reset()
      // Có thể clear cart tại đây: dispatch(clearCart())
    } catch (err) {
      setMessage(err?.message || 'Có lỗi xảy ra')
    } finally {
      setLoading(false)
    }
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
              <Image src="/images/cart/empty_cart.png" alt="Empty" width={160} height={160} />
              <p className="mt-3 text-sm text-gray-500">Giỏ hàng trống</p>
              <Link href="/shop" className="mt-4 text-blue-600 hover:underline">
                Tiếp tục mua sắm
              </Link>
            </div>
          ) : (
            <div className="space-y-4">
              {cartItems.map((i) => (
                <div key={i.cartItemId} className="flex items-center gap-3 pb-3 border-b last:border-b-0">
                  <img src={i.image} alt={i.name} className="object-cover w-16 h-16 rounded" />
                  <div className="flex-1 min-w-0">
                    <p className="font-medium truncate">{i.name}</p>
                    <p className="text-xs text-gray-500">
                      {i.color ? `${i.color} / ` : ''}{i.size}
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
            {/* Họ tên / Email / Phone (prefill) */}
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
      if (!e.target.value) {
        setPhoneError('Vui lòng nhập số điện thoại')
      } else {
        // Validate nhẹ khi gõ
        setPhoneError(toE164VNMobile(e.target.value) ? '' : 'Số điện thoại VN không hợp lệ')
      }
    }}
    onBlur={() => {
      if (phone) setPhoneError(toE164VNMobile(phone) ? '' : 'Số điện thoại VN không hợp lệ')
    }}
    autoComplete="tel"
    inputMode="tel"
  />
  {phoneError && <p className="mt-1 text-xs text-red-600">{phoneError}</p>}
</div>


            {/* Địa chỉ: chọn cách nhập */}
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
                        <option key={p.code} value={p.code}>{p.name}</option>
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
                        <option key={d.code} value={d.code}>{d.name}</option>
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
                        <option key={w.code} value={w.code}>{w.name}</option>
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
                defaultValue=""
              >
                <option value="" disabled>Chọn phương thức</option>
                {methods.map((m) => (
                  <option key={m.id} value={m.id}>{m.name}</option>
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
              className="inline-flex items-center justify-center w-full py-2 text-white bg-blue-600 rounded-lg hover:bg-blue-700"
            >
              {loading ? 'Đang tạo đơn…' : 'Đặt hàng'}
            </button>

            {message && (
              <p className={`text-sm mt-2 ${message.startsWith('Đặt hàng thành công') ? 'text-green-600' : 'text-red-600'}`}>
                {message}
              </p>
            )}
          </form>
        </section>
      </div>
    </div>
  )
}
