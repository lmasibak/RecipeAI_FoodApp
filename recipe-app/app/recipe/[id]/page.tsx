"use client"

import { useParams, useRouter } from "next/navigation"
import { useState, useEffect } from "react"
import Image from "next/image"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Separator } from "@/components/ui/separator"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Checkbox } from "@/components/ui/checkbox"
import {
  ChevronLeft,
  Clock,
  Facebook,
  Heart,
  Instagram,
  MessageSquare,
  Share2,
  Star,
  Twitter,
  Users,
  ExternalLink,
  Info,
  ShoppingCart,
  MapPin,
  Camera,
} from "lucide-react"
import { getRecipeById } from "@/lib/recipe-api"
import { Skeleton } from "@/components/ui/skeleton"
import RecipeCard from "@/components/RecipeCard"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"
import { useUserProfile } from "@/lib/user-profile"
import { useShoppingList } from "@/lib/shopping-list"

export default function RecipePage() {
  const router = useRouter()
  const params = useParams()
  const [recipe, setRecipe] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const [liked, setLiked] = useState(false)
  const [relatedRecipes, setRelatedRecipes] = useState<any[]>([])
  const { profile } = useUserProfile()
  const { addItem, shoppingList, toggleItem } = useShoppingList()
  const [ingredientChecklist, setIngredientChecklist] = useState<Record<string, boolean>>({})

  useEffect(() => {
    if (params.id) {
      const fetchRecipe = async () => {
        setLoading(true)
        try {
          const recipeData = await getRecipeById(params.id as string)
          setRecipe(recipeData)

          // Initialize ingredient checklist
          if (recipeData && recipeData.ingredients) {
            const initialChecklist: Record<string, boolean> = {}
            recipeData.ingredients.forEach((ingredient: string) => {
              // Check if this ingredient is already in the shopping list
              const inShoppingList = shoppingList.some((item) => item.name.toLowerCase() === ingredient.toLowerCase())
              initialChecklist[ingredient] = inShoppingList
            })
            setIngredientChecklist(initialChecklist)
          }

          // Get related recipes
          const related = await getRelatedRecipes(recipeData?.category)
          setRelatedRecipes(related)
        } catch (error) {
          console.error("Error fetching recipe:", error)
        } finally {
          setLoading(false)
        }
      }

      fetchRecipe()
    }
  }, [params.id, shoppingList])

  const getRelatedRecipes = async (category: string) => {
    // In a real app, this would be an API call
    // For now, we'll simulate it with a delay
    await new Promise((resolve) => setTimeout(resolve, 500))

    // Generate 3 related recipes
    return Array.from({ length: 3 }, (_, i) => ({
      id: `related-${Date.now()}-${i}`,
      title: `Related ${category} Recipe ${i + 1}`,
      image: `https://images.unsplash.com/photo-${1540189549336 + i}-e6e99c3679fe?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80`,
      prepTime: Math.floor(Math.random() * 45) + 15,
      rating: (Math.random() * 2 + 3).toFixed(1),
      category,
    }))
  }

  // Check if recipe matches user's dietary preferences
  const matchesDietaryPreferences = (recipe: any) => {
    if (!recipe || !recipe.dietaryTags) return null

    const matches: string[] = []
    const conflicts: string[] = []

    if (profile.dietaryPreferences.vegetarian && recipe.dietaryTags.includes("vegetarian")) {
      matches.push("vegetarian")
    } else if (profile.dietaryPreferences.vegetarian) {
      conflicts.push("vegetarian")
    }

    if (profile.dietaryPreferences.vegan && recipe.dietaryTags.includes("vegan")) {
      matches.push("vegan")
    } else if (profile.dietaryPreferences.vegan) {
      conflicts.push("vegan")
    }

    if (profile.dietaryPreferences.glutenFree && recipe.dietaryTags.includes("gluten-free")) {
      matches.push("gluten-free")
    } else if (profile.dietaryPreferences.glutenFree) {
      conflicts.push("gluten-free")
    }

    if (profile.dietaryPreferences.dairyFree && recipe.dietaryTags.includes("dairy-free")) {
      matches.push("dairy-free")
    } else if (profile.dietaryPreferences.dairyFree) {
      conflicts.push("dairy-free")
    }

    return { matches, conflicts }
  }

  const dietaryMatches = recipe ? matchesDietaryPreferences(recipe) : null

  const handleIngredientToggle = (ingredient: string) => {
    // Toggle in the local checklist
    setIngredientChecklist((prev) => ({
      ...prev,
      [ingredient]: !prev[ingredient],
    }))

    // Add to shopping list if not already there
    if (!ingredientChecklist[ingredient]) {
      addItem(ingredient)
    }
  }

  const addAllToShoppingList = () => {
    if (recipe && recipe.ingredients) {
      recipe.ingredients.forEach((ingredient: string) => {
        if (!ingredientChecklist[ingredient]) {
          addItem(ingredient)
          setIngredientChecklist((prev) => ({
            ...prev,
            [ingredient]: true,
          }))
        }
      })
    }
  }

  if (loading) {
    return (
      <div className="container max-w-4xl mx-auto px-4 py-8 pb-20">
        <div className="flex items-center mb-6">
          <Button variant="ghost" onClick={() => router.back()} className="mr-2">
            <ChevronLeft className="h-5 w-5" />
          </Button>
          <Skeleton className="h-8 w-48" />
        </div>
        <Skeleton className="h-64 w-full rounded-lg mb-6" />
        <Skeleton className="h-8 w-3/4 mb-4" />
        <div className="flex gap-4 mb-6">
          <Skeleton className="h-6 w-20" />
          <Skeleton className="h-6 w-20" />
          <Skeleton className="h-6 w-20" />
        </div>
        <Tabs defaultValue="ingredients">
          <TabsList className="w-full">
            <TabsTrigger value="ingredients" className="flex-1">
              Ingredients
            </TabsTrigger>
            <TabsTrigger value="instructions" className="flex-1">
              Instructions
            </TabsTrigger>
            <TabsTrigger value="nutrition" className="flex-1">
              Nutrition
            </TabsTrigger>
            <TabsTrigger value="reviews" className="flex-1">
              Reviews
            </TabsTrigger>
          </TabsList>
          <TabsContent value="ingredients" className="mt-6">
            <div className="space-y-2">
              {[...Array(8)].map((_, i) => (
                <Skeleton key={i} className="h-6 w-full" />
              ))}
            </div>
          </TabsContent>
        </Tabs>
      </div>
    )
  }

  if (!recipe) {
    return (
      <div className="container max-w-4xl mx-auto px-4 py-8 pb-20">
        <h1 className="text-2xl font-bold mb-4">Recipe not found</h1>
        <p className="mb-6">The recipe you're looking for doesn't exist or has been removed.</p>
        <Button onClick={() => router.push("/")} className="bg-teal-600 hover:bg-teal-700">
          Browse Recipes
        </Button>
      </div>
    )
  }

  return (
    <div className="container max-w-4xl mx-auto px-4 py-8 pb-20">
      <div className="flex items-center mb-6">
        <Button variant="ghost" onClick={() => router.back()} className="mr-2">
          <ChevronLeft className="h-5 w-5" />
        </Button>
        <h1 className="text-2xl font-bold">{recipe.title}</h1>
      </div>

      <div className="relative h-64 sm:h-80 rounded-lg overflow-hidden mb-6">
        <Image src={recipe.image || "/placeholder.svg"} alt={recipe.title} fill className="object-cover" />
        <div className="absolute bottom-4 right-4 flex space-x-2">
          <Button
            variant="secondary"
            size="icon"
            className="bg-white/90 hover:bg-white"
            onClick={() => setLiked(!liked)}
          >
            <Heart className={`h-5 w-5 ${liked ? "fill-red-500 text-red-500" : "text-gray-700"}`} />
          </Button>
          <Button variant="secondary" size="icon" className="bg-white/90 hover:bg-white">
            <Share2 className="h-5 w-5 text-gray-700" />
          </Button>
        </div>
      </div>

      <div className="flex flex-wrap gap-2 mb-4">
        {recipe.source === "external" && (
          <Badge variant="outline" className="bg-blue-50 text-blue-700 hover:bg-blue-100 flex items-center gap-1">
            <ExternalLink className="h-3 w-3" />
            Internet Recipe
          </Badge>
        )}

        <Button
          variant="outline"
          size="sm"
          className="text-teal-600"
          onClick={() => router.push(`/shopping-list?recipeId=${recipe.id}`)}
        >
          <ShoppingCart className="h-4 w-4 mr-2" />
          Add to Shopping List
        </Button>

        <Button
          variant="outline"
          size="sm"
          className="text-teal-600"
          onClick={() => router.push(`/stores?recipeId=${recipe.id}`)}
        >
          <MapPin className="h-4 w-4 mr-2" />
          Find Ingredients
        </Button>

        <Button variant="outline" size="sm" className="text-teal-600" onClick={() => router.push("/blog/create")}>
          <Camera className="h-4 w-4 mr-2" />
          Share Your Result
        </Button>
      </div>

      {dietaryMatches && (
        <div className="mb-4">
          {dietaryMatches.matches.length > 0 && (
            <div className="flex flex-wrap gap-2 mb-2">
              {dietaryMatches.matches.map((tag) => (
                <Badge key={tag} className="bg-green-100 text-green-800">
                  ✓ {tag}
                </Badge>
              ))}
            </div>
          )}

          {dietaryMatches.conflicts.length > 0 && (
            <div className="flex flex-wrap gap-2">
              {dietaryMatches.conflicts.map((tag) => (
                <Badge key={tag} variant="outline" className="border-amber-300 text-amber-700 flex items-center gap-1">
                  <Info className="h-3 w-3" />
                  Not {tag}
                </Badge>
              ))}
            </div>
          )}
        </div>
      )}

      <div className="flex flex-wrap gap-4 mb-6">
        <div className="flex items-center text-gray-700">
          <Clock className="h-5 w-5 mr-1" />
          <span>{recipe.prepTime} min</span>
        </div>
        <div className="flex items-center text-gray-700">
          <Users className="h-5 w-5 mr-1" />
          <span>Serves 4</span>
        </div>
        <div className="flex items-center text-gray-700">
          <Star className="h-5 w-5 text-yellow-400 mr-1" />
          <span>{recipe.rating} (24 reviews)</span>
        </div>
        <Badge className="bg-teal-100 text-teal-800 hover:bg-teal-200">{recipe.category}</Badge>
      </div>

      <Tabs defaultValue="ingredients">
        <TabsList className="w-full bg-teal-50">
          <TabsTrigger
            value="ingredients"
            className="flex-1 data-[state=active]:bg-teal-600 data-[state=active]:text-white"
          >
            Ingredients
          </TabsTrigger>
          <TabsTrigger
            value="instructions"
            className="flex-1 data-[state=active]:bg-teal-600 data-[state=active]:text-white"
          >
            Instructions
          </TabsTrigger>
          <TabsTrigger
            value="nutrition"
            className="flex-1 data-[state=active]:bg-teal-600 data-[state=active]:text-white"
          >
            Nutrition
          </TabsTrigger>
          <TabsTrigger
            value="reviews"
            className="flex-1 data-[state=active]:bg-teal-600 data-[state=active]:text-white"
          >
            Reviews
          </TabsTrigger>
        </TabsList>

        <TabsContent value="ingredients" className="mt-6">
          <div className="flex justify-between items-center mb-4">
            <h3 className="font-medium">Ingredients Checklist</h3>
            <Button variant="outline" size="sm" className="text-teal-600" onClick={addAllToShoppingList}>
              <ShoppingCart className="h-4 w-4 mr-2" />
              Add All to Shopping List
            </Button>
          </div>
          <ul className="space-y-2">
            {recipe.ingredients?.map((ingredient: string, index: number) => (
              <li key={index} className="flex items-start">
                <Checkbox
                  id={`ingredient-${index}`}
                  checked={ingredientChecklist[ingredient] || false}
                  onCheckedChange={() => handleIngredientToggle(ingredient)}
                  className="mt-1 mr-3"
                />
                <label
                  htmlFor={`ingredient-${index}`}
                  className={`cursor-pointer ${ingredientChecklist[ingredient] ? "line-through text-gray-500" : ""}`}
                >
                  {ingredient}
                </label>
              </li>
            ))}
          </ul>
        </TabsContent>

        <TabsContent value="instructions" className="mt-6">
          <ol className="space-y-4">
            {recipe.instructions?.map((step: string, index: number) => (
              <li key={index} className="flex">
                <span className="flex-shrink-0 w-6 h-6 rounded-full bg-teal-100 text-teal-800 flex items-center justify-center mr-3 font-medium">
                  {index + 1}
                </span>
                <p>{step}</p>
              </li>
            ))}
          </ol>
        </TabsContent>

        <TabsContent value="nutrition" className="mt-6">
          {recipe.nutritionalInfo ? (
            <div className="space-y-6">
              <div className="grid grid-cols-2 sm:grid-cols-5 gap-4">
                <div className="bg-gray-50 p-4 rounded-lg text-center">
                  <div className="text-2xl font-bold text-gray-800">{recipe.nutritionalInfo.calories}</div>
                  <div className="text-sm text-gray-500">Calories</div>
                </div>
                <div className="bg-gray-50 p-4 rounded-lg text-center">
                  <div className="text-2xl font-bold text-gray-800">{recipe.nutritionalInfo.protein}g</div>
                  <div className="text-sm text-gray-500">Protein</div>
                </div>
                <div className="bg-gray-50 p-4 rounded-lg text-center">
                  <div className="text-2xl font-bold text-gray-800">{recipe.nutritionalInfo.carbs}g</div>
                  <div className="text-sm text-gray-500">Carbs</div>
                </div>
                <div className="bg-gray-50 p-4 rounded-lg text-center">
                  <div className="text-2xl font-bold text-gray-800">{recipe.nutritionalInfo.fat}g</div>
                  <div className="text-sm text-gray-500">Fat</div>
                </div>
                <div className="bg-gray-50 p-4 rounded-lg text-center">
                  <div className="text-2xl font-bold text-gray-800">{recipe.nutritionalInfo.fiber}g</div>
                  <div className="text-sm text-gray-500">Fiber</div>
                </div>
              </div>

              <div>
                <h3 className="font-medium mb-2">Dietary Information</h3>
                <div className="flex flex-wrap gap-2">
                  {recipe.dietaryTags?.map((tag: string) => (
                    <TooltipProvider key={tag}>
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <Badge className="bg-green-100 text-green-800">{tag}</Badge>
                        </TooltipTrigger>
                        <TooltipContent>
                          <p>This recipe is {tag}</p>
                        </TooltipContent>
                      </Tooltip>
                    </TooltipProvider>
                  ))}
                </div>
              </div>

              <div>
                <h3 className="font-medium mb-2">Health Notes</h3>
                <p className="text-gray-700">
                  This recipe is {recipe.nutritionalInfo.calories < 300 ? "low" : "moderate"} in calories and provides{" "}
                  {recipe.nutritionalInfo.protein}g of protein per serving.
                  {recipe.nutritionalInfo.fiber >= 5
                    ? " It's also high in fiber, which is good for digestive health."
                    : ""}
                </p>
              </div>
            </div>
          ) : (
            <div className="text-center py-8">
              <p className="text-gray-500">Nutritional information not available for this recipe.</p>
            </div>
          )}
        </TabsContent>

        <TabsContent value="reviews" className="mt-6">
          <div className="space-y-6">
            <div className="flex justify-between items-center">
              <h3 className="font-medium">Reviews (24)</h3>
              <Button variant="outline" className="text-teal-600 border-teal-600">
                <MessageSquare className="h-4 w-4 mr-2" />
                Write a Review
              </Button>
            </div>

            {[1, 2, 3].map((_, index) => (
              <div key={index} className="border-b pb-4">
                <div className="flex items-start mb-2">
                  <Avatar className="h-10 w-10 mr-3">
                    <AvatarImage src={`/placeholder.svg?height=40&width=40`} />
                    <AvatarFallback>{["JD", "SM", "AK"][index]}</AvatarFallback>
                  </Avatar>
                  <div>
                    <div className="flex items-center">
                      <h4 className="font-medium mr-2">{["John Doe", "Sarah Miller", "Alex Kim"][index]}</h4>
                      <div className="flex">
                        {[...Array(5)].map((_, i) => (
                          <Star
                            key={i}
                            className={`h-4 w-4 ${i < 5 - index ? "text-yellow-400 fill-yellow-400" : "text-gray-300"}`}
                          />
                        ))}
                      </div>
                    </div>
                    <p className="text-sm text-gray-500">{["2 days ago", "1 week ago", "2 weeks ago"][index]}</p>
                  </div>
                </div>
                <p className="text-gray-700">
                  {
                    [
                      "This recipe was amazing! So easy to follow and the result was delicious. My whole family loved it.",
                      "Great flavors but I found the cooking time was a bit off. Needed about 5 more minutes than stated.",
                      "Loved this recipe! I added some extra spices and it turned out perfect. Will definitely make again.",
                    ][index]
                  }
                </p>
              </div>
            ))}

            <Button variant="link" className="text-teal-600 mx-auto block">
              Load more reviews
            </Button>
          </div>
        </TabsContent>
      </Tabs>

      <Separator className="my-8" />

      <div className="mb-8">
        <h3 className="font-medium mb-4">Share this recipe</h3>
        <div className="flex space-x-3">
          <Button variant="outline" size="icon" className="rounded-full">
            <Facebook className="h-5 w-5 text-blue-600" />
          </Button>
          <Button variant="outline" size="icon" className="rounded-full">
            <Twitter className="h-5 w-5 text-sky-500" />
          </Button>
          <Button variant="outline" size="icon" className="rounded-full">
            <Instagram className="h-5 w-5 text-pink-600" />
          </Button>
        </div>
      </div>

      <div>
        <h3 className="font-medium mb-4">You might also like</h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
          {relatedRecipes.map((relatedRecipe) => (
            <RecipeCard key={relatedRecipe.id} recipe={relatedRecipe} />
          ))}
        </div>
      </div>
    </div>
  )
}
