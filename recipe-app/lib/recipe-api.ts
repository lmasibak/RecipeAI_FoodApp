import { recipes as localRecipes } from "./data"
import { getFoodImageByCategory, getFoodImageByQuery } from "./image-service"

// This simulates an API call to an external recipe service
// In a real app, this would connect to services like Spoonacular, Edamam, etc.
export async function searchRecipes(query: string, category?: string): Promise<any[]> {
  // Simulate network delay
  await new Promise((resolve) => setTimeout(resolve, 1000))

  try {
    // First, search local recipes
    let results = localRecipes.filter(
      (recipe) =>
        recipe.title.toLowerCase().includes(query.toLowerCase()) ||
        (recipe.ingredients && recipe.ingredients.some((i) => i.toLowerCase().includes(query.toLowerCase()))),
    )

    // Filter by category if provided and not "all"
    if (category && category !== "all") {
      results = results.filter((recipe) => recipe.category === category)
    }

    // Enhance local recipes with real images
    results = results.map((recipe) => ({
      ...recipe,
      image: getFoodImageByCategory(recipe.category),
    }))

    // Simulate fetching from external API
    const externalResults = await fetchExternalRecipes(query, category)

    // Combine local and external results
    return [...results, ...externalResults]
  } catch (error) {
    console.error("Error searching recipes:", error)
    return []
  }
}

// Simulate fetching from an external API
async function fetchExternalRecipes(query: string, category?: string): Promise<any[]> {
  // This is a mock function that generates fake external recipes
  // In a real app, this would be an actual API call

  // Generate some random recipes based on the query
  const count = Math.floor(Math.random() * 8) + 3 // 3-10 results

  const externalRecipes = Array.from({ length: count }, (_, i) => {
    const id = `external-${Date.now()}-${i}`
    const randomRating = (Math.random() * 2 + 3).toFixed(1) // 3.0-5.0 rating
    const randomPrepTime = Math.floor(Math.random() * 45) + 15 // 15-60 minutes

    // Generate a title based on the query
    let title = ""
    const recipeCategory =
      category === "all" || !category ? ["cooking", "baking", "party", "healthy", "quick"][i % 5] : category

    if (recipeCategory === "cooking") {
      title = `${capitalizeFirstLetter(query)} ${["Stir Fry", "Casserole", "Soup", "Salad", "Bowl"][i % 5]}`
    } else if (recipeCategory === "baking") {
      title = `${capitalizeFirstLetter(query)} ${["Cake", "Cookies", "Bread", "Muffins", "Pie"][i % 5]}`
    } else if (recipeCategory === "party") {
      title = `Party ${capitalizeFirstLetter(query)} ${["Platter", "Dip", "Bites", "Skewers", "Snacks"][i % 5]}`
    } else if (recipeCategory === "healthy") {
      title = `Healthy ${capitalizeFirstLetter(query)} ${["Bowl", "Salad", "Wrap", "Smoothie", "Plate"][i % 5]}`
    } else if (recipeCategory === "quick") {
      title = `Quick ${capitalizeFirstLetter(query)} ${["Meal", "Dinner", "Lunch", "Breakfast", "Snack"][i % 5]}`
    }

    // Get a real food image based on the query and category
    const image = getFoodImageByQuery(`${query} ${recipeCategory} food`)

    // Generate random ingredients based on the query
    const ingredients = [
      `${Math.floor(Math.random() * 3) + 1} cups ${query}`,
      "Salt and pepper to taste",
      `${Math.floor(Math.random() * 4) + 1} tablespoons olive oil`,
      `${Math.floor(Math.random() * 3) + 1} cloves garlic`,
      "1 onion, diced",
      `${Math.floor(Math.random() * 2) + 1} cups vegetables`,
      "Fresh herbs for garnish",
    ]

    // Generate random instructions
    const instructions = [
      `Prepare the ${query} by washing and cutting into pieces.`,
      "Heat olive oil in a pan over medium heat.",
      "Add garlic and onion, sauté until fragrant.",
      `Add ${query} and cook for 5-7 minutes.`,
      "Season with salt and pepper to taste.",
      "Garnish with fresh herbs before serving.",
    ]

    // Add nutritional information
    const nutritionalInfo = {
      calories: Math.floor(Math.random() * 400) + 200,
      protein: Math.floor(Math.random() * 20) + 5,
      carbs: Math.floor(Math.random() * 30) + 10,
      fat: Math.floor(Math.random() * 15) + 5,
      fiber: Math.floor(Math.random() * 8) + 2,
    }

    // Add dietary tags
    const dietaryTags = []
    if (Math.random() > 0.7) dietaryTags.push("vegetarian")
    if (Math.random() > 0.8) dietaryTags.push("vegan")
    if (Math.random() > 0.7) dietaryTags.push("gluten-free")
    if (Math.random() > 0.8) dietaryTags.push("dairy-free")

    return {
      id,
      title,
      image,
      prepTime: randomPrepTime,
      rating: Number.parseFloat(randomRating),
      category: recipeCategory,
      ingredients,
      instructions,
      nutritionalInfo,
      dietaryTags,
      source: "external",
      trending: Math.random() > 0.8, // 20% chance of being trending
    }
  })

  return externalRecipes
}

