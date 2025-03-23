"use client"

import { useState } from "react"
import Image from "next/image"
import Link from "next/link"
import { Heart, MessageCircle, Share2, Bookmark } from "lucide-react"
import { Card, CardContent, CardFooter } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { formatNumber } from "@/lib/utils"
import { SaveCollectionPopup } from "./save-collection-popup"
import { AnimatePresence } from "framer-motion"

interface Post {
  id: string
  rank: number
  creator: {
    id: string
    name: string
    username: string
    profilePicture: string
  }
  thumbnail: string
  views: number
  likes: number
  comments: number
  shares: number
  viralScore: number
  outlierScore: number
  engagementRate: string
  caption: string
  createdAt: string
}

interface GridViewProps {
  posts: Post[]
  onSort?: (sortType: string) => void
}

// Function to get viral score color based on the score value
const getViralScoreColor = (score: number): string => {
  if (score <= 5) return 'bg-red-700' // Dark Red
  if (score <= 10) return 'bg-orange-800' // Dark Orange
  if (score <= 15) return 'bg-orange-500' // Light Orange
  
  // Green to yellow gradient for scores above 15
  if (score <= 25) return 'bg-green-600'
  if (score <= 40) return 'bg-green-500'
  if (score <= 60) return 'bg-lime-500'
  if (score <= 80) return 'bg-yellow-500'
  return 'bg-yellow-400'
}

export function GridView({ posts, onSort }: GridViewProps) {
  const [sortType, setSortType] = useState<string>("mostRelevant")
  const [savePopupOpen, setSavePopupOpen] = useState(false)
  const [selectedPostId, setSelectedPostId] = useState<string | null>(null)
  const [popupPosition, setPopupPosition] = useState({ x: 0, y: 0 })

  // Handle sort change
  const handleSortChange = (value: string) => {
    setSortType(value)
    if (onSort) {
      onSort(value)
    }
  }

  // Handle opening the save popup
  const handleSaveClick = (postId: string, e: React.MouseEvent) => {
    const rect = e.currentTarget.getBoundingClientRect()
    setPopupPosition({
      x: rect.left + rect.width / 2,
      y: rect.bottom + window.scrollY
    })
    
    setSelectedPostId(postId)
    setSavePopupOpen(true)
    
    e.stopPropagation()
    e.preventDefault()
  }

  // Handle closing the save popup
  const handleClosePopup = () => {
    setSavePopupOpen(false)
    setSelectedPostId(null)
  }

  return (
    <div className="space-y-4 relative">
      <div className="flex justify-between items-center px-4 py-2">
        <Select onValueChange={handleSortChange} defaultValue={sortType} id="grid-sorting-dropdown">
          <SelectTrigger className="w-[180px] border-2 border-brand-black bg-brand-white">
            <SelectValue placeholder="Sort by" />
          </SelectTrigger>
          <SelectContent className="border-2 border-brand-black">
            <SelectItem value="mostRelevant">Most Relevant</SelectItem>
            <SelectItem value="mostViral">Most Viral</SelectItem>
            <SelectItem value="mostViews">Most Views</SelectItem>
            <SelectItem value="latest">Latest</SelectItem>
          </SelectContent>
        </Select>
      </div>
      
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4 p-4">
        {posts.map((post) => (
          <Card key={post.id} className="brutalist-card group overflow-hidden bg-brand-white dark:bg-gray-800 relative">
            <Link href={`/post/${post.id}`} className="block relative">
              <div className="relative aspect-[9/16] overflow-hidden">
                <Image
                  src={post.thumbnail}
                  alt={post.caption.substring(0, 20)}
                  fill
                  className="object-cover transition-transform duration-300 group-hover:scale-105"
                />
                
                {/* Viral Score Badge */}
                <div className="absolute top-2 left-2">
                  <Badge
                    className={`${getViralScoreColor(post.viralScore)} text-white border-2 border-brand-black rounded-full w-10 h-10 flex items-center justify-center`}
                  >
                    {post.viralScore}
                  </Badge>
                </div>
                
                {/* Save Button */}
                <Button
                  variant="ghost"
                  size="icon"
                  className="absolute top-2 right-2 bg-white/80 hover:bg-white border-2 border-brand-black rounded-full w-10 h-10"
                  onClick={(e) => handleSaveClick(post.id, e)}
                >
                  <Bookmark className="h-5 w-5" />
                </Button>
                
                <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-brand-black/80 to-transparent p-3">
                  <div className="flex items-center gap-2">
                    <Image
                      src={post.creator.profilePicture}
                      alt={post.creator.name}
                      width={24}
                      height={24}
                      className="creator-avatar creator-avatar-sm"
                    />
                    <span className="text-brand-white text-sm font-medium truncate">
                      {post.creator.username}
                    </span>
                  </div>
                </div>
              </div>
            </Link>
            <CardContent className="p-3">
              <p className="text-sm line-clamp-2 h-10 font-medium text-brand-black dark:text-brand-white">
                {post.caption}
              </p>
            </CardContent>
            <CardFooter className="p-3 pt-0 flex justify-between items-center">
              <div className="flex items-center gap-3 text-sm">
                <div className="flex items-center gap-1">
                  <Heart className="h-4 w-4 text-brand-gray" />
                  <span className="font-medium text-brand-black dark:text-brand-white">
                    {formatNumber(post.likes)}
                  </span>
                </div>
                <div className="flex items-center gap-1">
                  <MessageCircle className="h-4 w-4 text-brand-gray" />
                  <span className="font-medium text-brand-black dark:text-brand-white">
                    {formatNumber(post.comments)}
                  </span>
                </div>
                <div className="flex items-center gap-1">
                  <Share2 className="h-4 w-4 text-brand-gray" />
                  <span className="font-medium text-brand-black dark:text-brand-white">
                    {formatNumber(post.shares)}
                  </span>
                </div>
              </div>
            </CardFooter>
          </Card>
        ))}
      </div>

      <AnimatePresence>
        {savePopupOpen && selectedPostId && (
          <SaveCollectionPopup
            postId={selectedPostId}
            position={popupPosition}
            onClose={handleClosePopup}
          />
        )}
      </AnimatePresence>
    </div>
  )
}