import { createSlice } from '@reduxjs/toolkit'

const initialState = {
  items: [],
  loading: false,
  error: null,
  notafication:false
}

const orderSlice = createSlice({
  name: 'orders',

  initialState,

  reducers: {
    // =================================================
    // START
    // =================================================

    fetchOrdersStart(state) {
      state.loading = true
      state.error = null
    },

    // =================================================
    // SUCCESS
    // =================================================

    fetchOrdersSuccess(state, action) {
      state.loading = false
      state.error = null
      state.items = Array.isArray(
        action.payload
      )
        ? action.payload
        : []
    },

    // =================================================
    // FAILURE
    // =================================================

    fetchOrdersFailure(state, action) {
      state.loading = false
      state.error =
        action.payload ||
        'Unable to load orders'
    },

    // =================================================
    // UPDATE ORDER
    // =================================================

    updateOrder(state, action) {
      const updatedOrder =
        action.payload

      if (!updatedOrder?.id) {
        return
      }

      const index =
        state.items.findIndex(
          (order) =>
            Number(order.id) ===
            Number(updatedOrder.id)
        )

      if (index !== -1) {
        state.items[index] =
          updatedOrder
      }
    },

    // =================================================
    // REMOVE ORDER
    // =================================================

    removeOrder(state, action) {
      state.items =
        state.items.filter(
          (order) =>
            Number(order.id) !==
            Number(action.payload)
        )
    },

    // =================================================
    // CLEAR ERROR
    // =================================================

    clearOrdersError(state) {
      state.error = null
    },
    // =================================================
    // NOTAFICATION 
    // =================================================
    setNotafication(state,action){state.notafication = action.payload},
    clearNotafication(state){state.notafication = false},
  },
})

export const {
  fetchOrdersStart,
  fetchOrdersSuccess,
  fetchOrdersFailure,
  updateOrder,
  removeOrder,
  clearOrdersError,
  setNotafication,
  clearNotafication,
} = orderSlice.actions

export default orderSlice.reducer
 
