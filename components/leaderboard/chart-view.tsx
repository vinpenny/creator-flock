"use client"

import { useState, useRef, useEffect } from "react"
import Image from "next/image"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { formatNumber } from "@/lib/utils"
import { motion, AnimatePresence } from "framer-motion"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Eye, Heart, Bookmark } from "lucide-react"
import { SaveCollectionPopup } from "./save-collection-popup"

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

interface ChartViewProps {
  posts: Post[]
}

export function ChartView({ posts }: ChartViewProps) {
  const [hoveredPost, setHoveredPost] = useState<Post | null>(null)
  const [selectedPost, setSelectedPost] = useState<Post | null>(null)
  const [savePopupOpen, setSavePopupOpen] = useState(false)
  const [selectedPostId, setSelectedPostId] = useState<string | null>(null)
  const [popupPosition, setPopupPosition] = useState({ x: 0, y: 0 })
  const chartRef = useRef<HTMLDivElement>(null)

  // Calculate chart dimensions and scales
  const chartWidth = 800
  const chartHeight = 600
  const padding = 40
  const maxViralScore = Math.max(...posts.map(p => p.viralScore))
  const maxOutlierScore = Math.max(...posts.map(p => p.outlierScore))
  const maxViews = Math.max(...posts.map(p => p.views))

  // Scale functions
  const scaleX = (outlierScore: number) => {
    return (outlierScore / maxOutlierScore) * (chartWidth - 2 * padding) + padding
  }

  const scaleY = (viralScore: number) => {
    return chartHeight - ((viralScore / maxViralScore) * (chartHeight - 2 * padding) + padding)
  }

  const scaleSize = (views: number) => {
    const minSize = 40
    const maxSize = 80
    return minSize + (views / maxViews) * (maxSize - minSize)
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

  // Function to get badge color based on rank (gradient from red to blue)
  const getBadgeColor = (rank: number) => {
    // Use specific colors to match the provided images
    if (rank === 1) return "#FF3D71" // Hot pink for #1
    if (rank === 2) return "#0095FF" // Blue for #2
    
    // For remaining ranks, continue with the gradient
    const colors = [
      "#FF3D71", // Pink for top ranks
      "#FF5C3A", // Orange-red
      "#FF8700", // Orange
      "#FFBA00", // Yellow
      "#A1E82C", // Lime
      "#00D68F", // Teal
      "#0095FF", // Blue for lower ranks
    ]
    
    // Map rank to color index
    const colorIndex = Math.min(Math.floor((rank - 1) / (20 / colors.length)), colors.length - 1)
    return colors[colorIndex]
  }

  // Get badge size based on rank (larger for higher ranks)
  const getBadgeSize = (rank: number) => {
    if (rank === 1) return { width: 40, height: 24, fontSize: 13 } // Largest badge for #1
    if (rank <= 3) return { width: 36, height: 22, fontSize: 12 } // Slightly larger for top 3
    if (rank <= 10) return { width: 32, height: 20, fontSize: 11 } // Medium for top 10
    return { width: 28, height: 18, fontSize: 10 } // Smallest for others
  }

  return (
    <div className="relative w-full h-[800px] overflow-hidden bg-brand-white dark:bg-gray-900 border-2 border-brand-black">
      {/* Chart background with grid */}
      <div
        ref={chartRef}
        className="absolute inset-0 chart-container"
        onClick={handleChartTap}
      >
        {/* Grid lines */}
        <svg className="absolute inset-0 w-full h-full pointer-events-none">
          <defs>
            <pattern id="grid" width="80" height="80" patternUnits="userSpaceOnUse">
              <path
                d="M 80 0 L 0 0 0 80"
                fill="none"
                stroke="rgba(0,0,0,0.1)"
                strokeWidth="1"
              />
            </pattern>
          </defs>
          <rect width="100%" height="100%" fill="url(#grid)" />
        </svg>

        {/* Axis labels */}
        <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 text-sm font-medium text-brand-black dark:text-brand-white">
          Outlier Score →
        </div>
        <div className="absolute left-4 top-1/2 transform -translate-y-1/2 -rotate-90 text-sm font-medium text-brand-black dark:text-brand-white">
          Viral Score →
        </div>

        {/* Plot points */}
        {posts.map((post) => {
          const x = scaleX(post.outlierScore)
          const y = scaleY(post.viralScore)
          const size = scaleSize(post.views)
          const isSelected = selectedPost?.id === post.id
          const isHovered = hoveredPost?.id === post.id

          return (
            <div
              key={post.id}
              className="absolute transform -translate-x-1/2 -translate-y-1/2 transition-transform duration-200"
              style={{ left: `${x}px`, top: `${y}px` }}
              onMouseEnter={() => setHoveredPost(post)}
              onMouseLeave={() => setHoveredPost(null)}
              onClick={() => setSelectedPost(isSelected ? null : post)}
            >
              <motion.div
                initial={false}
                animate={{
                  scale: isSelected || isHovered ? 1.1 : 1,
                  zIndex: isSelected || isHovered ? 10 : 1,
                }}
              >
                <div
                  className="relative rounded-full border-2 border-brand-black overflow-hidden shadow-chunky cursor-pointer"
                  style={{ width: `${size}px`, height: `${size}px` }}
                >
                  <Image
                    src={post.thumbnail}
                    alt={post.caption}
                    fill
                    className="object-cover"
                  />
                  
                  {/* Rank badge */}
                  <div
                    className="absolute top-0 right-0 transform translate-x-1/4 -translate-y-1/4"
                    style={{
                      zIndex: 2,
                    }}
                  >
                    <div
                      className="flex items-center justify-center text-white font-bold rounded-full border-2 border-brand-black shadow-chunky"
                      style={{
                        backgroundColor: getBadgeColor(post.rank),
                        width: getBadgeSize(post.rank).width,
                        height: getBadgeSize(post.rank).height,
                        fontSize: getBadgeSize(post.rank).fontSize,
                      }}
                    >
                      #{post.rank}
                    </div>
                  </div>
                </div>
              </motion.div>
            </div>
          )
        })}
      </div>

      {/* Selected post details */}
      <AnimatePresence>
        {selectedPost && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 20 }}
            className="absolute bottom-4 left-4 right-4"
          >
            <Card className="border-2 border-brand-black bg-white/95 backdrop-blur">
              <CardContent className="p-4">
                <div className="flex items-start gap-4">
                  <div className="relative w-24 h-24 rounded-lg border-2 border-brand-black overflow-hidden flex-shrink-0">
                    <Image
                      src={selectedPost.thumbnail}
                      alt={selectedPost.caption}
                      fill
                      className="object-cover"
                    />
                  </div>
                  
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-2">
                      <Image
                        src={selectedPost.creator.profilePicture}
                        alt={selectedPost.creator.name}
                        width={24}
                        height={24}
                        className="rounded-full border-2 border-brand-black"
                      />
                      <span className="font-medium text-brand-black">
                        {selectedPost.creator.username}
                      </span>
                    </div>
                    
                    <p className="text-sm text-brand-black mb-2 line-clamp-2">
                      {selectedPost.caption}
                    </p>
                    
                    <div className="flex items-center gap-4 text-sm">
                      <div className="flex items-center gap-1">
                        <Eye className="h-4 w-4 text-brand-gray" />
                        <span className="font-medium text-brand-black">
                          {formatNumber(selectedPost.views)}
                        </span>
                      </div>
                      <div className="flex items-center gap-1">
                        <Heart className="h-4 w-4 text-brand-gray" />
                        <span className="font-medium text-brand-black">
                          {formatNumber(selectedPost.likes)}
                        </span>
                      </div>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="ml-auto hover:bg-brand-light-gray"
                        onClick={(e) => handleSaveClick(selectedPost.id, e)}
                      >
                        <Bookmark className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Save collection popup */}
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