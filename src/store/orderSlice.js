import { createSlice } from '@reduxjs/toolkit'

const initialState = {
  items: [],
  loading: false,
  error: null,

  notafication: false,

  // Track IDs of newly arrived orders
  newOrderIds: [],

  // Track IDs of orders already viewed
  viewedOrderIds: [],

  // Know if the first orders request has already been processed
  ordersInitialized: false,
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

      const incomingOrders =
        Array.isArray(action.payload)
          ? action.payload
          : []

      const incomingIds =
        incomingOrders
          .map((order) => Number(order?.id))
          .filter((id) => Number.isFinite(id))

      // =================================================
      // FIRST LOAD
      // =================================================

      if (!state.ordersInitialized) {
        state.items = incomingOrders

        // Existing orders are considered already known.
        state.viewedOrderIds = [
          ...new Set([
            ...state.viewedOrderIds,
            ...incomingIds,
          ]),
        ]

        state.newOrderIds = []
        state.notafication = false
        state.ordersInitialized = true

        return
      }

      // =================================================
      // FIND NEW ORDERS
      // =================================================

      const previousIds =
        new Set(
          state.items
            .map((order) => Number(order?.id))
            .filter((id) =>
              Number.isFinite(id)
            )
        )

      const viewedIds =
        new Set(
          state.viewedOrderIds
            .map((id) => Number(id))
        )

      const newIds =
        incomingIds.filter(
          (id) =>
            !previousIds.has(id) &&
            !viewedIds.has(id)
        )

      // =================================================
      // SAVE NEW ORDERS
      // =================================================

      if (newIds.length > 0) {
        state.newOrderIds = [
          ...new Set([
            ...state.newOrderIds,
            ...newIds,
          ]),
        ]

        state.notafication = true
      }

      // =================================================
      // UPDATE ORDERS
      // =================================================

      state.items = incomingOrders
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
      const orderId =
        Number(action.payload)

      state.items =
        state.items.filter(
          (order) =>
            Number(order.id) !== orderId
        )

      // Remove it from pending notifications
      state.newOrderIds =
        state.newOrderIds.filter(
          (id) =>
            Number(id) !== orderId
        )

      if (
        state.newOrderIds.length === 0
      ) {
        state.notafication = false
      }
    },

    // =================================================
    // MARK NEW ORDERS AS VIEWED
    // =================================================

    markNewOrdersViewed(state) {
      state.viewedOrderIds = [
        ...new Set([
          ...state.viewedOrderIds,
          ...state.newOrderIds,
        ]),
      ]

      state.newOrderIds = []
      state.notafication = false
    },

    // =================================================
    // CLEAR ERROR
    // =================================================

    clearOrdersError(state) {
      state.error = null
    },

    // =================================================
    // NOTIFICATION
    // =================================================

    setNotafication(state, action) {
      state.notafication =
        action.payload
    },

    clearNotafication(state) {
      state.notafication = false
    },
    resetOrdersState(state) {
    state.items = []
    state.loading = false
    state.error = null
    state.notafication = false
    state.newOrderIds = []
    state.viewedOrderIds = []
    state.ordersInitialized = false
  }
  },
})

export const {
  fetchOrdersStart,
  fetchOrdersSuccess,
  fetchOrdersFailure,
  updateOrder,
  removeOrder,
  markNewOrdersViewed,
  clearOrdersError,
  setNotafication,
  clearNotafication,
  resetOrdersState,
} = orderSlice.actions

export default orderSlice.reducer