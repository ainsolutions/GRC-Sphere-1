import { NextResponse } from "next/server";
import { withContext } from "@/lib/HttpContext";
import { spawn } from "child_process";
import path from "path";

export const POST = withContext(async ({ tenantDb }, request) => {
  try {
    const body = await request.json();
    const { vulnerability_id } = body;

    if (!vulnerability_id) {
      return NextResponse.json(
        { success: false, error: "vulnerability_id is required" },
        { status: 400 }
      );
    }

    // Check if vulnerability exists
    const vulnerability = await tenantDb`
      SELECT id, name, cve_id, assets 
      FROM vulnerabilities 
      WHERE id = ${vulnerability_id}
    ` as Record<string, any>[];

    if (vulnerability.length === 0) {
      return NextResponse.json(
        { success: false, error: "Vulnerability not found" },
        { status: 404 }
      );
    }

    // Path to Python script
    const scriptPath = path.join(process.cwd(), "scripts", "epss_calculator.py");

    // Execute Python script
    const result = await new Promise<any>((resolve, reject) => {
      const pythonProcess = spawn("python3", [scriptPath, vulnerability_id.toString()], {
        env: {
          ...process.env,
          DB_HOST: process.env.DB_HOST || "localhost",
          DB_PORT: process.env.DB_PORT || "5432",
          DB_NAME: process.env.DB_NAME,
          DB_USER: process.env.DB_USER,
          DB_PASSWORD: process.env.DB_PASSWORD,
        },
      });

      let stdout = "";
      let stderr = "";

      pythonProcess.stdout.on("data", (data) => {
        stdout += data.toString();
      });

      pythonProcess.stderr.on("data", (data) => {
        stderr += data.toString();
      });

      pythonProcess.on("close", (code) => {
        if (code === 0) {
          try {
            const result = JSON.parse(stdout);
            resolve(result);
          } catch (e) {
            reject(new Error(`Failed to parse Python output: ${stdout}`));
          }
        } else {
          reject(new Error(`Python script failed with code ${code}: ${stderr}`));
        }
      });

      pythonProcess.on("error", (error) => {
        reject(new Error(`Failed to start Python process: ${error.message}`));
      });
    });

    return NextResponse.json(result);
  } catch (error) {
    console.error("EPSS calculation error:", error);
    return NextResponse.json(
      {
        success: false,
        error: error instanceof Error ? error.message : "Unknown error",
        message: "Failed to calculate EPSS score",
      },
      { status: 500 }
    );
  }
});

// Batch calculation endpoint
export const PUT = withContext(async ({ tenantDb }, request) => {
  try {
    const body = await request.json();
    const { vulnerability_ids } = body;

    if (!Array.isArray(vulnerability_ids) || vulnerability_ids.length === 0) {
      return NextResponse.json(
        { success: false, error: "vulnerability_ids array is required" },
        { status: 400 }
      );
    }

    const results = [];
    const scriptPath = path.join(process.cwd(), "scripts", "epss_calculator.py");

    for (const vulnerability_id of vulnerability_ids) {
      try {
        const result = await new Promise<any>((resolve, reject) => {
          const pythonProcess = spawn("python3", [scriptPath, vulnerability_id.toString()], {
            env: {
              ...process.env,
              DB_HOST: process.env.DB_HOST || "localhost",
              DB_PORT: process.env.DB_PORT || "5432",
              DB_NAME: process.env.DB_NAME,
              DB_USER: process.env.DB_USER,
              DB_PASSWORD: process.env.DB_PASSWORD,
            },
          });

          let stdout = "";
          let stderr = "";

          pythonProcess.stdout.on("data", (data) => {
            stdout += data.toString();
          });

          pythonProcess.stderr.on("data", (data) => {
            stderr += data.toString();
          });

          pythonProcess.on("close", (code) => {
            if (code === 0) {
              try {
                const result = JSON.parse(stdout);
                resolve(result);
              } catch (e) {
                resolve({
                  success: false,
                  vulnerability_id,
                  error: "Failed to parse output",
                });
              }
            } else {
              resolve({
                success: false,
                vulnerability_id,
                error: `Script failed with code ${code}`,
              });
            }
          });

          pythonProcess.on("error", (error) => {
            resolve({
              success: false,
              vulnerability_id,
              error: error.message,
            });
          });
        });

        results.push(result);
      } catch (error) {
        results.push({
          success: false,
          vulnerability_id,
          error: error instanceof Error ? error.message : "Unknown error",
        });
      }
    }

    const successCount = results.filter((r) => r.success).length;
    const failCount = results.filter((r) => !r.success).length;

    return NextResponse.json({
      success: true,
      total: vulnerability_ids.length,
      successful: successCount,
      failed: failCount,
      results,
      message: `Processed ${vulnerability_ids.length} vulnerabilities: ${successCount} successful, ${failCount} failed`,
    });
  } catch (error) {
    console.error("Batch EPSS calculation error:", error);
    return NextResponse.json(
      {
        success: false,
        error: error instanceof Error ? error.message : "Unknown error",
        message: "Failed to calculate EPSS scores",
      },
      { status: 500 }
    );
  }
});


