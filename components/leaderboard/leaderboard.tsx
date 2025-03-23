"use client"

import { useState, useEffect } from "react"
import { ChartView } from "./chart-view"
import { GridView } from "./grid-view"
import { TableView } from "./table-view"
import { motion, AnimatePresence } from "framer-motion"
import { BarChart2, Table, LayoutGrid } from "lucide-react"

export type LeaderboardView = "chart" | "grid" | "table"

interface LeaderboardProps {
  view: LeaderboardView
  onViewChange?: (view: LeaderboardView) => void
}

export function Leaderboard({ view: initialView, onViewChange }: LeaderboardProps) {
  // Use local state to manage view switching
  const [view, setView] = useState<LeaderboardView>(initialView)
  
  // State for sorting configuration
  const [sortField, setSortField] = useState<string>('viralScore')
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('desc')
  const [gridSortType, setGridSortType] = useState<string>("mostViral")
  
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
          transition={{ type: "spring", stiffness: 500, damping: 30 }}
          style={{ minWidth: "160px" }}
        >
          {/* Left side button */}
          <motion.button
            className="flex items-center justify-center gap-1.5 py-2 px-3 sm:pl-4 sm:pr-3 flex-1 hover:bg-gray-100 text-brand-black"
            onClick={() => handleViewChange(leftView)}
            whileTap={{ scale: 0.95 }}
            aria-label={`Switch to ${getViewName(leftView)} view`}
          >
            {getViewIcon(leftView)}
            <span className="text-sm font-medium hidden sm:inline">{getViewName(leftView)}</span>
          </motion.button>

          {/* Divider line */}
          <div className="w-px h-auto bg-gray-300"></div>

          {/* Right side button */}
          <motion.button
            className="flex items-center justify-center gap-1.5 py-2 px-3 sm:pl-3 sm:pr-4 flex-1 hover:bg-gray-100 text-brand-black"
            onClick={() => handleViewChange(rightView)}
            whileTap={{ scale: 0.95 }}
            aria-label={`Switch to ${getViewName(rightView)} view`}
          >
            {getViewIcon(rightView)}
            <span className="text-sm font-medium hidden sm:inline">{getViewName(rightView)}</span>
          </motion.button>
        </motion.div>
      </div>
    </div>
  )
}