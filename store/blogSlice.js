import { createSlice } from '@reduxjs/toolkit'

const blogSlice = createSlice({
    name: 'blogs',
    initialState: {
        items: [], // mảng các blog
    },
    reducers: {
        setBlogs(state, action) {
            // ghi đè (hoặc bạn có thể merge theo id)
            state.items = action.payload || []
        },
        upsertBlog(state, action) {
            const blog = action.payload
            const idx = state.items.findIndex((b) => b.id === blog.id)
            if (idx >= 0) state.items[idx] = blog
            else state.items.push(blog)
        },
    },
})

export const { setBlogs, upsertBlog } = blogSlice.actions
export default blogSlice.reducer
