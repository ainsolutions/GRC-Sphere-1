import React from "react";
import Image from 'next/image'
import logo from "./logo.png";

// import { Shield } from "lucide-react";

export const Logo = ({ collapsed, width, height, name }: { collapsed: boolean, width: number, height: number, name: string }) => {
    return (
        <div className={`${collapsed ? 'px-0' : 'px-4'} flex items-center justify-center h-16 border-b border-white/20 relative`}>
          <div className="flex items-center space-x-2 relative z-10">
            {/* <Shield className={`${collapsed ? 'h-6 w-6' : 'h-8 w-8'} text-blue-400 icon-glow animate-pulse`} /> */}
            <Image
                src={logo}
                width={width}
                height={height}
                alt="logo"
                className="animate-pulse"
            />
            {!collapsed && 
              <span className={`${collapsed ? 'opacity-0' : 'opacity-100'} transition-opacity duration-300 ease-in-out text-xl font-bold bg-gradient-to-r from-blue-400 via-purple-400 to-pink-400 bg-clip-text text-transparent`}>
                {name}
              </span>
            }
          </div>
        </div>
    );
}