import Avatar from './Avatar'
import ReplyEditor from './ReplyEditor'
import { formatTime } from './comment-helpers'

export default function CommentItem({
    node,
    currentUserId,
    currentUser,
    onReply,
    onEdit,
    onDelete,
    editingId,
    editText,
    setEditText,
    setEditingId,
    depth = 0,
}) {
    const isOwner = currentUserId && currentUserId === node.account_id
    const isEditing = editingId === node.id

    return (
        <li className={depth === 0 ? 'pb-4 border-b' : ''}>
            <div className="flex gap-3">
                {depth > 0 && <div className="ml-6" />}
                <Avatar src={node.account?.avatar} name={node.account?.name} />
                <div className="flex-1">
                    <div className="flex items-center gap-2">
                        <span className="font-medium">{node.account?.name || 'Ẩn danh'}</span>
                        <span className="text-xs text-neutral-500">
                            {formatTime(node.createdAt)}
                        </span>
                    </div>

                    {isEditing ? (
                        <div className="mt-2">
                            <textarea
                                value={editText}
                                onChange={(e) => setEditText(e.target.value)}
                                rows={3}
                                className="w-full border rounded-lg p-3 text-[15px]"
                            />
                            <div className="flex gap-2 mt-2">
                                <button
                                    onClick={() => onEdit(node.id, editText)}
                                    className="px-3 py-1.5 rounded bg-black text-white"
                                >
                                    Lưu
                                </button>
                                <button
                                    onClick={() => setEditingId(null)}
                                    className="px-3 py-1.5 rounded bg-neutral-200"
                                >
                                    Hủy
                                </button>
                            </div>
                        </div>
                    ) : (
                        <p className="mt-1 whitespace-pre-wrap text-[15px]">{node.comment}</p>
                    )}

                    <div className="flex items-center gap-3 mt-2 text-sm text-neutral-600">
                        <button onClick={() => onReply(node.id)} className="hover:underline">
                            Trả lời
                        </button>
                        {isOwner && (
                            <>
                                <button
                                    onClick={() => {
                                        setEditingId(node.id)
                                        setEditText(node.comment || '')
                                    }}
                                    className="hover:underline"
                                >
                                    Sửa
                                </button>
                                <button onClick={() => onDelete(node)} className="hover:underline">
                                    Xoá
                                </button>
                            </>
                        )}
                    </div>

                    {node._showReplyBox && (
                        <ReplyEditor
                            onSubmit={(val) => onReply(node.id, val)}
                            onCancel={() => onReply(null)}
                            currentUser={currentUser}
                            autoFocus
                        />
                    )}

                    {Array.isArray(node.replies) && node.replies.length > 0 && (
                        <ul className="mt-4 space-y-4">
                            {node.replies.map((child) => (
                                <CommentItem
                                    key={child.id}
                                    node={child}
                                    currentUserId={currentUserId}
                                    currentUser={currentUser}
                                    onReply={onReply}
                                    onEdit={onEdit}
                                    onDelete={onDelete}
                                    editingId={editingId}
                                    editText={editText}
                                    setEditText={setEditText}
                                    setEditingId={setEditingId}
                                    depth={depth + 1}
                                />
                            ))}
                        </ul>
                    )}
                </div>
            </div>
        </li>
    )
}
