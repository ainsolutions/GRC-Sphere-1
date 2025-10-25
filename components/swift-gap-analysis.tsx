"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Target } from "lucide-react"

interface SWIFTGapAnalysisProps {
  assessmentId: number
}

export function SWIFTGapAnalysis({ assessmentId }: SWIFTGapAnalysisProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Target className="h-5 w-5" />
          SWIFT Gap Analysis
        </CardTitle>
        <CardDescription>
          Analyze gaps identified during SWIFT CSP control assessment
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="text-center py-12">
          <Target className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
          <h3 className="text-lg font-semibold mb-2">Gap Analysis</h3>
          <p className="text-muted-foreground">
            Gap analysis functionality - view controls with identified gaps and risk ratings
          </p>
        </div>
      </CardContent>
    </Card>
  )
}

