import { Sidebar } from "@/components/sidebar"
import { EmoteGrid } from "@/components/emote-grid"
import { FinanceSidebar } from "@/components/finance-sidebar"

export default function HomePage() {
  return (
    <div className="min-h-screen bg-background text-foreground">
      <div className="flex">
        <Sidebar />
        <main className="flex-1 p-6">
          <div className="max-w-6xl mx-auto">
            <div className="mb-6">
              <h1 className="text-3xl font-bold mb-2">TradeRepublic Aktien</h1>
              <p className="text-muted-foreground">
                Liste aller hinzugefügten und entfernten TradeRepublic Aktien. Klicke Sie um mehr zu erfahren!
              </p>
            </div>
            <EmoteGrid />
            <footer className="mt-12 pt-8 border-t border-border text-center">
              <p className="text-sm text-muted-foreground">Made with ❤️ by Maximilian Freitag</p>
            </footer>
          </div>
        </main>
        <FinanceSidebar />
      </div>
    </div>
  )
}
