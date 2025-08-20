export function slugify(str) {
    return str
        .normalize('NFD') // tách dấu
        .replace(/[\u0300-\u036f]/g, '') // xóa dấu
        .toLowerCase()
        .trim()
        .replace(/[^a-z0-9\s-]/g, '') // bỏ ký tự đặc biệt
        .replace(/\s+/g, '-') // thay khoảng trắng bằng "-"
        .replace(/-+/g, '-') // gộp dấu - liên tiếp
}
