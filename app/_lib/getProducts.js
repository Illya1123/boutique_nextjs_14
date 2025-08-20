export async function getProducts() {
    const res = await fetch('http://localhost:3000/data.json', {
        cache: 'no-store',
    })

    if (!res.ok) {
        throw new Error('Không thể tải data.json')
    }

    return res.json()
}
