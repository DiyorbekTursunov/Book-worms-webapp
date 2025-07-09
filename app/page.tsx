"use client"

import { useEffect, useState } from "react"
import AdminPanel from "@/components/admin-panel"
import TelegramScript from "@/components/telegram-script"

export default function Home() {
  const [isTelegramLoaded, setIsTelegramLoaded] = useState(false)

  useEffect(() => {
    // Check if Telegram WebApp is already available
    if (typeof window !== "undefined" && window.Telegram?.WebApp) {
      setIsTelegramLoaded(true)
    }
  }, [])

  return (
    <>
      <TelegramScript onLoad={() => setIsTelegramLoaded(true)} />
      {isTelegramLoaded ? (
        <AdminPanel />
      ) : (
        <div className="flex items-center justify-center min-h-screen">
          <p className="text-lg">Telegram Web App yuklanmoqda...</p>
        </div>
      )}
    </>
  )
}
