import type React from "react"
import "./globals.css"
import { Inter } from "next/font/google"
import { ThemeProvider } from "@/components/theme-provider"
import { UserProfileProvider } from "@/lib/user-profile"
import { ShoppingListProvider } from "@/lib/shopping-list"
import Navigation from "@/components/Navigation"

const inter = Inter({ subsets: ["latin"] })

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <ThemeProvider attribute="class" defaultTheme="light" enableSystem disableTransitionOnChange>
          <UserProfileProvider>
            <ShoppingListProvider>
              <div className="flex flex-col min-h-screen">
                <div className="flex-1">{children}</div>
                <Navigation />
              </div>
            </ShoppingListProvider>
          </UserProfileProvider>
        </ThemeProvider>
      </body>
    </html>
  )
}


import './globals.css'

export const metadata = {
      generator: 'v0.dev'
    };
