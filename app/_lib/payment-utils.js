export const fVND = (n) => Number(n || 0).toLocaleString('vi-VN') + 'đ'

export const fmtAddress = ({ street, ward, district, province }) => {
    const parts = []
    if (street) parts.push(street)
    if (ward?.name) parts.push(ward.name)
    if (district?.name) parts.push(district.name)
    if (province?.name) parts.push(province.name)
    return parts.join(', ')
}

const _strip = (s) => String(s || '').replace(/[\s\-._()]/g, '')

export const toE164VNMobile = (raw) => {
    const s = _strip(raw)
    let body = ''
    if (s.startsWith('+84')) body = s.slice(3)
    else if (s.startsWith('84')) body = s.slice(2)
    else if (s.startsWith('0')) body = s.slice(1)
    else return null
    if (!/^[35789]\d{8}$/.test(body)) return null
    return `+84${body}`
}

// PayOS: description ≤ 25 ký tự
export const buildPayOSDescription = (orderId) => {
    const base = 'CK nhanh '
    const compactId = String(orderId).replace(/[^A-Za-z0-9]/g, '')
    const room = 25 - base.length
    return base + compactId.slice(0, Math.max(0, room))
}
