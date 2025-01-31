import NextAuth, { type DefaultSession, type DefaultUser } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import GoogleProvider from "next-auth/providers/google";
import GithubProvider from "next-auth/providers/github";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

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
        let user = await prisma.user.findUnique({
          where: {
            email: credentials.email,
          },
        });

        // If user not found, create a new one
        if (!user) {
          user = await prisma.user.create({
            data: {
              email: credentials.email,
              password: credentials.password,
              name: credentials.email.split('@')[0], // Use email prefix as default name
            },
          });
        }

        // If user exists and password matches, or if new user was created
        if (user && user.password === credentials.password) {
          return { id: user.id, name: user.name, email: user.email };
        }
        return null;
      },
    }),

    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENTID as string,
      clientSecret: process.env.GOOGLE_SECRET as string,
      authorization: {
        params: {
          redirect_uri: process.env.NEXTAUTH_URL + "/api/auth/callback/google"
        }
      }
    }),
    GithubProvider({
      clientId: process.env.GITHUB_CLIENTID as string,
      clientSecret: process.env.GITHUB_SECRET as string,
      authorization: {
        params: {
          redirect_uri: process.env.NEXTAUTH_URL + "/api/auth/callback/github"
        }
      }
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
              password: "minku_123", 
            },
          });
        }

        user.id = dbUser.id;
      }
      return true; 
    },

    async jwt({ token, user }) {
      // Attach user information to the token
      if (user) {
        token.id = Number(user.id); 
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
          id: token.id, // `id` is a number (database ID)
          name: token.name,
          email: token.email,
          image: token.image,
        };
      }
      return session;
    },

    async redirect({ url, baseUrl }) {
      // If the URL is a relative path (starts with /), redirect to it
      if (url.startsWith('/')) {
        return url;
      }
      // If the URL is within our base URL, redirect to it
      if (url.startsWith(baseUrl)) {
        return url;
      }
      // Default to /account if no specific redirect is requested
      return `${baseUrl}/account`;
    }
  },

  pages: {
    signIn: "/auth/signin",
  },
});

export const GET = authHandler;
export const POST = authHandler;