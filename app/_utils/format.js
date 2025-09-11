export function formatVND(value) {
    const n = Number(value) || 0
    return n.toLocaleString('vi-VN') + 'đ'
}
