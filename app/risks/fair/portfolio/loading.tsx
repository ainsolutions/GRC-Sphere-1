export default function PortfolioRiskAggregationLoading() {
  return (
    <div className="flex items-center justify-center h-64">
      <div className="text-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600 mx-auto"></div>
        <p className="mt-4 text-lg text-gray-600 dark:text-gray-400">Loading Portfolio Risk Aggregation...</p>
      </div>
    </div>
  )
}
