import { configureStore } from '@reduxjs/toolkit'

import authReducer from './store/authSlice'
import menuReducer from './store/menuSlice'
import orderReducer from './store/orderSlice'
import restaurantReducer from './store/restaurantSlice'

export const store = configureStore({
  reducer: {
    auth: authReducer,
    menu: menuReducer,
    order: orderReducer,
    restaurant: restaurantReducer,
  },
})