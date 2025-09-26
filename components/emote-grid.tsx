"use client"

import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Input } from "@/components/ui/input"
import { EmoteCard } from "@/components/emote-card"
import { useState, useEffect, useCallback, useMemo } from "react"

const emotes = [
  { id: 1, name: "NVIDIA", image: "/nvidia-logo.png", added: "2025-09-15", removed: true },
  { id: 2, name: "Tesla", image: "/tesla-logo.png", added: "2025-09-15", removed: false },
  { id: 3, name: "Apple", image: "/apple-logo.png", added: "2025-09-04", removed: false },
  { id: 4, name: "Microsoft", image: "/microsoft-logo.png", added: "2025-09-01", removed: true },
  { id: 5, name: "Amazon", image: "/amazon-logo.png", added: "2025-09-01", removed: false },
  { id: 6, name: "Google", image: "/google-logo.png", added: "2025-08-21", removed: false },
  { id: 7, name: "Meta", image: "/meta-logo-abstract.png", added: "2025-08-15", removed: true },
  { id: 8, name: "Netflix", image: "/netflix-inspired-logo.png", added: "2025-08-10", removed: true },
  { id: 9, name: "Adobe", image: "/adobe-logo.png", added: "2025-08-05", removed: true },
  { id: 10, name: "Salesforce", image: "/salesforce-logo.png", added: "2025-08-05", removed: true },
  { id: 11, name: "Intel", image: "/intel-logo.png", added: "2025-08-05", removed: true },
  { id: 12, name: "AMD", image: "/amd-logo.png", added: "2025-08-05", removed: true },
  { id: 13, name: "Oracle", image: "/oracle-logo.png", added: "2025-08-05", removed: true },
  { id: 14, name: "IBM", image: "/ibm-logo.png", added: "2025-08-05", removed: true },
  { id: 15, name: "Cisco", image: "/cisco-logo.png", added: "2025-08-05", removed: true },
  { id: 16, name: "PayPal", image: "/paypal-logo.png", added: "2025-08-05", removed: true },
  { id: 17, name: "Uber", image: "/provider-logos/uber.png", added: "2025-08-05", removed: true },
  { id: 18, name: "Spotify", image: "/placeholder.svg?height=56&width=56", added: "2025-08-05", removed: true },
  { id: 19, name: "Twitter", image: "/placeholder.svg?height=56&width=56", added: "2025-08-05", removed: true },
  { id: 20, name: "LinkedIn", image: "/placeholder.svg?height=56&width=56", added: "2025-08-05", removed: true },
  { id: 21, name: "Zoom", image: "/placeholder.svg?height=56&width=56", added: "2025-08-05", removed: true },
  { id: 22, name: "Shopify", image: "/shopify-logo.png", added: "2025-07-15", removed: true },
  { id: 23, name: "Square", image: "/abstract-square-logo.png", added: "2025-07-02", removed: false },
  { id: 24, name: "Palantir", image: "/palantir-logo.png", added: "2025-06-28", removed: false },
  { id: 25, name: "Airbnb", image: "/placeholder.svg?height=56&width=56", added: "2025-06-20", removed: false },
  { id: 26, name: "Stripe", image: "/placeholder.svg?height=56&width=56", added: "2025-06-15", removed: false },
  { id: 27, name: "Coinbase", image: "/placeholder.svg?height=56&width=56", added: "2025-06-10", removed: true },
  { id: 28, name: "Robinhood", image: "/placeholder.svg?height=56&width=56", added: "2025-06-05", removed: false },
  { id: 29, name: "Twilio", image: "/placeholder.svg?height=56&width=56", added: "2025-06-01", removed: true },
  { id: 30, name: "Slack", image: "/placeholder.svg?height=56&width=56", added: "2025-05-28", removed: false },
]

const ITEMS_PER_PAGE = 24

export function EmoteGrid() {
  const [displayedItems, setDisplayedItems] = useState(ITEMS_PER_PAGE)
  const [isLoading, setIsLoading] = useState(false)
  const [sortBy, setSortBy] = useState("newest")
  const [searchTerm, setSearchTerm] = useState("")

  const filteredAndSortedEmotes = useMemo(() => {
    const filtered = emotes.filter((emote) => emote.name.toLowerCase().includes(searchTerm.toLowerCase()))

    switch (sortBy) {
      case "oldest":
        filtered.sort((a, b) => new Date(a.added).getTime() - new Date(b.added).getTime())
        break
      case "name":
        filtered.sort((a, b) => a.name.localeCompare(b.name))
        break
      case "newest":
      default:
        filtered.sort((a, b) => new Date(b.added).getTime() - new Date(a.added).getTime())
        break
    }

    return filtered
  }, [sortBy, searchTerm])

  const handleScroll = useCallback(() => {
    if (isLoading) return

    const scrollTop = window.pageYOffset || document.documentElement.scrollTop
    const windowHeight = window.innerHeight
    const documentHeight = document.documentElement.scrollHeight

    // Load more when user is 200px from bottom
    if (scrollTop + windowHeight >= documentHeight - 200) {
      if (displayedItems < filteredAndSortedEmotes.length) {
        setIsLoading(true)
        // Simulate loading delay
        setTimeout(() => {
          setDisplayedItems((prev) => Math.min(prev + ITEMS_PER_PAGE, filteredAndSortedEmotes.length))
          setIsLoading(false)
        }, 500)
      }
    }
  }, [displayedItems, isLoading, filteredAndSortedEmotes.length])

  useEffect(() => {
    window.addEventListener("scroll", handleScroll)
    return () => window.removeEventListener("scroll", handleScroll)
  }, [handleScroll])

  useEffect(() => {
    setDisplayedItems(ITEMS_PER_PAGE)
  }, [sortBy, searchTerm])

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-6">
          <div className="flex items-center gap-2">
            <span className="text-sm font-medium">Sort</span>
            <Select value={sortBy} onValueChange={setSortBy}>
              <SelectTrigger className="w-28">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="newest">Newest</SelectItem>
                <SelectItem value="oldest">Oldest</SelectItem>
                <SelectItem value="name">Name</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
        <div className="flex items-center gap-4">
          <span className="text-sm font-medium">Search</span>
          <Input
            placeholder="Enter a name..."
            className="w-48"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredAndSortedEmotes.slice(0, displayedItems).map((emote) => (
          <EmoteCard key={emote.id} emote={emote} />
        ))}
      </div>

      {isLoading && (
        <div className="flex justify-center py-8">
          <div className="text-sm text-muted-foreground">Loading more stocks...</div>
        </div>
      )}

      {displayedItems >= filteredAndSortedEmotes.length && filteredAndSortedEmotes.length > ITEMS_PER_PAGE && (
        <div className="flex justify-center py-8">
          <div className="text-sm text-muted-foreground">All stocks loaded</div>
        </div>
      )}

      {filteredAndSortedEmotes.length === 0 && searchTerm && (
        <div className="flex justify-center py-8">
          <div className="text-sm text-muted-foreground">No stocks found matching "{searchTerm}"</div>
        </div>
      )}
    </div>
  )
}
