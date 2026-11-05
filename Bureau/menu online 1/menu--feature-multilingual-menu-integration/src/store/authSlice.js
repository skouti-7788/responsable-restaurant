import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import * as authApi from '../api/auth'

const initialState = {
  user: JSON.parse(localStorage.getItem('user') || 'null'),
  token: localStorage.getItem('token') || null,
  status: 'idle',
  error: null,
}

export const loginUser = createAsyncThunk('auth/login', async (credentials, { rejectWithValue }) => {
  try {
    const data = await authApi.login(credentials)
    return data
  } catch (err) {
    return rejectWithValue(err.response?.data || err.message)
  }
})

export const registerUser = createAsyncThunk('auth/register', async (payload, { rejectWithValue }) => {
  try {
    const data = await authApi.register(payload)
    return data
  } catch (err) {
    return rejectWithValue(err.response?.data || err.message)
  }
})

export const fetchCurrentUser = createAsyncThunk('auth/fetchUser', async (_, { rejectWithValue }) => {
  try {
    const data = await authApi.fetchUser()
    return data.user
  } catch (err) {
    return rejectWithValue(err.response?.data || err.message)
  }
})

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    logout(state) {
      state.user = null
      state.token = null
      localStorage.removeItem('token')
      localStorage.removeItem('user')
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(loginUser.pending, (state) => { state.status = 'loading'; state.error = null })
      .addCase(loginUser.fulfilled, (state, action) => {
        state.status = 'succeeded'
        state.user = action.payload.user
        state.token = action.payload.token
        localStorage.setItem('token', action.payload.token)
        localStorage.setItem('user', JSON.stringify(action.payload.user))
      })
      .addCase(loginUser.rejected, (state, action) => { state.status = 'failed'; state.error = action.payload })

      .addCase(registerUser.pending, (state) => { state.status = 'loading'; state.error = null })
      .addCase(registerUser.fulfilled, (state, action) => {
        state.status = 'succeeded'
        state.user = action.payload.user
        state.token = action.payload.token
        localStorage.setItem('token', action.payload.token)
        localStorage.setItem('user', JSON.stringify(action.payload.user))
      })
      .addCase(registerUser.rejected, (state, action) => { state.status = 'failed'; state.error = action.payload })

      .addCase(fetchCurrentUser.fulfilled, (state, action) => { state.user = action.payload })
  },
})

export const { logout } = authSlice.actions
export default authSlice.reducer
