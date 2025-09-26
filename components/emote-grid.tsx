"use client"

import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Input } from "@/components/ui/input"
import { EmoteCard } from "@/components/emote-card"
import { useState, useEffect, useCallback, useMemo, useRef } from "react"

interface Stock {
  id: number
  name: string
  isin: string
  image: string
  added: string
  removed: boolean
}

const ITEMS_PER_PAGE = 24

// Global ref to persist data across component remounts
let globalStocksData: Stock[] | null = null

export function EmoteGrid() {
  const [displayedItems, setDisplayedItems] = useState(ITEMS_PER_PAGE)
  const [isLoading, setIsLoading] = useState(false)
  const [sortBy, setSortBy] = useState("newest")
  const [searchTerm, setSearchTerm] = useState("")
  const [allEmotes, setAllEmotes] = useState<Stock[]>(globalStocksData || [])
  const [isInitialLoading, setIsInitialLoading] = useState(!globalStocksData)
  const [isSearching, setIsSearching] = useState(false)

  // Handle search functionality
  useEffect(() => {
    const handleSearch = async () => {
      if (!searchTerm.trim()) {
        setIsSearching(false)
        // Reset to lazy loading mode - show first 1000 stocks and reset displayed items
        if (globalStocksData) {
          setAllEmotes(globalStocksData.slice(0, 1000))
          setDisplayedItems(ITEMS_PER_PAGE) // Reset to initial page size for lazy loading
        }
        return
      }

      // First check if we have results in current data
      const currentFiltered = allEmotes.filter((emote) =>
        emote.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        emote.isin.toLowerCase().includes(searchTerm.toLowerCase())
      )

      if (currentFiltered.length > 0) {
        // We have results in current data, no need to search server-side
        setIsSearching(false)
        return
      }

      // No results in current data, search server-side for all matching results
      setIsSearching(true)
      try {
        const response = await fetch(`/api/stocks?search=${encodeURIComponent(searchTerm)}&limit=10000`)
        if (response.ok) {
          const data = await response.json()
          setAllEmotes(data.stocks || [])
        }
      } catch (error) {
        console.error('Error searching stocks:', error)
      } finally {
        setIsSearching(false)
      }
    }

    // Debounce search to avoid too many API calls
    const timeoutId = setTimeout(handleSearch, 300)
    return () => clearTimeout(timeoutId)
  }, [searchTerm])

  // Fetch all stocks on component mount
  useEffect(() => {
    // If we already have global data, use it
    if (globalStocksData) {
      setAllEmotes(globalStocksData.slice(0, 1000)) // Start with first 1000 for lazy loading
      setIsInitialLoading(false)
      return
    }

    async function fetchStocks() {
      try {
        const response = await fetch('/api/stocks?page=1&limit=1000')
        const data = await response.json()
        const stocks = data.stocks || []
        globalStocksData = stocks // Store in global ref for persistence
        setAllEmotes(stocks)
      } catch (error) {
        console.error('Error fetching stocks:', error)
        setAllEmotes([])
      } finally {
        setIsInitialLoading(false)
      }
    }

    fetchStocks()
  }, [])

  const filteredAndSortedEmotes = useMemo(() => {
    const filtered = allEmotes.filter((emote) =>
      emote.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      emote.isin.toLowerCase().includes(searchTerm.toLowerCase())
    )

    switch (sortBy) {
      case "oldest":
        filtered.sort((a, b) => new Date(a.added).getTime() - new Date(b.added).getTime())
        break
      case "name":
        filtered.sort((a, b) => a.name.localeCompare(b.name))
        break
      case "newest":
      default:
        // Custom sorting: Added today → Removed stocks → Active stocks (by newest)
        const today = new Date().toISOString().split('T')[0] // YYYY-MM-DD format

        filtered.sort((a, b) => {
          // Priority 1: Stocks added today (newly added)
          const aAddedToday = a.added === today && !a.removed
          const bAddedToday = b.added === today && !b.removed

          if (aAddedToday && !bAddedToday) return -1
          if (!aAddedToday && bAddedToday) return 1

          // Priority 2: Removed stocks
          if (a.removed && !b.removed) return -1
          if (!a.removed && b.removed) return 1

          // Priority 3: Active stocks sorted by newest added date
          return new Date(b.added).getTime() - new Date(a.added).getTime()
        })
        break
    }

    return filtered
  }, [sortBy, searchTerm, allEmotes])

  const handleScroll = useCallback(() => {
    if (isLoading || isSearching) return

    const scrollTop = window.pageYOffset || document.documentElement.scrollTop
    const windowHeight = window.innerHeight
    const documentHeight = document.documentElement.scrollHeight

    // Load more when user is 200px from bottom (only when not searching)
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
  }, [displayedItems, isLoading, isSearching, filteredAndSortedEmotes.length])

  useEffect(() => {
    window.addEventListener("scroll", handleScroll)
    return () => window.removeEventListener("scroll", handleScroll)
  }, [handleScroll])

  useEffect(() => {
    setDisplayedItems(ITEMS_PER_PAGE)
  }, [sortBy, searchTerm])

  if (isInitialLoading) {
    return (
      <div className="space-y-6">
        <div className="flex justify-center py-12">
          <div className="text-sm text-muted-foreground">Loading stocks...</div>
        </div>
      </div>
    )
  }

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
                <SelectItem value="newest">New</SelectItem>
                <SelectItem value="oldest">Oldest</SelectItem>
                <SelectItem value="name">Name</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
        <div className="flex items-center gap-4">
          <span className="text-sm font-medium">Search</span>
          <div className="relative">
            <Input
              placeholder="Enter a name..."
              className="w-48"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
            {isSearching && (
              <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
                <div className="w-4 h-4 border-2 border-primary border-t-transparent rounded-full animate-spin"></div>
              </div>
            )}
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {(isSearching ? filteredAndSortedEmotes : filteredAndSortedEmotes.slice(0, displayedItems)).map((emote) => (
          <EmoteCard key={emote.id} emote={emote} />
        ))}
      </div>

      {isLoading && (
        <div className="flex justify-center py-8">
          <div className="text-sm text-muted-foreground">Loading more stocks...</div>
        </div>
      )}

      {displayedItems >= filteredAndSortedEmotes.length && filteredAndSortedEmotes.length > ITEMS_PER_PAGE && !isSearching && (
        <div className="flex justify-center py-8">
          <div className="text-sm text-muted-foreground">All stocks loaded</div>
        </div>
      )}

      {filteredAndSortedEmotes.length === 0 && searchTerm && !isSearching && (
        <div className="flex justify-center py-8">
          <div className="text-sm text-muted-foreground">No stocks found matching "{searchTerm}"</div>
        </div>
      )}

      {isSearching && (
        <div className="flex justify-center py-8">
          <div className="text-sm text-muted-foreground">Searching for stocks...</div>
        </div>
      )}
    </div>
  )
}
