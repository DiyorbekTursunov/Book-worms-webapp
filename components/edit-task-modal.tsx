"use client"

import type React from "react"

import { useState, useEffect } from "react"
import type { Task } from "./admin-panel"

interface EditTaskModalProps {
  isOpen: boolean
  task: Task
  onClose: () => void
  onSave: (taskId: number, date: string, description: string) => Promise<boolean>
}

export default function EditTaskModal({ isOpen, task, onClose, onSave }: EditTaskModalProps) {
  const [date, setDate] = useState("")
  const [description, setDescription] = useState("")

  useEffect(() => {
    if (task) {
      setDate(task.scheduledDate.split("T")[0])
      setDescription(task.description)
    }

    setMinDate()
  }, [task])

  const setMinDate = () => {
    const today = new Date()
    const tomorrow = new Date(today)
    tomorrow.setDate(today.getDate() + 1)
    const minDate = tomorrow.toISOString().split("T")[0]

    const dateInput = document.getElementById("edit-task-date") as HTMLInputElement
    if (dateInput) {
      dateInput.setAttribute("min", minDate)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!date || !description) return

    await onSave(task.id, date, description)
  }

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 bg-gray-600 bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-[var(--tg-theme-bg-color)] p-6 rounded-lg shadow-lg w-full max-w-md">
        <h2 className="text-lg font-semibold mb-4 text-[var(--tg-theme-section-header-text-color)]">
          Vazifani Tahrirlash
        </h2>
        <form id="edit-task-form" className="space-y-4" onSubmit={handleSubmit}>
          <input
            type="date"
            id="edit-task-date"
            className="w-full p-2 border rounded bg-[var(--tg-theme-bg-color)] text-[var(--tg-theme-text-color)]"
            required
            aria-label="Tahrirlash sanasi"
            value={date}
            onChange={(e) => setDate(e.target.value)}
          />
          <input
            type="text"
            id="edit-task-description"
            placeholder="Vazifa tavsifi"
            className="w-full p-2 border rounded bg-[var(--tg-theme-bg-color)] text-[var(--tg-theme-text-color)]"
            required
            aria-label="Tahrirlash tavsifi"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
          />
          <div className="flex justify-end space-x-2">
            <button
              type="button"
              id="cancel-edit"
              className="bg-[var(--tg-theme-button-color)] text-[var(--tg-theme-button-text-color)] px-4 py-2 rounded hover:opacity-90"
              onClick={onClose}
            >
              Bekor qilish
            </button>
            <button
              type="submit"
              id="save-edit"
              className="bg-[var(--tg-theme-button-color)] text-[var(--tg-theme-button-text-color)] px-4 py-2 rounded hover:opacity-90"
            >
              Saqlash
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
