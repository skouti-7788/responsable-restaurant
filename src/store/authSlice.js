import { createSlice } from '@reduxjs/toolkit'

const token = localStorage.getItem('restaurant_token')
const user = localStorage.getItem('restaurant_user')
const initialState = {
  token: token || null,
  user: user ? JSON.parse(user) : null,
  loading: false,
  error: null,
}

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    loginStart(state) {
      state.loading = true
      state.error = null
    },
    loginSuccess(state, action) {
      state.loading = false
      state.token = action.payload.token
      state.user = action.payload.user
      localStorage.setItem('restaurant_token', action.payload.token)
      localStorage.setItem('restaurant_user', JSON.stringify(action.payload.user))
    },
    loginFailure(state, action) {
      state.loading = false
      state.error = action.payload
    },
    logout(state) {
      state.token = null
      state.user = null
      state.error = null
      localStorage.removeItem('restaurant_token')
      localStorage.removeItem('restaurant_user')
    },
  },
})

export const { loginStart, loginSuccess, loginFailure, logout } = authSlice.actions
export default authSlice.reducer
