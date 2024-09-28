import { createSlice } from '@reduxjs/toolkit'
import type { PayloadAction } from '@reduxjs/toolkit'
import { AppDispatch } from '../store'

// Define the shape of a single category
interface Category {
  id: string
  slug: string
  name: string
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
      // Map the strings to Category objects
      state.items = action.payload.map((name, index) => ({
        id: index.toString(),
        slug: name.toLowerCase().replace(/\s+/g, '-'), // create a slug from name
        name,
      }))
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
    if (error instanceof Error) {
      dispatch(fetchCategoriesFailure(error.message))
    } else {
      dispatch(fetchCategoriesFailure('Unknown error occurred'))
    }
  }
}

export default categoriesSlice.reducer
