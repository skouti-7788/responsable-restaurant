import { createSlice } from '@reduxjs/toolkit'

const initialState = {
  items: [],
  loading: false,
  error: null,
}

const orderSlice = createSlice({
  name: 'orders',
  initialState,
  reducers: {
    fetchOrdersStart(state) {
      state.loading = true
      state.error = null
    },
    fetchOrdersSuccess(state, action) {
      state.loading = false
      state.items = action.payload
    },
    fetchOrdersFailure(state, action) {
      state.loading = false
      state.error = action.payload
    },
    updateOrder(state, action) {
      const index = state.items.findIndex((order) => order.id === action.payload.id)
      if (index !== -1) state.items[index] = action.payload
      
    },
    removeOrder(state, action) {
      state.items = state.items.filter((order) => order.id !== action.payload)
    },
  },
})

export const {
  fetchOrdersStart,
  fetchOrdersSuccess,
  fetchOrdersFailure,
  updateOrder,
  removeOrder,
} = orderSlice.actions
export default orderSlice.reducer
