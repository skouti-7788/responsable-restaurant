import { createSlice } from '@reduxjs/toolkit'

const initialState = {
  totalMeals: 0,
  totalCategories: 0,
  totalOrders: 0,
  menuViews: 0,
  popularMeals: [],
  activities: [],

  loading: false,
  error: null,
}

const dashboardSlice = createSlice({
  name: 'dashboard',

  initialState,

  reducers: {
    setDashboard(state, action) {
      state.totalMeals =
        action.payload.totalMeals ?? 0

      state.totalCategories =
        action.payload.totalCategories ?? 0

      state.totalOrders =
        action.payload.totalOrders ?? 0

      state.menuViews =
        action.payload.menuViews ?? 0

      state.popularMeals =
        action.payload.popularMeals ?? []

      state.activities =
        action.payload.activities ?? []
    },

    setDashboardLoading(state, action) {
      state.loading = action.payload
    },

    setDashboardError(state, action) {
      state.error = action.payload
    },

    clearDashboard(state) {
      state.totalMeals = 0
      state.totalCategories = 0
      state.totalOrders = 0
      state.menuViews = 0
      state.popularMeals = []
      state.activities = []
      state.loading = false
      state.error = null
    },
  },
})

export const {
  setDashboard,
  setDashboardLoading,
  setDashboardError,
  clearDashboard,
} = dashboardSlice.actions

export default dashboardSlice.reducer