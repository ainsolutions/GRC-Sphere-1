"use server"

import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { getSession } from "@/lib/sessionHelper";
import { cookies } from "next/headers";
import { SessionEnum } from "@/lib/enums/sessionEnum";


export async function auth_middleware(req: NextRequest){

const { pathname } = req.nextUrl;

  // Skip middleware for Next.js internals and static files
  if (
    pathname.startsWith("/_next") ||
    pathname.startsWith("/api/auth") || // your auth APIs
    pathname.startsWith("/login") ||
    pathname.startsWith("/favicon.ico")
  ) {
    if(pathname.startsWith("/login")){
      (await cookies()).delete(SessionEnum.SESSION_TOKEN_COOKIE_NAME);
      (await cookies()).delete(SessionEnum.SCHEMA_ID_COOKIE_NAME);
    }
    return NextResponse.next();
  }

  // Check session
  const session = await getSession();
  if (!session) {
    return NextResponse.redirect(new URL("/login", req.url));
  }
  
  const requestHeaders = new Headers(req.headers);
  requestHeaders.set("x-schema-id", session.schemaid);
  requestHeaders.set("x-current-session", JSON.stringify(session));

  return NextResponse.next({
    request:{
      headers: requestHeaders,
    }
  });
}

export const config = {
  matcher: ["/((?!_next/static|_next/image|favicon.ico).*)"],
};
