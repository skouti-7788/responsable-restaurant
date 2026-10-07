import { createSlice } from '@reduxjs/toolkit'

const savedTheme = 'light'

const initialState = {
  language: localStorage.getItem('restaurant_language') || 'en',
  theme: savedTheme,
  loading: false,
  error: null,
}

const uiSlice = createSlice({
  name: 'ui',

  initialState,

  reducers: {
    setLanguage(state, action) {
      state.language = action.payload
      localStorage.setItem('restaurant_language', action.payload)
    },

    setTheme(state, action) {
      state.theme = action.payload
      localStorage.setItem('restaurant_theme', action.payload)

      if (action.payload === 'dark') {
        document.documentElement.classList.add('dark')
      } else {
        document.documentElement.classList.remove('dark')
      }
    },

    toggleTheme(state,action) {
      const newTheme = state.theme === action.payload ? 'light' : 'dark'

      state.theme = newTheme

      localStorage.setItem(
        'restaurant_theme',
        newTheme
      )

      if (newTheme === 'dark') {
        document.documentElement.classList.add('dark')
      } else {
        document.documentElement.classList.remove('dark')
      }
    },

    setLoading(state, action) {
      state.loading = action.payload
    },

    setError(state, action) {
      state.error = action.payload
    },
  },
})

export const {
  setLanguage,
  setTheme,
  toggleTheme,
  setLoading,
  setError,
} = uiSlice.actions

export default uiSlice.reducer
 
