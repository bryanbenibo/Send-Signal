import NextAuth from "next-auth"
import type { NextAuthConfig } from "next-auth"

const authConfig = {
  providers: [],
  pages: {
    signIn: "/login",
  },
  callbacks: {
    authorized({ auth, request: { nextUrl } }) {
      const isLoggedIn = !!auth?.user
      const isDashboardRoute = nextUrl.pathname.startsWith("/dashboard")
      
      if (isDashboardRoute) {
        if (isLoggedIn) return true
        return false // Redirects to login
      }
      
      const isAuthRoute = nextUrl.pathname.startsWith("/login") || nextUrl.pathname.startsWith("/signup")
      if (isLoggedIn && isAuthRoute) {
        return Response.redirect(new URL("/dashboard", nextUrl))
      }
      
      return true
    },
  },
} satisfies NextAuthConfig

const { auth } = NextAuth(authConfig)
export default auth

export const config = {
  matcher: ['/((?!api|_next/static|_next/image|favicon.ico).*)'],
}
