import { createSlice } from '@reduxjs/toolkit'
import type { PayloadAction } from '@reduxjs/toolkit'
import { AppDispatch } from '../store'
import type { StaticImport } from 'next/dist/shared/lib/get-img-props'
import type { ReactNode } from 'react'

interface Product {
  category: ReactNode
  thumbnail: string | StaticImport
  id: number
  title: string
  description: string
  price: number
  // Add other product properties as needed
}

interface ProductsState {
  items: Product[]
  status: 'idle' | 'loading' | 'succeeded' | 'failed'
  error: string | null
  total: number
}

const initialState: ProductsState = {
  items: [],
  status: 'idle',
  error: null,
  total: 0,
}

const productsSlice = createSlice({
  name: 'products',
  initialState,
  reducers: {
    fetchProductsStart(state) {
      state.status = 'loading'
    },
    fetchProductsSuccess(
      state,
      action: PayloadAction<{ products: Product[]; total: number }>
    ) {
      state.status = 'succeeded'
      state.items = action.payload.products
      state.total = action.payload.total
    },
    fetchProductsFailure(state, action: PayloadAction<string>) {
      state.status = 'failed'
      state.error = action.payload
    },
  },
})

export const {
  fetchProductsStart,
  fetchProductsSuccess,
  fetchProductsFailure,
} = productsSlice.actions

export const fetchProducts =
  ({
    category,
    skip,
    limit,
    search,
  }: {
    category?: string
    skip: number
    limit: number
    search?: string
  }) =>
  async (dispatch: AppDispatch) => {
    try {
      dispatch(fetchProductsStart())
      let url = `https://dummyjson.com/products${
        category ? `/category/${category}` : ''
      }?limit=${limit}&skip=${skip}`
      if (search) {
        url = `https://dummyjson.com/products/search?q=${search}&limit=${limit}&skip=${skip}`
      }
      const response = await fetch(url)
      const data = await response.json()
      dispatch(fetchProductsSuccess(data))
    } catch (error) {
      if (error instanceof Error) {
        dispatch(fetchProductsFailure(error.message))
      } else {
        dispatch(fetchProductsFailure('Unknown error occurred'))
      }
    }
  }

export default productsSlice.reducer
