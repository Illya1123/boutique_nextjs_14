'use client'
import { Button } from '@/components/ui/button'

function ContentAndCreate({ label, setShowForm }) {
    return (
        <div className="flex justify-between items-center mb-6">
            <div>
                <h2 className="text-3xl font-bold text-gray-800">Dashboard</h2>
                <p className="text-gray-600">Quản lý {label}</p>
            </div>
            <Button onClick={() => setShowForm(true)}>Thêm sản phẩm</Button>
        </div>
    )
}

export default ContentAndCreate
