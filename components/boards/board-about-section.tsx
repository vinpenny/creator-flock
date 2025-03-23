"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"

interface BoardAboutSectionProps {
  isEditing: boolean
  onEditComplete: () => void
}

export function BoardAboutSection({ isEditing, onEditComplete }: BoardAboutSectionProps) {
  // State for editable fields
  const [title, setTitle] = useState("Board Name")
  const [aboutText, setAboutText] = useState("This is your Board description.")
  const [description, setDescription] = useState("Build and organize your saved content with custom boards.")
  const [ctaText, setCtaText] = useState("Board CTA")
  const [ctaUrl, setCtaUrl] = useState("#")
  
  // State for form editing
  const [editTitle, setEditTitle] = useState(title)
  const [editAboutText, setEditAboutText] = useState(aboutText)
  const [editDescription, setEditDescription] = useState(description)
  const [editCtaText, setEditCtaText] = useState(ctaText)
  const [editCtaUrl, setEditCtaUrl] = useState(ctaUrl)
  
  // Update form fields when editing mode changes
  useEffect(() => {
    if (isEditing) {
      setEditTitle(title)
      setEditAboutText(aboutText)
      setEditDescription(description)
      setEditCtaText(ctaText)
      setEditCtaUrl(ctaUrl)
    }
  }, [isEditing, title, aboutText, description, ctaText, ctaUrl])
  
  // Handle save button click
  const handleSave = () => {
    setTitle(editTitle)
    setAboutText(editAboutText)
    setDescription(editDescription)
    setCtaText(editCtaText)
    setCtaUrl(editCtaUrl)
    onEditComplete()
  }

  return (
    <div id="about-section" className="brutalist-card p-4 w-full h-full">
      <h2 id="about-header" className="text-2xl font-bold text-brand-black mb-4">
        About
      </h2>
      
      {isEditing ? (
        <div className="space-y-4">
          <div>
            <label htmlFor="edit-title-input" className="block text-xs text-brand-gray mb-1">
              Board Title
            </label>
            <Input
              id="edit-title-input"
              value={editTitle}
              onChange={(e) => setEditTitle(e.target.value)}
              className="border-brand-black"
            />
          </div>
          
          <div>
            <label htmlFor="edit-about-textarea" className="block text-xs text-brand-gray mb-1">
              About Text
            </label>
            <Textarea
              id="edit-about-textarea"
              value={editAboutText}
              onChange={(e) => setEditAboutText(e.target.value)}
              className="border-brand-black"
              rows={2}
            />
          </div>
          
          <div>
            <label htmlFor="edit-description-textarea" className="block text-xs text-brand-gray mb-1">
              Description
            </label>
            <Textarea
              id="edit-description-textarea"
              value={editDescription}
              onChange={(e) => setEditDescription(e.target.value)}
              className="border-brand-black"
              rows={3}
            />
          </div>
          
          <div>
            <label htmlFor="edit-cta-input" className="block text-xs text-brand-gray mb-1">
              Button Text
            </label>
            <Input
              id="edit-cta-input"
              value={editCtaText}
              onChange={(e) => setEditCtaText(e.target.value)}
              className="border-brand-black"
            />
          </div>
          
          <div>
            <label htmlFor="edit-url-input" className="block text-xs text-brand-gray mb-1">
              Button URL
            </label>
            <Input
              id="edit-url-input"
              value={editCtaUrl}
              onChange={(e) => setEditCtaUrl(e.target.value)}
              className="border-brand-black"
            />
          </div>
          
          <Button 
            id="save-board-edits-btn" 
            className="w-full bg-brand-pink hover:bg-brand-pink/90 text-white font-bold py-3"
            onClick={handleSave}
          >
            Save
          </Button>
        </div>
      ) : (
        <>
          <p id="board-about-text" className="text-brand-black mb-6">
            {aboutText}
          </p>
          <p id="board-description-text" className="text-brand-black mb-6">
            {description}
          </p>
          <Button 
            id="board-cta-button" 
            className="w-full bg-brand-pink hover:bg-brand-pink/90 text-white font-bold py-3"
            as="a"
            href={ctaUrl}
          >
            {ctaText}
          </Button>
        </>
      )}
    </div>
  )
}