import { NextRequest, NextResponse } from "next/server";
import { withContext } from "@/lib/HttpContext"
import { fetchEPSSScoresBatch, EPSSScore, isEPSSDataStale } from "@/lib/epss";

/**
 * GET /api/vulnerabilities/epss
 * Fetches and updates EPSS scores for all vulnerabilities with CVE IDs
 */
export const GET = withContext(async({ tenantDb }, request) => {
  try {

    const { searchParams } = new URL(request.url);
    const forceRefresh = searchParams.get("force") === "true";
    const cveId = searchParams.get("cve");

    // If specific CVE requested, handle single CVE
    if (cveId) {
      return handleSingleCVE(tenantDb, cveId, forceRefresh);
    }

    // Get all vulnerabilities with CVE IDs
    const vulnerabilities = await tenantDb`
      SELECT id, cve_id, epss_score, epss_percentile, epss_last_updated
      FROM vulnerabilities 
      WHERE cve_id IS NOT NULL 
      AND cve_id != ''
      AND cve_id ~ '^CVE-[0-9]{4}-[0-9]{4,}$'
    ` as Record<string, any>[];

    if (vulnerabilities.length === 0) {
      return NextResponse.json({
        success: true,
        message: "No vulnerabilities with valid CVE IDs found",
        updated: 0,
        total: 0,
      });
    }

    console.log(`[EPSS API] Found ${vulnerabilities.length} vulnerabilities with CVE IDs`);

    // Filter vulnerabilities that need EPSS score updates
    type Vulnerability = {
      id: number;
      cve_id: string;
      epss_score: number | null;
      epss_percentile: number | null;
      epss_last_updated: string | null;
    }

    const vulnerabilitiesToUpdate = (vulnerabilities as Vulnerability[]).filter((vuln: Vulnerability) => {
      if (forceRefresh) return true;
      if (!vuln.epss_last_updated) return true;
      return isEPSSDataStale(vuln.epss_last_updated);
    });

    if (vulnerabilitiesToUpdate.length === 0) {
      return NextResponse.json({
        success: true,
        message: "All EPSS scores are up to date",
        updated: 0,
        total: vulnerabilities.length,
      });
    }

    console.log(`[EPSS API] ${vulnerabilitiesToUpdate.length} vulnerabilities need EPSS updates`);

    // Extract CVE IDs
    interface VulnerabilityToUpdate {
      id: number;
      cve_id: string;
      epss_score: number | null;
      epss_percentile: number | null;
      epss_last_updated: string | null;
    }

    const cveIds: string[] = vulnerabilitiesToUpdate.map((v: VulnerabilityToUpdate) => v.cve_id);

    // Fetch EPSS scores in batches
    const epssResult = await fetchEPSSScoresBatch(cveIds, 50); // Smaller batches for better reliability

    if (!epssResult.success) {
      console.error("[EPSS API] Failed to fetch EPSS scores:", epssResult.error);
      return NextResponse.json(
        { 
          error: "Failed to fetch EPSS scores",
          details: epssResult.error 
        },
        { status: 500 }
      );
    }

    const epssScores = epssResult.data;
    console.log(`[EPSS API] Fetched ${epssScores.length} EPSS scores`);

    // Update vulnerabilities with EPSS scores
    let updatedCount = 0;
    const updatePromises = epssScores.map(async (score: EPSSScore) => {
      try {
        const result = await tenantDb`
          UPDATE vulnerabilities 
          SET 
            epss_score = ${score.epss},
            epss_percentile = ${score.percentile},
            epss_last_updated = CURRENT_TIMESTAMP,
            epss_model_version = ${score.model_version || null}
          WHERE cve_id = ${score.cve}
        ` as Record<string, any>[];
        
        if (result.length > 0) {
          updatedCount++;
        }
        
        return { success: true, cve: score.cve };
      } catch (error) {
        console.error(`[EPSS API] Error updating vulnerability ${score.cve}:`, error);
        return { success: false, cve: score.cve, error };
      }
    });

    await Promise.all(updatePromises);

    console.log(`[EPSS API] Successfully updated ${updatedCount} vulnerabilities`);

    return NextResponse.json({
      success: true,
      message: `Updated EPSS scores for ${updatedCount} vulnerabilities`,
      updated: updatedCount,
      total: vulnerabilities.length,
      fetched: epssScores.length,
      processed: vulnerabilitiesToUpdate.length,
    });

  } catch (error) {
    console.error("[EPSS API] Error in GET handler:", error);
    return NextResponse.json(
      { 
        error: "Internal server error",
        details: error instanceof Error ? error.message : "Unknown error"
      },
      { status: 500 }
    );
  }
});

/**
 * POST /api/vulnerabilities/epss
 * Updates EPSS scores for specific CVE IDs
 */
