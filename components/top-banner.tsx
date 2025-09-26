import { Button } from "@/components/ui/button"
import { ExternalLink } from "lucide-react"

export function TopBanner() {
  return (
    <div className="bg-primary text-primary-foreground px-4 py-3 flex items-center justify-between">
      <div className="flex items-center gap-2">
        <span className="text-sm">
          Click here to join Discord to ask the community questions and get notified about new badges and emotes!
        </span>
        <ExternalLink className="w-4 h-4" />
      </div>
      <div className="flex items-center gap-4">
        <span className="text-sm font-medium">24/7 Stream</span>
        <Button variant="secondary" size="sm">
          Subscribe
        </Button>
      </div>
    </div>
  )
}
