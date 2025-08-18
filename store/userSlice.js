import { createSlice } from '@reduxjs/toolkit'

const initialState = {
  user: null,
  status: 'idle',
}

export const userSlice = createSlice({
  name: 'user',
  initialState,
  reducers: {
    setUser: (state, action) => {
      state.user = action.payload
      state.status = action.payload ? 'authenticated' : 'idle'
    },
    clearUser: (state) => {
      state.user = null
      state.status = 'idle'
    },
  },
})

export const { setUser, clearUser } = userSlice.actions
export default userSlice.reducer