function capitalizeFirstLetter(string: string) {
  return string.charAt(0).toUpperCase() + string.slice(1)
}

// Function to get a single recipe by ID
export async function getRecipeById(id: string): Promise<any> {
  // Check if it's a local recipe
  const localRecipe = localRecipes.find((recipe) => recipe.id === id)
  if (localRecipe) {
    // Enhance with a real image
    return {
      ...localRecipe,
      image: getFoodImageByCategory(localRecipe.category),
      nutritionalInfo: {
        calories: Math.floor(Math.random() * 400) + 200,
        protein: Math.floor(Math.random() * 20) + 5,
        carbs: Math.floor(Math.random() * 30) + 10,
        fat: Math.floor(Math.random() * 15) + 5,
        fiber: Math.floor(Math.random() * 8) + 2,
      },
      dietaryTags: ["vegetarian", "gluten-free"],
    }
  }

  // If not local, simulate fetching from external API
  // In a real app, this would be an actual API call with the ID

  // Simulate network delay
  await new Promise((resolve) => setTimeout(resolve, 800))

  // If the ID starts with "external-", parse it to generate consistent data
  if (id.startsWith("external-")) {
    const parts = id.split("-")
    const index = Number.parseInt(parts[parts.length - 1])
    const query = "recipe" // Default query

    const randomRating = (Math.random() * 2 + 3).toFixed(1) // 3.0-5.0 rating
    const randomPrepTime = Math.floor(Math.random() * 45) + 15 // 15-60 minutes

    const categories = ["cooking", "baking", "party", "healthy", "quick"]
    const category = categories[index % categories.length]

    let title = ""
    if (category === "cooking") {
      title = `${capitalizeFirstLetter(query)} ${["Stir Fry", "Casserole", "Soup", "Salad", "Bowl"][index % 5]}`
    } else if (category === "baking") {
      title = `${capitalizeFirstLetter(query)} ${["Cake", "Cookies", "Bread", "Muffins", "Pie"][index % 5]}`
    } else if (category === "party") {
      title = `Party ${capitalizeFirstLetter(query)} ${["Platter", "Dip", "Bites", "Skewers", "Snacks"][index % 5]}`
    } else if (category === "healthy") {
      title = `Healthy ${capitalizeFirstLetter(query)} ${["Bowl", "Salad", "Wrap", "Smoothie", "Plate"][index % 5]}`
    } else if (category === "quick") {
      title = `Quick ${capitalizeFirstLetter(query)} ${["Meal", "Dinner", "Lunch", "Breakfast", "Snack"][index % 5]}`
    }

    const ingredients = [
      `${Math.floor(Math.random() * 3) + 1} cups main ingredient`,
      "Salt and pepper to taste",
      `${Math.floor(Math.random() * 4) + 1} tablespoons olive oil`,
      `${Math.floor(Math.random() * 3) + 1} cloves garlic`,
      "1 onion, diced",
      `${Math.floor(Math.random() * 2) + 1} cups vegetables`,
      "Fresh herbs for garnish",
    ]

    const instructions = [
      "Prepare the ingredients by washing and cutting into pieces.",
      "Heat olive oil in a pan over medium heat.",
      "Add garlic and onion, sauté until fragrant.",
      "Add main ingredients and cook for 5-7 minutes.",
      "Season with salt and pepper to taste.",
      "Garnish with fresh herbs before serving.",
    ]

    // Add nutritional information
    const nutritionalInfo = {
      calories: Math.floor(Math.random() * 400) + 200,
      protein: Math.floor(Math.random() * 20) + 5,
      carbs: Math.floor(Math.random() * 30) + 10,
      fat: Math.floor(Math.random() * 15) + 5,
      fiber: Math.floor(Math.random() * 8) + 2,
    }

    // Add dietary tags
    const dietaryTags = []
    if (Math.random() > 0.7) dietaryTags.push("vegetarian")
    if (Math.random() > 0.8) dietaryTags.push("vegan")
    if (Math.random() > 0.7) dietaryTags.push("gluten-free")
    if (Math.random() > 0.8) dietaryTags.push("dairy-free")

    return {
      id,
      title,
      image: getFoodImageByCategory(category),
      prepTime: randomPrepTime,
      rating: Number.parseFloat(randomRating),
      category,
      ingredients,
      instructions,
      nutritionalInfo,
      dietaryTags,
      source: "external",
      trending: Math.random() > 0.8, // 20% chance of being trending
    }
  }

  // If recipe not found
  return null
}
