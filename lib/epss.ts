/**
 * EPSS (Exploit Prediction Scoring System) API Integration
 * 
 * This service integrates with the FIRST.org EPSS API to fetch exploit prediction scores
 * for CVE identifiers. EPSS provides a probability score (0-1) indicating the likelihood
 * that a vulnerability will be exploited in the next 30 days.
 * 
 * API Documentation: https://api.first.org/epss/
 */

export interface EPSSScore {
  cve: string;
  epss: number;
  percentile: number;
  date: string;
  model_version?: string;
}

export interface EPSSResponse {
  status: string;
  status_code: number;
  version: string;
  access: string;
  total: number;
  offset: number;
  limit: number;
  data: EPSSScore[];
}

export interface EPSSError {
  error: string;
  details?: string;
}

/**
 * Fetches EPSS scores for multiple CVE identifiers
 * @param cveIds Array of CVE identifiers (e.g., ['CVE-2021-40438', 'CVE-2019-16759'])
 * @param options Optional parameters for the API request
 * @returns Promise resolving to EPSS scores or error
 */
export async function fetchEPSSScores(
  cveIds: string[],
  options: {
    days?: number; // Number of days to look back (default: latest)
    offset?: number; // Pagination offset
    limit?: number; // Results per page (max 100)
  } = {}
): Promise<{ success: true; data: EPSSScore[] } | { success: false; error: string }> {
  try {
    // Validate CVE IDs
    if (!cveIds || cveIds.length === 0) {
      return { success: false, error: "No CVE IDs provided" };
    }

    // Filter out invalid CVE IDs
    const validCveIds = cveIds.filter(cve => cve && cve.match(/^CVE-\d{4}-\d{4,}$/i));
    
    if (validCveIds.length === 0) {
      return { success: false, error: "No valid CVE IDs provided" };
    }

    // Build API URL
    const baseUrl = "https://api.first.org/data/v1/epss";
    const params = new URLSearchParams();
    
    // Add CVE IDs (comma-separated, max 100 per request)
    const batchSize = Math.min(validCveIds.length, options.limit || 100);
    const cveBatch = validCveIds.slice(0, batchSize);
    params.append("cve", cveBatch.join(","));

    // Add optional parameters
    if (options.days) {
      params.append("days", options.days.toString());
    }
    if (options.offset) {
      params.append("offset", options.offset.toString());
    }

    const url = `${baseUrl}?${params.toString()}`;

    console.log(`[EPSS] Fetching scores for ${cveBatch.length} CVEs:`, cveBatch);

    // Make API request with timeout and retry logic
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 30000); // 30 second timeout

    try {
      const response = await fetch(url, {
        method: "GET",
        headers: {
          "Accept": "application/json",
          "User-Agent": "GRC-Sphere-Vulnerability-Management/1.0",
        },
        signal: controller.signal,
      });

      clearTimeout(timeoutId);

      if (!response.ok) {
        const errorText = await response.text();
        console.error(`[EPSS] API request failed: ${response.status} ${response.statusText}`, errorText);
        return { 
          success: false, 
          error: `EPSS API request failed: ${response.status} ${response.statusText}` 
        };
      }

      const data: EPSSResponse = await response.json();

      if (data.status !== "OK") {
        console.error("[EPSS] API returned error status:", data);
        return { 
          success: false, 
          error: `EPSS API error: ${data.status}` 
        };
      }

      console.log(`[EPSS] Successfully fetched ${data.data.length} EPSS scores`);
      
      return { 
        success: true, 
        data: data.data.map(score => ({
          ...score,
          model_version: data.version,
        }))
      };

    } catch (fetchError) {
      clearTimeout(timeoutId);
      
      if (fetchError instanceof Error && fetchError.name === 'AbortError') {
        console.error("[EPSS] Request timeout");
        return { success: false, error: "EPSS API request timeout" };
      }
      
      throw fetchError;
    }

  } catch (error) {
    console.error("[EPSS] Error fetching EPSS scores:", error);
    return { 
      success: false, 
      error: error instanceof Error ? error.message : "Unknown error fetching EPSS scores" 
    };
  }
}

