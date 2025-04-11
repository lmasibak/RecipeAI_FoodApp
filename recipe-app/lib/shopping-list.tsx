"use client"

import { createContext, useContext, useState, useEffect, type ReactNode } from "react"

interface ShoppingItem {
  id: string
  name: string
  checked: boolean
  category?: string
  addedAt: Date
}

interface ShoppingListContextType {
  shoppingList: ShoppingItem[]
  addItem: (name: string, category?: string) => void
  removeItem: (id: string) => void
  toggleItem: (id: string) => void
  clearList: () => void
}

const ShoppingListContext = createContext<ShoppingListContextType | undefined>(undefined)

export function ShoppingListProvider({ children }: { children: ReactNode }) {
  const [shoppingList, setShoppingList] = useState<ShoppingItem[]>([])

  // Load shopping list from localStorage on initial render
  useEffect(() => {
    const savedList = localStorage.getItem("shoppingList")
    if (savedList) {
      try {
        const parsedList = JSON.parse(savedList)
        // Convert string dates back to Date objects
        const listWithDates = parsedList.map((item: any) => ({
          ...item,
          addedAt: new Date(item.addedAt),
        }))
        setShoppingList(listWithDates)
      } catch (error) {
        console.error("Error parsing shopping list from localStorage:", error)
      }
    }
  }, [])

  // Save shopping list to localStorage whenever it changes
  useEffect(() => {
    localStorage.setItem("shoppingList", JSON.stringify(shoppingList))
  }, [shoppingList])

  const addItem = (name: string, category?: string) => {
    // Check if item already exists (case insensitive)
    const exists = shoppingList.some((item) => item.name.toLowerCase() === name.toLowerCase())
    if (exists) return

    setShoppingList((prev) => [
      ...prev,
      {
        id: `item-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
        name,
        checked: false,
        category,
        addedAt: new Date(),
      },
    ])
  }

  const removeItem = (id: string) => {
    setShoppingList((prev) => prev.filter((item) => item.id !== id))
  }

  const toggleItem = (id: string) => {
    setShoppingList((prev) => prev.map((item) => (item.id === id ? { ...item, checked: !item.checked } : item)))
  }

  const clearList = () => {
    setShoppingList([])
  }

  return (
    <ShoppingListContext.Provider
      value={{
        shoppingList,
        addItem,
        removeItem,
        toggleItem,
        clearList,
      }}
    >
      {children}
    </ShoppingListContext.Provider>
  )
}

export function useShoppingList() {
  const context = useContext(ShoppingListContext)
  if (context === undefined) {
    throw new Error("useShoppingList must be used within a ShoppingListProvider")
  }
  return context
}
