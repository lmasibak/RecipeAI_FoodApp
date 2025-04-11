import Link from "next/link"
import Image from "next/image"
import { Card, CardContent, CardFooter } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Clock, Heart, Share2, Star } from "lucide-react"

interface Recipe {
  id: string
  title: string
  image: string
  prepTime: number
  rating: number
  category: string
  trending?: boolean
  dietaryTags?: string[]
}

interface RecipeCardProps {
  recipe: Recipe
}

export default function RecipeCard({ recipe }: RecipeCardProps) {
  return (
    <Card className="overflow-hidden transition-all hover:shadow-lg">
      <Link href={`/recipe/${recipe.id}`}>
        <div className="relative h-48">
          <Image src={recipe.image || "/placeholder.svg"} alt={recipe.title} fill className="object-cover" />
          <Button
            variant="ghost"
            size="icon"
            className="absolute top-2 right-2 bg-white/80 hover:bg-white text-teal-600 rounded-full"
          >
            <Heart className="h-5 w-5" />
          </Button>

          {recipe.dietaryTags && recipe.dietaryTags.length > 0 && (
            <div className="absolute bottom-2 left-2 flex flex-wrap gap-1">
              {recipe.dietaryTags.slice(0, 2).map((tag) => (
                <Badge key={tag} className="bg-green-100 text-green-800 text-xs">
                  {tag}
                </Badge>
              ))}
            </div>
          )}
        </div>
      </Link>
      <CardContent className="p-4">
        <Link href={`/recipe/${recipe.id}`}>
          <div className="flex justify-between items-start mb-2">
            <h3 className="font-semibold text-lg line-clamp-2">{recipe.title}</h3>
          </div>
        </Link>
        <div className="flex items-center justify-between">
          <div className="flex items-center text-sm text-gray-500">
            <Clock className="h-4 w-4 mr-1" />
            <span>{recipe.prepTime} min</span>
          </div>
          <div className="flex items-center">
            <Star className="h-4 w-4 text-yellow-400 mr-1" />
            <span className="text-sm font-medium">{recipe.rating}</span>
          </div>
        </div>
      </CardContent>
      <CardFooter className="p-4 pt-0 flex justify-between">
        <Badge variant="outline" className="bg-teal-50 text-teal-700 hover:bg-teal-100">
          {recipe.category}
        </Badge>
        <Button variant="ghost" size="icon" className="text-gray-500">
          <Share2 className="h-4 w-4" />
        </Button>
      </CardFooter>
    </Card>
  )
}
