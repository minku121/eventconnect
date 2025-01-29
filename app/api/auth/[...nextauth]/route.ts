import NextAuth, { type DefaultSession, type DefaultUser } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import GoogleProvider from "next-auth/providers/google";
import GithubProvider from "next-auth/providers/github";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

// Extend the default Session and User types to include the `id` property as a number
declare module "next-auth" {
  interface Session extends DefaultSession {
    user: {
      id: number; // `id` is now a number
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

const authHandler = NextAuth({
  providers: [
    // Credentials Provider
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "text", placeholder: "john.doe@example.com" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials: any) {
        const user = await prisma.user.findUnique({
          where: {
            email: credentials.email,
          },
        });

        if (user && user.password === credentials.password) {
          return { id: user.id, name: user.name, email: user.email }; // `id` is a number
        }
        return null;
      },
    }),

    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENTID as string,
      clientSecret: process.env.GOOGLE_SECRET as string,
      authorization: {
        params: {
          redirect_uri: `${process.env.NEXTAUTH_URL}/api/auth/callback/google`,
        },
      },
    }),
    GithubProvider({
      clientId: process.env.GITHUB_CLIENTID as string,
      clientSecret: process.env.GITHUB_SECRET as string,
      authorization: {
        params: {
          redirect_uri: `${process.env.NEXTAUTH_URL}/api/auth/callback/github`,
        },
      },
    }),
  ],

  secret: process.env.NEXTAUTH_SECRET,

  callbacks: {
    async signIn({ user, account, profile }) {
      // For OAuth Providers
      if (account && (account.provider === "google" || account.provider === "github")) {
        const email = profile?.email;
        if (!email) return false;

        // Check if user exists in the database
        let dbUser = await prisma.user.findUnique({
          where: { email },
        });

        // If not, create the user
        if (!dbUser) {
          dbUser = await prisma.user.create({
            data: {
              name: profile.name || "Unknown User",
              email,
              password: "minku_123", // Hardcoded password for OAuth users
            },
          });
        }
      }
      return true; // Allow login
    },

    async jwt({ token, user }) {
      // Attach user information to the token
      if (user) {
        token.id = Number(user.id); // `id` is a number
        token.name = user.name;
        token.email = user.email;
        token.image = user.image;
      }
      return token;
    },

    async session({ session, token }) {
      // Add custom user information to the session
      if (token) {
        session.user = {
          id: token.id, // `id` is a number
          name: token.name,
          email: token.email,
          image: token.image,
        };
      }
      return session;
    },
  },

  pages: {
    signIn: "/auth/signin",
    signOut: "/auth/signout",
    error: "/auth/error",
  },
});

export const GET = authHandler;
export const POST = authHandler;