import type React from "react"
import type { Metadata } from "next"
import { Suspense } from "react"
import "./globals.css"

// Trigger redeployment - Cloudflare Pages optimization
export const metadata: Metadata = {
  title: "Republic Database",
  description: "Datenbank aller Aktien und ETFs auf TR",
  generator: "v0.app",
  icons: {
    icon: "/favicon.ico",
  },
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="de" className="dark">
      <body className="font-sans antialiased">
        <Suspense fallback={null}>{children}</Suspense>
      </body>
    </html>
  )
}
