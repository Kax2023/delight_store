import { withAuth } from "next-auth/middleware";
import { NextResponse } from "next/server";

export default withAuth(
  function middleware(req) {
    const token = req.nextauth.token;
    const path = req.nextUrl.pathname;

    // If user is admin and trying to access non-admin pages, redirect to admin
    if (token?.role === "ADMIN") {
      // Allow access to admin pages and API routes
      if (path.startsWith("/admin") || path.startsWith("/api")) {
        return NextResponse.next();
      }
      // Redirect all other pages (including login/register/home) to admin
      return NextResponse.redirect(new URL("/admin", req.url));
    }

    // If user is not admin and trying to access admin pages, redirect to home
    if (token && token.role !== "ADMIN" && path.startsWith("/admin")) {
      return NextResponse.redirect(new URL("/", req.url));
    }

    return NextResponse.next();
  },
  {
    callbacks: {
      authorized: ({ token, req }) => {
        const path = req.nextUrl.pathname;
        
        // Allow public access to these paths (no auth required)
        if (
          path.startsWith("/api") ||
          path.startsWith("/_next") ||
          path.startsWith("/login") ||
          path.startsWith("/register")
        ) {
          return true;
        }

        // Admin pages require admin role
        if (path.startsWith("/admin")) {
          return !!token && token.role === "ADMIN";
        }

        // All other pages are accessible (middleware will handle admin redirect)
        return true;
      },
    },
  }
);

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - public folder
     */
    "/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)",
  ],
};
