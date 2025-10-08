"use client";
import { ThemeToggle } from "@/components/theme-toggle";
import { Logo } from "./logo";
import { MainSearch } from "./Search";
import { ProfileDropdown } from "./ProfileDropdown";
import { NotificationIcon } from "./NotificationIcon";
import { Menu } from "lucide-react";
import { Button } from "../ui/button";

export function Header({ collapsed, setCollapsed }: { collapsed: boolean, setCollapsed: (c: boolean) => void }) {
  return (
    <header className="flex h-16 items-center justify-between bg-white dark:bg-[#19222c] backdrop-blur-sm border-white/10 text-card-foreground shadow-sm z-10">
      <div className={`${collapsed ? 'w-[4rem]' : 'w-1/6' } transition-all duration-500 ease-in-out flex items-center justify-center h-16 px-4 relative  bg-[linear-gradient(#17228A)]`}>
          <Logo
            collapsed={collapsed}
            width={50}
            height={50}
            name="GRC Sphere"
          />
      </div>
      <Button
        variant="ghost"
        size="sm"
        onClick={() => setCollapsed(!collapsed)}
        className="m-3"
      >
        <Menu className="h-5 w-5" />
      </Button>

      <MainSearch />
      <div className="flex items-center space-x-4 px-4">
        <ThemeToggle />
        <NotificationIcon />
        <ProfileDropdown />
      </div>
    </header>
  );
}
