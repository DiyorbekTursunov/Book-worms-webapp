"use client";

import { useEffect, useState } from "react";
import { getTelegramWebApp, type TelegramWebApp } from "@/lib/telegram";
import ErrorMessage from "@/components/error-message";
import AddTaskForm from "@/components/add-task-form";
import TaskList from "@/components/task-list";
import UserList from "@/components/user-list";
import EditTaskModal from "@/components/edit-task-modal";
import ConfirmPaymentModal from "@/components/confirm-payment-modal";

export interface Task {
  id: number;
  description: string;
  scheduledDate: string;
}

export interface TaskCompletion {
  id: number;
  taskId: number;
  completed: boolean;
  penaltyPaid: boolean;
  task: Task;
}

export interface User {
  id: number;
  telegramId: string;
  name: string;
  joinedAt: string;
  currentStreak: number;
  tasks: TaskCompletion[];
}

export default function AdminPanel() {
  const [tg, setTg] = useState<TelegramWebApp | null>(null);
  const [tasks, setTasks] = useState<Task[]>([]);
  const [users, setUsers] = useState<User[]>([]);
  const [error, setError] = useState<string | null>(null);

  // Edit task modal state
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [editingTask, setEditingTask] = useState<Task | null>(null);

  // Confirm payment modal state
  const [isConfirmModalOpen, setIsConfirmModalOpen] = useState(false);
  const [confirmingPayment, setConfirmingPayment] = useState<{
    userId: number;
    userName: string;
    newPaymentStatus: boolean;
  } | null>(null);

  useEffect(() => {
    const telegramApp = getTelegramWebApp();
    if (telegramApp) {
      setTg(telegramApp);
      telegramApp.ready();

      // Configure Telegram Main Button
      telegramApp.MainButton.setText("Vazifa Qo'shish");
      telegramApp.MainButton.setParams({
        color: telegramApp.themeParams.button_color || "#2ea6ff",
        text_color: telegramApp.themeParams.button_text_color || "#ffffff",
      });
      telegramApp.MainButton.show();

      // Apply theme
      applyTheme(telegramApp);
      telegramApp.onEvent("themeChanged", () => applyTheme(telegramApp));
    }

    fetchTasks();
    fetchUsers();
  }, []);

  const applyTheme = (telegramApp: TelegramWebApp) => {
    if (typeof document !== "undefined") {
      document.body.style.backgroundColor =
        telegramApp.themeParams.bg_color || "#ffffff";
      document.body.style.color =
        telegramApp.themeParams.text_color || "#000000";
    }
  };

  const fetchTasks = async () => {
    try {
      const response = await fetch("/api/tasks");
      if (!response.ok) throw new Error("Vazifalarni yuklashda xatolik");
      const data = await response.json();
      setTasks(data);
    } catch {
      showError("Vazifalarni yuklashda xatolik yuz berdi");
    }
  };

  const fetchUsers = async () => {
    try {
      const response = await fetch("/api/users");
      if (!response.ok) throw new Error("Foydalanuvchilarni yuklashda xatolik");
      const data = await response.json();
      setUsers(data);
    } catch {
      showError("Foydalanuvchilarni yuklashda xatolik yuz berdi");
    }
  };

  const showError = (message: string) => {
    setError(message);
    setTimeout(() => setError(null), 5000);
  };

  const handleAddTask = async (date: string, description: string) => {
    try {
      const response = await fetch("/api/tasks", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ description, scheduledDate: date }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "Vazifa qo'shishda xatolik");
      }

      await fetchTasks();
      return true;
    } catch (err: unknown) {
      if (err instanceof Error) {
        showError(err.message);
      } else {
        showError("Nomaʼlum xatolik yuz berdi");
      }
      return false;
    }
  };

  const handleEditTask = async (
    taskId: number,
    date: string,
    description: string
  ) => {
    try {
      const response = await fetch(`/api/tasks/${taskId}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ description, scheduledDate: date }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "Vazifani tahrirlashda xatolik");
      }

      setIsEditModalOpen(false);
      if (tg) tg.MainButton.setText("Vazifa Qo'shish");
      await fetchTasks();
      return true;
    } catch (err: unknown) {
      if (err instanceof Error) {
        showError(err.message);
      } else {
        showError("Nomaʼlum xatolik yuz berdi");
      }
      return false;
    }
  };

  const handleDeleteTask = async (taskId: number) => {
    if (!confirm("Haqiqatan ham ushbu vazifani o'chirishni xohlaysizmi?"))
      return;

    try {
      const response = await fetch(`/api/tasks/${taskId}`, {
        method: "DELETE",
      });

      if (!response.ok) throw new Error("Vazifani o'chirishda xatolik");
      await fetchTasks();
    } catch {
      showError("Vazifani o'chirishda xatolik yuz berdi");
    }
  };

  const handleDeleteUser = async (userId: number) => {
    if (
      !confirm("Haqiqatan ham ushbu foydalanuvchini o'chirishni xohlaysizmi?")
    )
      return;

    try {
      const response = await fetch(`/api/users/${userId}`, {
        method: "DELETE",
      });

      if (!response.ok) throw new Error("Foydalanuvchini o'chirishda xatolik");
      await fetchUsers();
    } catch {
      showError("Foydalanuvchini o'chirishda xatolik yuz berdi");
    }
  };

  const handleConfirmPayment = async (
    userId: number,
    newPaymentStatus: boolean
  ) => {
    try {
      const response = await fetch(`/api/users/${userId}/mark-payment`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ penaltyPaid: newPaymentStatus }),
      });

      if (!response.ok) throw new Error("To'lovni belgilashda xatolik");
      setIsConfirmModalOpen(false);
      await fetchUsers();
    } catch {
      showError("To'lovni belgilashda xatolik yuz berdi");
    }
  };

  const openEditModal = (task: Task) => {
    setEditingTask(task);
    setIsEditModalOpen(true);
    if (tg) tg.MainButton.setText("Vazifani Saqlash");
  };

  const openConfirmPaymentModal = (
    userId: number,
    userName: string,
    newPaymentStatus: boolean
  ) => {
    setConfirmingPayment({ userId, userName, newPaymentStatus });
    setIsConfirmModalOpen(true);
  };

  return (
    <div className="min-h-screen bg-[var(--tg-theme-bg-color)] text-[var(--tg-theme-text-color)] p-4 transition-all duration-300">
      <div className="max-w-md mx-auto">
        <h1 className="text-2xl font-bold mb-6 text-center">
          Book Worms Admin Paneli
        </h1>

        {error && <ErrorMessage message={error} />}

        <AddTaskForm onAddTask={handleAddTask} tg={tg} />

        <TaskList
          tasks={tasks}
          onEditTask={openEditModal}
          onDeleteTask={handleDeleteTask}
        />

        <UserList
          users={users}
          onMarkPaid={openConfirmPaymentModal}
          onDeleteUser={handleDeleteUser}
        />
      </div>

      {editingTask && (
        <EditTaskModal
          isOpen={isEditModalOpen}
          task={editingTask}
          onClose={() => {
            setIsEditModalOpen(false);
            if (tg) tg.MainButton.setText("Vazifa Qo'shish");
          }}
          onSave={handleEditTask}
        />
      )}

      {confirmingPayment && (
        <ConfirmPaymentModal
          isOpen={isConfirmModalOpen}
          userName={confirmingPayment.userName}
          newPaymentStatus={confirmingPayment.newPaymentStatus}
          onClose={() => setIsConfirmModalOpen(false)}
          onConfirm={() =>
            handleConfirmPayment(
              confirmingPayment.userId,
              confirmingPayment.newPaymentStatus
            )
          }
        />
      )}
    </div>
  );
}
