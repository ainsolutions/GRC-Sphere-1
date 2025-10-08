"use client"

import type React from "react"
import { Button } from "./button"


export function ChatbotButton({ className, onClick, icon } : {className: string, onClick: any, icon: any}) {
    return (
        <div className={`fixed bottom-6 right-6 z-50 ${className}`}>
            <Button
                onClick={() => onClick(true)}
                className="h-20 w-20 rounded-full shadow-lg animate-bounce hover:animate-pulse"
                style={{
                    backgroundImage:
                        `radial-gradient(circle at center, #17228A 0%, #17228A 40%, transparent 41%),
                conic-gradient(
                  #FFC107 0deg 90deg,
                  #FF9800 90deg 180deg,
                  #2196F3 180deg 270deg,
                  #4CAF50 270deg 360deg
                )`,
                    backgroundSize: "100% 100%",
                    backgroundPosition: "center",
                    boxShadow: "inset 0 0 14px rgba(0,0,0,0.45), 0 8px 20px rgba(0,0,0,0.18)",
                    border: "1px solid rgba(255,255,255,0.06)"
                }}
                size="icon"
            >
                {icon}
            </Button>
        </div>
    )
}