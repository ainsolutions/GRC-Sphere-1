"use client"

export async function getAssets(search?: string) {
  try {
    const params = new URLSearchParams();
    if (search) params.append("search", search);

    const response = await fetch(`/api/assets?${params.toString()}`, {
      method: "GET",
    });

    if (!response.ok) {
      return { success: false, error: `HTTP error ${response.status}` };
    }

    const data = await response.json();
    return data; // { success: true, assets: [...] }
  } catch (error: any) {
    return { success: false, error: error.message || "Failed to fetch assets" };
  }
}


export async function getAssets_Obsolete(searchTerm?: string, limit = 50, offset = 0) {
  try {
    const sql = getDatabase()
    if (!sql) {
      return {
        success: false,
        error: "Database connection not configured",
        data: [],
      }
    }

    let result

    if (searchTerm) {
      result = await sql`
        SELECT
          id,
          asset_id,
          asset_name,
          asset_type,
          classification,
          owner,
          department,
          business_value,
          custodian,
          retention_period,
          disposal_method,
          ip_address,
          model_version,
          confidentiality_level,
          integrity_level,
          availability_level,
          description,
          location,
          model_version,
          created_at,
          updated_at
        FROM assets
        WHERE
          asset_id ILIKE ${`%${searchTerm}%`} OR
          asset_name ILIKE ${`%${searchTerm}%`} OR
          asset_type ILIKE ${`%${searchTerm}%`} OR
          owner ILIKE ${`%${searchTerm}%`} OR
          model_version ILIKE ${`%${searchTerm}%`} OR 
          description ILIKE ${`%${searchTerm}%`}
        ORDER BY created_at DESC 
        LIMIT ${limit} 
        OFFSET ${offset}
      `
    } else {
      result = await sql`
        SELECT
          id,
          asset_id,
          asset_name,
          asset_type,
          classification,
          owner,
          business_value,
          custodian,
          retention_period,
          disposal_method,
          ip_address,
          model_version,
          confidentiality_level,
          integrity_level,
          availability_level,
          description,
          location,
          model_version,
          created_at,
          updated_at
        FROM assets
        ORDER BY created_at DESC 
        LIMIT ${limit} 
        OFFSET ${offset}
      `
    }

    return {
      success: true,
      data: result,
      error: null,
    }
  } catch (error) {
    console.error("Error fetching assets:", error)
    return {
      success: false,
      error: "Failed to fetch assets",
      data: [],
    }
  }
}

export async function createAsset(data: any){
  const response = await fetch("/api/assets", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  })

  return response.json()
}

