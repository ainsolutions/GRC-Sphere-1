"use client"

import React, { useEffect, useState } from "react"
import { Header } from "@/components/Header/header"
import { Sidebar } from "@/components/Sidebar/sidebar"
import { Button } from "@/components/ui/button"
import { Plus } from "lucide-react"
import { useSession } from "@/components/session-provider"
import { usePathname } from "next/navigation"

export default function Content({ children }: { children: React.ReactNode }) {

    const [collapsed, setCollapsed] = useState(false)
    const { sessionUser } = useSession();
    const pathname = usePathname();

    if (sessionUser != null && pathname.includes("/login") != true) {
        return (
            <div className="h-screen flex flex-col overflow-hidden">
                {pathname.includes("/login") != true &&
                    <Header collapsed={collapsed} setCollapsed={setCollapsed} />
                }
                <div className="flex flex-1">
                    {/* Sidebar */}
                    <div
                        className={`
                            transition-[width] duration-500 ease-in-out
                            origin-left
                            ${collapsed ? "w-[4rem]" : "w-1/6"}
                            overflow-hidden
                            backdrop-blur-sm border-white/10 text-card-foreground shadow-sm z-100
                        `}
                    >
                        <Sidebar collapsed={collapsed} />
                    </div>

                    {/* Main content */}
                    <main
                        className={`
                            bg-[#f5f7fb] dark:bg-[#19222c]
                            text-black dark:text-white
                            flex-1 transition-all duration-500 ease-in-out
                            ${collapsed ? "flex-1" : "w-5/6"}
                            overflow-y-auto overflow-x-hidden h-[calc(100vh-4rem)] p-6
                        `}
                    >
                        {children}
                    </main>
                </div>
            </div>
        )
    } else {
        return children
    }
}
