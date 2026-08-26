import { configureStore } from '@reduxjs/toolkit'
import authReducer from './authSlice'
import uiReducer from './uiSlice'
import categoriesReducer from './categorySlice'
import mealsReducer from './mealSlice'
import ordersReducer from './orderSlice'
import restaurantReducer from './restaurantSlice'

const store = configureStore({
  reducer: {
    auth: authReducer,
    ui: uiReducer,
    categories: categoriesReducer,
    meals: mealsReducer,
    orders: ordersReducer,
    restaurant: restaurantReducer,
  },
})

export default store
