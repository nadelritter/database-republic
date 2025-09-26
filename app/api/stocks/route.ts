import { type NextRequest, NextResponse } from "next/server"
import { stockData } from "@/lib/stock-data"

interface Stock {
  id: number
  name: string
  isin: string
  image: string
  added: string
  removed: boolean
}

// Cache for parsed data
let cachedStocks: Stock[] | null = null

function getStocks(): Stock[] {
  if (cachedStocks) {
    return cachedStocks
  }

  // Use the static stock data
  cachedStocks = stockData
  return cachedStocks
}

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url)
  const page = Number.parseInt(searchParams.get("page") || "1")
  const limit = Number.parseInt(searchParams.get("limit") || "24")
  const search = searchParams.get("search") || ""

  try {
    const allStocks = getStocks()
    let filteredStocks = allStocks

    // Apply search filter if provided
    if (search) {
      filteredStocks = allStocks.filter(
        (stock) =>
          stock.name.toLowerCase().includes(search.toLowerCase()) ||
          stock.isin.toLowerCase().includes(search.toLowerCase()),
      )
    }

    // Calculate pagination
    const startIndex = (page - 1) * limit
    const endIndex = startIndex + limit
    const paginatedStocks = filteredStocks.slice(startIndex, endIndex)

    return NextResponse.json({
      stocks: paginatedStocks,
      pagination: {
        page,
        limit,
        total: filteredStocks.length,
        totalPages: Math.ceil(filteredStocks.length / limit),
        hasMore: endIndex < filteredStocks.length,
      },
    })
  } catch (error) {
    console.error("[v0] API error:", error)
    return NextResponse.json(
      {
        error: "Failed to fetch stocks",
      },
      { status: 500 },
    )
  }
}

export async function POST(request: NextRequest) {
  try {
    const { id } = await request.json()
    const stock = getStocks().find(s => s.id === id)

    if (!stock) {
      return NextResponse.json({ error: "Stock not found" }, { status: 404 })
    }

    return NextResponse.json(stock)
  } catch (error) {
    console.error("[v0] API error:", error)
    return NextResponse.json(
      {
        error: "Failed to fetch stock",
      },
      { status: 500 },
    )
  }
}

export const runtime = 'edge';
