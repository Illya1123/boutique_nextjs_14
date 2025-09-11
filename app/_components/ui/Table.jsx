export function Th({ children }) {
    return <th className="px-3 py-2 font-semibold text-gray-700 text-sm">{children}</th>
}

export function Td({ children, className = '' }) {
    return <td className={`px-3 py-2 ${className}`}>{children}</td>
}
