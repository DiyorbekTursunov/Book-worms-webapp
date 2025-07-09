"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Badge } from "@/components/ui/badge"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog"
import { toast } from "sonner"
import { Plus, Edit, Trash2, Calendar } from 'lucide-react'
import { API_BASE_URL } from "@/lib/config"

interface Task {
  id: number
  description: string
  scheduledDate: string
  createdAt: string
}

export default function TasksPage() {
  const [tasks, setTasks] = useState<Task[]>([])
  const [loading, setLoading] = useState(true)
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [editingTask, setEditingTask] = useState<Task | null>(null)
  const [formData, setFormData] = useState({
    description: "",
    scheduledDate: "",
  })

  useEffect(() => {
    fetchTasks()
  }, [])

  const fetchTasks = async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/api/tasks`)
      const data = await response.json()
      setTasks(data)
    } catch {
      toast.error("Vazifalarni yuklashda xatolik")
    } finally {
      setLoading(false)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    try {
      const url = editingTask ? `${API_BASE_URL}/api/tasks/${editingTask.id}` : `${API_BASE_URL}/api/tasks`
      const method = editingTask ? "PUT" : "POST"

      const response = await fetch(url, {
        method,
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      })

      if (response.ok) {
        toast.success(editingTask ? "Vazifa muvaffaqiyatli yangilandi" : "Vazifa muvaffaqiyatli yaratildi")
        fetchTasks()
        resetForm()
      } else {
        const error = await response.json()
        toast.error(error.error || "Vazifani saqlashda xatolik")
      }
    } catch {
      toast.error("Vazifani saqlashda xatolik")
    }
  }

  const handleDelete = async (id: number) => {
    try {
      const response = await fetch(`${API_BASE_URL}/api/tasks/${id}`, {
        method: "DELETE",
      })

      if (response.ok) {
        toast.success("Vazifa muvaffaqiyatli o'chirildi")
        fetchTasks()
      } else {
        toast.error("Vazifani o'chirishda xatolik")
      }
    } catch {
      toast.error("Vazifani o'chirishda xatolik")
    }
  }

  const resetForm = () => {
    setFormData({ description: "", scheduledDate: "" })
    setEditingTask(null)
    setIsDialogOpen(false)
  }

  const openEditDialog = (task: Task) => {
    setEditingTask(task)
    setFormData({
      description: task.description,
      scheduledDate: new Date(task.scheduledDate).toISOString().split("T")[0],
    })
    setIsDialogOpen(true)
  }

  const openCreateDialog = () => {
    resetForm()
    setIsDialogOpen(true)
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-16 w-16 md:h-32 md:w-32 border-b-2 border-gray-900"></div>
      </div>
    )
  }

  return (
    <div className="container mx-auto p-3 md:p-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6 md:mb-8">
        <div>
          <h1 className="text-2xl md:text-3xl font-bold text-gray-900">Vazifalar Boshqaruvi</h1>
          <p className="text-sm md:text-base text-gray-600 mt-1 md:mt-2">Rejalashtirilgan vazifalarni boshqarish</p>
        </div>
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button onClick={openCreateDialog} className="w-full sm:w-auto">
              <Plus className="h-4 w-4 mr-2" />
              Vazifa Qo'shish
            </Button>
          </DialogTrigger>
          <DialogContent className="w-[95vw] max-w-md mx-auto">
            <DialogHeader>
              <DialogTitle className="text-lg md:text-xl">{editingTask ? "Vazifani Tahrirlash" : "Yangi Vazifa Yaratish"}</DialogTitle>
              <DialogDescription className="text-sm">
                {editingTask ? "Vazifa ma'lumotlarini yangilang." : "Yangi vazifa yaratish uchun ma'lumotlarni to'ldiring."}
              </DialogDescription>
            </DialogHeader>
            <form onSubmit={handleSubmit}>
              <div className="grid gap-4 py-4">
                <div className="grid gap-2">
                  <Label htmlFor="description" className="text-sm font-medium">
                    Tavsif
                  </Label>
                  <Textarea
                    id="description"
                    value={formData.description}
                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                    placeholder="Vazifa tavsifini kiriting"
                    required
                    className="min-h-[80px] text-sm"
                  />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="scheduledDate" className="text-sm font-medium">
                    Rejalashtirilgan Sana
                  </Label>
                  <Input
                    id="scheduledDate"
                    type="date"
                    value={formData.scheduledDate}
                    onChange={(e) => setFormData({ ...formData, scheduledDate: e.target.value })}
                    required
                    className="text-sm"
                  />
                </div>
              </div>
              <DialogFooter className="flex flex-col sm:flex-row gap-2">
                <Button type="button" variant="outline" onClick={resetForm} className="w-full sm:w-auto bg-transparent">
                  Bekor qilish
                </Button>
                <Button type="submit" className="w-full sm:w-auto">
                  {editingTask ? "Vazifani Yangilash" : "Vazifa Yaratish"}
                </Button>
              </DialogFooter>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      <Card>
        <CardHeader className="px-3 md:px-6 py-3 md:py-6">
          <CardTitle className="text-base md:text-lg">Barcha Vazifalar</CardTitle>
          <CardDescription className="text-sm">Jami: {tasks.length} ta vazifa</CardDescription>
        </CardHeader>
        <CardContent className="px-3 md:px-6 pb-3 md:pb-6">
          <div className="space-y-3 md:space-y-4">
            {tasks.length === 0 ? (
              <div className="text-center py-8">
                <Calendar className="h-8 w-8 md:h-12 md:w-12 text-gray-400 mx-auto mb-4" />
                <p className="text-gray-500 text-sm md:text-base">Vazifalar topilmadi. Birinchi vazifangizni yarating!</p>
              </div>
            ) : (
              tasks.map((task) => {
                const isUpcoming = new Date(task.scheduledDate) > new Date()

                return (
                  <div
                    key={task.id}
                    className="flex flex-col sm:flex-row sm:items-center justify-between p-3 md:p-4 border rounded-lg hover:bg-gray-50 gap-3"
                  >
                    <div className="flex-1 min-w-0">
                      <h3 className="font-medium text-sm md:text-base text-gray-900 mb-1">{task.description}</h3>
                      <div className="flex flex-col sm:flex-row sm:items-center gap-1 sm:gap-4 text-xs md:text-sm text-gray-500">
                        <span>Rejalashtirilgan: {new Date(task.scheduledDate).toLocaleDateString('uz-UZ')}</span>
                        <span>Yaratilgan: {new Date(task.createdAt).toLocaleDateString('uz-UZ')}</span>
                      </div>
                    </div>
                    <div className="flex items-center gap-2 self-start sm:self-center">
                      <Badge variant={isUpcoming ? "default" : "secondary"} className="text-xs">
                        {isUpcoming ? "Kelayotgan" : "O'tgan"}
                      </Badge>
                      <Button variant="outline" size="sm" onClick={() => openEditDialog(task)}>
                        <Edit className="h-3 w-3 md:h-4 md:w-4" />
                      </Button>
                      {/* <AlertDialog>
                        <AlertDialogTrigger asChild>
                          <Button variant="outline" size="sm">
                            <Trash2 className="h-3 w-3 md:h-4 md:w-4" />
                          </Button>
                        </AlertDialogTrigger>
                        <AlertDialogContent className="w-[95vw] max-w-md mx-auto">
                          <AlertDialogHeader>
                            <AlertDialogTitle className="text-lg">Ishonchingiz komilmi?</AlertDialogTitle>
                            <AlertDialogDescription className="text-sm">
                              Bu amalni bekor qilib bo'lmaydi. Bu vazifani butunlay o'chiradi.
                            </AlertDialogDescription>
                          </AlertDialogHeader>
                          <AlertDialogFooter className="flex flex-col sm:flex-row gap-2">
                            <AlertDialogCancel className="w-full sm:w-auto">Bekor qilish</AlertDialogCancel>
                            <AlertDialogAction onClick={() => handleDelete(task.id)} className="w-full sm:w-auto">
                              O'chirish
                            </AlertDialogAction>
                          </AlertDialogFooter>
                        </AlertDialogContent>
                      </AlertDialog> */}
                    </div>
                  </div>
                )
              })
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
