import { neon } from "@neondatabase/serverless";

export const db = neon(process.env.DATABASE_URL!)

const schema = process.env.TENANT_SCHEMA_NAME || "public";

type DbClient = ReturnType<typeof neon>;

const clientCache: Map<string,DbClient> = new Map();

export async function initSchemaDBClient(schemaId: string){
    if(!schemaId){
        throw new Error("Schema id cannot be empty");
    }
    // return neon(schema[0].connectionstring);
    if (!clientCache.has(schemaId)) {
        const schema = await db`SELECT id,schemaname, connectionstring FROM organization_schemas WHERE id = ${schemaId}`;
        
        if (schema.length === 0) {
            throw new Error(`No schema found for id=${schemaId}`);
        }


        let connString = schema[0].connectionstring as string;
        clientCache.set(schemaId, neon(connString));
    }

    return clientCache.get(schemaId);
}


