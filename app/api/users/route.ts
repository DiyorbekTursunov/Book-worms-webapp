import { NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"

export async function GET() {
  try {
    const users = await prisma.user.findMany({
      include: { tasks: { include: { task: true } } },
    })
    return NextResponse.json(users)
  } catch {
    return NextResponse.json({ error: "Foydalanuvchilarni olishda xatolik" }, { status: 500 })
  }
}
