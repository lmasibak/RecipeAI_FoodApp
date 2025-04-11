"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import Image from "next/image"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { ChevronLeft, Heart, MessageCircle, Share2, Camera, Filter, TrendingUp } from "lucide-react"
import { blogPosts } from "@/lib/blog-data"

export default function BlogPage() {
  const router = useRouter()
  const [activeTab, setActiveTab] = useState("all")
  const [likedPosts, setLikedPosts] = useState<string[]>([])

  const toggleLike = (postId: string) => {
    if (likedPosts.includes(postId)) {
      setLikedPosts(likedPosts.filter((id) => id !== postId))
    } else {
      setLikedPosts([...likedPosts, postId])
    }
  }

  const filteredPosts =
    activeTab === "all"
      ? blogPosts
      : activeTab === "trending"
        ? blogPosts.filter((post) => post.trending)
        : blogPosts.filter((post) => post.category === activeTab)

  return (
    <div className="container px-4 py-8 pb-20">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center">
          <Button variant="ghost" onClick={() => router.back()} className="mr-2">
            <ChevronLeft className="h-5 w-5" />
          </Button>
          <h1 className="text-2xl font-bold">Before & After</h1>
        </div>
        <Button onClick={() => router.push("/blog/create")} className="bg-teal-600 hover:bg-teal-700">
          <Camera className="h-4 w-4 mr-2" />
          Share Your Creation
        </Button>
      </div>

      <Tabs defaultValue="all" value={activeTab} onValueChange={setActiveTab} className="w-full mb-6">
        <div className="flex justify-between items-center mb-4">
          <TabsList className="bg-teal-50">
            <TabsTrigger value="all" className="data-[state=active]:bg-teal-600 data-[state=active]:text-white">
              All Posts
            </TabsTrigger>
            <TabsTrigger value="trending" className="data-[state=active]:bg-teal-600 data-[state=active]:text-white">
              <TrendingUp className="h-4 w-4 mr-1" />
              Trending
            </TabsTrigger>
            <TabsTrigger value="desserts" className="data-[state=active]:bg-teal-600 data-[state=active]:text-white">
              Desserts
            </TabsTrigger>
            <TabsTrigger value="mains" className="data-[state=active]:bg-teal-600 data-[state=active]:text-white">
              Main Dishes
            </TabsTrigger>
          </TabsList>
          <Button variant="outline" size="sm">
            <Filter className="h-4 w-4 mr-2" />
            Filter
          </Button>
        </div>

        <TabsContent value="all" className="mt-0">
          <div className="space-y-6">
            {filteredPosts.map((post) => (
              <Card key={post.id} className="overflow-hidden">
                <CardHeader className="p-4 pb-0">
                  <div className="flex items-center">
                    <Avatar className="h-10 w-10 mr-3">
                      <AvatarImage src={post.userAvatar} />
                      <AvatarFallback>{post.userName.charAt(0)}</AvatarFallback>
                    </Avatar>
                    <div>
                      <div className="font-medium">{post.userName}</div>
                      <div className="text-xs text-gray-500">{post.timeAgo}</div>
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="p-4">
                  <h3 className="font-semibold text-lg mb-2">{post.title}</h3>
                  <p className="text-gray-600 mb-4">{post.content}</p>

                  <div className="grid grid-cols-2 gap-2 mb-4">
                    <div className="relative h-48 rounded-md overflow-hidden">
                      <Badge className="absolute top-2 left-2 z-10 bg-white/90 text-gray-800">Before</Badge>
                      <Image src={post.beforeImage || "/placeholder.svg"} alt="Before" fill className="object-cover" />
                    </div>
                    <div className="relative h-48 rounded-md overflow-hidden">
                      <Badge className="absolute top-2 left-2 z-10 bg-teal-600 text-white">After</Badge>
                      <Image src={post.afterImage || "/placeholder.svg"} alt="After" fill className="object-cover" />
                    </div>
                  </div>

                  <div className="flex flex-wrap gap-2 mb-2">
                    {post.tags.map((tag, index) => (
                      <Badge key={index} variant="outline" className="bg-gray-50">
                        #{tag}
                      </Badge>
                    ))}
                  </div>

                  {post.recipeLink && (
                    <Button
                      variant="link"
                      className="p-0 h-auto text-teal-600"
                      onClick={() => router.push(post.recipeLink)}
                    >
                      View Recipe
                    </Button>
                  )}
                </CardContent>
                <CardFooter className="p-0 border-t">
                  <div className="flex w-full">
                    <Button variant="ghost" className="flex-1 rounded-none" onClick={() => toggleLike(post.id)}>
                      <Heart
                        className={`h-5 w-5 mr-2 ${likedPosts.includes(post.id) ? "fill-red-500 text-red-500" : ""}`}
                      />
                      {post.likes + (likedPosts.includes(post.id) ? 1 : 0)}
                    </Button>
                    <Button variant="ghost" className="flex-1 rounded-none">
                      <MessageCircle className="h-5 w-5 mr-2" />
                      {post.comments}
                    </Button>
                    <Button variant="ghost" className="flex-1 rounded-none">
                      <Share2 className="h-5 w-5 mr-2" />
                      Share
                    </Button>
                  </div>
                </CardFooter>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="trending" className="mt-0">
          {/* Content is filtered by the filteredPosts variable */}
        </TabsContent>

        <TabsContent value="desserts" className="mt-0">
          {/* Content is filtered by the filteredPosts variable */}
        </TabsContent>

        <TabsContent value="mains" className="mt-0">
          {/* Content is filtered by the filteredPosts variable */}
        </TabsContent>
      </Tabs>
    </div>
  )
}
