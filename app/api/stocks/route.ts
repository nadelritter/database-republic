import { type NextRequest, NextResponse } from "next/server"

// This would typically connect to your database
// For now, we'll simulate with mock data
const mockStocks = Array.from({ length: 8000 }, (_, i) => ({
  id: i + 1,
  name: `Stock ${i + 1}`,
  image: `/placeholder.svg?height=64&width=64&query=company logo ${i + 1}`,
  addedDate: new Date(Date.now() - Math.random() * 365 * 24 * 60 * 60 * 1000).toISOString(),
  removed: Math.random() > 0.9, // 10% chance of being removed
  symbol: `STK${i + 1}`,
  price: Math.random() * 1000 + 10,
  change: (Math.random() - 0.5) * 20,
  changePercent: (Math.random() - 0.5) * 10,
}))

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url)
  const page = Number.parseInt(searchParams.get("page") || "1")
  const limit = Number.parseInt(searchParams.get("limit") || "24")
  const search = searchParams.get("search") || ""

  try {
    let filteredStocks = mockStocks

    // Apply search filter if provided
    if (search) {
      filteredStocks = mockStocks.filter(
        (stock) =>
          stock.name.toLowerCase().includes(search.toLowerCase()) ||
          stock.symbol.toLowerCase().includes(search.toLowerCase()),
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
