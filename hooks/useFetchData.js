'use client'

import { useState, useEffect } from 'react'
import axios from 'axios'

export function useFetchData(url, options = {}) {
    const [data, setData] = useState(null)
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState(null)

    useEffect(() => {
        if (!url) return
        const fetchData = async () => {
            try {
                setLoading(true)
                const res = await axios.get(url, options)
                setData(res.data)
            } catch (err) {
                setError(err)
            } finally {
                setLoading(false)
            }
        }
        fetchData()
    }, [url])

    return { data, loading, error }
}
