'use client'
import {
    Table,
    TableBody,
    TableCaption,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from '@/components/ui/table'
import { Button } from '@/components/ui/button'

/**
 * @param {Array} data - danh sách object để render
 * @param {Array} columns - cấu hình các cột [{ title, key, render }]
 * @param {String} caption - mô tả table
 * @param {Function} onEdit - callback edit
 * @param {Function} onDelete - callback delete
 * @param {Boolean} showIndex - có hiển thị số thứ tự không
 */
export default function TableList({
    data = [],
    columns = [],
    caption = 'Danh sách',
    onEdit,
    onDelete,
    showIndex = true,
}) {
    return (
        <Table className="min-w-full border border-gray-300 rounded-lg overflow-hidden">
            <TableCaption className="text-gray-600">{caption}</TableCaption>
            <TableHeader className="bg-gray-100">
                <TableRow className="border-b border-gray-300">
                    {showIndex && <TableHead>#</TableHead>}
                    {columns.map((col) => (
                        <TableHead key={col.key}>{col.title}</TableHead>
                    ))}
                    {(onEdit || onDelete) && <TableHead>Actions</TableHead>}
                </TableRow>
            </TableHeader>
            <TableBody>
                {data.map((row, index) => (
                    <TableRow key={row.id || index} className="hover:bg-gray-50">
                        {showIndex && <TableCell>{index + 1}</TableCell>}
                        {columns.map((col) => (
                            <TableCell key={col.key}>
                                {col.render ? col.render(row[col.key], row) : (row[col.key] ?? '-')}
                            </TableCell>
                        ))}
                        {(onEdit || onDelete) && (
                            <TableCell>
                                <div className="flex gap-2">
                                    {onEdit && (
                                        <Button
                                            variant="outline"
                                            size="sm"
                                            onClick={() => onEdit(row)}
                                        >
                                            Sửa
                                        </Button>
                                    )}
                                    {onDelete && (
                                        <Button
                                            variant="destructive"
                                            size="sm"
                                            onClick={() => onDelete(row.id)}
                                        >
                                            Xoá
                                        </Button>
                                    )}
                                </div>
                            </TableCell>
                        )}
                    </TableRow>
                ))}
            </TableBody>
        </Table>
    )
}
