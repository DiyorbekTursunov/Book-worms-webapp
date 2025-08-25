"use client";

import { useState, useEffect } from "react";

interface TaskData {
  day: number;
  date: string;
  status:
    | "completed"
    | "paid_fine"
    | "unpaid_fine"
    | "missed"
    | "future"
    | "not_joined";
}

interface DashboardUser {
  id: number;
  name: string;
  telegramId: string;
  score: number;
  percentage: number;
  taskData: TaskData[];
  joinedAt: string;
  totalDays: number;
  totalPages: number;
  currentPage: number;
  completedDays: number;
  totalActiveDays: number;
  streak?: number;
}

export default function Home() {
  const [users, setUsers] = useState<DashboardUser[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  useEffect(() => {
    fetchDashboardData(currentPage);
  }, [currentPage]);

  const fetchDashboardData = async (page: number) => {
    try {
      setLoading(true);
      const response = await fetch(
        `http://localhost:3001/api/dashboard?page=${page}`
      );

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const result = await response.json();

      if (result.success) {
        // Streak ni hisoblash va tartiblashtirish
        const usersWithStreak = result.data
          .map((user: DashboardUser) => {
            let currentStreak = 0;

            // Streakni oxirgi completed vazifalardan boshlab hisoblash (teskari tartibda)
            const reversedTasks = [...user.taskData].reverse();

            for (const task of reversedTasks) {
              if (task.status === "completed") {
                currentStreak++;
              } else if (
                task.status === "not_joined" ||
                task.status === "future"
              ) {
                // not_joined va future holatlarni e'tiborsiz qoldirish
                continue;
              } else {
                // missed, unpaid_fine, paid_fine hollarda streak uzilib qoladi
                break;
              }
            }

            return { ...user, streak: currentStreak };
          })
          .sort((a, b) => b.percentage - a.percentage); // Foiz bo'yicha tartiblash

        setUsers(usersWithStreak);
        setTotalPages(result.data[0]?.totalPages || 1);
      } else {
        setError(result.error || "Ma'lumotlarni olishda xatolik");
      }
    } catch (err) {
      setError("Server bilan bog'lanishda xatolik");
      console.error("Dashboard data fetch error:", err);
    } finally {
      setLoading(false);
    }
  };

  const changePage = (newPage: number) => {
    if (newPage >= 1 && newPage <= totalPages) {
      setCurrentPage(newPage);
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "completed":
        return "bg-green-500";
      case "paid_fine":
        return "bg-yellow-500";
      case "unpaid_fine":
        return "bg-red-500";
      case "missed":
        return "bg-red-500";
      case "future":
        return "bg-white border-gray-300"; // Kelajak ham bo'sh
      case "not_joined":
        return "bg-white border-gray-300"; // Butunlay bo'sh
      default:
        return "bg-gray-200";
    }
  };

  if (loading) {
    return (
      <div className="h-screen w-screen flex items-center justify-center bg-white">
        <div className="text-lg">Ma'lumotlar yuklanmoqda...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="h-screen w-screen flex flex-col items-center justify-center bg-white">
        <div className="text-lg text-red-500 mb-4">{error}</div>
      </div>
    );
  }

  return (
    <div className="h-screen w-screen overflow-auto bg-white p-12">
      <div className="bg-white border-b border-gray-300 p-2">
        <h1 className="text-xl font-bold">Vazifalar Dashboard</h1>
        <div className="text-sm text-gray-600 mt-1">
          <span className="inline-block w-4 h-4 bg-green-500 mr-2"></span>
          Bajarilgan
          <span className="inline-block w-4 h-4 bg-yellow-500 mr-2 ml-4"></span>
          To'langan jarima
          <span className="inline-block w-4 h-4 bg-red-500 mr-2 ml-4"></span>
          Bajarilmagan/To'lanmagan jarima
        </div>
      </div>

      <table className="w-full border-collapse">
        <thead className=" top-20 bg-gray-100">
          <tr>
            <th className="border border-gray-300 px-2 py-1 text-left text-sm font-medium min-w-[200px]">
              Foydalanuvchi
            </th>
            {Array.from({ length: 30 }, (_, i) => (
              <th
                key={i}
                className="border border-gray-300 px-1 py-1 text-xs font-medium w-6"
              >
                {String((currentPage - 1) * 30 + i + 1).padStart(2, "0")}
              </th>
            ))}
            {/* <th className="border border-gray-300 px-2 py-1 text-sm font-medium w-20">Ball</th> */}
            <th className="border border-gray-300 px-2 py-1 text-sm font-medium w-16">
              Foiz
            </th>
            <th className="border border-gray-300 px-2 py-1 text-sm font-medium w-16">
              Streak
            </th>
          </tr>
        </thead>
        <tbody>
          {users.map((user, index) => (
            <>
              <tr key={user.id} className="hover:bg-gray-50 h-full">
                <td className="border border-gray-300 px-2 py-1 text-sm">
                  {index + 1}. {user.name}
                  {/* <div className="text-xs text-gray-500">
                  {user.completedDays}/{user.totalActiveDays} kun
                </div> */}
                </td>
                {user.taskData.map((task) => (
                  <td
                    key={task.day}
                    className="border border-gray-300 p-0 w-8 h-8"
                  >
                    <div
                      className={`w-full h-full ${getStatusColor(task.status)}`}
                      title={`${task.date} - ${task.status}`}
                    ></div>
                  </td>
                ))}
                {/* <td className="border border-gray-300 px-2 py-1 text-sm text-center font-medium">
                {user.score}
              </td> */}
                <td className="border border-gray-300 px-2 py-1 text-sm text-center font-medium">
                  {user.percentage.toFixed(1)}%
                </td>
                <td className="border border-gray-300 px-2 py-1 text-sm text-center font-medium">
                  {user.streak}
                </td>
              </tr>

              
            </>
          ))}
        </tbody>
      </table>

      {/* Pagination */}
      <div className="flex justify-center mt-4 pb-4">
        <button
          onClick={() => changePage(currentPage - 1)}
          disabled={currentPage === 1}
          className="px-4 py-2 bg-blue-500 text-white rounded mr-2 disabled:bg-gray-300"
        >
          Oldingi
        </button>
        <span className="px-4 py-2">
          Sahifa {currentPage} / {totalPages}
        </span>
        <button
          onClick={() => changePage(currentPage + 1)}
          disabled={currentPage === totalPages}
          className="px-4 py-2 bg-blue-500 text-white rounded ml-2 disabled:bg-gray-300"
        >
          Keyingi
        </button>
      </div>
    </div>
  );
}
