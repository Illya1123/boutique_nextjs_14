'use client'
import { useState, useEffect } from 'react'
import axios from 'axios'

export default function useFetchData(url) {
    const [data, setData] = useState([])
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState(null)

    useEffect(() => {
        let isMounted = true

        const fetchData = async () => {
            try {
                setLoading(true)
                const res = await axios.get(url)
                if (isMounted) setData(res.data)
            } catch (err) {
                if (isMounted) setError('Lỗi khi lấy dữ liệu')
            } finally {
                if (isMounted) setLoading(false)
            }
        }

        fetchData()

        return () => {
            isMounted = false
        }
    }, [url])

    return { data, loading, error }
}
