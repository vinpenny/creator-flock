"use client"

import { useState, useEffect } from "react"
import { FilteredLeaderboard } from "@/components/boards/filtered-leaderboard"
import { BoardAboutSection } from "@/components/boards/board-about-section"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { SlidersHorizontal, SortAsc } from "lucide-react"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Sheet, SheetTrigger } from "@/components/ui/sheet"
import { Button } from "@/components/ui/button"
import { FilterPanel } from "@/components/filters/filter-panel"
import { useSearchParams } from "next/navigation"

export default function Boards() {
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false)
  const [timeFilter, setTimeFilter] = useState("today")
  const [categoryFilter, setCategoryFilter] = useState("all")
  const [sortBy, setSortBy] = useState("viralScore")
  const [activeView, setActiveView] = useState<"chart" | "grid" | "table">("chart")
  const [isFilterOpen, setIsFilterOpen] = useState(false)
  const [activeTab, setActiveTab] = useState<"board" | "about">("board")
  const [isEditing, setIsEditing] = useState(false)
  
  const searchParams = useSearchParams()
  const boardId = searchParams?.get('id') || 'placeholder-id'
  const boardName = searchParams?.get('name') || 'Board Name'
  
  // Handle window resize to reset tab to board on desktop view
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth >= 1024) { // lg breakpoint
        setActiveTab("board")
      }
    }
    
    window.addEventListener("resize", handleResize)
    return () => {
      window.removeEventListener("resize", handleResize)
    }
  }, [])

  return (
    <div className="space-y-2 pb-16 md:pb-0 pt-2" data-board-id={boardId}>
      <div className="bg-brand-bg p-1">
        {/* Spacer */}
      </div>

      {/* Main header - show on desktop, hide on mobile */}
      <div className="hidden lg:block">
        <div className="flex justify-between items-center px-4 mb-4">
          <h1 
            id="board-title" 
            className="text-3xl font-bold text-brand-black"
          >
            {boardName}
          </h1>
          <Button 
            id="edit-board-btn"
            className="bg-brand-pink hover:bg-brand-pink/90 text-white font-bold"
            onClick={() => setIsEditing(true)}
          >
            Edit
          </Button>
        </div>
      </div>

      {/* Mobile Tabs - Only visible on mobile */}
      <div id="mobile-content-wrapper" className="lg:hidden px-4">
        <div className="flex justify-between items-center mb-2">
          <h1 
            id="board-title-mobile" 
            className="text-2xl font-bold text-brand-black"
          >
            {boardName}
          </h1>
          <Button 
            id="edit-board-btn-mobile"
            className="bg-brand-pink hover:bg-brand-pink/90 text-white font-bold text-sm py-1 h-8"
            onClick={() => setIsEditing(true)}
          >
            Edit
          </Button>
        </div>
        <div id="mobile-tabs" className="flex w-full border-b-2 border-brand-black mb-4">
          <button
            id="board-tab"
            className={`flex-1 py-3 px-4 font-bold text-brand-black rounded-t-lg transition-colors ${
              activeTab === "board"
                ? "bg-brand-light-gray border-2 border-b-0 border-brand-black shadow-chunky-top"
                : "bg-brand-white hover:bg-brand-light-gray/50"
            }`}
            onClick={() => setActiveTab("board")}
            aria-selected={activeTab === "board"}
            role="tab"
          >
            Board
          </button>
          <button
            id="about-tab"
            className={`flex-1 py-3 px-4 font-bold text-brand-black rounded-t-lg transition-colors ${
              activeTab === "about"
                ? "bg-brand-light-gray border-2 border-b-0 border-brand-black shadow-chunky-top"
                : "bg-brand-white hover:bg-brand-light-gray/50"
            }`}
            onClick={() => setActiveTab("about")}
            aria-selected={activeTab === "about"}
            role="tab"
          >
            About
          </button>
        </div>
      </div>

      {/* Content sections with mobile and desktop display logic */}
      <div className="flex flex-col lg:flex-row gap-6 px-4">
        {/* Board Posts Section - always visible on desktop, conditionally on mobile */}
        <div 
          className={`flex-1 board-section ${
            activeTab === "board" ? "block" : "lg:block hidden"
          }`}
        >
          <div className="brutalist-card">
            <FilteredLeaderboard view={activeView} onViewChange={setActiveView} />
          </div>
        </div>

        {/* About Section - always visible on desktop, conditionally on mobile */}
        <div 
          className={`w-full lg:w-80 about-section ${
            activeTab === "about" ? "block" : "lg:block hidden"
          }`}
        >
          <BoardAboutSection isEditing={isEditing} onEditComplete={() => setIsEditing(false)} />
        </div>
      </div>
    </div>
  )
}