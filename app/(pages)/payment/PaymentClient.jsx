'use client'

import { useSelector } from 'react-redux'
import { useSession } from 'next-auth/react'
import { useState, useMemo, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import Swal from 'sweetalert2'
import axios from 'axios'

import OrderSummary from '@/app/_components/payment/OrderSummary'
import PaymentForm from '@/app/_components/payment/PaymentForm'
import { toE164VNMobile, buildPayOSDescription, fmtAddress } from '@/app/_lib/payment-utils'

export default function PaymentClient() {
    const router = useRouter()
    const { data: session, status } = useSession()

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

    // ví dụ: phí chuyển nhanh cho đơn thời trang
    const fastBankFee = 2000

    const payableTotal = useMemo(() => {
        if (Number(selectedMethodId) === 3) return subtotal + fastBankFee
        return subtotal
    }, [subtotal, selectedMethodId])

    useEffect(() => {
        if (status === 'unauthenticated' && !session && !userStore) {
            router.push('/login')
        }
    }, [status, session, userStore, router])

    useEffect(() => {
        const controller = new AbortController()

        const fetchMethods = async () => {
            try {
                setLoading(true)
                const res = await axios.get('/api/payment-methods', {
                    params: { ts: Date.now() },
                    headers: { 'Cache-Control': 'no-store' },
                    signal: controller.signal,
                    transitional: { clarifyTimeoutError: true },
                })
                setMethods(res?.data?.methods ?? [])
            } catch (err) {
                setMethods([])
            } finally {
                setLoading(false)
            }
        }

        fetchMethods()

        const onPageShow = (e) => {
            fetchMethods()
        }
        const onFocus = () => fetchMethods()

        window.addEventListener('pageshow', onPageShow)
        window.addEventListener('focus', onFocus)

        return () => {
            controller.abort()
            window.removeEventListener('pageshow', onPageShow)
            window.removeEventListener('focus', onFocus)
        }
    }, [])

    const onPaymentChange = (e) => {
        setSelectedMethodId(Number(e.target.value))
    }

    if (status === 'loading') {
        return <p className="p-4">Đang kiểm tra đăng nhập...</p>
    }

    return (
        <div className="max-w-5xl px-4 py-8 mx-auto">
            <h1 className="mb-6 text-2xl font-semibold">Thanh toán</h1>

            <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
                <OrderSummary
                    cartItems={cartItems}
                    subtotal={subtotal}
                    fastBankFee={fastBankFee}
                    payableTotal={payableTotal}
                    selectedMethodId={selectedMethodId}
                />

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
