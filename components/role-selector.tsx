"use client"

import { useState } from "react"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import { Crown, Cpu, Shield, User } from "lucide-react"

export type UserRole = "ceo" | "cto" | "ciso"

interface RoleOption {
  value: UserRole
  label: string
  icon: React.ComponentType<any>
  description: string
  color: string
}

const roleOptions: RoleOption[] = [
  {
    value: "ceo",
    label: "Chief Executive Officer",
    icon: Crown,
    description: "Executive oversight and business metrics",
    color: "text-yellow-400 bg-yellow-500/10"
  },
  {
    value: "cto",
    label: "Chief Technology Officer",
    icon: Cpu,
    description: "Technology infrastructure and innovation",
    color: "text-blue-400 bg-blue-500/10"
  },
  {
    value: "ciso",
    label: "Head of Information Security",
    icon: Shield,
    description: "Security operations and compliance",
    color: "text-red-400 bg-red-500/10"
  }
]

interface RoleSelectorProps {
  selectedRole: UserRole
  onRoleChange: (role: UserRole) => void
  className?: string
}

export function RoleSelector({ selectedRole, onRoleChange, className }: RoleSelectorProps) {
  const selectedRoleOption = roleOptions.find(option => option.value === selectedRole)

  return (
    <div className={className}>
      <div className="flex items-center gap-3 mb-4">
        <div className="flex items-center gap-2">
          <User className="h-5 w-5 text-cyan-400" />
          <span className="text-lg font-semibold text-white">Dashboard View</span>
        </div>
        <Select value={selectedRole} onValueChange={onRoleChange}>
          <SelectTrigger className="w-64 glass-card text-cyan-300 border-cyan-500/50">
            <SelectValue>
              {selectedRoleOption && (
                <div className="flex items-center gap-2">
                  <selectedRoleOption.icon className="h-4 w-4" />
                  <span>{selectedRoleOption.label}</span>
                </div>
              )}
            </SelectValue>
          </SelectTrigger>
          <SelectContent className="bg-slate-800 border-slate-600">
            {roleOptions.map((option) => {
              const Icon = option.icon
              return (
                <SelectItem
                  key={option.value}
                  value={option.value}
                  className="text-white hover:bg-slate-700 focus:bg-slate-700"
                >
                  <div className="flex items-center gap-3 py-2">
                    <div className={`p-2 rounded-full ${option.color}`}>
                      <Icon className="h-4 w-4" />
                    </div>
                    <div>
                      <div className="font-medium">{option.label}</div>
                      <div className="text-sm text-slate-400">{option.description}</div>
                    </div>
                  </div>
                </SelectItem>
              )
            })}
          </SelectContent>
        </Select>
      </div>

      {selectedRoleOption && (
        <Badge variant="outline" className={`${selectedRoleOption.color} border-current`}>
          <selectedRoleOption.icon className="h-3 w-3 mr-1" />
          {selectedRoleOption.label}
        </Badge>
      )}
    </div>
  )
}
