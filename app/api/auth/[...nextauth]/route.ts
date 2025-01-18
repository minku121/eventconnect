import NextAuth from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import GoogleProvider from "next-auth/providers/google";
import GithubProvider from "next-auth/providers/github";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

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
          return { id: user.id.toString(), name: user.name };
        }
        return null; 
      },
    }),

    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENTID as string,
      clientSecret: process.env.GOOGLE_SECRET as string,
      authorization: {
        params: {
          redirect_uri: `${process.env.NEXTAUTH_URL}/api/auth/callback/google`, // Ensure this matches the Google Console configuration
        },
      },
    }),
    GithubProvider({
      clientId: process.env.GITHUB_CLIENTID as string,
      clientSecret: process.env.GITHUB_SECRET as string,
      authorization: {
        params: {
          redirect_uri: `${process.env.NEXTAUTH_URL}/api/auth/callback/github`, // Ensure this matches GitHub's OAuth app settings
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
              password: "minku_123",
            },
          });
        }
      }
      return true; // Allow login
    },

    async session({ session, token }) {
      // Add custom user information to the session
      if (token) {
        //@ts-ignore
        session.user = { id: token.id as string, name: token.name as string, email: token.email as string, image: token.image as string };
      }
      return session;
    },

    async jwt({ token, user }) {
      // Attach user ID to the token
      if (user) {
        token.id = user.id;
      }
      return token;
    },

  
  
  },

  pages:{
    signIn: "/auth/signin",
    signOut: "/auth/signout",
    error: "/auth/error",
   
    
  }
 
});

export const GET = authHandler;
export const POST = authHandler;
