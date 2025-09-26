import { type NextRequest, NextResponse } from "next/server"
import { parse } from "csv-parse/sync"

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData()
    const file = formData.get("file") as File

    if (!file) {
      return NextResponse.json({ error: "No file uploaded" }, { status: 400 })
    }

    const csvText = await file.text()

    // Parse CSV data
    const records = parse(csvText, {
      columns: true,
      skip_empty_lines: true,
      trim: true,
    })

    // Process and validate CSV data
    const processedData = records.map((record: any) => ({
      name: record.name || record.Name || "",
      image: record.image || record.Image || record.logo || record.Logo || "",
      addedDate: record.addedDate || record.added_date || record.AddedDate || new Date().toISOString(),
      removed: record.removed === "true" || record.removed === "1" || record.Removed === "true",
      symbol: record.symbol || record.Symbol || "",
      price: Number.parseFloat(record.price || record.Price || "0"),
      change: Number.parseFloat(record.change || record.Change || "0"),
      changePercent: Number.parseFloat(record.changePercent || record.change_percent || record.ChangePercent || "0"),
    }))

    // Here you would typically save to your database
    // For now, we'll just return the processed data
    console.log("[v0] Processed CSV data:", processedData.length, "records")

    return NextResponse.json({
      success: true,
      message: `Successfully processed ${processedData.length} records`,
      data: processedData,
    })
  } catch (error) {
    console.error("[v0] CSV processing error:", error)
    return NextResponse.json(
      {
        error: "Failed to process CSV file",
      },
      { status: 500 },
    )
  }
}

export const runtime = 'edge';
