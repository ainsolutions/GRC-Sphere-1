import { NextRequest, NextResponse } from "next/server";
import { withContext, HttpSessionContext } from "@/lib/HttpContext";

// ✅ All DB (server-side) queries come from the *server* module
import {
  getCRIControl,
  listCRIControls
} from "@/lib/actions/cyber-maturity-server";

import { createCRIControl } from "@/lib/actions/cyber-maturity-client";

/* ------------------------------------------------------------------ */
/*  Types                                                             */
/* ------------------------------------------------------------------ */
interface CRIControl {
  id: number;
  control_id: string;
  control_name: string;
  domain: string;
  control_objective: string;
  maturity_level_1?: string;
  maturity_level_2?: string;
  maturity_level_3?: string;
  maturity_level_4?: string;
  maturity_level_5?: string;
}

/* ------------------------------------------------------------------ */
/*  GET – list ALL CRI controls OR fetch single if `id` is provided    */
/* ------------------------------------------------------------------ */
export const GET = withContext(
  async (
    { tenantDb }: HttpSessionContext,
    req,
    { params }: { params?: { id?: string } } = {}
  ) => {
    try {
      // If this route is called as /api/cri-controls/[id], params.id will exist
      const controlId = params?.id ? Number(params.id) : undefined;

      if (controlId !== undefined) {
        if (isNaN(controlId)) {
          return NextResponse.json(
            { success: false, error: "Invalid CRI control ID" },
            { status: 400 }
          );
        }
        const row = await getCRIControl(tenantDb, controlId);
        if (!row) {
          return NextResponse.json(
            { success: false, error: "CRI control not found" },
            { status: 404 }
          );
        }
        return NextResponse.json({ success: true, data: row });
      }

      // No id → list all controls
      const allControls = await listCRIControls(tenantDb);
      return NextResponse.json({
        success: true,
        data: allControls,
        count: allControls.length,
      });
    } catch (err) {
      console.error("Error listing/fetching CRI controls:", err);
      return NextResponse.json(
        { success: false, error: (err as Error).message },
        { status: 500 }
      );
    }
  }
);

/* ------------------------------------------------------------------ */
/*  POST – create a new CRI control                                    */
/* ------------------------------------------------------------------ */
export const POST = withContext(
  async ({ tenantDb }: HttpSessionContext, req) => {
    try {
      const body = await req.json();

      // Validate required fields
      const required = ["control_id", "control_name", "domain", "control_objective"] as const;
      for (const field of required) {
        if (!body[field]) {
          return NextResponse.json(
            { success: false, error: `${field} is required` },
            { status: 400 }
          );
        }
      }

      const payload = {
        control_id: body.control_id,
        control_name: body.control_name,
        domain: body.domain,
        control_objective: body.control_objective,
        maturity_level_1: body.maturity_level_1 ?? "",
        maturity_level_2: body.maturity_level_2 ?? "",
        maturity_level_3: body.maturity_level_3 ?? "",
        maturity_level_4: body.maturity_level_4 ?? "",
        maturity_level_5: body.maturity_level_5 ?? "",
      };

      const newControl = await createCRIControl(tenantDb, payload);

      return NextResponse.json({
        success: true,
        data: newControl,
        message: "CRI control created successfully",
      });
    } catch (err) {
      console.error("Error creating CRI control:", err);
      return NextResponse.json(
        { success: false, error: (err as Error).message },
        { status: 500 }
      );
    }
  }
);
