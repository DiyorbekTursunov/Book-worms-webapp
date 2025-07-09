"use client"

import { useEffect, useState } from "react"
import AdminPanel from "@/components/admin-panel"
import TelegramScript from "@/components/telegram-script"
import Loading from "@/components/loading"

export default function Home() {
  const [isTelegramLoaded, setIsTelegramLoaded] = useState(false)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    // Check if Telegram WebApp is already available
    if (typeof window !== "undefined" && window.Telegram?.WebApp) {
      setIsTelegramLoaded(true)
      setIsLoading(false)
    }

    // Set a timeout to show the app even if Telegram doesn't load
    const timeout = setTimeout(() => {
      setIsLoading(false)
    }, 3000)

    return () => clearTimeout(timeout)
  }, [])

  const handleTelegramLoad = () => {
    setIsTelegramLoaded(true)
    setIsLoading(false)
  }

  if (isLoading) {
    return <Loading />
  }

  return (
    <>
      <TelegramScript onLoad={handleTelegramLoad} />
      {isTelegramLoaded ? (
        <AdminPanel />
      ) : (
        <div className="flex items-center justify-center min-h-screen bg-gray-100">
          <div className="text-center p-8">
            <h1 className="text-2xl font-bold mb-4">Book Worms Admin Panel</h1>
            <p className="text-gray-600 mb-4">
              Bu admin panel Telegram Web App sifatida ishlatish uchun mo'ljallangan.
            </p>
            <p className="text-sm text-gray-500">
              Agar siz buni brauzerda ko'rayotgan bo'lsangiz, Telegram bot orqali kirish kerak.
            </p>
          </div>
        </div>
      )}
    </>
  )
}
