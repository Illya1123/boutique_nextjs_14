export function slugify(str) {
    return String(str)
        .normalize('NFD') // tách dấu (ă → a + ̆)
        .replace(/[\u0300-\u036f]/g, '') // bỏ dấu kết hợp
        .replace(/[đ]/g, 'd') // đ → d
        .replace(/[Đ]/g, 'D') // Đ → D
        .replace(/[\u2010-\u2015\u2212]/g, '-') // mọi dạng gạch: ‐-‒–—―− → -
        .toLowerCase()
        .trim()
        .replace(/[^a-z0-9\s-]/g, '') // bỏ ký tự đặc biệt còn lại
        .replace(/\s+/g, '-') // khoảng trắng → -
        .replace(/-+/g, '-') // gộp nhiều -
        .replace(/^-|-$/g, '') // bỏ - đầu/cuối
}
