import { type NextRequest, NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"

type RouteContext = {
  params: { id: string }
}

export async function PUT(request: NextRequest, { params }: RouteContext) {
  try {
    const taskId = Number.parseInt(params.id)
    const { description, scheduledDate } = await request.json()

    const selectedDate = new Date(scheduledDate)
    selectedDate.setHours(0, 0, 0, 0)

    const today = new Date()
    today.setHours(0, 0, 0, 0)

    // Bugungi yoki o'tgan kun uchun vazifa tahrirlanmasligi kerak
    if (selectedDate <= today) {
      return NextResponse.json({ error: "Vazifa bugungi yoki o'tgan kun uchun tahrirlanmaydi" }, { status: 400 })
    }

    // Bir kunga bitta vazifa cheklovi (joriy vazifadan tashqari)
    const existingTask = await prisma.task.findFirst({
      where: {
        id: { not: taskId },
        scheduledDate: {
          gte: selectedDate,
          lt: new Date(selectedDate.getTime() + 24 * 60 * 60 * 1000),
        },
      },
    })

    if (existingTask) {
      return NextResponse.json({ error: "Bu sanaga allaqachon boshqa vazifa qo'shilgan" }, { status: 400 })
    }

    const task = await prisma.task.update({
      where: { id: taskId },
      data: {
        description,
        scheduledDate: new Date(scheduledDate),
      },
    })

    return NextResponse.json(task)
  } catch (error) {
    return NextResponse.json({ error: "Vazifani tahrirlashda xatolik" }, { status: 500 })
  }
}

export async function DELETE(request: NextRequest, { params }: RouteContext) {
  try {
    const taskId = Number.parseInt(params.id)
    await prisma.task.delete({ where: { id: taskId } })
    return NextResponse.json({ success: true })
  } catch (error) {
    return NextResponse.json({ error: "Vazifani o'chirishda xatolik" }, { status: 500 })
  }
}
