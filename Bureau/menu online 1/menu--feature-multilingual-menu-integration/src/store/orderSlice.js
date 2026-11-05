import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import api from '../api/axios'

export const fetchOrders = createAsyncThunk('orders/fetch', async ({restaurantId}, { rejectWithValue }) => {
  try {
    const res = await api.get(`/restaurants/${restaurantId}/orders`)
    return res.data
  } catch (err) {
    return rejectWithValue(err.response?.data || err.message)
  }
})

export const updateOrderStatus = createAsyncThunk('orders/updateStatus', async ({orderId, status}, { rejectWithValue }) => {
  try {
    const res = await api.put(`/orders/${orderId}/status`, { status })
    return res.data
  } catch (err) {
    return rejectWithValue(err.response?.data || err.message)
  }
})

const slice = createSlice({
  name: 'orders',
  initialState: { list: [], status: 'idle', error: null },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchOrders.fulfilled, (state, action) => { state.list = action.payload.data || action.payload })
      .addCase(updateOrderStatus.fulfilled, (state, action) => {
        const updated = action.payload.data || action.payload
        state.list = state.list.map(o => (o.id === updated.id ? updated : o))
      })
  }
})

export default slice.reducer
