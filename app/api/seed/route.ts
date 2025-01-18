import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

import { NextRequest } from "next/server";
import { NextResponse } from "next/server";

async function handler() {
    // Seed demo data
    const users = await Promise.all(
        Array.from({ length: 5 }).map((_, index) =>
            prisma.user.create({
                data: {
                    email: `user${index}@example.com`,
                    password: `password${index}`,
                    name: `User ${index}`,
                    role: index === 0 ? "ADMIN" : "USER", // First user is an admin
                    profilePic: `http://example.com/profile${index}.jpg`,
                },
            })
        )
    );

    const events = await Promise.all(
        Array.from({ length: 5 }).map((_, index) =>
            prisma.event.create({
                data: {
                    name: `Event ${index}`,
                    location: `Location ${index}`,
                    time: new Date(Date.now() + index * 86400000), // Different time for each event
                },
            })
        )
    );

    const teams = await Promise.all(
        Array.from({ length: 5 }).map((_, index) =>
            prisma.team.create({
                data: {
                    name: `Team ${index}`,
                    eventId: events[index % events.length].id, // Associate with an event
                    maxPlayers: 5,
                },
            })
        )
    );

    await Promise.all(
        users.map((user, userIndex) =>
            prisma.player.create({
                data: {
                    userId: user.id,
                    teamId: teams[userIndex % teams.length].id, // Associate user with a team
                },
            })
        )
    );

    await Promise.all(
        users.map((user, userIndex) =>
            prisma.history.create({
                data: {
                    userId: user.id,
                    eventId: events[userIndex % events.length].id, // Associate user with an event
                },
            })
        )
    );

    return NextResponse.json({ message: "Demo data seeded successfully!" });
}

async function postHandler() {
    // Logic for seeding demo data (same as the current handler)
    // You can reuse the existing handler logic here or create a new one
    // For example, you can call the existing handler function
    return handler(); // Call the existing handler for seeding
}

// Exporting both handlers for GET and POST requests
export { handler as GET, postHandler as POST };