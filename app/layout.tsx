import type React from "react"
import "./globals.css"
import type { Metadata } from "next"
import { ErrorBoundary } from "@/components/error-boundary"

export const metadata: Metadata = {
  title: "Book Worms Admin Paneli",
  description: "Book Worms loyihasi uchun admin paneli",
  viewport: "width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no",
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="uz">
      <body>
        <ErrorBoundary>{children}</ErrorBoundary>
      </body>
    </html>
  )
}
