import { configureStore } from '@reduxjs/toolkit'
import userReducer from './userSlice'
import productReducer from './productSlice'
import cartRuducer from './cartSlice'

const store = configureStore({
    reducer: {
        user: userReducer,
        products: productReducer,
        cart: cartRuducer,
    },
})

export default store
