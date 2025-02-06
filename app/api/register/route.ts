import { PrismaClient } from "@prisma/client";
import { NextResponse } from "next/server";
import { NextRequest } from "next/server";

const prisma = new PrismaClient();

export async function POST(request: NextRequest) {
  const { email, password } = await request.json();

 
  if (!email || !password) {
    return NextResponse.json({ error: "Email and password are required." }, { status: 400 });
  }

 
  const existingUser = await prisma.user.findUnique({
    where: { email },
  });

  if (existingUser) {
    return NextResponse.json({ error: "User with this email already exists." }, { status: 409 });
  }

  try {
  
    const newUser = await prisma.user.create({
      data: {
        email,
        password,
        name: email.split('@')[0],
        eventsCreated: 0,
        eventsJoined: 0,
        profilePic: '',
        rating: 0,
      },
    });

    return NextResponse.json({ message: "User registered successfully.", user: newUser }, { status: 201 });
  } catch (error) {
    console.error("Error creating user:", error);
    return NextResponse.json({ error: "Error creating user." }, { status: 500 });
  }
}
