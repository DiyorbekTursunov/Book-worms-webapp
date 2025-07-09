import { NextResponse } from "next/server"

export async function GET() {
  try {
    // Only test database connection in runtime, not during build
    if (process.env.NODE_ENV === "development" || process.env.VERCEL_ENV) {
      const { prisma } = await import("@/lib/prisma")

      // Test database connection
      await prisma.$queryRaw`SELECT 1`

      // Get basic stats
      const taskCount = await prisma.task.count()
      const userCount = await prisma.user.count()

      return NextResponse.json({
        status: "healthy",
        timestamp: new Date().toISOString(),
        database: "connected",
        version: "1.0.0",
        stats: {
          tasks: taskCount,
          users: userCount,
        },
        environment: process.env.NODE_ENV,
      })
    } else {
      // During build time, return basic status without database queries
      return NextResponse.json({
        status: "healthy",
        timestamp: new Date().toISOString(),
        database: "build-time",
        version: "1.0.0",
        stats: {
          tasks: 0,
          users: 0,
        },
        environment: process.env.NODE_ENV,
      })
    }
  } catch {
    return NextResponse.json(
      {
        status: "unhealthy",
        timestamp: new Date().toISOString(),
        database: "disconnected",
        error: "Database connection failed",
        environment: process.env.NODE_ENV,
      },
      { status: 500 },
    )
  }
}
