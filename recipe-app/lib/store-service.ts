// This service simulates finding stores near a location
// In a real app, this would connect to Google Maps, Yelp, or another location API

import { recipes } from "./data"

// Update the findStores function to handle missing location data
export async function findStores(
  location: string,
  userLocation: { lat: number; lng: number } | null,
  neededIngredients: string[] = [],
): Promise<any[]> {
  // Simulate network delay
  await new Promise((resolve) => setTimeout(resolve, 1000))

  // Default location if none provided
  const locationName = location || "Your Area"

  // Generate mock store data
  const storeTypes = ["grocery", "farmers", "specialty"]
  const storeNames = {
    grocery: ["Whole Foods Market", "Trader Joe's", "Safeway", "Kroger", "Publix", "Albertsons"],
    farmers: ["Downtown Farmers Market", "Green City Market", "Union Square Greenmarket", "Ferry Plaza Farmers Market"],
    specialty: ["The Spice House", "Penzeys Spices", "Williams-Sonoma", "Sur La Table", "Butcher & Larder"],
  }

  // Generate 5-10 random stores
  const count = Math.floor(Math.random() * 6) + 5
  const stores = Array.from({ length: count }, (_, i) => {
    const type = storeTypes[Math.floor(Math.random() * storeTypes.length)]
    const nameOptions = storeNames[type as keyof typeof storeNames]
    const name = nameOptions[Math.floor(Math.random() * nameOptions.length)]

    // Determine if this store has all the needed ingredients (70% chance if there are ingredients)
    const hasIngredients = neededIngredients.length > 0 ? Math.random() > 0.3 : false

    return {
      id: `store-${Date.now()}-${i}`,
      name,
      type,
      address: `${Math.floor(Math.random() * 1000) + 100} ${["Main St", "Broadway", "Market St", "5th Ave"][Math.floor(Math.random() * 4)]}, ${locationName}`,
      phone: `(${Math.floor(Math.random() * 900) + 100}) ${Math.floor(Math.random() * 900) + 100}-${Math.floor(Math.random() * 9000) + 1000}`,
      rating: Math.floor(Math.random() * 2) + 3, // 3-5 stars
      reviews: Math.floor(Math.random() * 500) + 50, // 50-550 reviews
      distance: `${(Math.random() * 5).toFixed(1)} mi`,
      hours: `${Math.floor(Math.random() * 3) + 7}:00 AM - ${Math.floor(Math.random() * 3) + 7}:00 PM`,
      website: "https://example.com",
      directions: "https://maps.google.com",
      hasIngredients,
    }
  })

  // Sort by whether they have the ingredients, then by rating
  return stores.sort((a, b) => {
    if (a.hasIngredients && !b.hasIngredients) return -1
    if (!a.hasIngredients && b.hasIngredients) return 1
    return b.rating - a.rating
  })
}

// Find ingredients needed for a recipe
export async function findIngredientsByRecipe(recipeId: string): Promise<string[]> {
  // Simulate network delay
  await new Promise((resolve) => setTimeout(resolve, 500))

  // Find the recipe
  const recipe = recipes.find((r) => r.id === recipeId)

  if (recipe && recipe.ingredients) {
    // Return the ingredients
    return recipe.ingredients
  }

  // If recipe not found or no ingredients, return some default ingredients
  return ["Olive oil", "Garlic", "Onions", "Salt", "Pepper", "Fresh herbs"]
}
