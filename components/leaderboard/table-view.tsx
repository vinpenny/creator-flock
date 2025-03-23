"use client"

import { useState } from "react"
import Image from "next/image"
import Link from "next/link"
import { Eye, Heart, MessageCircle, Bookmark, ExternalLink, ChevronUp, ChevronDown } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { formatNumber, formatDate } from "@/lib/utils"
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

interface TableViewProps {
  posts: Post[]
  onSort?: (sortField: string, direction: 'asc' | 'desc') => void
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

export function TableView({ posts, onSort }: TableViewProps) {
  const [sortConfig, setSortConfig] = useState<{
    key: string
    direction: 'asc' | 'desc'
  } | null>(null)
  
  const [savePopupOpen, setSavePopupOpen] = useState(false)
  const [selectedPostId, setSelectedPostId] = useState<string | null>(null)
  const [popupPosition, setPopupPosition] = useState({ x: 0, y: 0 })

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

  // Handle column header click for sorting
  const handleSort = (key: string) => {
    let direction: 'asc' | 'desc' = 'asc'
    
    if (sortConfig && sortConfig.key === key) {
      direction = sortConfig.direction === 'asc' ? 'desc' : 'asc'
    }
    
    setSortConfig({ key, direction })
    
    // Call parent sort handler if provided
    if (onSort) {
      onSort(key, direction)
    }
  }

  // Get sort indicator for a column
  const getSortIndicator = (key: string) => {
    if (!sortConfig || sortConfig.key !== key) {
      return (
        <div className="ml-1 opacity-30">
          <ChevronUp className="h-3 w-3" />
        </div>
      )
    }
    
    return sortConfig.direction === 'asc' ? (
      <ChevronUp className="ml-1 h-3 w-3" />
    ) : (
      <ChevronDown className="ml-1 h-3 w-3" />
    )
  }

  return (
    <div className="overflow-hidden border-0 relative">
      <Table>
        <TableHeader>
          <TableRow className="border-b-2 border-brand-black bg-brand-light-gray">
            <TableHead className="w-14 font-bold text-brand-black">
              <div className="flex items-center cursor-pointer" onClick={() => handleSort('viralScore')} id="sort-viral-score-header">
                Viral
                {getSortIndicator('viralScore')}
              </div>
            </TableHead>
            <TableHead className="w-14 font-bold text-brand-black">
              <div className="flex items-center cursor-pointer" onClick={() => handleSort('outlierScore')} id="outlier-score-header">
                Outlier
                {getSortIndicator('outlierScore')}
              </div>
            </TableHead>
            <TableHead className="font-bold text-brand-black">Post</TableHead>
            <TableHead className="hidden md:table-cell font-bold text-brand-black">Creator</TableHead>
            <TableHead className="text-right font-bold text-brand-black">
              <div className="flex items-center justify-end cursor-pointer" onClick={() => handleSort('views')}>
                <span id="sort-views-header">Views</span>
                {getSortIndicator('views')}
              </div>
            </TableHead>
            <TableHead className="text-right hidden sm:table-cell font-bold text-brand-black">
              <div className="flex items-center justify-end cursor-pointer" onClick={() => handleSort('engagement')}>
                <span id="sort-engagement-header">Engagement</span>
                {getSortIndicator('engagement')}
              </div>
            </TableHead>
            <TableHead className="text-right hidden lg:table-cell font-bold text-brand-black">
              <div className="flex items-center justify-end cursor-pointer" onClick={() => handleSort('date')}>
                <span id="sort-date-header">Date</span>
                {getSortIndicator('date')}
              </div>
            </TableHead>
            <TableHead className="w-12"></TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {posts.map((post) => (
            <TableRow key={post.id} className="border-b-2 border-brand-black hover:bg-brand-light-gray/30">
              <TableCell className="font-bold">
                <Badge
                  id={`viral-score-bubble-${post.id}`}
                  className={`${getViralScoreColor(post.viralScore)} text-white border-2 border-brand-black rounded-full w-10 h-10 flex items-center justify-center`}
                >
                  {post.viralScore}
                </Badge>
              </TableCell>
              <TableCell className="font-bold">
                <Badge
                  id={`outlier-score-bubble-${post.id}`}
                  className="bg-brand-blue text-white border-2 border-brand-black rounded-full w-10 h-10 flex items-center justify-center"
                >
                  {post.outlierScore}
                </Badge>
              </TableCell>
              <TableCell>
                <Link href={`/post/${post.id}`} className="flex items-center gap-3">
                  <div className="relative w-12 h-12 overflow-hidden border-2 border-brand-black flex-shrink-0">
                    <Image
                      src={post.thumbnail}
                      alt={post.caption.substring(0, 20)}
                      fill
                      className="object-cover"
                    />
                  </div>
                  <span className="line-clamp-1 text-sm font-medium text-brand-black">{post.caption}</span>
                </Link>
              </TableCell>
              <TableCell className="hidden md:table-cell">
                <Link href={`/creator/${post.creator.id}`} className="flex items-center gap-2">
                  <Image
                    src={post.creator.profilePicture}
                    alt={post.creator.name}
                    width={24}
                    height={24}
                    className="creator-avatar creator-avatar-sm"
                  />
                  <span className="text-sm font-medium text-brand-black">{post.creator.username}</span>
                </Link>
              </TableCell>
              <TableCell className="text-right">
                <div className="flex items-center justify-end gap-1">
                  <Eye className="h-3 w-3 text-brand-black" />
                  <span className="font-bold text-brand-black">{formatNumber(post.views)}</span>
                </div>
              </TableCell>
              <TableCell className="text-right hidden sm:table-cell">
                <div className="flex flex-col items-end text-xs">
                  <div className="flex items-center gap-1">
                    <Heart className="h-3 w-3 text-brand-black" />
                    <span className="font-bold text-brand-black">{formatNumber(post.likes)}</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <MessageCircle className="h-3 w-3 text-brand-black" />
                    <span className="font-bold text-brand-black">{formatNumber(post.comments)}</span>
                  </div>
                </div>
              </TableCell>
              <TableCell className="text-right hidden lg:table-cell text-brand-black text-sm">
                {formatDate(post.createdAt)}
              </TableCell>
              <TableCell>
                <Button
                  variant="ghost"
                  size="icon"
                  className="hover:bg-brand-light-gray"
                  onClick={(e) => handleSaveClick(post.id, e)}
                >
                  <Bookmark className="h-4 w-4" />
                </Button>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>

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