export async function updateAsset(id: string, assetData: any){  
  const res = await fetch(`/api/assets/${id}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(assetData),
  });
  

  if(!res.ok){
      return {
      success: false,
      error: "Failed to fetch assets",
      data: []
      };
    }

  const json = await res.json();
    return {
      success:true,
      data: json.asset
    };
}

async function updateAsset_Obsolete(id: string, assetData: any) {
  try {
    const sql = getDatabase()
    if (!sql) {
      return {
        success: false,
        error: "Database connection not configured",
      }
    }

    const result = await sql`
      UPDATE assets SET
        asset_id = ${assetData.asset_id},
        asset_name = ${assetData.asset_name},
        asset_type = ${assetData.asset_type},
        classification = ${assetData.classification},
        owner = ${assetData.owner},
        business_value = ${assetData.business_value},
        confidentiality_level = ${assetData.confidentiality_level},
        custodian = ${assetData.custodian},
        retention_period = ${assetData.retention_period},
        disposal_method = ${assetData.disposal_method},
        ip_address = ${assetData.ip_address},
        integrity_level = ${assetData.integrity_level},
        availability_level = ${assetData.availability_level},
        description = ${assetData.description || ""},
        location = ${assetData.location || ""},
        model_version = ${assetData.model_version || ""},
        updated_at = NOW()
      WHERE id = ${id}
      RETURNING *
    `

    if (result.length === 0) {
      return {
        success: false,
        error: "Asset not found",
      }
    }

    return {
      success: true,
      data: result[0],
      error: null,
    }
  } catch (error) {
    console.error("Error updating asset:", error)
    return {
      success: false,
      error: "Failed to update asset",
    }
  }
}

export async function deleteAsset(id: string) {

  const res = await fetch(`/api/assets/${id}`, { method: "DELETE" });

  if(!res.ok){
      return {
      success: false,
      error: "Failed to fetch assets",
      data: []
      };
    }

  // const json = await res.json();
    return {
      success:true
    };
}

async function deleteAsset_Obsolete(id: string) {
  try {
    const sql = getDatabase()
    if (!sql) {
      return {
        success: false,
        error: "Database connection not configured",
      }
    }

    const result = await sql`
      DELETE FROM assets 
      WHERE id = ${id}
      RETURNING *
    `

    if (result.length === 0) {
      return {
        success: false,
        error: "Asset not found",
      }
    }

    return {
      success: true,
      data: result[0],
      error: null,
    }
  } catch (error) {
    console.error("Error deleting asset:", error)
    return {
      success: false,
      error: "Failed to delete asset",
    }
  }
}

export async function createAssetFromChatbot(assetData: any) {
  
    const assetId = assetData.asset_id || `AST-${Date.now().toString().slice(-6)}`
    assetData.asset_id = assetId;
    console.log("Creating asset from chatbot with data:", assetData)
    return await createAsset(assetData);
}

async function createAssetFromChatbot_Obsolete(assetData: any) {
  try {
    const sql = getDatabase()
    if (!sql) {
      return {
        success: false,
        error: "Database connection not configured",
      }
    }

    // Generate asset ID if not provided
    const assetId = assetData.asset_id || `AST-${Date.now().toString().slice(-6)}`

    console.log("Creating asset from chatbot with data:", assetData)

    const result = await sql`
      INSERT INTO assets (
        asset_id,
        asset_name,
        asset_type,
        classification, 
        custodian,
        retention_period,
        disposal_method,
        ip_address,
        model_version,
        owner,
        business_value,
        confidentiality_level,
        integrity_level,
        availability_level,
        description,
        location
      ) VALUES (
        ${assetId},
        ${assetData.asset_name},
        ${assetData.asset_type},
        ${assetData.classification},
        ${assetData.custodian},
        ${assetData.retention_period},
        ${assetData.disposal_method},
        ${assetData.ip_address},
        ${assetData.model_version},
        ${assetData.owner},
        ${assetData.business_value},
        ${Number.parseInt(assetData.confidentiality_level) || 1},
        ${Number.parseInt(assetData.integrity_level) || 1},
        ${Number.parseInt(assetData.availability_level) || 1},
        ${assetData.description || ""},
        ${assetData.location || ""}
      )
      RETURNING *
    `

    console.log("Asset created successfully:", result[0])

    return {
      success: true,
      data: result[0],
      error: null,
    }
  } catch (error: any) {
    console.error("Error creating asset from chatbot:", error)
    return {
      success: false,
      error: `Failed to create asset: ${error.message}`,
    }
  }
}

export async function getAssetById(id: string) {
const res = await fetch(`/api/assets/${id}`, {
    method: "GET"
  });
  

  if(!res.ok){
      return {
      success: false,
      error: "Failed to fetch assets",
      data: []
      };
    }

  const json = await res.json();
    return {
      success:true,
      data: json.asset
    };
}

async function getAssetById_Obsolete(id: string) {
  try {
    const sql = getDatabase()
    if (!sql) {
      return {
        success: false,
        error: "Database connection not configured",
        data: null,
      }
    }

    const result = await sql`
      SELECT * FROM assets WHERE id = ${id}
    `

    if (result.length === 0) {
      return {
        success: false,
        error: "Asset not found",
        data: null,
      }
    }

    return {
      success: true,
      data: result[0],
      error: null,
    }
  } catch (error) {
    console.error("Error fetching asset:", error)
    return {
      success: false,
      error: "Failed to fetch asset",
      data: null,
    }
  }
}


// export async function getAssetOwner(searchTerm: string)