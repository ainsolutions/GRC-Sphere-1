import { NextRequest, NextResponse } from "next/server";
import { db, initSchemaDBClient } from "./db";
import { neon } from "@neondatabase/serverless";
import { cookies } from "next/headers";
import { SessionEnum } from "@/lib/enums/sessionEnum";

export type HttpSessionContext = {
  userId: string;
  schemaId: string;
  sessionData: any;
  tenantDb: ReturnType<typeof neon>;
};
/* routeParams?: { params: Record<string, string> } */
type Handler = (httpSessionContextObj: HttpSessionContext, request: Request, ...args: any[]) => Promise<Response | NextResponse<any>>;

export function withContext(handler: Handler) {
    return async (req: Request, ...args: any[]) => {
        try {

            if (req.url.includes('/api/auth/login') || req.url.includes('/api/auth/logout')) {
                (await cookies()).delete(SessionEnum.SESSION_TOKEN_COOKIE_NAME);
                (await cookies()).delete(SessionEnum.SCHEMA_ID_COOKIE_NAME);

                return handler({
                    userId: "",
                    schemaId: "",
                    sessionData: null,
                    tenantDb: null as unknown as ReturnType<typeof neon>, // Type assertion
                }, req, ...args);
            }

            const schemaId = req.headers.get("x-schema-id") as string;
            if (!schemaId) {
                throw new Error(`No schemaId`);
            }
            const _tenantDb = await initSchemaDBClient(schemaId);

            if (!_tenantDb) {
                throw new Error(`No DB client could be created for schemaId=${schemaId}`);
            }
            const sessionAsString = req.headers.get("x-current-session") as string;
            const sessionObj = JSON.parse(sessionAsString);
            
            const context: HttpSessionContext = {
                sessionData: sessionObj,
                userId: sessionObj.id,
                schemaId,
                tenantDb: _tenantDb
            };

            return handler(context, req, ...args);
        } catch (err) {

            console.error("withContext error:", err);
            return NextResponse.json({ success: false, error: "Internal server error" }, { status: 500 });
        }
    }
}
