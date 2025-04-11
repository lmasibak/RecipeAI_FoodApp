"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Switch } from "@/components/ui/switch"
import { Label } from "@/components/ui/label"
import { Separator } from "@/components/ui/separator"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { ChevronLeft, Heart, Settings, User, Calendar, BookOpen, BarChart2 } from "lucide-react"
import RecipeCard from "@/components/RecipeCard"
import { recipes } from "@/lib/data"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { useUserProfile } from "@/lib/user-profile"

export default function ProfilePage() {
  const router = useRouter()
  const { profile, updateDietaryPreferences } = useUserProfile()
  const [activeTab, setActiveTab] = useState("saved")

  // Simulate saved recipes
  const savedRecipes = recipes.filter((_, i) => i % 3 === 0)

  // Simulate meal plan
  const mealPlan = [
    { day: "Monday", meals: ["Creamy Garlic Parmesan Pasta", "Vegetable Stir Fry"] },
    { day: "Tuesday", meals: ["Lemon Herb Roasted Chicken", "Chocolate Chip Cookies"] },
    { day: "Wednesday", meals: ["Vegetable Stir Fry", "Blueberry Muffins"] },
    { day: "Thursday", meals: ["Party Nachos Supreme", "Chocolate Chip Cookies"] },
    { day: "Friday", meals: ["Creamy Garlic Parmesan Pasta", "Party Punch Bowl"] },
    { day: "Saturday", meals: ["Mini Caprese Skewers", "Cinnamon Rolls"] },
    { day: "Sunday", meals: ["Lemon Herb Roasted Chicken", "Blueberry Muffins"] },
  ]

  const handleDietaryToggle = (preference: string) => {
    const updatedPreferences = { ...profile.dietaryPreferences }
    updatedPreferences[preference] = !updatedPreferences[preference]
    updateDietaryPreferences(updatedPreferences)
  }

  return (
    <div className="container px-4 py-8">
      <div className="flex items-center mb-6">
        <Button variant="ghost" onClick={() => router.back()} className="mr-2">
          <ChevronLeft className="h-5 w-5" />
        </Button>
        <h1 className="text-2xl font-bold">My Profile</h1>
        <Button variant="ghost" size="icon" className="ml-auto">
          <Settings className="h-5 w-5" />
        </Button>
      </div>

      <div className="flex flex-col md:flex-row gap-6 mb-8">
        <Card className="md:w-1/3">
          <CardContent className="pt-6">
            <div className="flex flex-col items-center">
              <Avatar className="h-24 w-24 mb-4">
                <AvatarImage src="/placeholder.svg?height=96&width=96" />
                <AvatarFallback>
                  <User className="h-12 w-12" />
                </AvatarFallback>
              </Avatar>
              <h2 className="text-xl font-bold mb-1">Alex Johnson</h2>
              <p className="text-gray-500 mb-4">@alexjohnson</p>
              <div className="flex gap-4 mb-4">
                <div className="text-center">
                  <p className="font-bold">{savedRecipes.length}</p>
                  <p className="text-sm text-gray-500">Saved</p>
                </div>
                <Separator orientation="vertical" className="h-10" />
                <div className="text-center">
                  <p className="font-bold">24</p>
                  <p className="text-sm text-gray-500">Created</p>
                </div>
                <Separator orientation="vertical" className="h-10" />
                <div className="text-center">
                  <p className="font-bold">156</p>
                  <p className="text-sm text-gray-500">Followers</p>
                </div>
              </div>
              <Button className="w-full bg-teal-600 hover:bg-teal-700">Edit Profile</Button>
            </div>
          </CardContent>
        </Card>

        <Card className="md:w-2/3">
          <CardHeader>
            <CardTitle>Dietary Preferences</CardTitle>
            <CardDescription>Customize your recipe recommendations based on your dietary needs</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="flex items-center justify-between space-x-2">
                <Label htmlFor="vegetarian" className="flex items-center space-x-2">
                  <Badge variant="outline" className="bg-green-50 text-green-700 hover:bg-green-100">
                    Vegetarian
                  </Badge>
                </Label>
                <Switch
                  id="vegetarian"
                  checked={profile.dietaryPreferences.vegetarian}
                  onCheckedChange={() => handleDietaryToggle("vegetarian")}
                />
              </div>
              <div className="flex items-center justify-between space-x-2">
                <Label htmlFor="vegan" className="flex items-center space-x-2">
                  <Badge variant="outline" className="bg-green-50 text-green-700 hover:bg-green-100">
                    Vegan
                  </Badge>
                </Label>
                <Switch
                  id="vegan"
                  checked={profile.dietaryPreferences.vegan}
                  onCheckedChange={() => handleDietaryToggle("vegan")}
                />
              </div>
              <div className="flex items-center justify-between space-x-2">
                <Label htmlFor="glutenFree" className="flex items-center space-x-2">
                  <Badge variant="outline" className="bg-amber-50 text-amber-700 hover:bg-amber-100">
                    Gluten Free
                  </Badge>
                </Label>
                <Switch
                  id="glutenFree"
                  checked={profile.dietaryPreferences.glutenFree}
                  onCheckedChange={() => handleDietaryToggle("glutenFree")}
                />
              </div>
              <div className="flex items-center justify-between space-x-2">
                <Label htmlFor="dairyFree" className="flex items-center space-x-2">
                  <Badge variant="outline" className="bg-amber-50 text-amber-700 hover:bg-amber-100">
                    Dairy Free
                  </Badge>
                </Label>
                <Switch
                  id="dairyFree"
                  checked={profile.dietaryPreferences.dairyFree}
                  onCheckedChange={() => handleDietaryToggle("dairyFree")}
                />
              </div>
              <div className="flex items-center justify-between space-x-2">
                <Label htmlFor="keto" className="flex items-center space-x-2">
                  <Badge variant="outline" className="bg-purple-50 text-purple-700 hover:bg-purple-100">
                    Keto
                  </Badge>
                </Label>
                <Switch
                  id="keto"
                  checked={profile.dietaryPreferences.keto}
                  onCheckedChange={() => handleDietaryToggle("keto")}
                />
              </div>
              <div className="flex items-center justify-between space-x-2">
                <Label htmlFor="paleo" className="flex items-center space-x-2">
                  <Badge variant="outline" className="bg-purple-50 text-purple-700 hover:bg-purple-100">
                    Paleo
                  </Badge>
                </Label>
                <Switch
                  id="paleo"
                  checked={profile.dietaryPreferences.paleo}
                  onCheckedChange={() => handleDietaryToggle("paleo")}
                />
              </div>
              <div className="flex items-center justify-between space-x-2">
                <Label htmlFor="lowCarb" className="flex items-center space-x-2">
                  <Badge variant="outline" className="bg-blue-50 text-blue-700 hover:bg-blue-100">
                    Low Carb
                  </Badge>
                </Label>
                <Switch
                  id="lowCarb"
                  checked={profile.dietaryPreferences.lowCarb}
                  onCheckedChange={() => handleDietaryToggle("lowCarb")}
                />
              </div>
              <div className="flex items-center justify-between space-x-2">
                <Label htmlFor="lowFat" className="flex items-center space-x-2">
                  <Badge variant="outline" className="bg-blue-50 text-blue-700 hover:bg-blue-100">
                    Low Fat
                  </Badge>
                </Label>
                <Switch
                  id="lowFat"
                  checked={profile.dietaryPreferences.lowFat}
                  onCheckedChange={() => handleDietaryToggle("lowFat")}
                />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="saved" value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid grid-cols-4 mb-8">
          <TabsTrigger value="saved" className="data-[state=active]:bg-teal-600 data-[state=active]:text-white">
            <Heart className="h-4 w-4 mr-2" />
            Saved
          </TabsTrigger>
          <TabsTrigger value="mealplan" className="data-[state=active]:bg-teal-600 data-[state=active]:text-white">
            <Calendar className="h-4 w-4 mr-2" />
            Meal Plan
          </TabsTrigger>
          <TabsTrigger value="cookbook" className="data-[state=active]:bg-teal-600 data-[state=active]:text-white">
            <BookOpen className="h-4 w-4 mr-2" />
            Cookbook
          </TabsTrigger>
          <TabsTrigger value="wellness" className="data-[state=active]:bg-teal-600 data-[state=active]:text-white">
            <BarChart2 className="h-4 w-4 mr-2" />
            Wellness
          </TabsTrigger>
        </TabsList>

        <TabsContent value="saved">
          <h2 className="text-xl font-bold mb-4">Saved Recipes</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {savedRecipes.map((recipe) => (
              <RecipeCard key={recipe.id} recipe={recipe} />
            ))}
          </div>
        </TabsContent>

        <TabsContent value="mealplan">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-bold">Weekly Meal Plan</h2>
            <Button className="bg-teal-600 hover:bg-teal-700">Generate New Plan</Button>
          </div>
          <div className="grid gap-4">
            {mealPlan.map((day, index) => (
              <Card key={index}>
                <CardHeader className="py-3">
                  <CardTitle className="text-lg">{day.day}</CardTitle>
                </CardHeader>
                <CardContent className="py-2">
                  <div className="space-y-2">
                    {day.meals.map((meal, mealIndex) => (
                      <div key={mealIndex} className="flex justify-between items-center p-2 bg-gray-50 rounded-md">
                        <span>{meal}</span>
                        <Button variant="ghost" size="sm">
                          <Heart className="h-4 w-4" />
                        </Button>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="cookbook">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-bold">My Cookbook</h2>
            <Button className="bg-teal-600 hover:bg-teal-700">Create Recipe</Button>
          </div>
          <div className="text-center py-12 bg-gray-50 rounded-lg">
            <BookOpen className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-xl font-medium mb-2">Your cookbook is empty</h3>
            <p className="text-gray-500 mb-6">Create your own recipes and save them to your cookbook</p>
            <Button className="bg-teal-600 hover:bg-teal-700">Create Your First Recipe</Button>
          </div>
        </TabsContent>

        <TabsContent value="wellness">
          <h2 className="text-xl font-bold mb-4">Wellness Dashboard</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
            <Card>
              <CardHeader>
                <CardTitle>Nutritional Balance</CardTitle>
                <CardDescription>Based on your meal plan this week</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div>
                    <div className="flex justify-between mb-1">
                      <span className="text-sm font-medium">Protein</span>
                      <span className="text-sm text-gray-500">72%</span>
                    </div>
                    <Progress value={72} className="h-2 bg-gray-100" indicatorClassName="bg-green-500" />
                  </div>
                  <div>
                    <div className="flex justify-between mb-1">
                      <span className="text-sm font-medium">Carbs</span>
                      <span className="text-sm text-gray-500">45%</span>
                    </div>
                    <Progress value={45} className="h-2 bg-gray-100" indicatorClassName="bg-blue-500" />
                  </div>
                  <div>
                    <div className="flex justify-between mb-1">
                      <span className="text-sm font-medium">Fats</span>
                      <span className="text-sm text-gray-500">60%</span>
                    </div>
                    <Progress value={60} className="h-2 bg-gray-100" indicatorClassName="bg-yellow-500" />
                  </div>
                  <div>
                    <div className="flex justify-between mb-1">
                      <span className="text-sm font-medium">Fiber</span>
                      <span className="text-sm text-gray-500">38%</span>
                    </div>
                    <Progress value={38} className="h-2 bg-gray-100" indicatorClassName="bg-purple-500" />
                  </div>
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardHeader>
                <CardTitle>Dietary Goals</CardTitle>
                <CardDescription>Track your progress</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-medium">Vegetable Servings</p>
                      <p className="text-sm text-gray-500">3 of 5 daily servings</p>
                    </div>
                    <Badge className="bg-green-100 text-green-800">60%</Badge>
                  </div>
                  <Separator />
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-medium">Water Intake</p>
                      <p className="text-sm text-gray-500">6 of 8 glasses</p>
                    </div>
                    <Badge className="bg-blue-100 text-blue-800">75%</Badge>
                  </div>
                  <Separator />
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-medium">Home Cooked Meals</p>
                      <p className="text-sm text-gray-500">12 of 14 meals this week</p>
                    </div>
                    <Badge className="bg-teal-100 text-teal-800">85%</Badge>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
          <Card>
            <CardHeader>
              <CardTitle>Wellness Tips</CardTitle>
              <CardDescription>Personalized for your dietary preferences</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="p-4 bg-teal-50 rounded-lg">
                  <h3 className="font-medium mb-2">Boost your protein intake</h3>
                  <p className="text-sm text-gray-600">
                    Based on your meal plan, try adding more plant-based proteins like lentils, chickpeas, and tofu to
                    your diet.
                  </p>
                </div>
                <div className="p-4 bg-blue-50 rounded-lg">
                  <h3 className="font-medium mb-2">Stay hydrated</h3>
                  <p className="text-sm text-gray-600">
                    Remember to drink water throughout the day, especially before meals to help with portion control.
                  </p>
                </div>
                <div className="p-4 bg-purple-50 rounded-lg">
                  <h3 className="font-medium mb-2">Meal prep suggestion</h3>
                  <p className="text-sm text-gray-600">
                    Try preparing your vegetable sides for the entire week on Sunday to save time and ensure you meet
                    your veggie goals.
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
