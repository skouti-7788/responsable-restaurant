import { createSlice } from '@reduxjs/toolkit'

const initialState = {
  tables: [],
  restaurantId: null,
  restaurantSlug: null,
  loading: false,
  error: '',
}

const tableSlice = createSlice({
  name: 'tables',

  initialState,

  reducers: {
    setTables(state, action) {
      state.tables = Array.isArray(action.payload)
        ? action.payload
        : []
    },

    setRestaurantInfo(state, action) {
      state.restaurantId =
        action.payload?.id || null

      state.restaurantSlug =
        action.payload?.slug || null
    },

    setTablesLoading(state, action) {
      state.loading = action.payload
    },

    setTablesError(state, action) {
      state.error = action.payload
    },

    clearTables(state) {
      state.tables = []
      state.restaurantId = null
      state.restaurantSlug = null
      state.loading = false
      state.error = ''
    },
  },
})

export const {
  setTables,
  setRestaurantInfo,
  setTablesLoading,
  setTablesError,
  clearTables,
} = tableSlice.actions

export default tableSlice.reducer