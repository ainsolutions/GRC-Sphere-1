import { Card, CardContent, CardHeader } from "@/components/ui/card"
import { Skeleton } from "@/components/ui/skeleton"

export default function AIAnalysisLoading() {
  return (
    <div className="flex h-screen bg-gradient-to-br from-purple-100 via-cyan-100 to-blue-200 dark:from-black dark:via-slate-900 dark:to-blue-950">
      {/* Sidebar Skeleton */}
      <div className="w-64 bg-slate-900/50 backdrop-blur-sm border-r border-slate-700/50">
        <div className="p-6">
          <Skeleton className="h-8 w-32 mb-6 bg-slate-700/50" />
          <div className="space-y-4">
            {[...Array(8)].map((_, i) => (
              <div key={i} className="flex items-center space-x-3">
                <Skeleton className="h-5 w-5 bg-slate-700/50" />
                <Skeleton className="h-4 w-24 bg-slate-700/50" />
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Main Content Skeleton */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Header Skeleton */}
        <div className="h-16 bg-slate-900/50 backdrop-blur-sm border-b border-slate-700/50 flex items-center px-6">
          <Skeleton className="h-8 w-48 bg-slate-700/50" />
        </div>

        {/* Content Skeleton */}
        <main className="flex-1 overflow-y-auto p-6 bg-gradient-to-br from-purple-50/50 via-cyan-50/50 to-blue-100/50 dark:from-black/50 dark:via-slate-900/30 dark:to-blue-950/50">
          <div className="space-y-8">
            {/* Header Skeleton */}
            <Card className="bg-slate-900/50 backdrop-blur-sm border border-slate-700/50">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-4">
                    <Skeleton className="h-12 w-12 rounded-full bg-slate-700/50" />
                    <div>
                      <Skeleton className="h-8 w-64 mb-2 bg-slate-700/50" />
                      <Skeleton className="h-4 w-96 bg-slate-700/50" />
                    </div>
                  </div>
                  <Skeleton className="h-12 w-32 bg-slate-700/50" />
                </div>
              </CardHeader>
            </Card>

            {/* Tabs Skeleton */}
            <div className="space-y-6">
              <div className="flex space-x-1 bg-slate-900/50 backdrop-blur-sm border border-slate-700/50 rounded-lg p-1">
                <Skeleton className="h-10 w-32 bg-slate-700/50" />
                <Skeleton className="h-10 w-32 bg-slate-700/50" />
              </div>

              {/* Cards Grid Skeleton */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {[...Array(6)].map((_, i) => (
                  <Card key={i} className="bg-slate-900/50 backdrop-blur-sm border border-slate-700/50">
                    <CardHeader>
                      <div className="flex items-center space-x-3">
                        <Skeleton className="h-12 w-12 rounded-lg bg-slate-700/50" />
                        <div className="flex-1">
                          <Skeleton className="h-5 w-32 mb-2 bg-slate-700/50" />
                          <Skeleton className="h-3 w-48 bg-slate-700/50" />
                        </div>
                      </div>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-3">
                        <div className="flex items-center justify-between">
                          <Skeleton className="h-5 w-20 bg-slate-700/50" />
                          <div className="flex space-x-2">
                            <Skeleton className="h-8 w-8 bg-slate-700/50" />
                            <Skeleton className="h-8 w-8 bg-slate-700/50" />
                          </div>
                        </div>
                        <div className="space-y-2">
                          <Skeleton className="h-3 w-full bg-slate-700/50" />
                          <Skeleton className="h-3 w-3/4 bg-slate-700/50" />
                          <Skeleton className="h-3 w-1/2 bg-slate-700/50" />
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>

              {/* Stats Card Skeleton */}
              <Card className="bg-slate-900/50 backdrop-blur-sm border border-slate-700/50">
                <CardHeader>
                  <Skeleton className="h-6 w-48 mb-2 bg-slate-700/50" />
                  <Skeleton className="h-4 w-64 bg-slate-700/50" />
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                    {[...Array(3)].map((_, i) => (
                      <div key={i} className="text-center">
                        <Skeleton className="h-12 w-16 mx-auto mb-2 bg-slate-700/50" />
                        <Skeleton className="h-4 w-24 mx-auto mb-2 bg-slate-700/50" />
                        <Skeleton className="h-1 w-full bg-slate-700/50" />
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </main>
      </div>
    </div>
  )
}
