"use client"
import { TrendingUp, TrendingDown, ExternalLink } from "lucide-react"
import { useEffect, useState } from "react"
import FlipNumbers from "react-flip-numbers"

interface SP500Data {
  price: number
  change: number
  changePercent: number
  history: Array<{ time: string; value: number; date: string }>
}

interface RedditPost {
  title: string
  author: string
  score: number
  url: string
  created: number
  permalink: string
}

export function FinanceSidebar() {
  const [sp500Data, setSP500Data] = useState<SP500Data>({
    price: 4200,
    change: 23.35,
    changePercent: 0.41,
    history: [],
  })

  const [finanzenPost, setFinanzenPost] = useState<RedditPost>({
    title: "Loading...",
    author: "u/loading",
    score: 0,
    url: "#",
    created: Date.now(),
    permalink: "",
  })

  const [mauerstrassenPost, setMauerstrassenPost] = useState<RedditPost>({
    title: "Loading...",
    author: "u/loading",
    score: 0,
    url: "#",
    created: Date.now(),
    permalink: "",
  })

  // Cache utilities
  const CACHE_DURATION = 10 * 60 * 1000 // 10 minutes in milliseconds

  const getCachedData = (key: string) => {
    try {
      const cached = localStorage.getItem(key)
      if (cached) {
        const parsed = JSON.parse(cached)
        if (Date.now() - parsed.timestamp < CACHE_DURATION) {
          return parsed.data
        } else {
          localStorage.removeItem(key)
        }
      }
    } catch (error) {
      console.error('Error reading cache:', error)
    }
    return null
  }

  const setCachedData = (key: string, data: any) => {
    try {
      localStorage.setItem(key, JSON.stringify({
        data,
        timestamp: Date.now()
      }))
    } catch (error) {
      console.error('Error setting cache:', error)
    }
  }

  const [hoveredValue, setHoveredValue] = useState<number | null>(null)
  const [selectedTimespan, setSelectedTimespan] = useState("1D")
  const [isLoadingSP500, setIsLoadingSP500] = useState(false)
  const [isLoadingReddit, setIsLoadingReddit] = useState(true)

  // Fetch SP500 data when timespan changes with caching
  useEffect(() => {
    async function fetchSP500Data() {
      const cacheKey = `sp500_${selectedTimespan}`
      const cachedData = getCachedData(cacheKey)

      // If we have cached data, use it immediately
      if (cachedData) {
        setSP500Data(cachedData)
        return
      }

      setIsLoadingSP500(true)
      try {
        const response = await fetch(`/api/sp500?timespan=${selectedTimespan}`)
        if (response.ok) {
          const data = await response.json()
          setSP500Data(data)
          setCachedData(cacheKey, data)
        }
      } catch (error) {
        console.error('Error fetching SP500 data:', error)
      } finally {
        setIsLoadingSP500(false)
      }
    }

    fetchSP500Data()
  }, [selectedTimespan])

  // Fetch Reddit posts on component mount with caching
  useEffect(() => {
    async function fetchRedditPosts() {
      // Check cache first
      const cachedFinanzen = getCachedData('reddit_finanzen')
      const cachedMauerstrassen = getCachedData('reddit_mauerstrassen')

      // Set cached data if available
      if (cachedFinanzen) {
        setFinanzenPost(cachedFinanzen)
      }
      if (cachedMauerstrassen) {
        setMauerstrassenPost(cachedMauerstrassen)
      }

      // If both are cached, we're done
      if (cachedFinanzen && cachedMauerstrassen) {
        setIsLoadingReddit(false)
        return
      }

      setIsLoadingReddit(true)

      try {
        // Only fetch finanzen if not cached
        if (!cachedFinanzen) {
          const finanzenResponse = await fetch('/api/reddit?subreddit=finanzen')
          if (finanzenResponse.ok) {
            const finanzenData = await finanzenResponse.json()
            setFinanzenPost(finanzenData)
            setCachedData('reddit_finanzen', finanzenData)
          }
        }

        // Only fetch mauerstrassenwetten if not cached
        if (!cachedMauerstrassen) {
          const mauerstrassenResponse = await fetch('/api/reddit?subreddit=mauerstrassenwetten')
          if (mauerstrassenResponse.ok) {
            const mauerstrassenData = await mauerstrassenResponse.json()
            setMauerstrassenPost(mauerstrassenData)
            setCachedData('reddit_mauerstrassen', mauerstrassenData)
          }
        }
      } catch (error) {
        console.error('Error fetching Reddit posts:', error)
      } finally {
        setIsLoadingReddit(false)
      }
    }

    fetchRedditPosts()
  }, [])

  const formatTime = (timestamp: number) => {
    const diff = Date.now() - timestamp
    const hours = Math.floor(diff / 3600000)
    return `${hours}h ago`
  }

  return (
    <div className="w-80 bg-card border-l border-border flex flex-col h-screen">
      {/* SP500 Chart Section */}
      <div className="p-4 border-b border-border">
        <div className="mb-4">
          <h3 className="font-semibold mb-2">S&P 500 Live ({selectedTimespan})</h3>
          <div className="space-y-2">
            <div className="text-2xl font-bold flex items-baseline gap-1 h-8 overflow-visible">
              <span>€</span>
              <div className="flex items-center h-full">
                <FlipNumbers
                  height={24}
                  width={14}
                  color="currentColor"
                  background="transparent"
                  play={true}
                  perspective={100}
                  numbers={String((hoveredValue || sp500Data.price).toFixed(2))}
                  numberStyle={{
                    fontFamily: "inherit",
                    fontWeight: "700",
                    fontSize: "18px",
                    lineHeight: "24px",
                    letterSpacing: "-0.025em",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    overflow: "visible",
                  }}
                />
              </div>
            </div>
            <div
              className={`flex items-center gap-1 text-sm ${sp500Data.change >= 0 ? "text-green-500" : "text-red-500"}`}
            >
              {sp500Data.change >= 0 ? <TrendingUp className="w-4 h-4" /> : <TrendingDown className="w-4 h-4" />}
              <span>
                {sp500Data.change >= 0 ? "+" : ""}
                {sp500Data.change.toFixed(2)}
              </span>
              <span>
                ({sp500Data.changePercent >= 0 ? "+" : ""}
                {sp500Data.changePercent.toFixed(2)}%)
              </span>
            </div>
          </div>
        </div>

        <div
          className="h-32 bg-muted rounded relative overflow-hidden"
          onMouseMove={(e) => {
            const rect = e.currentTarget.getBoundingClientRect()
            const x = e.clientX - rect.left
            const width = rect.width
            const dataIndex = Math.floor((x / width) * sp500Data.history.length)
            const dataPoint = sp500Data.history[dataIndex]
            if (dataPoint) {
              setHoveredValue(dataPoint.value)
            }
          }}
          onMouseLeave={() => setHoveredValue(null)}
        >
          <svg width="100%" height="100%" className="absolute inset-0">
            <defs>
              <linearGradient id="chartGradient" x1="0%" y1="0%" x2="0%" y2="100%">
                <stop offset="0%" stopColor="rgb(34, 197, 94)" stopOpacity="0.3" />
                <stop offset="100%" stopColor="rgb(34, 197, 94)" stopOpacity="0.05" />
              </linearGradient>
            </defs>

            {/* Generate path from historical data */}
            <path
              d={(() => {
                const width = 320 // approximate width
                const height = 128 // height of container
                const padding = 8

                const minValue = Math.min(...sp500Data.history.map((d) => d.value))
                const maxValue = Math.max(...sp500Data.history.map((d) => d.value))
                const valueRange = maxValue - minValue

                const points = sp500Data.history
                  .map((point, index) => {
                    const x = padding + (index / (sp500Data.history.length - 1)) * (width - 2 * padding)
                    const y = padding + ((maxValue - point.value) / valueRange) * (height - 2 * padding)
                    return `${x},${y}`
                  })
                  .join(" L")

                return `M${points}`
              })()}
              stroke="rgb(34, 197, 94)"
              strokeWidth="2"
              fill="none"
              className="drop-shadow-sm"
            />

            {/* Fill area under the curve */}
            <path
              d={(() => {
                const width = 320
                const height = 128
                const padding = 8

                const minValue = Math.min(...sp500Data.history.map((d) => d.value))
                const maxValue = Math.max(...sp500Data.history.map((d) => d.value))
                const valueRange = maxValue - minValue

                const points = sp500Data.history
                  .map((point, index) => {
                    const x = padding + (index / (sp500Data.history.length - 1)) * (width - 2 * padding)
                    const y = padding + ((maxValue - point.value) / valueRange) * (height - 2 * padding)
                    return `${x},${y}`
                  })
                  .join(" L")

                const firstX = padding
                const lastX = padding + (width - 2 * padding)
                const bottomY = height - padding

                return `M${firstX},${bottomY} L${points} L${lastX},${bottomY} Z`
              })()}
              fill="url(#chartGradient)"
            />

            {/* X-axis labels */}
            {(() => {
              const width = 320
              const height = 128
              const padding = 8
              const labels = []

              // Generate labels based on timespan
              const generateLabels = () => {
                const data = sp500Data.history
                if (!data || data.length === 0) return []

                switch (selectedTimespan) {
                  case '1D':
                    // Show hours for 1D - display key 24-hour intervals
                    const hourLabels = []
                    const targetHours = [0, 6, 12, 18] // Every 6 hours for 24-hour coverage

                    targetHours.forEach(targetHour => {
                      // Find the closest data point to this target hour
                      let closestPoint = null
                      let closestDiff = Infinity

                      data.forEach(point => {
                        const pointDate = new Date(point.date)
                        const pointHour = pointDate.getHours()
                        const diff = Math.abs(pointHour - targetHour)

                        if (diff < closestDiff) {
                          closestDiff = diff
                          closestPoint = point
                        }
                      })

                      if (closestPoint) {
                        const date = new Date(closestPoint.date)
                        hourLabels.push({
                          date,
                          label: date.toLocaleTimeString('en-US', {
                            hour: '2-digit',
                            minute: '2-digit',
                            hour12: false
                          })
                        })
                      }
                    })

                    return hourLabels

                  case '5D':
                    // Show days for 5D - sample first data point of each day
                    const dayLabels = []
                    const seenDays = new Set()
                    data.forEach(point => {
                      const date = new Date(point.date)
                      const dayKey = date.toDateString()
                      if (!seenDays.has(dayKey)) {
                        seenDays.add(dayKey)
                        dayLabels.push({
                          date,
                          label: date.toLocaleDateString('en-US', { weekday: 'short' })
                        })
                      }
                    })
                    return dayLabels

                  case '1M':
                    // Show weeks for 1M - divide into 4 weeks
                    const weekLabels = []
                    const totalPoints = data.length
                    const weekSize = Math.floor(totalPoints / 4)
                    for (let i = 0; i < 4; i++) {
                      const pointIndex = Math.min(i * weekSize, totalPoints - 1)
                      const point = data[pointIndex]
                      weekLabels.push({
                        date: new Date(point.date),
                        label: `W${i + 1}`
                      })
                    }
                    return weekLabels

                  case '6M':
                  case 'YTD':
                    // Show months
                    const monthLabels = []
                    const seenMonths = new Set()
                    data.forEach(point => {
                      const date = new Date(point.date)
                      const monthKey = `${date.getFullYear()}-${date.getMonth()}`
                      if (!seenMonths.has(monthKey) && date.getDate() <= 7) { // First week of month
                        seenMonths.add(monthKey)
                        monthLabels.push({
                          date,
                          label: date.toLocaleDateString('en-US', { month: 'short' })
                        })
                      }
                    })
                    return monthLabels

                  case '2Y':
                    // Show quarters
                    const quarterLabels = []
                    const seenQuarters = new Set()
                    data.forEach(point => {
                      const date = new Date(point.date)
                      const quarter = Math.floor(date.getMonth() / 3) + 1
                      const year = date.getFullYear()
                      const quarterKey = `${year}-Q${quarter}`
                      if (!seenQuarters.has(quarterKey) && date.getDate() <= 7) {
                        seenQuarters.add(quarterKey)
                        quarterLabels.push({
                          date,
                          label: `Q${quarter}`
                        })
                      }
                    })
                    return quarterLabels

                  case '7Y':
                    // Show years
                    const yearLabels = []
                    const seenYears = new Set()
                    data.forEach(point => {
                      const date = new Date(point.date)
                      const year = date.getFullYear()
                      if (!seenYears.has(year) && date.getMonth() === 0 && date.getDate() <= 7) {
                        seenYears.add(year)
                        yearLabels.push({
                          date,
                          label: year.toString()
                        })
                      }
                    })
                    return yearLabels

                  default:
                    return []
                }
              }

              const timeLabels = generateLabels()

              return timeLabels.map((label, index) => {
                // Find the corresponding data point index
                const dataIndex = sp500Data.history.findIndex(point =>
                  new Date(point.date).getTime() === label.date.getTime()
                )

                if (dataIndex === -1) return null

                const x = padding + (dataIndex / (sp500Data.history.length - 1)) * (width - 2 * padding)
                const y = height - 2

                return (
                  <text
                    key={index}
                    x={x}
                    y={y}
                    textAnchor="middle"
                    className="text-xs fill-muted-foreground"
                    style={{ fontSize: '10px' }}
                  >
                    {label.label}
                  </text>
                )
              }).filter(Boolean)
            })()}
          </svg>
        </div>

        {/* Timespan selection buttons */}
        <div className="flex gap-1 justify-center flex-wrap mt-3">
          {["1D", "5D", "1M", "6M", "YTD", "2Y", "7Y"].map((timespan) => (
            <button
              key={timespan}
              onClick={() => setSelectedTimespan(timespan)}
              className={`px-2 py-1 text-xs rounded transition-colors ${
                selectedTimespan === timespan
                  ? "bg-primary text-primary-foreground"
                  : "bg-muted hover:bg-muted/80 text-muted-foreground hover:text-foreground"
              }`}
            >
              {timespan}
            </button>
          ))}
        </div>
      </div>

      {/* Reddit Posts Section */}
      <div className="flex-1 p-4 space-y-6">
        {/* r/finanzen post */}
        <div>
          <h4 className="font-medium mb-3 text-sm text-muted-foreground">r/finanzen - Top Post</h4>
          {isLoadingReddit ? (
            <div className="bg-muted/50 rounded-lg p-3 space-y-2">
              <div className="h-4 bg-muted rounded animate-pulse"></div>
              <div className="flex items-center justify-between">
                <div className="h-3 bg-muted rounded w-16 animate-pulse"></div>
                <div className="h-3 bg-muted rounded w-12 animate-pulse"></div>
              </div>
            </div>
          ) : (
            <a href={finanzenPost.url} target="_blank" rel="noopener noreferrer" className="block">
              <div className="bg-muted/50 rounded-lg p-3 space-y-2 hover:bg-muted/70 transition-colors cursor-pointer">
                <h5 className="font-medium text-sm leading-tight">{finanzenPost.title}</h5>
                <div className="flex items-center justify-between text-xs text-muted-foreground">
                  <span>{finanzenPost.author}</span>
                  <span>{formatTime(finanzenPost.created)}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-xs text-green-500">↑ {finanzenPost.score}</span>
                  <ExternalLink className="w-3 h-3 text-muted-foreground" />
                </div>
              </div>
            </a>
          )}
        </div>

        {/* r/mauerstrassenwetten post */}
        <div>
          <h4 className="font-medium mb-3 text-sm text-muted-foreground">r/mauerstrassenwetten - Top Post</h4>
          {isLoadingReddit ? (
            <div className="bg-muted/50 rounded-lg p-3 space-y-2">
              <div className="h-4 bg-muted rounded animate-pulse"></div>
              <div className="flex items-center justify-between">
                <div className="h-3 bg-muted rounded w-16 animate-pulse"></div>
                <div className="h-3 bg-muted rounded w-12 animate-pulse"></div>
              </div>
            </div>
          ) : (
            <a
              href={mauerstrassenPost.url}
              target="_blank"
              rel="noopener noreferrer"
              className="block"
            >
              <div className="bg-muted/50 rounded-lg p-3 space-y-2 hover:bg-muted/70 transition-colors cursor-pointer">
                <h5 className="font-medium text-sm leading-tight">{mauerstrassenPost.title}</h5>
                <div className="flex items-center justify-between text-xs text-muted-foreground">
                  <span>{mauerstrassenPost.author}</span>
                  <span>{formatTime(mauerstrassenPost.created)}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-xs text-green-500">↑ {mauerstrassenPost.score}</span>
                  <ExternalLink className="w-3 h-3 text-muted-foreground" />
                </div>
              </div>
            </a>
          )}
        </div>
      </div>
    </div>
  )
}
