import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Camera, ChefHat, Search, ShoppingCart, MapPin, BookOpen } from "lucide-react"
import RecipeCard from "@/components/RecipeCard"
import { recipes } from "@/lib/data"
import { getFoodImageByCategory } from "@/lib/image-service"

export default function Home() {
  // Enhance recipes with real images
  const enhancedRecipes = recipes.map((recipe) => ({
    ...recipe,
    image: getFoodImageByCategory(recipe.category),
  }))

  return (
    <div className="flex flex-col min-h-screen bg-gradient-to-b from-teal-50 to-white pb-20">
      <header className="sticky top-0 z-10 bg-white/80 backdrop-blur-md border-b">
        <div className="container flex items-center justify-between h-16 px-4">
          <Link href="/" className="flex items-center space-x-2">
            <ChefHat className="h-6 w-6 text-teal-600" />
            <span className="font-bold text-xl text-teal-800">RecipeAI</span>
          </Link>
          <div className="flex items-center space-x-4">
            <Link href="/search">
              <Button variant="ghost" size="icon">
                <Search className="h-5 w-5" />
              </Button>
            </Link>
            <Link href="/camera">
              <Button className="bg-teal-600 hover:bg-teal-700">
                <Camera className="h-4 w-4 mr-2" />
                Scan Ingredients
              </Button>
            </Link>
          </div>
        </div>
      </header>

      <main className="flex-1 container px-4 py-6">
        <section className="mb-10">
          <Card className="bg-gradient-to-r from-teal-600 to-teal-500 text-white border-none">
            <CardContent className="p-6 flex flex-col md:flex-row items-center">
              <div className="md:w-2/3 mb-6 md:mb-0">
                <h1 className="text-3xl font-bold mb-2">Discover Your Next Favorite Dish</h1>
                <p className="text-teal-50 mb-4">
                  Scan your ingredients or search online for personalized recipe recommendations
                </p>
                <div className="flex flex-wrap gap-3">
                  <Link href="/camera">
                    <Button className="bg-white text-teal-700 hover:bg-teal-50">
                      <Camera className="h-4 w-4 mr-2" />
                      Scan Ingredients
                    </Button>
                  </Link>
                  <Link href="/search">
                    <Button variant="outline" className="bg-transparent text-white border-white hover:bg-teal-700">
                      <Search className="h-4 w-4 mr-2" />
                      Search Recipes
                    </Button>
                  </Link>
                </div>
              </div>
              <div className="md:w-1/3 flex justify-center">
                <div className="w-40 h-40 rounded-full bg-teal-400 flex items-center justify-center">
                  <ChefHat className="h-20 w-20 text-white" />
                </div>
              </div>
            </CardContent>
          </Card>
        </section>

        <section className="mb-10">
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            <Link href="/shopping-list">
              <Card className="hover:shadow-md transition-shadow">
                <CardContent className="p-4 flex flex-col items-center text-center">
                  <ShoppingCart className="h-8 w-8 text-teal-600 mb-2" />
                  <h3 className="font-medium">Shopping List</h3>
                  <p className="text-sm text-gray-500">Track ingredients you need</p>
                </CardContent>
              </Card>
            </Link>
            <Link href="/stores">
              <Card className="hover:shadow-md transition-shadow">
                <CardContent className="p-4 flex flex-col items-center text-center">
                  <MapPin className="h-8 w-8 text-teal-600 mb-2" />
                  <h3 className="font-medium">Find Stores</h3>
                  <p className="text-sm text-gray-500">Get ingredients nearby</p>
                </CardContent>
              </Card>
            </Link>
            <Link href="/blog">
              <Card className="hover:shadow-md transition-shadow">
                <CardContent className="p-4 flex flex-col items-center text-center">
                  <BookOpen className="h-8 w-8 text-teal-600 mb-2" />
                  <h3 className="font-medium">Before & After</h3>
                  <p className="text-sm text-gray-500">Share your creations</p>
                </CardContent>
              </Card>
            </Link>
            <Link href="/profile">
              <Card className="hover:shadow-md transition-shadow">
                <CardContent className="p-4 flex flex-col items-center text-center">
                  <ChefHat className="h-8 w-8 text-teal-600 mb-2" />
                  <h3 className="font-medium">My Profile</h3>
                  <p className="text-sm text-gray-500">Dietary preferences</p>
                </CardContent>
              </Card>
            </Link>
          </div>
        </section>

        <section className="mb-10">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold text-gray-800">Trending Now</h2>
            <Link href="/trending">
              <Button variant="link" className="text-teal-600">
                View all
              </Button>
            </Link>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {enhancedRecipes
              .filter((recipe) => recipe.trending)
              .slice(0, 3)
              .map((recipe) => (
                <RecipeCard key={recipe.id} recipe={recipe} />
              ))}
          </div>
        </section>

        <section>
          <Tabs defaultValue="cooking" className="w-full">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-bold text-gray-800">Browse Categories</h2>
              <TabsList className="bg-teal-100">
                <TabsTrigger value="cooking" className="data-[state=active]:bg-teal-600 data-[state=active]:text-white">
                  Cooking
                </TabsTrigger>
                <TabsTrigger value="baking" className="data-[state=active]:bg-teal-600 data-[state=active]:text-white">
                  Baking
                </TabsTrigger>
                <TabsTrigger value="party" className="data-[state=active]:bg-teal-600 data-[state=active]:text-white">
                  Party
                </TabsTrigger>
              </TabsList>
            </div>

            <TabsContent value="cooking">
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {enhancedRecipes
                  .filter((recipe) => recipe.category === "cooking")
                  .slice(0, 6)
                  .map((recipe) => (
                    <RecipeCard key={recipe.id} recipe={recipe} />
                  ))}
              </div>
            </TabsContent>

            <TabsContent value="baking">
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {enhancedRecipes
                  .filter((recipe) => recipe.category === "baking")
                  .slice(0, 6)
                  .map((recipe) => (
                    <RecipeCard key={recipe.id} recipe={recipe} />
                  ))}
              </div>
            </TabsContent>

            <TabsContent value="party">
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {enhancedRecipes
                  .filter((recipe) => recipe.category === "party")
                  .slice(0, 6)
                  .map((recipe) => (
                    <RecipeCard key={recipe.id} recipe={recipe} />
                  ))}
              </div>
            </TabsContent>
          </Tabs>
        </section>
      </main>

      <footer className="bg-gray-50 border-t py-8">
        <div className="container px-4">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <div className="flex items-center space-x-2 mb-4 md:mb-0">
              <ChefHat className="h-6 w-6 text-teal-600" />
              <span className="font-bold text-xl text-teal-800">RecipeAI</span>
            </div>
            <div className="text-sm text-gray-500">© {new Date().getFullYear()} RecipeAI. All rights reserved.</div>
          </div>
        </div>
      </footer>
    </div>
  )
}
