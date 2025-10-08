import { type NextRequest, NextResponse } from "next/server"
import { withContext } from "@/lib/HttpContext"


interface ThirdPartyVendor {
  id: string
  name: string
  category: string
  riskLevel: "Low" | "Medium" | "High" | "Critical"
  status: "Active" | "Under Review" | "Suspended" | "Terminated"
  lastAssessment: string
  nextReview: string
  criticalityScore: number
  dataAccess: string[]
  contractValue: number
  complianceStatus: "Compliant" | "Non-Compliant" | "Pending"
}

interface Contract {
  id: string
  vendorId: string
  vendorName: string
  title: string
  type: "MSA" | "SOW" | "NDA" | "SLA" | "DPA" | "Amendment"
  status: "Draft" | "Under Review" | "Approved" | "Active" | "Expired" | "Terminated" | "Renewal Required"
  startDate: string
  endDate: string
  value: number
  currency: string
  autoRenewal: boolean
  renewalPeriod: number
  noticePeriod: number
  keyTerms: string[]
  complianceRequirements: string[]
  riskLevel: "Low" | "Medium" | "High" | "Critical"
  owner: string
  approver: string
  lastModified: string
  documents: string[]
}

const mockVendors: ThirdPartyVendor[] = [
  {
    id: "TPV-001",
    name: "CloudSecure Solutions",
    category: "Cloud Services",
    riskLevel: "Medium",
    status: "Active",
    lastAssessment: "2024-01-15",
    nextReview: "2024-07-15",
    criticalityScore: 75,
    dataAccess: ["Customer Data", "Financial Records"],
    contractValue: 250000,
    complianceStatus: "Compliant",
  },
  {
    id: "TPV-002",
    name: "DataFlow Analytics",
    category: "Data Processing",
    riskLevel: "High",
    status: "Under Review",
    lastAssessment: "2024-02-01",
    nextReview: "2024-05-01",
    criticalityScore: 85,
    dataAccess: ["PII", "Payment Data", "Analytics"],
    contractValue: 500000,
    complianceStatus: "Pending",
  },
  {
    id: "TPV-003",
    name: "SecureComm Networks",
    category: "Telecommunications",
    riskLevel: "Low",
    status: "Active",
    lastAssessment: "2024-01-20",
    nextReview: "2024-10-20",
    criticalityScore: 45,
    dataAccess: ["Communication Logs"],
    contractValue: 75000,
    complianceStatus: "Compliant",
  },
  {
    id: "TPV-004",
    name: "GlobalPay Systems",
    category: "Payment Processing",
    riskLevel: "Critical",
    status: "Active",
    lastAssessment: "2024-02-10",
    nextReview: "2024-05-10",
    criticalityScore: 95,
    dataAccess: ["Payment Data", "Financial Records", "Customer Data"],
    contractValue: 1200000,
    complianceStatus: "Compliant",
  },
  {
    id: "TPV-005",
    name: "TechSupport Pro",
    category: "IT Support",
    riskLevel: "Medium",
    status: "Active",
    lastAssessment: "2024-01-25",
    nextReview: "2024-07-25",
    criticalityScore: 65,
    dataAccess: ["System Logs", "User Data"],
    contractValue: 120000,
    complianceStatus: "Compliant",
  },
]

const mockContracts: Contract[] = [
  {
    id: "CTR-001",
    vendorId: "TPV-001",
    vendorName: "CloudSecure Solutions",
    title: "Cloud Infrastructure Services Agreement",
    type: "MSA",
    status: "Active",
    startDate: "2024-01-01",
    endDate: "2024-12-31",
    value: 250000,
    currency: "USD",
    autoRenewal: true,
    renewalPeriod: 12,
    noticePeriod: 90,
    keyTerms: ["SLA 99.9%", "Data encryption", "24/7 support"],
    complianceRequirements: ["SOC 2", "ISO 27001", "GDPR"],
    riskLevel: "Medium",
    owner: "John Smith",
    approver: "Jane Doe",
    lastModified: "2024-01-15",
    documents: ["MSA_CloudSecure_2024.pdf", "SLA_CloudSecure.pdf"],
  },
  {
    id: "CTR-002",
    vendorId: "TPV-002",
    vendorName: "DataFlow Analytics",
    title: "Data Processing Agreement",
    type: "DPA",
    status: "Renewal Required",
    startDate: "2023-06-01",
    endDate: "2024-05-31",
    value: 500000,
    currency: "USD",
    autoRenewal: false,
    renewalPeriod: 12,
    noticePeriod: 60,
    keyTerms: ["Data residency", "Processing limitations", "Audit rights"],
    complianceRequirements: ["GDPR", "CCPA", "HIPAA"],
    riskLevel: "High",
    owner: "Sarah Johnson",
    approver: "Mike Wilson",
    lastModified: "2024-02-01",
    documents: ["DPA_DataFlow_2023.pdf", "Privacy_Impact_Assessment.pdf"],
  },
  {
    id: "CTR-003",
    vendorId: "TPV-004",
    vendorName: "GlobalPay Systems",
    title: "Payment Processing Services",
    type: "MSA",
    status: "Under Review",
    startDate: "2024-03-01",
    endDate: "2027-02-28",
    value: 1200000,
    currency: "USD",
    autoRenewal: true,
    renewalPeriod: 36,
    noticePeriod: 180,
    keyTerms: ["PCI DSS compliance", "Transaction limits", "Fee structure"],
    complianceRequirements: ["PCI DSS", "SOX", "AML"],
    riskLevel: "Critical",
    owner: "Finance Team",
    approver: "CFO",
    lastModified: "2024-02-15",
    documents: ["MSA_GlobalPay_Draft.pdf", "Security_Addendum.pdf"],
  },
]

