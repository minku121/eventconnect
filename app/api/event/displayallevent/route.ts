import { PrismaClient } from "@prisma/client";
import { NextResponse } from "next/server";

const prisma = new PrismaClient();

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const page = Number(searchParams.get('page')) || 1;
    const pageSize = Number(searchParams.get('pageSize')) || 6;

    const [events, total] = await prisma.$transaction([
      prisma.event.findMany({
        where: { ispublic: true },
        skip: (page - 1) * pageSize,
        take: pageSize,
      }),
      prisma.event.count({ where: { ispublic: true } })
    ]);

    return NextResponse.json({
      data: events,
      total,
      totalPages: Math.ceil(total / pageSize)
    });
  } catch (error) {
    return NextResponse.json({ error: "Failed to fetch events" }, { status: 500 });
  } finally {
    await prisma.$disconnect();
  }
}
