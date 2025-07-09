import { type NextRequest, NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"

type RouteContext = {
  params: { id: string }
}

export async function DELETE(request: NextRequest, { params }: RouteContext) {
  try {
    const userId = Number.parseInt(params.id)
    await prisma.user.delete({ where: { id: userId } })
    return NextResponse.json({ success: true })
  } catch (error) {
    return NextResponse.json({ error: "Foydalanuvchini o'chirishda xatolik" }, { status: 500 })
  }
}
