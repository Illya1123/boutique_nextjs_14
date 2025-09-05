import { createSlice } from '@reduxjs/toolkit'

const productSlice = createSlice({
    name: 'products',
    initialState: {
        items: [], // danh sách sản phẩm
    },
    reducers: {
        setProducts: (state, action) => {
            state.items = action.payload
        },
    },
})

export const { setProducts } = productSlice.actions
export default productSlice.reducer

