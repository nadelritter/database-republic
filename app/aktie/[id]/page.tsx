"use client"

import { Sidebar } from "@/components/sidebar"
import { FinanceSidebar } from "@/components/finance-sidebar"
import { Button } from "@/components/ui/button"
import { ArrowLeft, Plus, ThumbsUp } from "lucide-react"
import Link from "next/link"
import { useState } from "react"

interface PageProps {
  params: {
    id: string
  }
}

const emotes = [
  {
    id: 1,
    name: "NVIDIA",
    image: "/nvidia-logo.png",
    added: "2025-09-15",
    removed: true,
    isin: "US67066G1040",
    description:
      "NVIDIA Corporation ist ein amerikanisches multinationales Technologieunternehmen mit Sitz in Santa Clara, Kalifornien. Das Unternehmen entwirft Grafikprozessoren (GPUs) für Gaming- und professionelle Märkte sowie System-on-a-Chip-Einheiten (SoCs) für mobile Computer- und Automobilmärkte.",
  },
  {
    id: 2,
    name: "Tesla",
    image: "/tesla-logo.png",
    added: "2025-09-15",
    removed: false,
    isin: "US88160R1014",
    description:
      "Tesla, Inc. ist ein amerikanisches Elektrofahrzeug- und Clean-Energy-Unternehmen mit Sitz in Austin, Texas. Tesla entwirft und fertigt Elektrofahrzeuge, Energiespeichersysteme, Solarmodule und verwandte Produkte und Dienstleistungen.",
  },
  {
    id: 3,
    name: "Apple",
    image: "/apple-logo.png",
    added: "2025-09-04",
    removed: false,
    isin: "US0378331005",
    description:
      "Apple Inc. ist ein amerikanisches multinationales Technologieunternehmen mit Hauptsitz in Cupertino, Kalifornien. Apple entwirft, entwickelt und verkauft Unterhaltungselektronik, Computersoftware und Online-Dienste.",
  },
  {
    id: 4,
    name: "Microsoft",
    image: "/microsoft-logo.png",
    added: "2025-09-01",
    removed: true,
    isin: "US5949181045",
    description:
      "Microsoft Corporation ist ein amerikanisches multinationales Technologieunternehmen mit Hauptsitz in Redmond, Washington. Microsoft entwickelt, fertigt, lizenziert, unterstützt und verkauft Computersoftware, Unterhaltungselektronik und Personal Computer.",
  },
  {
    id: 5,
    name: "Amazon",
    image: "/amazon-logo.png",
    added: "2025-09-01",
    removed: false,
    isin: "US0231351067",
    description:
      "Amazon.com, Inc. ist ein amerikanisches multinationales Technologieunternehmen mit Fokus auf E-Commerce, Cloud Computing, digitales Streaming und künstliche Intelligenz.",
  },
  {
    id: 6,
    name: "Google",
    image: "/google-logo.png",
    added: "2025-08-21",
    removed: false,
    isin: "US64110L1061",
    description:
      "Alphabet Inc. ist ein amerikanisches multinationales Technologie-Konglomerat-Holdinggesellschaft mit Hauptsitz in Mountain View, Kalifornien. Es wurde durch eine Umstrukturierung von Google am 2. Oktober 2015 gegründet.",
  },
  {
    id: 7,
    name: "Meta",
    image: "/meta-logo-abstract.png",
    added: "2025-08-15",
    removed: true,
    isin: "US30303M1027",
    description:
      "Meta Platforms, Inc., ehemals Facebook, Inc., ist ein amerikanisches multinationales Technologie-Konglomerat mit Sitz in Menlo Park, Kalifornien. Das Unternehmen besitzt und betreibt Facebook, Instagram, Threads und WhatsApp.",
  },
  {
    id: 8,
    name: "Netflix",
    image: "/netflix-inspired-logo.png",
    added: "2025-08-10",
    removed: true,
    isin: "US79466L3024",
    description:
      "Netflix, Inc. ist ein amerikanisches Mediendienstleistungsunternehmen und Produktionsunternehmen mit Hauptsitz in Los Gatos, Kalifornien. Netflix wurde 1997 von Reed Hastings und Marc Randolph in Scotts Valley, Kalifornien, gegründet.",
  },
  {
    id: 9,
    name: "Adobe",
    image: "/adobe-logo.png",
    added: "2025-08-05",
    removed: true,
    isin: "US00724F1012",
    description:
      "Adobe Inc., ursprünglich Adobe Systems Incorporated, ist ein amerikanisches multinationales Computersoftwareunternehmen mit Sitz in San Jose, Kalifornien.",
  },
  {
    id: 10,
    name: "Salesforce",
    image: "/salesforce-logo.png",
    added: "2025-08-05",
    removed: true,
    isin: "US79466L3024",
    description:
      "Salesforce, Inc. ist ein amerikanisches Cloud-basiertes Softwareunternehmen mit Hauptsitz in San Francisco, Kalifornien. Es bietet Customer-Relationship-Management-Software und Anwendungen mit Fokus auf Vertrieb, Kundenservice, Marketing-Automatisierung, E-Commerce, Analytik und Anwendungsentwicklung.",
  },
]

export default function AktiePage({ params }: PageProps) {
  const aktie = emotes.find((emote) => emote.id === Number.parseInt(params.id))
  const [voteCount, setVoteCount] = useState(1)
  const [hasVoted, setHasVoted] = useState(false)

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
