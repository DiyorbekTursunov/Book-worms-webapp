"use client"

import type { Task } from "./admin-panel"

interface TaskListProps {
  tasks: Task[]
  onEditTask: (task: Task) => void
  onDeleteTask: (taskId: number) => void
}

export default function TaskList({ tasks, onEditTask, onDeleteTask }: TaskListProps) {
  return (
    <div className="bg-[var(--tg-theme-section-bg-color)] shadow rounded-lg p-4 mb-6">
      <h2 className="text-lg font-semibold mb-4 text-[var(--tg-theme-section-header-text-color)]">Vazifalar</h2>
      <div id="task-list" className="space-y-2">
        {tasks.map((task) => (
          <div key={task.id} className="flex items-center justify-between border-b py-2">
            <div>
              {new Date(task.scheduledDate).toLocaleDateString()} - {task.description}
            </div>
            <div className="space-x-2">
              <button
                className="bg-[var(--tg-theme-button-color)] text-[var(--tg-theme-button-text-color)] px-3 py-1 rounded hover:opacity-90"
                onClick={() => onEditTask(task)}
              >
                Tahrirlash
              </button>
              <button
                className="bg-[var(--tg-theme-destructive-text-color)] text-[var(--tg-theme-button-text-color)] px-3 py-1 rounded hover:opacity-90"
                onClick={() => onDeleteTask(task.id)}
              >
                O&apos;chirish
              </button>
            </div>
          </div>
        ))}
        {tasks.length === 0 && (
          <p className="text-center py-2 text-[var(--tg-theme-hint-color)]">Vazifalar mavjud emas</p>
        )}
      </div>
    </div>
  )
}
