import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'
import { getToken } from 'next-auth/jwt'

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl
  const token = await getToken({
    req: request,
    secret: process.env.NEXTAUTH_SECRET
  })

  // Public routes that don't require authentication
  const publicPaths = [
    '/',
    '/auth/signin',
    '/auth/signup',
    '/api/auth/.*' // Allow NextAuth API routes
  ]

  // Check if the path is public
  const isPublic = publicPaths.some((path) => 
    new RegExp(`^${path}$`.replace('*', '.*')).test(pathname)
  )

  // Redirect authenticated users from auth pages to account
  if (token && pathname.startsWith('/auth')) {
    return NextResponse.redirect(new URL('/account', request.url))
  }

  // Handle private routes
  if (!isPublic && !token) {
    return NextResponse.redirect(
      new URL(`/auth/signin?callbackUrl=${encodeURIComponent(request.url)}`, request.url)
    )
  }

  return NextResponse.next()
}

export const config = {
  matcher: [
    '/((?!_next/static|_next/image|favicon.ico).*)',
  ],
} 