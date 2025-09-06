export function formatTime(ts) {
    try {
        return new Date(ts).toLocaleString('vi-VN', {
            hour: '2-digit',
            minute: '2-digit',
            day: '2-digit',
            month: '2-digit',
            year: 'numeric',
        })
    } catch {
        return ''
    }
}

// Build a nested tree from either nested or flat data.
// Expected minimal shape: { id, comment, account, account_id, createdAt, reply_to }
export function buildCommentTree(items) {
    if (!Array.isArray(items)) return []

    // If items already contain nested replies, just ensure replies default
    const looksNested = items.some((c) => Array.isArray(c.replies))
    if (looksNested) {
        const attach = (nodes) => nodes.map((n) => ({ ...n, replies: attach(n.replies || []) }))
        return attach(items)
    }

    // Build from flat list
    const map = new Map()
    const roots = []
    items.forEach((it) => map.set(it.id, { ...it, replies: [] }))
    items.forEach((it) => {
        const node = map.get(it.id)
        if (it.reply_to && map.has(it.reply_to)) {
            map.get(it.reply_to).replies.push(node)
        } else {
            roots.push(node)
        }
    })
    return roots
}

// Recursively update a node by id
export function updateNodeById(nodes, id, updater) {
    return nodes.map((n) => {
        if (n.id === id) return updater(n)
        if (n.replies?.length) {
            return { ...n, replies: updateNodeById(n.replies, id, updater) }
        }
        return n
    })
}

// Recursively insert a child under parentId
export function insertReply(nodes, parentId, replyNode) {
    return nodes.map((n) => {
        if (n.id === parentId) {
            return { ...n, replies: [...(n.replies || []), replyNode] }
        }
        if (n.replies?.length) {
            return { ...n, replies: insertReply(n.replies, parentId, replyNode) }
        }
        return n
    })
}

// Recursively soft-delete or hard-remove by id
export function deleteNodeById(nodes, id, { soft = false } = {}) {
    const result = []
    for (const n of nodes) {
        if (n.id === id) {
            if (soft) {
                result.push({ ...n, comment: '[deleted]' })
            }
            // if hard delete, skip push
        } else {
            const updated = n.replies?.length
                ? { ...n, replies: deleteNodeById(n.replies, id, { soft }) }
                : n
            result.push(updated)
        }
    }
    return result
}
