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

interface User {
  id: number
  username: string
  tasks: Array<{
    id: number
    completed: boolean
    penaltyPaid: boolean
    task: Task
  }>
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
      return total + user.tasks.filter((task) => !task.completed && !task.penaltyPaid).length
    }, 0)
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
        <h1 className="text-2xl md:text-3xl font-bold text-gray-900">Admin Boshqaruv Paneli</h1>
        <p className="text-sm md:text-base text-gray-600 mt-2">Vazifalar boshqaruv tizimi umumiy ko'rinishi</p>
      </div>

      {/* Stats Cards - Mobile: 2 columns, Desktop: 4 columns */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 md:gap-6 mb-6 md:mb-8">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2 px-3 md:px-6 pt-3 md:pt-6">
            <CardTitle className="text-xs md:text-sm font-medium">Jami Vazifalar</CardTitle>
            <CalendarDays className="h-3 w-3 md:h-4 md:w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent className="px-3 md:px-6 pb-3 md:pb-6">
            <div className="text-lg md:text-2xl font-bold">{tasks.length}</div>
            <p className="text-xs text-muted-foreground">{getUpcomingTasks().length} ta kelayotgan</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2 px-3 md:px-6 pt-3 md:pt-6">
            <CardTitle className="text-xs md:text-sm font-medium">Jami Foydalanuvchilar</CardTitle>
            <Users className="h-3 w-3 md:h-4 md:w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent className="px-3 md:px-6 pb-3 md:pb-6">
            <div className="text-lg md:text-2xl font-bold">{users.length}</div>
            <p className="text-xs text-muted-foreground">Faol foydalanuvchilar</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2 px-3 md:px-6 pt-3 md:pt-6">
            <CardTitle className="text-xs md:text-sm font-medium">Bajarilgan</CardTitle>
            <CheckCircle className="h-3 w-3 md:h-4 md:w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent className="px-3 md:px-6 pb-3 md:pb-6">
            <div className="text-lg md:text-2xl font-bold">{getCompletedTasksCount()}</div>
            <p className="text-xs text-muted-foreground">Muvaffaqiyatli bajarilgan</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2 px-3 md:px-6 pt-3 md:pt-6">
            <CardTitle className="text-xs md:text-sm font-medium">Kutilayotgan</CardTitle>
            <AlertCircle className="h-3 w-3 md:h-4 md:w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent className="px-3 md:px-6 pb-3 md:pb-6">
            <div className="text-lg md:text-2xl font-bold">{getPendingPayments()}</div>
            <p className="text-xs text-muted-foreground">E'tibor talab qiladi</p>
          </CardContent>
        </Card>
      </div>

      {/* Recent Tasks - Mobile: Stack vertically, Desktop: Side by side */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 md:gap-6">
        <Card>
          <CardHeader className="px-3 md:px-6 py-3 md:py-6">
            <CardTitle className="text-base md:text-lg">So'nggi Vazifalar</CardTitle>
            <CardDescription className="text-sm">Eng so'nggi rejalashtirilgan vazifalar</CardDescription>
          </CardHeader>
          <CardContent className="px-3 md:px-6 pb-3 md:pb-6">
            <div className="space-y-3 md:space-y-4">
              {tasks.slice(0, 5).map((task) => (
                <div
                  key={task.id}
                  className="flex flex-col sm:flex-row sm:items-center justify-between p-2 md:p-3 border rounded-lg gap-2"
                >
                  <div className="flex-1 min-w-0">
                    <p className="font-medium text-sm md:text-base truncate">{task.description}</p>
                    <p className="text-xs md:text-sm text-gray-500">
                      {new Date(task.scheduledDate).toLocaleDateString("uz-UZ")}
                    </p>
                  </div>
                  <Badge
                    variant={new Date(task.scheduledDate) > new Date() ? "default" : "secondary"}
                    className="text-xs self-start sm:self-center"
                  >
                    {new Date(task.scheduledDate) > new Date() ? "Kelayotgan" : "O'tgan"}
                  </Badge>
                </div>
              ))}
              {tasks.length === 0 && <p className="text-center text-gray-500 py-4 text-sm">Vazifalar topilmadi</p>}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="px-3 md:px-6 py-3 md:py-6">
            <CardTitle className="text-base md:text-lg">Foydalanuvchi Faolligi</CardTitle>
            <CardDescription className="text-sm">Foydalanuvchilarning vazifa bajarish holati</CardDescription>
          </CardHeader>
          <CardContent className="px-3 md:px-6 pb-3 md:pb-6">
            <div className="space-y-3 md:space-y-4">
              {users.slice(0, 5).map((user) => {
                const completedTasks = user.tasks.filter((task) => task.completed).length
                const totalTasks = user.tasks.length

                return (
                  <div
                    key={user.id}
                    className="flex flex-col sm:flex-row sm:items-center justify-between p-2 md:p-3 border rounded-lg gap-2"
                  >
                    <div className="flex-1 min-w-0">
                      <p className="font-medium text-sm md:text-base truncate">{user.username}</p>
                      <p className="text-xs md:text-sm text-gray-500">
                        {completedTasks}/{totalTasks} vazifa bajarilgan
                      </p>
                    </div>
                    <Badge
                      variant={completedTasks === totalTasks ? "default" : "secondary"}
                      className="text-xs self-start sm:self-center"
                    >
                      {totalTasks > 0 ? Math.round((completedTasks / totalTasks) * 100) : 0}%
                    </Badge>
                  </div>
                )
              })}
              {users.length === 0 && (
                <p className="text-center text-gray-500 py-4 text-sm">Foydalanuvchilar topilmadi</p>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
