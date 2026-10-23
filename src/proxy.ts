import { getSessionCookie } from "better-auth/cookies";
import { NextResponse, type NextRequest } from "next/server";

/* Optimistic gate for the staff area: no session cookie → the login page.
   It only looks at the cookie; every admin page still calls requireStaff()
   (src/lib/session.ts), which checks the session in the database. */
export function proxy(request: NextRequest) {
  const { pathname, search } = request.nextUrl;
  if (pathname === "/admin/login") return NextResponse.next();
  // The temporary upload test page (removed in sprint 5.3 part B) never exists on a live site.
  // Blocked here, before any page code: inside the streamed staff shell a 404 can't set the status.
  if (process.env.NODE_ENV === "production" && pathname.startsWith("/admin/upload-test")) {
    return new NextResponse("Not found", { status: 404 });
  }
  if (!getSessionCookie(request)) {
    const login = new URL("/admin/login", request.url);
    login.searchParams.set("next", pathname + search);
    return NextResponse.redirect(login);
  }
  return NextResponse.next();
}

export const config = {
  matcher: ["/admin", "/admin/:path*"],
};
