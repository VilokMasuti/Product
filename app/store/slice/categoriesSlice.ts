import { createSlice } from '@reduxjs/toolkit'
import type { PayloadAction } from '@reduxjs/toolkit'
import { AppDispatch } from '../store'

// Define the shape of a single category
interface Category {
  id: string // or number, depending on your data
  slug: string // if applicable
  name: string // assuming the API returns a name for the category
}

// Update the state to hold an array of categories
interface CategoriesState {
  items: Category[] // Change this to Category[]
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
