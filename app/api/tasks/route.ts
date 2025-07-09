import { type NextRequest, NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"

export async function GET() {
  try {
    const tasks = await prisma.task.findMany({
      orderBy: { scheduledDate: "desc" },
    })
    return NextResponse.json(tasks)
  } catch (error) {
    return NextResponse.json({ error: "Vazifalarni olishda xatolik" }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const { description, scheduledDate } = await request.json()

    const selectedDate = new Date(scheduledDate)
    selectedDate.setHours(0, 0, 0, 0)

    const today = new Date()
    today.setHours(0, 0, 0, 0)

    // Bugungi yoki o'tgan kun uchun vazifa qo'shishni cheklash
    if (selectedDate <= today) {
      return NextResponse.json({ error: "Vazifa bugungi yoki o'tgan kun uchun qo'shilmaydi" }, { status: 400 })
    }

    // Bir kunga bitta vazifa cheklovi
    const existingTask = await prisma.task.findFirst({
      where: {
        scheduledDate: {
          gte: selectedDate,
          lt: new Date(selectedDate.getTime() + 24 * 60 * 60 * 1000),
        },
      },
    })

    if (existingTask) {
      return NextResponse.json({ error: "Bu sanaga allaqachon vazifa qo'shilgan" }, { status: 400 })
    }

    const task = await prisma.task.create({
      data: {
        description,
        scheduledDate: new Date(scheduledDate),
      },
    })

    return NextResponse.json(task)
  } catch (error) {
    return NextResponse.json({ error: "Vazifa yaratishda xatolik" }, { status: 500 })
  }
}
