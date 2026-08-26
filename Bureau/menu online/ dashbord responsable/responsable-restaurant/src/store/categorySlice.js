// import { createSlice } from '@reduxjs/toolkit'

// const initialState = {
//   items: [
//     { id: 1, name: 'Starters', description: 'Fresh appetizers and light bites' },
//     { id: 2, name: 'Main courses', description: 'Signature meals and daily specials' },
//     { id: 3, name: 'Desserts', description: 'Sweet treats and after-dinner favorites' },
//   ],
//   loading: false,
//   error: null,
// }

// const categorySlice = createSlice({
//   name: 'categories',
//   initialState,
//   reducers: {
//     fetchCategoriesStart(state) {
//       state.loading = true
//       state.error = null
//     },
//     fetchCategoriesSuccess(state, action) {
//       state.loading = false
//       state.items = action.payload
//     },
//     fetchCategoriesFailure(state, action) {
//       state.loading = false
//       state.error = action.payload
//     },
//     addCategory(state, action) {
//       state.items.unshift(action.payload)
//     },
//     updateCategory(state, action) {
//       const index = state.items.findIndex((item) => item.id === action.payload.id)
//       if (index !== -1) state.items[index] = action.payload
//     },
//     removeCategory(state, action) {
//       state.items = state.items.filter((item) => item.id !== action.payload)
//     },
//   },
// })

// export const {
//   fetchCategoriesStart,
//   fetchCategoriesSuccess,
//   fetchCategoriesFailure,
//   addCategory,
//   updateCategory,
//   removeCategory,
// } = categorySlice.actions
// export default categorySlice.reducer
import { createSlice } from '@reduxjs/toolkit'

const initialState = {
  items: [],
  loading: false,
  error: null,
}

const categorySlice = createSlice({
  name: 'categories',

  initialState,

  reducers: {
    fetchCategoriesStart(state) {
      state.loading = true
      state.error = null
    },

    fetchCategoriesSuccess(state, action) {
      state.loading = false
      state.items = action.payload
    },

    fetchCategoriesFailure(state, action) {
      state.loading = false
      state.error = action.payload
    },

    addCategory(state, action) {
      state.items.unshift(action.payload)
    },

    updateCategory(state, action) {
      const index = state.items.findIndex(
        (item) => item.id === action.payload.id
      )

      if (index !== -1) {
        state.items[index] = action.payload
      }
    },

    removeCategory(state, action) {
      state.items = state.items.filter(
        (item) => item.id !== action.payload
      )
    },
  },
})

export const {
  fetchCategoriesStart,
  fetchCategoriesSuccess,
  fetchCategoriesFailure,
  addCategory,
  updateCategory,
  removeCategory,
} = categorySlice.actions

export default categorySlice.reducer