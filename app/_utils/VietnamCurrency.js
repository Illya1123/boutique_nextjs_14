function FormatCurrency(amount) {
    if (!amount || isNaN(amount)) {
        return '0đ'
    }
    return amount.toLocaleString('vi-VN') + ' VNĐ'
}

export default FormatCurrency
