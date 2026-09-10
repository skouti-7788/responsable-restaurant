import { createSlice } from '@reduxjs/toolkit'

import {
  getCurrentRestaurantId,
  getRestaurantCache,
  setRestaurantCache,
  clearRestaurantCachesById,
} from '../utils/restaurantCache'

const TABLES_CACHE_KEY = 'restaurant_tables_cache'

const getCachedTables = () => {
  const restaurantId = getCurrentRestaurantId()

  if (!restaurantId) {
    return []
  }

  return getRestaurantCache(TABLES_CACHE_KEY, restaurantId) ?? []
}

const initialState = {
  tables: getCachedTables(),

  restaurantId: getCurrentRestaurantId(),

  restaurantSlug: null,

  loading: false,

  error: '',
}

const tableSlice = createSlice({
  name: 'tables',

  initialState,

  reducers: {
    setTables(state, action) {
      state.tables = action.payload

      const activeRestaurantId =
        state.restaurantId ||
        getCurrentRestaurantId()

      if (!activeRestaurantId) {
        return
      }

      setRestaurantCache(
        TABLES_CACHE_KEY,
        activeRestaurantId,
        action.payload
      )
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
      const restaurantIdToClear = state.restaurantId

      state.tables = []
      state.restaurantId = null
      state.restaurantSlug = null
      state.loading = false
      state.error = ''

      clearRestaurantCachesById(
        restaurantIdToClear
      )
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