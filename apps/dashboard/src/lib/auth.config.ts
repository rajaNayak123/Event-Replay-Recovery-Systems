import type { NextAuthConfig } from "next-auth";

export const authConfig = {
  pages: {
    signIn: "/login",
  },
  callbacks: {
    authorized({ auth, request: { nextUrl } }) {
      const isLoggedIn = !!auth?.user;
      const isPublicRoute = 
        nextUrl.pathname === "/login" || 
        nextUrl.pathname === "/setup" || 
        nextUrl.pathname.startsWith("/api/auth") || 
        nextUrl.pathname.startsWith("/api/setup");

      if (isPublicRoute) {
        if (isLoggedIn && (nextUrl.pathname === "/login" || nextUrl.pathname === "/setup")) {
          return Response.redirect(new URL("/", nextUrl));
        }
        return true;
      }

      return isLoggedIn;
    },
  },
  providers: [], // Full providers defined in auth.ts
} satisfies NextAuthConfig;
