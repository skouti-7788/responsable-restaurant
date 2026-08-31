import { createSlice } from '@reduxjs/toolkit'

const TABLES_CACHE_KEY = 'restaurant_tables_cache'
const RESTAURANT_CACHE_KEY = 'restaurant_current_cache'

const getCachedTables = () => {
  try {
    const cached =
      localStorage.getItem(TABLES_CACHE_KEY)

    return cached
      ? JSON.parse(cached)
      : []
  } catch {
    return []
  }
}

const getCachedRestaurant = () => {
  try {
    const cached =
      localStorage.getItem(
        RESTAURANT_CACHE_KEY
      )

    return cached
      ? JSON.parse(cached)
      : null
  } catch {
    return null
  }
}

const cachedRestaurant =
  getCachedRestaurant()

const initialState = {
  tables: getCachedTables(),

  restaurantId:
    cachedRestaurant?.id || null,

  restaurantSlug:
    cachedRestaurant?.slug || null,

  loading: false,

  error: '',
}

const tableSlice = createSlice({
  name: 'tables',

  initialState,

  reducers: {
    setTables(state, action) {
      state.tables = action.payload

      try {
        localStorage.setItem(
          TABLES_CACHE_KEY,
          JSON.stringify(action.payload)
        )
      } catch (err) {
        console.error(
          'Save tables cache error:',
          err
        )
      }
    },

    setRestaurantInfo(state, action) {
      state.restaurantId =
        action.payload?.id || null

      state.restaurantSlug =
        action.payload?.slug || null

      try {
        localStorage.setItem(
          RESTAURANT_CACHE_KEY,
          JSON.stringify({
            id:
              action.payload?.id || null,

            slug:
              action.payload?.slug || null,
          })
        )
      } catch (err) {
        console.error(
          'Save restaurant cache error:',
          err
        )
      }
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

      try {
        localStorage.removeItem(
          TABLES_CACHE_KEY
        )

        localStorage.removeItem(
          RESTAURANT_CACHE_KEY
        )
      } catch (err) {
        console.error(
          'Clear tables cache error:',
          err
        )
      }
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