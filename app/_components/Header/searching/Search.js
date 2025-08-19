'use client'
import { useState } from 'react'
import { Input } from '@/components/ui/input'
import { Search } from 'lucide-react'

function SearchInput() {
    const [search, setSearch] = useState('')

    return (
        <div className="relative w-64">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 h-4 w-4" />
            <Input
                type="search"
                id="search"
                placeholder="SEARCH"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="pl-10 placeholder:text-gray-400 text-gray-700 bg-[#edebe9] rounded-xl h-10"
            />
        </div>
    )
}

export default SearchInput
