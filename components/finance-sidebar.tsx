"use client"
import { TrendingUp, TrendingDown, ExternalLink } from "lucide-react"
import { useEffect, useState } from "react"
import FlipNumbers from "react-flip-numbers"

interface SP500Data {
  price: number
  change: number
  changePercent: number
  history: Array<{ time: string; value: number; date: Date }>
}

interface RedditPost {
  title: string
  author: string
  score: number
  url: string
  created: number
}

export function FinanceSidebar() {
  const generateHistoricalData = (years: number) => {
    const data = []
    const now = new Date()
    const startDate = new Date(now.getTime() - years * 365 * 24 * 60 * 60 * 1000)

    // Start at a base price 2 years ago
    let currentPrice = 4200

    // Generate daily data points for 2 years
    for (let i = 0; i < years * 365; i++) {
      const date = new Date(startDate.getTime() + i * 24 * 60 * 60 * 1000)

      // Simulate realistic market movements with overall upward trend
      const dailyChange = (Math.random() - 0.45) * 50 // Slight upward bias
      currentPrice += dailyChange

      // Ensure price stays in realistic range
      currentPrice = Math.max(3800, Math.min(6200, currentPrice))

      data.push({
        time: date.toISOString().split("T")[0],
        value: currentPrice,
        date: date,
      })
    }

    return data
  }

  const [sp500Data, setSP500Data] = useState<SP500Data>(() => {
    const history = generateHistoricalData(2)
    const latestPrice = history[history.length - 1].value

    return {
      price: latestPrice,
      change: 23.35,
      changePercent: 0.41,
      history: history,
    }
  })

  const [finanzenPost, setFinanzenPost] = useState<RedditPost>({
    title: "ETF-Sparplan: Welcher Broker ist 2024 am günstigsten?",
    author: "u/FinanzGuru2024",
    score: 342,
    url: "#",
    created: Date.now() - 3600000,
  })

  const [mauerstrassenPost, setMauerstrassenPost] = useState<RedditPost>({
    title: "🚀 NVIDIA calls drucken wieder - wer ist dabei? 💎🙌",
    author: "u/DiamantHände",
    score: 1247,
    url: "#",
    created: Date.now() - 7200000,
  })

  const [hoveredValue, setHoveredValue] = useState<number | null>(null)
  const [selectedTimespan, setSelectedTimespan] = useState("1D")

  // Simulate live SP500 updates
  useEffect(() => {
    const interval = setInterval(() => {
      setSP500Data((prev) => {
        const newPrice = prev.price + (Math.random() - 0.5) * 2
        const now = new Date()

        const newHistory = [
          ...prev.history.slice(1),
          {
            time: now.toISOString().split("T")[0],
            value: newPrice,
            date: now,
          },
        ]

        return {
          price: newPrice,
          change: prev.change + (Math.random() - 0.5) * 0.5,
          changePercent: prev.changePercent + (Math.random() - 0.5) * 0.1,
          history: newHistory,
        }
      })
    }, 10000) // Updated interval from 5000ms to 10000ms (10 seconds)

    return () => clearInterval(interval)
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
          <a href="https://reddit.com/r/finanzen" target="_blank" rel="noopener noreferrer" className="block">
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
        </div>

        {/* r/mauerstrassenwetten post */}
        <div>
          <h4 className="font-medium mb-3 text-sm text-muted-foreground">r/mauerstrassenwetten - Top Post</h4>
          <a
            href="https://reddit.com/r/mauerstrassenwetten"
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
        </div>
      </div>
    </div>
  )
}
