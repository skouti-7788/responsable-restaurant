import { createSlice } from '@reduxjs/toolkit'

const initialState = {
  language: localStorage.getItem('restaurant_language') || 'en',
  theme: localStorage.getItem('restaurant_theme') || 'light',
  loading: false,
  error: null,
}

const uiSlice = createSlice({
  name: 'ui',
  initialState,

  reducers: {
    setLanguage(state, action) {
      state.language = action.payload
    },

    setTheme(state, action) {
      state.theme = action.payload
    },

    toggleTheme(state) {
      state.theme = state.theme === 'dark' ? 'light' : 'dark'
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