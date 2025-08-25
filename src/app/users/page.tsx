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
import { Users, CheckCircle, XCircle, Trash2, TrendingUp } from "lucide-react"
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
  penaltyAppliedAt: string | null // Jarima qo'llanilgan vaqt
  task: Task
}

interface AppUser {
  id: number
  username: string
  tasks: TaskCompletion[]
}

export default function UsersPage() {
  const [users, setUsers] = useState<AppUser[]>([])
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

  const getUserStats = (user: AppUser) => {
    const completedTasks = user.tasks.filter((task) => task.completed).length
    const pendingPayments = user.tasks.filter(
      (task) => !task.completed && !task.penaltyPaid && task.penaltyAppliedAt !== null, // Faqat jarima qo'llanilgan tasklar
    ).length
    const totalTasks = user.tasks.length

    return { completedTasks, pendingPayments, totalTasks }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900"></div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50/50">
      <div className="sticky top-0 z-10 bg-white border-b border-gray-200 px-4 py-4 sm:px-6">
        <div className="max-w-7xl mx-auto">
          <h1 className="text-xl sm:text-2xl lg:text-3xl font-bold text-gray-900">Foydalanuvchilar</h1>
          <p className="text-sm sm:text-base text-gray-600 mt-1">Foydalanuvchilar va vazifa bajarish holati</p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-6 sm:px-6 lg:px-8">
        <div className="space-y-4 sm:space-y-6">
          {users.length === 0 ? (
            <Card className="shadow-sm">
              <CardContent className="text-center py-12">
                <Users className="h-16 w-16 text-gray-300 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-gray-900 mb-2">Foydalanuvchilar topilmadi</h3>
                <p className="text-gray-500 text-sm">Hozircha hech qanday foydalanuvchi yo&apos;q.</p>
              </CardContent>
            </Card>
          ) : (
            users.map((user) => {
              const { completedTasks, pendingPayments, totalTasks } = getUserStats(user)
              const completionRate = totalTasks > 0 ? Math.round((completedTasks / totalTasks) * 100) : 0

              return (
                <Card key={user.id} className="shadow-sm hover:shadow-md transition-shadow">
                  <CardHeader className="px-4 py-4 sm:px-6 sm:py-5 border-b border-gray-100">
                    <div className="flex flex-col sm:flex-row justify-between items-start gap-4">
                      <div className="flex items-start gap-3 min-w-0 flex-1">
                        <div className="p-2 bg-blue-50 rounded-lg shrink-0">
                          <Users className="h-5 w-5 text-blue-600" />
                        </div>
                        <div className="min-w-0 flex-1">
                          <CardTitle className="text-lg sm:text-xl font-semibold text-gray-900 truncate">
                            {user.username}
                          </CardTitle>
                          <CardDescription className="text-sm text-gray-600 mt-1">
                            ID: {user.id} • {totalTasks} ta vazifa
                          </CardDescription>
                          <div className="flex items-center gap-2 mt-2">
                            <div className="flex-1 bg-gray-200 rounded-full h-2 max-w-32">
                              <div
                                className="bg-blue-600 h-2 rounded-full transition-all duration-300"
                                style={{ width: `${completionRate}%` }}
                              />
                            </div>
                            <span className="text-xs text-gray-600 font-medium">{completionRate}%</span>
                          </div>
                        </div>
                      </div>
                      <div className="flex flex-row sm:flex-col gap-2 w-full sm:w-auto">
                        {(
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handleMarkPayment(user.id)}
                            className="flex-1 sm:flex-none text-xs hover:bg-green-50 hover:border-green-200"
                          >
                            <Users className="h-4 w-4 mr-1" />
                            To&apos;lov ({pendingPayments})
                          </Button>
                        )}
                        <AlertDialog>
                          <AlertDialogTrigger asChild>
                            <Button
                              variant="outline"
                              size="sm"
                              className="flex-1 sm:flex-none hover:bg-red-50 hover:border-red-200 bg-transparent"
                            >
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </AlertDialogTrigger>
                          <AlertDialogContent className="w-[95vw] max-w-md mx-auto">
                            <AlertDialogHeader>
                              <AlertDialogTitle className="text-lg">Foydalanuvchini o&apos;chirish</AlertDialogTitle>
                              <AlertDialogDescription className="text-sm text-gray-600">
                                {user.username} foydalanuvchisini o&apos;chirishni xohlaysizmi? Bu amalni bekor qilib
                                bo&apos;lmaydi.
                              </AlertDialogDescription>
                            </AlertDialogHeader>
                            <AlertDialogFooter className="flex flex-col-reverse sm:flex-row gap-2">
                              <AlertDialogCancel className="w-full sm:w-auto">Bekor qilish</AlertDialogCancel>
                              <AlertDialogAction
                                onClick={() => handleDeleteUser(user.id)}
                                className="w-full sm:w-auto bg-red-600 hover:bg-red-700"
                              >
                                O&apos;chirish
                              </AlertDialogAction>
                            </AlertDialogFooter>
                          </AlertDialogContent>
                        </AlertDialog>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent className="px-4 py-4 sm:px-6 sm:py-5">
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 mb-6">
                      <div className="flex items-center gap-3 p-3 bg-green-50 rounded-lg">
                        <div className="p-2 bg-green-100 rounded-lg">
                          <CheckCircle className="h-5 w-5 text-green-600" />
                        </div>
                        <div>
                          <p className="text-sm font-medium text-green-800">Bajarilgan</p>
                          <p className="text-xl font-bold text-green-900">{completedTasks}</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-3 p-3 bg-red-50 rounded-lg">
                        <div className="p-2 bg-red-100 rounded-lg">
                          <XCircle className="h-5 w-5 text-red-600" />
                        </div>
                        <div>
                          <p className="text-sm font-medium text-red-800">Kutilayotgan</p>
                          <p className="text-xl font-bold text-red-900">{pendingPayments}</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-3 p-3 bg-blue-50 rounded-lg">
                        <div className="p-2 bg-blue-100 rounded-lg">
                          <TrendingUp className="h-5 w-5 text-blue-600" />
                        </div>
                        <div>
                          <p className="text-sm font-medium text-blue-800">Jami</p>
                          <p className="text-xl font-bold text-blue-900">{totalTasks}</p>
                        </div>
                      </div>
                    </div>

                    <div className="space-y-3">
                      <h4 className="font-semibold text-base text-gray-900 flex items-center gap-2">
                        <Users className="h-4 w-4" />
                        Vazifalar Tarixi
                      </h4>
                      {user.tasks.length === 0 ? (
                        <div className="text-center py-6 bg-gray-50 rounded-lg">
                          <p className="text-gray-500 text-sm">Vazifalar tayinlanmagan</p>
                        </div>
                      ) : (
                        user.tasks.map((taskCompletion) => (
                          <div
                            key={taskCompletion.id}
                            className="bg-white border border-gray-200 rounded-lg p-4 hover:shadow-sm transition-shadow"
                          >
                            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                              <div className="flex-1 min-w-0">
                                <p className="font-medium text-sm sm:text-base text-gray-900 line-clamp-2 leading-relaxed">
                                  {taskCompletion.task.description}
                                </p>
                                <p className="text-xs sm:text-sm text-gray-500 mt-1">
                                  Rejalashtirilgan:{" "}
                                  {new Date(taskCompletion.task.scheduledDate).toLocaleDateString("uz-UZ")}
                                </p>
                              </div>
                              <div className="flex flex-wrap gap-2">
                                <Badge
                                  variant={taskCompletion.completed ? "default" : "secondary"}
                                  className={`text-xs ${taskCompletion.completed ? "bg-green-100 text-green-800" : "bg-gray-100 text-gray-600"}`}
                                >
                                  {taskCompletion.completed ? "Bajarilgan" : "Bajarilmagan"}
                                </Badge>
                                {!taskCompletion.completed && taskCompletion.penaltyAppliedAt && (
                                  <Badge
                                    variant={taskCompletion.penaltyPaid ? "default" : "destructive"}
                                    className={`text-xs ${taskCompletion.penaltyPaid ? "bg-blue-100 text-blue-800" : "bg-red-100 text-red-800"}`}
                                  >
                                    {taskCompletion.penaltyPaid ? "To'langan" : "To'lanmagan"}
                                  </Badge>
                                )}
                                {!taskCompletion.completed && !taskCompletion.penaltyAppliedAt && (
                                  <Badge variant="outline" className="text-xs border-orange-200 text-orange-600">
                                    Kutilmoqda
                                  </Badge>
                                )}
                              </div>
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
    </div>
  )
}
