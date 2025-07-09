import { NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"

export async function POST(request: Request, { params }: { params: { id: string } }) {
  try {
    const userId = Number.parseInt(params.id)
    const { penaltyPaid } = await request.json()

    await prisma.taskCompletion.updateMany({
      where: {
        userId,
        completed: false,
        penaltyPaid: false,
      },
      data: { penaltyPaid },
    })

    return NextResponse.json({ success: true })
  } catch {
    return NextResponse.json({ error: "To'lovni belgilashda xatolik" }, { status: 500 })
  }
}
