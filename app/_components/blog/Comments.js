'use client'
import axios from 'axios'
import { useEffect, useState, useCallback } from 'react'
import Avatar from './Avatar'
import CommentsList from './CommentsList'
import { buildCommentTree, insertReply, updateNodeById, deleteNodeById } from './comment-helpers'

export default function Comments({ blogId, currentUser }) {
    const [items, setItems] = useState([]) // tree
    const [nextCursor, setNextCursor] = useState(null)
    const [loading, setLoading] = useState(true)
    const [posting, setPosting] = useState(false)
    const [error, setError] = useState(null)
    const [text, setText] = useState('')
    const [editingId, setEditingId] = useState(null)
    const [editText, setEditText] = useState('')

    const currentUserId = currentUser?.guestId || currentUser?.id || null

    useEffect(() => {
        if (currentUserId) axios.defaults.headers.common['x-user-id'] = currentUserId
        else delete axios.defaults.headers.common['x-user-id']
    }, [currentUserId])

    const fetchPage = useCallback(
        async (cursor) => {
            const q = new URLSearchParams()
            q.set('limit', '20')
            if (cursor) q.set('cursor', cursor)
            const { data } = await axios.get(`/api/blogs/${blogId}/comments?` + q.toString())
            if (!data?.success) throw new Error(data?.error || 'Không lấy được bình luận')
            return data // data.items can be flat or nested; we'll normalize to tree
        },
        [blogId]
    )

    const initialLoad = useCallback(async () => {
        try {
            setLoading(true)
            setError(null)
            const data = await fetchPage()
            const tree = buildCommentTree(data.items || [])
            setItems(tree)
            setNextCursor(data.nextCursor || null)
        } catch (e) {
            setError(e?.message || 'Lỗi tải bình luận')
        } finally {
            setLoading(false)
        }
    }, [fetchPage])

    useEffect(() => {
        initialLoad()
    }, [initialLoad])

    async function loadMore() {
        try {
            if (!nextCursor) return
            const data = await fetchPage(nextCursor)
            const treeMore = buildCommentTree(data.items || [])
            // naive append to roots; if your backend returns only top-level in pagination,
            // this is fine. If it returns mixed, consider merging by id.
            setItems((prev) => [...prev, ...treeMore])
            setNextCursor(data.nextCursor || null)
        } catch (e) {
            setError(e?.message || 'Lỗi tải thêm')
        }
    }

    async function handlePostParent() {
        if (!currentUserId) {
            setError('Bạn cần đăng nhập để bình luận.')
            return
        }
        const content = text.trim()
        if (!content) return
        try {
            setPosting(true)
            const { data } = await axios.post(`/api/blogs/${blogId}/comments`, {
                comment: content,
                reply_to: null,
            })
            if (!data?.success) throw new Error(data?.error || 'Không tạo được bình luận')
            const newNode = { ...data.item, replies: [] }
            setItems((prev) => [...prev, newNode])
            setText('')
        } catch (e) {
            setError(e?.message || 'Lỗi đăng bình luận')
        } finally {
            setPosting(false)
        }
    }

    // Toggle or submit reply on any node (any depth)
    async function handleReply(targetId, replyContent) {
        if (replyContent === undefined) {
            // toggle reply box visibility on targetId; ensure only one open at a time
            setItems((prev) => prev.map((n) => ({ ...n, _showReplyBox: false })))
            setItems((prev) =>
                updateNodeById(prev, targetId, (n) => ({ ...n, _showReplyBox: !n._showReplyBox }))
            )
            return
        }

        if (!currentUserId) {
            setError('Bạn cần đăng nhập để trả lời.')
            return
        }
        const content = String(replyContent || '').trim()
        if (!content) return
        try {
            const { data } = await axios.post(`/api/blogs/${blogId}/comments`, {
                comment: content,
                reply_to: targetId,
            })
            if (!data?.success) throw new Error(data?.error || 'Không tạo được trả lời')
            const newNode = { ...data.item, replies: [] }
            // insert under the target recursively
            setItems((prev) =>
                insertReply(
                    prev.map((n) => ({ ...n, _showReplyBox: false })),
                    targetId,
                    newNode
                )
            )
        } catch (e) {
            setError(e?.message || 'Lỗi đăng trả lời')
        }
    }

    async function submitEdit(id, content) {
        const text = String(content || '').trim()
        if (!id || !text) return
        try {
            const { data } = await axios.put(`/api/comments/${id}`, { comment: text })
            if (!data?.success) throw new Error(data?.error || 'Không sửa được bình luận')
            setItems((prev) => updateNodeById(prev, id, (n) => ({ ...n, comment: text })))
            setEditingId(null)
            setEditText('')
        } catch (e) {
            setError(e?.message || 'Lỗi cập nhật bình luận')
        }
    }

    async function handleDelete(comment) {
        if (!window.confirm('Xoá bình luận này?')) return
        try {
            const { data } = await axios.delete(`/api/comments/${comment.id}`)
            if (!data?.success) throw new Error(data?.error || 'Không xoá được bình luận')
            setItems((prev) => deleteNodeById(prev, comment.id, { soft: !!data.softDeleted }))
        } catch (e) {
            setError(e?.message || 'Lỗi xoá bình luận')
        }
    }

    return (
        <div className="pt-6 border-t">
            <h2 className="mb-4 text-xl font-semibold">Bình luận</h2>

            {/* Ô nhập parent comment */}
            <div className="flex gap-3 mb-6">
                <Avatar src={currentUser?.avatar} name={currentUser?.name} />
                <div className="flex-1">
                    <textarea
                        value={text}
                        onChange={(e) => setText(e.target.value)}
                        placeholder={currentUser ? 'Viết bình luận...' : 'Đăng nhập để bình luận'}
                        className="w-full border rounded-lg p-3 text-[15px] focus:outline-none focus:ring-2 focus:ring-neutral-300"
                        rows={3}
                        disabled={!currentUser || posting}
                    />
                    <div className="flex justify-end mt-2">
                        <button
                            onClick={handlePostParent}
                            disabled={!currentUser || posting || !text.trim()}
                            className="px-4 py-2 text-white bg-black rounded-lg disabled:opacity-50"
                        >
                            {posting ? 'Đang gửi...' : 'Gửi bình luận'}
                        </button>
                    </div>
                </div>
            </div>

            {loading && <div className="text-neutral-500">Đang tải bình luận...</div>}
            {error && <div className="mb-3 text-red-600">{error}</div>}

            <CommentsList
                items={items}
                currentUserId={currentUserId}
                currentUser={currentUser}
                onReply={handleReply}
                onEdit={submitEdit}
                onDelete={handleDelete}
                editingId={editingId}
                editText={editText}
                setEditText={setEditText}
                setEditingId={setEditingId}
            />

            {nextCursor && (
                <div className="flex justify-center mt-6">
                    <button
                        onClick={loadMore}
                        className="px-4 py-2 border rounded-lg hover:bg-neutral-50"
                    >
                        Tải thêm bình luận
                    </button>
                </div>
            )}
        </div>
    )
}
