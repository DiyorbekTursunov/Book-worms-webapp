import { type NextRequest, NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"

type RouteContext = {
  params: { id: string }
}

export async function POST(request: NextRequest, { params }: RouteContext) {
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
  } catch (error) {
    return NextResponse.json({ error: "To'lovni belgilashda xatolik" }, { status: 500 })
  }
}
