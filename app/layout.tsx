import type React from "react"
import type { Metadata } from "next"
import { Suspense } from "react"
import "./globals.css"

// Trigger redeployment - Cloudflare Pages optimization
export const metadata: Metadata = {
  title: "Republic Database",
  description: "Database aller deutschen Aktien und Finanzinstrumente",
  generator: "v0.app",
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
