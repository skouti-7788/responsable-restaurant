import { createSlice } from '@reduxjs/toolkit'

const initialState = {
  items: [
    {
      id: 1,
      customerName: 'Amina H.',
      phone: '+212 600 123456',
      items: ['Grilled Salmon', 'Caesar Salad'],
      total: 36.5,
      status: 'pending',
    },
    {
      id: 2,
      customerName: 'Julien D.',
      phone: '+33 7 45 23 89 12',
      items: ['Beef Burger', 'Lemonade'],
      total: 18.0,
      status: 'accepted',
    },
    {
      id: 3,
      customerName: 'Sara B.',
      phone: '+1 416 555 0198',
      items: ['Vegan Pizza'],
      total: 14.0,
      status: 'completed',
    },
  ],
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
