"use client"

import type React from "react"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { ChevronLeft, SearchIcon, Filter } from "lucide-react"
import RecipeCard from "@/components/RecipeCard"
import { Skeleton } from "@/components/ui/skeleton"
import { searchRecipes } from "@/lib/recipe-api"

export default function SearchPage() {
  const router = useRouter()
  const [searchQuery, setSearchQuery] = useState("")
  const [searchResults, setSearchResults] = useState<any[]>([])
  const [loading, setLoading] = useState(false)
  const [activeTab, setActiveTab] = useState("all")
  const [searchPerformed, setSearchPerformed] = useState(false)

  const handleSearch = async (e?: React.FormEvent) => {
    if (e) e.preventDefault()

    if (!searchQuery.trim()) return

    setLoading(true)
    setSearchPerformed(true)

    try {
      const results = await searchRecipes(searchQuery, activeTab)
      setSearchResults(results)
    } catch (error) {
      console.error("Error searching recipes:", error)
    } finally {
      setLoading(false)
    }
  }

  const handleTabChange = (value: string) => {
    setActiveTab(value)
    if (searchPerformed) {
      handleSearch()
    }
  }

  return (
    <div className="container px-4 py-8">
      <div className="flex items-center mb-6">
        <Button variant="ghost" onClick={() => router.back()} className="mr-2">
          <ChevronLeft className="h-5 w-5" />
        </Button>
        <h1 className="text-2xl font-bold">Recipe Search</h1>
      </div>

      <form onSubmit={handleSearch} className="flex gap-2 mb-6">
        <div className="relative flex-1">
          <SearchIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
          <Input
            type="text"
            placeholder="Search for recipes, ingredients, cuisine..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10"
          />
        </div>
        <Button type="submit" className="bg-teal-600 hover:bg-teal-700">
          Search
        </Button>
      </form>

      <Tabs defaultValue="all" value={activeTab} onValueChange={handleTabChange} className="mb-6">
        <TabsList className="bg-teal-50 w-full justify-start overflow-x-auto">
          <TabsTrigger value="all" className="data-[state=active]:bg-teal-600 data-[state=active]:text-white">
            All Recipes
          </TabsTrigger>
          <TabsTrigger value="cooking" className="data-[state=active]:bg-teal-600 data-[state=active]:text-white">
            Cooking
          </TabsTrigger>
          <TabsTrigger value="baking" className="data-[state=active]:bg-teal-600 data-[state=active]:text-white">
            Baking
          </TabsTrigger>
          <TabsTrigger value="party" className="data-[state=active]:bg-teal-600 data-[state=active]:text-white">
            Party
          </TabsTrigger>
          <TabsTrigger value="healthy" className="data-[state=active]:bg-teal-600 data-[state=active]:text-white">
            Healthy
          </TabsTrigger>
          <TabsTrigger value="quick" className="data-[state=active]:bg-teal-600 data-[state=active]:text-white">
            Quick & Easy
          </TabsTrigger>
        </TabsList>
      </Tabs>

      {loading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {[...Array(6)].map((_, i) => (
            <Skeleton key={i} className="h-64 w-full rounded-lg" />
          ))}
        </div>
      ) : searchPerformed ? (
        searchResults.length > 0 ? (
          <>
            <div className="flex justify-between items-center mb-4">
              <p className="text-gray-600">
                Found {searchResults.length} results for "{searchQuery}"
              </p>
              <Button variant="outline" size="sm">
                <Filter className="h-4 w-4 mr-2" />
                Filter
              </Button>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {searchResults.map((recipe) => (
                <RecipeCard key={recipe.id} recipe={recipe} />
              ))}
            </div>
          </>
        ) : (
          <div className="text-center py-12">
            <h3 className="text-xl font-medium mb-2">No recipes found</h3>
            <p className="text-gray-500 mb-6">Try different keywords or browse our categories</p>
            <Button onClick={() => router.push("/")} className="bg-teal-600 hover:bg-teal-700">
              Browse All Recipes
            </Button>
          </div>
        )
      ) : (
        <div className="text-center py-12 bg-teal-50 rounded-lg">
          <SearchIcon className="h-12 w-12 text-teal-600 mx-auto mb-4" />
          <h3 className="text-xl font-medium mb-2">Search for any recipe</h3>
          <p className="text-gray-600 mb-6 max-w-md mx-auto">
            Find recipes by name, ingredients, cuisine type, or dietary preferences
          </p>
          <div className="flex flex-wrap justify-center gap-2">
            <Button
              variant="outline"
              onClick={() => {
                setSearchQuery("pasta")
                handleSearch()
              }}
            >
              Pasta
            </Button>
            <Button
              variant="outline"
              onClick={() => {
                setSearchQuery("chicken")
                handleSearch()
              }}
            >
              Chicken
            </Button>
            <Button
              variant="outline"
              onClick={() => {
                setSearchQuery("vegetarian")
                handleSearch()
              }}
            >
              Vegetarian
            </Button>
            <Button
              variant="outline"
              onClick={() => {
                setSearchQuery("dessert")
                handleSearch()
              }}
            >
              Dessert
            </Button>
          </div>
        </div>
      )}
    </div>
  )
}
