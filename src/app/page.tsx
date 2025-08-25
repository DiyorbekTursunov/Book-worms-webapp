"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { CalendarDays, Users, CheckCircle, AlertCircle } from "lucide-react"
import { API_BASE_URL } from "@/lib/config"

interface Task {
  id: number
  description: string
  scheduledDate: string
  createdAt: string
}

interface TaskCompletion {
  id: number
  completed: boolean
  penaltyPaid: boolean
  penaltyAppliedAt: string | null // Jarima qo'llanilgan vaqt
  task: Task
}

interface User {
  id: number
  username: string
  tasks: TaskCompletion[]
}

export default function Dashboard() {
  const [tasks, setTasks] = useState<Task[]>([])
  const [users, setUsers] = useState<User[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchData()
  }, [])

  const fetchData = async () => {
    try {
      const [tasksRes, usersRes] = await Promise.all([
        fetch(`${API_BASE_URL}/api/tasks`),
        fetch(`${API_BASE_URL}/api/users`),
      ])

      const tasksData = await tasksRes.json()
      const usersData = await usersRes.json()

      setTasks(tasksData)
      setUsers(usersData)
    } catch (error) {
      console.error("Ma'lumotlarni yuklashda xatolik:", error)
    } finally {
      setLoading(false)
    }
  }

  const getUpcomingTasks = () => {
    const today = new Date()
    return tasks.filter((task) => new Date(task.scheduledDate) > today)
  }

  const getCompletedTasksCount = () => {
    return users.reduce((total, user) => {
      return total + user.tasks.filter((task) => task.completed).length
    }, 0)
  }

  const getPendingPayments = () => {
    return users.reduce((total, user) => {
      return (
        total +
        user.tasks.filter(
          (task) => !task.completed && !task.penaltyPaid && task.penaltyAppliedAt !== null, // Faqat jarima qo'llanilgan tasklar
        ).length
      )
    }, 0)
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
          <h1 className="text-xl sm:text-2xl lg:text-3xl font-bold text-gray-900">Admin Panel</h1>
          <p className="text-sm sm:text-base text-gray-600 mt-1">Vazifalar boshqaruv tizimi</p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-6 sm:px-6 lg:px-8">
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 lg:gap-6 mb-6">
          <Card className="hover:shadow-md transition-shadow">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-3 px-4 pt-4">
              <CardTitle className="text-xs sm:text-sm font-medium text-gray-600">Jami Vazifalar</CardTitle>
              <div className="p-2 bg-blue-50 rounded-lg">
                <CalendarDays className="h-4 w-4 text-blue-600" />
              </div>
            </CardHeader>
            <CardContent className="px-4 pb-4">
              <div className="text-2xl sm:text-3xl font-bold text-gray-900">{tasks.length}</div>
              <p className="text-xs sm:text-sm text-green-600 font-medium mt-1">
                +{getUpcomingTasks().length} kelayotgan
              </p>
            </CardContent>
          </Card>

          <Card className="hover:shadow-md transition-shadow">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-3 px-4 pt-4">
              <CardTitle className="text-xs sm:text-sm font-medium text-gray-600">Foydalanuvchilar</CardTitle>
              <div className="p-2 bg-green-50 rounded-lg">
                <Users className="h-4 w-4 text-green-600" />
              </div>
            </CardHeader>
            <CardContent className="px-4 pb-4">
              <div className="text-2xl sm:text-3xl font-bold text-gray-900">{users.length}</div>
              <p className="text-xs sm:text-sm text-gray-500 mt-1">Faol</p>
            </CardContent>
          </Card>

          <Card className="hover:shadow-md transition-shadow">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-3 px-4 pt-4">
              <CardTitle className="text-xs sm:text-sm font-medium text-gray-600">Bajarilgan</CardTitle>
              <div className="p-2 bg-emerald-50 rounded-lg">
                <CheckCircle className="h-4 w-4 text-emerald-600" />
              </div>
            </CardHeader>
            <CardContent className="px-4 pb-4">
              <div className="text-2xl sm:text-3xl font-bold text-gray-900">{getCompletedTasksCount()}</div>
              <p className="text-xs sm:text-sm text-emerald-600 font-medium mt-1">Muvaffaqiyatli</p>
            </CardContent>
          </Card>

          <Card className="hover:shadow-md transition-shadow">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-3 px-4 pt-4">
              <CardTitle className="text-xs sm:text-sm font-medium text-gray-600">Kutilayotgan</CardTitle>
              <div className="p-2 bg-orange-50 rounded-lg">
                <AlertCircle className="h-4 w-4 text-orange-600" />
              </div>
            </CardHeader>
            <CardContent className="px-4 pb-4">
              <div className="text-2xl sm:text-3xl font-bold text-gray-900">{getPendingPayments()}</div>
              <p className="text-xs sm:text-sm text-orange-600 font-medium mt-1">E'tibor kerak</p>
            </CardContent>
          </Card>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6">
          <Card className="shadow-sm">
            <CardHeader className="px-4 py-4 sm:px-6 sm:py-5 border-b border-gray-100">
              <CardTitle className="text-lg sm:text-xl font-semibold text-gray-900">So'nggi Vazifalar</CardTitle>
              <CardDescription className="text-sm text-gray-600">
                Eng so'nggi rejalashtirilgan vazifalar
              </CardDescription>
            </CardHeader>
            <CardContent className="px-4 py-4 sm:px-6 sm:py-5">
              <div className="space-y-3">
                {tasks.slice(0, 5).map((task) => (
                  <div
                    key={task.id}
                    className="flex items-start justify-between p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
                  >
                    <div className="flex-1 min-w-0 pr-3">
                      <p className="font-medium text-sm sm:text-base text-gray-900 line-clamp-2 leading-relaxed">
                        {task.description}
                      </p>
                      <p className="text-xs sm:text-sm text-gray-500 mt-1">
                        {new Date(task.scheduledDate).toLocaleDateString("uz-UZ")}
                      </p>
                    </div>
                    <Badge
                      variant={new Date(task.scheduledDate) > new Date() ? "default" : "secondary"}
                      className="text-xs shrink-0"
                    >
                      {new Date(task.scheduledDate) > new Date() ? "Kelayotgan" : "O'tgan"}
                    </Badge>
                  </div>
                ))}
                {tasks.length === 0 && (
                  <div className="text-center py-8">
                    <CalendarDays className="h-12 w-12 text-gray-300 mx-auto mb-3" />
                    <p className="text-gray-500 text-sm">Vazifalar topilmadi</p>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>

          <Card className="shadow-sm">
            <CardHeader className="px-4 py-4 sm:px-6 sm:py-5 border-b border-gray-100">
              <CardTitle className="text-lg sm:text-xl font-semibold text-gray-900">Foydalanuvchi Faolligi</CardTitle>
              <CardDescription className="text-sm text-gray-600">Vazifa bajarish holati</CardDescription>
            </CardHeader>
            <CardContent className="px-4 py-4 sm:px-6 sm:py-5">
              <div className="space-y-3">
                {users.slice(0, 5).map((user) => {
                  const completedTasks = user.tasks.filter((task) => task.completed).length
                  const totalTasks = user.tasks.length
                  const percentage = totalTasks > 0 ? Math.round((completedTasks / totalTasks) * 100) : 0

                  return (
                    <div
                      key={user.id}
                      className="flex items-center justify-between p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
                    >
                      <div className="flex-1 min-w-0 pr-3">
                        <p className="font-medium text-sm sm:text-base text-gray-900 truncate">{user.username}</p>
                        <div className="flex items-center gap-2 mt-1">
                          <div className="flex-1 bg-gray-200 rounded-full h-2">
                            <div
                              className="bg-blue-600 h-2 rounded-full transition-all duration-300"
                              style={{ width: `${percentage}%` }}
                            />
                          </div>
                          <span className="text-xs text-gray-500 shrink-0">
                            {completedTasks}/{totalTasks}
                          </span>
                        </div>
                      </div>
                      <Badge
                        variant={percentage === 100 ? "default" : percentage > 50 ? "secondary" : "outline"}
                        className="text-xs shrink-0"
                      >
                        {percentage}%
                      </Badge>
                    </div>
                  )
                })}
                {users.length === 0 && (
                  <div className="text-center py-8">
                    <Users className="h-12 w-12 text-gray-300 mx-auto mb-3" />
                    <p className="text-gray-500 text-sm">Foydalanuvchilar topilmadi</p>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
