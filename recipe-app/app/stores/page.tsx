"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import { ChevronLeft, MapPin, ShoppingBag, Star, ExternalLink, Phone, Clock } from "lucide-react"
import { Skeleton } from "@/components/ui/skeleton"
import { findStores, findIngredientsByRecipe } from "@/lib/store-service"

export default function StoresPage() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const recipeId = searchParams.get("recipeId")
  const [location, setLocation] = useState("")
  const [searchPerformed, setSearchPerformed] = useState(false)
  const [loading, setLoading] = useState(false)
  const [stores, setStores] = useState<any[]>([])
  const [neededIngredients, setNeededIngredients] = useState<string[]>([])
  const [userLocation, setUserLocation] = useState<{ lat: number; lng: number } | null>(null)

  useEffect(() => {
    // Get user's location if they allow it
    if (navigator.geolocation) {
      try {
        navigator.geolocation.getCurrentPosition(
          (position) => {
            setUserLocation({
              lat: position.coords.latitude,
              lng: position.coords.longitude,
            })
          },
          (error) => {
            console.error("Error getting location:", error)
            // Don't set an error state, just continue without location
          },
          { timeout: 10000, enableHighAccuracy: false },
        )
      } catch (error) {
        console.error("Geolocation error:", error)
        // Continue without location
      }
    }

    // If a recipe ID is provided, fetch the needed ingredients
    if (recipeId) {
      const fetchIngredients = async () => {
        const ingredients = await findIngredientsByRecipe(recipeId)
        setNeededIngredients(ingredients)
      }
      fetchIngredients()
    }
  }, [recipeId])

  const handleSearch = async (e?: React.FormEvent) => {
    if (e) e.preventDefault()

    // Allow search even without location
    setLoading(true)
    setSearchPerformed(true)

    try {
      // If no location is provided, use a default or empty string
      const searchLocation = location.trim() || (userLocation ? "Current location" : "")
      const storeResults = await findStores(searchLocation, userLocation, neededIngredients)
      setStores(storeResults)
    } catch (error) {
      console.error("Error finding stores:", error)
    } finally {
      setLoading(false)
    }
  }

  // If we have user location but no search has been performed yet, do an automatic search
  useEffect(() => {
    if (userLocation && !searchPerformed && !loading) {
      handleSearch()
    }
  }, [userLocation, searchPerformed, loading])

  return (
    <div className="container px-4 py-8 pb-20">
      <div className="flex items-center mb-6">
        <Button variant="ghost" onClick={() => router.back()} className="mr-2">
          <ChevronLeft className="h-5 w-5" />
        </Button>
        <h1 className="text-2xl font-bold">Find Stores</h1>
      </div>

      {neededIngredients.length > 0 && (
        <Card className="mb-6 bg-teal-50 border-teal-200">
          <CardContent className="p-4">
            <h2 className="font-medium mb-2">Ingredients you need:</h2>
            <div className="flex flex-wrap gap-2">
              {neededIngredients.map((ingredient, index) => (
                <div key={index} className="px-3 py-1 bg-white rounded-full text-sm border border-teal-200">
                  {ingredient}
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      <form onSubmit={handleSearch} className="flex gap-2 mb-6">
        <div className="relative flex-1">
          <MapPin className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
          <Input
            type="text"
            placeholder={userLocation ? "Current location" : "Enter your location"}
            value={location}
            onChange={(e) => setLocation(e.target.value)}
            className="pl-10"
          />
        </div>
        <Button type="submit" className="bg-teal-600 hover:bg-teal-700">
          Find Stores
        </Button>
      </form>

      <Tabs defaultValue="all" className="mb-6">
        <TabsList className="bg-teal-50 w-full justify-start overflow-x-auto">
          <TabsTrigger value="all" className="data-[state=active]:bg-teal-600 data-[state=active]:text-white">
            All Stores
          </TabsTrigger>
          <TabsTrigger value="grocery" className="data-[state=active]:bg-teal-600 data-[state=active]:text-white">
            Grocery
          </TabsTrigger>
          <TabsTrigger value="farmers" className="data-[state=active]:bg-teal-600 data-[state=active]:text-white">
            Farmers Markets
          </TabsTrigger>
          <TabsTrigger value="specialty" className="data-[state=active]:bg-teal-600 data-[state=active]:text-white">
            Specialty
          </TabsTrigger>
        </TabsList>

        <TabsContent value="all">
          {loading ? (
            <div className="space-y-4">
              {[...Array(3)].map((_, i) => (
                <Card key={i}>
                  <CardContent className="p-4">
                    <div className="flex justify-between">
                      <div>
                        <Skeleton className="h-6 w-48 mb-2" />
                        <Skeleton className="h-4 w-32 mb-1" />
                        <Skeleton className="h-4 w-24" />
                      </div>
                      <Skeleton className="h-12 w-12 rounded-full" />
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          ) : stores.length > 0 ? (
            <div className="space-y-4">
              {stores.map((store, index) => (
                <Card key={index}>
                  <CardContent className="p-4">
                    <div className="flex justify-between items-start">
                      <div>
                        <h3 className="font-semibold text-lg mb-1">{store.name}</h3>
                        <div className="flex items-center text-sm text-gray-500 mb-1">
                          <MapPin className="h-4 w-4 mr-1" />
                          <span>{store.address}</span>
                        </div>
                        <div className="flex items-center text-sm text-gray-500 mb-2">
                          <Phone className="h-4 w-4 mr-1" />
                          <span>{store.phone}</span>
                        </div>
                        <div className="flex items-center mb-3">
                          <div className="flex mr-3">
                            {[...Array(5)].map((_, i) => (
                              <Star
                                key={i}
                                className={`h-4 w-4 ${
                                  i < store.rating ? "text-yellow-400 fill-yellow-400" : "text-gray-300"
                                }`}
                              />
                            ))}
                          </div>
                          <span className="text-sm text-gray-500">{store.reviews} reviews</span>
                        </div>
                        <div className="flex items-center text-sm text-gray-500 mb-3">
                          <Clock className="h-4 w-4 mr-1" />
                          <span>{store.hours}</span>
                        </div>
                        {store.hasIngredients && neededIngredients.length > 0 && (
                          <Badge className="bg-green-100 text-green-800 mb-3">Has all ingredients</Badge>
                        )}
                        <div className="flex gap-2">
                          <Button
                            size="sm"
                            className="bg-teal-600 hover:bg-teal-700"
                            onClick={() => window.open(store.directions, "_blank")}
                          >
                            Directions
                          </Button>
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => window.open(store.website, "_blank")}
                            className="flex items-center"
                          >
                            Website
                            <ExternalLink className="h-3 w-3 ml-1" />
                          </Button>
                        </div>
                      </div>
                      <div className="h-16 w-16 bg-gray-100 rounded-lg flex items-center justify-center">
                        <ShoppingBag className="h-8 w-8 text-gray-400" />
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          ) : searchPerformed ? (
            <div className="text-center py-12">
              <h3 className="text-xl font-medium mb-2">No stores found</h3>
              <p className="text-gray-500 mb-6">Try a different location or search term</p>
            </div>
          ) : (
            <div className="text-center py-12 bg-gray-50 rounded-lg">
              <MapPin className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-xl font-medium mb-2">Find stores near you</h3>
              <p className="text-gray-500 mb-6 max-w-md mx-auto">
                Search for grocery stores, farmers markets, and specialty shops to find ingredients for your recipes
              </p>
            </div>
          )}
        </TabsContent>

        <TabsContent value="grocery">
          {/* Similar content as "all" but filtered for grocery stores */}
          {!loading && searchPerformed && (
            <div className="space-y-4">
              {stores
                .filter((store) => store.type === "grocery")
                .map((store, index) => (
                  <Card key={index}>
                    <CardContent className="p-4">
                      <div className="flex justify-between items-start">
                        <div>
                          <h3 className="font-semibold text-lg mb-1">{store.name}</h3>
                          <div className="flex items-center text-sm text-gray-500 mb-1">
                            <MapPin className="h-4 w-4 mr-1" />
                            <span>{store.address}</span>
                          </div>
                          <div className="flex items-center text-sm text-gray-500 mb-2">
                            <Phone className="h-4 w-4 mr-1" />
                            <span>{store.phone}</span>
                          </div>
                          <div className="flex items-center mb-3">
                            <div className="flex mr-3">
                              {[...Array(5)].map((_, i) => (
                                <Star
                                  key={i}
                                  className={`h-4 w-4 ${
                                    i < store.rating ? "text-yellow-400 fill-yellow-400" : "text-gray-300"
                                  }`}
                                />
                              ))}
                            </div>
                            <span className="text-sm text-gray-500">{store.reviews} reviews</span>
                          </div>
                          {store.hasIngredients && neededIngredients.length > 0 && (
                            <Badge className="bg-green-100 text-green-800 mb-3">Has all ingredients</Badge>
                          )}
                          <div className="flex gap-2">
                            <Button
                              size="sm"
                              className="bg-teal-600 hover:bg-teal-700"
                              onClick={() => window.open(store.directions, "_blank")}
                            >
                              Directions
                            </Button>
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() => window.open(store.website, "_blank")}
                              className="flex items-center"
                            >
                              Website
                              <ExternalLink className="h-3 w-3 ml-1" />
                            </Button>
                          </div>
                        </div>
                        <div className="h-16 w-16 bg-gray-100 rounded-lg flex items-center justify-center">
                          <ShoppingBag className="h-8 w-8 text-gray-400" />
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
            </div>
          )}
        </TabsContent>

        {/* Similar content for other tabs */}
      </Tabs>
    </div>
  )
}
