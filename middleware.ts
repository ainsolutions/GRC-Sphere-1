// middleware.ts
import type { NextRequest } from "next/server";
import { auth_middleware } from "@/lib/auth-middleware";

export function middleware(req: NextRequest) {
  return auth_middleware(req);
}
