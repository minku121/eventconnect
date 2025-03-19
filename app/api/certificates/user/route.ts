import { NextRequest, NextResponse } from "next/server"
import { getServerSession } from "next-auth"
import { authOptions } from "@/app/lib/auth"
import prisma from "@/app/lib/prisma"

// Get all certificates for the current user
export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const certificates = await prisma.certificate.findMany({
      where: {
        userId: session.user.id,
      },
      include: {
        event: {
          select: {
            id: true,
            name: true,
            startTime: true,
            location: true,
            createdBy: {
              select: {
                name: true,
              }
            }
          }
        },
      },
      orderBy: {
        createdAt: "desc",
      },
    })

    return NextResponse.json({ certificates })
  } catch (error) {
    console.error("Error fetching user certificates:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
