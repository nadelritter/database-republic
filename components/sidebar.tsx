import { Home, FileText, Scale } from "lucide-react"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import Image from "next/image"

const navigationItems = [{ icon: Home, label: "Trade Republic", active: true, href: "/" }]

const legalItems = [
  { icon: FileText, label: "Privacy Policy", active: false, href: "/privacy-policy" },
  { icon: Scale, label: "Terms of Service", active: false, href: "/terms-of-service" },
]

export function Sidebar() {
  return (
    <div className="w-52 bg-sidebar border-r border-sidebar-border p-4 h-screen overflow-y-auto flex flex-col">
      <div className="flex items-center gap-3 mb-8">
        <div className="w-12 h-12 flex items-center justify-center flex-shrink-0">
          <Image src="/database-logo.webp" alt="Database Logo" width={48} height={48} className="w-12 h-12 rounded-full" />
        </div>
        <div className="text-left">
          <div className="font-bold text-sm leading-tight">REPUBLIC</div>
          <div className="font-bold text-sm leading-tight">DATABASE</div>
        </div>
      </div>

      <nav className="space-y-6 flex-1">
        <div>
          <h3 className="text-sm font-semibold text-muted-foreground mb-3 uppercase tracking-wider">NEOBROKER</h3>
          {navigationItems.map((item) => (
            <Link key={item.label} href={item.href}>
              <Button variant={item.active ? "secondary" : "ghost"} className="w-full justify-start mb-1">
                <item.icon className="w-4 h-4 mr-3" />
                {item.label}
              </Button>
            </Link>
          ))}
        </div>
      </nav>

      <div className="mt-auto pt-4 border-t border-sidebar-border">
        <h3 className="text-sm font-semibold text-muted-foreground mb-3 uppercase tracking-wider">LEGAL</h3>
        {legalItems.map((item) => (
          <Link key={item.label} href={item.href}>
            <Button variant="ghost" className="w-full justify-start mb-1">
              <item.icon className="w-4 h-4 mr-3" />
              {item.label}
            </Button>
          </Link>
        ))}
      </div>
    </div>
  )
}
