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
import { useToast } from "@/hooks/use-toast"
import { Plus, Edit, Trash2, Calendar } from "lucide-react"

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
  const { toast } = useToast()

  useEffect(() => {
    fetchTasks()
  }, [])

  const fetchTasks = async () => {
    try {
      const response = await fetch("/api/tasks")
      const data = await response.json()
      setTasks(data)
    } catch {
      toast({
        title: "Error",
        description: "Failed to fetch tasks",
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    try {
      const url = editingTask ? `/api/tasks/${editingTask.id}` : "/api/tasks"
      const method = editingTask ? "PUT" : "POST"

      const response = await fetch(url, {
        method,
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      })

      if (response.ok) {
        toast({
          title: "Success",
          description: editingTask ? "Task updated successfully" : "Task created successfully",
        })
        fetchTasks()
        resetForm()
      } else {
        const error = await response.json()
        toast({
          title: "Error",
          description: error.error || "Failed to save task",
          variant: "destructive",
        })
      }
    } catch {
      toast({
        title: "Error",
        description: "Failed to save task",
        variant: "destructive",
      })
    }
  }

  const handleDelete = async (id: number) => {
    try {
      const response = await fetch(`/api/tasks/${id}`, {
        method: "DELETE",
      })

      if (response.ok) {
        toast({
          title: "Success",
          description: "Task deleted successfully",
        })
        fetchTasks()
      } else {
        toast({
          title: "Error",
          description: "Failed to delete task",
          variant: "destructive",
        })
      }
    } catch {
      toast({
        title: "Error",
        description: "Failed to delete task",
        variant: "destructive",
      })
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
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-gray-900"></div>
      </div>
    )
  }

  return (
    <div className="container mx-auto p-6">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Tasks Management</h1>
          <p className="text-gray-600 mt-2">Manage scheduled tasks</p>
        </div>
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button onClick={openCreateDialog}>
              <Plus className="h-4 w-4 mr-2" />
              Add Task
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>{editingTask ? "Edit Task" : "Create New Task"}</DialogTitle>
              <DialogDescription>
                {editingTask ? "Update the task details below." : "Fill in the details to create a new task."}
              </DialogDescription>
            </DialogHeader>
            <form onSubmit={handleSubmit}>
              <div className="grid gap-4 py-4">
                <div className="grid gap-2">
                  <Label htmlFor="description">Description</Label>
                  <Textarea
                    id="description"
                    value={formData.description}
                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                    placeholder="Enter task description"
                    required
                  />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="scheduledDate">Scheduled Date</Label>
                  <Input
                    id="scheduledDate"
                    type="date"
                    value={formData.scheduledDate}
                    onChange={(e) => setFormData({ ...formData, scheduledDate: e.target.value })}
                    required
                  />
                </div>
              </div>
              <DialogFooter>
                <Button type="button" variant="outline" onClick={resetForm}>
                  Cancel
                </Button>
                <Button type="submit">{editingTask ? "Update Task" : "Create Task"}</Button>
              </DialogFooter>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>All Tasks</CardTitle>
          <CardDescription>Total: {tasks.length} tasks</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {tasks.length === 0 ? (
              <div className="text-center py-8">
                <Calendar className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                <p className="text-gray-500">No tasks found. Create your first task!</p>
              </div>
            ) : (
              tasks.map((task) => {
                const isUpcoming = new Date(task.scheduledDate) > new Date()

                return (
                  <div
                    key={task.id}
                    className="flex items-center justify-between p-4 border rounded-lg hover:bg-gray-50"
                  >
                    <div className="flex-1">
                      <h3 className="font-medium text-gray-900">{task.description}</h3>
                      <div className="flex items-center gap-4 mt-2 text-sm text-gray-500">
                        <span>Scheduled: {new Date(task.scheduledDate).toLocaleDateString()}</span>
                        <span>Created: {new Date(task.createdAt).toLocaleDateString()}</span>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <Badge variant={isUpcoming ? "default" : "secondary"}>{isUpcoming ? "Upcoming" : "Past"}</Badge>
                      <Button variant="outline" size="sm" onClick={() => openEditDialog(task)}>
                        <Edit className="h-4 w-4" />
                      </Button>
                      <AlertDialog>
                        <AlertDialogTrigger asChild>
                          <Button variant="outline" size="sm">
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </AlertDialogTrigger>
                        <AlertDialogContent>
                          <AlertDialogHeader>
                            <AlertDialogTitle>Are you sure?</AlertDialogTitle>
                            <AlertDialogDescription>
                              This action cannot be undone. This will permanently delete the task.
                            </AlertDialogDescription>
                          </AlertDialogHeader>
                          <AlertDialogFooter>
                            <AlertDialogCancel>Cancel</AlertDialogCancel>
                            <AlertDialogAction onClick={() => handleDelete(task.id)}>Delete</AlertDialogAction>
                          </AlertDialogFooter>
                        </AlertDialogContent>
                      </AlertDialog>
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
