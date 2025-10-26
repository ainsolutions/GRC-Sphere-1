"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

import { SystemStatus } from "@/components/system-status"
import ConversationChatbot from "@/components/conversation-chatbot"
import { CEODashboard } from "@/components/dashboards/ceo-dashboard"
import { CISODashboard } from "@/components/dashboards/ciso-dashboard"
import { CTODashboard } from "@/components/dashboards/cto-dashboard"
import {
  Shield,
  Database,
  AlertTriangle,
  FileText,
  Activity,
  BarChart3,
  TrendingUp,
  CheckCircle,
  Target,
  Crown,
  Users,
  Settings,
} from "lucide-react"
import Link from "next/link"

import { useSession } from "@/components/session-provider";

export default function DashboardClient() {
  const [user, setUser] = useState<any>(null);
  const [dashboardType, setDashboardType] = useState<string>("ceo");
  const [metrics, setMetrics] = useState<any>(null);
  const [refreshing, setRefreshing] = useState(false);
  const router = useRouter();
  const { sessionUser } = useSession();

  // Fetch dashboard metrics
  const fetchMetrics = async () => {
    setRefreshing(true);
    try {
      const response = await fetch("/api/dashboard/metrics");
      if (response.ok) {
        const data = await response.json();
        setMetrics(data);
      } else {
        console.error("Failed to fetch metrics");
      }
    } catch (error) {
      console.error("Error fetching metrics:", error);
    } finally {
      setRefreshing(false);
    }
  };

  useEffect(() => {
    if (sessionUser) {
      fetchMetrics();
    }
  }, [sessionUser]);

  const handleLogout = async () => {
    try {
      const response = await fetch("/api/auth/logout", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        }
      });
      router.push("/login")
    } catch (error) {

    }
  };

  if (!sessionUser) {
    router.push("/login");
    return;
  }

  return Dashboard();
}

function Dashboard() {
  const [dashboardType, setDashboardType] = useState<string>("ceo");
  const [metrics, setMetrics] = useState<any>(null);
  const [refreshing, setRefreshing] = useState(false);

  // Fetch dashboard metrics
  const fetchMetrics = async () => {
    setRefreshing(true);
    try {
      const schemaId = localStorage.getItem("schema_id");
      const session = localStorage.getItem("session_data");

      const response = await fetch("/api/dashboard/metrics", {
        headers: {
          "x-schema-id": schemaId || "",
          "x-current-session": session || "{}",
        },
        credentials: "include",
      });

      if (!response.ok) {
        const errText = await response.text();
        console.error("Failed to fetch metrics:", response.status, errText);
        return;
      }

      const data = await response.json();
      setMetrics(data);
    } catch (error) {
      console.error("Error fetching metrics:", error);
    } finally {
      setRefreshing(false);
    }
  };

  useEffect(() => {
    fetchMetrics();
  }, []);

  const renderDashboard = () => {
    switch (dashboardType) {
      case "ceo":
        return <CEODashboard metrics={metrics} onRefresh={fetchMetrics} refreshing={refreshing} />;
      case "ciso":
        return <CISODashboard metrics={metrics} onRefresh={fetchMetrics} refreshing={refreshing} />;
      case "cto":
        return <CTODashboard metrics={metrics} onRefresh={fetchMetrics} refreshing={refreshing} />;
      default:
        return <CEODashboard metrics={metrics} onRefresh={fetchMetrics} refreshing={refreshing} />;
    }
  };

  return (
    <main className="flex-1">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Dashboard Header with Dropdown */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold bg-gradient-to-r from-purple-600 to-cyan-600 bg-clip-text text-transparent">
              Executive Dashboard Suite
            </h1>
            <p className="mt-2 text-slate-600 dark:text-slate-300">
              Comprehensive view of your governance, risk, and compliance posture
            </p>
          </div>
          <div className="flex items-center gap-4">
            <Select value={dashboardType} onValueChange={setDashboardType}>
              <SelectTrigger className="w-48">
                <SelectValue placeholder="Select Dashboard" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="ceo">
                  <div className="flex items-center gap-2">
                    <Crown className="h-4 w-4 text-yellow-500" />
                    CEO Dashboard
                  </div>
                </SelectItem>
                <SelectItem value="ciso">
                  <div className="flex items-center gap-2">
                    <Shield className="h-4 w-4 text-red-500" />
                    CISO Dashboard
                  </div>
                </SelectItem>
                <SelectItem value="cto">
                  <div className="flex items-center gap-2">
                    <Settings className="h-4 w-4 text-blue-500" />
                    CTO Dashboard
                  </div>
                </SelectItem>
              </SelectContent>
            </Select>
            <SystemStatus />
          </div>
        </div>

        {/* Render Selected Dashboard */}
        {renderDashboard()}
      </div>
      <ConversationChatbot autoOpen={true} />
    </main>
  );
}