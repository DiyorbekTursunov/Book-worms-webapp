import { NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"

export async function DELETE(request: Request, { params }: { params: { id: string } }) {
  try {
    const userId = Number.parseInt(params.id)
    await prisma.user.delete({ where: { id: userId } })
    return NextResponse.json({ success: true })
  } catch {
    return NextResponse.json({ error: "Foydalanuvchini o'chirishda xatolik" }, { status: 500 })
  }
}
