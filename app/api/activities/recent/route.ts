import { getToken } from "next-auth/jwt";
import { NextRequest, NextResponse } from "next/server";
import prisma from "@/app/lib/prisma";

export async function GET(request: NextRequest) {
  try {
    const token = await getToken({
      req: request,
      secret: process.env.NEXTAUTH_SECRET,
    });

    if (!token?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const activities = await prisma.activity.findMany({
      where: {
        userId: token.id
      },
      orderBy: {
        createdAt: "desc"
      },
      take: 10,
      include: {
        user: {
          select: {
            name: true,
            email: true
          }
        }
      }
    });

    const formattedActivities = activities.map(activity => ({
      name: activity.user.name,
      email: activity.user.email,
      activity: activity.description,
      time: activity.createdAt.toLocaleTimeString()
    }));

    return NextResponse.json(formattedActivities);
    
  } catch (error) {
    console.error("Error fetching activities:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
} 