import { createContext } from "react";
import type { SubscribeFn } from "./types";

export type RealtimeNotificationsContextType = {
  isConnected: boolean;
  isConnecting: boolean;
  connectionError: string | null;
  connectionId: string | null;
  subscribe: SubscribeFn;
};

export const RealtimeNotificationsContext = createContext<RealtimeNotificationsContextType | null>(null);
