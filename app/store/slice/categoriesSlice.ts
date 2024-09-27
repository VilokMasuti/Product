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
    fetchCategoriesSuccess(state, action: PayloadAction<Category[]>) {
      // Change string[] to Category[]
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

    // Assuming the API returns a list of categories,
    // you may need to map the data to match your Category type
    const categories: Category[] = data.map((item: any, index: number) => ({
      id: index.toString(), // Use a unique ID; this is just a placeholder
      slug: item, // Assuming the item itself can serve as a slug
      name: item, // If the API returns a name for the category
    }))

    dispatch(fetchCategoriesSuccess(categories))
  } catch (error) {
    dispatch(fetchCategoriesFailure(error.message))
  }
}

export default categoriesSlice.reducer
