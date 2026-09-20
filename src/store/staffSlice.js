import { createSlice } from '@reduxjs/toolkit'

const initialState = {
  staff: [],
  loading: false,
  error: '',
}

const staffSlice = createSlice({
  name: 'staff',
  initialState,

  reducers: {
    setStaff(state, action) {
      state.staff = Array.isArray(action.payload)
        ? action.payload
        : []
    },

    setStaffLoading(state, action) {
      state.loading = Boolean(action.payload)
    },

    setStaffError(state, action) {
      state.error = action.payload || ''
    },

    addStaff(state, action) {
      if (action.payload) {
        state.staff.push(action.payload)
      }
    },

    removeStaff(state, action) {
      state.staff = state.staff.filter(
        (member) => member.id !== action.payload,
      )
    },

    updateStaff(state, action) {
      const updatedStaff = action.payload

      if (!updatedStaff?.id) {
        return
      }

      const index = state.staff.findIndex(
        (member) => member.id === updatedStaff.id,
      )

      if (index !== -1) {
        state.staff[index] = {
          ...state.staff[index],
          ...updatedStaff,
        }
      }
    },

    clearStaff(state) {
      state.staff = []
      state.loading = false
      state.error = ''
    },
  },
})

export const {
  setStaff,
  setStaffLoading,
  setStaffError,
  addStaff,
  removeStaff,
  updateStaff,
  clearStaff,
} = staffSlice.actions

export default staffSlice.reducer