import { Card } from "@/components/ui/card"
import Link from "next/link"

interface Emote {
  id: number
  name: string
  image: string
  added: string
  removed: boolean
}

interface EmoteCardProps {
  emote: Emote
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
            <img src={emote.image || "/placeholder.svg"} alt={emote.name} className="w-full h-full object-cover" />
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
