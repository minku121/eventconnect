import NextAuth, { type DefaultSession, type DefaultUser } from "next-auth";
import { authOptions } from "@/app/lib/auth";

declare module "next-auth" {
  interface Session extends DefaultSession {
    user: {
      id: number; 
      name?: string | null;
      email?: string | null;
      image?: string | null;
    } & DefaultSession["user"];
  }

  interface User extends DefaultUser {
    id: number; // `id` is now a number
    name?: string | null;
    email?: string | null;
    image?: string | null;
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    id: number; // `id` is now a number
    name?: string | null;
    email?: string | null;
    image?: string | null;
  }
}

const authHandler = NextAuth(authOptions);

export const GET = authHandler;
export const POST = authHandler;