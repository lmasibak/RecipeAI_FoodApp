"use client"

import { createContext, useContext, useState, type ReactNode } from "react"

interface DietaryPreferences {
  vegetarian: boolean
  vegan: boolean
  glutenFree: boolean
  dairyFree: boolean
  keto: boolean
  paleo: boolean
  lowCarb: boolean
  lowFat: boolean
}

interface UserProfile {
  dietaryPreferences: DietaryPreferences
  calorieGoal: number
  allergies: string[]
}

interface UserProfileContextType {
  profile: UserProfile
  updateDietaryPreferences: (preferences: DietaryPreferences) => void
  updateCalorieGoal: (goal: number) => void
  updateAllergies: (allergies: string[]) => void
}

const UserProfileContext = createContext<UserProfileContextType | undefined>(undefined)

export function UserProfileProvider({ children }: { children: ReactNode }) {
  const [profile, setProfile] = useState<UserProfile>({
    dietaryPreferences: {
      vegetarian: false,
      vegan: false,
      glutenFree: false,
      dairyFree: false,
      keto: false,
      paleo: false,
      lowCarb: false,
      lowFat: false,
    },
    calorieGoal: 2000,
    allergies: [],
  })

  const updateDietaryPreferences = (preferences: DietaryPreferences) => {
    setProfile((prev) => ({
      ...prev,
      dietaryPreferences: preferences,
    }))
  }

  const updateCalorieGoal = (goal: number) => {
    setProfile((prev) => ({
      ...prev,
      calorieGoal: goal,
    }))
  }

  const updateAllergies = (allergies: string[]) => {
    setProfile((prev) => ({
      ...prev,
      allergies,
    }))
  }

  return (
    <UserProfileContext.Provider
      value={{
        profile,
        updateDietaryPreferences,
        updateCalorieGoal,
        updateAllergies,
      }}
    >
      {children}
    </UserProfileContext.Provider>
  )
}

export function useUserProfile() {
  const context = useContext(UserProfileContext)
  if (context === undefined) {
    throw new Error("useUserProfile must be used within a UserProfileProvider")
  }
  return context
}
