"use client"

import { useState, useRef, useEffect } from "react"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { motion } from "framer-motion"
import { X } from "lucide-react"

interface Board {
  id: string
  name: string
  postCount: number
}

interface SaveBoardPopupProps {
  postId: string
  isOpen: boolean
  onClose: () => void
  position?: { x: number, y: number }
}

export function SaveBoardPopup({ postId, isOpen, onClose, position }: SaveBoardPopupProps) {
  const [newBoardName, setNewBoardName] = useState("")
  const [selectedBoardId, setSelectedBoardId] = useState<string | null>(null)
  const popupRef = useRef<HTMLDivElement>(null)
  const [isMobile, setIsMobile] = useState(false)
  const [popupStyle, setPopupStyle] = useState<React.CSSProperties>({})
  
  // Check for mobile view
  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768)
    }
    
    // Initial check
    checkMobile()
    
    // Setup listener for resize events
    window.addEventListener('resize', checkMobile)
    
    return () => {
      window.removeEventListener('resize', checkMobile)
    }
  }, [])
  
  // Calculate popup position to ensure it's fully visible
  useEffect(() => {
    if (isOpen) {
      // For mobile devices, always center the popup
      if (isMobile) {
        setPopupStyle({
          position: 'fixed',
          top: '50%',
          left: '50%',
          transform: 'translate(-50%, -50%)',
          maxWidth: '90vw',
          zIndex: 100
        })
      } else {
        // Desktop positioning - use the click position if available
        setPopupStyle(position ? {
          top: position.y,
          left: position.x,
          transform: 'translate(-50%, 10px)',
        } : {
          top: '50%',
          left: '50%',
          transform: 'translate(-50%, -50%)',
        })
      }
    }
  }, [isOpen, position, isMobile])
  
  // Mock boards data
  const boards: Board[] = [
    { id: "board-1", name: "Favorites", postCount: 15 },
    { id: "board-2", name: "Inspiration", postCount: 8 },
    { id: "board-3", name: "Research", postCount: 24 },
    { id: "board-4", name: "Campaign Ideas", postCount: 5 },
    { id: "board-5", name: "Competitors", postCount: 12 }
  ]

  // Handle click outside to close
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (popupRef.current && !popupRef.current.contains(e.target as Node)) {
        onClose()
      }
    }
    
    if (isOpen) {
      document.addEventListener("mousedown", handleClickOutside)
    }
    
    return () => {
      document.removeEventListener("mousedown", handleClickOutside)
    }
  }, [isOpen, onClose])

  // Handle save to existing board
  const handleSaveToBoard = (boardId: string) => {
    setSelectedBoardId(boardId)
    console.log(`Saving post ${postId} to board ${boardId}`)
    
    // Here you would implement the actual save logic
    // This would be replaced with an API call in the real implementation
    
    // Redirect to the board page (for demonstration purposes)
    setTimeout(() => {
      window.location.href = `/boards?id=${boardId}`;
      onClose()
    }, 500)
  }

  // Handle create new board
  const handleCreateBoard = () => {
    if (newBoardName.trim()) {
      // Generate a unique ID for the new board (in a real app, this would be done by the server)
      const newBoardId = `board-${Date.now()}`
      console.log(`Creating new board "${newBoardName}" with ID ${newBoardId} and saving post ${postId}`)
      
      // Here you would implement the actual creation and save logic
      // This would be replaced with an API call in the real implementation
      
      // Redirect to the board page (for demonstration purposes)
      setTimeout(() => {
        window.location.href = `/boards?id=${newBoardId}`;
        setNewBoardName("")
        onClose()
      }, 500)
    }
  }

  if (!isOpen) return null

  return (
    <motion.div
      ref={popupRef}
      className={`z-50 w-72 p-4 bg-white border-2 border-brand-black shadow-chunky rounded-lg ${isMobile ? 'fixed' : 'absolute'}`}
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.95 }}
      transition={{ duration: 0.2 }}
      style={popupStyle}
    >
      <div className="flex justify-between items-center mb-3">
        <h3 className="text-sm font-bold">Save to Board</h3>
        <Button
          variant="ghost"
          size="icon"
          className="h-6 w-6"
          onClick={onClose}
          aria-label="Close"
        >
          <X className="h-4 w-4" />
        </Button>
      </div>

      <div className="mb-4">
        <p className="text-xs text-brand-gray mb-2">Your boards</p>
        <div id="board-select" className="flex flex-wrap gap-2">
          {boards.map((board) => (
            <Badge
              key={board.id}
              id={`board-bubble-${board.id}`}
              className={`bg-brand-light-gray text-brand-black border border-brand-black cursor-pointer transition-colors ${
                selectedBoardId === board.id ? 'bg-brand-pink text-white' : 'hover:bg-brand-gray/20'
              }`}
              onClick={() => handleSaveToBoard(board.id)}
            >
              {board.name} ({board.postCount})
            </Badge>
          ))}
        </div>
      </div>

      <div>
        <p className="text-xs text-brand-gray mb-2">Create new board</p>
        <div className="flex gap-2">
          <Input
            id="new-board-input"
            value={newBoardName}
            onChange={(e) => setNewBoardName(e.target.value)}
            placeholder="Board name"
            className="h-9 border-brand-black"
          />
          <Button
            variant="outline"
            size="sm"
            className="border-2 border-brand-black bg-brand-white hover:bg-brand-light-gray"
            onClick={handleCreateBoard}
            disabled={!newBoardName.trim()}
          >
            Save
          </Button>
        </div>
      </div>
    </motion.div>
  )
}