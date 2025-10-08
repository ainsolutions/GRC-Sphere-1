'use server'

import { db, initSchemaDBClient } from "./db";
import { cookies } from "next/headers";
import { randomBytes } from "crypto";
import { SessionEnum } from "@/lib/enums/sessionEnum";


const SESSION_COOKIE_NAME = "randomTick";
let schemaDB: any = "";


export async function createSession(userObj: any) {
    schemaDB = await initSchemaDBClient(userObj.schemaid);

    const token = randomBytes(32).toString("hex");
    // const expiresAt = new Date(Date.now() + 1000 + 60 * 60 * 24).toISOString();
    
    // const InsertSessionStmt: string = `INSERT INTO sessions (user_id, token, expires_at) VALUES (${userId}, '${token}', NOW() + interval '1 day')`; //5 minutes
    await schemaDB `INSERT INTO sessions (user_id, token, expires_at,session_data) VALUES (${userObj.id}, ${token}, NOW() + interval '1 day', ${JSON.stringify(userObj)})`;
    // await queryWithSchema("INSERT INTO {{schema}}.sessions (user_id, token, expires_at) VALUES ($1, $2, NOW() + interval '1 day')", [userId, token]);

    (await cookies()).set(SessionEnum.SESSION_TOKEN_COOKIE_NAME, token, {
        httpOnly: false,
        secure: false,
        sameSite: "lax",
        maxAge: 60 * 60 * 5,
        path: "/"
    });

    (await cookies()).set(SessionEnum.SCHEMA_ID_COOKIE_NAME, userObj.schemaid, {
        httpOnly: false,
        secure: false,
        sameSite: "lax",
        maxAge: 60 * 60 * 5,
        path: "/"
    });

}

export async function getSession() {
    const token = (await cookies()).get(SessionEnum.SESSION_TOKEN_COOKIE_NAME)?.value;

    const schemaid = (await cookies()).get(SessionEnum.SCHEMA_ID_COOKIE_NAME)?.value;

    if (!token || !schemaid) return null;

    schemaDB = await initSchemaDBClient(schemaid);


    // const GetSessionStmt: string = `SELECT user_id,expires_at FROM sessions WHERE token = ${token}`;
    const result = await schemaDB `SELECT user_id,session_data,expires_at FROM sessions WHERE token = ${token}`;
    // const result = await queryWithSchema("SELECT user_id,expires_at FROM {{schema}}.sessions WHERE token = $1",[token]);

    if (result.length === 0) return null;
    
    const session = result[0];
    const userId = session.user_id;

    if (new Date(session.expires_at) < new Date()) {
        // const deleteSessionQuery: string = `DELETE FROM sessions Where token = ${token}`;
        await schemaDB `DELETE FROM sessions Where token = ${token}`;
        return null;
    }

    const userObj = JSON.parse(session.session_data);

    return userObj;

}

export async function destroySession() {
    const schemaid = (await cookies()).get(SessionEnum.SCHEMA_ID_COOKIE_NAME)?.value as string;

    schemaDB = await initSchemaDBClient(schemaid);
    const token = (await cookies()).get(SessionEnum.SESSION_TOKEN_COOKIE_NAME)?.value;
    if (!token) return;
    // const deleteSessionQuery: string = `DELETE FROM sessions Where token = ${token}`;
    await schemaDB `DELETE FROM sessions Where token = ${token}`;

    (await cookies()).delete(SessionEnum.SESSION_TOKEN_COOKIE_NAME);
    (await cookies()).delete(SessionEnum.SCHEMA_ID_COOKIE_NAME);
}
