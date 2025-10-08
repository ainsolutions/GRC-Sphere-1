import { NextRequest,NextResponse } from "next/server";
import { destroySession } from "@/lib/sessionHelper";
import { withContext } from "@/lib/HttpContext";

export const POST= withContext(async ({}, request: Request) => {
    
    //await destroySession(); //add for fixation
    return NextResponse.redirect(new URL("/login", request.url));
    // return NextResponse.json({ success: true });
})
