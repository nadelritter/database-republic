"use client"

import { Sidebar } from "@/components/sidebar"
import { FinanceSidebar } from "@/components/finance-sidebar"
import { Button } from "@/components/ui/button"
import { ArrowLeft, Plus, ThumbsUp } from "lucide-react"
import Link from "next/link"
import { useState, useEffect } from "react"

interface Stock {
  id: number
  name: string
  isin: string
  image: string
  added: string
  removed: boolean
  description?: string
}

interface PageProps {
  params: {
    id: string
  }
}

export default function AktiePage({ params }: PageProps) {
  const [aktie, setAktie] = useState<Stock | null>(null)
  const [loading, setLoading] = useState(true)
  const [voteCount, setVoteCount] = useState(1)
  const [hasVoted, setHasVoted] = useState(false)

  useEffect(() => {
    async function fetchStock() {
      try {
        const response = await fetch('/api/stocks', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ id: Number.parseInt(params.id) }),
        })

        if (response.ok) {
          const stockData = await response.json()
          setAktie(stockData)
        } else {
          console.error('Failed to fetch stock')
        }
      } catch (error) {
        console.error('Error fetching stock:', error)
      } finally {
        setLoading(false)
      }
    }

    fetchStock()
  }, [params.id])

  if (loading) {
    return (
      <div className="min-h-screen bg-background text-foreground flex items-center justify-center">
        <div className="text-center">
          <div className="text-sm text-muted-foreground">Loading stock...</div>
        </div>
      </div>
    )
  }

  if (!aktie) {
    return (
      <div className="min-h-screen bg-background text-foreground flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold mb-4">Aktie nicht gefunden</h1>
          <Link href="/">
            <Button>Zurück zur Übersicht</Button>
          </Link>
        </div>
      </div>
    )
  }

  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    return (
      date.toLocaleDateString("de-DE", {
        day: "numeric",
        month: "long",
        year: "numeric",
      }) + ` um ${date.toLocaleTimeString("de-DE")} (UTC)`
    )
  }

  const handleVote = () => {
    if (!hasVoted) {
      setVoteCount((prev) => prev + 1)
      setHasVoted(true)
    }
  }

  return (
    <div className="min-h-screen bg-background text-foreground">
      <div className="flex">
        <Sidebar />
        <main className="flex-1 p-6">
          <div className="max-w-4xl mx-auto">
            {/* Header */}
            <div className="mb-6">
              <div className="flex items-center gap-4 mb-4">
                <Link href="/">
                  <Button variant="ghost" size="sm">
                    <ArrowLeft className="w-4 h-4 mr-2" />
                    Zurück
                  </Button>
                </Link>
              </div>
              <div className="text-sm text-muted-foreground mb-2">TradeRepublic Aktie</div>
              <h1 className="text-3xl font-bold">{aktie.name}</h1>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              {/* Left Column - Images */}
              <div className="lg:col-span-1">
                <div className="bg-card rounded-lg p-6">
                  <h2 className="text-lg font-semibold mb-4 text-center">Statische Bilder</h2>
                  <div className="flex justify-center">
                    <div className="text-center">
                      <div className="w-16 h-16 bg-muted rounded-lg flex items-center justify-center mb-2 mx-auto">
                        <img
                          src={aktie.image || "/placeholder.svg"}
                          alt={`${aktie.name} Logo`}
                          className="w-full h-full object-cover rounded-lg"
                        />
                      </div>
                      <div className="text-sm text-muted-foreground">Logo</div>
                    </div>
                  </div>
                </div>

                {/* Name and ID */}
                <div className="bg-card rounded-lg p-6 mt-6">
                  <div className="space-y-4">
                    <div>
                      <div className="text-sm text-muted-foreground mb-1">Name</div>
                      <div className="font-medium">{aktie.name}</div>
                    </div>
                    <div>
                      <div className="text-sm text-muted-foreground mb-1">ID</div>
                      <div className="font-mono text-sm break-all">{aktie.isin}</div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Right Column - Details */}
              <div className="lg:col-span-2">
                <div className="bg-card rounded-lg p-6">
                  <div className="flex items-center justify-between mb-6">
                    <h2 className="text-lg font-semibold">Info zu {aktie.name}</h2>
                    <Button variant="ghost" size="sm">
                      <Plus className="w-4 h-4" />
                    </Button>
                  </div>

                  <div className="mb-6">
                    <div className="inline-block bg-muted px-3 py-1 rounded-full text-sm mb-4">Allgemein</div>
                    <p className="text-sm leading-relaxed mb-4">{aktie.description}</p>
                    <div className="flex items-center gap-4 text-sm">
                      <div className="flex items-center gap-2">
                        <Button
                          variant={hasVoted ? "default" : "ghost"}
                          size="sm"
                          className="h-6 px-2"
                          onClick={handleVote}
                          disabled={hasVoted}
                        >
                          <ThumbsUp className="w-3 h-3 mr-1" />
                          {voteCount}
                        </Button>
                      </div>
                      <div className="text-muted-foreground ml-auto">
                        Eingereicht von <span className="text-foreground">System</span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* History */}
                <div className="bg-card rounded-lg p-6 mt-6">
                  <div className="flex items-center justify-between mb-4">
                    <h2 className="text-lg font-semibold">Geschichte</h2>
                  </div>
                  <div>
                    <div className="text-sm font-medium mb-2">Hinzugefügt</div>
                    <div className="text-sm text-muted-foreground">{formatDate(aktie.added)}</div>
                  </div>
                </div>
              </div>
            </div>

            {/* Footer */}
            <div className="mt-12 text-center text-sm text-muted-foreground">Made with ❤️ by Maximilian Freitag</div>
          </div>
        </main>
        <FinanceSidebar />
      </div>
    </div>
  )
}
