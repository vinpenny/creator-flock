"use client"

import { useState, useEffect } from "react"
import { ChartView } from "../leaderboard/chart-view"
import { GridView } from "../leaderboard/grid-view"
import { TableView } from "../leaderboard/table-view"
import { motion, AnimatePresence } from "framer-motion"
import { BarChart2, Table, LayoutGrid } from "lucide-react"
import { useSearchParams } from "next/navigation"

export type LeaderboardView = "chart" | "grid" | "table"

interface FilteredLeaderboardProps {
  view: LeaderboardView
  onViewChange?: (view: LeaderboardView) => void
}

export function FilteredLeaderboard({ view: initialView, onViewChange }: FilteredLeaderboardProps) {
  // Use local state to manage view switching
  const [view, setView] = useState<LeaderboardView>(initialView)
  
  // State for sorting configuration
  const [sortField, setSortField] = useState<string>('viralScore')
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('desc')
  const [gridSortType, setGridSortType] = useState<string>("mostViral")
  
  const searchParams = useSearchParams()
  const boardId = searchParams?.get('id') || 'placeholder-id'
  
  // Update local view state when prop changes (for external control)
  useEffect(() => {
    setView(initialView)
  }, [initialView])

  // Handle view changes and propagate to parent if needed
  const handleViewChange = (newView: LeaderboardView) => {
    setView(newView)
    onViewChange?.(newView)
  }

  // Handle sorting from table view
  const handleTableSort = (field: string, direction: 'asc' | 'desc') => {
    setSortField(field)
    setSortDirection(direction)
    
    // Update grid sorting type based on table sort field
    switch (field) {
      case 'viralScore':
        setGridSortType('mostViral')
        break
      case 'views':
        setGridSortType('mostViews')
        break
      case 'date':
        setGridSortType('latest')
        break
      default:
        setGridSortType('mostRelevant')
    }
  }
  
  // Handle sorting from grid view
  const handleGridSort = (sortType: string) => {
    setGridSortType(sortType)
    
    // Update table sort field and direction based on grid sort type
    switch (sortType) {
      case 'mostViral':
        setSortField('viralScore')
        setSortDirection('desc')
        break
      case 'mostViews':
        setSortField('views')
        setSortDirection('desc')
        break
      case 'latest':
        setSortField('date')
        setSortDirection('desc')
        break
      default:
        setSortField('viralScore')
        setSortDirection('desc')
    }
  }

  // Creator profile images from Unsplash
  const creatorProfiles = [
    {
      id: "creator-1",
      name: "Alex Johnson",
      username: "@alexjohnson",
      profilePicture: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150&h=150&fit=crop&crop=faces",
    },
    {
      id: "creator-2",
      name: "Maria Garcia",
      username: "@mariagarcia",
      profilePicture: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=150&h=150&fit=crop&crop=faces",
    },
    {
      id: "creator-3",
      name: "James Smith",
      username: "@jamessmith",
      profilePicture: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop&crop=faces",
    },
  ]

  // Array of high-quality vertical Unsplash image IDs
  const unsplashVerticalImageIds = [
    "photo-1552642986-ccb41e7059e7", // fashion/person vertical
    "photo-1604681630513-69474a4e253f", // person vertical
    "photo-1618142779979-d7e671a89054", // fashion vertical
  ]

  // Mock data for boards demonstration - only showing 3 posts
  // In a real implementation, this would filter posts based on the boardId
  const mockPosts = Array.from({ length: 3 }, (_, i) => {
    const creatorIndex = i % creatorProfiles.length
    const creator = creatorProfiles[creatorIndex]
    
    // Select a vertical image from our curated list
    const imageIndex = i % unsplashVerticalImageIds.length
    const imageId = unsplashVerticalImageIds[imageIndex]

    return {
      id: `post-${i + 1}`,
      rank: i + 1,
      creator: creator,
      thumbnail: `https://images.unsplash.com/${imageId}?w=400&h=700&fit=crop`,
      views: Math.floor(Math.random() * 1000000) + 10000,
      likes: Math.floor(Math.random() * 100000) + 1000,
      comments: Math.floor(Math.random() * 10000) + 100,
      shares: Math.floor(Math.random() * 5000) + 50,
      viralScore: Math.floor(Math.random() * 100) + 1,
      outlierScore: Math.floor(Math.random() * 100) + 1,
      engagementRate: (Math.random() * 10 + 1).toFixed(2),
      caption: `This is a saved post in board ${boardId} #tiktok ${i + 1}`,
      createdAt: new Date(Date.now() - Math.floor(Math.random() * 7 * 24 * 60 * 60 * 1000)).toISOString(),
      boardId: boardId
    }
  })

  // Apply sorting to posts
  const getSortedPosts = () => {
    const postsCopy = [...mockPosts];
    
    if (sortField === 'viralScore') {
      return postsCopy.sort((a, b) => sortDirection === 'asc' ? a.viralScore - b.viralScore : b.viralScore - a.viralScore);
    } else if (sortField === 'outlierScore') {
      return postsCopy.sort((a, b) => sortDirection === 'asc' ? a.outlierScore - b.outlierScore : b.outlierScore - a.outlierScore);
    } else if (sortField === 'views') {
      return postsCopy.sort((a, b) => sortDirection === 'asc' ? a.views - b.views : b.views - a.views);
    } else if (sortField === 'engagement') {
      return postsCopy.sort((a, b) => sortDirection === 'asc' ? 
        parseFloat(a.engagementRate) - parseFloat(b.engagementRate) : 
        parseFloat(b.engagementRate) - parseFloat(a.engagementRate));
    } else if (sortField === 'date') {
      return postsCopy.sort((a, b) => sortDirection === 'asc' ? 
        new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime() : 
        new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
    }
    
    // Default sort - by rank
    return postsCopy.sort((a, b) => a.rank - b.rank);
  };

  const sortedPosts = getSortedPosts();

  // Get the two non-current views for the switcher
  const getAlternativeViews = (): [LeaderboardView, LeaderboardView] => {
    switch (view) {
      case "chart":
        return ["grid", "table"]
      case "grid":
        return ["chart", "table"]
      case "table":
        return ["chart", "grid"]
    }
  }

  // Get icon component for each view
  const getViewIcon = (viewType: LeaderboardView) => {
    switch (viewType) {
      case "chart":
        return <BarChart2 className="h-4 w-4" />
      case "grid":
        return <LayoutGrid className="h-4 w-4" />
      case "table":
        return <Table className="h-4 w-4" />
    }
  }

  // Get display name for each view
  const getViewName = (viewType: LeaderboardView) => {
    return viewType.charAt(0).toUpperCase() + viewType.slice(1)
  }

  // The two alternative views for the switcher
  const [leftView, rightView] = getAlternativeViews()

  return (
    <div className="space-y-4 relative">
      <AnimatePresence mode="wait">
        {view === "chart" && (
          <motion.div
            key="chart-view"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
          >
            <ChartView posts={sortedPosts} />
          </motion.div>
        )}
        {view === "grid" && (
          <motion.div
            key="grid-view"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
          >
            <GridView 
              posts={sortedPosts} 
              onSort={handleGridSort}
            />
          </motion.div>
        )}
        {view === "table" && (
          <motion.div
            key="table-view"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
          >
            <TableView 
              posts={sortedPosts} 
              onSort={handleTableSort}
            />
          </motion.div>
        )}
      </AnimatePresence>

      {/* Floating pill button switcher */}
      <div className="fixed bottom-20 md:bottom-6 left-1/2 transform -translate-x-1/2 z-50">
        <motion.div 
          className="flex rounded-full border-2 border-black shadow-chunky overflow-hidden bg-white"
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.5, duration: 0.3 }}
        >
          <button
            className="flex items-center gap-1 py-2 px-4 text-sm font-medium hover:bg-brand-light-gray transition-colors"
            onClick={() => handleViewChange(leftView)}
          >
            {getViewIcon(leftView)}
            <span className="hidden md:inline">{getViewName(leftView)}</span>
          </button>
          <div className="h-full w-0.5 bg-black/20"></div>
          <button
            className="flex items-center gap-1 py-2 px-4 text-sm font-medium hover:bg-brand-light-gray transition-colors"
            onClick={() => handleViewChange(rightView)}
          >
            {getViewIcon(rightView)}
            <span className="hidden md:inline">{getViewName(rightView)}</span>
          </button>
        </motion.div>
      </div>
    </div>
  )
}