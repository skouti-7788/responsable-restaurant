import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import api from '../api/axios'

export const fetchRestaurant = createAsyncThunk('restaurant/fetch', async (id, { rejectWithValue }) => {
  try {
    const res = await api.get(`/restaurants/${id}`)
    return res.data
  } catch (err) {
    return rejectWithValue(err.response?.data || err.message)
  }
})

const slice = createSlice({
  name: 'restaurant',
  initialState: { data: null, status: 'idle', error: null },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchRestaurant.pending, (state) => { state.status = 'loading' })
      .addCase(fetchRestaurant.fulfilled, (state, action) => { state.status = 'succeeded'; state.data = action.payload })
      .addCase(fetchRestaurant.rejected, (state, action) => { state.status = 'failed'; state.error = action.payload })
  }
})

export default slice.reducer
