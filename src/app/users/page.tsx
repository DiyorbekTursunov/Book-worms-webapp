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
      const response = await fetch("https://book-worms-0hgk.onrender.com/api/users")
      const data = await response.json()
      setUsers(data)
    } catch {
      toast.error("Failed to fetch users")
    } finally {
      setLoading(false)
    }
  }

  const handleMarkPayment = async (userId: number) => {
    try {
      const response = await fetch(`https://book-worms-0hgk.onrender.com/api/users/${userId}/mark-payment`, {
        method: "POST",
      })

      if (response.ok) {
        toast.success("Payment marked successfully")
        fetchUsers()
      } else {
        toast.error("Failed to mark payment")
      }
    } catch {
      toast.error("Failed to mark payment")
    }
  }

  const handleDeleteUser = async (userId: number) => {
    try {
      const response = await fetch(`/api/users/${userId}`, {
        method: "DELETE",
      })

      if (response.ok) {
        toast.success("User deleted successfully")
        fetchUsers()
      } else {
        toast.error("Failed to delete user")
      }
    } catch {
      toast.error("Failed to delete user")
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
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-gray-900"></div>
      </div>
    )
  }

  return (
    <div className="container mx-auto p-6">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Users Management</h1>
        <p className="text-gray-600 mt-2">Manage users and their task completions</p>
      </div>

      <div className="grid gap-6">
        {users.length === 0 ? (
          <Card>
            <CardContent className="text-center py-8">
              <Users className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <p className="text-gray-500">No users found.</p>
            </CardContent>
          </Card>
        ) : (
          users.map((user) => {
            const { completedTasks, pendingPayments, totalTasks } = getUserStats(user)

            return (
              <Card key={user.id}>
                <CardHeader>
                  <div className="flex justify-between items-start">
                    <div>
                      <CardTitle className="flex items-center gap-2">
                        <Users className="h-5 w-5" />
                        {user.username}
                      </CardTitle>
                      <CardDescription>User ID: {user.id}</CardDescription>
                    </div>
                    <div className="flex gap-2">
                      {pendingPayments > 0 && (
                        <Button variant="outline" size="sm" onClick={() => handleMarkPayment(user.id)}>
                          <DollarSign className="h-4 w-4 mr-2" />
                          Mark Payment
                        </Button>
                      )}
                      <AlertDialog>
                        <AlertDialogTrigger asChild>
                          <Button variant="outline" size="sm">
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </AlertDialogTrigger>
                        <AlertDialogContent>
                          <AlertDialogHeader>
                            <AlertDialogTitle>Delete User</AlertDialogTitle>
                            <AlertDialogDescription>
                              Are you sure you want to delete {user.username}? This action cannot be undone.
                            </AlertDialogDescription>
                          </AlertDialogHeader>
                          <AlertDialogFooter>
                            <AlertDialogCancel>Cancel</AlertDialogCancel>
                            <AlertDialogAction onClick={() => handleDeleteUser(user.id)}>Delete</AlertDialogAction>
                          </AlertDialogFooter>
                        </AlertDialogContent>
                      </AlertDialog>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  {/* User Stats */}
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                    <div className="flex items-center gap-2 p-3 bg-green-50 rounded-lg">
                      <CheckCircle className="h-5 w-5 text-green-600" />
                      <div>
                        <p className="text-sm text-green-600">Completed</p>
                        <p className="font-semibold text-green-800">{completedTasks}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2 p-3 bg-red-50 rounded-lg">
                      <XCircle className="h-5 w-5 text-red-600" />
                      <div>
                        <p className="text-sm text-red-600">Pending Payments</p>
                        <p className="font-semibold text-red-800">{pendingPayments}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2 p-3 bg-blue-50 rounded-lg">
                      <Users className="h-5 w-5 text-blue-600" />
                      <div>
                        <p className="text-sm text-blue-600">Total Tasks</p>
                        <p className="font-semibold text-blue-800">{totalTasks}</p>
                      </div>
                    </div>
                  </div>

                  {/* Task List */}
                  <div className="space-y-3">
                    <h4 className="font-medium text-gray-900">Task History</h4>
                    {user.tasks.length === 0 ? (
                      <p className="text-gray-500 text-sm">No tasks assigned</p>
                    ) : (
                      user.tasks.map((taskCompletion) => (
                        <div
                          key={taskCompletion.id}
                          className="flex items-center justify-between p-3 border rounded-lg"
                        >
                          <div className="flex-1">
                            <p className="font-medium">{taskCompletion.task.description}</p>
                            <p className="text-sm text-gray-500">
                              Scheduled: {new Date(taskCompletion.task.scheduledDate).toLocaleDateString()}
                            </p>
                          </div>
                          <div className="flex gap-2">
                            <Badge variant={taskCompletion.completed ? "default" : "secondary"}>
                              {taskCompletion.completed ? "Completed" : "Not Completed"}
                            </Badge>
                            {!taskCompletion.completed && (
                              <Badge variant={taskCompletion.penaltyPaid ? "default" : "destructive"}>
                                {taskCompletion.penaltyPaid ? "Paid" : "Unpaid"}
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
