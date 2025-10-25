import React from "react";
import { LogOut } from "lucide-react";
import router from "next/router";
import { Button } from "../ui/button";

export const LogoutButton = () => {

  const handleLogout = async () => {
    try {
      const response = await fetch("/api/auth/logout", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
      });
      
      localStorage.removeItem("session");
      window.location.href = '/login';
    } catch (error) { 
      window.location.href = '/login';
    }
  };


    return (
        <Button onClick={handleLogout} variant="destructive">
            <LogOut className="mr-2 h-4 w-4" />
            <span>Log out</span>
        </Button>
    );
}