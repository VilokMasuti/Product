import { configureStore } from '@reduxjs/toolkit'
import productsReducer from './slice/productSlice'
import categoriesReducer from './slice/categoriesSlice'

export const store = configureStore({
  reducer: {
    products: productsReducer,
    categories: categoriesReducer,
  },
  // Redux Toolkit's configureStore adds thunk middleware by default,
  // so we don't need to explicitly add it here
})

export type RootState = ReturnType<typeof store.getState>
export type AppDispatch = typeof store.dispatch
