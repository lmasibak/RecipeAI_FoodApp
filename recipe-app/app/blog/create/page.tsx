"use client"

import type React from "react"

import { useState } from "react"
import { useRouter } from "next/navigation"
import Image from "next/image"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { ChevronLeft, Camera, X, Search } from "lucide-react"
import { recipes } from "@/lib/data"

export default function CreateBlogPostPage() {
  const router = useRouter()
  const [title, setTitle] = useState("")
  const [content, setContent] = useState("")
  const [tags, setTags] = useState("")
  const [beforeImage, setBeforeImage] = useState<string | null>(null)
  const [afterImage, setAfterImage] = useState<string | null>(null)
  const [selectedRecipe, setSelectedRecipe] = useState<string | null>(null)
  const [searchQuery, setSearchQuery] = useState("")
  const [showRecipeSearch, setShowRecipeSearch] = useState(false)

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()

    // In a real app, this would send the data to an API
    // For now, we'll just simulate success and redirect

    setTimeout(() => {
      router.push("/blog")
    }, 1000)
  }

  // Simulate image upload
  const handleImageUpload = (type: "before" | "after") => {
    // In a real app, this would open a file picker and upload the image
    // For now, we'll just set a placeholder image

    const placeholderImages = {
      before: [
        "https://images.unsplash.com/photo-1542010589005-d1eacc3918f2?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
        "https://images.unsplash.com/photo-1542838132-92c53300491e?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
        "https://images.unsplash.com/photo-1517433670267-08bbd4be890f?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
      ],
      after: [
        "https://images.unsplash.com/photo-1565958011703-44f9829ba187?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
        "https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
        "https://images.unsplash.com/photo-1565299507177-b0ac66763828?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
      ],
    }

    const randomIndex = Math.floor(Math.random() * 3)

    if (type === "before") {
      setBeforeImage(placeholderImages.before[randomIndex])
    } else {
      setAfterImage(placeholderImages.after[randomIndex])
    }
  }

  // Filter recipes based on search query
  const filteredRecipes = searchQuery
    ? recipes.filter((recipe) => recipe.title.toLowerCase().includes(searchQuery.toLowerCase()))
    : recipes.slice(0, 5) // Show first 5 recipes if no search

  return (
    <div className="container px-4 py-8 pb-20">
      <div className="flex items-center mb-6">
        <Button variant="ghost" onClick={() => router.back()} className="mr-2">
          <ChevronLeft className="h-5 w-5" />
        </Button>
        <h1 className="text-2xl font-bold">Share Your Creation</h1>
      </div>

      <form onSubmit={handleSubmit}>
        <Card className="mb-6">
          <CardHeader>
            <CardTitle>Post Details</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="title">Title</Label>
              <Input
                id="title"
                placeholder="My amazing recipe creation"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="content">Description</Label>
              <Textarea
                id="content"
                placeholder="Share your cooking experience..."
                className="min-h-[100px]"
                value={content}
                onChange={(e) => setContent(e.target.value)}
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="tags">Tags (comma separated)</Label>
              <Input
                id="tags"
                placeholder="homemade, dessert, chocolate"
                value={tags}
                onChange={(e) => setTags(e.target.value)}
              />
            </div>
          </CardContent>
        </Card>

        <Card className="mb-6">
          <CardHeader>
            <CardTitle>Before & After Photos</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label className="block mb-2">Before</Label>
                {beforeImage ? (
                  <div className="relative h-48 rounded-md overflow-hidden mb-2">
                    <Image src={beforeImage || "/placeholder.svg"} alt="Before" fill className="object-cover" />
                    <Button
                      variant="destructive"
                      size="icon"
                      className="absolute top-2 right-2 h-8 w-8"
                      onClick={() => setBeforeImage(null)}
                      type="button"
                    >
                      <X className="h-4 w-4" />
                    </Button>
                  </div>
                ) : (
                  <div
                    className="h-48 border-2 border-dashed rounded-md flex flex-col items-center justify-center cursor-pointer hover:bg-gray-50"
                    onClick={() => handleImageUpload("before")}
                  >
                    <Camera className="h-8 w-8 text-gray-400 mb-2" />
                    <span className="text-sm text-gray-500">Upload before photo</span>
                  </div>
                )}
              </div>

              <div>
                <Label className="block mb-2">After</Label>
                {afterImage ? (
                  <div className="relative h-48 rounded-md overflow-hidden mb-2">
                    <Image src={afterImage || "/placeholder.svg"} alt="After" fill className="object-cover" />
                    <Button
                      variant="destructive"
                      size="icon"
                      className="absolute top-2 right-2 h-8 w-8"
                      onClick={() => setAfterImage(null)}
                      type="button"
                    >
                      <X className="h-4 w-4" />
                    </Button>
                  </div>
                ) : (
                  <div
                    className="h-48 border-2 border-dashed rounded-md flex flex-col items-center justify-center cursor-pointer hover:bg-gray-50"
                    onClick={() => handleImageUpload("after")}
                  >
                    <Camera className="h-8 w-8 text-gray-400 mb-2" />
                    <span className="text-sm text-gray-500">Upload after photo</span>
                  </div>
                )}
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="mb-6">
          <CardHeader>
            <CardTitle>Link to Recipe</CardTitle>
          </CardHeader>
          <CardContent>
            {selectedRecipe ? (
              <div className="bg-gray-50 p-3 rounded-md">
                <div className="flex justify-between items-center">
                  <div>
                    <h3 className="font-medium">{recipes.find((r) => r.id === selectedRecipe)?.title}</h3>
                    <p className="text-sm text-gray-500">{recipes.find((r) => r.id === selectedRecipe)?.category}</p>
                  </div>
                  <Button variant="ghost" size="sm" onClick={() => setSelectedRecipe(null)} type="button">
                    Change
                  </Button>
                </div>
              </div>
            ) : (
              <div>
                <Button
                  variant="outline"
                  className="w-full justify-start mb-4"
                  onClick={() => setShowRecipeSearch(!showRecipeSearch)}
                  type="button"
                >
                  <Search className="h-4 w-4 mr-2" />
                  Search for a recipe
                </Button>

                {showRecipeSearch && (
                  <div className="border rounded-md p-3">
                    <div className="mb-3">
                      <Input
                        placeholder="Search recipes..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                      />
                    </div>

                    <div className="max-h-60 overflow-y-auto space-y-2">
                      {filteredRecipes.map((recipe) => (
                        <div
                          key={recipe.id}
                          className="p-2 hover:bg-gray-50 rounded cursor-pointer"
                          onClick={() => {
                            setSelectedRecipe(recipe.id)
                            setShowRecipeSearch(false)
                          }}
                        >
                          <div className="font-medium">{recipe.title}</div>
                          <div className="text-sm text-gray-500">{recipe.category}</div>
                        </div>
                      ))}

                      {filteredRecipes.length === 0 && (
                        <div className="text-center py-4 text-gray-500">No recipes found</div>
                      )}
                    </div>
                  </div>
                )}
              </div>
            )}
          </CardContent>
        </Card>

        <div className="flex justify-end">
          <Button type="button" variant="outline" className="mr-2" onClick={() => router.back()}>
            Cancel
          </Button>
          <Button
            type="submit"
            className="bg-teal-600 hover:bg-teal-700"
            disabled={!title || !content || !beforeImage || !afterImage}
          >
            Publish Post
          </Button>
        </div>
      </form>
    </div>
  )
}
