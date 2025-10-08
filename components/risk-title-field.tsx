"use client"

import { useState, useEffect, useCallback, useRef } from "react"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { ScrollArea } from "@/components/ui/scroll-area"
import { X, Search, Loader2, AlertCircle } from "lucide-react"
import { useDebounce } from "@/hooks/use-debounce"

interface Risk {
  id: string
  title: string
  description: string
  category: string
  source: string
  risk_level?: string
  status?: string
  table: string
}

interface SelectedRisk extends Risk {
  uniqueId: string // table + id combination for uniqueness
}

interface RiskTitleFieldProps {
  selectedRisks: SelectedRisk[]
  onRisksChange: (risks: SelectedRisk[]) => void
  placeholder?: string
  maxSelections?: number
  className?: string
}

export function RiskTitleField({
  selectedRisks,
  onRisksChange,
  placeholder = "Search and select risks...",
  maxSelections = 10,
  className = ""
}: RiskTitleFieldProps) {
  const [searchQuery, setSearchQuery] = useState("")
  const [searchResults, setSearchResults] = useState<Risk[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const [isDropdownOpen, setIsDropdownOpen] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const searchInputRef = useRef<HTMLInputElement>(null)
  const dropdownRef = useRef<HTMLDivElement>(null)

  const debouncedSearchQuery = useDebounce(searchQuery, 300)

  // Search risks from API
  const searchRisks = useCallback(async (query: string) => {
    if (!query || query.length < 2) {
      setSearchResults([])
      return
    }

    setIsLoading(true)
    setError(null)

    try {
      const response = await fetch(`/api/risks/search?q=${encodeURIComponent(query)}&limit=20`)
      const data = await response.json()

      if (data.success) {
        setSearchResults(data.risks || [])
      } else {
        setError(data.error || "Failed to search risks")
        setSearchResults([])
      }
    } catch (err) {
      console.error("Error searching risks:", err)
      setError("Failed to search risks")
      setSearchResults([])
    } finally {
      setIsLoading(false)
    }
  }, [])

  // Effect for debounced search
  useEffect(() => {
    searchRisks(debouncedSearchQuery)
  }, [debouncedSearchQuery, searchRisks])

  // Handle clicking outside to close dropdown
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        searchInputRef.current &&
        !searchInputRef.current.contains(event.target as Node) &&
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setIsDropdownOpen(false)
      }
    }

    document.addEventListener("mousedown", handleClickOutside)
    return () => document.removeEventListener("mousedown", handleClickOutside)
  }, [])

  const handleInputChange = (value: string) => {
    setSearchQuery(value)
    setIsDropdownOpen(true)
  }

  const handleInputFocus = () => {
    if (searchQuery.length >= 2) {
      setIsDropdownOpen(true)
    }
  }

  const handleRiskSelect = (risk: Risk) => {
    // Check if already selected
    const uniqueId = `${risk.table}_${risk.id}`
    const isAlreadySelected = selectedRisks.some(selected => selected.uniqueId === uniqueId)

    if (isAlreadySelected) {
      // Remove from selection
      const newSelected = selectedRisks.filter(selected => selected.uniqueId !== uniqueId)
      onRisksChange(newSelected)
    } else {
      // Add to selection (if under limit)
      if (selectedRisks.length >= maxSelections) {
        return // Don't add if at max
      }

      const newSelected: SelectedRisk = {
        ...risk,
        uniqueId
      }
      onRisksChange([...selectedRisks, newSelected])
    }

    // Clear search and close dropdown
    setSearchQuery("")
    setIsDropdownOpen(false)
    setSearchResults([])
  }

  const handleRemoveRisk = (uniqueId: string) => {
    const newSelected = selectedRisks.filter(selected => selected.uniqueId !== uniqueId)
    onRisksChange(newSelected)
  }

  const getRiskBadgeVariant = (source: string) => {
    const variants: Record<string, string> = {
      "ISO27001": "bg-blue-100 text-blue-800 border-blue-200",
      "NIST CSF": "bg-purple-100 text-purple-800 border-purple-200",
      "FAIR": "bg-green-100 text-green-800 border-green-200",
      "Technology": "bg-orange-100 text-orange-800 border-orange-200",
      "Sphere AI": "bg-pink-100 text-pink-800 border-pink-200",
    }
    return variants[source] || "bg-gray-100 text-gray-800 border-gray-200"
  }

  const isRiskSelected = (risk: Risk) => {
    const uniqueId = `${risk.table}_${risk.id}`
    return selectedRisks.some(selected => selected.uniqueId === uniqueId)
  }

  return (
    <div className={`space-y-3 ${className}`}>
      <Label htmlFor="risk-search">Associated Risks</Label>

      {/* Search Input */}
      <div className="relative">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
          <Input
            ref={searchInputRef}
            id="risk-search"
            type="text"
            placeholder={placeholder}
            value={searchQuery}
            onChange={(e) => handleInputChange(e.target.value)}
            onFocus={handleInputFocus}
            className="pl-10 pr-4"
          />
          {isLoading && (
            <Loader2 className="absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 animate-spin text-slate-400" />
          )}
        </div>

        {/* Dropdown Results */}
        {isDropdownOpen && (
          <Card ref={dropdownRef} className="absolute z-50 w-full mt-1 border-slate-200 shadow-lg">
            <CardContent className="p-0">
              <ScrollArea className="max-h-64">
                {error ? (
                  <div className="p-4 text-center text-red-600">
                    <AlertCircle className="mx-auto h-5 w-5 mb-2" />
                    <p className="text-sm">{error}</p>
                  </div>
                ) : searchResults.length > 0 ? (
                  <div className="p-2">
                    {searchResults.map((risk) => (
                      <button
                        key={`${risk.table}_${risk.id}`}
                        type="button"
                        onClick={() => handleRiskSelect(risk)}
                        className={`w-full p-3 text-left hover:bg-slate-50 rounded-md transition-colors ${
                          isRiskSelected(risk) ? "bg-blue-50 border border-blue-200" : ""
                        }`}
                      >
                        <div className="flex items-start justify-between">
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center gap-2 mb-1">
                              <h4 className="font-medium text-sm text-slate-900 truncate">
                                {risk.title}
                              </h4>
                              <Badge variant="outline" className={`text-xs ${getRiskBadgeVariant(risk.source)}`}>
                                {risk.source}
                              </Badge>
                            </div>
                            {risk.description && (
                              <p className="text-xs text-slate-600 line-clamp-2">
                                {risk.description}
                              </p>
                            )}
                            <div className="flex items-center gap-2 mt-1">
                              {risk.category && (
                                <span className="text-xs text-slate-500">{risk.category}</span>
                              )}
                              {risk.risk_level && (
                                <Badge variant="secondary" className="text-xs">
                                  {risk.risk_level}
                                </Badge>
                              )}
                            </div>
                          </div>
                          {isRiskSelected(risk) && (
                            <div className="ml-2 flex-shrink-0">
                              <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                            </div>
                          )}
                        </div>
                      </button>
                    ))}
                  </div>
                ) : searchQuery.length >= 2 && !isLoading ? (
                  <div className="p-4 text-center text-slate-500">
                    <p className="text-sm">No risks found matching "{searchQuery}"</p>
                  </div>
                ) : searchQuery.length < 2 ? (
                  <div className="p-4 text-center text-slate-500">
                    <p className="text-sm">Type at least 2 characters to search</p>
                  </div>
                ) : null}
              </ScrollArea>
            </CardContent>
          </Card>
        )}
      </div>

      {/* Selected Risks */}
      {selectedRisks.length > 0 && (
        <div className="space-y-2">
          <Label className="text-sm text-slate-600">
            Selected Risks ({selectedRisks.length}/{maxSelections})
          </Label>
          <div className="flex flex-wrap gap-2">
            {selectedRisks.map((risk) => (
              <Badge
                key={risk.uniqueId}
                variant="secondary"
                className={`flex items-center gap-1 ${getRiskBadgeVariant(risk.source)}`}
              >
                <span className="truncate max-w-32">{risk.title}</span>
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  className="h-auto p-0 hover:bg-transparent"
                  onClick={() => handleRemoveRisk(risk.uniqueId)}
                >
                  <X className="h-3 w-3" />
                </Button>
              </Badge>
            ))}
          </div>
          {selectedRisks.length >= maxSelections && (
            <p className="text-xs text-amber-600">
              Maximum {maxSelections} risks can be selected. Remove some to add more.
            </p>
          )}
        </div>
      )}

      {/* Helper Text */}
      <p className="text-xs text-slate-500">
        Search across ISO27001, NIST CSF, FAIR, Technology, and AI risk databases.
        {selectedRisks.length === 0 && " Select risks that are associated with this threat."}
      </p>
    </div>
  )
}
