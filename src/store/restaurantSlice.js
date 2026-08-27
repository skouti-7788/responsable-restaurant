// import { createSlice } from '@reduxjs/toolkit'

// const initialState = {
//   profile: {
//     name: 'La Table Moderne',
//     email: 'manager@restaurant.com',
//     address: '123 Avenue du Gourmet',
//     phone: '+123 456 7890',
//     openingHours: '08:00 - 23:00',
//     logo: null,
//     cover: null,
//     socials: {
//       facebook: '',
//       instagram: '',
//       twitter: '',
//     },
//   },
//   loading: false,
//   error: null,
// }
// const restaurantSlice = createSlice({
//   name: 'restaurant',
//   initialState,
//   reducers: {
//     updateProfile(state, action) {
//       state.profile = {
//         ...state.profile,
//         ...action.payload,
//       }
//     },
//     setRestaurantLoading(state, action) {
//       state.loading = action.payload
//     },
//     setRestaurantError(state, action) {
//       state.error = action.payload
//     },
//   },
// })

// export const { updateProfile, setRestaurantLoading, setRestaurantError } = restaurantSlice.actions
// export default restaurantSlice.reducer 
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