export const POST = withContext(async( {tenantDb }, request) => {
  try {
    const body = await request.json();
    const { cveIds } = body;

    if (!cveIds || !Array.isArray(cveIds) || cveIds.length === 0) {
      return NextResponse.json(
        { error: "CVE IDs array is required" },
        { status: 400 }
      );
    }

    console.log(`[EPSS API] POST request for ${cveIds.length} CVE IDs`);

    // Validate CVE ID format
    const validCveIds = cveIds.filter(cve => 
      typeof cve === 'string' && cve.match(/^CVE-\d{4}-\d{4,}$/i)
    );

    if (validCveIds.length === 0) {
      return NextResponse.json(
        { error: "No valid CVE IDs provided" },
        { status: 400 }
      );
    }

    // Fetch EPSS scores
    const epssResult = await fetchEPSSScoresBatch(validCveIds);

    if (!epssResult.success) {
      return NextResponse.json(
        { 
          error: "Failed to fetch EPSS scores",
          details: epssResult.error 
        },
        { status: 500 }
      );
    }

    const epssScores = epssResult.data;

    // Update vulnerabilities with EPSS scores
    let updatedCount = 0;
    const results = [];

    for (const score of epssScores) {
      try {
        const result = await tenantDb`
          UPDATE vulnerabilities 
          SET 
            epss_score = ${score.epss},
            epss_percentile = ${score.percentile},
            epss_last_updated = CURRENT_TIMESTAMP,
            epss_model_version = ${score.model_version || null}
          WHERE cve_id = ${score.cve}
        ` as Record<string, any>[];
        
        if (result.length > 0) {
          updatedCount++;
          results.push({ cve: score.cve, success: true, score: score.epss, percentile: score.percentile });
        } else {
          results.push({ cve: score.cve, success: false, error: "CVE not found in vulnerabilities table" });
        }
      } catch (error) {
        console.error(`[EPSS API] Error updating ${score.cve}:`, error);
        results.push({ 
          cve: score.cve, 
          success: false, 
          error: error instanceof Error ? error.message : "Update failed" 
        });
      }
    }

    return NextResponse.json({
      success: true,
      message: `Updated EPSS scores for ${updatedCount} vulnerabilities`,
      updated: updatedCount,
      requested: validCveIds.length,
      fetched: epssScores.length,
      results,
    });

  } catch (error) {
    console.error("[EPSS API] Error in POST handler:", error);
    return NextResponse.json(
      { 
        error: "Internal server error",
        details: error instanceof Error ? error.message : "Unknown error"
      },
      { status: 500 }
    );
  }
});

/**
 * Handle single CVE EPSS score request
 */
async function handleSingleCVE(sql: any, cveId: string, forceRefresh: boolean) {
  try {
    // Validate CVE ID format
    if (!cveId.match(/^CVE-\d{4}-\d{4,}$/i)) {
      return NextResponse.json(
        { error: "Invalid CVE ID format" },
        { status: 400 }
      );
    }

    // Get current vulnerability data
    const vulnerability = await sql`
      SELECT id, cve_id, epss_score, epss_percentile, epss_last_updated, epss_model_version
      FROM vulnerabilities 
      WHERE cve_id = ${cveId}
    `;

    if (vulnerability.length === 0) {
      return NextResponse.json(
        { error: "CVE not found in vulnerabilities table" },
        { status: 404 }
      );
    }

    const vuln = vulnerability[0];

    // Check if update is needed
    if (!forceRefresh && vuln.epss_last_updated && !isEPSSDataStale(vuln.epss_last_updated)) {
      return NextResponse.json({
        success: true,
        message: "EPSS score is up to date",
        data: {
          cve: vuln.cve_id,
          epss_score: vuln.epss_score,
          epss_percentile: vuln.epss_percentile,
          last_updated: vuln.epss_last_updated,
          model_version: vuln.epss_model_version,
        },
      });
    }

    // Fetch fresh EPSS score
    const epssResult = await fetchEPSSScoresBatch([cveId], 1);

    if (!epssResult.success) {
      return NextResponse.json(
        { 
          error: "Failed to fetch EPSS score",
          details: epssResult.error 
        },
        { status: 500 }
      );
    }

    if (epssResult.data.length === 0) {
      return NextResponse.json(
        { error: "EPSS score not found for this CVE" },
        { status: 404 }
      );
    }

    const epssScore = epssResult.data[0];

    // Update vulnerability
    await sql`
      UPDATE vulnerabilities 
      SET 
        epss_score = ${epssScore.epss},
        epss_percentile = ${epssScore.percentile},
        epss_last_updated = CURRENT_TIMESTAMP,
        epss_model_version = ${epssScore.model_version || null}
      WHERE cve_id = ${cveId}
    `;

    return NextResponse.json({
      success: true,
      message: "EPSS score updated successfully",
      data: {
        cve: epssScore.cve,
        epss_score: epssScore.epss,
        epss_percentile: epssScore.percentile,
        last_updated: new Date().toISOString(),
        model_version: epssScore.model_version,
      },
    });

  } catch (error) {
    console.error(`[EPSS API] Error handling single CVE ${cveId}:`, error);
    return NextResponse.json(
      { 
        error: "Internal server error",
        details: error instanceof Error ? error.message : "Unknown error"
      },
      { status: 500 }
    );
  }
}
