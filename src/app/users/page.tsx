"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
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
import { Users, CheckCircle, XCircle, DollarSign, Trash2 } from "lucide-react"
import { API_BASE_URL } from "@/lib/config"

interface Task {
  id: number
  description: string
  scheduledDate: string
}

interface TaskCompletion {
  id: number
  completed: boolean
  penaltyPaid: boolean
  task: Task
}

interface User {
  id: number
  username: string
  tasks: TaskCompletion[]
}

export default function UsersPage() {
  const [users, setUsers] = useState<User[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchUsers()
  }, [])

  const fetchUsers = async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/api/users`)
      const data = await response.json()
      setUsers(data)
    } catch {
      toast.error("Foydalanuvchilarni yuklashda xatolik")
    } finally {
      setLoading(false)
    }
  }

  const handleMarkPayment = async (userId: number) => {
    try {
      const response = await fetch(`${API_BASE_URL}/api/users/${userId}/mark-payment`, {
        method: "POST",
      })

      if (response.ok) {
        toast.success("To'lov muvaffaqiyatli belgilandi")
        fetchUsers()
      } else {
        toast.error("To'lovni belgilashda xatolik")
      }
    } catch {
      toast.error("To'lovni belgilashda xatolik")
    }
  }

  const handleDeleteUser = async (userId: number) => {
    try {
      const response = await fetch(`${API_BASE_URL}/api/users/${userId}`, {
        method: "DELETE",
      })

      if (response.ok) {
        toast.success("Foydalanuvchi muvaffaqiyatli o'chirildi")
        fetchUsers()
      } else {
        toast.error("Foydalanuvchini o'chirishda xatolik")
      }
    } catch {
      toast.error("Foydalanuvchini o'chirishda xatolik")
    }
  }

  const getUserStats = (user: User) => {
    const completedTasks = user.tasks.filter((task) => task.completed).length
    const pendingPayments = user.tasks.filter((task) => !task.completed && !task.penaltyPaid).length
    const totalTasks = user.tasks.length

    return { completedTasks, pendingPayments, totalTasks }
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
      <div className="mb-6 md:mb-8">
        <h1 className="text-2xl md:text-3xl font-bold text-gray-900">Foydalanuvchilar Boshqaruvi</h1>
        <p className="text-sm md:text-base text-gray-600 mt-1 md:mt-2">
          Foydalanuvchilar va ularning vazifa bajarish holatini boshqarish
        </p>
      </div>

      <div className="grid gap-4 md:gap-6">
        {users.length === 0 ? (
          <Card>
            <CardContent className="text-center py-8">
              <Users className="h-8 w-8 md:h-12 md:w-12 text-gray-400 mx-auto mb-4" />
              <p className="text-gray-500 text-sm md:text-base">Foydalanuvchilar topilmadi.</p>
            </CardContent>
          </Card>
        ) : (
          users.map((user) => {
            const { completedTasks, pendingPayments, totalTasks } = getUserStats(user)

            return (
              <Card key={user.id}>
                <CardHeader className="px-3 md:px-6 py-3 md:py-6">
                  <div className="flex flex-col sm:flex-row justify-between items-start gap-3">
                    <div className="min-w-0 flex-1">
                      <CardTitle className="flex items-center gap-2 text-base md:text-lg">
                        <Users className="h-4 w-4 md:h-5 md:w-5 flex-shrink-0" />
                        <span className="truncate">{user.username}</span>
                      </CardTitle>
                      <CardDescription className="text-sm">Foydalanuvchi ID: {user.id}</CardDescription>
                    </div>
                    <div className="flex flex-col sm:flex-row gap-2 w-full sm:w-auto">
                      {pendingPayments > 0 && (
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleMarkPayment(user.id)}
                          className="w-full sm:w-auto text-xs"
                        >
                          <DollarSign className="h-3 w-3 md:h-4 md:w-4 mr-1 md:mr-2" />
                          To'lovni Belgilash
                        </Button>
                      )}
                      <AlertDialog>
                        <AlertDialogTrigger asChild>
                          <Button variant="outline" size="sm" className="w-full sm:w-auto bg-transparent">
                            <Trash2 className="h-3 w-3 md:h-4 md:w-4" />
                          </Button>
                        </AlertDialogTrigger>
                        <AlertDialogContent className="w-[95vw] max-w-md mx-auto">
                          <AlertDialogHeader>
                            <AlertDialogTitle className="text-lg">Foydalanuvchini O'chirish</AlertDialogTitle>
                            <AlertDialogDescription className="text-sm">
                              {user.username} foydalanuvchisini o'chirishni xohlaysizmi? Bu amalni bekor qilib
                              bo'lmaydi.
                            </AlertDialogDescription>
                          </AlertDialogHeader>
                          <AlertDialogFooter className="flex flex-col sm:flex-row gap-2">
                            <AlertDialogCancel className="w-full sm:w-auto">Bekor qilish</AlertDialogCancel>
                            <AlertDialogAction onClick={() => handleDeleteUser(user.id)} className="w-full sm:w-auto">
                              O'chirish
                            </AlertDialogAction>
                          </AlertDialogFooter>
                        </AlertDialogContent>
                      </AlertDialog>
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="px-3 md:px-6 pb-3 md:pb-6">
                  {/* User Stats - Mobile: Stack vertically, Desktop: 3 columns */}
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 md:gap-4 mb-4 md:mb-6">
                    <div className="flex items-center gap-2 p-2 md:p-3 bg-green-50 rounded-lg">
                      <CheckCircle className="h-4 w-4 md:h-5 md:w-5 text-green-600 flex-shrink-0" />
                      <div className="min-w-0">
                        <p className="text-xs md:text-sm text-green-600">Bajarilgan</p>
                        <p className="font-semibold text-sm md:text-base text-green-800">{completedTasks}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2 p-2 md:p-3 bg-red-50 rounded-lg">
                      <XCircle className="h-4 w-4 md:h-5 md:w-5 text-red-600 flex-shrink-0" />
                      <div className="min-w-0">
                        <p className="text-xs md:text-sm text-red-600">Kutilayotgan To'lovlar</p>
                        <p className="font-semibold text-sm md:text-base text-red-800">{pendingPayments}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2 p-2 md:p-3 bg-blue-50 rounded-lg">
                      <Users className="h-4 w-4 md:h-5 md:w-5 text-blue-600 flex-shrink-0" />
                      <div className="min-w-0">
                        <p className="text-xs md:text-sm text-blue-600">Jami Vazifalar</p>
                        <p className="font-semibold text-sm md:text-base text-blue-800">{totalTasks}</p>
                      </div>
                    </div>
                  </div>

                  {/* Task List */}
                  <div className="space-y-3">
                    <h4 className="font-medium text-sm md:text-base text-gray-900">Vazifalar Tarixi</h4>
                    {user.tasks.length === 0 ? (
                      <p className="text-gray-500 text-xs md:text-sm">Vazifalar tayinlanmagan</p>
                    ) : (
                      user.tasks.map((taskCompletion) => (
                        <div
                          key={taskCompletion.id}
                          className="flex flex-col sm:flex-row sm:items-center justify-between p-2 md:p-3 border rounded-lg gap-2"
                        >
                          <div className="flex-1 min-w-0">
                            <p className="font-medium text-sm md:text-base truncate">
                              {taskCompletion.task.description}
                            </p>
                            <p className="text-xs md:text-sm text-gray-500">
                              Rejalashtirilgan:{" "}
                              {new Date(taskCompletion.task.scheduledDate).toLocaleDateString("uz-UZ")}
                            </p>
                          </div>
                          <div className="flex flex-wrap gap-1 md:gap-2">
                            <Badge variant={taskCompletion.completed ? "default" : "secondary"} className="text-xs">
                              {taskCompletion.completed ? "Bajarilgan" : "Bajarilmagan"}
                            </Badge>
                            {!taskCompletion.completed && (
                              <Badge
                                variant={taskCompletion.penaltyPaid ? "default" : "destructive"}
                                className="text-xs"
                              >
                                {taskCompletion.penaltyPaid ? "To'langan" : "To'lanmagan"}
                              </Badge>
                            )}
                          </div>
                        </div>
                      ))
                    )}
                  </div>
                </CardContent>
              </Card>
            )
          })
        )}
      </div>
    </div>
  )
}
