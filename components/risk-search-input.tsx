"use client"

import { useState, useEffect } from "react"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Search, X } from "lucide-react"
import { searchRisks } from "@/lib/actions/incident-actions"

interface Risk {
  id: number
  risk_id: string
  risk_title: string
  risk_description: string
  risk_status: string
  inherent_risk_score: number
}

interface RiskSearchInputProps {
  onRiskSelect: (risk: Risk | null) => void
  placeholder?: string
  label?: string
  defaultValue?: Risk | null
}

export function RiskSearchInput({
  onRiskSelect,
  placeholder = "Search for risks...",
  label = "Related Risk",
  defaultValue = null,
}: RiskSearchInputProps) {
  const [searchTerm, setSearchTerm] = useState("")
  const [risks, setRisks] = useState<Risk[]>([])
  const [selectedRisk, setSelectedRisk] = useState<Risk | null>(defaultValue)
  const [isSearching, setIsSearching] = useState(false)
  const [showResults, setShowResults] = useState(false)

  useEffect(() => {
    if (defaultValue) {
      setSelectedRisk(defaultValue)
    }
  }, [defaultValue])

  useEffect(() => {
    const searchForRisks = async () => {
      if (searchTerm.length < 2) {
        setRisks([])
        setShowResults(false)
        return
      }

      setIsSearching(true)
      try {
        const result = await searchRisks(searchTerm)
        if (result.success) {
          setRisks(result.data)
          setShowResults(true)
        }
      } catch (error) {
        console.error("Error searching risks:", error)
      } finally {
        setIsSearching(false)
      }
    }

    const debounceTimer = setTimeout(searchForRisks, 300)
    return () => clearTimeout(debounceTimer)
  }, [searchTerm])

  const handleRiskSelect = (risk: Risk) => {
    setSelectedRisk(risk)
    setSearchTerm("")
    setShowResults(false)
    onRiskSelect(risk)
  }

  const handleClearSelection = () => {
    setSelectedRisk(null)
    setSearchTerm("")
    setShowResults(false)
    onRiskSelect(null)
  }

  const getRiskScoreColor = (score: number) => {
    if (score >= 15) return "bg-red-500"
    if (score >= 10) return "bg-orange-500"
    if (score >= 5) return "bg-yellow-500"
    return "bg-green-500"
  }

  return (
    <div className="space-y-2">
      <Label>{label}</Label>

      {selectedRisk ? (
        <Card className="border-2 border-blue-200 bg-blue-50">
          <CardContent className="p-3">
            <div className="flex items-center justify-between">
              <div className="flex-1">
                <div className="flex items-center space-x-2 mb-1">
                  <Badge variant="outline" className="text-xs">
                    {selectedRisk.risk_id}
                  </Badge>
                  <Badge className={`text-xs text-white ${getRiskScoreColor(selectedRisk.inherent_risk_score)}`}>
                    Score: {selectedRisk.inherent_risk_score}
                  </Badge>
                  <Badge variant="outline" className="text-xs">
                    {selectedRisk.risk_status}
                  </Badge>
                </div>
                <h4 className="font-medium text-sm">{selectedRisk.risk_title}</h4>
                <p className="text-xs text-muted-foreground line-clamp-2">{selectedRisk.risk_description}</p>
              </div>
              <Button variant="ghost" size="sm" onClick={handleClearSelection} className="ml-2">
                <X className="h-4 w-4" />
              </Button>
            </div>
          </CardContent>
        </Card>
      ) : (
        <div className="relative">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder={placeholder}
              className="pl-10"
            />
          </div>

          {showResults && (
            <Card className="absolute top-full left-0 right-0 z-50 mt-1 max-h-60 overflow-y-auto">
              <CardContent className="p-0">
                {isSearching ? (
                  <div className="p-3 text-center text-sm text-muted-foreground">Searching...</div>
                ) : risks.length === 0 ? (
                  <div className="p-3 text-center text-sm text-muted-foreground">No risks found</div>
                ) : (
                  <div className="divide-y">
                    {risks.map((risk) => (
                      <div
                        key={risk.id}
                        className="p-3 hover:bg-muted cursor-pointer transition-colors"
                        onClick={() => handleRiskSelect(risk)}
                      >
                        <div className="flex items-center space-x-2 mb-1">
                          <Badge variant="outline" className="text-xs">
                            {risk.risk_id}
                          </Badge>
                          <Badge className={`text-xs text-white ${getRiskScoreColor(risk.inherent_risk_score)}`}>
                            Score: {risk.inherent_risk_score}
                          </Badge>
                          <Badge variant="outline" className="text-xs">
                            {risk.risk_status}
                          </Badge>
                        </div>
                        <h4 className="font-medium text-sm">{risk.risk_title}</h4>
                        <p className="text-xs text-muted-foreground line-clamp-2">{risk.risk_description}</p>
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          )}
        </div>
      )}

      {/* Hidden input for form submission */}
      {selectedRisk && <input type="hidden" name="related_risk_id" value={selectedRisk.id} />}
    </div>
  )
}
