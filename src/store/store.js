import { configureStore } from '@reduxjs/toolkit'
import authReducer from './authSlice'
import uiReducer from './uiSlice'
import categoriesReducer from './categorySlice'
import mealsReducer from './mealSlice'
import ordersReducer from './orderSlice'
import restaurantReducer from './restaurantSlice'
import dashboardReducer from './dashboardSlice'
import tablesReducer from './tableSlice'
import staffReducer from './staffSlice'

const store = configureStore({
  reducer: {
    auth: authReducer,
    ui: uiReducer,
    categories: categoriesReducer,
    meals: mealsReducer,
    orders: ordersReducer,
    restaurant: restaurantReducer,
    dashboard: dashboardReducer,
    tables: tablesReducer,
    staff: staffReducer,
  },
})

export default store
