/* eslint-disable @next/next/no-img-element */

'use client'

import { useEffect, useState } from 'react'
import { useSearchParams, useRouter } from 'next/navigation'
import { useAppDispatch, useAppSelector } from '../store/hooks'
import { fetchProducts } from '../store/slice/productSlice'
import { fetchCategories } from '../store/slice/categoriesSlice'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Skeleton } from "@/components/ui/skeleton"
import { ScrollArea } from "@/components/ui/scroll-area"
import { motion } from "framer-motion"


export default function Home() {

  const dispatch = useAppDispatch()
  const router = useRouter()
  const searchParams = useSearchParams()

  // Extract query parameters from the URL.
  const queryCategory = searchParams.get('category')
  const querySearch = searchParams.get('search')

  // State management for selected category, search term, and pagination.
  const [selectedCategory, setSelectedCategory] = useState<string | undefined>(
    queryCategory || undefined
  )
  const [searchTerm, setSearchTerm] = useState(querySearch || '')
  const [skip, setSkip] = useState(0)

  // Retrieve products, categories, and loading statuses from Redux store.
  const products = useAppSelector((state) => state.products.items)
  const productsStatus = useAppSelector((state) => state.products.status)
  const productsTotal = useAppSelector((state) => state.products.total)
  const categories = useAppSelector((state) => state.categories.items)


  // Fetch categories when the component mounts.
  useEffect(() => {
    dispatch(fetchCategories())
  }, [dispatch])

  // Fetch products based on selected category, search term, and pagination.
  useEffect(() => {
    dispatch(fetchProducts({ category: selectedCategory, skip, limit: 10, search: searchTerm }))
  }, [dispatch, selectedCategory, skip, searchTerm])

  // Update URL query parameters when category or search term changes.
  useEffect(() => {
    const params = new URLSearchParams()
    if (selectedCategory) params.set('category', selectedCategory)
    if (searchTerm) params.set('search', searchTerm)
    router.push(`/?${params.toString()}`)
  }, [selectedCategory, searchTerm, router])

  // Handle category selection and reset pagination on category change.
  const handleCategoryChange = (value: string) => {
    setSelectedCategory(value === 'all' ? undefined : value)
    setSkip(0)
  }

  // Handle form submission for search functionality.
  const handleSearch = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setSkip(0)
  }

  // Load more products when the user clicks "Load More."
  const loadMore = () => {
    setSkip((prevSkip) => prevSkip + 10)
  }

  return (
    <div className="min-h-screen   bg-stone-100 shadow-2xl ">


      <div className="container mx-auto p-4">

        <h1 className="text-4xl bg-clip-text text-transparent bg-gradient-to-b from-neutral-200 to-neutral-600 text-center font-sans font-bold">Product Catalog</h1>

        {/* Category selection and search input form */}
        <div className="flex flex-col md:flex-row gap-4 mt-16">
          <div className="w-full md:w-1/3">
            <Select onValueChange={handleCategoryChange} value={selectedCategory || 'all'}>
              <SelectTrigger>
                <SelectValue placeholder="Select a category" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all" className="text-white font-extrabold">All Categories</SelectItem>
                {/* Map over categories and render each as a select item */}
                {categories.map((category) => (
                  <SelectItem key={category.id} value={category.slug}>
                    {category.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Search input */}
          <form onSubmit={handleSearch} className="w-full md:w-2/3 flex gap-2">
            <Input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Search products..."
              className="flex-grow  text-black"
            />
            <Button type="submit">Search</Button>
          </form>
        </div>

        {/* Scrollable product area */}
        <ScrollArea className="h-[calc(100vh-200px)]">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mt-4">
            {/* Show skeletons while loading */}
            {productsStatus === 'loading' &&
              Array.from({ length: 6 }).map((_, index) => (
                <Card key={index} className="overflow-hidden">
                  <Skeleton className="h-48 w-full" />
                  <CardHeader>
                    <Skeleton className="h-6 w-2/3" />
                  </CardHeader>
                  <CardContent>
                    <Skeleton className="h-4 w-full mb-2" />
                    <Skeleton className="h-4 w-5/6" />
                  </CardContent>
                  <CardFooter>
                    <Skeleton className="h-8 w-24" />
                  </CardFooter>
                </Card>
              ))
            }

            {/* Render product cards when data is available */}
            {productsStatus === 'succeeded' && products.map((product) => (
              <motion.div
                key={product.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3 }}
              >
                <Card className="overflow-hidden hover:shadow-lg transition-shadow duration-300">
                  <img
                    src={product.thumbnail}
                    alt={product.title}
                    className="w-full h-48 object-cover"
                  />
                  <CardHeader>
                    <CardTitle>{product.title}</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm text-gray-600 dark:text-gray-300 mb-2">{product.description}</p>
                    <Badge variant="secondary">{product.category}</Badge>
                  </CardContent>
                  <CardFooter className="flex justify-between items-center">
                    <span className="text-lg font-bold">${product.price}</span>
                    <Button variant="outline">Add to Cart</Button>
                  </CardFooter>
                </Card>
              </motion.div>
            ))}
          </div>
        </ScrollArea>

        {/* Error message when fetching products fails */}
        {productsStatus === 'failed' && (
          <p className="text-center text-red-500 mt-4">Error loading products. Please try again.</p>
        )}

        {/* Load more button if there are more products to fetch */}
        {products.length < productsTotal && (
          <div className="text-center mt-8">
            <Button onClick={loadMore} size="lg">
              Load More
            </Button>
          </div>
        )}
      </div>


    </div>
  )
}
