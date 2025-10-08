import { ContractTestScenarios } from "@/components/contract-test-scenarios"

export default function TestContractsPage() {
  return (
    <div className="container mx-auto py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold">Contract API Testing</h1>
        <p className="text-muted-foreground mt-2">
          Test contract creation with various field combinations and validation scenarios
        </p>
      </div>

      <ContractTestScenarios />
    </div>
  )
}