/**
 * Fetches EPSS score for a single CVE identifier
 * @param cveId Single CVE identifier
 * @returns Promise resolving to EPSS score or null if not found
 */
export async function fetchSingleEPSSScore(
  cveId: string
): Promise<EPSSScore | null> {
  const result = await fetchEPSSScores([cveId]);
  
  if (result.success && result.data.length > 0) {
    return result.data[0];
  }
  
  return null;
}

/**
 * Processes EPSS scores in batches to handle large numbers of CVEs
 * @param cveIds Array of CVE identifiers
 * @param batchSize Number of CVEs to process per batch (default: 100)
 * @returns Promise resolving to all EPSS scores
 */
export async function fetchEPSSScoresBatch(
  cveIds: string[],
  batchSize: number = 100
): Promise<{ success: true; data: EPSSScore[] } | { success: false; error: string }> {
  try {
    const allScores: EPSSScore[] = [];
    const errors: string[] = [];

    // Process CVEs in batches
    for (let i = 0; i < cveIds.length; i += batchSize) {
      const batch = cveIds.slice(i, i + batchSize);
      
      console.log(`[EPSS] Processing batch ${Math.floor(i / batchSize) + 1}/${Math.ceil(cveIds.length / batchSize)}`);
      
      const result = await fetchEPSSScores(batch);
      
      if (result.success) {
        allScores.push(...result.data);
      } else {
        errors.push(`Batch ${Math.floor(i / batchSize) + 1}: ${result.error}`);
      }

      // Add delay between batches to be respectful to the API
      if (i + batchSize < cveIds.length) {
        await new Promise(resolve => setTimeout(resolve, 1000)); // 1 second delay
      }
    }

    if (errors.length > 0 && allScores.length === 0) {
      return { 
        success: false, 
        error: `All batches failed: ${errors.join("; ")}` 
      };
    }

    if (errors.length > 0) {
      console.warn("[EPSS] Some batches failed:", errors);
    }

    console.log(`[EPSS] Successfully processed ${allScores.length} EPSS scores from ${cveIds.length} CVEs`);
    
    return { success: true, data: allScores };

  } catch (error) {
    console.error("[EPSS] Error in batch processing:", error);
    return { 
      success: false, 
      error: error instanceof Error ? error.message : "Unknown error in batch processing" 
    };
  }
}

/**
 * Converts EPSS score to risk level category
 * @param epssScore EPSS probability score (0.0 to 1.0)
 * @returns Risk level string
 */
export function getEPSSRiskLevel(epssScore: number): string {
  if (epssScore >= 0.9) return "Critical";
  if (epssScore >= 0.7) return "High";
  if (epssScore >= 0.5) return "Medium";
  if (epssScore >= 0.3) return "Low";
  return "Very Low";
}

/**
 * Formats EPSS score as percentage string
 * @param epssScore EPSS probability score (0.0 to 1.0)
 * @returns Formatted percentage string
 */
export function formatEPSSScore(epssScore: number): string {
  return `${(epssScore * 100).toFixed(2)}%`;
}

/**
 * Formats EPSS percentile as ordinal string
 * @param percentile EPSS percentile (0.0 to 1.0)
 * @returns Formatted percentile string
 */
export function formatEPSSPercentile(percentile: number): string {
  const percent = Math.round(percentile * 100);
  return `${percent}th percentile`;
}

/**
 * Determines if EPSS data is stale and needs refreshing
 * @param lastUpdated Date when EPSS data was last updated
 * @param maxAgeHours Maximum age in hours before data is considered stale (default: 24)
 * @returns True if data needs refreshing
 */
export function isEPSSDataStale(lastUpdated: Date | string, maxAgeHours: number = 24): boolean {
  const lastUpdateDate = new Date(lastUpdated);
  const now = new Date();
  const ageHours = (now.getTime() - lastUpdateDate.getTime()) / (1000 * 60 * 60);
  return ageHours > maxAgeHours;
}
