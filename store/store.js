import { configureStore } from '@reduxjs/toolkit'
import userReducer from './userSlice'
import productReducer from './productSlice'
import cartRuducer from './cartSlice'
import blogReducer from './blogSlice'

const store = configureStore({
    reducer: {
        user: userReducer,
        products: productReducer,
        cart: cartRuducer,
        blog: blogReducer,
    },
})

export default store
