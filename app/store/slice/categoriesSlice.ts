import { createSlice } from '@reduxjs/toolkit'
import type { PayloadAction } from '@reduxjs/toolkit'
import { AppDispatch } from '../store'

interface CategoriesState {
  items: string[]
  status: 'idle' | 'loading' | 'succeeded' | 'failed'
  error: string | null
}

const initialState: CategoriesState = {
  items: [],
  status: 'idle',
  error: null,
}

const categoriesSlice = createSlice({
  name: 'categories',
  initialState,
  reducers: {
    fetchCategoriesStart(state) {
      state.status = 'loading'
    },
    fetchCategoriesSuccess(state, action: PayloadAction<string[]>) {
      state.status = 'succeeded'
      state.items = action.payload
    },
    fetchCategoriesFailure(state, action: PayloadAction<string>) {
      state.status = 'failed'
      state.error = action.payload
    },
  },
})

export const {
  fetchCategoriesStart,
  fetchCategoriesSuccess,
  fetchCategoriesFailure,
} = categoriesSlice.actions

export const fetchCategories = () => async (dispatch: AppDispatch) => {
  try {
    dispatch(fetchCategoriesStart())
    const response = await fetch('https://dummyjson.com/products/categories')
    const data = await response.json()
    dispatch(fetchCategoriesSuccess(data))
  } catch (error) {
    dispatch(fetchCategoriesFailure(error.message))
  }
}

export default categoriesSlice.reducer
