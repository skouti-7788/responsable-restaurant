// import { createSlice } from '@reduxjs/toolkit'

// const initialState = {
//   items: [],
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
//       const index = state.items.findIndex(
//         (item) => item.id === action.payload.id
//       )

//       if (index !== -1) {
//         state.items[index] = action.payload
//       }
//     },

//     removeCategory(state, action) {
//       state.items = state.items.filter(
//         (item) => item.id !== action.payload
//       )
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
  saving: false,
  deletingId: null,

  error: null,
}

const categorySlice = createSlice({
  name: 'categories',

  initialState,

  reducers: {
    // =====================================================
    // LOAD
    // =====================================================

    fetchCategoriesStart(state) {
      state.loading = true
      state.error = null
    },

    fetchCategoriesSuccess(state, action) {
      state.loading = false
      state.error = null
      state.items = Array.isArray(action.payload)
        ? action.payload
        : []
    },

    fetchCategoriesFailure(state, action) {
      state.loading = false
      state.error = action.payload
    },

    // =====================================================
    // CREATE
    // =====================================================

    addCategory(state, action) {
      state.items.push(action.payload)
    },

    // =====================================================
    // UPDATE
    // =====================================================

    updateCategory(state, action) {
      const index = state.items.findIndex(
        (item) =>
          item.id === action.payload.id
      )

      if (index !== -1) {
        state.items[index] = action.payload
      }
    },

    // =====================================================
    // DELETE
    // =====================================================

    removeCategory(state, action) {
      state.items = state.items.filter(
        (item) =>
          item.id !== action.payload
      )
    },

    // =====================================================
    // SAVING
    // =====================================================

    setCategorySaving(state, action) {
      state.saving = action.payload
    },

    // =====================================================
    // DELETING
    // =====================================================

    setCategoryDeleting(state, action) {
      state.deletingId = action.payload
    },

    // =====================================================
    // ERROR
    // =====================================================

    setCategoryError(state, action) {
      state.error = action.payload
    },

    // =====================================================
    // CLEAR ERROR
    // =====================================================

    clearCategoryError(state) {
      state.error = null
    },

    // =====================================================
    // CLEAR ALL
    // =====================================================

    clearCategories(state) {
      state.items = []
      state.loading = false
      state.saving = false
      state.deletingId = null
      state.error = null
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

  setCategorySaving,
  setCategoryDeleting,

  setCategoryError,
  clearCategoryError,

  clearCategories,
} = categorySlice.actions

export default categorySlice.reducer
 
