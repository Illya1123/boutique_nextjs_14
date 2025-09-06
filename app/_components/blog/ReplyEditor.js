import { useState } from 'react'
import Avatar from './Avatar'

export default function ReplyEditor({ onSubmit, onCancel, currentUser, autoFocus = false }) {
    const [val, setVal] = useState('')
    return (
        <div className="flex gap-3 mt-3">
            <Avatar src={currentUser?.avatar} name={currentUser?.name} />
            <div className="flex-1">
                <textarea
                    value={val}
                    onChange={(e) => setVal(e.target.value)}
                    rows={2}
                    autoFocus={autoFocus}
                    placeholder="Viết trả lời..."
                    className="w-full border rounded-lg p-3 text-[15px]"
                />
                <div className="flex gap-2 mt-2">
                    <button
                        onClick={() => onSubmit(val)}
                        disabled={!val.trim()}
                        className="px-3 py-1.5 rounded bg-black text-white disabled:opacity-50"
                    >
                        Gửi
                    </button>
                    <button onClick={onCancel} className="px-3 py-1.5 rounded bg-neutral-200">
                        Hủy
                    </button>
                </div>
            </div>
        </div>
    )
}
