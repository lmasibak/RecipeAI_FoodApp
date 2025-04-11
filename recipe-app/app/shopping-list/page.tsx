"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent } from "@/components/ui/card"
import { Checkbox } from "@/components/ui/checkbox"
import { Separator } from "@/components/ui/separator"
import { ChevronLeft, Plus, Trash2, ShoppingCart, Share2, MapPin } from "lucide-react"
import { findIngredientsByRecipe } from "@/lib/store-service"
import { useShoppingList } from "@/lib/shopping-list"

export default function ShoppingListPage() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const recipeId = searchParams.get("recipeId")
  const { shoppingList, addItem, removeItem, toggleItem, clearList } = useShoppingList()
  const [newItem, setNewItem] = useState("")

  useEffect(() => {
    // If a recipe ID is provided, fetch the needed ingredients and add them to the list
    if (recipeId) {
      const fetchIngredients = async () => {
        const ingredients = await findIngredientsByRecipe(recipeId)
        ingredients.forEach((ingredient) => {
          addItem(ingredient)
        })
      }
      fetchIngredients()
    }
  }, [recipeId, addItem])

  const handleAddItem = (e: React.FormEvent) => {
    e.preventDefault()
    if (newItem.trim()) {
      addItem(newItem)
      setNewItem("")
    }
  }

  const handleClearCompleted = () => {
    const newList = shoppingList.filter((item) => !item.checked)
    clearList()
    newList.forEach((item) => addItem(item.name))
  }

  // Group items by category (checked/unchecked)
  const uncheckedItems = shoppingList.filter((item) => !item.checked)
  const checkedItems = shoppingList.filter((item) => item.checked)

  return (
    <div className="container px-4 py-8 pb-20">
      <div className="flex items-center mb-6">
        <Button variant="ghost" onClick={() => router.back()} className="mr-2">
          <ChevronLeft className="h-5 w-5" />
        </Button>
        <h1 className="text-2xl font-bold">Shopping List</h1>
      </div>

      <form onSubmit={handleAddItem} className="flex gap-2 mb-6">
        <div className="relative flex-1">
          <Input
            type="text"
            placeholder="Add an item..."
            value={newItem}
            onChange={(e) => setNewItem(e.target.value)}
          />
        </div>
        <Button type="submit" className="bg-teal-600 hover:bg-teal-700">
          <Plus className="h-4 w-4 mr-2" />
          Add
        </Button>
      </form>

      <div className="flex justify-between items-center mb-4">
        <div className="flex items-center">
          <ShoppingCart className="h-5 w-5 mr-2 text-teal-600" />
          <h2 className="font-semibold text-lg">Your Items</h2>
        </div>
        <div className="flex gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => router.push("/stores")}
            className="flex items-center text-teal-600"
          >
            <MapPin className="h-4 w-4 mr-1" />
            Find Stores
          </Button>
          <Button variant="outline" size="sm" className="flex items-center text-teal-600">
            <Share2 className="h-4 w-4 mr-1" />
            Share List
          </Button>
        </div>
      </div>

      <Card className="mb-6">
        <CardContent className="p-4">
          {shoppingList.length === 0 ? (
            <div className="text-center py-8">
              <ShoppingCart className="h-12 w-12 text-gray-300 mx-auto mb-4" />
              <p className="text-gray-500">Your shopping list is empty</p>
              <p className="text-sm text-gray-400 mt-1">Add items or import from a recipe</p>
            </div>
          ) : (
            <div>
              {uncheckedItems.length > 0 && (
                <div className="mb-4">
                  <h3 className="font-medium text-sm text-gray-500 mb-2">TO BUY ({uncheckedItems.length})</h3>
                  <div className="space-y-2">
                    {uncheckedItems.map((item) => (
                      <div key={item.id} className="flex items-center justify-between">
                        <div className="flex items-center">
                          <Checkbox
                            id={item.id}
                            checked={item.checked}
                            onCheckedChange={() => toggleItem(item.id)}
                            className="mr-3"
                          />
                          <label htmlFor={item.id} className="text-sm font-medium cursor-pointer">
                            {item.name}
                          </label>
                        </div>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => removeItem(item.id)}
                          className="h-8 w-8 p-0 text-gray-400 hover:text-red-500"
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {checkedItems.length > 0 && (
                <>
                  {uncheckedItems.length > 0 && <Separator className="my-4" />}
                  <div>
                    <div className="flex justify-between items-center mb-2">
                      <h3 className="font-medium text-sm text-gray-500">IN CART ({checkedItems.length})</h3>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={handleClearCompleted}
                        className="h-8 text-xs text-gray-500"
                      >
                        Clear completed
                      </Button>
                    </div>
                    <div className="space-y-2">
                      {checkedItems.map((item) => (
                        <div key={item.id} className="flex items-center justify-between">
                          <div className="flex items-center">
                            <Checkbox
                              id={item.id}
                              checked={item.checked}
                              onCheckedChange={() => toggleItem(item.id)}
                              className="mr-3"
                            />
                            <label
                              htmlFor={item.id}
                              className="text-sm font-medium text-gray-500 line-through cursor-pointer"
                            >
                              {item.name}
                            </label>
                          </div>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => removeItem(item.id)}
                            className="h-8 w-8 p-0 text-gray-400 hover:text-red-500"
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      ))}
                    </div>
                  </div>
                </>
              )}
            </div>
          )}
        </CardContent>
      </Card>

      {shoppingList.length > 0 && (
        <div className="flex justify-between">
          <Button variant="outline" className="text-red-500" onClick={() => clearList()}>
            <Trash2 className="h-4 w-4 mr-2" />
            Clear All
          </Button>
          <Button className="bg-teal-600 hover:bg-teal-700" onClick={() => router.push("/stores")}>
            Find Stores Nearby
          </Button>
        </div>
      )}
    </div>
  )
}
