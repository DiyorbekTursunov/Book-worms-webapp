"use client"

import { useState, useEffect, useCallback } from "react"
import type { TelegramWebApp } from "@/lib/telegram"

interface AddTaskFormProps {
  onAddTask: (date: string, description: string) => Promise<boolean>
  tg: TelegramWebApp | null
}

export default function AddTaskForm({ onAddTask, tg }: AddTaskFormProps) {
  const [date, setDate] = useState("")
  const [description, setDescription] = useState("")

  const handleSubmit = useCallback(async () => {
    if (!date || !description) return

    const success = await onAddTask(date, description)
    if (success) {
      setDate("")
      setDescription("")
    }
  }, [date, description, onAddTask])

  useEffect(() => {
    const setMinDate = () => {
      const today = new Date()
      const tomorrow = new Date(today)
      tomorrow.setDate(today.getDate() + 1)
      const minDate = tomorrow.toISOString().split("T")[0]

      const dateInput = document.getElementById("task-date") as HTMLInputElement
      if (dateInput) {
        dateInput.setAttribute("min", minDate)
      }
    }

    setMinDate()

    if (tg) {
      tg.MainButton.onClick(handleSubmit)
    }
  }, [tg, handleSubmit])

  return (
    <div className="bg-[var(--tg-theme-section-bg-color)] shadow rounded-lg p-4 mb-6">
      <h2 className="text-lg font-semibold mb-4 text-[var(--tg-theme-section-header-text-color)]">
        Yangi Vazifa Qo'shish
      </h2>
      <form id="add-task-form" className="space-y-4" onSubmit={(e) => e.preventDefault()}>
        <input
          type="date"
          id="task-date"
          className="w-full p-2 border rounded bg-[var(--tg-theme-bg-color)] text-[var(--tg-theme-text-color)]"
          required
          aria-label="Vazifa sanasi"
          value={date}
          onChange={(e) => setDate(e.target.value)}
        />
        <input
          type="text"
          id="task-description"
          placeholder="Vazifa tavsifi"
          className="w-full p-2 border rounded bg-[var(--tg-theme-bg-color)] text-[var(--tg-theme-text-color)]"
          required
          aria-label="Vazifa tavsifi"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
        />
      </form>
    </div>
  )
}
