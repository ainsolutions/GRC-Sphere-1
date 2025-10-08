"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { useToast } from "@/hooks/use-toast"

interface TestScenario {
  name: string
  description: string
  data: any
  expectedResult: "success" | "error"
  expectedError?: string
}

export function ContractTestScenarios() {
  const [testResults, setTestResults] = useState<Record<string, any>>({})
  const [isRunning, setIsRunning] = useState(false)
  const { toast } = useToast()

  const testScenarios: TestScenario[] = [
    {
      name: "Valid Basic Contract",
      description: "Minimal required fields only",
      data: {
        contract_name: "Basic Service Agreement",
        contract_type: "Service Agreement",
        vendor_id: 1,
      },
      expectedResult: "success",
    },
    {
      name: "Complete Contract",
      description: "All fields populated with valid data",
      data: {
        contract_name: "Comprehensive Cloud Services Contract",
        contract_number: "CTR-2024-001",
        contract_type: "Software License",
        vendor_id: 1,
        contract_value: 50000.0,
        currency: "USD",
        start_date: "2024-01-01",
        end_date: "2024-12-31",
        renewal_date: "2024-11-01",
        contract_status: "Active",
        payment_terms: "Net 30 days",
        sla_requirements: "99.9% uptime, 24/7 support",
        compliance_requirements: "SOC 2 Type II, ISO 27001",
        description: "Comprehensive cloud infrastructure services including compute, storage, and networking",
      },
      expectedResult: "success",
    },
    {
      name: "Missing Contract Name",
      description: "Should fail validation",
      data: {
        contract_type: "Service Agreement",
        vendor_id: 1,
      },
      expectedResult: "error",
      expectedError: "Contract name is required",
    },
    {
      name: "Missing Contract Type",
      description: "Should fail validation",
      data: {
        contract_name: "Test Contract",
        vendor_id: 1,
      },
      expectedResult: "error",
      expectedError: "Contract type is required",
    },
    {
      name: "Invalid Vendor ID",
      description: "Non-existent vendor",
      data: {
        contract_name: "Test Contract",
        contract_type: "Service Agreement",
        vendor_id: 99999,
      },
      expectedResult: "error",
      expectedError: "Vendor not found",
    },
    {
      name: "Invalid Contract Status",
      description: "Invalid status value",
      data: {
        contract_name: "Test Contract",
        contract_type: "Service Agreement",
        vendor_id: 1,
        contract_status: "Invalid Status",
      },
      expectedResult: "error",
      expectedError: "Invalid contract status",
    },
    {
      name: "Negative Contract Value",
      description: "Should fail validation",
      data: {
        contract_name: "Test Contract",
        contract_type: "Service Agreement",
        vendor_id: 1,
        contract_value: -1000,
      },
      expectedResult: "error",
      expectedError: "Contract value must be a positive number",
    },
    {
      name: "Invalid Date Format",
      description: "Malformed date",
      data: {
        contract_name: "Test Contract",
        contract_type: "Service Agreement",
        vendor_id: 1,
        start_date: "invalid-date",
      },
      expectedResult: "error",
      expectedError: "Invalid start date format",
    },
    {
      name: "Large Text Fields",
      description: "Test with long text content",
      data: {
        contract_name: "Enterprise Software Licensing Agreement with Extended Terms",
        contract_type: "Software License",
        vendor_id: 1,
        description:
          "This is a comprehensive enterprise software licensing agreement that covers multiple aspects of software usage, including but not limited to user licensing, data processing, security requirements, compliance obligations, and service level agreements. The contract encompasses various modules and services provided by the vendor.",
        sla_requirements:
          "Service Level Agreement requirements include 99.99% uptime guarantee, maximum 4-hour response time for critical issues, 24/7 technical support availability, quarterly business reviews, monthly performance reports, and dedicated customer success manager assignment.",
        compliance_requirements:
          "Compliance requirements include SOC 2 Type II certification, ISO 27001 compliance, GDPR data protection compliance, HIPAA compliance where applicable, PCI DSS compliance for payment processing, and regular third-party security audits.",
      },
      expectedResult: "success",
    },
    {
      name: "Special Characters",
      description: "Test with special characters in text fields",
      data: {
        contract_name: "Contract with Special Chars: @#$%^&*()",
        contract_type: "Service Agreement",
        vendor_id: 1,
        description: "Testing special characters: !@#$%^&*()_+-=[]{}|;':\",./<>?",
        payment_terms: "Payment terms with symbols: $1,000 USD @ 2.5% interest",
      },
      expectedResult: "success",
    },
  ]

  const runTest = async (scenario: TestScenario) => {
    try {
      console.log(`Running test: ${scenario.name}`)
      console.log("Test data:", scenario.data)

      const response = await fetch("/api/contracts", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(scenario.data),
      })

      const result = await response.json()
      console.log(`Test result for ${scenario.name}:`, result)

      const testResult = {
        success: result.success,
        error: result.error,
        details: result.details,
        contract: result.contract,
        timestamp: new Date().toISOString(),
      }

      setTestResults((prev) => ({
        ...prev,
        [scenario.name]: testResult,
      }))

      // Validate expected result
      const passed =
        (scenario.expectedResult === "success" && result.success) ||
        (scenario.expectedResult === "error" && !result.success)

      if (passed) {
        toast({
          title: `✅ ${scenario.name}`,
          description: "Test passed as expected",
        })
      } else {
        toast({
          title: `❌ ${scenario.name}`,
          description: `Test failed - Expected ${scenario.expectedResult}, got ${result.success ? "success" : "error"}`,
          variant: "destructive",
        })
      }

      return testResult
    } catch (error) {
      console.error(`Error in test ${scenario.name}:`, error)
      const testResult = {
        success: false,
        error: "Network or parsing error",
        details: error instanceof Error ? error.message : "Unknown error",
        timestamp: new Date().toISOString(),
      }

      setTestResults((prev) => ({
        ...prev,
        [scenario.name]: testResult,
      }))

      toast({
        title: `❌ ${scenario.name}`,
        description: "Test failed with network error",
        variant: "destructive",
      })

      return testResult
    }
  }

  const runAllTests = async () => {
    setIsRunning(true)
    setTestResults({})

    toast({
      title: "Starting Tests",
      description: `Running ${testScenarios.length} test scenarios...`,
    })

    for (const scenario of testScenarios) {
      await runTest(scenario)
      // Add small delay between tests
      await new Promise((resolve) => setTimeout(resolve, 500))
    }

    setIsRunning(false)
    toast({
      title: "Tests Complete",
      description: "All test scenarios have been executed",
    })
  }

  const getResultBadge = (scenario: TestScenario) => {
    const result = testResults[scenario.name]
    if (!result) return <Badge variant="secondary">Not Run</Badge>

    const passed =
      (scenario.expectedResult === "success" && result.success) ||
      (scenario.expectedResult === "error" && !result.success)

    return passed ? (
      <Badge variant="default" className="bg-green-500">
        ✅ Passed
      </Badge>
    ) : (
      <Badge variant="destructive">❌ Failed</Badge>
    )
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Contract Creation Test Scenarios</CardTitle>
          <CardDescription>
            Test various field combinations and validation scenarios for contract creation
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex gap-4 mb-6">
            <Button onClick={runAllTests} disabled={isRunning} size="lg">
              {isRunning ? "Running Tests..." : "Run All Tests"}
            </Button>
            <Button variant="outline" onClick={() => setTestResults({})} disabled={isRunning}>
              Clear Results
            </Button>
          </div>

          <div className="grid gap-4">
            {testScenarios.map((scenario, index) => (
              <Card key={index} className="border-l-4 border-l-blue-500">
                <CardHeader className="pb-3">
                  <div className="flex justify-between items-start">
                    <div>
                      <CardTitle className="text-lg">{scenario.name}</CardTitle>
                      <CardDescription>{scenario.description}</CardDescription>
                    </div>
                    <div className="flex gap-2">
                      {getResultBadge(scenario)}
                      <Badge variant="outline">Expected: {scenario.expectedResult}</Badge>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    <div>
                      <h4 className="font-medium mb-2">Test Data:</h4>
                      <pre className="bg-gray-100 p-3 rounded text-sm overflow-x-auto">
                        {JSON.stringify(scenario.data, null, 2)}
                      </pre>
                    </div>

                    {testResults[scenario.name] && (
                      <div>
                        <h4 className="font-medium mb-2">Result:</h4>
                        <pre className="bg-gray-100 p-3 rounded text-sm overflow-x-auto">
                          {JSON.stringify(testResults[scenario.name], null, 2)}
                        </pre>
                      </div>
                    )}

                    <Button variant="outline" size="sm" onClick={() => runTest(scenario)} disabled={isRunning}>
                      Run This Test
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
