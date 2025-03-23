import type React from "react"
import type { Metadata } from "next"
import { Inter } from "next/font/google"
import "./globals.css"
import { ThemeProvider } from "@/components/theme-provider"
import { TopNavBar } from "@/components/navigation/top-nav-bar"
import { BottomNavBar } from "@/components/navigation/bottom-nav-bar"

const inter = Inter({ subsets: ["latin"] })

export const metadata: Metadata = {
  title: "CreatorFlock - TikTok Creator Analytics",
  description: "Analyze, compare, and showcase your TikTok content with CreatorFlock",
  generator: 'v0.dev',
  icons: {
    icon: [
      {
        url: "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/creator-flock-icon-wO3QPmrhBJxlrAPDZnjenRNZklmc5V.png",
        sizes: "48x48",
        type: "image/png"
      }
    ],
    shortcut: [
      {
        url: "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/creator-flock-icon-wO3QPmrhBJxlrAPDZnjenRNZklmc5V.png",
        sizes: "48x48",
        type: "image/png"
      }
    ]
  }
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en">
      <body className={`${inter.className} min-h-screen bg-peach-bg dark:bg-black`}>
        <ThemeProvider attribute="class" defaultTheme="system" enableSystem disableTransitionOnChange>
          <div className="flex flex-col min-h-screen">
            <TopNavBar />
            <main className="flex-1 container mx-auto px-4 py-4 md:py-6">{children}</main>
            <BottomNavBar />
          </div>
        </ThemeProvider>
      </body>
    </html>
  )
}