'use client'

import { useSelector } from 'react-redux'
import { useSession } from 'next-auth/react'
import { useState, useMemo, useEffect } from 'react'
import Swal from 'sweetalert2'

import OrderSummary from '@/app/_components/payment/OrderSummary'
import PaymentForm from '@/app/_components/payment/PaymentForm'
import { toE164VNMobile, buildPayOSDescription, fmtAddress } from '@/app/_lib/payment-utils'

export default function PaymentPage() {
    const { data: session } = useSession()
    const cartItems = useSelector((state) => state.cart.items)
    const userStore = useSelector((state) => state.user?.user ?? null)

    const [methods, setMethods] = useState([])
    const [loading, setLoading] = useState(false)
    const [message, setMessage] = useState(null)

    const [selectedMethodId, setSelectedMethodId] = useState('')

    const subtotal = useMemo(
        () => cartItems.reduce((s, i) => s + i.price * i.quantity, 0),
        [cartItems]
    )
    const fastBankFee = 2000
    const payableTotal = useMemo(() => {
        if (Number(selectedMethodId) === 3) return subtotal + fastBankFee
        return subtotal
    }, [subtotal, selectedMethodId])

    useEffect(() => {
        fetch('/api/payment-methods')
            .then((r) => r.json())
            .then((data) => setMethods(data?.methods ?? []))
            .catch(() => setMethods([]))
    }, [])

    const onPaymentChange = (e) => {
        setSelectedMethodId(Number(e.target.value))
    }

    return (
        <div className="max-w-5xl px-4 py-8 mx-auto">
            <h1 className="mb-6 text-2xl font-semibold">Thanh toán</h1>

            <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
                {/* Tóm tắt đơn hàng */}
                <OrderSummary
                    cartItems={cartItems}
                    subtotal={subtotal}
                    fastBankFee={fastBankFee}
                    payableTotal={payableTotal}
                    selectedMethodId={selectedMethodId}
                />

                {/* Form thanh toán */}
                <PaymentForm
                    cartItems={cartItems}
                    session={session}
                    userStore={userStore}
                    methods={methods}
                    selectedMethodId={selectedMethodId}
                    onPaymentChange={onPaymentChange}
                    payableTotal={payableTotal}
                    loading={loading}
                    setLoading={setLoading}
                    message={message}
                    setMessage={setMessage}
                />
            </div>
        </div>
    )
}
