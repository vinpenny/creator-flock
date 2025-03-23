"use client"

import { useState } from "react"
import { Leaderboard } from "@/components/leaderboard/leaderboard"
import { TopDeals } from "@/components/leaderboard/top-deals"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { SlidersHorizontal, SortAsc } from "lucide-react"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Sheet, SheetTrigger } from "@/components/ui/sheet"
import { Button } from "@/components/ui/button"
import { FilterPanel } from "@/components/filters/filter-panel"

export default function Home() {
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false)
  const [timeFilter, setTimeFilter] = useState("today")
  const [categoryFilter, setCategoryFilter] = useState("all")
  const [sortBy, setSortBy] = useState("viralScore")
  const [activeView, setActiveView] = useState<"chart" | "grid" | "table">("chart")
  const [isFilterOpen, setIsFilterOpen] = useState(false)

  return (
    <div className="space-y-2 pb-16 md:pb-0 pt-2">
      <div className="bg-brand-bg p-1">
        {/* Spacer */}
      </div>

      <div className="flex flex-col lg:flex-row gap-6">
        <div className="flex-1">
          <div className="brutalist-card">
            <Leaderboard view={activeView} onViewChange={setActiveView} />
          </div>
        </div>

        <div className="w-full lg:w-80">
          <TopDeals />
        </div>
      </div>
    </div>
  )
}