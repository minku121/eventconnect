import { PrismaClient } from "@prisma/client";
import { NextRequest, NextResponse } from "next/server";
import { getToken } from "next-auth/jwt";


const prisma = new PrismaClient();

export async function POST(request: NextRequest) {
  

  try {

   
    if (request.headers.get("content-type") !== "application/json") {
    
      return NextResponse.json(
        { error: "Invalid content type. Use application/json" },
        { status: 400 }
      );
    }


    const token = await getToken({
      req: request,
      secret: process.env.NEXTAUTH_SECRET,
    });

    if (!token) {
     
      return NextResponse.json(
        { error: "Not authenticated" },
        { status: 401 }
      );
    }

  
    
    const userId = token.id;

  
   
    const body = await request.json();
  
    const requiredFields = ["name", "description", "location", "time"];
    const missingFields = requiredFields.filter(field => !body[field]);
    
    if (missingFields.length > 0) {
     
      return NextResponse.json(
        { error: `Missing required fields: ${missingFields.join(", ")}` },
        { status: 400 }
      );
    }

   
   
    const timeDate = new Date(body.time);
    if (isNaN(timeDate.getTime())) {
     
      return NextResponse.json(
        { error: "Invalid time format. Use ISO 8601 (e.g., 2023-12-31T23:59:59Z)" },
        { status: 400 }
      );
    }

  
    let attandeeValue = null;
    if (body.islimited) {
      if (typeof body.attandee !== "number" || body.attandee < 1) {
       
        return NextResponse.json(
          { error: "Attendee limit must be a positive number when enabled" },
          { status: 400 }
        );
      }
      attandeeValue = body.attandee;
    }

 
   
    const prismaData = {
      name: body.name,
      description: body.description,
      location: body.location,
      dateTime: timeDate,
      image: body.image || "https://i.sstatic.net/y9DpT.jpg",
      ispublic: Boolean(body.ispublic),
      islimited: Boolean(body.islimited),
      attandee: attandeeValue,
      createdById: userId
    };

    const event = await prisma.event.create({
      data: {
        ...prismaData,
        time: prismaData.dateTime 
      },
    });

    return NextResponse.json({success: true, msg: "Event created successfully" }, { status: 201 });

  } catch (error) {


    const errorDetails = error instanceof Error 
      ? { message: error.message, stack: error.stack }
      : { errorObject: error };

    console.error("Error details:", JSON.stringify(errorDetails, null, 2));

    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  } finally {
   
   
    await prisma.$disconnect();
  }
}