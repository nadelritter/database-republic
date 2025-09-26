import { type NextRequest, NextResponse } from "next/server"
import { readFileSync, writeFileSync, existsSync } from 'fs'
import { join } from 'path'
import { parse } from 'csv-parse/sync'

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

// Path to store stock state
const STOCK_STATE_PATH = join(process.cwd(), 'data', 'stock-state.json')

function loadStockState(): Stock[] {
  try {
    if (existsSync(STOCK_STATE_PATH)) {
      const data = readFileSync(STOCK_STATE_PATH, 'utf-8')
      return JSON.parse(data)
    }
  } catch (error) {
    console.error('Error loading stock state:', error)
  }
  return []
}

function saveStockState(stocks: Stock[]): void {
  try {
    writeFileSync(STOCK_STATE_PATH, JSON.stringify(stocks, null, 2))
  } catch (error) {
    console.error('Error saving stock state:', error)
  }
}

function getStocks(): Stock[] {
  if (cachedStocks) {
    return cachedStocks
  }

  try {
    // Read the CSV file
    const csvPath = join(process.cwd(), 'data', 'trade_republic_aktien_25_09_25.csv')
    const csvContent = readFileSync(csvPath, 'utf-8')

    // Parse CSV
    const records = parse(csvContent, {
      columns: true,
      skip_empty_lines: true,
      trim: true,
    })

    // Load previous state
    const previousStocks = loadStockState()
    const previousStockMap = new Map(previousStocks.map(stock => [stock.isin, stock]))

    // Create new stocks from CSV
    const newStocks: Stock[] = records.map((record: any, index: number) => {
      const isin = record.ISIN || record.isin || ''
      const name = record.Name || record.name || ''
      const existingStock = previousStockMap.get(isin)

      return {
        id: index + 1,
        name,
        isin,
        image: '/placeholder.svg',
        added: existingStock ? existingStock.added : new Date().toISOString().split('T')[0],
        removed: false, // Current stocks in CSV are not removed
      }
    })

    // Mark stocks that were in previous state but not in new CSV as removed
    const currentISINs = new Set(newStocks.map(stock => stock.isin))
    const removedStocks = previousStocks
      .filter(stock => !currentISINs.has(stock.isin))
      .map(stock => ({ ...stock, removed: true }))

    // Combine current and removed stocks
    cachedStocks = [...newStocks, ...removedStocks]

    // Save the new state
    saveStockState(cachedStocks)

    return cachedStocks
  } catch (error) {
    console.error('Error reading CSV file:', error)
    // Fallback to empty array
    return []
  }
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
