"use client"

import type { User } from "./admin-panel"

interface UserListProps {
  users: User[]
  onMarkPaid: (userId: number, userName: string, newPaymentStatus: boolean) => void
  onDeleteUser: (userId: number) => void
}

export default function UserList({ users, onMarkPaid, onDeleteUser }: UserListProps) {
  // Filter users with unpaid tasks
  const usersWithUnpaidTasks = users.filter((user) => user.tasks.some((t) => !t.completed && !t.penaltyPaid))

  return (
    <div className="bg-[var(--tg-theme-section-bg-color)] shadow rounded-lg p-4">
      <h2 className="text-lg font-semibold mb-4 text-[var(--tg-theme-section-header-text-color)]">
        Foydalanuvchilarni Boshqarish
      </h2>
      <div id="user-list" className="space-y-4">
        {usersWithUnpaidTasks.map((user) => {
          const unpaidTasks = user.tasks.filter((t) => !t.completed && !t.penaltyPaid).length

          return (
            <div key={user.id} className="flex items-center justify-between border-b py-2">
              <div>
                <p className="font-medium">
                  {user.name} (ID: {user.telegramId})
                </p>
                <p className="text-sm text-[var(--tg-theme-hint-color)]">
                  Qo'shilgan: {new Date(user.joinedAt).toLocaleDateString()} | Davomiylik: {user.currentStreak} |
                  Bajarilmagan: {user.tasks.filter((t) => !t.completed).length} | To'lanmagan jarimalar: {unpaidTasks}
                </p>
              </div>
              <div className="space-x-2">
                <button
                  className="bg-[var(--tg-theme-button-color)] text-[var(--tg-theme-button-text-color)] px-3 py-1 rounded hover:opacity-90"
                  onClick={() => onMarkPaid(user.id, user.name, true)}
                >
                  To'lovni belgilash
                </button>
                <button
                  className="bg-[var(--tg-theme-destructive-text-color)] text-[var(--tg-theme-button-text-color)] px-3 py-1 rounded hover:opacity-90"
                  onClick={() => onDeleteUser(user.id)}
                >
                  O'chirish
                </button>
              </div>
            </div>
          )
        })}
        {usersWithUnpaidTasks.length === 0 && (
          <p className="text-center py-2 text-[var(--tg-theme-hint-color)]">To'lanmagan jarimalar mavjud emas</p>
        )}
      </div>
    </div>
  )
}
