import { Card } from "@/components/ui/card"
import Link from "next/link"
import { useState } from "react"

interface Emote {
  id: number
  name: string
  isin: string
  image: string
  added: string
  removed: boolean
}

interface EmoteCardProps {
  emote: Emote
}

function LogoImage({ isin, name, className }: { isin: string; name: string; className?: string }) {
  const [imageError, setImageError] = useState(false)
  const [imageLoaded, setImageLoaded] = useState(false)

  const logoUrl = `https://assets.extraetf.com/investment-icon/${isin}`

  if (imageError) {
    return (
      <img
        src="/placeholder-stocks.png"
        alt={`${name} Logo`}
        className={className}
        onLoad={() => setImageLoaded(true)}
      />
    )
  }

  return (
    <>
      <img
        src={logoUrl}
        alt={`${name} Logo`}
        className={className}
        onLoad={() => setImageLoaded(true)}
        onError={() => setImageError(true)}
        style={{ display: imageLoaded ? 'block' : 'none' }}
      />
      {!imageLoaded && !imageError && (
        <img
          src="/placeholder-stocks.png"
          alt={`${name} Logo`}
          className={className}
          style={{ display: 'block' }}
        />
      )}
    </>
  )
}

export function EmoteCard({ emote }: EmoteCardProps) {
  return (
    <Link href={`/aktie/${emote.id}`}>
      <Card
        className={`p-4 hover:bg-accent/50 transition-colors cursor-pointer relative ${
          emote.removed ? "opacity-60" : ""
        }`}
      >
        <div className={`flex items-center gap-3 ${emote.removed ? "grayscale" : ""}`}>
          <div className="w-14 h-14 bg-muted rounded-lg flex items-center justify-center overflow-hidden">
            <LogoImage
              isin={emote.isin}
              name={emote.name}
              className="w-full h-full object-cover"
            />
          </div>
          <div className="flex-1 min-w-0">
            <h3 className="font-medium truncate">{emote.name}</h3>
            <p className="text-sm text-muted-foreground">Added: {emote.added}</p>
          </div>
        </div>
        {emote.removed && (
          <div className="absolute top-2 right-2">
            <div className="text-red-500 font-bold text-xs transform -rotate-12 filter-none">ENTFERNT</div>
          </div>
        )}
      </Card>
    </Link>
  )
}
