import { createSlice } from '@reduxjs/toolkit'

const initialState = {
  profile: null,
  loading: false,
  error: null,
}

const restaurantSlice = createSlice({
  name: 'restaurant',

  initialState,

  reducers: {
    // Set restaurant profile
    setRestaurant(state, action) {
      state.profile = action.payload
    },

    // Update restaurant profile
    updateProfile(state, action) {
      state.profile = {
        ...state.profile,
        ...action.payload,
      }
    },

    // Loading state
    setRestaurantLoading(state, action) {
      state.loading = action.payload
    },

    // Error state
    setRestaurantError(state, action) {
      state.error = action.payload
    },

    // Clear profile
    clearRestaurant(state) {
      state.profile = null
      state.loading = false
      state.error = null
    },
  },
})

export const {
  setRestaurant,
  updateProfile,
  setRestaurantLoading,
  setRestaurantError,
  clearRestaurant,
} = restaurantSlice.actions

export default restaurantSlice.reducer 
