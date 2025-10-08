"use client";

import { createContext, useContext, useState,useMemo, useEffect } from "react";
import type { User } from "@/lib/types/user";
import type { SidebarItem } from "@/lib/types/SidebarItem";



type Permission = {
  pageId: string;
  pageName: string;
  pagePath: string;
  module: string;
  canRead: boolean;
  canCreate: boolean;
  canUpdate: boolean;
  canDelete: boolean;
};

// type MenuPage = {
//   id: string;
//   name: string;
//   path: string;
// };

// type MenuModule = {
//   module: string;
//   pages: MenuPage[];
// }



type SessionContextType = {
  sessionUser: User | null;
  permissionMap: Permission[];
  menuList: SidebarItem[];
  setSession: (user: User | null, perms: Permission[], menu: SidebarItem[]) => void;
  hasPermission: (path: string, action: "read" | "create" | "update" | "delete") => boolean;
};

const SessionContext = createContext<SessionContextType | undefined>(undefined);

export function SessionProvider({ initialSession, children }: { initialSession?: any, children: React.ReactNode }) {
  const [sessionUser, setSessionUser] = useState<User | null>(initialSession);
  const [permissionMap, setPermissionMap] = useState<Permission[]>(initialSession?.permissionMap ?? []);
  const [menuList, setMenuList] = useState<SidebarItem[]>(initialSession?.menuList ?? []);

  useEffect(() => {
    const stored = localStorage.getItem("session");
    if (stored) {
      const { user, permissionMap, menuList } = JSON.parse(stored);
      setSessionUser(user);
      setPermissionMap(permissionMap);
      setMenuList(menuList);
    }
  }, [])
  
  const setSession = (user: User | null, perms: Permission[], menu: SidebarItem[]) => {
    setSessionUser(user);
    setPermissionMap(perms);
    setMenuList(menu);
    localStorage.setItem("session", JSON.stringify({ user, permissionMap: perms, menuList: menu }));

  }

  const clearSession = () => {
    setSessionUser(null);
    setPermissionMap([]);
    setMenuList([]);
  }

  const hasPermission = (path: string, action: "read" | "create" | "update" | "delete") => {
    const page = permissionMap.find((p) => p.pagePath === path);
    if (!page) return false;
    switch (action) {
      case "read": return page.canRead;
      case "create": return page.canCreate;
      case "update": return page.canUpdate;
      case "delete": return page.canDelete;
      default: return false;
    }
  };

  const contextValue = useMemo(
    () => ({ sessionUser, permissionMap, menuList, setSession, hasPermission }),
    [sessionUser, permissionMap, menuList]
  );

  return (
    <SessionContext.Provider value={contextValue}>
      {children}
    </SessionContext.Provider>
  );
}

export function useSession() {
  const ctx = useContext(SessionContext);
  if (!ctx) throw new Error("useSession must be used within SessionProvider");
  return ctx;
}