export const GET = withContext(async({ tenantDb }, request) => {
  try {
    const { searchParams } = new URL(request.url)
    const category = searchParams.get("category")
    const riskLevel = searchParams.get("riskLevel")
    const status = searchParams.get("status")
    const dataType = searchParams.get("type") // 'vendors' or 'contracts'

    if (dataType === "contracts") {
      let filteredContracts = mockContracts

      if (status && status !== "all") {
        filteredContracts = filteredContracts.filter((contract) => contract.status === status)
      }

      if (riskLevel && riskLevel !== "all") {
        filteredContracts = filteredContracts.filter((contract) => contract.riskLevel === riskLevel)
      }

      const contractAnalytics = {
        total: mockContracts.length,
        active: mockContracts.filter((c) => c.status === "Active").length,
        expiringSoon: mockContracts.filter((c) => {
          const endDate = new Date(c.endDate)
          const today = new Date()
          const daysUntilExpiry = Math.ceil((endDate.getTime() - today.getTime()) / (1000 * 60 * 60 * 24))
          return daysUntilExpiry <= 90 && daysUntilExpiry > 0
        }).length,
        renewalRequired: mockContracts.filter((c) => c.status === "Renewal Required").length,
        totalValue: mockContracts.reduce((sum, contract) => sum + contract.value, 0),
      }

      return NextResponse.json({
        contracts: filteredContracts,
        analytics: contractAnalytics,
        success: true,
      })
    }

    // Default to vendors
    let filteredVendors = mockVendors

    if (category && category !== "all") {
      filteredVendors = filteredVendors.filter((vendor) => vendor.category === category)
    }

    if (riskLevel && riskLevel !== "all") {
      filteredVendors = filteredVendors.filter((vendor) => vendor.riskLevel === riskLevel)
    }

    if (status && status !== "all") {
      filteredVendors = filteredVendors.filter((vendor) => vendor.status === status)
    }

    const analytics = {
      totalVendors: mockVendors.length,
      riskDistribution: {
        Critical: mockVendors.filter((v) => v.riskLevel === "Critical").length,
        High: mockVendors.filter((v) => v.riskLevel === "High").length,
        Medium: mockVendors.filter((v) => v.riskLevel === "Medium").length,
        Low: mockVendors.filter((v) => v.riskLevel === "Low").length,
      },
      totalContractValue: mockVendors.reduce((sum, vendor) => sum + vendor.contractValue, 0),
      averageCriticalityScore:
        mockVendors.reduce((sum, vendor) => sum + vendor.criticalityScore, 0) / mockVendors.length,
      complianceStatus: {
        Compliant: mockVendors.filter((v) => v.complianceStatus === "Compliant").length,
        "Non-Compliant": mockVendors.filter((v) => v.complianceStatus === "Non-Compliant").length,
        Pending: mockVendors.filter((v) => v.complianceStatus === "Pending").length,
      },
    }

    return NextResponse.json({
      vendors: filteredVendors,
      analytics,
      success: true,
    })
  } catch (error) {
    console.error("Third party risk API error:", error)
    return NextResponse.json({ error: "Failed to fetch third party risk data", success: false }, { status: 500 })
  }
});

export const POST = withContext(async({ tenantDb }, request) => {
  try {
    const body = await request.json()
    const { type } = body

    if (type === "contract") {
      // Simulate adding a new contract
      const newContract: Contract = {
        id: `CTR-${String(mockContracts.length + 1).padStart(3, "0")}`,
        vendorId: body.vendorId,
        vendorName: body.vendorName,
        title: body.title,
        type: body.contractType,
        status: "Draft",
        startDate: body.startDate,
        endDate: body.endDate,
        value: body.value || 0,
        currency: body.currency || "USD",
        autoRenewal: body.autoRenewal || false,
        renewalPeriod: body.renewalPeriod || 12,
        noticePeriod: body.noticePeriod || 30,
        keyTerms: body.keyTerms || [],
        complianceRequirements: body.complianceRequirements || [],
        riskLevel: body.riskLevel || "Medium",
        owner: body.owner || "System",
        approver: body.approver || "Pending",
        lastModified: new Date().toISOString().split("T")[0],
        documents: [],
      }

      return NextResponse.json({
        contract: newContract,
        message: "Contract created successfully",
        success: true,
      })
    }

    // Default to vendor creation
    const newVendor: ThirdPartyVendor = {
      id: `TPV-${String(mockVendors.length + 1).padStart(3, "0")}`,
      name: body.name,
      category: body.category,
      riskLevel: body.riskLevel,
      status: "Under Review",
      lastAssessment: new Date().toISOString().split("T")[0],
      nextReview: new Date(Date.now() + 90 * 24 * 60 * 60 * 1000).toISOString().split("T")[0], // 90 days from now
      criticalityScore: body.criticalityScore || 50,
      dataAccess: body.dataAccess || [],
      contractValue: body.contractValue || 0,
      complianceStatus: "Pending",
    }

    return NextResponse.json({
      vendor: newVendor,
      message: "Third party vendor added successfully",
      success: true,
    })
  } catch (error) {
    console.error("Third party risk POST error:", error)
    return NextResponse.json({ error: "Failed to add third party vendor", success: false }, { status: 500 })
  }
});
