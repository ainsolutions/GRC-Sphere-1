"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Badge } from "@/components/ui/badge"
import * as RefLucideReact from "lucide-react"
import { Logo } from "../Header/logo"
import logo from "./companyLogo.png"
import { useSession } from "@/components/session-provider"
import { SidebarItem } from "@/lib/types/SidebarItem"



const OldSidebarItems: SidebarItem[] = [
  {
    title: "Dashboard",
    href: "/",
    icon: RefLucideReact.Home,
  },
  {
    title: "Information Assets",
    href: "/assets",
    icon: RefLucideReact.Database,
  },
  {
    title: "Risk Management",
    icon: RefLucideReact.Shield,
    children: [
      {
        title: "Sphere AI Risk",
        href: "/risks/sphere-ai-risk",
        icon: RefLucideReact.FileText,
      },
      {
        title: "ISO 27001",
        href: "/risks/iso27001",
        icon: RefLucideReact.Shield,
      },
      {
        title: "NIST CSF",
        href: "/risks/nist-csf",
        icon: RefLucideReact.Target,
      },
      {
        title: "FAIR Analysis",
        href: "/risks/fair",
        icon: RefLucideReact.TrendingUp,
      },
      {
        title: "Portfolio Analysis",
        href: "/risks/fair/portfolio",
        icon: RefLucideReact.BarChart3,
      },
      {
        title: "Technology Risk",
        href: "/risks/technology",
        icon: RefLucideReact.Cpu,
      },
      {
        title: "Threats",
        href: "/risks/threats",
        icon: RefLucideReact.AlertTriangle,
      },
    ],
  },
  {
    title: "Third Party Risk",
    href: "/third-party-risk",
    icon: RefLucideReact.Briefcase,
  },
  {
    title: "IS Assessments",
    href: "/assessments",
    icon: RefLucideReact.FileText,
  },
  {
    title: "IS Findings",
    href: "/findings",
    icon: RefLucideReact.Eye,
  },
  {
    title: "IS Compliance",
    href: "/compliance",
    icon: RefLucideReact.BookOpen,
  },
  {
    title: "Policy Management",
    href: "/policies",
    icon: RefLucideReact.FileText,
  },
  {
    title: "Cyber Security Maturity",
    href: "/cyber-maturity",
    icon: RefLucideReact.Shield,
  },
  {
    title: "Governance",
    icon: RefLucideReact.Building2,
    children: [
      {
        title: "Dashboard",
        href: "/governance/dashboard",
        icon: RefLucideReact.BarChart3,
      },
      {
        title: "KPIs",
        href: "/governance/kpis",
        icon: RefLucideReact.TrendingUp,
      },
      {
        title: "Budget",
        href: "/governance/budget",
        icon: RefLucideReact.DollarSign,
      },
      {
        title: "Documents",
        href: "/governance/documents",
        icon: RefLucideReact.FileText,
      },
      {
        title: "Controls",
        href: "/governance/controls",
        icon: RefLucideReact.Shield,
      },
    ],
  },
  {
    title: "Vulnerabilities",
    href: "/vulnerabilities",
    icon: RefLucideReact.Bug,
  },
  {
    title: "Risk Incidents",
    href: "/incidents",
    icon: RefLucideReact.AlertCircle,
  },
  {
    title: "Audit Management",
    icon: RefLucideReact.Activity,
    children: [
      {
        title: "Audit Universe",
        href: "/audit/universe",
        icon: RefLucideReact.FileText,
      },
      {
        title: "Audit Planning",
        href: "/audit/planning",
        icon: RefLucideReact.Calendar,
      },
      {
        title: "Risk & Control Repository",
        href: "/audit/controls",
        icon: RefLucideReact.Shield,
      },
      {
        title: "Controls Testing",
        href: "/audit/testing",
        icon: RefLucideReact.Target,
      },
      {
        title: "Audit Reports",
        href: "/audit/reports",
        icon: RefLucideReact.FileText,
      },
      {
        title: "Audit Trail",
        href: "/audit",
        icon: RefLucideReact.Activity,
      },
    ],
  },
  {
    title: "Analytics",
    href: "/analytics",
    icon: RefLucideReact.BarChart3,
  },
  {
    title: "AI Analysis",
    href: "/ai-analysis",
    icon: RefLucideReact.Zap,
  },
  {
    title: "Settings",
    href: "/settings",
    icon: RefLucideReact.Settings,
  },
]



  function hydrateIcons(items: any[]): any {
    return items.map(it => ({
      ...it,
      icon: (RefLucideReact as any)[it.icon] || RefLucideReact.FileText, // fallback
      children: it.children ? hydrateIcons(it.children) : undefined,
    }));
  }

