import { NextResponse, type NextRequest } from "next/server";
import { updateSession } from "@/lib/supabase/middleware";

const PUBLIC_ADMIN_PATHS = ["/admin/login", "/admin/inscription"];

/**
 * Refreshes the Supabase session cookie on every request so Server
 * Components always see a valid session (they cannot write cookies
 * themselves), and redirects unauthenticated `/admin/**` requests to
 * `/admin/login` (except the login/signup pages themselves).
 */
export async function middleware(request: NextRequest) {
  const { response, user } = await updateSession(request);

  const { pathname } = request.nextUrl;
  const isAdminRoute = pathname === "/admin" || pathname.startsWith("/admin/");
  const isPublicAdminPath = PUBLIC_ADMIN_PATHS.some((p) => pathname === p || pathname.startsWith(`${p}/`));

  if (isAdminRoute && !isPublicAdminPath && !user) {
    const loginUrl = new URL("/admin/login", request.url);
    return NextResponse.redirect(loginUrl);
  }

  return response;
}

export const config = {
  matcher: [
    "/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)",
  ],
};
