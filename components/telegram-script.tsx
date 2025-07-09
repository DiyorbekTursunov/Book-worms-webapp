"use client"

import { useEffect } from "react"

interface TelegramScriptProps {
  onLoad: () => void
}

export default function TelegramScript({ onLoad }: TelegramScriptProps) {
  useEffect(() => {
    // Skip if script is already loaded
    if (typeof window !== "undefined" && window.Telegram?.WebApp) {
      onLoad()
      return
    }

    const script = document.createElement("script")
    script.src = "https://telegram.org/js/telegram-web-app.js"
    script.async = true
    script.onload = onLoad

    document.head.appendChild(script)

    return () => {
      document.head.removeChild(script)
    }
  }, [onLoad])

  return null
}