export function Sidebar({ collapsed }: { collapsed: boolean }) {
  const pathname = usePathname()
  const [expandedItems, setExpandedItems] = useState<string[]>([])
  
  const { menuList } = useSession();

  const sidebarItems: SidebarItem[] = hydrateIcons(menuList) 

  useEffect(() => {
    const pathSegments = pathname.split("/").filter(Boolean)
    const newExpandedItems: string[] = []

    sidebarItems.forEach((item) => {
      if (item.children) {
        const hasActiveChild = item.children.some((child) => child.href === pathname)
        if (hasActiveChild) {
          newExpandedItems.push(item.title)
        }
      }
    })

    setExpandedItems(newExpandedItems)
  }, [pathname])

  const toggleExpanded = (title: string) => {
    setExpandedItems((prev) => (prev.includes(title) ? prev.filter((item) => item !== title) : [...prev, title]))
  }

  const isActive = (href: string) => {
    if (href === "/") {
      return pathname === "/"
    }
    return pathname.startsWith(href)
  }

  const renderSidebarItem = (item: SidebarItem, level = 0) => {
    
    const hasChildren = item.children && item.children.length > 0
    const isExpanded = expandedItems.includes(item.title)
    const isItemActive = item.href ? isActive(item.href) : false

    if (hasChildren) {
      return (
        <div key={item.title} className="space-y-1">
          <Button
            variant="ghost"
            size={collapsed ? 'sm' : 'default'}
            className={cn(
              "w-full justify-start text-left h-9 group relative overflow-hidden rounded-none text-gray-300 hover:text-gray-200 hover:bg-transparent dark:hover:text-gray-200 dark:hover:bg-transparent font-light hover:scale-105 transition-all duration-300",
              level > 0 && "w-[calc(100%-1rem)]",
              collapsed ? 'justify-center' : 'justify-start'

            )}
            onClick={() => toggleExpanded(item.title)}
          >
            <item.icon className={cn("h-4 w-4 shrink-0 icon-glow transition-all duration-300")} />
            {!collapsed && <span className={cn("truncate relative z-10", isExpanded && "scale-105")}>{item.title}</span>}
            {item.badge && (
              <Badge variant="secondary" className="ml-auto h-5 px-1.5 text-xs relative z-10">
                {item.badge}
              </Badge>
            )}
            {isExpanded ? (
              <RefLucideReact.ChevronDown className="ml-auto h-4 w-4 shrink-0 relative z-10 transition-transform duration-1200 animate-pulse" />
            ) : (
              <RefLucideReact.ChevronRight className="ml-auto h-4 w-4 shrink-0 relative z-10 transition-transform duration-1200 animate-pulse" />
            )}
          </Button>
          {isExpanded && (
            <div className="animate-in slide-in-from-top-2 duration-300">
              {item.children?.map((child) => renderSidebarItem(child, level + 1))}
            </div>
          )}
        </div>
      )
    }

    return (
      <Link key={item.title} href={item.href || "#"}>
        <Button
          variant="ghost"
          className={cn(
            "w-full justify-start text-left h-9 group relative overflow-hidden rounded-none text-gray-300 hover:text-gray-200 hover:bg-transparent dark:hover:text-gray-200 dark:hover:bg-transparent font-light hover:scale-105 transition-all duration-300",
            isItemActive
            && "border-l-2 border-l-white pl-4 text-white dark:text-white hover:scale-100 hover:text-white dark:hover:text-white",
            level > 0 && "ml-4 w-[calc(100%-1rem)]",
            collapsed ? 'justify-center' : 'justify-start'
          )}
        >
          <item.icon
            className={cn(
              "h-4 w-4 shrink-0 transition-all duration-1200 relative z-10 animate-pulse"
            )}
          />
          {!collapsed && <span className="truncate relative z-10">{item.title}</span>}
          {item.badge && (
            <Badge variant="secondary" className="ml-auto h-7 px-1.5 text-xs relative z-10">
              {item.badge}
            </Badge>
          )}
        </Button>
      </Link>
    )
  }

  return (
    <aside className="h-[calc(100vh-4rem)] bg-[linear-gradient(#17228A,#2359a8_40%,#2359a8)]">
      <div className="relative z-20 flex flex-col h-full">
        {/* Navigation */}
        <ScrollArea className="flex-1 py-4 pr-3">
          <div className="space-y-2">{sidebarItems.map((item) => renderSidebarItem(item))}</div>
        </ScrollArea>

        {/* Footer */}
        {/* <div className="p-4 border-t border-white/20 relative">
          <div className="absolute inset-0 bg-gradient-to-r from-green-500/10 via-blue-500/10 to-purple-500/10 backdrop-blur-sm"></div>
          <div className="flex items-center space-x-2 text-xs text-gray-400 relative z-10">
            <RefLucideReact.Activity className="h-3 w-3 text-green-400 animate-pulse" />
            <span>System Status: Online</span>
            <div className="ml-auto flex space-x-1">
              <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
              <div className="w-2 h-2 bg-blue-400 rounded-full animate-pulse" style={{ animationDelay: "0.5s" }}></div>
              <div className="w-2 h-2 bg-purple-400 rounded-full animate-pulse" style={{ animationDelay: "1s" }}></div>
            </div>
          </div>
        </div> */}
        {!collapsed && <div className="flex items-center p-2 border-t border-white/20 relative justify-center">
          <div className="text-white text-xs">Powered by</div>
          <Logo
            collapsed={collapsed}
            width={25}
            height={25}
            name="bserveri"
          />
        </div>
        }
      </div>
    </aside>
  )
}
