"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Calendar, Clock, CheckCircle, AlertTriangle, AlertCircle, FileText, RotateCcw } from "lucide-react"

interface Assessment {
  id: number
  assessment_id: string
  name: string
  type: string
  status: string
  priority?: string
  start_date: string
  end_date: string
  assessor: string
  progress?: number
  organization?: string
}

interface AssessmentGanttChartProps {
  assessments: Assessment[]
}

export function AssessmentGanttChart({ assessments }: AssessmentGanttChartProps) {
  const [timeScale, setTimeScale] = useState<"month" | "quarter" | "year">("month")
  const [sortBy, setSortBy] = useState<"start_date" | "end_date" | "priority" | "status">("start_date")
  const [animationEnabled, setAnimationEnabled] = useState(true)

  // Calculate date range for the timeline
  const getDateRange = () => {
    if (assessments.length === 0) return { start: new Date(), end: new Date() }

    const dates = assessments.flatMap((a) => [new Date(a.start_date), new Date(a.end_date)])
    const minDate = new Date(Math.min(...dates.map((d) => d.getTime())))
    const maxDate = new Date(Math.max(...dates.map((d) => d.getTime())))

    // Add padding
    minDate.setMonth(minDate.getMonth() - 1)
    maxDate.setMonth(maxDate.getMonth() + 1)

    return { start: minDate, end: maxDate }
  }

  const { start: timelineStart, end: timelineEnd } = getDateRange()
  const timelineDuration = timelineEnd.getTime() - timelineStart.getTime()

  // Calculate progress based on dates and status
  const calculateProgress = (assessment: Assessment) => {
    if (assessment.progress !== undefined && assessment.progress !== null) {
      return assessment.progress
    }

    const now = new Date()
    const start = new Date(assessment.start_date)
    const end = new Date(assessment.end_date)

    if (assessment.status?.toLowerCase() === "completed") return 100
    if (assessment.status?.toLowerCase() === "cancelled") return 0
    if (now < start) return 0
    if (now > end) return 100

    const totalDuration = end.getTime() - start.getTime()
    const elapsed = now.getTime() - start.getTime()
    return Math.min(100, Math.max(0, (elapsed / totalDuration) * 100))
  }

  // Sort assessments
  const sortedAssessments = [...assessments].sort((a, b) => {
    switch (sortBy) {
      case "start_date":
        return new Date(a.start_date).getTime() - new Date(b.start_date).getTime()
      case "end_date":
        return new Date(a.end_date).getTime() - new Date(b.end_date).getTime()
      case "priority":
        const priorityOrder = { Critical: 4, High: 3, Medium: 2, Low: 1 }
        return (
          (priorityOrder[b.priority as keyof typeof priorityOrder] || 0) -
          (priorityOrder[a.priority as keyof typeof priorityOrder] || 0)
        )
      case "status":
        return a.status.localeCompare(b.status)
      default:
        return 0
    }
  })

  // Generate timeline markers
  const generateTimelineMarkers = () => {
    const markers = []
    const current = new Date(timelineStart)

    while (current <= timelineEnd) {
      const position = ((current.getTime() - timelineStart.getTime()) / timelineDuration) * 100
      markers.push({
        date: new Date(current),
        position,
        label:
          timeScale === "month"
            ? current.toLocaleDateString("en-US", { month: "short", year: "numeric" })
            : timeScale === "quarter"
              ? `Q${Math.ceil((current.getMonth() + 1) / 3)} ${current.getFullYear()}`
              : current.getFullYear().toString(),
      })

      if (timeScale === "month") {
        current.setMonth(current.getMonth() + 1)
      } else if (timeScale === "quarter") {
        current.setMonth(current.getMonth() + 3)
      } else {
        current.setFullYear(current.getFullYear() + 1)
      }
    }

    return markers
  }

  const timelineMarkers = generateTimelineMarkers()

  const getStatusColor = (status: string) => {
    switch (status?.toLowerCase()) {
      case "completed":
        return "bg-green-500"
      case "in progress":
        return "bg-blue-500"
      case "on hold":
        return "bg-yellow-500"
      case "cancelled":
        return "bg-red-500"
      case "planned":
        return "bg-gray-500"
      default:
        return "bg-gray-500"
    }
  }

  const getStatusIcon = (status: string) => {
    switch (status?.toLowerCase()) {
      case "completed":
        return <CheckCircle className="h-4 w-4" />
      case "in progress":
        return <Clock className="h-4 w-4" />
      case "on hold":
        return <AlertTriangle className="h-4 w-4" />
      case "cancelled":
        return <AlertCircle className="h-4 w-4" />
      case "planned":
        return <FileText className="h-4 w-4" />
      default:
        return <FileText className="h-4 w-4" />
    }
  }

  const getPriorityColor = (priority: string) => {
    switch (priority?.toLowerCase()) {
      case "critical":
        return "border-red-500 bg-red-50 dark:bg-red-900/20"
      case "high":
        return "border-orange-500 bg-orange-50 dark:bg-orange-900/20"
      case "medium":
        return "border-yellow-500 bg-yellow-50 dark:bg-yellow-900/20"
      case "low":
        return "border-green-500 bg-green-50 dark:bg-green-900/20"
      default:
        return "border-gray-500 bg-gray-50 dark:bg-gray-900/20"
    }
  }

  return (
    <Card className="bg-transparent backdrop-blur-sm border-white/10">
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="flex items-center space-x-2">
              <Calendar className="h-5 w-5 text-blue-600" />
              <span>Assessment Gantt Chart</span>
            </CardTitle>
            <CardDescription>
              Visual timeline of assessment schedules and progress ({sortedAssessments.length} assessments)
            </CardDescription>
          </div>
          <div className="flex items-center space-x-2">
            <Select value={timeScale} onValueChange={(value: "month" | "quarter" | "year") => setTimeScale(value)}>
              <SelectTrigger className="w-[120px] bg-white/50 dark:bg-gray-800/50 backdrop-blur-sm border-white/20">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="month">Monthly</SelectItem>
                <SelectItem value="quarter">Quarterly</SelectItem>
                <SelectItem value="year">Yearly</SelectItem>
              </SelectContent>
            </Select>
            <Select
              value={sortBy}
              onValueChange={(value: "start_date" | "end_date" | "priority" | "status") => setSortBy(value)}
            >
              <SelectTrigger className="w-[140px] bg-white/50 dark:bg-gray-800/50 backdrop-blur-sm border-white/20">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="start_date">Start Date</SelectItem>
                <SelectItem value="end_date">End Date</SelectItem>
                <SelectItem value="priority">Priority</SelectItem>
                <SelectItem value="status">Status</SelectItem>
              </SelectContent>
            </Select>
            <Button
              variant="outline"
              size="sm"
              onClick={() => setAnimationEnabled(!animationEnabled)}
              className="bg-white/50 dark:bg-gray-800/50 backdrop-blur-sm border-white/20"
            >
              {animationEnabled ? <RotateCcw className="h-4 w-4" /> : <RotateCcw className="h-4 w-4 opacity-50" />}
            </Button>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        {sortedAssessments.length === 0 ? (
          <div className="text-center py-12">
            <Calendar className="mx-auto h-12 w-12 text-gray-400" />
            <h3 className="mt-2 text-sm font-medium text-gray-900 dark:text-white">No assessments to display</h3>
            <p className="mt-1 text-sm text-gray-500">Create assessments to see them in the Gantt chart</p>
          </div>
        ) : (
          <div className="space-y-6">
            {/* Timeline Header */}
            <div className="relative h-12 bg-gradient-to-r from-blue-50 to-purple-50 dark:from-blue-900/20 dark:to-purple-900/20 rounded-lg border border-white/20">
              <div className="absolute inset-0 flex items-center">
                {timelineMarkers.map((marker, index) => (
                  <div
                    key={index}
                    className="absolute flex flex-col items-center"
                    style={{ left: `${marker.position}%` }}
                  >
                    <div className="w-px h-3 bg-gray-400 dark:bg-gray-600"></div>
                    <span className="text-xs text-gray-600 dark:text-gray-400 mt-1 whitespace-nowrap">
                      {marker.label}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            {/* Assessment Rows */}
            <div className="space-y-3">
              {sortedAssessments.map((assessment, index) => {
                const startDate = new Date(assessment.start_date)
                const endDate = new Date(assessment.end_date)
                const startPosition = ((startDate.getTime() - timelineStart.getTime()) / timelineDuration) * 100
                const endPosition = ((endDate.getTime() - timelineStart.getTime()) / timelineDuration) * 100
                const width = Math.max(endPosition - startPosition, 2) // Minimum 2% width
                const progress = calculateProgress(assessment)

                return (
                  <div
                    key={assessment.id}
                    className={`relative p-4 rounded-lg border-l-4 ${getPriorityColor(assessment.priority || "medium")} 
                      bg-white/50 dark:bg-gray-800/50 backdrop-blur-sm hover:bg-white/70 dark:hover:bg-gray-800/70 
                      transition-all duration-300 ${animationEnabled ? "animate-in slide-in-from-left" : ""}`}
                    style={{
                      animationDelay: animationEnabled ? `${index * 100}ms` : "0ms",
                      animationDuration: animationEnabled ? "600ms" : "0ms",
                    }}
                  >
                    {/* Assessment Info */}
                    <div className="flex items-center justify-between mb-3">
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center space-x-2">
                          <h4 className="font-medium text-gray-900 dark:text-white truncate">{assessment.name}</h4>
                          <Badge variant="outline" className="text-xs">
                            {assessment.type}
                          </Badge>
                          <Badge className={`text-xs ${getStatusColor(assessment.status)} text-white`}>
                            {getStatusIcon(assessment.status)}
                            <span className="ml-1">{assessment.status}</span>
                          </Badge>
                        </div>
                        <div className="flex items-center space-x-4 mt-1 text-sm text-gray-600 dark:text-gray-400">
                          <span className="flex items-center">
                            <FileText className="h-3 w-3 mr-1" />
                            {assessment.assessment_id}
                          </span>
                          <span>{assessment.assessor}</span>
                          {assessment.organization && <span>{assessment.organization}</span>}
                        </div>
                      </div>
                      <div className="text-right text-sm text-gray-600 dark:text-gray-400">
                        <div>
                          {startDate.toLocaleDateString()} - {endDate.toLocaleDateString()}
                        </div>
                        <div className="font-medium">{Math.round(progress)}% Complete</div>
                      </div>
                    </div>

                    {/* Gantt Bar */}
                    <div className="relative h-8 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
                      {/* Timeline Background */}
                      <div className="absolute inset-0 flex">
                        {timelineMarkers.map((marker, markerIndex) => (
                          <div
                            key={markerIndex}
                            className="absolute w-px h-full bg-gray-300 dark:bg-gray-600 opacity-30"
                            style={{ left: `${marker.position}%` }}
                          />
                        ))}
                      </div>

                      {/* Assessment Bar */}
                      <div
                        className={`absolute top-0 h-full ${getStatusColor(assessment.status)} rounded-full 
                          shadow-sm transition-all duration-1000 ease-out ${animationEnabled ? "animate-in slide-in-from-left" : ""}`}
                        style={{
                          left: `${Math.max(0, startPosition)}%`,
                          width: `${Math.min(width, 100 - Math.max(0, startPosition))}%`,
                          animationDelay: animationEnabled ? `${index * 150 + 300}ms` : "0ms",
                          animationDuration: animationEnabled ? "800ms" : "0ms",
                        }}
                      >
                        {/* Progress Fill */}
                        <div
                          className="h-full bg-white/30 rounded-full transition-all duration-1000 ease-out"
                          style={{
                            width: `${progress}%`,
                            animationDelay: animationEnabled ? `${index * 150 + 600}ms` : "0ms",
                          }}
                        />

                        {/* Progress Text */}
                        <div className="absolute inset-0 flex items-center justify-center">
                          <span className="text-xs font-medium text-white drop-shadow-sm">{Math.round(progress)}%</span>
                        </div>
                      </div>

                      {/* Current Date Indicator */}
                      {(() => {
                        const now = new Date()
                        const nowPosition = ((now.getTime() - timelineStart.getTime()) / timelineDuration) * 100
                        if (nowPosition >= 0 && nowPosition <= 100) {
                          return (
                            <div
                              className="absolute top-0 w-0.5 h-full bg-red-500 z-10"
                              style={{ left: `${nowPosition}%` }}
                            >
                              <div className="absolute -top-1 -left-1 w-2 h-2 bg-red-500 rounded-full"></div>
                            </div>
                          )
                        }
                        return null
                      })()}
                    </div>

                    {/* Duration Info */}
                    <div className="flex justify-between items-center mt-2 text-xs text-gray-500 dark:text-gray-400">
                      <span>
                        Duration: {Math.ceil((endDate.getTime() - startDate.getTime()) / (1000 * 60 * 60 * 24))} days
                      </span>
                      <span>
                        {assessment.priority && (
                          <Badge variant="outline" className="text-xs">
                            {assessment.priority} Priority
                          </Badge>
                        )}
                      </span>
                    </div>
                  </div>
                )
              })}
            </div>

            {/* Legend */}
            <div className="flex flex-wrap items-center justify-center gap-4 pt-4 border-t border-white/10">
              <div className="flex items-center space-x-2 text-sm">
                <div className="w-3 h-3 bg-green-500 rounded"></div>
                <span>Completed</span>
              </div>
              <div className="flex items-center space-x-2 text-sm">
                <div className="w-3 h-3 bg-blue-500 rounded"></div>
                <span>In Progress</span>
              </div>
              <div className="flex items-center space-x-2 text-sm">
                <div className="w-3 h-3 bg-yellow-500 rounded"></div>
                <span>On Hold</span>
              </div>
              <div className="flex items-center space-x-2 text-sm">
                <div className="w-3 h-3 bg-gray-500 rounded"></div>
                <span>Planned</span>
              </div>
              <div className="flex items-center space-x-2 text-sm">
                <div className="w-0.5 h-4 bg-red-500"></div>
                <span>Current Date</span>
              </div>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  )
}
