import { auth } from '@/auth'
import { NextResponse } from 'next/server'

export default auth((req) => {
  const { pathname } = req.nextUrl
  const isLoggedIn = !!req.auth

  // Public routes that don't require authentication
  const publicRoutes = ['/login', '/api/auth']

  // Check if the current route is public
  const isPublicRoute = publicRoutes.some(route => pathname.startsWith(route))

  // If not logged in and trying to access a protected route, redirect to login
  if (!isLoggedIn && !isPublicRoute) {
    return NextResponse.redirect(new URL('/login', req.url))
  }

  // If logged in and trying to access login page, redirect to home
  if (isLoggedIn && pathname === '/login') {
    return NextResponse.redirect(new URL('/', req.url))
  }

  return NextResponse.next()
})

export const config = {
  matcher: ['/((?!_next/static|_next/image|favicon.ico).*)']
}
