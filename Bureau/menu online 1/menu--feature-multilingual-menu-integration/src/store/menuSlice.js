import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import api from '../api/axios'

export const fetchCategories = createAsyncThunk('menu/fetchCategories', async ({restaurantId}, { rejectWithValue }) => {
  try {
    const res = await api.get(`/restaurants/${restaurantId}/categories`)
    return res.data
  } catch (err) {
    return rejectWithValue(err.response?.data || err.message)
  }
})

export const createCategory = createAsyncThunk('menu/createCategory', async ({restaurantId, formData}, { rejectWithValue }) => {
  try {
    const res = await api.post(`/restaurants/${restaurantId}/categories`, formData, { headers: { 'Content-Type': 'multipart/form-data' } })
    return res.data
  } catch (err) {
    return rejectWithValue(err.response?.data || err.message)
  }
})

const slice = createSlice({
  name: 'menu',
  initialState: { categories: [], status: 'idle', error: null },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchCategories.fulfilled, (state, action) => { state.categories = action.payload.data || action.payload })
      .addCase(createCategory.fulfilled, (state, action) => { state.categories.unshift(action.payload.data || action.payload) })
  }
})

export default slice.reducer
