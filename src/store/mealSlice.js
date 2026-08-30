import { createSlice } from '@reduxjs/toolkit'

const initialState = {
  items: [],
  loading: false,
  error: null,
}

const mealSlice = createSlice({
  name: 'meals',

  initialState,

  reducers: {
    fetchMealsStart(state) {
      state.loading = true
      state.error = null
    },

    fetchMealsSuccess(state, action) {
      state.loading = false
      state.items = action.payload
      state.error = null
    },

    fetchMealsFailure(state, action) {
      state.loading = false
      state.error = action.payload
    },

    addMeal(state, action) {
      state.items.push(action.payload)
    },

    updateMeal(state, action) {
      const index = state.items.findIndex(
        (meal) => meal.id === action.payload.id
      )

      if (index !== -1) {
        state.items[index] = action.payload
      }
    },

    removeMeal(state, action) {
      state.items = state.items.filter(
        (meal) => meal.id !== action.payload
      )
    },

    clearMeals(state) {
      state.items = []
      state.loading = false
      state.error = null
    },
  },
})

export const {
  fetchMealsStart,
  fetchMealsSuccess,
  fetchMealsFailure,
  addMeal,
  updateMeal,
  removeMeal,
  clearMeals,
} = mealSlice.actions

export default mealSlice.reducer
 
