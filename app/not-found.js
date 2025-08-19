'use client'
import Link from 'next/link'
import { AlertCircle } from 'lucide-react'

function NotFound() {
    return (
        <main className="flex flex-col items-center justify-center min-h-screen bg-gray-50 text-gray-800 px-4">
            <div className="mb-6">
                <AlertCircle className="w-20 h-20 text-red-500" />
            </div>

            <h1 className="text-5xl font-bold mb-4">404</h1>
            <h2 className="text-2xl font-semibold mb-6">Oops! This page could not be found 😢</h2>

            <p className="text-gray-500 mb-8 text-center max-w-md">
                The page you are looking for might have been removed, had its name changed, or is
                temporarily unavailable.
            </p>

            <Link
                href="/"
                className="inline-block bg-accent-500 text-primary-800 px-6 py-3 text-lg rounded-lg shadow hover:bg-accent-600 hover:text-white transition"
            >
                Go back home
            </Link>
        </main>
    )
}

export default NotFound
