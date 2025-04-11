"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import Image from "next/image"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { ChevronLeft, Heart, MessageCircle, MoreHorizontal, Share2, Users } from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { socialPosts } from "@/lib/social-data"

export default function SocialPage() {
  const router = useRouter()
  const [activeTab, setActiveTab] = useState("feed")
  const [likedPosts, setLikedPosts] = useState<string[]>([])

  const toggleLike = (postId: string) => {
    if (likedPosts.includes(postId)) {
      setLikedPosts(likedPosts.filter((id) => id !== postId))
    } else {
      setLikedPosts([...likedPosts, postId])
    }
  }

  return (
    <div className="container px-4 py-8">
      <div className="flex items-center mb-6">
        <Button variant="ghost" onClick={() => router.back()} className="mr-2">
          <ChevronLeft className="h-5 w-5" />
        </Button>
        <h1 className="text-2xl font-bold">Social</h1>
      </div>

      <Tabs defaultValue="feed" value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid grid-cols-3 mb-8">
          <TabsTrigger value="feed" className="data-[state=active]:bg-teal-600 data-[state=active]:text-white">
            Feed
          </TabsTrigger>
          <TabsTrigger value="discover" className="data-[state=active]:bg-teal-600 data-[state=active]:text-white">
            Discover
          </TabsTrigger>
          <TabsTrigger value="friends" className="data-[state=active]:bg-teal-600 data-[state=active]:text-white">
            Friends
          </TabsTrigger>
        </TabsList>

        <TabsContent value="feed">
          <div className="max-w-xl mx-auto">
            <Card className="mb-6">
              <CardHeader className="pb-3">
                <div className="flex items-center">
                  <Avatar className="h-10 w-10 mr-3">
                    <AvatarImage src="/placeholder.svg?height=40&width=40" />
                    <AvatarFallback>AJ</AvatarFallback>
                  </Avatar>
                  <Input placeholder="Share a recipe or cooking tip..." className="bg-gray-50" />
                </div>
              </CardHeader>
              <CardFooter className="pt-0 flex justify-between">
                <Button variant="outline" size="sm">
                  Add Photo
                </Button>
                <Button size="sm" className="bg-teal-600 hover:bg-teal-700">
                  Post
                </Button>
              </CardFooter>
            </Card>

            {socialPosts.map((post) => (
              <Card key={post.id} className="mb-6">
                <CardHeader className="pb-3">
                  <div className="flex justify-between items-start">
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
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="icon">
                          <MoreHorizontal className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem>Save Post</DropdownMenuItem>
                        <DropdownMenuItem>Hide Post</DropdownMenuItem>
                        <DropdownMenuItem>Report</DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </div>
                </CardHeader>
                <CardContent className="pb-3">
                  <p className="mb-4">{post.content}</p>
                  {post.recipeInfo && (
                    <div className="bg-gray-50 p-3 rounded-md mb-4">
                      <div className="flex items-center mb-2">
                        <Badge className="bg-teal-100 text-teal-800 mr-2">{post.recipeInfo.category}</Badge>
                        <span className="text-sm text-gray-500">{post.recipeInfo.prepTime} min</span>
                      </div>
                      <h3 className="font-medium mb-1">{post.recipeInfo.title}</h3>
                      <p className="text-sm text-gray-600 mb-2">{post.recipeInfo.description}</p>
                      <Button
                        variant="link"
                        className="text-teal-600 p-0 h-auto"
                        onClick={() => router.push(`/recipe/${post.recipeInfo.id}`)}
                      >
                        View Recipe
                      </Button>
                    </div>
                  )}
                  {post.image && (
                    <div className="relative h-64 rounded-md overflow-hidden mb-4">
                      <Image src={post.image || "/placeholder.svg"} alt="Post image" fill className="object-cover" />
                    </div>
                  )}
                  <div className="flex items-center text-sm text-gray-500">
                    <span className="mr-4">{likedPosts.includes(post.id) ? post.likes + 1 : post.likes} likes</span>
                    <span>{post.comments} comments</span>
                  </div>
                </CardContent>
                <CardFooter className="pt-0">
                  <div className="flex w-full border-t pt-3">
                    <Button variant="ghost" className="flex-1" onClick={() => toggleLike(post.id)}>
                      <Heart
                        className={`h-5 w-5 mr-2 ${likedPosts.includes(post.id) ? "fill-red-500 text-red-500" : ""}`}
                      />
                      Like
                    </Button>
                    <Button variant="ghost" className="flex-1">
                      <MessageCircle className="h-5 w-5 mr-2" />
                      Comment
                    </Button>
                    <Button variant="ghost" className="flex-1">
                      <Share2 className="h-5 w-5 mr-2" />
                      Share
                    </Button>
                  </div>
                </CardFooter>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="discover">
          <div className="mb-6">
            <h2 className="text-xl font-bold mb-4">Popular Chefs to Follow</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
              {[
                { name: "Jamie Oliver", followers: "5.2M", avatar: "/placeholder.svg?height=60&width=60" },
                { name: "Gordon Ramsay", followers: "4.8M", avatar: "/placeholder.svg?height=60&width=60" },
                { name: "Nigella Lawson", followers: "3.1M", avatar: "/placeholder.svg?height=60&width=60" },
                { name: "Ina Garten", followers: "2.7M", avatar: "/placeholder.svg?height=60&width=60" },
              ].map((chef, index) => (
                <Card key={index}>
                  <CardContent className="p-4 flex items-center">
                    <Avatar className="h-12 w-12 mr-3">
                      <AvatarImage src={chef.avatar} />
                      <AvatarFallback>{chef.name.charAt(0)}</AvatarFallback>
                    </Avatar>
                    <div className="flex-1">
                      <div className="font-medium">{chef.name}</div>
                      <div className="text-xs text-gray-500">{chef.followers} followers</div>
                    </div>
                    <Button size="sm" className="bg-teal-600 hover:bg-teal-700">
                      Follow
                    </Button>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>

          <div>
            <h2 className="text-xl font-bold mb-4">Trending Hashtags</h2>
            <div className="flex flex-wrap gap-2">
              {[
                "#HealthyEating",
                "#QuickMeals",
                "#VeganRecipes",
                "#BakingLove",
                "#ComfortFood",
                "#MealPrep",
                "#FoodPhotography",
                "#HomeCooking",
                "#DinnerIdeas",
                "#FoodInspiration",
                "#SeasonalRecipes",
                "#BreakfastIdeas",
              ].map((tag, index) => (
                <Badge key={index} variant="outline" className="text-sm py-1 px-3">
                  {tag}
                </Badge>
              ))}
            </div>
          </div>
        </TabsContent>

        <TabsContent value="friends">
          <div className="mb-6">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-bold">Friends</h2>
              <Button variant="outline" size="sm">
                <Users className="h-4 w-4 mr-2" />
                Find Friends
              </Button>
            </div>
            <div className="space-y-4">
              {[
                {
                  name: "Sarah Miller",
                  status: "Just posted a new recipe",
                  avatar: "/placeholder.svg?height=40&width=40",
                },
                {
                  name: "Michael Chen",
                  status: "Trying your pasta recipe tonight!",
                  avatar: "/placeholder.svg?height=40&width=40",
                },
                {
                  name: "Emily Johnson",
                  status: "Shared 3 recipes this week",
                  avatar: "/placeholder.svg?height=40&width=40",
                },
                { name: "David Wilson", status: "Liked your comment", avatar: "/placeholder.svg?height=40&width=40" },
              ].map((friend, index) => (
                <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                  <div className="flex items-center">
                    <Avatar className="h-10 w-10 mr-3">
                      <AvatarImage src={friend.avatar} />
                      <AvatarFallback>{friend.name.charAt(0)}</AvatarFallback>
                    </Avatar>
                    <div>
                      <div className="font-medium">{friend.name}</div>
                      <div className="text-xs text-gray-500">{friend.status}</div>
                    </div>
                  </div>
                  <Button variant="ghost" size="sm">
                    Message
                  </Button>
                </div>
              ))}
            </div>
          </div>

          <div>
            <h2 className="text-xl font-bold mb-4">Friend Suggestions</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
              {[
                { name: "Alex Thompson", mutualFriends: 5, avatar: "/placeholder.svg?height=40&width=40" },
                { name: "Jessica Lee", mutualFriends: 3, avatar: "/placeholder.svg?height=40&width=40" },
                { name: "Ryan Martinez", mutualFriends: 2, avatar: "/placeholder.svg?height=40&width=40" },
                { name: "Olivia Parker", mutualFriends: 7, avatar: "/placeholder.svg?height=40&width=40" },
                { name: "Daniel Kim", mutualFriends: 4, avatar: "/placeholder.svg?height=40&width=40" },
                { name: "Sophia Garcia", mutualFriends: 1, avatar: "/placeholder.svg?height=40&width=40" },
              ].map((suggestion, index) => (
                <Card key={index}>
                  <CardContent className="p-4">
                    <div className="flex items-center mb-3">
                      <Avatar className="h-10 w-10 mr-3">
                        <AvatarImage src={suggestion.avatar} />
                        <AvatarFallback>{suggestion.name.charAt(0)}</AvatarFallback>
                      </Avatar>
                      <div className="font-medium">{suggestion.name}</div>
                    </div>
                    <p className="text-xs text-gray-500 mb-3">{suggestion.mutualFriends} mutual friends</p>
                    <Button size="sm" className="w-full bg-teal-600 hover:bg-teal-700">
                      Add Friend
                    </Button>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  )
}
