"use client"

import { useSearchParams, useRouter } from "next/navigation"
import { useEffect, useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { ChevronLeft, Filter } from "lucide-react"
import RecipeCard from "@/components/recipe-card"
import { recipes } from "@/lib/data"
import { Skeleton } from "@/components/ui/skeleton"

export default function SuggestionsPage() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const ingredientsParam = searchParams.get("ingredients")
  const [loading, setLoading] = useState(true)
  const [suggestedRecipes, setSuggestedRecipes] = useState<any[]>([])

  useEffect(() => {
    // Simulate API call to get recipe suggestions based on ingredients
    const fetchSuggestions = () => {
      setLoading(true)

      // In a real app, this would be an API call with the ingredients
      setTimeout(() => {
        // Filter recipes that could be made with the identified ingredients
        // This is a simplified version - in a real app, this would be more sophisticated
        const ingredients = ingredientsParam ? ingredientsParam.split(",") : []

        // For demo purposes, just return some recipes
        const filteredRecipes =
          ingredients.length > 0
            ? recipes.filter((r) => Math.random() > 0.5) // Random selection for demo
            : recipes.slice(0, 6)

        setSuggestedRecipes(filteredRecipes)
        setLoading(false)
      }, 1000)
    }

    fetchSuggestions()
  }, [ingredientsParam])

  return (
    <div className="container px-4 py-8">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center">
          <Button variant="ghost" onClick={() => router.back()} className="mr-2">
            <ChevronLeft className="h-5 w-5" />
          </Button>
          <h1 className="text-2xl font-bold">Recipe Suggestions</h1>
        </div>
        <Button variant="outline" size="sm">
          <Filter className="h-4 w-4 mr-2" />
          Filter
        </Button>
      </div>

      {ingredientsParam && (
        <Card className="mb-6 bg-teal-50 border-teal-200">
          <CardContent className="p-4">
            <h2 className="font-medium mb-2">Based on your ingredients:</h2>
            <div className="flex flex-wrap gap-2">
              {ingredientsParam.split(",").map((ingredient, index) => (
                <div key={index} className="px-3 py-1 bg-white rounded-full text-sm border border-teal-200">
                  {ingredient}
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {loading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {[...Array(6)].map((_, i) => (
            <Card key={i} className="overflow-hidden">
              <Skeleton className="h-48 w-full" />
              <CardContent className="p-4">
                <Skeleton className="h-6 w-3/4 mb-2" />
                <Skeleton className="h-4 w-1/2" />
              </CardContent>
            </Card>
          ))}
        </div>
      ) : (
        <>
          {suggestedRecipes.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {suggestedRecipes.map((recipe) => (
                <RecipeCard key={recipe.id} recipe={recipe} />
              ))}
            </div>
          ) : (
            <div className="text-center py-12">
              <h3 className="text-xl font-medium mb-2">No recipes found</h3>
              <p className="text-gray-500 mb-6">Try scanning different ingredients or browse our categories</p>
              <Button onClick={() => router.push("/")} className="bg-teal-600 hover:bg-teal-700">
                Browse All Recipes
              </Button>
            </div>
          )}
        </>
      )}
    </div>
  )
}
