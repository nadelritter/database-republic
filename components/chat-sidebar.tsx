import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Send, Settings, MessageCircle } from "lucide-react"

export function ChatSidebar() {
  return (
    <div className="w-80 bg-card border-l border-border flex flex-col h-screen">
      <div className="p-4 border-b border-border">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h3 className="font-semibold">
              <span className="text-primary">StreamDatabase</span> ist offline.
            </h3>
            <p className="text-sm text-muted-foreground">Mehr erfährst du auf dem Kanal dieses Streamers!</p>
          </div>
          <div className="flex gap-2">
            <Button variant="ghost" size="sm">
              <Settings className="w-4 h-4" />
            </Button>
            <Button variant="ghost" size="sm">
              <svg className="w-4 h-4" viewBox="0 0 24 24" fill="currentColor">
                <path d="M5.503 4.627 5.5 6.75v10.504a3.25 3.25 0 0 0 3.25 3.25h8.616a2.251 2.251 0 0 1-2.122 1.5H8.75A4.75 4.75 0 0 1 4 17.254V6.75c0-.98.627-1.815 1.503-2.123ZM17.75 2A2.25 2.25 0 0 1 20 4.25v13a2.25 2.25 0 0 1-2.25 2.25h-9A2.25 2.25 0 0 1 6.5 17.25v-13A2.25 2.25 0 0 1 8.75 2h9Z" />
              </svg>
            </Button>
          </div>
        </div>
        <Button variant="outline" className="w-full bg-transparent">
          <span className="mr-2">▶</span>
          StreamDatabase besuchen
        </Button>
      </div>

      <div className="flex-1 p-4">
        <div className="mb-4">
          <h4 className="font-medium mb-2">Stream-Chat</h4>
          <div className="flex items-center gap-2 text-sm text-muted-foreground mb-4">
            <span className="flex items-center gap-1">
              <span className="w-2 h-2 bg-blue-500 rounded-full"></span>
              13
            </span>
            <span className="flex items-center gap-1">
              <span className="w-2 h-2 bg-green-500 rounded-full"></span>
              Er... 10
            </span>
            <span className="flex items-center gap-1">
              <span className="w-2 h-2 bg-orange-500 rounded-full"></span>
              str8jecketj... 10
            </span>
          </div>
        </div>

        <div className="space-y-3 mb-4">
          <div className="text-sm">
            <span className="text-green-400 mr-2">✓ Angeheftet von</span>
            <span className="text-blue-400">Ravenbhv</span>
          </div>
          <div className="text-sm">
            <strong>Why the channel is offline:</strong> http...
          </div>
          <div className="text-sm text-muted-foreground">Willkommen im Chat!</div>
        </div>
      </div>

      <div className="p-4 border-t border-border">
        <div className="flex gap-2">
          <Input placeholder="Eine Nachricht senden" className="flex-1" />
          <Button size="sm">
            <Send className="w-4 h-4" />
          </Button>
        </div>
        <div className="flex items-center justify-between mt-2 text-sm text-muted-foreground">
          <div className="flex items-center gap-2">
            <span>0</span>
            <MessageCircle className="w-4 h-4" />
            <span>0</span>
          </div>
          <div className="flex gap-2">
            <Button variant="ghost" size="sm">
              <Settings className="w-4 h-4" />
            </Button>
            <Button variant="ghost" size="sm" className="bg-primary text-primary-foreground">
              Chat
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
}
