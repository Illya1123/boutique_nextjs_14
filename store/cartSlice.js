import { createSlice } from '@reduxjs/toolkit'

const cartSlice = createSlice({
  name: 'cart',
  initialState: {
    items: [],
  },
  reducers: {
    addToCart: (state, action) => {
      const { productId, variantId, size, quantity } = action.payload
      const existing = state.items.find(
        (item) =>
          item.productId === productId &&
          item.variantId === variantId &&
          item.size === size
      )

      if (existing) {
        existing.quantity += quantity
      } else {
        state.items.push(action.payload)
      }
    },
    removeFromCart: (state, action) => {
      state.items = state.items.filter((item) => item.cartItemId !== action.payload)
    },
  },
})

export const { addToCart, removeFromCart } = cartSlice.actions
export default cartSlice.reducer