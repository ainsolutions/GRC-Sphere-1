"use client"

import { createContext, useContext } from 'react';
import type { User } from "@/lib/types/user";

interface SessionContextType {
  user: User | null;
}

const SessionContext = createContext<SessionContextType>({ user: null });

export function SessionProvider({ user, children }: { user: User | null; children: React.ReactNode }) {
  return <SessionContext.Provider value={{ user }}>{children}</SessionContext.Provider>;
}

export function useSession() {
  return useContext(SessionContext);
}